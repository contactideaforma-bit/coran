/* Côté serveur du quiz vocal « Récitation » (routes /api/recitation/*).
 *
 * Principe : l'utilisateur récite un ou plusieurs versets, l'audio est
 * transcrit par OpenAI (Whisper) puis comparé mot à mot au texte du Coran.
 * Le coût de la transcription est payé par l'utilisateur, à la seconde
 * près, sans commission : un paiement Stripe crédite un solde de secondes
 * calculé à partir du montant réellement payé, moins les frais bancaires.
 *
 * Clés Redis :
 *   recit:session:<id>        → email                       (180 jours)
 *   recit:solde:<email>       → secondes restantes
 *   recit:paiement:<cs_id>    → "1" (paiement déjà crédité)
 *   recit:gratuit:<anonyme>   → essais gratuits consommés    (1 an)
 *   recit:historique:<email>  → 20 derniers résultats (liste JSON)
 *
 * Variables d'environnement :
 *   OPENAI_API_KEY                      clé API OpenAI (transcription)
 *   NEXT_PUBLIC_LIEN_CREDITS_RECITATION lien de paiement Stripe (pack de crédits)
 *   (+ STRIPE_SECRET_KEY, RESEND_API_KEY, Upstash : déjà présents pour l'assistant)
 */

import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import { redis, stripe, urlSite } from "@/lib/ia-serveur";

export const COOKIE_RECIT = "recit_session";
const COOKIE_ANONYME = "ia_anon"; // le même identifiant d'appareil que l'assistant
const DUREE_SESSION = 180 * 24 * 3600;

/* ===== Tarif, en toute transparence ===== */

/** Coût OpenAI de la transcription : 0,006 $/min ≈ 0,0055 €/min → en centimes par seconde. */
export const COUT_SECONDE_CENTIMES = 0.55 / 60;
/** Frais Stripe pour une carte européenne : 1,5 % + 0,25 €. */
export const FRAIS_STRIPE = { pourcent: 1.5, fixeCentimes: 25 };
/** Prix suggéré du pack (le lien Stripe fait foi) */
export const PRIX_PACK_CENTIMES = 200;
/** Essais offerts par appareil, et durée maximale d'un essai offert */
export const ESSAIS_GRATUITS = 3;
export const DUREE_MAX_SECONDES = 90;

/** Secondes créditées pour un montant payé (centimes), frais Stripe déduits. */
export function secondesPourMontant(montantCentimes: number) {
  const frais = Math.round((montantCentimes * FRAIS_STRIPE.pourcent) / 100 + FRAIS_STRIPE.fixeCentimes);
  const net = Math.max(0, montantCentimes - frais);
  return { frais, net, secondes: Math.floor(net / COUT_SECONDE_CENTIMES) };
}

/* ===== Sessions ===== */

export async function creerSessionRecit(email: string) {
  const id = randomBytes(24).toString("hex");
  await redis("SET", `recit:session:${id}`, email, "EX", DUREE_SESSION);
  cookies().set(COOKIE_RECIT, id, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: DUREE_SESSION,
  });
}

export async function emailSessionRecit(): Promise<string | null> {
  const id = cookies().get(COOKIE_RECIT)?.value;
  if (!id || !/^[a-f0-9]{48}$/.test(id)) return null;
  return redis<string | null>("GET", `recit:session:${id}`);
}

export async function supprimerSessionRecit() {
  const id = cookies().get(COOKIE_RECIT)?.value;
  if (id) await redis("DEL", `recit:session:${id}`);
  cookies().delete(COOKIE_RECIT);
}

/* ===== Solde ===== */

export async function solde(email: string) {
  return Number((await redis<string | null>("GET", `recit:solde:${email}`)) ?? 0);
}

/** Débite des secondes ; le solde ne descend pas sous zéro. */
export async function debiter(email: string, secondes: number) {
  const reste = await redis<number>("DECRBY", `recit:solde:${email}`, Math.max(1, Math.ceil(secondes)));
  if (reste < 0) {
    await redis("SET", `recit:solde:${email}`, 0);
    return 0;
  }
  return reste;
}

/** Après un paiement : crédite le solde (une seule fois par session Checkout). */
export async function crediterDepuisCheckout(sessionId: string) {
  const s = await stripe<{
    id: string;
    payment_status: string;
    amount_total: number | null;
    customer_details: { email: string | null } | null;
  }>(`/checkout/sessions/${encodeURIComponent(sessionId)}`);
  const email = s.customer_details?.email?.toLowerCase();
  if (!email || s.payment_status !== "paid" || !s.amount_total) return null;
  const premiere = await redis<number>("SETNX", `recit:paiement:${s.id}`, "1");
  const { secondes } = secondesPourMontant(s.amount_total);
  if (premiere === 1) {
    await redis("INCRBY", `recit:solde:${email}`, secondes);
    await redis("EXPIRE", `recit:paiement:${s.id}`, 400 * 24 * 3600);
  }
  return { email, secondes, montant: s.amount_total };
}

/* ===== Essais offerts (par appareil) ===== */

export function identifiantAppareil(): string | null {
  const v = cookies().get(COOKIE_ANONYME)?.value;
  return v && /^[a-f0-9]{32}$/.test(v) ? v : null;
}

export function creerIdentifiantAppareil(): string {
  const existant = identifiantAppareil();
  if (existant) return existant;
  const id = randomBytes(16).toString("hex");
  cookies().set(COOKIE_ANONYME, id, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 365 * 24 * 3600,
  });
  return id;
}

export async function essaisConsommes(appareil: string) {
  return Number((await redis<string | null>("GET", `recit:gratuit:${appareil}`)) ?? 0);
}

export async function consommerEssai(appareil: string) {
  const cle = `recit:gratuit:${appareil}`;
  const n = await redis<number>("INCR", cle);
  if (n === 1) await redis("EXPIRE", cle, 365 * 24 * 3600);
  return n;
}

/* ===== Texte de référence (orthographe standard, quran.com) ===== */

const cacheTexte = new Map<number, string[]>();

/** Versets d'une sourate en orthographe courante (imlaei), index 0 = verset 1. */
export async function texteSourate(n: number): Promise<string[]> {
  const enCache = cacheTexte.get(n);
  if (enCache) return enCache;
  const res = await fetch(
    `https://api.quran.com/api/v4/quran/verses/imlaei_simple?chapter_number=${n}`,
    { next: { revalidate: 60 * 60 * 24 * 30 } }
  );
  if (!res.ok) throw new Error("Texte du Coran indisponible");
  const json = (await res.json()) as { verses: { verse_key: string; text_imlaei_simple: string }[] };
  const liste = json.verses
    .sort((a, b) => Number(a.verse_key.split(":")[1]) - Number(b.verse_key.split(":")[1]))
    .map((v) => v.text_imlaei_simple);
  cacheTexte.set(n, liste);
  return liste;
}

/* ===== Transcription (OpenAI) ===== */

export async function transcrire(fichier: Blob, nom: string): Promise<{ texte: string; duree: number }> {
  // (PENAI_API_KEY : nom saisi avec une coquille dans Vercel, accepté aussi)
  const cle = process.env.OPENAI_API_KEY || process.env.PENAI_API_KEY;
  if (!cle) throw new Error("OpenAI non configuré");
  const corps = new FormData();
  corps.append("file", fichier, nom);
  corps.append("model", "whisper-1");
  corps.append("language", "ar");
  corps.append("response_format", "verbose_json");
  corps.append("temperature", "0");
  // Amorce : registre coranique, sans donner le verset attendu (sinon le modèle le recopierait)
  corps.append("prompt", "بسم الله الرحمن الرحيم");
  const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${cle}` },
    body: corps,
  });
  if (!res.ok) {
    const e = await res.text();
    throw new Error(`Transcription impossible (${res.status}) ${e.slice(0, 200)}`);
  }
  const json = (await res.json()) as { text: string; duration?: number };
  return { texte: json.text ?? "", duree: Number(json.duration ?? 0) };
}

/* ===== Comparaison mot à mot ===== */

/** Arabe sans voyelles, lettres unifiées, ponctuation retirée. */
export function normaliserArabe(t: string): string {
  return t
    .replace(/[ً-ٰٟۖ-ۭـ]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/ء/g, "")
    .replace(/[^ء-ي\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export type EtatMot = "ok" | "manque" | "approx";

export interface MotCompare {
  mot: string; // mot du verset, tel qu'écrit
  etat: EtatMot;
  entendu?: string; // ce qui a été reconnu à la place (approx)
}

export interface Comparaison {
  mots: MotCompare[];
  enTrop: string[]; // mots récités qui ne sont pas dans le passage
  score: number; // 0-100
}

/** Distance d'édition (Levenshtein) bornée, pour tolérer les petites variantes. */
function distance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[n];
}

function proches(a: string, b: string) {
  if (a === b) return true;
  const l = Math.max(a.length, b.length);
  return l >= 4 && distance(a, b) <= (l >= 7 ? 2 : 1);
}

/** Aligne le passage attendu et la transcription (plus longue sous-séquence commune). */
export function comparer(attendu: string, recite: string): Comparaison {
  const motsAttendus = attendu.split(/\s+/).filter(Boolean);
  const A = motsAttendus.map(normaliserArabe);
  const motsRecites = normaliserArabe(recite).split(" ").filter(Boolean);
  const B = motsRecites;
  const m = A.length;
  const n = B.length;
  // LCS avec tolérance orthographique
  const L: number[][] = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      L[i][j] = proches(A[i], B[j]) ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
    }
  }
  const mots: MotCompare[] = [];
  const enTrop: string[] = [];
  let i = 0;
  let j = 0;
  while (i < m && j < n) {
    if (proches(A[i], B[j])) {
      mots.push({ mot: motsAttendus[i], etat: A[i] === B[j] ? "ok" : "approx", entendu: A[i] === B[j] ? undefined : B[j] });
      i++;
      j++;
    } else if (L[i + 1][j] >= L[i][j + 1]) {
      mots.push({ mot: motsAttendus[i], etat: "manque" });
      i++;
    } else {
      enTrop.push(B[j]);
      j++;
    }
  }
  while (i < m) mots.push({ mot: motsAttendus[i++], etat: "manque" });
  while (j < n) enTrop.push(B[j++]);
  const bons = mots.filter((x) => x.etat !== "manque").length;
  const score = m ? Math.round((bons / m) * 100 - Math.min(20, enTrop.length * 3)) : 0;
  return { mots, enTrop, score: Math.max(0, Math.min(100, score)) };
}

/* ===== Historique ===== */

export interface ResultatHistorique {
  quand: number;
  sourate: number;
  de: number;
  a: number;
  score: number;
}

export async function ajouterHistorique(email: string, r: ResultatHistorique) {
  const cle = `recit:historique:${email}`;
  await redis("LPUSH", cle, JSON.stringify(r));
  await redis("LTRIM", cle, 0, 19);
}

export async function lireHistorique(email: string): Promise<ResultatHistorique[]> {
  const brut = await redis<string[]>("LRANGE", `recit:historique:${email}`, 0, 19);
  return (brut ?? []).map((x) => JSON.parse(x) as ResultatHistorique);
}

export { urlSite };
