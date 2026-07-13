export interface Invocation {
  titre: string;
  arabe: string;
  translit: string;
  fr: string;
  source: string;
  note?: string;
}

export interface CategorieInvocations {
  id: string;
  nom: string;
  icone: string; // id dans ICONES_CATEGORIES
  invocations: Invocation[];
}

/** Invocations authentiques (Hisn al-Muslim). */
export const CATEGORIES_INVOCATIONS: CategorieInvocations[] = [
  {
    id: "matin-soir",
    nom: "Matin & soir",
    icone: "aube",
    invocations: [
      {
        titre: "La meilleure demande de pardon (Sayyid al-Istighfâr)",
        arabe:
          "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
        translit:
          "Allâhumma anta Rabbî lâ ilâha illâ anta, khalaqtanî wa anâ 'abduka, wa anâ 'alâ 'ahdika wa wa'dika mâ-staṭa'tu, a'ûdhu bika min sharri mâ ṣana'tu, abû'u laka bini'matika 'alayya, wa abû'u bidhanbî, fa-ghfir lî fa-innahu lâ yaghfiru-dh-dhunûba illâ anta.",
        fr: "Ô Allah, Tu es mon Seigneur, il n'y a de divinité digne d'adoration que Toi. Tu m'as créé et je suis Ton serviteur. Je me tiens à Ton pacte et à Ta promesse autant que je le peux. Je cherche protection auprès de Toi contre le mal que j'ai commis. Je reconnais Tes bienfaits envers moi et je reconnais mon péché : pardonne-moi, car nul ne pardonne les péchés en dehors de Toi.",
        source: "Al-Bukhari",
        note: "Qui la dit avec certitude le matin et meurt dans la journée entre au Paradis ; de même le soir.",
      },
      {
        titre: "Protection contre tout mal (3 fois)",
        arabe:
          "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
        translit:
          "Bismillâhi-lladhî lâ yaḍurru ma'a-smihi shay'un fil-arḍi wa lâ fis-samâ'i wa huwa-s-Samî'ul-'Alîm.",
        fr: "Au nom d'Allah, avec le nom duquel rien ne peut nuire, ni sur terre ni dans le ciel, et Il est l'Audient, l'Omniscient.",
        source: "Abu Dawud & At-Tirmidhi",
        note: "À dire trois fois le matin et le soir.",
      },
    ],
  },
  {
    id: "sommeil",
    nom: "Sommeil & réveil",
    icone: "lune",
    invocations: [
      {
        titre: "Avant de dormir",
        arabe: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
        translit: "Bismika Allâhumma amûtu wa aḥyâ.",
        fr: "C'est en Ton nom, ô Allah, que je meurs et que je vis.",
        source: "Al-Bukhari",
      },
      {
        titre: "Au réveil",
        arabe:
          "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
        translit:
          "Al-ḥamdu lillâhi-lladhî aḥyânâ ba'da mâ amâtanâ wa ilayhi-n-nushûr.",
        fr: "Louange à Allah qui nous a redonné la vie après nous avoir fait mourir, et c'est vers Lui que se fera la résurrection.",
        source: "Al-Bukhari",
      },
    ],
  },
  {
    id: "maison-mosquee",
    nom: "Maison & mosquée",
    icone: "maison",
    invocations: [
      {
        titre: "En sortant de la maison",
        arabe:
          "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
        translit:
          "Bismillâh, tawakkaltu 'alâ-llâh, wa lâ ḥawla wa lâ quwwata illâ billâh.",
        fr: "Au nom d'Allah, je place ma confiance en Allah, et il n'y a de force ni de puissance qu'en Allah.",
        source: "Abu Dawud & At-Tirmidhi",
      },
      {
        titre: "En entrant à la mosquée",
        arabe: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
        translit: "Allâhumma-ftaḥ lî abwâba raḥmatik.",
        fr: "Ô Allah, ouvre-moi les portes de Ta miséricorde.",
        source: "Muslim",
      },
      {
        titre: "En sortant de la mosquée",
        arabe: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ",
        translit: "Allâhumma innî as'aluka min faḍlik.",
        fr: "Ô Allah, je Te demande de Ta grâce.",
        source: "Muslim",
      },
      {
        titre: "En entrant aux toilettes",
        arabe: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ",
        translit: "Allâhumma innî a'ûdhu bika minal-khubuthi wal-khabâ'ith.",
        fr: "Ô Allah, je cherche protection auprès de Toi contre les démons mâles et femelles.",
        source: "Al-Bukhari & Muslim",
      },
    ],
  },
  {
    id: "repas",
    nom: "Repas",
    icone: "couverts",
    invocations: [
      {
        titre: "Avant de manger",
        arabe: "بِسْمِ اللَّهِ",
        translit: "Bismillâh.",
        fr: "Au nom d'Allah. (En cas d'oubli, dire : « Bismillâhi awwalahu wa âkhirahu » — Au nom d'Allah au début et à la fin.)",
        source: "Abu Dawud & At-Tirmidhi",
      },
      {
        titre: "Après le repas",
        arabe:
          "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",
        translit:
          "Al-ḥamdu lillâhi-lladhî aṭ'amanâ wa saqânâ wa ja'alanâ muslimîn.",
        fr: "Louange à Allah qui nous a nourris, abreuvés et a fait de nous des musulmans.",
        source: "Abu Dawud & At-Tirmidhi",
      },
    ],
  },
  {
    id: "difficulte",
    nom: "Difficulté & pardon",
    icone: "coeur",
    invocations: [
      {
        titre: "Dans l'angoisse et l'épreuve",
        arabe:
          "لَا إِلَهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ الْعَرْشِ الْعَظِيمِ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ السَّمَاوَاتِ وَرَبُّ الْأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيمِ",
        translit:
          "Lâ ilâha illâ-llâhul-'Aḍhîmul-Ḥalîm, lâ ilâha illâ-llâhu Rabbul-'arshil-'aḍhîm, lâ ilâha illâ-llâhu Rabbus-samâwâti wa Rabbul-arḍi wa Rabbul-'arshil-karîm.",
        fr: "Il n'y a de divinité digne d'adoration qu'Allah, l'Immense, le Longanime. Il n'y a de divinité qu'Allah, Seigneur du Trône immense. Il n'y a de divinité qu'Allah, Seigneur des cieux, Seigneur de la terre et Seigneur du noble Trône.",
        source: "Al-Bukhari & Muslim",
      },
      {
        titre: "Quand une chose t'accable",
        arabe: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
        translit: "Ḥasbunâ-llâhu wa ni'mal-wakîl.",
        fr: "Allah nous suffit, et quel excellent Garant !",
        source: "Al-Bukhari",
      },
      {
        titre: "Demande de pardon",
        arabe:
          "رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ",
        translit: "Rabbi-ghfir lî wa tub 'alayya innaka anta-t-Tawwâbur-Raḥîm.",
        fr: "Seigneur, pardonne-moi et accepte mon repentir. Tu es certes le Très Accueillant au repentir, le Très Miséricordieux.",
        source: "Abu Dawud & At-Tirmidhi",
      },
    ],
  },
];
