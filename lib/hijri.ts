export interface DateHijri {
  jour: number;
  mois: number;
  annee: number;
}

export const MOIS_HIJRI = [
  "Muharram",
  "Safar",
  "Rabî' al-Awwal",
  "Rabî' ath-Thânî",
  "Joumâda al-Oûlâ",
  "Joumâda ath-Thâniya",
  "Rajab",
  "Cha'bân",
  "Ramadan",
  "Chawwâl",
  "Dhoul-Qi'da",
  "Dhoul-Hijja",
];

const FMT = new Intl.DateTimeFormat("fr-u-ca-islamic-umalqura", {
  day: "numeric",
  month: "numeric",
  year: "numeric",
});

/** Convertit une date grégorienne en date hégirienne (calendrier Umm al-Qura). */
export function versHijri(d: Date): DateHijri {
  const parts = FMT.formatToParts(d);
  const lire = (type: string) =>
    Number(parts.find((p) => p.type === type)?.value ?? 0);
  return { jour: lire("day"), mois: lire("month"), annee: lire("year") };
}

export function libelleHijri(h: DateHijri): string {
  return `${h.jour} ${MOIS_HIJRI[h.mois - 1]} ${h.annee}`;
}

/** Prochaine date grégorienne correspondant au (mois, jour) hégirien donné,
 *  à partir d'aujourd'hui inclus. Balaye au plus ~13 mois lunaires. */
export function prochaineDateHijri(
  mois: number,
  jour: number,
  apres: Date = new Date()
): Date {
  const d = new Date(apres);
  d.setHours(12, 0, 0, 0);
  for (let i = 0; i < 400; i++) {
    const h = versHijri(d);
    if (h.mois === mois && h.jour === jour) return new Date(d);
    d.setDate(d.getDate() + 1);
  }
  return new Date(apres);
}

/** Nombre de jours entiers entre aujourd'hui et la date donnée (0 = aujourd'hui). */
export function joursRestants(cible: Date, depuis: Date = new Date()): number {
  const a = new Date(depuis);
  a.setHours(0, 0, 0, 0);
  const b = new Date(cible);
  b.setHours(0, 0, 0, 0);
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}
