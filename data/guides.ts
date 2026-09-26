/* Guides pas à pas (prière de la nuit, istikhâra, omra).
   Contenu limité à ce qui est établi par la Sunna authentique ; quand un
   point relève de l'avis des savants, c'est dit dans le texte. */

export interface Dhikr {
  titre?: string;
  arabe: string;
  translit: string;
  fr: string;
  source: string;
}

export type OutilGuide = "tawaf" | "say" | "dernier-tiers";

export interface EtapeGuide {
  titre: string;
  resume: string; // une phrase, affichée sous le titre
  illustration: string; // clé dans ILLUSTRATIONS (components/IllustrationsGuides)
  points: string[];
  dhikrs?: Dhikr[];
  astuce?: string;
  outil?: OutilGuide;
  lien?: { href: string; libelle: string };
  /** Situations concrètes « si… alors… », avec une frise de la soirée. */
  cas?: CasPratique[];
}

export interface CasPratique {
  titre: string; // ex. « Je ne suis pas sûr de me réveiller »
  frise: string[]; // étapes courtes affichées en pastilles fléchées
  texte: string[];
  recommande?: boolean;
}

export interface Guide {
  id: string;
  titre: string;
  sousTitre: string;
  intro: string;
  merites: { texte: string; source: string }[];
  etapes: EtapeGuide[];
  aEviter: string[];
  fin: { titre: string; texte: string };
}

/* ================= Prière de la nuit ================= */

export const GUIDE_NUIT: Guide = {
  id: "nuit",
  titre: "La prière de la nuit",
  sousTitre: "Qiyâm al-layl / Tahajjud",
  intro:
    "Une sunna très appuyée que le Prophète ﷺ n'a jamais délaissée. Son temps va de la prière de 'Ishâ jusqu'à l'aube (Fajr), et le meilleur moment est le dernier tiers de la nuit.",
  merites: [
    {
      texte:
        "La meilleure prière après les prières prescrites est la prière de la nuit.",
      source: "Muslim",
    },
    {
      texte:
        "Notre Seigneur descend chaque nuit vers le ciel le plus proche lorsqu'il reste le dernier tiers de la nuit, et dit : « Qui M'invoque, que Je l'exauce ? Qui Me demande, que Je lui donne ? Qui implore Mon pardon, que Je lui pardonne ? »",
      source: "Al-Bukhari & Muslim",
    },
  ],
  etapes: [
    {
      titre: "Repérer le bon moment",
      resume: "De 'Ishâ jusqu'au Fajr — le dernier tiers est le meilleur.",
      illustration: "lune",
      outil: "dernier-tiers",
      points: [
        "La prière de la nuit peut se faire à tout moment entre 'Ishâ et le Fajr, même juste après 'Ishâ.",
        "Le meilleur moment est le dernier tiers de la nuit : c'est l'heure de la descente divine et des invocations exaucées.",
        "La nuit se compte du coucher du soleil (Maghrib) jusqu'à l'aube (Fajr) : on la divise en trois pour trouver le dernier tiers.",
      ],
    },
    {
      titre: "Le witr : ce que c'est",
      resume: "La prière impaire qui scelle la nuit.",
      illustration: "impair",
      points: [
        "« Witr » veut dire « impair ». Le Prophète ﷺ a dit : « Allah est Witr (Unique) et Il aime ce qui est impair ; faites donc le witr, ô gens du Coran » (Abu Dawud & At-Tirmidhi). Par cette rak'a impaire, le croyant termine sa journée d'adoration en attestant l'unicité de Celui qu'il adore.",
        "C'est une sunna très appuyée que le Prophète ﷺ ne délaissait jamais, même en voyage où il la priait sur sa monture (Al-Bukhari & Muslim). 'Alî a dit : « Le witr n'est pas obligatoire comme la prière prescrite, mais c'est une sunna établie par le Messager d'Allah ﷺ » (At-Tirmidhi & An-Nasa'i). Certains savants (hanafites) le considèrent même obligatoire : raison de plus pour ne pas le laisser.",
        "Le witr fait partie de la prière de la nuit : c'est sa conclusion. « Faites du witr la dernière de vos prières de la nuit » (Al-Bukhari & Muslim). Les rak'ât qu'on prie avant lui, deux par deux, sont la prière de la nuit elle-même.",
        "Son temps va de après 'Ishâ jusqu'à l'aube. 'Â'isha a dit : « Dans chaque partie de la nuit le Messager d'Allah ﷺ a fait le witr : au début, au milieu et à la fin ; et son witr a fini par se fixer à l'approche de l'aube » (Al-Bukhari & Muslim).",
        "Ces fameuses « 2 + 1 » après 'Ishâ ? Ce n'est pas une prière à part : les 2 rak'ât (souvent appelées « shaf' », le pair) sont une petite prière de la nuit, et la rak'a unique est le witr. Celui qui les prie a donc déjà fait une prière de la nuit, même courte, et c'est une bonne chose. Attention à ne pas les confondre avec les 2 rak'ât de sunna (rawâtib) de 'Ishâ, qui sont une prière distincte.",
      ],
      astuce:
        "Le witr est le « sceau » de la nuit : où que tu le places, tout ce que tu pries cette nuit-là doit logiquement venir avant lui, sauf exception expliquée à l'étape suivante.",
    },
    {
      titre: "'Ishâ, witr et sommeil : ton plan",
      resume: "Où placer le witr selon ta situation.",
      illustration: "lit",
      points: [
        "Le Prophète ﷺ a dit : « Celui qui craint de ne pas se lever à la fin de la nuit, qu'il fasse le witr au début. Celui qui compte se lever à la fin, qu'il le fasse à la fin de la nuit, car la prière de la fin de la nuit a des témoins (les anges) et elle est meilleure » (Muslim).",
        "Les deux choix sont donc conformes à la Sunna : tout dépend de toi. Choisis ton cas ci-dessous.",
        "Dans tous les cas, couche-toi tôt avec l'intention sincère de te lever : si le sommeil t'emporte malgré toi, on t'inscrit ce que tu comptais faire et ton sommeil devient une aumône d'Allah pour toi (An-Nasa'i & Ibn Mâjah). L'intention se fait dans le cœur, sans formule.",
      ],
      cas: [
        {
          titre: "Je ne suis pas sûr de me réveiller",
          frise: ["'Ishâ", "2 rak'ât sunna", "2 + 1 witr", "Dormir", "Fajr"],
          texte: [
            "Prie ton witr avant de dormir : c'est exactement la recommandation du Prophète ﷺ à Abû Hurayra, qui a dit : « Mon ami ﷺ m'a recommandé trois choses […] et de faire le witr avant de dormir » (Al-Bukhari & Muslim).",
            "Tu as ainsi une prière de la nuit complète, même petite, et tu ne perds rien si tu dors jusqu'au Fajr.",
          ],
        },
        {
          titre: "J'ai fait mon witr, mais je me réveille quand même",
          frise: ["Witr avant de dormir", "Réveil", "2 + 2 + …", "Pas de 2e witr", "Fajr"],
          texte: [
            "Excellent ! Prie deux par deux autant que tu veux, puis invoque. Ne refais pas de witr : « Pas deux witr dans une même nuit » (Abu Dawud, At-Tirmidhi & An-Nasa'i).",
            "Prier après son witr est permis : le Prophète ﷺ a prié deux rak'ât assis après son witr (Muslim).",
            "Certains Compagnons, comme Ibn 'Umar, commençaient par une rak'a seule au réveil pour « rendre pair » le premier witr, puis refaisaient un witr à la fin. Le plus proche de ce que faisait le Prophète ﷺ reste de prier deux par deux sans rien ajouter.",
          ],
        },
        {
          titre: "Je suis confiant de me lever",
          frise: ["'Ishâ", "2 rak'ât sunna", "Dormir", "Dernier tiers : 2 + 2 + … + witr", "Fajr"],
          recommande: true,
          texte: [
            "Après 'Ishâ, contente-toi des 2 rak'ât de sunna et va dormir sans faire le witr. Au dernier tiers, prie deux par deux puis termine par le witr juste avant le Fajr : c'est le meilleur, d'après le hadith.",
            "Mets un réveil : c'est ce qui transforme l'intention en habitude.",
          ],
        },
        {
          titre: "J'avais gardé le witr pour la nuit… et je ne me suis pas réveillé",
          frise: ["Réveil au Fajr", "Pas de panique", "Rattraper le jour, en pair"],
          texte: [
            "« Celui qui s'endort sans avoir fait son witr ou l'oublie, qu'il le prie lorsqu'il s'en souvient ou se réveille » (Abu Dawud & At-Tirmidhi).",
            "La pratique du Prophète ﷺ précise la manière : quand le sommeil ou une douleur l'avait empêché de prier la nuit, il priait dans la journée douze rak'ât (Muslim), soit son nombre habituel rendu pair. Par exemple, si tu fais d'habitude 2 + 1, rattrape 4 rak'ât (deux fois deux) entre le lever du soleil et le Dhuhr.",
          ],
        },
      ],
    },
    {
      titre: "Au réveil",
      resume: "Chasser le sommeil par le rappel d'Allah.",
      illustration: "reveil",
      points: [
        "Frotte le sommeil de ton visage, puis récite les derniers versets de la sourate Âl 'Imrân (3:190 à 200), comme le faisait le Prophète ﷺ (Al-Bukhari & Muslim).",
        "Nettoie-toi la bouche avec le siwâk (ou une brosse à dents) : le Prophète ﷺ le faisait en se levant la nuit (Al-Bukhari & Muslim).",
      ],
      dhikrs: [
        {
          titre: "Qui se réveille la nuit et dit…",
          arabe:
            "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، الْحَمْدُ لِلَّهِ، وَسُبْحَانَ اللَّهِ، وَلَا إِلَهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ، اللَّهُمَّ اغْفِرْ لِي",
          translit:
            "Lâ ilâha illâ-llâhu waḥdahu lâ sharîka lah, lahul-mulku wa lahul-ḥamd, wa huwa 'alâ kulli shay'in qadîr. Al-ḥamdu lillâh, wa subḥânallâh, wa lâ ilâha illâ-llâh, wallâhu akbar, wa lâ ḥawla wa lâ quwwata illâ billâh. Allâhumma-ghfir lî.",
          fr: "Nulle divinité hormis Allah, Seul, sans associé ; à Lui la royauté et la louange, et Il est capable de toute chose. Louange à Allah, gloire à Allah, nulle divinité hormis Allah, Allah est le plus Grand, il n'y a de force ni de puissance qu'en Allah. Ô Allah, pardonne-moi.",
          source: "Al-Bukhari",
        },
      ],
      astuce:
        "Le hadith ajoute : s'il invoque, il est exaucé ; s'il fait ses ablutions et prie, sa prière est acceptée.",
      lien: { href: "/sourate/3#v-190", libelle: "Lire Âl 'Imrân 3:190-200" },
    },
    {
      titre: "Ablutions et ouverture",
      resume: "Commencer par deux rak'ât légères.",
      illustration: "goutte",
      points: [
        "Fais tes ablutions, puis commence par deux rak'ât courtes : « Lorsque l'un de vous se lève la nuit, qu'il ouvre sa prière par deux rak'ât légères » (Muslim).",
        "Tu peux ouvrir ta prière par l'invocation d'ouverture que le Prophète ﷺ disait la nuit (ci-dessous).",
      ],
      dhikrs: [
        {
          titre: "Invocation d'ouverture de la nuit",
          arabe:
            "اللَّهُمَّ رَبَّ جِبْرَائِيلَ وَمِيكَائِيلَ وَإِسْرَافِيلَ، فَاطِرَ السَّمَاوَاتِ وَالْأَرْضِ، عَالِمَ الْغَيْبِ وَالشَّهَادَةِ، أَنْتَ تَحْكُمُ بَيْنَ عِبَادِكَ فِيمَا كَانُوا فِيهِ يَخْتَلِفُونَ، اهْدِنِي لِمَا اخْتُلِفَ فِيهِ مِنَ الْحَقِّ بِإِذْنِكَ، إِنَّكَ تَهْدِي مَنْ تَشَاءُ إِلَى صِرَاطٍ مُسْتَقِيمٍ",
          translit:
            "Allâhumma Rabba Jibrâ'îla wa Mîkâ'îla wa Isrâfîl, fâṭiras-samâwâti wal-arḍ, 'âlimal-ghaybi wash-shahâdah, anta taḥkumu bayna 'ibâdika fîmâ kânû fîhi yakhtalifûn, ihdinî limâ-khtulifa fîhi minal-ḥaqqi bi-idhnik, innaka tahdî man tashâ'u ilâ ṣirâṭin mustaqîm.",
          fr: "Ô Allah, Seigneur de Gabriel, de Michel et d'Israfil, Créateur des cieux et de la terre, Connaisseur de l'invisible et du visible, c'est Toi qui juges entre Tes serviteurs sur ce en quoi ils divergeaient. Guide-moi, par Ta permission, vers la vérité sur laquelle on a divergé : Tu guides qui Tu veux vers un droit chemin.",
          source: "Muslim",
        },
      ],
    },
    {
      titre: "Prier deux par deux",
      resume: "Des rak'ât par paires, longues et apaisées.",
      illustration: "paires",
      points: [
        "« La prière de la nuit se fait deux par deux » : tu fais le salâm toutes les deux rak'ât (Al-Bukhari & Muslim).",
        "Le Prophète ﷺ ne dépassait généralement pas 11 rak'ât, en Ramadan comme en dehors (Al-Bukhari & Muslim) ; il a aussi prié 13 rak'ât. Aucun nombre minimum n'est imposé : deux rak'ât suivies du witr, c'est déjà la prière de la nuit.",
        "Allonge la récitation, l'inclinaison et la prosternation. Le Prophète ﷺ, en passant sur un verset de glorification, glorifiait Allah ; sur un verset de demande, il demandait ; sur un verset de menace, il demandait protection (Muslim).",
        "Récite d'une voix moyenne, ni trop forte ni trop basse (Coran 17:110), surtout si d'autres dorment.",
        "Profite de la prosternation pour invoquer : c'est le moment où le serviteur est le plus proche de son Seigneur (Muslim).",
      ],
      astuce:
        "Tu ne connais pas de longues sourates ? Récite ce que tu sais, en prenant ton temps, ou lis dans un mushaf : l'essentiel est la présence du cœur.",
    },
    {
      titre: "Clôturer par le witr",
      resume: "Une rak'a impaire pour conclure la nuit.",
      illustration: "witr",
      points: [
        "« Faites du witr la dernière de vos prières de la nuit » (Al-Bukhari & Muslim). Il se prie en 1, 3, 5 rak'ât ou plus, toujours en nombre impair.",
        "En 3 rak'ât, deux façons sont rapportées : 2 rak'ât, salâm, puis 1 rak'a seule (comme le faisait Ibn 'Umar, Al-Bukhari) ; ou 3 rak'ât d'affilée avec un seul tashahhud à la fin, sans s'asseoir après la 2e pour ne pas ressembler au Maghrib.",
        "En 3 rak'ât, le Prophète ﷺ récitait : al-A'lâ (87), al-Kâfirûn (109) puis al-Ikhlâs (112) (Abu Dawud & An-Nasa'i).",
        "Tu peux faire le qunût (invocation debout) dans la dernière rak'a, avant ou après l'inclinaison. Il est permis de le laisser de temps en temps.",
      ],
      dhikrs: [
        {
          titre: "Le qunût enseigné à al-Hasan",
          arabe:
            "اللَّهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ، وَعَافِنِي فِيمَنْ عَافَيْتَ، وَتَوَلَّنِي فِيمَنْ تَوَلَّيْتَ، وَبَارِكْ لِي فِيمَا أَعْطَيْتَ، وَقِنِي شَرَّ مَا قَضَيْتَ، فَإِنَّكَ تَقْضِي وَلَا يُقْضَى عَلَيْكَ، وَإِنَّهُ لَا يَذِلُّ مَنْ وَالَيْتَ، تَبَارَكْتَ رَبَّنَا وَتَعَالَيْتَ",
          translit:
            "Allâhumma-hdinî fîman hadayt, wa 'âfinî fîman 'âfayt, wa tawallanî fîman tawallayt, wa bârik lî fîmâ a'ṭayt, wa qinî sharra mâ qaḍayt, fa-innaka taqḍî wa lâ yuqḍâ 'alayk, wa innahu lâ yadhillu man wâlayt, tabârakta Rabbanâ wa ta'âlayt.",
          fr: "Ô Allah, guide-moi parmi ceux que Tu as guidés, préserve-moi parmi ceux que Tu as préservés, prends-moi en charge parmi ceux que Tu as pris en charge, bénis-moi dans ce que Tu m'as donné, protège-moi du mal de ce que Tu as décrété. C'est Toi qui décrètes et nul ne décrète contre Toi ; celui que Tu soutiens n'est jamais humilié. Béni sois-Tu, notre Seigneur, et exalté.",
          source: "Abu Dawud, At-Tirmidhi & An-Nasa'i",
        },
      ],
    },
    {
      titre: "Après le witr : invoquer",
      resume: "Le moment des demandes exaucées.",
      illustration: "mains",
      points: [
        "Après le salâm du witr, le Prophète ﷺ disait trois fois « Subḥânal-Malikil-Quddûs », en élevant et prolongeant la voix la troisième fois (An-Nasa'i & Abu Dawud).",
        "Puis invoque librement, dans ta langue : c'est l'heure où Allah demande « Qui M'invoque, que Je l'exauce ? ». Demande pardon, pour toi, tes parents, tes enfants, et tout ce dont tu as besoin.",
      ],
      dhikrs: [
        {
          titre: "Après le salâm du witr (3 fois)",
          arabe: "سُبْحَانَ الْمَلِكِ الْقُدُّوسِ",
          translit: "Subḥânal-Malikil-Quddûs.",
          fr: "Gloire au Souverain, au Très Saint.",
          source: "An-Nasa'i & Abu Dawud",
        },
      ],
    },
    {
      titre: "Tenir dans la durée",
      resume: "Peu mais régulier, plutôt que beaucoup puis plus rien.",
      illustration: "etoile",
      points: [
        "« L'œuvre la plus aimée d'Allah est la plus régulière, même si elle est petite » (Al-Bukhari & Muslim). Commence par 2 rak'ât + le witr, puis augmente doucement.",
        "Si tu somnoles en priant, va dormir : tu risquerais de vouloir demander pardon et de te maudire sans le savoir (Al-Bukhari & Muslim).",
        "Nuit manquée ? Rattrape-la le jour, en nombre pair (voir « 'Ishâ, witr et sommeil : ton plan »).",
        "Ne fais pas comme celui qui priait la nuit puis a délaissé (Al-Bukhari) : mieux vaut un petit rythme tenu toute l'année.",
      ],
    },
  ],
  aEviter: [
    "Prononcer l'intention à voix haute (« nawaytu… ») : l'intention est dans le cœur.",
    "Faire deux witr dans la même nuit.",
    "Croire que les « 2 + 1 » après 'Ishâ empêchent de prier plus tard dans la nuit : on peut encore prier deux par deux, sans refaire de witr.",
    "Délaisser complètement le witr : même une seule rak'a avant de dormir vaut mieux que rien.",
    "S'épuiser jusqu'à manquer la prière du Fajr : la prière obligatoire passe avant tout.",
    "Veiller toute la nuit chaque nuit : le Prophète ﷺ priait et dormait (Al-Bukhari & Muslim).",
    "Réveiller brutalement les autres ou réciter si fort qu'on les dérange.",
  ],
  fin: {
    titre: "Qu'Allah accepte ta nuit !",
    texte:
      "Chaque nuit, une porte s'ouvre à nouveau. Garde ce guide sous la main et fixe-toi un petit objectif régulier.",
  },
};

/* ================= Prière de consultation ================= */

export const GUIDE_ISTIKHARA: Guide = {
  id: "istikhara",
  titre: "La prière de consultation",
  sousTitre: "Ṣalât al-Istikhâra",
  intro:
    "Quand tu hésites dans une décision (mariage, travail, voyage, achat, déménagement…), tu demandes à Allah de choisir pour toi ce qui est bien. Jâbir rapporte : « Le Prophète ﷺ nous enseignait l'istikhâra dans toutes les affaires comme il nous enseignait une sourate du Coran » (Al-Bukhari).",
  merites: [
    {
      texte:
        "Lorsque l'un de vous envisage une affaire, qu'il prie deux rak'ât en dehors de la prière obligatoire, puis qu'il dise : « Allâhumma innî astakhîruka… »",
      source: "Al-Bukhari",
    },
  ],
  etapes: [
    {
      titre: "Quand faire l'istikhâra ?",
      resume: "Pour une affaire permise où tu hésites.",
      illustration: "carrefour",
      points: [
        "Pour toute affaire permise, petite ou grande : le hadith dit « dans toutes les affaires ».",
        "Pas pour une obligation (prier, jeûner le Ramadan, être bon envers ses parents) ni pour un interdit : là, la réponse est déjà connue.",
        "Consulte aussi des personnes sages et de confiance : « Et consulte-les à propos des affaires » (Coran 3:159). L'istikhâra (demander à Allah) et l'istishâra (demander conseil) vont ensemble.",
      ],
    },
    {
      titre: "Se purifier et prier deux rak'ât",
      resume: "Une prière de deux rak'ât, en dehors de l'obligatoire.",
      illustration: "tapis",
      points: [
        "Fais tes ablutions, puis prie deux rak'ât surérogatoires avec l'intention (dans le cœur) de faire l'istikhâra.",
        "Tu récites al-Fâtiha et ce que tu veux ensuite : aucune sourate particulière n'est établie par un hadith authentique.",
        "Évite les moments interdits (après le 'Asr jusqu'au coucher du soleil, après le Fajr jusqu'au lever, et juste avant le Dhuhr), sauf si l'affaire ne peut pas attendre.",
        "Selon plusieurs savants, l'istikhâra peut se faire avec une sunna (rawâtib, prière de salutation de la mosquée) si l'intention est faite avant de la commencer.",
      ],
    },
    {
      titre: "Réciter l'invocation",
      resume: "Après la prière, en nommant ton affaire.",
      illustration: "mains",
      points: [
        "Après le salâm, récite l'invocation ci-dessous (certains savants autorisent aussi de la dire avant le salâm, après le tashahhud).",
        "À « hâdhâ-l-amra » (cette affaire), nomme ton affaire : « ce mariage avec untel », « ce poste à Lyon »… ou pense-la clairement.",
        "Tu peux la lire depuis ton téléphone si tu ne la connais pas par cœur.",
      ],
      dhikrs: [
        {
          titre: "L'invocation de l'istikhâra",
          arabe:
            "اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ، وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ، وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ، فَإِنَّكَ تَقْدِرُ وَلَا أَقْدِرُ، وَتَعْلَمُ وَلَا أَعْلَمُ، وَأَنْتَ عَلَّامُ الْغُيُوبِ. اللَّهُمَّ إِنْ كُنْتَ تَعْلَمُ أَنَّ هَذَا الْأَمْرَ خَيْرٌ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي، فَاقْدُرْهُ لِي وَيَسِّرْهُ لِي، ثُمَّ بَارِكْ لِي فِيهِ. وَإِنْ كُنْتَ تَعْلَمُ أَنَّ هَذَا الْأَمْرَ شَرٌّ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي، فَاصْرِفْهُ عَنِّي وَاصْرِفْنِي عَنْهُ، وَاقْدُرْ لِيَ الْخَيْرَ حَيْثُ كَانَ، ثُمَّ أَرْضِنِي بِهِ",
          translit:
            "Allâhumma innî astakhîruka bi'ilmik, wa astaqdiruka biqudratik, wa as'aluka min faḍlikal-'aẓîm, fa-innaka taqdiru wa lâ aqdir, wa ta'lamu wa lâ a'lam, wa anta 'allâmul-ghuyûb. Allâhumma in kunta ta'lamu anna hâdhal-amra (…) khayrun lî fî dînî wa ma'âshî wa 'âqibati amrî, fa-qdurhu lî wa yassirhu lî, thumma bârik lî fîh. Wa in kunta ta'lamu anna hâdhal-amra sharrun lî fî dînî wa ma'âshî wa 'âqibati amrî, fa-ṣrifhu 'annî wa-ṣrifnî 'anh, wa-qdur liyal-khayra ḥaythu kân, thumma arḍinî bih.",
          fr: "Ô Allah, je Te demande de choisir pour moi par Ta science, je Te demande de m'en rendre capable par Ta puissance, et je Te demande de Ton immense grâce. Car Toi Tu es capable et je ne le suis pas, Tu sais et je ne sais pas, et Tu es le Grand Connaisseur de l'invisible. Ô Allah, si Tu sais que cette affaire (…) est un bien pour moi dans ma religion, ma vie et l'issue de mon affaire, alors destine-la-moi, facilite-la-moi, puis bénis-la-moi. Et si Tu sais que cette affaire est un mal pour moi dans ma religion, ma vie et l'issue de mon affaire, alors écarte-la de moi et écarte-moi d'elle, destine-moi le bien où qu'il soit, puis rends-moi satisfait de lui.",
          source: "Al-Bukhari",
        },
      ],
    },
    {
      titre: "Avancer avec confiance",
      resume: "Agir, puis accepter ce qu'Allah facilite.",
      illustration: "chemin",
      points: [
        "Après l'istikhâra, avance dans ce que tu avais envisagé en t'appuyant sur Allah (tawakkul).",
        "Si les choses se facilitent, c'est le bien qu'Allah t'a choisi ; si elles se bloquent, c'est qu'Il l'a écarté de toi. Dans les deux cas, tu as demandé « rends-moi satisfait ».",
        "Il n'est pas nécessaire de voir un rêve ni de ressentir quelque chose : rien de tel n'est mentionné dans le hadith.",
        "Si l'hésitation persiste, des savants permettent de répéter l'istikhâra.",
      ],
    },
  ],
  aEviter: [
    "Attendre un rêve (ou dormir exprès après la prière) pour avoir la réponse : ce n'est pas dans la Sunna.",
    "Demander à quelqu'un d'autre de faire l'istikhâra à ta place, ou payer quelqu'un pour « lire » la réponse.",
    "Ouvrir le Coran au hasard, compter sur un chapelet ou tirer au sort pour décider : ces pratiques n'ont pas de fondement.",
    "Faire l'istikhâra pour une chose interdite ou déjà obligatoire.",
    "Prononcer l'intention à voix haute.",
  ],
  fin: {
    titre: "Tu as remis ton affaire à Allah",
    texte:
      "« Tu sais et je ne sais pas » : avance sereinement, Allah choisit mieux pour toi que toi-même.",
  },
};

/* ================= Omra ================= */

export const GUIDE_OMRA: Guide = {
  id: "omra",
  titre: "Ma Omra pas à pas",
  sousTitre: "De la sacralisation à la coupe des cheveux",
  intro:
    "La 'umra se compose de 4 piliers : l'ihrâm (sacralisation), le tawâf (7 tours de la Ka'ba), le sa'y (7 trajets entre Ṣafâ et Marwa) et le rasage ou raccourcissement des cheveux. Suis les étapes une par une, coche-les au fur et à mesure : ta progression est gardée sur ton téléphone.",
  merites: [
    {
      texte:
        "Une 'umra à une autre expie ce qui est entre elles, et le hajj agréé n'a d'autre récompense que le Paradis.",
      source: "Al-Bukhari & Muslim",
    },
    {
      texte: "Une 'umra pendant le Ramadan équivaut à un hajj.",
      source: "Al-Bukhari & Muslim",
    },
  ],
  etapes: [
    {
      titre: "Préparer son départ",
      resume: "Le cœur, les connaissances et la valise.",
      illustration: "valise",
      points: [
        "Purifie ton intention : faire la 'umra pour Allah seul, en suivant le Prophète ﷺ.",
        "Repens-toi, règle tes dettes ou note-les, demande pardon à ceux que tu as pu blesser.",
        "Apprends les étapes avant de partir (ce guide est fait pour ça) : sur place, l'émotion et la foule font vite oublier.",
        "Homme : 2 draps blancs (izâr autour de la taille, ridâ' sur les épaules), des sandales laissant voir le dessus du pied, une ceinture. Femme : ses vêtements habituels, amples et pudiques, de n'importe quelle couleur.",
        "Pense au savon et au déodorant sans parfum : une fois sacralisé, le parfum est interdit.",
      ],
    },
    {
      titre: "Au mîqât : la sacralisation",
      resume: "On entre en état d'ihrâm avant de franchir la limite.",
      illustration: "miqat",
      points: [
        "Le mîqât est la limite qu'on ne franchit pas sans être en ihrâm. Le Prophète ﷺ a fixé : Dhul-Ḥulayfa pour les gens de Médine, al-Juḥfa pour ceux du Shâm (et d'Égypte, du Maghreb, d'Europe), Qarn al-Manâzil pour le Najd, Yalamlam pour le Yémen (Al-Bukhari & Muslim), et Dhât 'Irq pour l'Irak (Muslim).",
        "En avion depuis la France vers Djeddah, tu passes le mîqât en vol : prépare-toi avant (à la maison ou à l'aéroport), et formule l'intention dans l'avion quand l'équipage annonce le mîqât. Djeddah n'est pas un mîqât pour qui vient d'Europe.",
        "Si tu vas d'abord à Médine, tu te sacralises au mîqât de Dhul-Ḥulayfa (Abyâr 'Alî) en partant vers La Mecque.",
        "Avant l'ihrâm : fais un grand lavage (ghusl), coupe ongles et poils si besoin, et pour l'homme parfume son corps (tête, barbe) mais pas les vêtements, comme le Prophète ﷺ (Al-Bukhari & Muslim).",
        "Il n'y a pas de prière propre à l'ihrâm : si le moment coïncide avec une prière obligatoire, sacralise-toi après elle, comme le Prophète ﷺ.",
        "Une femme qui a ses règles entre quand même en ihrâm : elle fait tout sauf le tawâf, jusqu'à être pure (Al-Bukhari & Muslim).",
      ],
    },
    {
      titre: "L'intention et la talbiya",
      resume: "« Labbayka 'umratan », puis la talbiya en boucle.",
      illustration: "talbiya",
      points: [
        "Formule l'intention en disant : « Labbayka 'umratan » (Me voici, ô Allah, pour une 'umra).",
        "Si tu crains un empêchement (maladie, problème de visa…), ajoute : « Allâhumma maḥillî ḥaythu ḥabastanî » — Mon lieu de désacralisation est là où Tu me retiendras (Al-Bukhari & Muslim).",
        "Répète ensuite la talbiya souvent : les hommes à voix haute, les femmes à voix basse. Continue jusqu'au début du tawâf.",
      ],
      dhikrs: [
        {
          titre: "La talbiya",
          arabe:
            "لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ",
          translit:
            "Labbayka-llâhumma labbayk, labbayka lâ sharîka laka labbayk, innal-ḥamda wan-ni'mata laka wal-mulk, lâ sharîka lak.",
          fr: "Me voici, ô Allah, me voici ! Me voici, Tu n'as pas d'associé, me voici ! La louange, le bienfait et la royauté T'appartiennent. Tu n'as pas d'associé.",
          source: "Al-Bukhari & Muslim",
        },
      ],
    },
    {
      titre: "Les interdits de l'ihrâm",
      resume: "Ce qu'on laisse de côté jusqu'à la fin.",
      illustration: "interdits",
      points: [
        "Pour tous : se couper cheveux ou poils, se couper les ongles, se parfumer (corps, vêtements, savon parfumé), chasser, conclure un mariage, les relations intimes et les préliminaires.",
        "Homme : pas de vêtement cousu à la forme du corps (chemise, pantalon, caleçon, burnous), pas de couvre-chef collé à la tête, pas de chaussures couvrantes (Al-Bukhari & Muslim). Un parasol ou le toit d'un bus, c'est permis.",
        "Femme : pas de niqâb ni de gants (Al-Bukhari). Elle peut couvrir son visage avec son voile en présence d'hommes étrangers.",
        "Permis : se laver, changer de draps, porter montre, lunettes, ceinture-banane, se gratter doucement, dormir.",
        "Commis par oubli ou ignorance : pas de péché. Si ça arrive volontairement ou par besoin (maladie…), renseigne-toi auprès d'un savant pour la compensation.",
      ],
    },
    {
      titre: "Entrer dans la Mosquée sacrée",
      resume: "Pied droit, invocation, et le premier regard sur la Ka'ba.",
      illustration: "mosquee",
      points: [
        "Entre du pied droit en disant : « Allâhumma-ftaḥ lî abwâba raḥmatik » (Muslim).",
        "En voyant la Ka'ba, aucune invocation particulière n'est authentiquement établie : invoque avec ce que tu veux, dans ta langue.",
        "Homme : juste avant le tawâf, découvre l'épaule droite (iḍṭibâ') en passant le drap sous le bras droit. On ne le fait que pendant ce tawâf.",
        "Vérifie que tu as tes ablutions : la majorité des savants les exigent pour le tawâf.",
      ],
      dhikrs: [
        {
          titre: "En entrant à la mosquée",
          arabe: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
          translit: "Allâhumma-ftaḥ lî abwâba raḥmatik.",
          fr: "Ô Allah, ouvre-moi les portes de Ta miséricorde.",
          source: "Muslim",
        },
      ],
    },
    {
      titre: "Le tawâf : 7 tours",
      resume: "La Ka'ba à ta gauche, départ de la Pierre noire.",
      illustration: "tawaf",
      outil: "tawaf",
      points: [
        "Arrête la talbiya. Place-toi au niveau de la Pierre noire (repère : la lumière verte sur le mur de la mosquée), la Ka'ba à ta gauche.",
        "À chaque passage devant la Pierre noire : touche-la ou embrasse-la si c'est facile ; sinon, fais-lui face et montre-la de la main droite en disant « Allâhu akbar » (Al-Bukhari). Ne bouscule personne pour l'atteindre.",
        "Homme : marche rapide à petits pas (raml) pendant les 3 premiers tours, puis marche normale (Muslim).",
        "Au coin yéménite (le coin juste avant la Pierre noire), touche-le de la main si c'est facile, sans l'embrasser ni le montrer du doigt.",
        "Entre le coin yéménite et la Pierre noire, dis : « Rabbanâ âtinâ fid-dunyâ ḥasanah… » (Abu Dawud).",
        "Le reste du temps : dhikr, Coran, invocations libres, dans ta langue. Il n'existe pas d'invocation propre à chaque tour.",
        "Passe à l'extérieur du Ḥijr d'Ismâ'îl (le muret en demi-cercle) : il fait partie de la Ka'ba.",
        "En cas de doute sur le nombre de tours, retiens le plus petit chiffre.",
      ],
      dhikrs: [
        {
          titre: "Entre le coin yéménite et la Pierre noire",
          arabe:
            "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
          translit:
            "Rabbanâ âtinâ fid-dunyâ ḥasanatan wa fil-âkhirati ḥasanatan wa qinâ 'adhâban-nâr.",
          fr: "Notre Seigneur, accorde-nous une belle part ici-bas et une belle part dans l'au-delà, et protège-nous du châtiment du Feu.",
          source: "Abu Dawud — Coran 2:201",
        },
      ],
    },
    {
      titre: "Deux rak'ât derrière le Maqâm",
      resume: "Couvrir l'épaule, prier derrière le Maqâm Ibrâhîm.",
      illustration: "maqam",
      points: [
        "Homme : recouvre ton épaule droite.",
        "En allant vers le Maqâm Ibrâhîm, récite : « Wattakhidhû min maqâmi Ibrâhîma muṣallâ » (Coran 2:125).",
        "Prie deux rak'ât derrière le Maqâm si possible, sinon n'importe où dans la mosquée. Le Prophète ﷺ y récitait al-Kâfirûn (109) puis al-Ikhlâs (112) (Muslim).",
      ],
      dhikrs: [
        {
          titre: "En allant vers le Maqâm",
          arabe: "وَاتَّخِذُوا مِنْ مَقَامِ إِبْرَاهِيمَ مُصَلًّى",
          translit: "Wattakhidhû min maqâmi Ibrâhîma muṣallâ.",
          fr: "Prenez la station d'Abraham comme lieu de prière.",
          source: "Coran 2:125 — Muslim",
        },
      ],
    },
    {
      titre: "Zamzam et retour à la Pierre",
      resume: "Boire l'eau bénie, puis toucher la Pierre si c'est facile.",
      illustration: "zamzam",
      points: [
        "Bois de l'eau de Zamzam, comme le Prophète ﷺ après ses deux rak'ât (Muslim), et invoque pour ce que tu souhaites : « L'eau de Zamzam est pour ce pour quoi on la boit » (Ibn Mâjah).",
        "Puis, si c'est facile, retourne toucher la Pierre noire avant d'aller au Ṣafâ (Muslim). Sinon, pas de souci : va directement au Ṣafâ.",
      ],
    },
    {
      titre: "Le sa'y : 7 trajets",
      resume: "De Ṣafâ à Marwa, sur les pas de Hâjar.",
      illustration: "say",
      outil: "say",
      points: [
        "En approchant du Ṣafâ (la première fois seulement), récite : « Innaṣ-Ṣafâ wal-Marwata min sha'â'irillâh » puis « Abda'u bimâ bada'allâhu bih » (Je commence par ce par quoi Allah a commencé) (Muslim).",
        "Monte sur le Ṣafâ, tourne-toi vers la Ka'ba, lève les mains et dis le dhikr ci-dessous trois fois, en faisant des invocations entre chaque fois (Muslim).",
        "Marche vers Marwa. Homme : entre les deux lumières vertes, cours (Muslim) ; les femmes marchent normalement.",
        "Arrivé à Marwa, fais la même chose qu'au Ṣafâ (sans relire le verset). Ṣafâ → Marwa = 1 trajet, Marwa → Ṣafâ = 2e trajet… Le 7e se termine à Marwa.",
        "Les ablutions sont recommandées mais pas obligatoires pour le sa'y. Une femme dont les règles arrivent après le tawâf peut faire le sa'y.",
      ],
      dhikrs: [
        {
          titre: "Sur le Ṣafâ et sur Marwa (3 fois)",
          arabe:
            "اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ، أَنْجَزَ وَعْدَهُ، وَنَصَرَ عَبْدَهُ، وَهَزَمَ الْأَحْزَابَ وَحْدَهُ",
          translit:
            "Allâhu akbar, Allâhu akbar, Allâhu akbar. Lâ ilâha illâ-llâhu waḥdahu lâ sharîka lah, lahul-mulku wa lahul-ḥamd, wa huwa 'alâ kulli shay'in qadîr. Lâ ilâha illâ-llâhu waḥdah, anjaza wa'dah, wa naṣara 'abdah, wa hazamal-aḥzâba waḥdah.",
          fr: "Allah est le plus Grand (3 fois). Nulle divinité hormis Allah, Seul, sans associé ; à Lui la royauté et la louange, et Il est capable de toute chose. Nulle divinité hormis Allah, Seul : Il a tenu Sa promesse, secouru Son serviteur et vaincu, Seul, les coalisés.",
          source: "Muslim",
        },
        {
          titre: "En approchant du Ṣafâ (1re fois)",
          arabe:
            "إِنَّ الصَّفَا وَالْمَرْوَةَ مِنْ شَعَائِرِ اللَّهِ — أَبْدَأُ بِمَا بَدَأَ اللَّهُ بِهِ",
          translit:
            "Innaṣ-Ṣafâ wal-Marwata min sha'â'irillâh — Abda'u bimâ bada'allâhu bih.",
          fr: "Ṣafâ et Marwa sont vraiment parmi les lieux sacrés d'Allah (Coran 2:158) — Je commence par ce par quoi Allah a commencé.",
          source: "Muslim",
        },
      ],
      astuce:
        "Pendant les trajets, invoque librement. Des Compagnons (Ibn Mas'ûd, Ibn 'Umar) disaient : « Rabbi-ghfir warḥam, innaka antal-a'azzul-akram ».",
    },
    {
      titre: "Couper les cheveux",
      resume: "Le dernier geste : la 'umra est terminée !",
      illustration: "ciseaux",
      points: [
        "Homme : raser la tête est le meilleur — le Prophète ﷺ a invoqué trois fois la miséricorde pour ceux qui rasent et une fois pour ceux qui raccourcissent (Al-Bukhari & Muslim). Si tu raccourcis, fais-le sur l'ensemble de la tête, pas seulement quelques mèches.",
        "Femme : elle ne rase pas ; elle rassemble ses cheveux et en coupe l'équivalent d'une phalange (environ 1 à 2 cm) au bout (Abu Dawud). Elle le fait à l'abri des regards.",
        "Ça y est : tous les interdits de l'ihrâm sont levés. Tu peux te changer, te parfumer, et reprendre ta vie normale.",
      ],
      astuce:
        "Garde ton énergie : profite ensuite de ton séjour pour prier à la Mosquée sacrée (une prière y vaut 100 000 prières ailleurs — Ibn Mâjah & Ahmad) et faire des tawâf surérogatoires.",
    },
  ],
  aEviter: [
    "Réciter un livret de douas « spéciales » pour chaque tour de tawâf ou de sa'y : rien de tel n'est établi. Invoque avec tes propres mots.",
    "Répéter en chœur, à voix forte, les invocations d'un guide : cela dérange les autres fidèles.",
    "Bousculer ou faire mal pour toucher la Pierre noire : la montrer de la main suffit.",
    "Toucher ou frotter le Maqâm Ibrâhîm, les murs ou le tissu de la Ka'ba pour la baraka : seuls la Pierre noire et le coin yéménite se touchent.",
    "Garder l'épaule découverte en dehors du tawâf, ou pendant la prière.",
    "Passer le mîqât sans ihrâm, en pensant se sacraliser à Djeddah.",
    "Ne couper que quelques cheveux (homme) ou oublier la coupe : sans elle, la 'umra n'est pas terminée.",
    "Passer le tawâf à filmer et à prendre des selfies : ce moment est une adoration.",
  ],
  fin: {
    titre: "Taqabbala-llâhu minnâ wa minkum !",
    texte:
      "Ta 'umra est terminée. Qu'Allah l'accepte, efface tes péchés et te permette d'y revenir.",
  },
};

/* ================= Repentir ================= */

export const GUIDE_TAWBA: Guide = {
  id: "tawba",
  titre: "Le repentir",
  sousTitre: "At-Tawba : revenir vers Allah",
  intro:
    "Tawba veut dire « retour » : revenir vers Allah après s'être éloigné de Lui. Elle est obligatoire pour tout péché, et sa porte reste ouverte jusqu'au dernier souffle. Personne n'est trop loin : c'est Allah Lui-même qui appelle Ses serviteurs à revenir.",
  merites: [
    {
      texte:
        "Dis : « Ô Mes serviteurs qui avez commis des excès à votre propre détriment, ne désespérez pas de la miséricorde d'Allah. Allah pardonne tous les péchés, car c'est Lui le Pardonneur, le Très Miséricordieux. »",
      source: "Coran 39:53",
    },
    {
      texte:
        "Allah se réjouit davantage du repentir de Son serviteur que l'un de vous qui, ayant perdu sa monture chargée de ses provisions en plein désert, la retrouve soudain.",
      source: "Al-Bukhari & Muslim",
    },
    {
      texte:
        "Celui qui se repent du péché est comme celui qui n'a pas de péché.",
      source: "Ibn Mâjah (bon)",
    },
  ],
  etapes: [
    {
      titre: "Comprendre la tawba",
      resume: "Une porte grande ouverte, pour tous les péchés.",
      illustration: "porte",
      points: [
        "Même le Prophète ﷺ, pardonné de tout, disait : « Ô gens, repentez-vous à Allah : je me repens à Lui cent fois par jour » (Muslim). Le repentir n'est pas réservé aux « grands pécheurs » : c'est l'adoration de tous les jours.",
        "Allah tend Sa main la nuit pour que se repente celui qui a mal agi le jour, et le jour pour que se repente celui qui a mal agi la nuit, jusqu'à ce que le soleil se lève à l'ouest (Muslim).",
        "Le repentir est accepté tant que l'âme n'est pas arrivée à la gorge, au moment de l'agonie (At-Tirmidhi). N'attends donc pas : personne ne connaît son terme.",
        "Pour celui qui se repent sincèrement, Allah fait plus que pardonner : « Allah changera leurs mauvaises actions en bonnes » (Coran 25:70).",
      ],
    },
    {
      titre: "Les trois conditions",
      resume: "Cesser, regretter, ne plus recommencer.",
      illustration: "coeur",
      points: [
        "Cesser le péché tout de suite : on ne peut pas se repentir d'une chose qu'on continue à faire.",
        "Le regretter sincèrement dans son cœur : « Le regret, c'est le repentir » (Ibn Mâjah & Ahmad).",
        "Avoir la ferme résolution de ne pas y revenir. Si tu rechutes plus tard, ton premier repentir n'est pas annulé : tu te repens à nouveau (voir la dernière étape).",
        "Le faire sincèrement pour Allah, et non par peur du regard des gens ou d'une conséquence de ce monde.",
      ],
      astuce:
        "Pas besoin de raconter ton péché à qui que ce soit : le repentir est entre toi et Allah, sans intermédiaire.",
    },
    {
      titre: "Rendre aux gens leurs droits",
      resume: "Une 4e condition quand le péché touche autrui.",
      illustration: "balance",
      points: [
        "Si le péché concerne quelqu'un d'autre (argent pris, dette, médisance, tort causé), il faut en plus rendre son droit ou obtenir son pardon.",
        "« Que celui qui a commis une injustice envers son frère, dans son honneur ou autre chose, s'en libère aujourd'hui, avant le jour où il n'y aura ni dinar ni dirham » : ce jour-là, on prendra de ses bonnes actions pour les donner à sa victime (Al-Bukhari).",
        "Rends ce que tu as pris, même discrètement. Si la personne est introuvable ou décédée, donne l'équivalent en aumône en son nom et invoque pour elle.",
        "Pour la médisance, si révéler la faute risque d'aggraver les choses, des savants conseillent d'invoquer pour la personne et de dire du bien d'elle là où tu en avais dit du mal.",
        "Rattrape aussi ce qui peut l'être envers Allah : jeûnes manqués du Ramadan, zakât non versée. Pour les prières délaissées, les savants divergent : demande conseil et multiplie les prières surérogatoires.",
      ],
    },
    {
      titre: "La prière du repentir",
      resume: "Ablutions, deux rak'ât, puis demander pardon.",
      illustration: "tapis",
      points: [
        "Abû Bakr rapporte que le Prophète ﷺ a dit : « Il n'est pas d'homme qui commet un péché, puis se lève, se purifie, prie deux rak'ât et demande pardon à Allah, sans qu'Allah ne lui pardonne. » Puis il récita : « Et ceux qui, lorsqu'ils ont commis une turpitude ou fait du tort à eux-mêmes, se souviennent d'Allah et demandent pardon pour leurs péchés… » (Coran 3:135) — Abu Dawud & At-Tirmidhi.",
        "Fais des ablutions complètes et soignées : les péchés sortent avec l'eau (Muslim).",
        "Prie deux rak'ât surérogatoires, avec les sourates que tu veux, en dehors des moments interdits.",
        "Puis demande pardon avec tes mots et avec les formules de l'étape suivante, en reconnaissant sincèrement ta faute.",
      ],
    },
    {
      titre: "Les formules du pardon",
      resume: "Les mots enseignés par le Prophète ﷺ.",
      illustration: "mains",
      points: [
        "Le Prophète ﷺ demandait pardon plus de soixante-dix fois par jour (Al-Bukhari). Prends l'habitude d'un nombre fixe, par exemple 100 fois « Astaghfirullâh wa atûbu ilayh ».",
        "La meilleure formule est le Sayyid al-Istighfâr, à dire le matin et le soir.",
      ],
      dhikrs: [
        {
          titre: "Sayyid al-Istighfâr",
          arabe:
            "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
          translit:
            "Allâhumma anta Rabbî lâ ilâha illâ anta, khalaqtanî wa anâ 'abduka, wa anâ 'alâ 'ahdika wa wa'dika mâ-staṭa'tu, a'ûdhu bika min sharri mâ ṣana'tu, abû'u laka bini'matika 'alayya, wa abû'u bidhanbî, fa-ghfir lî fa-innahu lâ yaghfiru-dh-dhunûba illâ anta.",
          fr: "Ô Allah, Tu es mon Seigneur, il n'y a de divinité que Toi. Tu m'as créé et je suis Ton serviteur. Je me tiens à Ton pacte et à Ta promesse autant que je le peux. Je cherche protection auprès de Toi contre le mal que j'ai commis. Je reconnais Tes bienfaits envers moi et je reconnais mon péché : pardonne-moi, car nul ne pardonne les péchés en dehors de Toi.",
          source: "Al-Bukhari",
        },
        {
          titre: "Même s'il avait fui le combat",
          arabe:
            "أَسْتَغْفِرُ اللَّهَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيَّ الْقَيُّومَ وَأَتُوبُ إِلَيْهِ",
          translit:
            "Astaghfirullâhal-ladhî lâ ilâha illâ huwal-Ḥayyal-Qayyûma wa atûbu ilayh.",
          fr: "Je demande pardon à Allah, en dehors de qui il n'y a pas de divinité, le Vivant, Celui qui subsiste par Lui-même, et je me repens à Lui.",
          source: "Abu Dawud & At-Tirmidhi",
        },
        {
          titre: "Cent fois dans une assemblée",
          arabe:
            "رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ",
          translit: "Rabbi-ghfir lî wa tub 'alayya innaka antat-Tawwâbur-Raḥîm.",
          fr: "Seigneur, pardonne-moi et accepte mon repentir, Tu es le Très Accueillant au repentir, le Très Miséricordieux.",
          source: "Abu Dawud & At-Tirmidhi",
        },
        {
          titre: "L'invocation d'Adam et Ève",
          arabe:
            "رَبَّنَا ظَلَمْنَا أَنْفُسَنَا وَإِنْ لَمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ",
          translit:
            "Rabbanâ ẓalamnâ anfusanâ wa in lam taghfir lanâ wa tarḥamnâ lanakûnanna minal-khâsirîn.",
          fr: "Notre Seigneur, nous nous sommes fait du tort à nous-mêmes. Si Tu ne nous pardonnes pas et ne nous fais pas miséricorde, nous serons certes du nombre des perdants.",
          source: "Coran 7:23",
        },
      ],
    },
    {
      titre: "Effacer par le bien",
      resume: "Les bonnes actions et les moments bénis.",
      illustration: "etoile",
      points: [
        "« Crains Allah où que tu sois, fais suivre la mauvaise action d'une bonne qui l'effacera, et comporte-toi bien avec les gens » (At-Tirmidhi). « Les bonnes actions dissipent les mauvaises » (Coran 11:114).",
        "Les cinq prières, le vendredi au vendredi et le Ramadan au Ramadan effacent ce qui est entre eux, tant qu'on évite les grands péchés (Muslim).",
        "Choisis les moments où l'invocation est exaucée : le dernier tiers de la nuit, la prosternation, entre l'appel à la prière et l'iqâma, la dernière heure du vendredi, le jour de 'Arafa, et pendant le jeûne.",
        "Change d'environnement si nécessaire : l'homme qui avait tué cent personnes fut conseillé de quitter la terre de ses péchés pour une terre de gens pieux (Al-Bukhari & Muslim).",
      ],
    },
    {
      titre: "Et si je rechute ?",
      resume: "Recommencer à se repentir, sans jamais désespérer.",
      illustration: "chemin",
      points: [
        "Dans un hadith qudsi, un serviteur pèche puis dit « Seigneur, pardonne-moi », et Allah dit : « Mon serviteur a su qu'il a un Seigneur qui pardonne les péchés et qui en tient compte : Je lui ai pardonné. » Cela se répète plusieurs fois, et Allah lui pardonne à chaque fois (Al-Bukhari & Muslim).",
        "« Tous les fils d'Adam commettent des fautes, et les meilleurs de ceux qui commettent des fautes sont ceux qui se repentent » (At-Tirmidhi & Ibn Mâjah).",
        "La rechute ne doit pas te faire abandonner : c'est justement ce que Satan veut. Chaque retour vers Allah est une victoire sur lui.",
        "Mais le repentir n'est pas un permis : continuer à pécher en comptant se repentir « plus tard » est une ruse de Satan. Reviens tout de suite.",
      ],
    },
  ],
  aEviter: [
    "Désespérer de la miséricorde d'Allah : c'est en soi un grand péché (Coran 12:87 et 39:53).",
    "Repousser son repentir à plus tard : la mort arrive sans prévenir.",
    "Afficher ses péchés ou s'en vanter : « Toute ma communauté sera pardonnée, sauf ceux qui s'exposent » — celui qui raconte ce qu'Allah avait couvert pendant la nuit (Al-Bukhari & Muslim).",
    "Croire qu'il faut se confesser à quelqu'un, un imam ou un « cheikh », pour être pardonné.",
    "Dire « Astaghfirullâh » en continuant le péché, sans regret ni résolution.",
    "Négliger les droits des gens en pensant que le repentir envers Allah suffit.",
  ],
  fin: {
    titre: "Bienvenue sur le chemin du retour",
    texte:
      "« Allah aime ceux qui se repentent et Il aime ceux qui se purifient » (Coran 2:222). Garde l'istighfâr sur ta langue chaque jour.",
  },
};
