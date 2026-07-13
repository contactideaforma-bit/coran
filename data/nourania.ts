export interface Lettre {
  arabe: string;
  nom: string;
  nomArabe: string; // pour la synthèse vocale
  translit: string;
  conseil: string; // aide à la prononciation pour un francophone
}

/** Leçon 1 de la Qâ'ida Nourania : les 28 lettres de l'alphabet. */
export const ALPHABET: Lettre[] = [
  { arabe: "ا", nom: "Alif", nomArabe: "أَلِف", translit: "a", conseil: "Comme le « a » de « papa », bouche bien ouverte." },
  { arabe: "ب", nom: "Bâ'", nomArabe: "بَاء", translit: "b", conseil: "Comme le « b » français." },
  { arabe: "ت", nom: "Tâ'", nomArabe: "تَاء", translit: "t", conseil: "Comme le « t » français, léger." },
  { arabe: "ث", nom: "Thâ'", nomArabe: "ثَاء", translit: "th", conseil: "Comme le « th » anglais de « think » : langue entre les dents, souffle doux." },
  { arabe: "ج", nom: "Jîm", nomArabe: "جِيم", translit: "j", conseil: "Comme « dj » dans « Djibouti »." },
  { arabe: "ح", nom: "Ḥâ'", nomArabe: "حَاء", translit: "ḥ", conseil: "Un « h » très soufflé venant du fond de la gorge, sans racler (comme quand on embue une vitre)." },
  { arabe: "خ", nom: "Khâ'", nomArabe: "خَاء", translit: "kh", conseil: "Comme la « jota » espagnole ou le « ch » allemand de « Bach » : raclement léger." },
  { arabe: "د", nom: "Dâl", nomArabe: "دَال", translit: "d", conseil: "Comme le « d » français." },
  { arabe: "ذ", nom: "Dhâl", nomArabe: "ذَال", translit: "dh", conseil: "Comme le « th » anglais de « this » : langue entre les dents, son vibré." },
  { arabe: "ر", nom: "Râ'", nomArabe: "رَاء", translit: "r", conseil: "« R » roulé avec le bout de la langue (comme en espagnol), jamais comme le R français." },
  { arabe: "ز", nom: "Zây", nomArabe: "زَاي", translit: "z", conseil: "Comme le « z » français." },
  { arabe: "س", nom: "Sîn", nomArabe: "سِين", translit: "s", conseil: "Comme le « s » de « soleil »." },
  { arabe: "ش", nom: "Shîn", nomArabe: "شِين", translit: "sh", conseil: "Comme le « ch » de « chat »." },
  { arabe: "ص", nom: "Ṣâd", nomArabe: "صَاد", translit: "ṣ", conseil: "Un « s » emphatique : bouche arrondie, son grave et plein." },
  { arabe: "ض", nom: "Ḍâd", nomArabe: "ضَاد", translit: "ḍ", conseil: "Un « d » emphatique, lourd — la lettre emblématique de l'arabe. Côté de la langue contre les molaires." },
  { arabe: "ط", nom: "Ṭâ'", nomArabe: "طَاء", translit: "ṭ", conseil: "Un « t » emphatique : son grave, langue plaquée au palais." },
  { arabe: "ظ", nom: "Ḏhâ'", nomArabe: "ظَاء", translit: "ẓ", conseil: "Comme ذ (th vibré) mais emphatique et grave." },
  { arabe: "ع", nom: "'Ayn", nomArabe: "عَيْن", translit: "'", conseil: "Son du fond de la gorge, gorge serrée — n'existe pas en français, s'apprend à l'oreille." },
  { arabe: "غ", nom: "Ghayn", nomArabe: "غَيْن", translit: "gh", conseil: "Proche du « R » français de « Paris », léger gargarisme." },
  { arabe: "ف", nom: "Fâ'", nomArabe: "فَاء", translit: "f", conseil: "Comme le « f » français." },
  { arabe: "ق", nom: "Qâf", nomArabe: "قَاف", translit: "q", conseil: "Un « k » profond, prononcé tout au fond de la gorge (luette)." },
  { arabe: "ك", nom: "Kâf", nomArabe: "كَاف", translit: "k", conseil: "Comme le « k » français, léger." },
  { arabe: "ل", nom: "Lâm", nomArabe: "لَام", translit: "l", conseil: "Comme le « l » français." },
  { arabe: "م", nom: "Mîm", nomArabe: "مِيم", translit: "m", conseil: "Comme le « m » français, lèvres fermées." },
  { arabe: "ن", nom: "Nûn", nomArabe: "نُون", translit: "n", conseil: "Comme le « n » français." },
  { arabe: "ه", nom: "Hâ'", nomArabe: "هَاء", translit: "h", conseil: "Un « h » doux et expiré, comme dans l'anglais « home »." },
  { arabe: "و", nom: "Wâw", nomArabe: "وَاو", translit: "w", conseil: "Comme le « w » de « oui / watt », lèvres arrondies." },
  { arabe: "ي", nom: "Yâ'", nomArabe: "يَاء", translit: "y", conseil: "Comme le « y » de « yoga »." },
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
