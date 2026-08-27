/* Côté serveur du Web Push (routes /api/push/*).
 *
 * Stockage : Upstash Redis via son API REST (pas de dépendance).
 *   - hash « abonnes »          : id → JSON Abonne
 *   - clé  « envoye:… »         : marqueur 24 h pour ne jamais envoyer deux fois
 *   - clé  « horaires:… »       : cache 36 h des horaires AlAdhan par ville/jour
 *
 * Variables d'environnement (Vercel → Settings → Environment Variables) :
 *   UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
 *   VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT (mailto:…)
 *   NEXT_PUBLIC_VAPID_PUBLIC_KEY (= VAPID_PUBLIC_KEY, côté client)
 *   CRON_SECRET (mot de passe du cron qui appelle /api/push/envoyer)
 */

import webpush from "web-push";
import type { ConfigPriere } from "./prieres";
import {
  NOMS_PRIERES,
  PRIERES_NOTIFIABLES,
  enMinutes,
  type Abonne,
  type PriereNotifiable,
} from "./rappels";

/* ===== Redis (REST Upstash) ===== */

async function redis<T = unknown>(...commande: (string | number)[]): Promise<T> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) throw new Error("Upstash non configuré");
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(commande),
    cache: "no-store",
  });
  const json = await res.json();
  if (!res.ok || json.error) throw new Error(json.error ?? "Erreur Redis");
  return json.result as T;
}

const HASH = "abonnes";

export const enregistrerAbonne = (a: Abonne) =>
  redis("HSET", HASH, a.id, JSON.stringify(a));

export const supprimerAbonne = (id: string) => redis("HDEL", HASH, id);

export async function lireAbonnes(): Promise<Abonne[]> {
  const brut = await redis<string[]>("HGETALL", HASH);
  const liste: Abonne[] = [];
  for (let i = 0; i + 1 < brut.length; i += 2) {
    try {
      liste.push(JSON.parse(brut[i + 1]));
    } catch {}
  }
  return liste;
}

export async function trouverParEndpoint(endpoint: string) {
  return (await lireAbonnes()).find((a) => a.abonnement.endpoint === endpoint);
}

/** Identifiant : 12 premiers octets du SHA-256 de l'endpoint (même règle que le client). */
export async function idDepuisEndpoint(endpoint: string) {
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(endpoint));
  return Array.from(new Uint8Array(hash).slice(0, 12))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Vrai si le marqueur n'existait pas encore (donc : à envoyer). */
async function premiereFois(cle: string) {
  const r = await redis<string | null>("SET", `envoye:${cle}`, "1", "NX", "EX", 86_400);
  return r === "OK";
}

/* ===== Heure locale d'un fuseau ===== */

function maintenantDans(fuseau: string) {
  let parties: Intl.DateTimeFormatPart[];
  try {
    parties = new Intl.DateTimeFormat("fr-FR", {
      timeZone: fuseau,
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      weekday: "short",
    }).formatToParts(new Date());
  } catch {
    return maintenantDans("Europe/Paris");
  }
  const v = (t: string) => parties.find((p) => p.type === t)?.value ?? "";
  const jours = ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"];
  return {
    date: `${v("year")}-${v("month")}-${v("day")}`,
    minutes: (Number(v("hour")) % 24) * 60 + Number(v("minute")),
    jourSemaine: jours.findIndex((j) => v("weekday").toLowerCase().startsWith(j)),
  };
}

/* ===== Horaires de prière (AlAdhan, avec cache) ===== */

interface HorairesServeur {
  fuseau: string;
  heures: Record<PriereNotifiable, string>;
}

const cacheLocal = new Map<string, HorairesServeur>();
const cacheFuseau = new Map<string, string>();

async function horairesDuJour(c: ConfigPriere): Promise<HorairesServeur> {
  const cleVille = `${c.ville}|${c.pays}|${c.methode}`;

  // Le « jour » dépend du fuseau de la ville : on le retient une fois pour
  // toutes, ce qui permet de mettre les horaires en cache par date locale.
  let fuseau = cacheFuseau.get(cleVille);
  if (!fuseau) {
    try {
      fuseau = (await redis<string | null>("GET", `fuseau:${cleVille}`)) ?? undefined;
    } catch {}
  }
  const cleJour = fuseau
    ? `horaires:${cleVille}|${maintenantDans(fuseau).date}`
    : null;
  if (cleJour) {
    const local = cacheLocal.get(cleJour);
    if (local) return local;
    try {
      const enRedis = await redis<string | null>("GET", cleJour);
      if (enRedis) {
        const h = JSON.parse(enRedis) as HorairesServeur;
        cacheLocal.set(cleJour, h);
        return h;
      }
    } catch {}
  }

  const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(
    c.ville
  )}&country=${encodeURIComponent(c.pays)}&method=${c.methode}`;
  const res = await fetch(url, { cache: "no-store" });
  const json = await res.json();
  if (!res.ok || json.code !== 200) throw new Error("Horaires indisponibles");
  const t = json.data.timings as Record<string, string>;
  const propre = (x: string) => x.split(" ")[0];
  const h: HorairesServeur = {
    fuseau: json.data.meta?.timezone ?? "Europe/Paris",
    heures: {
      fajr: propre(t.Fajr),
      dhuhr: propre(t.Dhuhr),
      asr: propre(t.Asr),
      maghrib: propre(t.Maghrib),
      isha: propre(t.Isha),
    },
  };
  cacheFuseau.set(cleVille, h.fuseau);
  const cle = `horaires:${cleVille}|${maintenantDans(h.fuseau).date}`;
  cacheLocal.set(cle, h);
  try {
    await redis("SET", `fuseau:${cleVille}`, h.fuseau);
    await redis("SET", cle, JSON.stringify(h), "EX", 36 * 3600);
  } catch {}
  return h;
}

/* ===== Envoi ===== */

interface Message {
  titre: string;
  corps: string;
  url: string;
  tag: string;
}

function configurerVapid() {
  const pub = process.env.VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  if (!pub || !priv) throw new Error("Clés VAPID manquantes");
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT ?? "mailto:contact.ideaforma@gmail.com",
    pub,
    priv
  );
}

/** Envoie ; renvoie false si l'abonnement est mort (à supprimer). */
async function pousser(a: Abonne, m: Message): Promise<boolean> {
  try {
    await webpush.sendNotification(
      a.abonnement as webpush.PushSubscription,
      JSON.stringify(m),
      { TTL: 600, urgency: "high" }
    );
    return true;
  } catch (e) {
    const code = (e as { statusCode?: number }).statusCode;
    if (code === 404 || code === 410) return false;
    console.error("push", a.id, code, (e as Error).message);
    return true;
  }
}

/** Fenêtre de tolérance : si le cron a raté une minute, on rattrape. */
const TOLERANCE = 4;

/** Une passe complète : à appeler chaque minute. */
export async function envoyerRappels() {
  configurerVapid();
  const abonnes = await lireAbonnes();
  const bilan = { abonnes: abonnes.length, envoyes: 0, supprimes: 0, erreurs: 0 };

  await Promise.all(
    abonnes.map(async (a) => {
      const messages: Message[] = [];

      // 1. Prières
      const prieresVoulues = PRIERES_NOTIFIABLES.filter((p) => a.notifs?.prieres?.[p]);
      if (a.priere && prieresVoulues.length) {
        try {
          const h = await horairesDuJour(a.priere);
          const { date, minutes } = maintenantDans(h.fuseau);
          const avance = a.notifs.avance ?? 0;
          for (const p of prieresVoulues) {
            const cible = enMinutes(h.heures[p]) - avance;
            const ecart = minutes - cible;
            if (ecart < 0 || ecart > TOLERANCE) continue;
            if (!(await premiereFois(`${a.id}:${date}:${p}`))) continue;
            messages.push(
              avance > 0
                ? {
                    titre: `${NOMS_PRIERES[p]} dans ${avance} min 🕌`,
                    corps: `${h.heures[p]} — ${a.priere.ville}`,
                    url: "/prieres",
                    tag: `priere-${p}`,
                  }
                : {
                    titre: `C'est l'heure de ${NOMS_PRIERES[p]} 🕌`,
                    corps: `${h.heures[p]} — ${a.priere.ville}`,
                    url: "/prieres",
                    tag: `priere-${p}`,
                  }
            );
          }
        } catch (e) {
          bilan.erreurs++;
          console.error("horaires", a.id, (e as Error).message);
        }
      }

      // 2. Rappels Coran programmés
      const { date, minutes, jourSemaine } = maintenantDans(a.fuseau);
      for (const r of a.notifs?.rappels ?? []) {
        if (!r.actif || !r.jours.includes(jourSemaine)) continue;
        const ecart = minutes - enMinutes(r.heure);
        if (ecart < 0 || ecart > TOLERANCE) continue;
        if (!(await premiereFois(`${a.id}:${date}:rappel:${r.id}`))) continue;
        messages.push({
          titre: "Rappel Coran 📖",
          corps: r.message,
          url: "/coran",
          tag: `rappel-${r.id}`,
        });
      }

      for (const m of messages) {
        const vivant = await pousser(a, m);
        if (!vivant) {
          await supprimerAbonne(a.id);
          bilan.supprimes++;
          break;
        }
        bilan.envoyes++;
      }
    })
  );

  return bilan;
}
