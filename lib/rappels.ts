/* Réglages des notifications : prières à annoncer et rappels Coran
 * programmés. Partagé entre le client (localStorage) et le serveur
 * (copie envoyée avec l'abonnement push). */

import type { ConfigPriere } from "./prieres";

export const PRIERES_NOTIFIABLES = [
  "fajr",
  "dhuhr",
  "asr",
  "maghrib",
  "isha",
] as const;
export type PriereNotifiable = (typeof PRIERES_NOTIFIABLES)[number];

export const NOMS_PRIERES: Record<PriereNotifiable, string> = {
  fajr: "Fajr",
  dhuhr: "Dhuhr",
  asr: "Asr",
  maghrib: "Maghrib",
  isha: "Isha",
};

/** Jours de la semaine, 0 = dimanche (convention JavaScript). */
export const JOURS = [
  { id: 1, court: "L", nom: "lundi" },
  { id: 2, court: "M", nom: "mardi" },
  { id: 3, court: "M", nom: "mercredi" },
  { id: 4, court: "J", nom: "jeudi" },
  { id: 5, court: "V", nom: "vendredi" },
  { id: 6, court: "S", nom: "samedi" },
  { id: 0, court: "D", nom: "dimanche" },
];

export interface RappelCoran {
  id: string;
  heure: string; // "HH:MM" (heure locale de l'appareil)
  jours: number[]; // 0-6, vide = jamais
  message: string;
  actif: boolean;
}

export interface ConfigNotifs {
  prieres: Record<PriereNotifiable, boolean>;
  avance: number; // minutes avant l'heure de la prière (0 = à l'heure)
  rappels: RappelCoran[];
}

/** Ce que le serveur conserve pour chaque appareil abonné. */
export interface Abonne {
  id: string;
  abonnement: PushSubscriptionJSON;
  fuseau: string; // ex. "Europe/Paris"
  priere: ConfigPriere | null;
  notifs: ConfigNotifs;
  maj: number; // horodatage de la dernière synchro
}

export const CONFIG_NOTIFS_DEFAUT: ConfigNotifs = {
  prieres: { fajr: true, dhuhr: true, asr: true, maghrib: true, isha: true },
  avance: 0,
  rappels: [],
};

export const MESSAGE_RAPPEL_DEFAUT = "C'est l'heure de ta lecture du Coran 📖";

const CLE = "coran-notifs";

export function lireConfigNotifs(): ConfigNotifs {
  try {
    const brut = localStorage.getItem(CLE);
    if (!brut) return CONFIG_NOTIFS_DEFAUT;
    const c = JSON.parse(brut);
    return {
      prieres: { ...CONFIG_NOTIFS_DEFAUT.prieres, ...(c.prieres ?? {}) },
      avance: typeof c.avance === "number" ? c.avance : 0,
      rappels: Array.isArray(c.rappels) ? c.rappels : [],
    };
  } catch {
    return CONFIG_NOTIFS_DEFAUT;
  }
}

export function ecrireConfigNotifs(c: ConfigNotifs) {
  try {
    localStorage.setItem(CLE, JSON.stringify(c));
  } catch {}
  window.dispatchEvent(new Event("notifs-changees"));
}

export const nouvelId = () =>
  Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

/** "HH:MM" → minutes depuis minuit. */
export function enMinutes(hhmm: string) {
  const [hh, mm] = hhmm.split(":").map(Number);
  return hh * 60 + mm;
}

/** Libellé lisible des jours choisis : « tous les jours », « lun, mer, ven »… */
export function libelleJours(jours: number[]) {
  if (jours.length === 7) return "tous les jours";
  if (jours.length === 0) return "aucun jour";
  const semaine = [1, 2, 3, 4, 5];
  if (jours.length === 5 && semaine.every((j) => jours.includes(j)))
    return "en semaine";
  if (jours.length === 2 && jours.includes(6) && jours.includes(0))
    return "le week-end";
  return JOURS.filter((j) => jours.includes(j.id))
    .map((j) => j.nom.slice(0, 3))
    .join(", ");
}
