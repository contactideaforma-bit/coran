/* Côté serveur de l'assistant IA (routes /api/ia/*).
 *
 * Pas de base de données : Stripe est la source de vérité de l'abonnement,
 * Upstash Redis (déjà utilisé pour les notifications) garde les sessions,
 * les liens de connexion, le cache de statut et les quotas.
 *
 * Clés Redis :
 *   ia:session:<id>            → { email, client, abonnement }   (180 jours)
 *   ia:lien:<token>            → email                           (15 min)
 *   ia:statut:<abonnement>     → "actif" | "inactif"             (6 h)
 *   ia:quota:<email>:<jour>    → nombre de questions du jour     (2 jours)
 *   ia:gratuit:<anonyme>       → questions gratuites consommées   (1 an)
 *
 * Variables d'environnement (Vercel → Settings → Environment Variables) :
 *   STRIPE_SECRET_KEY        clé secrète Stripe (sk_live_…)
 *   RESEND_API_KEY           clé Resend (liens de connexion)
 *   IA_EMAIL_EXPEDITEUR      ex. "My Easy Coran <assistant@myeasycoran.fr>"
 *   ANTHROPIC_API_KEY        clé API Anthropic
 *   IA_MODELE                (facultatif) modèle, défaut claude-sonnet-4-5
 *   NEXT_PUBLIC_URL_SITE     https://www.myeasycoran.fr
 *   NEXT_PUBLIC_LIEN_ABONNEMENT_IA   lien de paiement Stripe (abonnement 2,99 €)
 *   NEXT_PUBLIC_LIEN_SOUTIEN          lien de paiement Stripe (montant libre)
 *   UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN (déjà présents)
 */

import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import { PROMPT_SYSTEME } from "@/data/ia";

export const QUOTA_PAR_JOUR = 30;
export const QUESTIONS_GRATUITES = 3;
export const COOKIE_SESSION = "ia_session";
const COOKIE_ANONYME = "ia_anon";
const DUREE_SESSION = 180 * 24 * 3600;
const DUREE_ANONYME = 365 * 24 * 3600;

/* ===== Redis (REST Upstash) ===== */

export async function redis<T = unknown>(...commande: (string | number)[]): Promise<T> {
  const url = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL);
  const token = (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN);
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

/* ===== Stripe (API REST, sans SDK) ===== */

export async function stripe<T = unknown>(
  chemin: string,
  options: { methode?: "GET" | "POST"; corps?: Record<string, string> } = {}
): Promise<T> {
  const cle = process.env.STRIPE_SECRET_KEY;
  if (!cle) throw new Error("Stripe non configuré");
  const res = await fetch(`https://api.stripe.com/v1${chemin}`, {
    method: options.methode ?? "GET",
    headers: {
      Authorization: `Bearer ${cle}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: options.corps ? new URLSearchParams(options.corps).toString() : undefined,
    cache: "no-store",
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message ?? "Erreur Stripe");
  return json as T;
}

interface AbonnementStripe {
  id: string;
  status: string;
  customer: string;
}

const STATUTS_ACTIFS = new Set(["active", "trialing", "past_due"]);

/** Après le paiement : retrouve l'e-mail et l'abonnement depuis la session Checkout. */
export async function lireSessionCheckout(sessionId: string) {
  const s = await stripe<{
    customer: string | null;
    customer_details: { email: string | null } | null;
    subscription: string | null;
    status: string;
  }>(`/checkout/sessions/${encodeURIComponent(sessionId)}`);
  const email = s.customer_details?.email?.toLowerCase();
  if (!email || !s.subscription || !s.customer || s.status !== "complete") return null;
  return { email, client: s.customer, abonnement: s.subscription };
}

/** Cherche un abonnement actif à partir d'un e-mail (connexion sur un autre appareil). */
export async function trouverAbonnementParEmail(email: string) {
  const clients = await stripe<{ data: { id: string }[] }>(
    `/customers/search?query=${encodeURIComponent(`email:'${email.replace(/'/g, "")}'`)}&limit=5`
  );
  for (const c of clients.data) {
    const abos = await stripe<{ data: AbonnementStripe[] }>(
      `/subscriptions?customer=${c.id}&status=all&limit=10`
    );
    const actif = abos.data.find((a) => STATUTS_ACTIFS.has(a.status));
    if (actif) return { email, client: c.id, abonnement: actif.id };
  }
  return null;
}

/** Statut de l'abonnement, mis en cache 6 h. */
export async function abonnementActif(abonnement: string): Promise<boolean> {
  const cle = `ia:statut:${abonnement}`;
  const cache = await redis<string | null>("GET", cle);
  if (cache) return cache === "actif";
  let actif = false;
  try {
    const a = await stripe<AbonnementStripe>(`/subscriptions/${abonnement}`);
    actif = STATUTS_ACTIFS.has(a.status);
  } catch {
    actif = false;
  }
  await redis("SET", cle, actif ? "actif" : "inactif", "EX", 6 * 3600);
  return actif;
}

/** Lien vers le portail client Stripe (gérer / résilier l'abonnement). */
export async function lienPortail(client: string) {
  const p = await stripe<{ url: string }>("/billing_portal/sessions", {
    methode: "POST",
    corps: { customer: client, return_url: `${urlSite()}/ia` },
  });
  return p.url;
}

/* ===== Sessions (cookie) ===== */

export interface SessionIa {
  email: string;
  client: string;
  abonnement: string;
}

export function urlSite() {
  return (process.env.NEXT_PUBLIC_URL_SITE ?? "https://www.myeasycoran.fr").replace(/\/$/, "");
}

export async function creerSession(s: SessionIa) {
  const id = randomBytes(24).toString("hex");
  await redis("SET", `ia:session:${id}`, JSON.stringify(s), "EX", DUREE_SESSION);
  cookies().set(COOKIE_SESSION, id, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: DUREE_SESSION,
  });
}

export async function lireSession(): Promise<SessionIa | null> {
  const id = cookies().get(COOKIE_SESSION)?.value;
  if (!id || !/^[a-f0-9]{48}$/.test(id)) return null;
  const brut = await redis<string | null>("GET", `ia:session:${id}`);
  return brut ? (JSON.parse(brut) as SessionIa) : null;
}

export async function supprimerSession() {
  const id = cookies().get(COOKIE_SESSION)?.value;
  if (id) await redis("DEL", `ia:session:${id}`);
  cookies().delete(COOKIE_SESSION);
}

/* ===== Lien de connexion par e-mail (Resend) ===== */

export async function envoyerLienConnexion(
  email: string,
  destination: { route: string; sujet: string; bouton: string; service: string } = {
    route: "/api/ia/connexion",
    sujet: "Ton accès à l'assistant My Easy Coran",
    bouton: "Ouvrir l'assistant",
    service: "l'assistant IA",
  }
) {
  const token = randomBytes(24).toString("hex");
  await redis("SET", `ia:lien:${token}`, email, "EX", 15 * 60);
  const lien = `${urlSite()}${destination.route}?token=${token}`;
  const cle = process.env.RESEND_API_KEY;
  if (!cle) throw new Error("Resend non configuré");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${cle}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.IA_EMAIL_EXPEDITEUR ?? "My Easy Coran <assistant@myeasycoran.fr>",
      to: [email],
      subject: destination.sujet,
      html: `<p>Assalamu alaykum,</p>
<p>Voici ton lien de connexion à ${destination.service} de My Easy Coran (valable 15 minutes) :</p>
<p><a href="${lien}" style="display:inline-block;padding:12px 20px;background:#a07b26;color:#fff;border-radius:999px;text-decoration:none;font-weight:bold">${destination.bouton}</a></p>
<p>Si tu n'es pas à l'origine de cette demande, ignore simplement cet e-mail.</p>
<p>— My Easy Coran</p>`,
    }),
  });
  if (!res.ok) throw new Error("Envoi de l'e-mail impossible");
}

export async function consommerLien(token: string): Promise<string | null> {
  if (!/^[a-f0-9]{48}$/.test(token)) return null;
  const email = await redis<string | null>("GET", `ia:lien:${token}`);
  if (email) await redis("DEL", `ia:lien:${token}`);
  return email;
}

/* ===== Questions gratuites (sans abonnement, par appareil) ===== */

/** Identifiant anonyme de l'appareil (cookie), créé au premier passage. */
export function identifiantAnonyme(creer = true): string | null {
  const existant = cookies().get(COOKIE_ANONYME)?.value;
  if (existant && /^[a-f0-9]{32}$/.test(existant)) return existant;
  if (!creer) return null;
  const id = randomBytes(16).toString("hex");
  cookies().set(COOKIE_ANONYME, id, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: DUREE_ANONYME,
  });
  return id;
}

export async function gratuitesConsommees(anonyme: string) {
  const n = await redis<string | null>("GET", `ia:gratuit:${anonyme}`);
  return Number(n ?? 0);
}

export async function consommerGratuite(anonyme: string) {
  const cle = `ia:gratuit:${anonyme}`;
  const n = await redis<number>("INCR", cle);
  if (n === 1) await redis("EXPIRE", cle, DUREE_ANONYME);
  return n;
}

/* ===== Quota ===== */

function jourUtc() {
  return new Date().toISOString().slice(0, 10);
}

export async function questionsPosees(email: string) {
  const n = await redis<string | null>("GET", `ia:quota:${email}:${jourUtc()}`);
  return Number(n ?? 0);
}

export async function compterQuestion(email: string) {
  const cle = `ia:quota:${email}:${jourUtc()}`;
  const n = await redis<number>("INCR", cle);
  if (n === 1) await redis("EXPIRE", cle, 2 * 24 * 3600);
  return n;
}

/* ===== Appel du modèle ===== */

export interface MessageIa {
  role: "user" | "assistant";
  content: string;
}

export interface ReponseIa {
  reponse: string;
  versets: { s: number; v: number; pourquoi?: string }[];
  hadiths: { texte: string; recueil: string; numero?: string; grade: string }[];
  savants: { nom: string; avis: string }[];
  divergence?: string | null;
  hors_champ?: boolean;
  conseil?: string | null;
}

export async function interrogerModele(messages: MessageIa[]): Promise<ReponseIa> {
  const cle = process.env.ANTHROPIC_API_KEY;
  if (!cle) throw new Error("Anthropic non configuré");
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": cle,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.IA_MODELE ?? "claude-sonnet-4-5",
      max_tokens: 2000,
      system: PROMPT_SYSTEME,
      messages,
    }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error?.message ?? "Erreur du modèle");
  const texte: string = (json.content ?? [])
    .filter((b: { type: string }) => b.type === "text")
    .map((b: { text: string }) => b.text)
    .join("");
  return analyserReponse(texte);
}

/** Le modèle répond en JSON ; on tolère une clôture ```json … ``` ou du texte autour. */
function analyserReponse(texte: string): ReponseIa {
  const debut = texte.indexOf("{");
  const fin = texte.lastIndexOf("}");
  let brut: Partial<ReponseIa> = {};
  if (debut >= 0 && fin > debut) {
    try {
      brut = JSON.parse(texte.slice(debut, fin + 1));
    } catch {
      brut = {};
    }
  }
  const nombre = (x: unknown) => (typeof x === "number" && Number.isFinite(x) ? x : 0);
  return {
    reponse: typeof brut.reponse === "string" && brut.reponse.trim() ? brut.reponse : texte.trim(),
    versets: Array.isArray(brut.versets)
      ? brut.versets
          .map((x) => ({ s: nombre(x?.s), v: nombre(x?.v), pourquoi: x?.pourquoi }))
          .filter((x) => x.s >= 1 && x.s <= 114 && x.v >= 1)
          .slice(0, 6)
      : [],
    hadiths: Array.isArray(brut.hadiths)
      ? brut.hadiths.filter((h) => h && typeof h.texte === "string").slice(0, 5)
      : [],
    savants: Array.isArray(brut.savants)
      ? brut.savants.filter((s) => s && typeof s.nom === "string").slice(0, 5)
      : [],
    divergence: typeof brut.divergence === "string" ? brut.divergence : null,
    hors_champ: brut.hors_champ === true,
    conseil: typeof brut.conseil === "string" ? brut.conseil : null,
  };
}
