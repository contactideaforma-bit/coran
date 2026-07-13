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
      {
        titre: "La satisfaction (3 fois)",
        arabe:
          "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ ﷺ نَبِيًّا",
        translit:
          "Raḍîtu billâhi rabban, wa bil-islâmi dînan, wa bi-Muḥammadin ﷺ nabiyyan.",
        fr: "Je suis satisfait d'Allah comme Seigneur, de l'islam comme religion et de Muhammad ﷺ comme Prophète.",
        source: "Abu Dawud & At-Tirmidhi",
        note: "Trois fois matin et soir : le Paradis lui est dû.",
      },
      {
        titre: "Au matin (et au soir)",
        arabe:
          "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ",
        translit:
          "Aṣbaḥnâ wa aṣbaḥal-mulku lillâh, wal-ḥamdu lillâh, lâ ilâha illâ-llâhu waḥdahu lâ sharîka lah.",
        fr: "Nous voici au matin, et le règne appartient à Allah. Louange à Allah ! Il n'y a de divinité qu'Allah, Seul, sans associé.",
        source: "Muslim",
        note: "Le soir, dire « Amsaynâ wa amsal-mulku lillâh… » (Nous voici au soir…).",
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
        titre: "Âyat al-Kursî avant de dormir",
        arabe:
          "اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
        translit:
          "Allâhu lâ ilâha illâ huwal-Ḥayyul-Qayyûm… (Coran 2:255)",
        fr: "Le verset du Trône (Coran 2:255) : Allah ! Point de divinité que Lui, le Vivant, Celui qui subsiste par Lui-même…",
        source: "Al-Bukhari",
        note: "Qui le récite en se couchant reste sous la protection d'Allah : aucun démon ne l'approche jusqu'au matin.",
      },
      {
        titre: "En se couchant sur le côté droit",
        arabe: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ",
        translit: "Allâhumma qinî 'adhâbaka yawma tab'athu 'ibâdak.",
        fr: "Ô Allah, préserve-moi de Ton châtiment le jour où Tu ressusciteras Tes serviteurs.",
        source: "Abu Dawud & At-Tirmidhi",
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
      {
        titre: "En sortant des toilettes",
        arabe: "غُفْرَانَكَ",
        translit: "Ghufrânak.",
        fr: "(Je Te demande) Ton pardon.",
        source: "Abu Dawud & At-Tirmidhi",
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
      {
        titre: "À la rupture du jeûne",
        arabe:
          "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الْأَجْرُ إِنْ شَاءَ اللَّهُ",
        translit:
          "Dhahaba-ẓ-ẓama'u wabtallatil-'urûqu wa thabatal-ajru in shâ'a-llâh.",
        fr: "La soif est partie, les veines sont abreuvées et la récompense est confirmée, si Allah le veut.",
        source: "Abu Dawud (bon)",
      },
      {
        titre: "Pour celui qui t'a offert à manger",
        arabe: "اللَّهُمَّ أَطْعِمْ مَنْ أَطْعَمَنِي وَاسْقِ مَنْ سَقَانِي",
        translit: "Allâhumma aṭ'im man aṭ'amanî wasqi man saqânî.",
        fr: "Ô Allah, nourris celui qui m'a nourri et abreuve celui qui m'a abreuvé.",
        source: "Muslim",
      },
    ],
  },
  {
    id: "apres-priere",
    nom: "Après la prière",
    icone: "horloge",
    invocations: [
      {
        titre: "Demande de pardon et salutation",
        arabe:
          "أَسْتَغْفِرُ اللَّهَ (٣ مرات) اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ",
        translit:
          "Astaghfirullâh (3 fois). Allâhumma antas-salâm wa minkas-salâm, tabârakta yâ dhal-jalâli wal-ikrâm.",
        fr: "Je demande pardon à Allah (3 fois). Ô Allah, Tu es la Paix et de Toi vient la paix. Béni sois-Tu, ô Détenteur de la majesté et de la générosité.",
        source: "Muslim",
      },
      {
        titre: "Le tasbîh (33-33-34)",
        arabe:
          "سُبْحَانَ اللَّهِ (٣٣) الْحَمْدُ لِلَّهِ (٣٣) اللَّهُ أَكْبَرُ (٣٣) لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
        translit:
          "SubḥânAllâh (33), al-ḥamdu lillâh (33), Allâhu akbar (33), puis : lâ ilâha illâ-llâhu waḥdahu lâ sharîka lah, lahul-mulku wa lahul-ḥamdu wa huwa 'alâ kulli shay'in qadîr.",
        fr: "Gloire à Allah (33 fois), louange à Allah (33 fois), Allah est le plus Grand (33 fois), puis la parole d'unicité pour compléter la centaine.",
        source: "Muslim",
        note: "Ses fautes sont pardonnées, fussent-elles comme l'écume de la mer.",
      },
      {
        titre: "Aide-moi à T'adorer",
        arabe:
          "اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ",
        translit:
          "Allâhumma a'innî 'alâ dhikrika wa shukrika wa ḥusni 'ibâdatik.",
        fr: "Ô Allah, aide-moi à me souvenir de Toi, à Te remercier et à T'adorer de la meilleure façon.",
        source: "Abu Dawud & An-Nasa'i",
        note: "Le Prophète ﷺ recommanda à Mu'adh de ne jamais la délaisser après chaque prière.",
      },
    ],
  },
  {
    id: "voyage",
    nom: "Voyage",
    icone: "epingle",
    invocations: [
      {
        titre: "En montant dans un véhicule",
        arabe:
          "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
        translit:
          "Subḥânalladhî sakhkhara lanâ hâdhâ wa mâ kunnâ lahu muqrinîn, wa innâ ilâ rabbinâ lamunqalibûn.",
        fr: "Gloire à Celui qui a mis ceci à notre service alors que nous n'aurions pu le dominer, et c'est vers notre Seigneur que nous retournerons. (Coran 43:13-14)",
        source: "Muslim",
      },
      {
        titre: "Invocation du voyageur",
        arabe:
          "اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى، وَمِنَ الْعَمَلِ مَا تَرْضَى",
        translit:
          "Allâhumma innâ nas'aluka fî safarinâ hâdhal-birra wat-taqwâ, wa minal-'amali mâ tarḍâ.",
        fr: "Ô Allah, nous Te demandons dans ce voyage la bonté et la piété, et des œuvres que Tu agrées.",
        source: "Muslim",
        note: "L'invocation du voyageur est exaucée.",
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
