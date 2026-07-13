/**
 * Débuts des 30 juz' (édition Hafs / Madina).
 * NB : certaines éditions décalent quelques frontières d'un verset.
 */
export const JUZ_DEBUTS: { juz: number; sourate: number; verset: number }[] = [
  { juz: 1, sourate: 1, verset: 1 },
  { juz: 2, sourate: 2, verset: 142 },
  { juz: 3, sourate: 2, verset: 253 },
  { juz: 4, sourate: 3, verset: 93 },
  { juz: 5, sourate: 4, verset: 24 },
  { juz: 6, sourate: 4, verset: 148 },
  { juz: 7, sourate: 5, verset: 82 },
  { juz: 8, sourate: 6, verset: 111 },
  { juz: 9, sourate: 7, verset: 88 },
  { juz: 10, sourate: 8, verset: 41 },
  { juz: 11, sourate: 9, verset: 93 },
  { juz: 12, sourate: 11, verset: 6 },
  { juz: 13, sourate: 12, verset: 53 },
  { juz: 14, sourate: 15, verset: 1 },
  { juz: 15, sourate: 17, verset: 1 },
  { juz: 16, sourate: 18, verset: 75 },
  { juz: 17, sourate: 21, verset: 1 },
  { juz: 18, sourate: 23, verset: 1 },
  { juz: 19, sourate: 25, verset: 21 },
  { juz: 20, sourate: 27, verset: 56 },
  { juz: 21, sourate: 29, verset: 46 },
  { juz: 22, sourate: 33, verset: 31 },
  { juz: 23, sourate: 36, verset: 28 },
  { juz: 24, sourate: 39, verset: 32 },
  { juz: 25, sourate: 41, verset: 47 },
  { juz: 26, sourate: 46, verset: 1 },
  { juz: 27, sourate: 51, verset: 31 },
  { juz: 28, sourate: 58, verset: 1 },
  { juz: 29, sourate: 67, verset: 1 },
  { juz: 30, sourate: 78, verset: 1 },
];

export interface SectionJuz {
  juz: number;
  debut: number; // premier verset de la section dans la sourate
  fin: number; // dernier verset
}

/** Découpe une sourate en sections selon les frontières de juz'. */
export function sectionsJuz(sourate: number, nbVersets: number): SectionJuz[] {
  // Juz' en cours au premier verset de la sourate
  let juzCourant = 1;
  for (const j of JUZ_DEBUTS) {
    if (j.sourate < sourate || (j.sourate === sourate && j.verset <= 1)) {
      juzCourant = j.juz;
    }
  }
  // Débuts de juz' à l'intérieur de la sourate
  const internes = JUZ_DEBUTS.filter(
    (j) => j.sourate === sourate && j.verset > 1
  );
  const bornes = [
    { juz: juzCourant, debut: 1 },
    ...internes.map((j) => ({ juz: j.juz, debut: j.verset })),
  ];
  return bornes.map((b, i) => ({
    juz: b.juz,
    debut: b.debut,
    fin: i + 1 < bornes.length ? bornes[i + 1].debut - 1 : nbVersets,
  }));
}
