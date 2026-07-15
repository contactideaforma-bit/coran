import webpush from "web-push";
import { redis } from "@/lib/serveur/redis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/* Envoi des notifications de prière.
 * Appelé toutes les 5 minutes par un cron externe :
 *   GET /api/envoyer?secret=<CRON_SECRET>
 * Pour chaque abonnement : horaires du jour de sa ville (AlAdhan),
 * envoi si une prière vient de tomber (fenêtre de 6 min), avec
 * déduplication en Redis (1 notification max par prière et par jour). */

const PRIERES = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;

interface Abonnement {
  sub: { endpoint: string; keys: { p256dh: string; auth: string } };
  ville: string;
  pays: string;
  methode: number;
}

interface HorairesVille {
  timings: Record<string, string>;
  timezone: string;
}

/** "HH:MM" → minutes (tolère un suffixe type " (CET)"). */
const enMinutes = (t: string): number | null => {
  const m = t.match(/^(\d{1,2}):(\d{2})/);
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
};

const minutesLocales = (tz: string) => {
  const [h, m] = new Intl.DateTimeFormat("fr-FR", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  })
    .format(new Date())
    .split(":")
    .map(Number);
  return h * 60 + m;
};

const dateLocale = (tz: string) =>
  new Intl.DateTimeFormat("fr-CA", { timeZone: tz }).format(new Date());

export async function GET(req: Request) {
  const url = new URL(req.url);
  if (
    !process.env.CRON_SECRET ||
    url.searchParams.get("secret") !== process.env.CRON_SECRET
  ) {
    return Response.json({ erreur: "Non autorisé" }, { status: 401 });
  }
  const clePublique = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const clePrivee = process.env.VAPID_PRIVATE_KEY;
  if (!clePublique || !clePrivee) {
    return Response.json({ erreur: "Clés VAPID manquantes" }, { status: 500 });
  }
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT ?? "mailto:contact.ideaforma@gmail.com",
    clePublique,
    clePrivee
  );

  const cles = await redis<string[]>("smembers", "abos");
  const horairesParVille = new Map<string, HorairesVille | null>();
  let envoyes = 0;
  let supprimes = 0;

  for (const cle of cles) {
    const brut = await redis<string | null>("get", cle);
    if (!brut) {
      await redis("srem", "abos", cle);
      continue;
    }
    let abo: Abonnement;
    try {
      abo = JSON.parse(brut);
    } catch {
      continue;
    }

    // Horaires du jour pour cette ville (mis en cache par exécution)
    const cleVille = `${abo.ville}|${abo.pays}|${abo.methode}`;
    let h = horairesParVille.get(cleVille);
    if (h === undefined) {
      try {
        const res = await fetch(
          `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(
            abo.ville
          )}&country=${encodeURIComponent(abo.pays)}&method=${abo.methode}`,
          { cache: "no-store" }
        );
        const json = await res.json();
        h =
          json.code === 200
            ? {
                timings: json.data.timings,
                timezone: json.data.meta.timezone,
              }
            : null;
      } catch {
        h = null;
      }
      horairesParVille.set(cleVille, h);
    }
    if (!h) continue;

    const maintenant = minutesLocales(h.timezone);
    const jour = dateLocale(h.timezone);

    for (const p of PRIERES) {
      const minutes = enMinutes(h.timings[p] ?? "");
      if (minutes === null) continue;
      const ecart = maintenant - minutes;
      if (ecart < 0 || ecart >= 6) continue; // fenêtre du cron (5 min + marge)

      // Déduplication : une seule notification par prière et par jour
      const dejaEnvoye = await redis<string | null>(
        "set",
        `envoye:${cle}:${jour}:${p}`,
        "1",
        "EX",
        86400,
        "NX"
      );
      if (dejaEnvoye !== "OK") continue;

      try {
        await webpush.sendNotification(
          abo.sub,
          JSON.stringify({
            titre: `C'est l'heure de ${p === "Dhuhr" ? "Dhuhr" : p} 🕌`,
            corps: `${h.timings[p].slice(0, 5)} — ${abo.ville}`,
            tag: `priere-${p}`,
          })
        );
        envoyes++;
      } catch (e) {
        const statut = (e as { statusCode?: number }).statusCode;
        if (statut === 404 || statut === 410) {
          // Abonnement expiré ou révoqué : nettoyer
          await redis("del", cle);
          await redis("srem", "abos", cle);
          supprimes++;
        }
      }
    }
  }

  return Response.json({ abonnements: cles.length, envoyes, supprimes });
}
