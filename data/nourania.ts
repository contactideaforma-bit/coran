export interface Lettre {
  arabe: string;
  nom: string;
  translit: string;
  conseil: string; // aide à la prononciation pour un francophone
}

/** Leçon 1 de la Qâ'ida Nourania : les 28 lettres de l'alphabet. */
export const ALPHABET: Lettre[] = [
  { arabe: "ا", nom: "Alif", translit: "a", conseil: "Comme le « a » de « papa », bouche bien ouverte." },
  { arabe: "ب", nom: "Bâ'", translit: "b", conseil: "Comme le « b » français." },
  { arabe: "ت", nom: "Tâ'", translit: "t", conseil: "Comme le « t » français, léger." },
  { arabe: "ث", nom: "Thâ'", translit: "th", conseil: "Comme le « th » anglais de « think » : langue entre les dents, souffle doux." },
  { arabe: "ج", nom: "Jîm", translit: "j", conseil: "Comme « dj » dans « Djibouti »." },
  { arabe: "ح", nom: "Ḥâ'", translit: "ḥ", conseil: "Un « h » très soufflé venant du fond de la gorge, sans racler (comme quand on embue une vitre)." },
  { arabe: "خ", nom: "Khâ'", translit: "kh", conseil: "Comme la « jota » espagnole ou le « ch » allemand de « Bach » : raclement léger." },
  { arabe: "د", nom: "Dâl", translit: "d", conseil: "Comme le « d » français." },
  { arabe: "ذ", nom: "Dhâl", translit: "dh", conseil: "Comme le « th » anglais de « this » : langue entre les dents, son vibré." },
  { arabe: "ر", nom: "Râ'", translit: "r", conseil: "« R » roulé avec le bout de la langue (comme en espagnol), jamais comme le R français." },
  { arabe: "ز", nom: "Zây", translit: "z", conseil: "Comme le « z » français." },
  { arabe: "س", nom: "Sîn", translit: "s", conseil: "Comme le « s » de « soleil »." },
  { arabe: "ش", nom: "Shîn", translit: "sh", conseil: "Comme le « ch » de « chat »." },
  { arabe: "ص", nom: "Ṣâd", translit: "ṣ", conseil: "Un « s » emphatique : bouche arrondie, son grave et plein." },
  { arabe: "ض", nom: "Ḍâd", translit: "ḍ", conseil: "Un « d » emphatique, lourd — la lettre emblématique de l'arabe. Côté de la langue contre les molaires." },
  { arabe: "ط", nom: "Ṭâ'", translit: "ṭ", conseil: "Un « t » emphatique : son grave, langue plaquée au palais." },
  { arabe: "ظ", nom: "Ḏhâ'", translit: "ẓ", conseil: "Comme ذ (th vibré) mais emphatique et grave." },
  { arabe: "ع", nom: "'Ayn", translit: "'", conseil: "Son du fond de la gorge, gorge serrée — n'existe pas en français, s'apprend à l'oreille." },
  { arabe: "غ", nom: "Ghayn", translit: "gh", conseil: "Proche du « R » français de « Paris », léger gargarisme." },
  { arabe: "ف", nom: "Fâ'", translit: "f", conseil: "Comme le « f » français." },
  { arabe: "ق", nom: "Qâf", translit: "q", conseil: "Un « k » profond, prononcé tout au fond de la gorge (luette)." },
  { arabe: "ك", nom: "Kâf", translit: "k", conseil: "Comme le « k » français, léger." },
  { arabe: "ل", nom: "Lâm", translit: "l", conseil: "Comme le « l » français." },
  { arabe: "م", nom: "Mîm", translit: "m", conseil: "Comme le « m » français, lèvres fermées." },
  { arabe: "ن", nom: "Nûn", translit: "n", conseil: "Comme le « n » français." },
  { arabe: "ه", nom: "Hâ'", translit: "h", conseil: "Un « h » doux et expiré, comme dans l'anglais « home »." },
  { arabe: "و", nom: "Wâw", translit: "w", conseil: "Comme le « w » de « oui / watt », lèvres arrondies." },
  { arabe: "ي", nom: "Yâ'", translit: "y", conseil: "Comme le « y » de « yoga »." },
];

export interface LeconAVenir {
  titre: string;
  description: string;
}

/** Progression classique de la Qâ'ida Nourania. */
export const LECONS_A_VENIR: LeconAVenir[] = [
  { titre: "Leçon 2 — Les lettres liées", description: "Reconnaître les lettres attachées entre elles (début, milieu, fin de mot)." },
  { titre: "Leçon 3 — Les voyelles (harakât)", description: "Fatha, kasra, damma : lire ses premières syllabes." },
  { titre: "Leçon 4 — Le tanwîn", description: "Les doubles voyelles : an, in, oun." },
  { titre: "Leçon 5 — Les prolongations (madd)", description: "Allonger les sons avec alif, wâw et yâ'." },
  { titre: "Leçon 6 — Le soukoun", description: "Les lettres « fermées », sans voyelle." },
  { titre: "Leçon 7 — La shadda", description: "Les lettres doublées." },
  { titre: "Leçon 8 — Exercices de lecture", description: "Lire des mots complets du Coran en appliquant tout." },
];
