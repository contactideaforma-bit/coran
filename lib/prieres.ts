export interface ConfigPriere {
  ville: string;
  pays: string;
  methode: number;
}

export interface HorairesJour {
  fajr: string;
  lever: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  hijri: string; // ex. "29 Muharram 1448"
}

export const METHODES = [
  { id: 12, nom: "Musulmans de France / UOIF (12°)" },
  { id: 3, nom: "Ligue Islamique Mondiale (18°)" },
  { id: 2, nom: "ISNA — Amérique du Nord (15°)" },
  { id: 4, nom: "Umm al-Qura — La Mecque" },
  { id: 5, nom: "Autorité égyptienne (19,5°)" },
];

const CLE = "coran-priere";

export function lireConfigPriere(): ConfigPriere | null {
  try {
    const brut = localStorage.getItem(CLE);
    if (!brut) return null;
    const c = JSON.parse(brut);
    if (c.ville && c.pays && typeof c.methode === "number") return c;
  } catch {}
  return null;
}

export function ecrireConfigPriere(c: ConfigPriere) {
  try {
    localStorage.setItem(CLE, JSON.stringify(c));
  } catch {}
}

export async function chargerHoraires(c: ConfigPriere): Promise<HorairesJour> {
  const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(
    c.ville
  )}&country=${encodeURIComponent(c.pays)}&method=${c.methode}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Horaires indisponibles");
  const json = await res.json();
  if (json.code !== 200) throw new Error("Ville introuvable");
  const t = json.data.timings;
  const h = json.data.date.hijri;
  return {
    fajr: nettoyerHeure(t.Fajr),
    lever: nettoyerHeure(t.Sunrise),
    dhuhr: nettoyerHeure(t.Dhuhr),
    asr: nettoyerHeure(t.Asr),
    maghrib: nettoyerHeure(t.Maghrib),
    isha: nettoyerHeure(t.Isha),
    hijri: `${Number(h.day)} ${h.month.en} ${h.year}`,
  };
}

/* ===== Calendrier mensuel ===== */

export interface JourCalendrier {
  jour: number; // jour du mois grégorien (1-31)
  fajr: string;
  lever: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  hijri: string; // ex. "12 Muharram"
}

interface JourAladhan {
  timings: Record<string, string>;
  date: {
    gregorian: { day: string };
    hijri: { day: string; month: { en: string } };
  };
}

/** L'API renvoie parfois "05:23 (CEST)" : on ne garde que l'heure. */
const nettoyerHeure = (h: string) => h.split(" ")[0];

const cacheMois = new Map<string, JourCalendrier[]>();

/** Horaires de tout un mois grégorien (mois : 1-12). */
export async function chargerCalendrierMois(
  c: ConfigPriere,
  annee: number,
  mois: number
): Promise<JourCalendrier[]> {
  const cle = `${c.ville}|${c.pays}|${c.methode}|${annee}-${mois}`;
  const enCache = cacheMois.get(cle);
  if (enCache) return enCache;

  const url = `https://api.aladhan.com/v1/calendarByCity?city=${encodeURIComponent(
    c.ville
  )}&country=${encodeURIComponent(c.pays)}&method=${c.methode}&month=${mois}&year=${annee}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Calendrier indisponible");
  const json = await res.json();
  if (json.code !== 200 || !Array.isArray(json.data)) {
    throw new Error("Ville introuvable");
  }

  const jours: JourCalendrier[] = (json.data as JourAladhan[]).map((j) => ({
    jour: Number(j.date.gregorian.day),
    fajr: nettoyerHeure(j.timings.Fajr),
    lever: nettoyerHeure(j.timings.Sunrise),
    dhuhr: nettoyerHeure(j.timings.Dhuhr),
    asr: nettoyerHeure(j.timings.Asr),
    maghrib: nettoyerHeure(j.timings.Maghrib),
    isha: nettoyerHeure(j.timings.Isha),
    hijri: `${Number(j.date.hijri.day)} ${j.date.hijri.month.en}`,
  }));
  cacheMois.set(cle, jours);
  return jours;
}

/** Identifie la prochaine prière du jour ("fajr"… ; null si toutes passées). */
export function prochainePriere(h: HorairesJour, maintenant = new Date()) {
  const minutes = maintenant.getHours() * 60 + maintenant.getMinutes();
  const enMinutes = (hhmm: string) => {
    const [hh, mm] = hhmm.split(":").map(Number);
    return hh * 60 + mm;
  };
  const ordre: { id: keyof HorairesJour; nom: string }[] = [
    { id: "fajr", nom: "Fajr" },
    { id: "dhuhr", nom: "Dhuhr" },
    { id: "asr", nom: "Asr" },
    { id: "maghrib", nom: "Maghrib" },
    { id: "isha", nom: "Isha" },
  ];
  for (const p of ordre) {
    if (enMinutes(h[p.id]) > minutes) return p.id;
  }
  return null;
}
