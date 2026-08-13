/**
 * Vocabulaire coranique — packs thématiques de mémorisation.
 *
 * Les mots sont choisis parmi les plus fréquents du Coran : mémoriser
 * les ~300 premiers permet de reconnaître environ 70 % des occurrences
 * du texte. Les packs sont ordonnés par rentabilité (fréquence cumulée
 * décroissante), pas par difficulté.
 *
 * ATTENTION : le champ `frequence` est une ESTIMATION saisie à la main.
 * Lancer `node scripts/verifier-vocabulaire.mjs` pour recalculer les
 * fréquences réelles depuis le corpus morphologique et vérifier que chaque
 * verset d'exemple contient bien le mot cité.
 */

export type NatureMot =
  | "nom"
  | "verbe"
  | "adjectif"
  | "particule"
  | "pronom"
  | "nomPropre";

export interface Mot {
  /** Identifiant stable, utilisé comme clé de progression dans le stockage local. */
  id: string;
  /** Forme de référence, vocalisée. */
  arabe: string;
  translit: string;
  /** Traduction française principale. */
  sens: string;
  /** Nuances ou sens secondaires, affichés après validation. */
  precision?: string;
  /** Racine trilitère (absente pour les particules et les noms propres). */
  racine?: string;
  nature: NatureMot;
  /**
   * Nombre de mots du Coran que cette entrée permet de reconnaître :
   * toute la famille de la racine pour les noms, verbes et adjectifs,
   * les occurrences du mot lui-même pour les particules et les pronoms.
   * Valeur mesurée sur le corpus — régénérée par scripts/verifier-vocabulaire.mjs.
   */
  frequence: number;
  /** Verset où le mot apparaît : [sourate, verset]. Le texte est chargé via l'API. */
  exemple: [number, number];
}

export interface PackVocabulaire {
  id: string;
  titre: string;
  /** Une phrase qui dit à l'utilisateur ce qu'il gagne en faisant ce pack. */
  description: string;
  /** Ordre d'apparition dans l'onglet. */
  ordre: number;
  mots: Mot[];
}

/* ========================================================================
   Pack 1 — Les mots de la Fâtiha
   ======================================================================== */

const FATIHA: PackVocabulaire = {
  id: "fatiha",
  titre: "Les mots de la Fâtiha",
  description: "Les 15 mots de la sourate que tu récites à chaque prière. Le meilleur point de départ : tu les entends déjà tous les jours.",
  ordre: 1,
  mots: [
    { id: "ism", arabe: "اِسْم", translit: "ism", sens: "nom", racine: "س م و", nature: "nom", frequence: 381, exemple: [1, 1] },
    { id: "allah", arabe: "اللَّه", translit: "Allāh", sens: "Allah", precision: "Le nom propre de Dieu, jamais traduit ni mis au pluriel.", nature: "nomPropre", frequence: 2699, exemple: [1, 1] },
    { id: "rahman", arabe: "الرَّحْمَٰن", translit: "ar-Raḥmān", sens: "le Tout Miséricordieux", precision: "Miséricorde immense qui englobe toute la création, croyants et mécréants.", racine: "ر ح م", nature: "nom", frequence: 339, exemple: [1, 3] },
    { id: "rahim", arabe: "الرَّحِيم", translit: "ar-Raḥīm", sens: "le Très Miséricordieux", precision: "Miséricorde constante et particulière, réservée aux croyants dans l'au-delà.", racine: "ر ح م", nature: "adjectif", frequence: 339, exemple: [1, 3] },
    { id: "hamd", arabe: "الْحَمْد", translit: "al-ḥamd", sens: "la louange", precision: "Louange qui contient à la fois l'éloge et la reconnaissance.", racine: "ح م د", nature: "nom", frequence: 68, exemple: [1, 2] },
    { id: "rabb", arabe: "رَبّ", translit: "rabb", sens: "Seigneur", precision: "Celui qui crée, possède, éduque et pourvoit.", racine: "ر ب ب", nature: "nom", frequence: 980, exemple: [1, 2] },
    { id: "alamin", arabe: "عَالَمِين", translit: "ʿālamīn", sens: "les mondes, les univers", racine: "ع ل م", nature: "nom", frequence: 854, exemple: [1, 2] },
    { id: "malik", arabe: "مَالِك", translit: "mālik", sens: "Maître, Souverain", racine: "م ل ك", nature: "nom", frequence: 206, exemple: [1, 4] },
    { id: "yawm", arabe: "يَوْم", translit: "yawm", sens: "jour", racine: "ي و م", nature: "nom", frequence: 475, exemple: [1, 4] },
    { id: "din", arabe: "دِين", translit: "dīn", sens: "religion, rétribution", precision: "Dans « yawm ad-dīn », le sens est celui du Jugement, de la rétribution.", racine: "د ي ن", nature: "nom", frequence: 101, exemple: [1, 4] },
    { id: "abada", arabe: "عَبَدَ", translit: "ʿabada", sens: "adorer", precision: "Même racine que ʿabd, le serviteur.", racine: "ع ب د", nature: "verbe", frequence: 275, exemple: [1, 5] },
    { id: "istaana", arabe: "اِسْتَعَانَ", translit: "istaʿāna", sens: "demander secours", racine: "ع و ن", nature: "verbe", frequence: 12, exemple: [1, 5] },
    { id: "hada", arabe: "هَدَىٰ", translit: "hadā", sens: "guider", racine: "ه د ي", nature: "verbe", frequence: 316, exemple: [1, 6] },
    { id: "sirat", arabe: "صِرَاط", translit: "ṣirāṭ", sens: "chemin, voie", precision: "Une voie large et droite, par opposition au sentier étroit.", racine: "ص ر ط", nature: "nom", frequence: 45, exemple: [1, 6] },
    { id: "mustaqim", arabe: "مُسْتَقِيم", translit: "mustaqīm", sens: "droit, rectiligne", racine: "ق و م", nature: "adjectif", frequence: 660, exemple: [1, 6] },
  ],
};

/* ========================================================================
   Pack 2 — Allah et Ses noms
   ======================================================================== */

const NOMS_DIVINS: PackVocabulaire = {
  id: "noms-divins",
  titre: "Allah et Ses noms",
  description: "Les attributs qui reviennent en fin de verset. Une fois connus, des centaines de fins de versets deviennent transparentes.",
  ordre: 2,
  mots: [
    { id: "ilah", arabe: "إِلَٰه", translit: "ilāh", sens: "divinité", precision: "Nom commun : ce qui est adoré. À distinguer d'Allah, nom propre.", racine: "أ ل ه", nature: "nom", frequence: 2851, exemple: [2, 163] },
    { id: "rahma", arabe: "رَحْمَة", translit: "raḥma", sens: "miséricorde", racine: "ر ح م", nature: "nom", frequence: 339, exemple: [7, 156] },
    { id: "alim", arabe: "عَلِيم", translit: "ʿalīm", sens: "Omniscient", racine: "ع ل م", nature: "adjectif", frequence: 854, exemple: [2, 32] },
    { id: "hakim", arabe: "حَكِيم", translit: "ḥakīm", sens: "Sage", racine: "ح ك م", nature: "adjectif", frequence: 210, exemple: [2, 32] },
    { id: "aziz", arabe: "عَزِيز", translit: "ʿazīz", sens: "Puissant, Inaccessible", racine: "ع ز ز", nature: "adjectif", frequence: 120, exemple: [2, 129] },
    { id: "ghafur", arabe: "غَفُور", translit: "ghafūr", sens: "Pardonneur", racine: "غ ف ر", nature: "adjectif", frequence: 234, exemple: [2, 173] },
    { id: "sami", arabe: "سَمِيع", translit: "samīʿ", sens: "Audient, qui entend tout", racine: "س م ع", nature: "adjectif", frequence: 185, exemple: [2, 127] },
    { id: "basir", arabe: "بَصِير", translit: "baṣīr", sens: "Clairvoyant, qui voit tout", racine: "ب ص ر", nature: "adjectif", frequence: 148, exemple: [2, 96] },
    { id: "qadir", arabe: "قَدِير", translit: "qadīr", sens: "Omnipotent", racine: "ق د ر", nature: "adjectif", frequence: 132, exemple: [2, 20] },
    { id: "khabir", arabe: "خَبِير", translit: "khabīr", sens: "Parfaitement Informé", racine: "خ ب ر", nature: "adjectif", frequence: 52, exemple: [2, 234] },
    { id: "karim", arabe: "كَرِيم", translit: "karīm", sens: "Noble, Généreux", racine: "ك ر م", nature: "adjectif", frequence: 47, exemple: [27, 40] },
    { id: "azim", arabe: "عَظِيم", translit: "ʿaẓīm", sens: "Immense, Grandiose", racine: "ع ظ م", nature: "adjectif", frequence: 128, exemple: [2, 255] },
    { id: "halim", arabe: "حَلِيم", translit: "ḥalīm", sens: "Longanime, plein de mansuétude", racine: "ح ل م", nature: "adjectif", frequence: 21, exemple: [2, 225] },
    { id: "wahid", arabe: "وَاحِد", translit: "wāḥid", sens: "Un, Unique", racine: "و ح د", nature: "adjectif", frequence: 68, exemple: [2, 163] },
    { id: "hayy", arabe: "حَيّ", translit: "ḥayy", sens: "Vivant", racine: "ح ي ي", nature: "adjectif", frequence: 189, exemple: [2, 255] },
    { id: "qayyum", arabe: "قَيُّوم", translit: "qayyūm", sens: "Celui qui subsiste par Lui-même", racine: "ق و م", nature: "adjectif", frequence: 660, exemple: [2, 255] },
    { id: "tawwab", arabe: "تَوَّاب", translit: "tawwāb", sens: "qui accueille le repentir", racine: "ت و ب", nature: "adjectif", frequence: 87, exemple: [2, 37] },
    { id: "shakur", arabe: "شَكُور", translit: "shakūr", sens: "Très Reconnaissant", racine: "ش ك ر", nature: "adjectif", frequence: 75, exemple: [35, 30] },
    { id: "nur", arabe: "نُور", translit: "nūr", sens: "lumière", racine: "ن و ر", nature: "nom", frequence: 194, exemple: [24, 35] },
  ],
};

/* ========================================================================
   Pack 3 — Les mots-outils essentiels
   ======================================================================== */

const OUTILS_PREPOSITIONS: PackVocabulaire = {
  id: "outils-prepositions",
  titre: "Les mots-outils essentiels",
  description: "Peu glamour, mais ce sont les mots les plus fréquents du Coran. Ce pack seul fait basculer la lecture.",
  ordre: 3,
  mots: [
    { id: "min", arabe: "مِنْ", translit: "min", sens: "de, depuis, parmi", nature: "particule", frequence: 4083, exemple: [2, 3] },
    { id: "ila", arabe: "إِلَىٰ", translit: "ilā", sens: "vers, jusqu'à", nature: "particule", frequence: 742, exemple: [2, 14] },
    { id: "ala", arabe: "عَلَىٰ", translit: "ʿalā", sens: "sur, contre", nature: "particule", frequence: 1458, exemple: [2, 5] },
    { id: "fi", arabe: "فِي", translit: "fī", sens: "dans, en", nature: "particule", frequence: 1701, exemple: [2, 10] },
    { id: "an", arabe: "عَنْ", translit: "ʿan", sens: "au sujet de, loin de", nature: "particule", frequence: 468, exemple: [2, 189] },
    { id: "maa", arabe: "مَعَ", translit: "maʿa", sens: "avec", nature: "particule", frequence: 164, exemple: [2, 153] },
    { id: "bayna", arabe: "بَيْنَ", translit: "bayna", sens: "entre", racine: "ب ي ن", nature: "particule", frequence: 523, exemple: [2, 66] },
    { id: "inda", arabe: "عِنْدَ", translit: "ʿinda", sens: "auprès de, chez", nature: "particule", frequence: 197, exemple: [2, 54] },
    { id: "baada", arabe: "بَعْدَ", translit: "baʿda", sens: "après", racine: "ب ع د", nature: "particule", frequence: 235, exemple: [2, 27] },
    { id: "qabla", arabe: "قَبْلَ", translit: "qabla", sens: "avant", racine: "ق ب ل", nature: "particule", frequence: 294, exemple: [2, 25] },
    { id: "ladun", arabe: "لَدُنْ", translit: "ladun", sens: "d'auprès de", precision: "Insiste sur l'origine directe : « de la part même de ».", nature: "particule", frequence: 18, exemple: [18, 65] },
    { id: "duna", arabe: "دُونَ", translit: "dūna", sens: "en dehors de, à l'exclusion de", precision: "Très fréquent dans « min dūni-llāh » : en dehors d'Allah.", racine: "د و ن", nature: "particule", frequence: 144, exemple: [2, 23] },
    { id: "fawqa", arabe: "فَوْقَ", translit: "fawqa", sens: "au-dessus de", racine: "ف و ق", nature: "particule", frequence: 43, exemple: [2, 26] },
    { id: "tahta", arabe: "تَحْتَ", translit: "taḥta", sens: "sous, en dessous de", racine: "ت ح ت", nature: "particule", frequence: 51, exemple: [2, 25] },
    { id: "mithl", arabe: "مِثْل", translit: "mithl", sens: "semblable à, comme", racine: "م ث ل", nature: "nom", frequence: 169, exemple: [2, 23] },
    { id: "illa", arabe: "إِلَّا", translit: "illā", sens: "sauf, si ce n'est", precision: "Charnière de l'attestation de foi : « nulle divinité si ce n'est Lui ».", nature: "particule", frequence: 698, exemple: [2, 9] },
    { id: "hatta", arabe: "حَتَّىٰ", translit: "ḥattā", sens: "jusqu'à ce que", nature: "particule", frequence: 142, exemple: [2, 109] },
    { id: "laalla", arabe: "لَعَلَّ", translit: "laʿalla", sens: "afin que, peut-être", precision: "Introduit presque toujours une finalité : « afin que vous soyez reconnaissants ».", nature: "particule", frequence: 129, exemple: [2, 21] },
    { id: "kama", arabe: "كَمَا", translit: "kamā", sens: "de même que, comme", nature: "particule", frequence: 58, exemple: [2, 13] },
  ],
};

/* ========================================================================
   Pack 4 — Les grands verbes
   ======================================================================== */

const GRANDS_VERBES: PackVocabulaire = {
  id: "grands-verbes",
  titre: "Les grands verbes",
  description: "Une vingtaine de verbes portent la majorité des récits du Coran. À eux seuls, ils donnent le squelette de chaque histoire.",
  ordre: 4,
  mots: [
    { id: "qala", arabe: "قَالَ", translit: "qāla", sens: "dire", precision: "Le verbe le plus fréquent du Coran : il ouvre presque tous les dialogues.", racine: "ق و ل", nature: "verbe", frequence: 1722, exemple: [2, 30] },
    { id: "kana", arabe: "كَانَ", translit: "kāna", sens: "être, avoir été", racine: "ك و ن", nature: "verbe", frequence: 1390, exemple: [2, 34] },
    { id: "jaala", arabe: "جَعَلَ", translit: "jaʿala", sens: "faire de, établir, placer", racine: "ج ع ل", nature: "verbe", frequence: 346, exemple: [2, 22] },
    { id: "alima", arabe: "عَلِمَ", translit: "ʿalima", sens: "savoir, connaître", racine: "ع ل م", nature: "verbe", frequence: 854, exemple: [2, 30] },
    { id: "khalaqa", arabe: "خَلَقَ", translit: "khalaqa", sens: "créer", racine: "خ ل ق", nature: "verbe", frequence: 261, exemple: [2, 21] },
    { id: "ata", arabe: "أَتَىٰ", translit: "atā", sens: "venir, survenir", racine: "أ ت ي", nature: "verbe", frequence: 549, exemple: [16, 1] },
    { id: "jaa", arabe: "جَاءَ", translit: "jāʾa", sens: "venir, arriver", racine: "ج ي أ", nature: "verbe", frequence: 278, exemple: [2, 87] },
    { id: "faala", arabe: "فَعَلَ", translit: "faʿala", sens: "faire, accomplir", racine: "ف ع ل", nature: "verbe", frequence: 108, exemple: [2, 24] },
    { id: "amila", arabe: "عَمِلَ", translit: "ʿamila", sens: "œuvrer, agir", precision: "Désigne l'acte concret, souvent associé à « ṣāliḥ » : les bonnes œuvres.", racine: "ع م ل", nature: "verbe", frequence: 360, exemple: [2, 25] },
    { id: "arada", arabe: "أَرَادَ", translit: "arāda", sens: "vouloir, désirer", racine: "ر و د", nature: "verbe", frequence: 148, exemple: [2, 26] },
    { id: "raa", arabe: "رَأَىٰ", translit: "raʾā", sens: "voir, considérer", racine: "ر أ ي", nature: "verbe", frequence: 328, exemple: [2, 55] },
    { id: "samia", arabe: "سَمِعَ", translit: "samiʿa", sens: "entendre, écouter", racine: "س م ع", nature: "verbe", frequence: 185, exemple: [2, 93] },
    { id: "wajada", arabe: "وَجَدَ", translit: "wajada", sens: "trouver", racine: "و ج د", nature: "verbe", frequence: 107, exemple: [4, 43] },
    { id: "akhadha", arabe: "أَخَذَ", translit: "akhadha", sens: "prendre, saisir", racine: "أ خ ذ", nature: "verbe", frequence: 273, exemple: [2, 55] },
    { id: "akhraja", arabe: "أَخْرَجَ", translit: "akhraja", sens: "faire sortir, expulser", racine: "خ ر ج", nature: "verbe", frequence: 182, exemple: [2, 22] },
    { id: "dakhala", arabe: "دَخَلَ", translit: "dakhala", sens: "entrer", racine: "د خ ل", nature: "verbe", frequence: 126, exemple: [2, 58] },
    { id: "nazala", arabe: "نَزَلَ", translit: "nazala", sens: "descendre", precision: "À la forme dérivée « anzala » : faire descendre, révéler.", racine: "ن ز ل", nature: "verbe", frequence: 293, exemple: [2, 4] },
    { id: "kataba", arabe: "كَتَبَ", translit: "kataba", sens: "écrire, prescrire", racine: "ك ت ب", nature: "verbe", frequence: 319, exemple: [2, 183] },
    { id: "amara", arabe: "أَمَرَ", translit: "amara", sens: "ordonner, commander", racine: "أ م ر", nature: "verbe", frequence: 248, exemple: [2, 27] },
    { id: "baatha", arabe: "بَعَثَ", translit: "baʿatha", sens: "envoyer, ressusciter", racine: "ب ع ث", nature: "verbe", frequence: 67, exemple: [2, 56] },
    { id: "rajaa", arabe: "رَجَعَ", translit: "rajaʿa", sens: "revenir, retourner", racine: "ر ج ع", nature: "verbe", frequence: 104, exemple: [2, 18] },
    { id: "daraba", arabe: "ضَرَبَ", translit: "ḍaraba", sens: "frapper, proposer (un exemple)", precision: "« ḍaraba mathalan » : proposer une parabole. Sens très différent du sens propre.", racine: "ض ر ب", nature: "verbe", frequence: 58, exemple: [2, 26] },
    { id: "nazara", arabe: "نَظَرَ", translit: "naẓara", sens: "regarder, observer", racine: "ن ظ ر", nature: "verbe", frequence: 129, exemple: [2, 50] },
  ],
};

/* ========================================================================
   Pack 5 — La foi et la mécréance
   ======================================================================== */

const FOI_MECREANCE: PackVocabulaire = {
  id: "foi-mecreance",
  titre: "La foi et la mécréance",
  description: "Le couple d'opposition qui structure le Coran entier. Ces mots reviennent dans presque chaque page.",
  ordre: 5,
  mots: [
    { id: "amana", arabe: "آمَنَ", translit: "āmana", sens: "croire, avoir foi", precision: "Même racine que « amn », la sécurité : croire, c'est se mettre en sécurité.", racine: "أ م ن", nature: "verbe", frequence: 879, exemple: [2, 3] },
    { id: "iman", arabe: "إِيمَان", translit: "īmān", sens: "la foi", racine: "أ م ن", nature: "nom", frequence: 879, exemple: [49, 7] },
    { id: "mumin", arabe: "مُؤْمِن", translit: "muʾmin", sens: "croyant", racine: "أ م ن", nature: "nom", frequence: 879, exemple: [2, 221] },
    { id: "kafara", arabe: "كَفَرَ", translit: "kafara", sens: "mécroire, renier", precision: "Sens premier de la racine : recouvrir, dissimuler — donc couvrir la vérité.", racine: "ك ف ر", nature: "verbe", frequence: 525, exemple: [2, 6] },
    { id: "kafir", arabe: "كَافِر", translit: "kāfir", sens: "mécréant, négateur", racine: "ك ف ر", nature: "nom", frequence: 525, exemple: [2, 19] },
    { id: "ashraka", arabe: "أَشْرَكَ", translit: "ashraka", sens: "associer (à Allah)", racine: "ش ر ك", nature: "verbe", frequence: 168, exemple: [6, 151] },
    { id: "mushrik", arabe: "مُشْرِك", translit: "mushrik", sens: "associateur, polythéiste", racine: "ش ر ك", nature: "nom", frequence: 168, exemple: [9, 5] },
    { id: "munafiq", arabe: "مُنَافِق", translit: "munāfiq", sens: "hypocrite", racine: "ن ف ق", nature: "nom", frequence: 111, exemple: [4, 138] },
    { id: "shahida", arabe: "شَهِدَ", translit: "shahida", sens: "témoigner, attester", racine: "ش ه د", nature: "verbe", frequence: 160, exemple: [3, 18] },
    { id: "sadaqa", arabe: "صَدَقَ", translit: "ṣadaqa", sens: "dire vrai, être véridique", racine: "ص د ق", nature: "verbe", frequence: 155, exemple: [2, 23] },
    { id: "kadhdhaba", arabe: "كَذَّبَ", translit: "kadhdhaba", sens: "démentir, traiter de mensonge", racine: "ك ذ ب", nature: "verbe", frequence: 282, exemple: [55, 13] },
    { id: "taba", arabe: "تَابَ", translit: "tāba", sens: "se repentir, revenir", racine: "ت و ب", nature: "verbe", frequence: 87, exemple: [2, 37] },
    { id: "istaghfara", arabe: "اِسْتَغْفَرَ", translit: "istaghfara", sens: "demander pardon", racine: "غ ف ر", nature: "verbe", frequence: 234, exemple: [71, 10] },
    { id: "tawakkala", arabe: "تَوَكَّلَ", translit: "tawakkala", sens: "s'en remettre (à Allah)", racine: "و ك ل", nature: "verbe", frequence: 70, exemple: [3, 159] },
    { id: "khafa", arabe: "خَافَ", translit: "khāfa", sens: "craindre, avoir peur", racine: "خ و ف", nature: "verbe", frequence: 124, exemple: [2, 38] },
    { id: "khashiya", arabe: "خَشِيَ", translit: "khashiya", sens: "redouter (avec révérence)", precision: "Crainte mêlée de respect, réservée surtout à Allah — plus forte que khāfa.", racine: "خ ش ي", nature: "verbe", frequence: 48, exemple: [2, 74] },
    { id: "ittaqa", arabe: "اِتَّقَىٰ", translit: "ittaqā", sens: "craindre Allah, se prémunir", racine: "و ق ي", nature: "verbe", frequence: 258, exemple: [2, 2] },
    { id: "taqwa", arabe: "تَقْوَىٰ", translit: "taqwā", sens: "piété, crainte révérencielle", racine: "و ق ي", nature: "nom", frequence: 258, exemple: [2, 197] },
    { id: "muttaqin", arabe: "مُتَّقِين", translit: "muttaqīn", sens: "les pieux, ceux qui craignent Allah", racine: "و ق ي", nature: "nom", frequence: 258, exemple: [2, 2] },
  ],
};

/* ========================================================================
   Pack 6 — Le Livre et la révélation
   ======================================================================== */

const LIVRE_REVELATION: PackVocabulaire = {
  id: "livre-revelation",
  titre: "Le Livre et la révélation",
  description: "Le vocabulaire que le Coran emploie pour parler de lui-même : Livre, signe, rappel, vérité.",
  ordre: 6,
  mots: [
    { id: "kitab", arabe: "كِتَاب", translit: "kitāb", sens: "Livre, Écriture", precision: "Désigne le Livre révélé, mais aussi l'écrit et le registre où sont consignés les actes.", racine: "ك ت ب", nature: "nom", frequence: 319, exemple: [2, 2] },
    { id: "quran", arabe: "قُرْآن", translit: "qurʾān", sens: "Coran, récitation", precision: "Littéralement « ce qui est récité », de la racine qaraʾa : lire à voix haute.", racine: "ق ر أ", nature: "nom", frequence: 88, exemple: [2, 185] },
    { id: "aya", arabe: "آيَة", translit: "āya", sens: "signe, verset, prodige", precision: "Un même mot pour le verset du Livre et le signe dans la création.", racine: "أ ي ي", nature: "nom", frequence: 597, exemple: [2, 106] },
    { id: "anzala", arabe: "أَنْزَلَ", translit: "anzala", sens: "faire descendre, révéler", racine: "ن ز ل", nature: "verbe", frequence: 293, exemple: [2, 4] },
    { id: "wahy", arabe: "وَحْي", translit: "waḥy", sens: "révélation, inspiration", racine: "و ح ي", nature: "nom", frequence: 78, exemple: [53, 4] },
    { id: "dhikr", arabe: "ذِكْر", translit: "dhikr", sens: "rappel, évocation", precision: "Le rappel et l'évocation — et l'un des noms que le Coran se donne à lui-même.", racine: "ذ ك ر", nature: "nom", frequence: 292, exemple: [15, 9] },
    { id: "dhakara", arabe: "ذَكَرَ", translit: "dhakara", sens: "évoquer, mentionner, se souvenir", racine: "ذ ك ر", nature: "verbe", frequence: 292, exemple: [2, 152] },
    { id: "tala", arabe: "تَلَا", translit: "talā", sens: "réciter, suivre", racine: "ت ل و", nature: "verbe", frequence: 63, exemple: [2, 102] },
    { id: "qaraa", arabe: "قَرَأَ", translit: "qaraʾa", sens: "lire, réciter", racine: "ق ر أ", nature: "verbe", frequence: 88, exemple: [96, 1] },
    { id: "hikma", arabe: "حِكْمَة", translit: "ḥikma", sens: "sagesse", racine: "ح ك م", nature: "nom", frequence: 210, exemple: [2, 129] },
    { id: "bayyina", arabe: "بَيِّنَة", translit: "bayyina", sens: "preuve évidente", racine: "ب ي ن", nature: "nom", frequence: 523, exemple: [2, 87] },
    { id: "bayyana", arabe: "بَيَّنَ", translit: "bayyana", sens: "exposer clairement, expliquer", racine: "ب ي ن", nature: "verbe", frequence: 523, exemple: [2, 160] },
    { id: "ilm", arabe: "عِلْم", translit: "ʿilm", sens: "science, savoir", racine: "ع ل م", nature: "nom", frequence: 854, exemple: [2, 32] },
    { id: "haqq", arabe: "حَقّ", translit: "ḥaqq", sens: "vérité, droit, ce qui est dû", precision: "La vérité, mais aussi le droit qui revient à quelqu'un. Al-Ḥaqq est l'un des noms d'Allah.", racine: "ح ق ق", nature: "nom", frequence: 287, exemple: [2, 26] },
    { id: "batil", arabe: "بَاطِل", translit: "bāṭil", sens: "faux, vain, sans fondement", racine: "ب ط ل", nature: "nom", frequence: 36, exemple: [2, 42] },
    { id: "tawrat", arabe: "تَوْرَاة", translit: "tawrāt", sens: "la Torah", nature: "nomPropre", frequence: 18, exemple: [3, 3] },
    { id: "injil", arabe: "إِنْجِيل", translit: "injīl", sens: "l'Évangile", nature: "nomPropre", frequence: 12, exemple: [3, 3] },
  ],
};

/* ========================================================================
   Pack 7 — Pronoms et démonstratifs
   ======================================================================== */

const PRONOMS: PackVocabulaire = {
  id: "pronoms",
  titre: "Pronoms et démonstratifs",
  description: "Qui parle, de qui parle-t-on ? Sans ces mots, impossible de suivre un dialogue coranique.",
  ordre: 7,
  mots: [
    { id: "huwa", arabe: "هُوَ", translit: "huwa", sens: "il, lui", nature: "pronom", frequence: 481, exemple: [112, 1] },
    { id: "hiya", arabe: "هِيَ", translit: "hiya", sens: "elle", nature: "pronom", frequence: 63, exemple: [2, 68] },
    { id: "hum", arabe: "هُمْ", translit: "hum", sens: "ils, eux", nature: "pronom", frequence: 8, exemple: [2, 5] },
    { id: "anta", arabe: "أَنْتَ", translit: "anta", sens: "tu, toi (masculin)", nature: "pronom", frequence: 81, exemple: [2, 32] },
    { id: "ana", arabe: "أَنَا", translit: "anā", sens: "je, moi", nature: "pronom", frequence: 68, exemple: [2, 258] },
    { id: "nahnu", arabe: "نَحْنُ", translit: "naḥnu", sens: "nous", nature: "pronom", frequence: 86, exemple: [15, 9] },
    { id: "hadha", arabe: "هَٰذَا", translit: "hādhā", sens: "ceci, celui-ci", nature: "pronom", frequence: 190, exemple: [2, 25] },
    { id: "hadhihi", arabe: "هَٰذِهِ", translit: "hādhihi", sens: "celle-ci, cette", nature: "pronom", frequence: 46, exemple: [2, 35] },
    { id: "dhalika", arabe: "ذَٰلِكَ", translit: "dhālika", sens: "cela, celui-là", precision: "Le démonstratif du lointain : marque la distance ou la solennité.", nature: "pronom", frequence: 280, exemple: [2, 2] },
    { id: "tilka", arabe: "تِلْكَ", translit: "tilka", sens: "celle-là, ces", nature: "pronom", frequence: 28, exemple: [2, 134] },
    { id: "ulaika", arabe: "أُولَٰئِكَ", translit: "ulāʾika", sens: "ceux-là", precision: "Ouvre presque toujours un verdict : « ceux-là sont les bien-guidés ».", nature: "pronom", frequence: 133, exemple: [2, 5] },
    { id: "alladhi", arabe: "الَّذِي", translit: "alladhī", sens: "celui qui", nature: "pronom", frequence: 1468, exemple: [2, 17] },
    { id: "alladhina", arabe: "الَّذِينَ", translit: "alladhīna", sens: "ceux qui", nature: "pronom", frequence: 1000, exemple: [2, 3] },
    { id: "allati", arabe: "الَّتِي", translit: "allatī", sens: "celle qui", nature: "pronom", frequence: 77, exemple: [2, 24] },
    { id: "man", arabe: "مَنْ", translit: "man", sens: "qui, celui qui", precision: "Sert à la fois d'interrogatif et de relatif — pour les êtres doués de raison.", nature: "pronom", frequence: 4083, exemple: [2, 8] },
    { id: "ma", arabe: "مَا", translit: "mā", sens: "ce que / ne pas", precision: "Deux emplois distincts : relatif pour les choses, et négation du passé.", nature: "particule", frequence: 2565, exemple: [2, 3] },
    { id: "kull", arabe: "كُلّ", translit: "kull", sens: "chaque, tout, tous", racine: "ك ل ل", nature: "nom", frequence: 377, exemple: [2, 20] },
    { id: "baad", arabe: "بَعْض", translit: "baʿḍ", sens: "une partie, certains", racine: "ب ع ض", nature: "nom", frequence: 158, exemple: [2, 36] },
  ],
};

/* ========================================================================
   Pack 8 — L'au-delà
   ======================================================================== */

const AU_DELA: PackVocabulaire = {
  id: "au-dela",
  titre: "L'au-delà : Paradis et Enfer",
  description: "Le champ lexical du Jour dernier, omniprésent dans les sourates mecquoises et le juz 'Amma.",
  ordre: 8,
  mots: [
    { id: "akhira", arabe: "آخِرَة", translit: "ākhira", sens: "l'au-delà, la vie dernière", racine: "أ خ ر", nature: "nom", frequence: 250, exemple: [2, 4] },
    { id: "dunya", arabe: "دُنْيَا", translit: "dunyā", sens: "ici-bas, ce monde", precision: "Littéralement « la plus proche » — la vie immédiate, par opposition à l'ākhira.", racine: "د ن و", nature: "nom", frequence: 133, exemple: [2, 85] },
    { id: "qiyama", arabe: "قِيَامَة", translit: "qiyāma", sens: "Résurrection", racine: "ق و م", nature: "nom", frequence: 660, exemple: [2, 85] },
    { id: "saa", arabe: "سَاعَة", translit: "sāʿa", sens: "l'Heure", precision: "Employé absolument, désigne l'Heure du Jugement.", racine: "س و ع", nature: "nom", frequence: 49, exemple: [7, 187] },
    { id: "janna", arabe: "جَنَّة", translit: "janna", sens: "Paradis, jardin", precision: "Racine « jann » : ce qui est couvert, caché — un jardin dense aux arbres serrés.", racine: "ج ن ن", nature: "nom", frequence: 201, exemple: [2, 25] },
    { id: "nar", arabe: "نَار", translit: "nār", sens: "Feu, Enfer", racine: "ن و ر", nature: "nom", frequence: 194, exemple: [2, 24] },
    { id: "jahannam", arabe: "جَهَنَّم", translit: "jahannam", sens: "la Géhenne", nature: "nomPropre", frequence: 77, exemple: [2, 206] },
    { id: "adhab", arabe: "عَذَاب", translit: "ʿadhāb", sens: "châtiment, tourment", precision: "Couvre aussi bien la peine de l'au-delà que les épreuves envoyées ici-bas.", racine: "ع ذ ب", nature: "nom", frequence: 373, exemple: [2, 7] },
    { id: "hisab", arabe: "حِسَاب", translit: "ḥisāb", sens: "compte, reddition des comptes", racine: "ح س ب", nature: "nom", frequence: 109, exemple: [13, 40] },
    { id: "mawt", arabe: "مَوْت", translit: "mawt", sens: "la mort", racine: "م و ت", nature: "nom", frequence: 165, exemple: [3, 185] },
    { id: "mata", arabe: "مَاتَ", translit: "māta", sens: "mourir", racine: "م و ت", nature: "verbe", frequence: 165, exemple: [2, 132] },
    { id: "hayat", arabe: "حَيَاة", translit: "ḥayāt", sens: "la vie", racine: "ح ي ي", nature: "nom", frequence: 189, exemple: [2, 85] },
    { id: "ahya", arabe: "أَحْيَا", translit: "aḥyā", sens: "faire vivre, redonner vie", racine: "ح ي ي", nature: "verbe", frequence: 189, exemple: [2, 73] },
    { id: "khalid", arabe: "خَالِد", translit: "khālid", sens: "éternel, qui demeure à jamais", racine: "خ ل د", nature: "adjectif", frequence: 87, exemple: [2, 25] },
    { id: "abad", arabe: "أَبَدًا", translit: "abadan", sens: "à jamais, éternellement", racine: "أ ب د", nature: "particule", frequence: 28, exemple: [4, 57] },
    { id: "ruh", arabe: "رُوح", translit: "rūḥ", sens: "esprit, souffle", precision: "Désigne aussi l'ange Gabriel, « ar-Rūḥ al-Amīn », l'Esprit fidèle.", racine: "ر و ح", nature: "nom", frequence: 57, exemple: [17, 85] },
    { id: "malak", arabe: "مَلَك", translit: "malak", sens: "ange", precision: "À une lettre près de « malik » (le roi) et « mālik » (le possesseur) : à ne pas confondre en lecture.", racine: "م ل ك", nature: "nom", frequence: 206, exemple: [2, 30] },
    { id: "shaytan", arabe: "شَيْطَان", translit: "shayṭān", sens: "diable, Satan", precision: "Nom commun avant d'être un nom propre : tout être rebelle, homme ou djinn, peut être ainsi nommé.", racine: "ش ط ن", nature: "nom", frequence: 88, exemple: [2, 36] },
    { id: "iblis", arabe: "إِبْلِيس", translit: "iblīs", sens: "Iblîs", nature: "nomPropre", frequence: 11, exemple: [2, 34] },
    { id: "jinn", arabe: "جِنّ", translit: "jinn", sens: "les djinns", precision: "Même racine que « janna » : ce qui est dérobé aux regards.", racine: "ج ن ن", nature: "nom", frequence: 201, exemple: [55, 33] },
    { id: "ajr", arabe: "أَجْر", translit: "ajr", sens: "récompense, salaire", precision: "Le mot du salaire de l'ouvrier, employé pour la récompense de l'au-delà.", racine: "أ ج ر", nature: "nom", frequence: 108, exemple: [2, 62] },
  ],
};

/* ========================================================================
   Pack 9 — Le ciel, la terre et la création
   ======================================================================== */

const CREATION: PackVocabulaire = {
  id: "creation",
  titre: "Le ciel, la terre et la création",
  description: "Les signes de la création, que le Coran convoque sans cesse comme preuves. Vocabulaire très concret et facile à visualiser.",
  ordre: 9,
  mots: [
    { id: "sama", arabe: "سَمَاء", translit: "samāʾ", sens: "ciel", racine: "س م و", nature: "nom", frequence: 381, exemple: [2, 22] },
    { id: "ard", arabe: "أَرْض", translit: "arḍ", sens: "terre", racine: "أ ر ض", nature: "nom", frequence: 461, exemple: [2, 22] },
    { id: "shams", arabe: "شَمْس", translit: "shams", sens: "soleil", racine: "ش م س", nature: "nom", frequence: 33, exemple: [91, 1] },
    { id: "qamar", arabe: "قَمَر", translit: "qamar", sens: "lune", racine: "ق م ر", nature: "nom", frequence: 27, exemple: [91, 2] },
    { id: "najm", arabe: "نَجْم", translit: "najm", sens: "étoile", racine: "ن ج م", nature: "nom", frequence: 13, exemple: [53, 1] },
    { id: "layl", arabe: "لَيْل", translit: "layl", sens: "nuit", racine: "ل ي ل", nature: "nom", frequence: 92, exemple: [2, 164] },
    { id: "nahar", arabe: "نَهَار", translit: "nahār", sens: "jour, clarté du jour", racine: "ن ه ر", nature: "nom", frequence: 113, exemple: [2, 164] },
    { id: "maa-eau", arabe: "مَاء", translit: "māʾ", sens: "eau", racine: "م و ه", nature: "nom", frequence: 63, exemple: [2, 22] },
    { id: "rih", arabe: "رِيح", translit: "rīḥ", sens: "vent", racine: "ر و ح", nature: "nom", frequence: 57, exemple: [2, 164] },
    { id: "sahab", arabe: "سَحَاب", translit: "saḥāb", sens: "nuage", racine: "س ح ب", nature: "nom", frequence: 11, exemple: [2, 164] },
    { id: "jabal", arabe: "جَبَل", translit: "jabal", sens: "montagne", racine: "ج ب ل", nature: "nom", frequence: 41, exemple: [7, 143] },
    { id: "bahr", arabe: "بَحْر", translit: "baḥr", sens: "mer", racine: "ب ح ر", nature: "nom", frequence: 42, exemple: [2, 50] },
    { id: "nahr", arabe: "نَهْر", translit: "nahr", sens: "fleuve, rivière", precision: "Le pluriel « anhār » apparaît dans la formule « des rivières coulent en dessous ».", racine: "ن ه ر", nature: "nom", frequence: 113, exemple: [2, 25] },
    { id: "shajar", arabe: "شَجَر", translit: "shajar", sens: "arbre", racine: "ش ج ر", nature: "nom", frequence: 27, exemple: [2, 35] },
    { id: "thamar", arabe: "ثَمَر", translit: "thamar", sens: "fruit", racine: "ث م ر", nature: "nom", frequence: 24, exemple: [2, 22] },
    { id: "dabba", arabe: "دَابَّة", translit: "dābba", sens: "bête, créature qui se meut", racine: "د ب ب", nature: "nom", frequence: 18, exemple: [2, 164] },
    { id: "tayr", arabe: "طَيْر", translit: "ṭayr", sens: "oiseau", racine: "ط ي ر", nature: "nom", frequence: 29, exemple: [2, 260] },
    { id: "khalq", arabe: "خَلْق", translit: "khalq", sens: "création, créatures", racine: "خ ل ق", nature: "nom", frequence: 261, exemple: [2, 164] },
    { id: "nafs", arabe: "نَفْس", translit: "nafs", sens: "âme, personne, soi-même", precision: "Souvent réfléchi : « ils se font du tort à eux-mêmes » (anfusahum).", racine: "ن ف س", nature: "nom", frequence: 298, exemple: [2, 48] },
    { id: "turab", arabe: "تُرَاب", translit: "turāb", sens: "poussière, terre", racine: "ت ر ب", nature: "nom", frequence: 22, exemple: [3, 59] },
  ],
};

/* ========================================================================
   Pack 10 — Négations, conditions et liaisons
   ======================================================================== */

const OUTILS_LIAISONS: PackVocabulaire = {
  id: "outils-liaisons",
  titre: "Négations, conditions et liaisons",
  description: "La charpente logique de la phrase : nier, relier, poser une condition. Deuxième pack de mots-outils, aussi rentable que le premier.",
  ordre: 10,
  mots: [
    { id: "thumma", arabe: "ثُمَّ", translit: "thumma", sens: "puis, ensuite", precision: "Succession avec délai, contrairement à « fa » qui enchaîne immédiatement.", nature: "particule", frequence: 342, exemple: [2, 28] },
    { id: "aw", arabe: "أَوْ", translit: "aw", sens: "ou", nature: "particule", frequence: 280, exemple: [77, 6] },
    { id: "lakin", arabe: "لَٰكِنْ", translit: "lākin", sens: "mais, cependant", nature: "particule", frequence: 130, exemple: [2, 12] },
    { id: "bal", arabe: "بَلْ", translit: "bal", sens: "au contraire, bien plutôt", nature: "particule", frequence: 127, exemple: [2, 88] },
    { id: "la-negation", arabe: "لَا", translit: "lā", sens: "non, ne pas", nature: "particule", frequence: 1742, exemple: [2, 2] },
    { id: "lam", arabe: "لَمْ", translit: "lam", sens: "ne pas (au passé)", precision: "Suivi de l'inaccompli, mais nie le passé : « lam yalid » — Il n'a pas engendré.", nature: "particule", frequence: 352, exemple: [112, 3] },
    { id: "lan", arabe: "لَنْ", translit: "lan", sens: "ne jamais (futur)", nature: "particule", frequence: 108, exemple: [2, 55] },
    { id: "laysa", arabe: "لَيْسَ", translit: "laysa", sens: "ne pas être", nature: "verbe", frequence: 89, exemple: [2, 189] },
    { id: "ghayr", arabe: "غَيْر", translit: "ghayr", sens: "autre que, sans", racine: "غ ي ر", nature: "nom", frequence: 154, exemple: [1, 7] },
    { id: "in-condition", arabe: "إِنْ", translit: "in", sens: "si (condition réelle)", nature: "particule", frequence: 3372, exemple: [2, 23] },
    { id: "idha", arabe: "إِذَا", translit: "idhā", sens: "lorsque, quand", nature: "particule", frequence: 454, exemple: [2, 11] },
    { id: "idh", arabe: "إِذْ", translit: "idh", sens: "lorsque (dans le passé)", precision: "Ouvre les récits : « wa idh qāla rabbuka » — et lorsque ton Seigneur dit.", nature: "particule", frequence: 309, exemple: [2, 30] },
    { id: "law", arabe: "لَوْ", translit: "law", sens: "si (hypothèse irréelle)", nature: "particule", frequence: 202, exemple: [2, 20] },
    { id: "inna", arabe: "إِنَّ", translit: "inna", sens: "certes, en vérité", nature: "particule", frequence: 3372, exemple: [2, 6] },
    { id: "anna", arabe: "أَنَّ", translit: "anna", sens: "que (conjonction)", nature: "particule", frequence: 3372, exemple: [2, 25] },
    { id: "qad", arabe: "قَدْ", translit: "qad", sens: "certes, déjà", nature: "particule", frequence: 410, exemple: [23, 1] },
    { id: "kayfa", arabe: "كَيْفَ", translit: "kayfa", sens: "comment", nature: "particule", frequence: 83, exemple: [2, 28] },
    { id: "ayna", arabe: "أَيْنَ", translit: "ayna", sens: "où", nature: "particule", frequence: 19, exemple: [2, 148] },
    { id: "amma", arabe: "أَمَّا", translit: "ammā", sens: "quant à", nature: "particule", frequence: 78, exemple: [2, 26] },
  ],
};

/* ========================================================================
   Pack 11 — L'homme : corps et âme
   ======================================================================== */

const HOMME: PackVocabulaire = {
  id: "homme",
  titre: "L'homme : corps et âme",
  description: "Cœur, yeux, oreilles, mains : le Coran décrit l'être humain par ses organes autant que par ses actes.",
  ordre: 11,
  mots: [
    { id: "insan", arabe: "إِنْسَان", translit: "insān", sens: "l'être humain", precision: "L'homme dans sa nature, souvent accompagné d'un reproche : pressé, oublieux, ingrat.", racine: "أ ن س", nature: "nom", frequence: 338, exemple: [76, 1] },
    { id: "nas", arabe: "نَاس", translit: "nās", sens: "les gens, les hommes", precision: "Pluriel collectif sans singulier : les gens pris en masse, l'humanité.", racine: "ن و س", nature: "nom", frequence: 241, exemple: [2, 8] },
    { id: "qalb", arabe: "قَلْب", translit: "qalb", sens: "cœur", precision: "Racine « qalaba » : retourner — le cœur est ce qui se retourne, change d'état.", racine: "ق ل ب", nature: "nom", frequence: 168, exemple: [2, 7] },
    { id: "sadr", arabe: "صَدْر", translit: "ṣadr", sens: "poitrine, for intérieur", racine: "ص د ر", nature: "nom", frequence: 46, exemple: [94, 1] },
    { id: "ayn", arabe: "عَيْن", translit: "ʿayn", sens: "œil, source d'eau", racine: "ع ي ن", nature: "nom", frequence: 65, exemple: [5, 45] },
    { id: "yad", arabe: "يَد", translit: "yad", sens: "main", racine: "ي د ي", nature: "nom", frequence: 120, exemple: [2, 79] },
    { id: "wajh", arabe: "وَجْه", translit: "wajh", sens: "visage, face", precision: "« Wajh Allah » : la Face d'Allah, c'est-à-dire Son agrément.", racine: "و ج ه", nature: "nom", frequence: 78, exemple: [2, 112] },
    { id: "lisan", arabe: "لِسَان", translit: "lisān", sens: "langue, langage", racine: "ل س ن", nature: "nom", frequence: 25, exemple: [14, 4] },
    { id: "udhun", arabe: "أُذُن", translit: "udhun", sens: "oreille", racine: "أ ذ ن", nature: "nom", frequence: 102, exemple: [5, 45] },
    { id: "ras", arabe: "رَأْس", translit: "raʾs", sens: "tête", racine: "ر أ س", nature: "nom", frequence: 18, exemple: [2, 196] },
    { id: "rijl", arabe: "رِجْل", translit: "rijl", sens: "pied, jambe", racine: "ر ج ل", nature: "nom", frequence: 73, exemple: [24, 45] },
    { id: "jild", arabe: "جِلْد", translit: "jild", sens: "peau", racine: "ج ل د", nature: "nom", frequence: 13, exemple: [4, 56] },
    { id: "dam", arabe: "دَم", translit: "dam", sens: "sang", racine: "د م و", nature: "nom", frequence: 10, exemple: [2, 173] },
    { id: "aqala", arabe: "عَقَلَ", translit: "ʿaqala", sens: "raisonner, comprendre", precision: "Presque toujours à l'inaccompli pluriel : « afalā taʿqilūn » — ne raisonnez-vous donc pas ?", racine: "ع ق ل", nature: "verbe", frequence: 49, exemple: [2, 44] },
    { id: "faqiha", arabe: "فَقِهَ", translit: "faqiha", sens: "comprendre en profondeur", racine: "ف ق ه", nature: "verbe", frequence: 20, exemple: [4, 78] },
    { id: "dhaqa", arabe: "ذَاقَ", translit: "dhāqa", sens: "goûter, éprouver", racine: "ذ و ق", nature: "verbe", frequence: 63, exemple: [3, 106] },
  ],
};

/* ========================================================================
   Pack 12 — Le bien, le mal et la piété
   ======================================================================== */

const BIEN_MAL: PackVocabulaire = {
  id: "bien-mal",
  titre: "Le bien, le mal et la piété",
  description: "Le vocabulaire moral du Coran : injustice, pardon, patience, reconnaissance. Indispensable pour comprendre les versets d'exhortation.",
  ordre: 12,
  mots: [
    { id: "khayr", arabe: "خَيْر", translit: "khayr", sens: "bien, meilleur", precision: "Sert aussi de comparatif : « khayrun min » — meilleur que.", racine: "خ ي ر", nature: "nom", frequence: 196, exemple: [2, 105] },
    { id: "sharr", arabe: "شَرّ", translit: "sharr", sens: "mal, pire", racine: "ش ر ر", nature: "nom", frequence: 31, exemple: [113, 2] },
    { id: "salih", arabe: "صَالِح", translit: "ṣāliḥ", sens: "bon, vertueux, pieux", precision: "« ʿamila ṣāliḥan » : accomplir une bonne œuvre — formule récurrente.", racine: "ص ل ح", nature: "adjectif", frequence: 180, exemple: [2, 25] },
    { id: "hasana", arabe: "حَسَنَة", translit: "ḥasana", sens: "bonne action, bienfait", racine: "ح س ن", nature: "nom", frequence: 194, exemple: [4, 79] },
    { id: "sayyia", arabe: "سَيِّئَة", translit: "sayyiʾa", sens: "mauvaise action, méfait", racine: "س و أ", nature: "nom", frequence: 167, exemple: [4, 79] },
    { id: "zalama", arabe: "ظَلَمَ", translit: "ẓalama", sens: "être injuste, opprimer", precision: "Sens premier : mettre une chose hors de sa place — d'où l'injustice.", racine: "ظ ل م", nature: "verbe", frequence: 315, exemple: [2, 35] },
    { id: "zalim", arabe: "ظَالِم", translit: "ẓālim", sens: "injuste, oppresseur", racine: "ظ ل م", nature: "nom", frequence: 315, exemple: [2, 35] },
    { id: "zulm", arabe: "ظُلْم", translit: "ẓulm", sens: "injustice", racine: "ظ ل م", nature: "nom", frequence: 315, exemple: [31, 13] },
    { id: "fasad", arabe: "فَسَاد", translit: "fasād", sens: "corruption, désordre", racine: "ف س د", nature: "nom", frequence: 50, exemple: [2, 11] },
    { id: "ithm", arabe: "إِثْم", translit: "ithm", sens: "péché", racine: "أ ث م", nature: "nom", frequence: 48, exemple: [2, 219] },
    { id: "dhanb", arabe: "ذَنْب", translit: "dhanb", sens: "péché, faute", racine: "ذ ن ب", nature: "nom", frequence: 39, exemple: [3, 16] },
    { id: "afa", arabe: "عَفَا", translit: "ʿafā", sens: "pardonner, effacer", racine: "ع ف و", nature: "verbe", frequence: 35, exemple: [2, 109] },
    { id: "ghafara", arabe: "غَفَرَ", translit: "ghafara", sens: "pardonner, couvrir la faute", racine: "غ ف ر", nature: "verbe", frequence: 234, exemple: [2, 58] },
    { id: "rahima", arabe: "رَحِمَ", translit: "raḥima", sens: "faire miséricorde", racine: "ر ح م", nature: "verbe", frequence: 339, exemple: [2, 64] },
    { id: "sabara", arabe: "صَبَرَ", translit: "ṣabara", sens: "être patient, endurer", racine: "ص ب ر", nature: "verbe", frequence: 103, exemple: [2, 45] },
    { id: "sabr", arabe: "صَبْر", translit: "ṣabr", sens: "patience, endurance", racine: "ص ب ر", nature: "nom", frequence: 103, exemple: [2, 45] },
    { id: "shakara", arabe: "شَكَرَ", translit: "shakara", sens: "être reconnaissant, remercier", racine: "ش ك ر", nature: "verbe", frequence: 75, exemple: [2, 152] },
    { id: "istakbara", arabe: "اِسْتَكْبَرَ", translit: "istakbara", sens: "s'enfler d'orgueil, se montrer hautain", racine: "ك ب ر", nature: "verbe", frequence: 161, exemple: [2, 34] },
    { id: "ahabba", arabe: "أَحَبَّ", translit: "aḥabba", sens: "aimer", racine: "ح ب ب", nature: "verbe", frequence: 95, exemple: [2, 165] },
    { id: "kariha", arabe: "كَرِهَ", translit: "kariha", sens: "détester, répugner", racine: "ك ر ه", nature: "verbe", frequence: 41, exemple: [2, 216] },
    { id: "adl", arabe: "عَدْل", translit: "ʿadl", sens: "justice, équité", racine: "ع د ل", nature: "nom", frequence: 28, exemple: [16, 90] },
  ],
};

/* ========================================================================
   Pack 13 — Les prophètes et les peuples
   ======================================================================== */

const PROPHETES: PackVocabulaire = {
  id: "prophetes",
  titre: "Les prophètes et les peuples",
  description: "Les noms propres et les mots qui reviennent dans tous les récits : messager, peuple, communauté.",
  ordre: 13,
  mots: [
    { id: "rasul", arabe: "رَسُول", translit: "rasūl", sens: "messager, envoyé", precision: "Un rasūl apporte une Loi nouvelle, un nabī prêche celle du messager qui l'a précédé : tout messager est prophète, l'inverse est faux.", racine: "ر س ل", nature: "nom", frequence: 513, exemple: [2, 87] },
    { id: "nabi", arabe: "نَبِيّ", translit: "nabī", sens: "prophète", precision: "De la racine « nabaʾ », la nouvelle : le prophète est celui qui transmet une annonce.", racine: "ن ب أ", nature: "nom", frequence: 160, exemple: [2, 136] },
    { id: "arsala", arabe: "أَرْسَلَ", translit: "arsala", sens: "envoyer", racine: "ر س ل", nature: "verbe", frequence: 513, exemple: [2, 151] },
    { id: "qawm", arabe: "قَوْم", translit: "qawm", sens: "peuple, gens", precision: "Désigne un groupe uni par le lien tribal ou l'appartenance à un prophète.", racine: "ق و م", nature: "nom", frequence: 660, exemple: [2, 54] },
    { id: "umma", arabe: "أُمَّة", translit: "umma", sens: "communauté, nation", precision: "Un groupe uni par une même croyance ou une même destinée — jamais par le sang.", racine: "أ م م", nature: "nom", frequence: 119, exemple: [2, 143] },
    { id: "ahl", arabe: "أَهْل", translit: "ahl", sens: "les gens de, la famille de", precision: "« ahl al-kitāb » : les gens du Livre.", racine: "أ ه ل", nature: "nom", frequence: 127, exemple: [3, 64] },
    { id: "adam", arabe: "آدَم", translit: "Ādam", sens: "Adam", nature: "nomPropre", frequence: 25, exemple: [2, 31] },
    { id: "nuh", arabe: "نُوح", translit: "Nūḥ", sens: "Noé", nature: "nomPropre", frequence: 43, exemple: [11, 25] },
    { id: "ibrahim", arabe: "إِبْرَاهِيم", translit: "Ibrāhīm", sens: "Abraham", nature: "nomPropre", frequence: 69, exemple: [2, 124] },
    { id: "musa", arabe: "مُوسَىٰ", translit: "Mūsā", sens: "Moïse", precision: "Le prophète le plus cité du Coran.", nature: "nomPropre", frequence: 136, exemple: [2, 51] },
    { id: "isa", arabe: "عِيسَىٰ", translit: "ʿĪsā", sens: "Jésus", nature: "nomPropre", frequence: 25, exemple: [3, 45] },
    { id: "muhammad", arabe: "مُحَمَّد", translit: "Muḥammad", sens: "Muhammad", precision: "Nommé quatre fois seulement, le plus souvent désigné par « le Messager ».", nature: "nomPropre", frequence: 4, exemple: [3, 144] },
    { id: "maryam", arabe: "مَرْيَم", translit: "Maryam", sens: "Marie", precision: "Seule femme nommée dans le Coran.", nature: "nomPropre", frequence: 34, exemple: [3, 42] },
    { id: "firawn", arabe: "فِرْعَوْن", translit: "Firʿawn", sens: "Pharaon", nature: "nomPropre", frequence: 74, exemple: [2, 49] },
    { id: "bani-israil", arabe: "إِسْرَائِيل", translit: "Isrāʾīl", sens: "Israël", precision: "Presque toujours dans « banū Isrāʾīl » : les Enfants d'Israël.", nature: "nomPropre", frequence: 43, exemple: [2, 40] },
    { id: "yahud", arabe: "يَهُود", translit: "yahūd", sens: "les Juifs", racine: "ه و د", nature: "nom", frequence: 30, exemple: [2, 120] },
    { id: "nasara", arabe: "نَصَارَىٰ", translit: "naṣārā", sens: "les Chrétiens", racine: "ن ص ر", nature: "nom", frequence: 158, exemple: [2, 120] },
  ],
};

/* ========================================================================
   Pack 14 — L'adoration
   ======================================================================== */

const ADORATION: PackVocabulaire = {
  id: "adoration",
  titre: "L'adoration : prière et rites",
  description: "Prière, aumône, jeûne, invocation : les mots des versets qui prescrivent les actes du culte.",
  ordre: 14,
  mots: [
    { id: "salat", arabe: "صَلَاة", translit: "ṣalāt", sens: "prière", precision: "La prière rituelle, mais aussi la bénédiction : « Allah et Ses anges prient sur le Prophète ».", racine: "ص ل و", nature: "nom", frequence: 99, exemple: [2, 3] },
    { id: "aqama", arabe: "أَقَامَ", translit: "aqāma", sens: "accomplir, établir", precision: "« aqāma aṣ-ṣalāt » : accomplir la prière — littéralement la maintenir droite.", racine: "ق و م", nature: "verbe", frequence: 660, exemple: [2, 3] },
    { id: "zakat", arabe: "زَكَاة", translit: "zakāt", sens: "aumône légale", precision: "Racine « zakā » : purifier et faire croître.", racine: "ز ك و", nature: "nom", frequence: 59, exemple: [2, 43] },
    { id: "siyam", arabe: "صِيَام", translit: "ṣiyām", sens: "jeûne", precision: "Sens premier de la racine : s'abstenir, se retenir — pas seulement de nourriture.", racine: "ص و م", nature: "nom", frequence: 14, exemple: [2, 183] },
    { id: "hajj", arabe: "حَجّ", translit: "ḥajj", sens: "pèlerinage", precision: "Sens premier de la racine : se rendre quelque part avec une intention arrêtée.", racine: "ح ج ج", nature: "nom", frequence: 33, exemple: [2, 197] },
    { id: "sajada", arabe: "سَجَدَ", translit: "sajada", sens: "se prosterner", racine: "س ج د", nature: "verbe", frequence: 92, exemple: [2, 34] },
    { id: "rakaa", arabe: "رَكَعَ", translit: "rakaʿa", sens: "s'incliner", racine: "ر ك ع", nature: "verbe", frequence: 13, exemple: [2, 43] },
    { id: "masjid", arabe: "مَسْجِد", translit: "masjid", sens: "mosquée, lieu de prosternation", racine: "س ج د", nature: "nom", frequence: 92, exemple: [2, 114] },
    { id: "daa", arabe: "دَعَا", translit: "daʿā", sens: "invoquer, appeler", racine: "د ع و", nature: "verbe", frequence: 212, exemple: [2, 186] },
    { id: "dua", arabe: "دُعَاء", translit: "duʿāʾ", sens: "invocation, appel", racine: "د ع و", nature: "nom", frequence: 212, exemple: [2, 186] },
    { id: "sabbaha", arabe: "سَبَّحَ", translit: "sabbaḥa", sens: "glorifier, exalter", precision: "Déclarer Allah exempt de tout défaut — d'où l'exclamation « subḥāna-llāh ».", racine: "س ب ح", nature: "verbe", frequence: 92, exemple: [17, 44] },
    { id: "istajaba", arabe: "اِسْتَجَابَ", translit: "istajāba", sens: "exaucer, répondre", racine: "ج و ب", nature: "verbe", frequence: 43, exemple: [2, 186] },
    { id: "anfaqa", arabe: "أَنْفَقَ", translit: "anfaqa", sens: "dépenser (dans la voie d'Allah)", racine: "ن ف ق", nature: "verbe", frequence: 111, exemple: [2, 3] },
    { id: "sadaqa-aumone", arabe: "صَدَقَة", translit: "ṣadaqa", sens: "aumône", precision: "Même racine que « ṣidq », la véracité : l'aumône atteste la sincérité de la foi.", racine: "ص د ق", nature: "nom", frequence: 155, exemple: [2, 263] },
    { id: "tahara", arabe: "طَهَّرَ", translit: "ṭahhara", sens: "purifier", racine: "ط ه ر", nature: "verbe", frequence: 31, exemple: [2, 222] },
    { id: "kaaba", arabe: "كَعْبَة", translit: "kaʿba", sens: "la Kaaba", nature: "nomPropre", frequence: 2, exemple: [5, 97] },
  ],
};

/* ========================================================================
   Pack 15 — La famille et les biens
   ======================================================================== */

const FAMILLE_BIENS: PackVocabulaire = {
  id: "famille-biens",
  titre: "La famille et les biens",
  description: "Le vocabulaire de la vie quotidienne : parents, enfants, maison, nourriture, richesse.",
  ordre: 15,
  mots: [
    { id: "ab", arabe: "أَب", translit: "ab", sens: "père", racine: "أ ب و", nature: "nom", frequence: 117, exemple: [12, 4] },
    { id: "umm", arabe: "أُمّ", translit: "umm", sens: "mère", racine: "أ م م", nature: "nom", frequence: 119, exemple: [31, 14] },
    { id: "ibn", arabe: "اِبْن", translit: "ibn", sens: "fils", racine: "ب ن ي", nature: "nom", frequence: 184, exemple: [2, 87] },
    { id: "walad", arabe: "وَلَد", translit: "walad", sens: "enfant, descendance", racine: "و ل د", nature: "nom", frequence: 102, exemple: [2, 116] },
    { id: "zawj", arabe: "زَوْج", translit: "zawj", sens: "époux, épouse, paire", racine: "ز و ج", nature: "nom", frequence: 81, exemple: [2, 35] },
    { id: "akh", arabe: "أَخ", translit: "akh", sens: "frère", racine: "أ خ و", nature: "nom", frequence: 96, exemple: [7, 65] },
    { id: "ukht", arabe: "أُخْت", translit: "ukht", sens: "sœur", racine: "أ خ و", nature: "nom", frequence: 96, exemple: [4, 12] },
    { id: "imraa", arabe: "اِمْرَأَة", translit: "imraʾa", sens: "femme, épouse", racine: "م ر أ", nature: "nom", frequence: 38, exemple: [3, 35] },
    { id: "rajul", arabe: "رَجُل", translit: "rajul", sens: "homme", racine: "ر ج ل", nature: "nom", frequence: 73, exemple: [2, 282] },
    { id: "mal", arabe: "مَال", translit: "māl", sens: "bien, richesse", racine: "م و ل", nature: "nom", frequence: 86, exemple: [2, 155] },
    { id: "bayt", arabe: "بَيْت", translit: "bayt", sens: "maison, demeure", racine: "ب ي ت", nature: "nom", frequence: 73, exemple: [2, 125] },
    { id: "rizq", arabe: "رِزْق", translit: "rizq", sens: "subsistance, don providentiel", racine: "ر ز ق", nature: "nom", frequence: 123, exemple: [2, 3] },
    { id: "taam", arabe: "طَعَام", translit: "ṭaʿām", sens: "nourriture", racine: "ط ع م", nature: "nom", frequence: 48, exemple: [2, 61] },
    { id: "akala", arabe: "أَكَلَ", translit: "akala", sens: "manger", racine: "أ ك ل", nature: "verbe", frequence: 109, exemple: [2, 35] },
    { id: "shariba", arabe: "شَرِبَ", translit: "shariba", sens: "boire", racine: "ش ر ب", nature: "verbe", frequence: 39, exemple: [2, 60] },
    { id: "libas", arabe: "لِبَاس", translit: "libās", sens: "vêtement", racine: "ل ب س", nature: "nom", frequence: 23, exemple: [2, 187] },
    { id: "yatim", arabe: "يَتِيم", translit: "yatīm", sens: "orphelin", racine: "ي ت م", nature: "nom", frequence: 23, exemple: [2, 83] },
    { id: "miskin", arabe: "مِسْكِين", translit: "miskīn", sens: "pauvre, nécessiteux", racine: "س ك ن", nature: "nom", frequence: 69, exemple: [2, 83] },
  ],
};

/* ========================================================================
   Pack 16 — Le temps et l'espace
   ======================================================================== */

const TEMPS_ESPACE: PackVocabulaire = {
  id: "temps-espace",
  titre: "Le temps et l'espace",
  description: "Situer une scène : avant, après, proche, lointain, à droite, à gauche.",
  ordre: 16,
  mots: [
    { id: "sana", arabe: "سَنَة", translit: "sana", sens: "année", racine: "س ن و", nature: "nom", frequence: 20, exemple: [29, 14] },
    { id: "shahr", arabe: "شَهْر", translit: "shahr", sens: "mois", racine: "ش ه ر", nature: "nom", frequence: 21, exemple: [2, 185] },
    { id: "hin", arabe: "حِين", translit: "ḥīn", sens: "moment, laps de temps", racine: "ح ي ن", nature: "nom", frequence: 35, exemple: [76, 1] },
    { id: "awwal", arabe: "أَوَّل", translit: "awwal", sens: "premier", racine: "أ و ل", nature: "adjectif", frequence: 125, exemple: [2, 41] },
    { id: "akhir", arabe: "آخِر", translit: "ākhir", sens: "dernier", racine: "أ خ ر", nature: "adjectif", frequence: 250, exemple: [2, 8] },
    { id: "jadid", arabe: "جَدِيد", translit: "jadīd", sens: "nouveau", racine: "ج د د", nature: "adjectif", frequence: 10, exemple: [13, 5] },
    { id: "dar", arabe: "دَار", translit: "dār", sens: "demeure, résidence", precision: "« dār al-ākhira » : la demeure dernière — un lieu où l'on s'installe pour de bon.", racine: "د و ر", nature: "nom", frequence: 55, exemple: [13, 24] },
    { id: "makan", arabe: "مَكَان", translit: "makān", sens: "lieu, endroit", racine: "ك و ن", nature: "nom", frequence: 1390, exemple: [19, 16] },
    { id: "sabil", arabe: "سَبِيل", translit: "sabīl", sens: "chemin, voie", precision: "« fī sabīli-llāh » : dans la voie d'Allah — expression omniprésente.", racine: "س ب ل", nature: "nom", frequence: 176, exemple: [2, 154] },
    { id: "tariq", arabe: "طَرِيق", translit: "ṭarīq", sens: "voie, sentier", racine: "ط ر ق", nature: "nom", frequence: 11, exemple: [4, 168] },
    { id: "bab", arabe: "بَاب", translit: "bāb", sens: "porte", racine: "ب و ب", nature: "nom", frequence: 27, exemple: [2, 58] },
    { id: "mashriq", arabe: "مَشْرِق", translit: "mashriq", sens: "levant, orient", racine: "ش ر ق", nature: "nom", frequence: 17, exemple: [2, 115] },
    { id: "maghrib", arabe: "مَغْرِب", translit: "maghrib", sens: "couchant, occident", racine: "غ ر ب", nature: "nom", frequence: 19, exemple: [2, 115] },
    { id: "yamin", arabe: "يَمِين", translit: "yamīn", sens: "droite, serment", precision: "Les « gens de la droite » (aṣḥāb al-yamīn) sont les bienheureux du Jour dernier.", racine: "ي م ن", nature: "nom", frequence: 71, exemple: [56, 27] },
    { id: "shimal", arabe: "شِمَال", translit: "shimāl", sens: "gauche", racine: "ش م ل", nature: "nom", frequence: 12, exemple: [56, 41] },
    { id: "wara", arabe: "وَرَاء", translit: "warāʾ", sens: "derrière, au-delà de", racine: "و ر ي", nature: "particule", frequence: 32, exemple: [2, 101] },
    { id: "khalf", arabe: "خَلْف", translit: "khalf", sens: "derrière, ce qui suit", racine: "خ ل ف", nature: "nom", frequence: 127, exemple: [2, 255] },
    { id: "qarib", arabe: "قَرِيب", translit: "qarīb", sens: "proche", racine: "ق ر ب", nature: "adjectif", frequence: 96, exemple: [2, 186] },
    { id: "baid", arabe: "بَعِيد", translit: "baʿīd", sens: "lointain, éloigné", racine: "ب ع د", nature: "adjectif", frequence: 235, exemple: [41, 44] },
  ],
};

/* ========================================================================
   Pack 17 — Quantité, nombre et mesure
   ======================================================================== */

const QUANTITE: PackVocabulaire = {
  id: "quantite",
  titre: "Quantité, nombre et mesure",
  description: "Compter et mesurer : les nombres du Coran et les mots de quantité qui reviennent partout.",
  ordre: 17,
  mots: [
    { id: "ahad", arabe: "أَحَد", translit: "aḥad", sens: "un, quelqu'un", precision: "Dans la sourate al-Ikhlâṣ, exprime l'unicité absolue d'Allah.", racine: "أ ح د", nature: "nom", frequence: 85, exemple: [112, 1] },
    { id: "ithnan", arabe: "اِثْنَان", translit: "ithnān", sens: "deux", racine: "ث ن ي", nature: "nom", frequence: 29, exemple: [5, 106] },
    { id: "thalath", arabe: "ثَلَاث", translit: "thalāth", sens: "trois", racine: "ث ل ث", nature: "nom", frequence: 32, exemple: [2, 196] },
    { id: "arba", arabe: "أَرْبَع", translit: "arbaʿ", sens: "quatre", racine: "ر ب ع", nature: "nom", frequence: 22, exemple: [4, 3] },
    { id: "khams", arabe: "خَمْس", translit: "khams", sens: "cinq", racine: "خ م س", nature: "nom", frequence: 8, exemple: [18, 22] },
    { id: "sab", arabe: "سَبْع", translit: "sabʿ", sens: "sept", racine: "س ب ع", nature: "nom", frequence: 28, exemple: [2, 29] },
    { id: "ashr", arabe: "عَشْر", translit: "ʿashr", sens: "dix", racine: "ع ش ر", nature: "nom", frequence: 27, exemple: [2, 196] },
    { id: "mia", arabe: "مِائَة", translit: "miʾa", sens: "cent", racine: "م أ ي", nature: "nom", frequence: 10, exemple: [2, 259] },
    { id: "alf", arabe: "أَلْف", translit: "alf", sens: "mille", racine: "أ ل ف", nature: "nom", frequence: 22, exemple: [2, 96] },
    { id: "kathir", arabe: "كَثِير", translit: "kathīr", sens: "nombreux, beaucoup", racine: "ك ث ر", nature: "adjectif", frequence: 167, exemple: [2, 26] },
    { id: "qalil", arabe: "قَلِيل", translit: "qalīl", sens: "peu, rare", racine: "ق ل ل", nature: "adjectif", frequence: 76, exemple: [2, 88] },
    { id: "akthar", arabe: "أَكْثَر", translit: "akthar", sens: "la plupart, davantage", precision: "« akthar an-nās » : la plupart des gens — formule très fréquente.", racine: "ك ث ر", nature: "adjectif", frequence: 167, exemple: [2, 100] },
    { id: "jami", arabe: "جَمِيع", translit: "jamīʿ", sens: "tous, en totalité", racine: "ج م ع", nature: "nom", frequence: 129, exemple: [2, 29] },
    { id: "zada", arabe: "زَادَ", translit: "zāda", sens: "augmenter, ajouter", racine: "ز ي د", nature: "verbe", frequence: 61, exemple: [2, 10] },
    { id: "mizan", arabe: "مِيزَان", translit: "mīzān", sens: "balance", precision: "La balance du Jour du Jugement, et la juste mesure à respecter dans le commerce.", racine: "و ز ن", nature: "nom", frequence: 23, exemple: [55, 7] },
    { id: "adad", arabe: "عَدَد", translit: "ʿadad", sens: "nombre, quantité", racine: "ع د د", nature: "nom", frequence: 57, exemple: [18, 11] },
  ],
};

/* ========================================================================
   Pack 18 — Ordre, jugement et justice
   ======================================================================== */

const ORDRE_JUSTICE: PackVocabulaire = {
  id: "ordre-justice",
  titre: "Ordre, jugement et justice",
  description: "Le vocabulaire juridique et politique : licite, illicite, pacte, jugement, combat.",
  ordre: 18,
  mots: [
    { id: "hakama", arabe: "حَكَمَ", translit: "ḥakama", sens: "juger, trancher", racine: "ح ك م", nature: "verbe", frequence: 210, exemple: [5, 42] },
    { id: "hukm", arabe: "حُكْم", translit: "ḥukm", sens: "jugement, autorité de décision", racine: "ح ك م", nature: "nom", frequence: 210, exemple: [12, 40] },
    { id: "amr", arabe: "أَمْر", translit: "amr", sens: "ordre, affaire, décret", precision: "Double sens permanent : le commandement et l'affaire dont il s'agit.", racine: "أ م ر", nature: "nom", frequence: 248, exemple: [2, 109] },
    { id: "naha", arabe: "نَهَىٰ", translit: "nahā", sens: "interdire, défendre", racine: "ن ه ي", nature: "verbe", frequence: 56, exemple: [3, 104] },
    { id: "harrama", arabe: "حَرَّمَ", translit: "ḥarrama", sens: "interdire, rendre illicite", racine: "ح ر م", nature: "verbe", frequence: 83, exemple: [2, 173] },
    { id: "halal", arabe: "حَلَال", translit: "ḥalāl", sens: "licite, permis", racine: "ح ل ل", nature: "adjectif", frequence: 51, exemple: [2, 168] },
    { id: "haram", arabe: "حَرَام", translit: "ḥarām", sens: "illicite, sacré, inviolable", precision: "Un même mot pour l'interdit et le sacré : « al-masjid al-ḥarām ».", racine: "ح ر م", nature: "adjectif", frequence: 83, exemple: [2, 144] },
    { id: "ahd", arabe: "عَهْد", translit: "ʿahd", sens: "pacte, engagement", racine: "ع ه د", nature: "nom", frequence: 46, exemple: [2, 27] },
    { id: "mithaq", arabe: "مِيثَاق", translit: "mīthāq", sens: "alliance, pacte solennel", racine: "و ث ق", nature: "nom", frequence: 34, exemple: [2, 27] },
    { id: "shahid", arabe: "شَهِيد", translit: "shahīd", sens: "témoin, martyr", precision: "Dans le Coran le sens est presque toujours « témoin » ; celui de martyr s'est imposé plus tard.", racine: "ش ه د", nature: "nom", frequence: 160, exemple: [2, 143] },
    { id: "qatala", arabe: "قَتَلَ", translit: "qatala", sens: "tuer", racine: "ق ت ل", nature: "verbe", frequence: 170, exemple: [2, 61] },
    { id: "qital", arabe: "قِتَال", translit: "qitāl", sens: "combat", racine: "ق ت ل", nature: "nom", frequence: 170, exemple: [2, 216] },
    { id: "jahada", arabe: "جَاهَدَ", translit: "jāhada", sens: "lutter, fournir un effort", precision: "Sens premier : fournir un effort intense. « Jihād » en vient, et ne désigne pas par lui-même le combat armé — que le Coran appelle « qitāl ».", racine: "ج ه د", nature: "verbe", frequence: 41, exemple: [9, 41] },
    { id: "aduww", arabe: "عَدُوّ", translit: "ʿaduww", sens: "ennemi", racine: "ع د و", nature: "nom", frequence: 106, exemple: [2, 36] },
    { id: "nasara-secourir", arabe: "نَصَرَ", translit: "naṣara", sens: "secourir, soutenir", racine: "ن ص ر", nature: "verbe", frequence: 158, exemple: [2, 48] },
    { id: "nasr", arabe: "نَصْر", translit: "naṣr", sens: "victoire, secours", racine: "ن ص ر", nature: "nom", frequence: 158, exemple: [110, 1] },
    { id: "fath", arabe: "فَتْح", translit: "fatḥ", sens: "victoire, ouverture", racine: "ف ت ح", nature: "nom", frequence: 38, exemple: [48, 1] },
    { id: "sultan", arabe: "سُلْطَان", translit: "sulṭān", sens: "autorité, argument probant", racine: "س ل ط", nature: "nom", frequence: 39, exemple: [14, 22] },
  ],
};

/* ========================================================================
   Pack 19 — Guidée et égarement
   ======================================================================== */

const GUIDEE: PackVocabulaire = {
  id: "guidee",
  titre: "Guidée et égarement",
  description: "L'opposition lumière/ténèbres, guidée/égarement, et les verbes de la réflexion : méditer, se rappeler, comprendre.",
  ordre: 19,
  mots: [
    { id: "huda", arabe: "هُدًى", translit: "hudā", sens: "guidée, bonne direction", racine: "ه د ي", nature: "nom", frequence: 316, exemple: [2, 2] },
    { id: "ihtada", arabe: "اِهْتَدَىٰ", translit: "ihtadā", sens: "être bien guidé, suivre la guidée", racine: "ه د ي", nature: "verbe", frequence: 316, exemple: [2, 16] },
    { id: "dalla", arabe: "ضَلَّ", translit: "ḍalla", sens: "s'égarer, se perdre", racine: "ض ل ل", nature: "verbe", frequence: 191, exemple: [1, 7] },
    { id: "dalal", arabe: "ضَلَال", translit: "ḍalāl", sens: "égarement", racine: "ض ل ل", nature: "nom", frequence: 191, exemple: [3, 164] },
    { id: "adalla", arabe: "أَضَلَّ", translit: "aḍalla", sens: "égarer, faire perdre la voie", racine: "ض ل ل", nature: "verbe", frequence: 191, exemple: [14, 4] },
    { id: "zulumat", arabe: "ظُلُمَات", translit: "ẓulumāt", sens: "ténèbres", precision: "Toujours au pluriel face au singulier « nūr » : les ténèbres sont multiples, la lumière est une.", racine: "ظ ل م", nature: "nom", frequence: 315, exemple: [2, 257] },
    { id: "ama", arabe: "أَعْمَىٰ", translit: "aʿmā", sens: "aveugle", racine: "ع م ي", nature: "adjectif", frequence: 33, exemple: [2, 18] },
    { id: "asamm", arabe: "أَصَمّ", translit: "aṣamm", sens: "sourd", racine: "ص م م", nature: "adjectif", frequence: 15, exemple: [2, 18] },
    { id: "fitna", arabe: "فِتْنَة", translit: "fitna", sens: "épreuve, trouble, sédition", precision: "Sens premier : passer le métal au feu pour l'éprouver.", racine: "ف ت ن", nature: "nom", frequence: 60, exemple: [2, 191] },
    { id: "ibtala", arabe: "اِبْتَلَىٰ", translit: "ibtalā", sens: "éprouver, mettre à l'épreuve", racine: "ب ل و", nature: "verbe", frequence: 38, exemple: [2, 124] },
    { id: "tadhakkara", arabe: "تَذَكَّرَ", translit: "tadhakkara", sens: "se rappeler, méditer", racine: "ذ ك ر", nature: "verbe", frequence: 292, exemple: [2, 221] },
    { id: "tafakkara", arabe: "تَفَكَّرَ", translit: "tafakkara", sens: "réfléchir", racine: "ف ك ر", nature: "verbe", frequence: 18, exemple: [2, 219] },
    { id: "tadabbara", arabe: "تَدَبَّرَ", translit: "tadabbara", sens: "méditer en profondeur", precision: "Le verbe employé pour la méditation du Coran lui-même.", racine: "د ب ر", nature: "verbe", frequence: 44, exemple: [47, 24] },
    { id: "bashshara", arabe: "بَشَّرَ", translit: "bashshara", sens: "annoncer une bonne nouvelle", racine: "ب ش ر", nature: "verbe", frequence: 123, exemple: [2, 25] },
    { id: "andhara", arabe: "أَنْذَرَ", translit: "andhara", sens: "avertir, mettre en garde", racine: "ن ذ ر", nature: "verbe", frequence: 130, exemple: [2, 6] },
    { id: "ittabaa", arabe: "اِتَّبَعَ", translit: "ittabaʿa", sens: "suivre", racine: "ت ب ع", nature: "verbe", frequence: 172, exemple: [2, 38] },
  ],
};

/* ========================================================================
   Pack 20 — Verbes du récit
   ======================================================================== */

const VERBES_RECIT: PackVocabulaire = {
  id: "verbes-recit",
  titre: "Verbes du récit",
  description: "Le deuxième cercle de verbes : donner, demander, décréter, cacher, détruire. De quoi suivre n'importe quel récit coranique.",
  ordre: 20,
  mots: [
    { id: "ata-donner", arabe: "آتَىٰ", translit: "ātā", sens: "donner, accorder", precision: "À ne pas confondre avec « atā » (venir) : même racine, forme différente.", racine: "أ ت ي", nature: "verbe", frequence: 549, exemple: [2, 43] },
    { id: "saala", arabe: "سَأَلَ", translit: "saʾala", sens: "demander, interroger", racine: "س أ ل", nature: "verbe", frequence: 129, exemple: [2, 108] },
    { id: "qada", arabe: "قَضَىٰ", translit: "qaḍā", sens: "décréter, accomplir, trancher", racine: "ق ض ي", nature: "verbe", frequence: 63, exemple: [2, 117] },
    { id: "malaka", arabe: "مَلَكَ", translit: "malaka", sens: "posséder, détenir", racine: "م ل ك", nature: "verbe", frequence: 206, exemple: [2, 102] },
    { id: "sara", arabe: "سَارَ", translit: "sāra", sens: "cheminer, parcourir la terre", precision: "« sīrū fī al-arḍ » : parcourez la terre — invitation récurrente à observer.", racine: "س ي ر", nature: "verbe", frequence: 27, exemple: [3, 137] },
    { id: "sakana", arabe: "سَكَنَ", translit: "sakana", sens: "habiter, demeurer, s'apaiser", racine: "س ك ن", nature: "verbe", frequence: 69, exemple: [2, 35] },
    { id: "badaa", arabe: "بَدَأَ", translit: "badaʾa", sens: "commencer, initier", racine: "ب د أ", nature: "verbe", frequence: 15, exemple: [10, 4] },
    { id: "atamma", arabe: "أَتَمَّ", translit: "atamma", sens: "achever, parfaire", racine: "ت م م", nature: "verbe", frequence: 22, exemple: [5, 3] },
    { id: "zayyana", arabe: "زَيَّنَ", translit: "zayyana", sens: "embellir, parer", racine: "ز ي ن", nature: "verbe", frequence: 46, exemple: [2, 212] },
    { id: "kashafa", arabe: "كَشَفَ", translit: "kashafa", sens: "dévoiler, dissiper", racine: "ك ش ف", nature: "verbe", frequence: 20, exemple: [10, 12] },
    { id: "akhfa", arabe: "أَخْفَىٰ", translit: "akhfā", sens: "cacher, dissimuler", racine: "خ ف ي", nature: "verbe", frequence: 34, exemple: [2, 271] },
    { id: "zahara", arabe: "ظَهَرَ", translit: "ẓahara", sens: "apparaître, l'emporter", racine: "ظ ه ر", nature: "verbe", frequence: 59, exemple: [30, 41] },
    { id: "taraka", arabe: "تَرَكَ", translit: "taraka", sens: "laisser, abandonner", racine: "ت ر ك", nature: "verbe", frequence: 43, exemple: [2, 17] },
    { id: "hamala", arabe: "حَمَلَ", translit: "ḥamala", sens: "porter, supporter", racine: "ح م ل", nature: "verbe", frequence: 64, exemple: [2, 286] },
    { id: "wadaa", arabe: "وَضَعَ", translit: "waḍaʿa", sens: "poser, déposer", racine: "و ض ع", nature: "verbe", frequence: 26, exemple: [55, 7] },
    { id: "rafaa", arabe: "رَفَعَ", translit: "rafaʿa", sens: "élever, hausser", racine: "ر ف ع", nature: "verbe", frequence: 29, exemple: [2, 127] },
    { id: "fataha", arabe: "فَتَحَ", translit: "fataḥa", sens: "ouvrir", racine: "ف ت ح", nature: "verbe", frequence: 38, exemple: [7, 96] },
    { id: "ghalaba", arabe: "غَلَبَ", translit: "ghalaba", sens: "vaincre, l'emporter", racine: "غ ل ب", nature: "verbe", frequence: 31, exemple: [30, 3] },
    { id: "sabaqa", arabe: "سَبَقَ", translit: "sabaqa", sens: "devancer, précéder", racine: "س ب ق", nature: "verbe", frequence: 37, exemple: [21, 101] },
    { id: "ahlaka", arabe: "أَهْلَكَ", translit: "ahlaka", sens: "anéantir, faire périr", racine: "ه ل ك", nature: "verbe", frequence: 68, exemple: [7, 4] },
  ],
};

export const PACKS: PackVocabulaire[] = [
  FATIHA,
  NOMS_DIVINS,
  OUTILS_PREPOSITIONS,
  GRANDS_VERBES,
  FOI_MECREANCE,
  LIVRE_REVELATION,
  PRONOMS,
  AU_DELA,
  CREATION,
  OUTILS_LIAISONS,
  HOMME,
  BIEN_MAL,
  PROPHETES,
  ADORATION,
  FAMILLE_BIENS,
  TEMPS_ESPACE,
  QUANTITE,
  ORDRE_JUSTICE,
  GUIDEE,
  VERBES_RECIT,
];

/** Tous les mots, à plat — utile pour les révisions aléatoires. */
export const TOUS_LES_MOTS: Mot[] = PACKS.flatMap((p) => p.mots);

/** Retrouve un mot par son identifiant. */
export function motParId(id: string): Mot | undefined {
  return TOUS_LES_MOTS.find((m) => m.id === id);
}

/** Retrouve le pack auquel appartient un mot. */
export function packDuMot(id: string): PackVocabulaire | undefined {
  return PACKS.find((p) => p.mots.some((m) => m.id === id));
}
