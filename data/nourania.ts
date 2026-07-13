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

/* ===== Leçons 2 à 8 ===== */

export interface ElementLecon {
  principal: string; // affichage arabe principal
  translit: string;
  vocal: string; // texte lu par la synthèse vocale
  aide?: string;
}

export interface Lecon {
  id: number;
  titre: string;
  sousTitre: string;
  intro: string;
  elements: ElementLecon[];
  grandeGrille?: boolean; // true = cartes larges (2 colonnes)
}

/** Lettres qui ne s'attachent pas à la lettre suivante. */
const NON_LIEES = ["ا", "د", "ذ", "ر", "ز", "و"];

// Voyelles et signes (Unicode)
const FATHA = "َ";
const KASRA = "ِ";
const DAMMA = "ُ";
const FATHATAN = "ً";
const KASRATAN = "ٍ";
const DAMMATAN = "ٌ";
const SUKUN = "ْ";
const SHADDA = "ّ";
const TATWEEL = "ـ";

/** Translit sans apostrophe finale gênante pour composer les syllabes. */
const base = (l: Lettre) => l.translit;

/** Lettres utilisées pour les leçons de voyelles (l'alif pur ne porte pas
 *  de voyelle : c'est la hamza أ qui joue ce rôle). */
const CONSONNES = ALPHABET.filter((l) => l.arabe !== "ا");

export const LECONS: Lecon[] = [
  // La leçon 1 (alphabet) est gérée à part avec ses conseils détaillés.
  {
    id: 2,
    titre: "Leçon 2",
    sousTitre: "Les lettres liées",
    intro:
      "En arabe, les lettres s'attachent entre elles : chaque lettre change légèrement de forme au début, au milieu ou à la fin d'un mot. Six lettres (ا د ذ ر ز و) ne s'attachent jamais à la lettre qui les suit. Touche une carte pour entendre la lettre et observer ses formes.",
    elements: ALPHABET.map((l) => ({
      principal: l.arabe,
      translit: l.nom,
      vocal: l.nomArabe,
      aide: NON_LIEES.includes(l.arabe)
        ? `Formes : ${l.arabe} • ${TATWEEL}${l.arabe} — cette lettre ne s'attache pas à la suivante.`
        : `Formes : ${l.arabe} • ${l.arabe}${TATWEEL} (début) • ${TATWEEL}${l.arabe}${TATWEEL} (milieu) • ${TATWEEL}${l.arabe} (fin).`,
    })),
  },
  {
    id: 3,
    titre: "Leçon 3",
    sousTitre: "Les voyelles (harakât)",
    intro:
      "Trois petites marques donnent leur son aux lettres : la fatha (َ) se lit « a », la kasra (ِ) se lit « i », la damma (ُ) se lit « ou ». Touche une carte pour entendre les trois sons.",
    elements: CONSONNES.map((l) => ({
      principal: `${l.arabe}${FATHA} ${l.arabe}${KASRA} ${l.arabe}${DAMMA}`,
      translit: `${base(l)}a • ${base(l)}i • ${base(l)}ou`,
      vocal: `${l.arabe}${FATHA}. ${l.arabe}${KASRA}. ${l.arabe}${DAMMA}`,
    })),
  },
  {
    id: 4,
    titre: "Leçon 4",
    sousTitre: "Le tanwîn (doubles voyelles)",
    intro:
      "Quand la voyelle est doublée, on ajoute un son « n » : fathatân (ً) = « an », kasratân (ٍ) = « in », dammatân (ٌ) = « oun ». On le trouve à la fin des mots.",
    elements: CONSONNES.map((l) => ({
      principal: `${l.arabe}${FATHATAN} ${l.arabe}${KASRATAN} ${l.arabe}${DAMMATAN}`,
      translit: `${base(l)}an • ${base(l)}in • ${base(l)}oun`,
      vocal: `${l.arabe}${FATHATAN}. ${l.arabe}${KASRATAN}. ${l.arabe}${DAMMATAN}`,
    })),
  },
  {
    id: 5,
    titre: "Leçon 5",
    sousTitre: "Les prolongations (madd)",
    intro:
      "Trois lettres allongent le son de la voyelle qui les précède : l'alif après une fatha (بَا = bâ), le yâ' après une kasra (بِي = bî), le wâw après une damma (بُو = boû). On tient le son deux temps.",
    elements: CONSONNES.map((l) => ({
      principal: `${l.arabe}${FATHA}ا ${l.arabe}${KASRA}ي ${l.arabe}${DAMMA}و`,
      translit: `${base(l)}â • ${base(l)}î • ${base(l)}oû`,
      vocal: `${l.arabe}${FATHA}ا. ${l.arabe}${KASRA}ي. ${l.arabe}${DAMMA}و`,
    })),
  },
  {
    id: 6,
    titre: "Leçon 6",
    sousTitre: "Le soukoun",
    intro:
      "Le soukoun (ْ) indique une lettre « fermée », sans voyelle : elle s'arrête net. On s'entraîne avec une hamza devant : أَبْ = ab, إِبْ = ib, أُبْ = oub.",
    elements: CONSONNES.filter((l) => l.arabe !== "أ").map((l) => ({
      principal: `أ${FATHA}${l.arabe}${SUKUN} إ${KASRA}${l.arabe}${SUKUN} أ${DAMMA}${l.arabe}${SUKUN}`,
      translit: `a${base(l)} • i${base(l)} • ou${base(l)}`,
      vocal: `أ${FATHA}${l.arabe}${SUKUN}. إ${KASRA}${l.arabe}${SUKUN}. أ${DAMMA}${l.arabe}${SUKUN}`,
    })),
  },
  {
    id: 7,
    titre: "Leçon 7",
    sousTitre: "La shadda (lettre doublée)",
    intro:
      "La shadda (ّ) double la lettre : on la ferme puis on la rouvre aussitôt. أَبَّ = abba (comme « ab » + « ba » enchaînés). Appuie bien sur la lettre doublée.",
    elements: CONSONNES.filter((l) => l.arabe !== "أ").map((l) => ({
      principal: `أ${FATHA}${l.arabe}${SHADDA}${FATHA} إ${KASRA}${l.arabe}${SHADDA}${KASRA} أ${DAMMA}${l.arabe}${SHADDA}${DAMMA}`,
      translit: `a${base(l)}${base(l)}a • i${base(l)}${base(l)}i • ou${base(l)}${base(l)}ou`,
      vocal: `أ${FATHA}${l.arabe}${SHADDA}${FATHA}. إ${KASRA}${l.arabe}${SHADDA}${KASRA}. أ${DAMMA}${l.arabe}${SHADDA}${DAMMA}`,
    })),
  },
  {
    id: 8,
    titre: "Leçon 8",
    sousTitre: "Lire ses premiers mots",
    intro:
      "Bravo, tu sais maintenant tout déchiffrer ! Voici des mots du Coran qui combinent voyelles, prolongations, soukoun et shadda. Lis-les à voix haute, puis vérifie avec l'audio.",
    grandeGrille: true,
    elements: [
      { principal: "بِسْمِ", translit: "bismi", vocal: "بِسْمِ", aide: "« Au nom de » — le tout premier mot du Coran." },
      { principal: "رَبِّ", translit: "rabbi", vocal: "رَبِّ", aide: "« Seigneur » — remarque la shadda sur le ب." },
      { principal: "قُلْ", translit: "qoul", vocal: "قُلْ", aide: "« Dis » — soukoun final sur le ل." },
      { principal: "نُورٌ", translit: "noûroun", vocal: "نُورٌ", aide: "« Lumière » — madd en و puis tanwîn." },
      { principal: "كِتَابٌ", translit: "kitâboun", vocal: "كِتَابٌ", aide: "« Livre » — madd en ا." },
      { principal: "رَحِيمٌ", translit: "rahîmoun", vocal: "رَحِيمٌ", aide: "« Très Miséricordieux » — madd en ي." },
      { principal: "مَلِكٌ", translit: "malikoun", vocal: "مَلِكٌ", aide: "« Roi » — trois voyelles simples." },
      { principal: "يَوْمٌ", translit: "yawmoun", vocal: "يَوْمٌ", aide: "« Jour » — le و porte un soukoun." },
      { principal: "عَلِيمٌ", translit: "'alîmoun", vocal: "عَلِيمٌ", aide: "« Omniscient » — commence par la lettre ع." },
      { principal: "سَلَامٌ", translit: "salâmoun", vocal: "سَلَامٌ", aide: "« Paix » — deux madd à suivre." },
      { principal: "دِينٌ", translit: "dînoun", vocal: "دِينٌ", aide: "« Religion » — madd en ي." },
      { principal: "عَبْدٌ", translit: "'abdoun", vocal: "عَبْدٌ", aide: "« Serviteur » — soukoun au milieu." },
      { principal: "شَمْسٌ", translit: "chamsoun", vocal: "شَمْسٌ", aide: "« Soleil » — soukoun sur le م." },
      { principal: "قَمَرٌ", translit: "qamaroun", vocal: "قَمَرٌ", aide: "« Lune » — le ق profond." },
      { principal: "جَنَّةٌ", translit: "jannatoun", vocal: "جَنَّةٌ", aide: "« Paradis » — shadda sur le ن." },
      { principal: "حَمْدٌ", translit: "hamdoun", vocal: "حَمْدٌ", aide: "« Louange » — le ح soufflé." },
    ],
  },
];
