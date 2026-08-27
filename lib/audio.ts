const pad3 = (n: number) => String(n).padStart(3, "0");

/** Prononciation d'un mot précis (mot à mot, Quran.com). */
export function urlMot(sourate: number, verset: number, mot: number) {
  return `https://verses.quran.com/wbw/${pad3(sourate)}_${pad3(verset)}_${pad3(mot)}.mp3`;
}

/** Récitation du verset complet par le récitateur choisi (everyayah.com). */
export function urlVerset(sourate: number, verset: number, recitateur: string) {
  return `https://everyayah.com/data/${recitateur}/${pad3(sourate)}${pad3(verset)}.mp3`;
}

/** Son Nourania pré-généré (voix neuronale) — voir scripts/generer-audio.ts. */
export function urlNourania(cle: string) {
  return `/audio/nourania/${cle}.mp3`;
}

/** Prononciation d'un mot de vocabulaire (voix neuronale pré-générée). */
export function urlVocabulaire(id: string) {
  return `/audio/vocabulaire/${id}.mp3`;
}

let audioCourant: HTMLAudioElement | null = null;

/** Joue un fichier ; s'il manque ou ne se lit pas, exécute le secours
 *  (en général la synthèse vocale du navigateur). */
export function jouerOuSecours(url: string, secours: () => void) {
  audioCourant?.pause();
  if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel();
  const audio = new Audio(url);
  audioCourant = audio;
  let rattrape = false;
  const replier = () => {
    if (rattrape) return;
    rattrape = true;
    secours();
  };
  audio.onerror = replier;
  audio.play().catch(replier);
}
