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
    fajr: t.Fajr,
    lever: t.Sunrise,
    dhuhr: t.Dhuhr,
    asr: t.Asr,
    maghrib: t.Maghrib,
    isha: t.Isha,
    hijri: `${Number(h.day)} ${h.month.en} ${h.year}`,
  };
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
