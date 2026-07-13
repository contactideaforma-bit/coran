const pad3 = (n: number) => String(n).padStart(3, "0");

/** Prononciation d'un mot précis (mot à mot, Quran.com). */
export function urlMot(sourate: number, verset: number, mot: number) {
  return `https://verses.quran.com/wbw/${pad3(sourate)}_${pad3(verset)}_${pad3(mot)}.mp3`;
}

/** Récitation du verset complet par Mishary Rashid Al-Afasy. */
export function urlVerset(sourate: number, verset: number) {
  return `https://everyayah.com/data/Alafasy_128kbps/${pad3(sourate)}${pad3(verset)}.mp3`;
}
