export interface Invocation {
  titre: string;
  arabe: string;
  translit: string;
  fr: string;
  source: string;
  note?: string;
  lien?: { href: string; libelle: string };
}

export interface CategorieInvocations {
  id: string;
  nom: string;
  icone: string; // id dans ICONES_CATEGORIES
  invocations: Invocation[];
}

/** Invocations authentiques, d'après la Citadelle du musulman (Hisn al-Muslim)
    de Sa'îd al-Qahtânî. Seules les invocations aux chaînes authentiques ou
    bonnes (sahih / hasan) sont retenues. */
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
        titre: "Les trois sourates protectrices (3 fois)",
        arabe:
          "قُلْ هُوَ اللَّهُ أَحَدٌ • اللَّهُ الصَّمَدُ • لَمْ يَلِدْ وَلَمْ يُولَدْ • وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ ۞ قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ • مِنْ شَرِّ مَا خَلَقَ • وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ • وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ • وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ ۞ قُلْ أَعُوذُ بِرَبِّ النَّاسِ • مَلِكِ النَّاسِ • إِلَهِ النَّاسِ • مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ • الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ • مِنَ الْجِنَّةِ وَالنَّاسِ",
        translit:
          "Al-Ikhlâṣ (112), al-Falaq (113) et an-Nâs (114), chacune trois fois.",
        fr: "Dis : Il est Allah, Unique… — Dis : Je cherche protection auprès du Seigneur de l'aube naissante… — Dis : Je cherche protection auprès du Seigneur des hommes…",
        source: "Abu Dawud & At-Tirmidhi",
        note: "Récitées trois fois matin et soir, elles te suffisent contre toute chose.",
        lien: { href: "/sourate/112", libelle: "Lire avec le tajwid" },
      },
      {
        titre: "Protection contre tout mal (3 fois)",
        arabe:
          "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
        translit:
          "Bismillâhi-lladhî lâ yaḍurru ma'a-smihi shay'un fil-arḍi wa lâ fis-samâ'i wa huwa-s-Samî'ul-'Alîm.",
        fr: "Au nom d'Allah, avec le nom duquel rien ne peut nuire, ni sur terre ni dans le ciel, et Il est l'Audient, l'Omniscient.",
        source: "Abu Dawud & At-Tirmidhi",
        note: "Rien ne lui nuira s'il la dit trois fois le matin et trois fois le soir.",
      },
      {
        titre: "La satisfaction (3 fois)",
        arabe:
          "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ ﷺ نَبِيًّا",
        translit:
          "Raḍîtu billâhi rabban, wa bil-islâmi dînan, wa bi-Muḥammadin ﷺ nabiyyan.",
        fr: "Je suis satisfait d'Allah comme Seigneur, de l'islam comme religion et de Muhammad ﷺ comme Prophète.",
        source: "Abu Dawud & At-Tirmidhi",
        note: "Trois fois matin et soir : Allah s'engage à le satisfaire le Jour de la Résurrection.",
      },
      {
        titre: "Au matin (et au soir)",
        arabe:
          "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ",
        translit:
          "Aṣbaḥnâ wa aṣbaḥal-mulku lillâh, wal-ḥamdu lillâh, lâ ilâha illâ-llâhu waḥdahu lâ sharîka lah, lahul-mulku wa lahul-ḥamdu wa huwa 'alâ kulli shay'in qadîr. Rabbi as'aluka khayra mâ fî hâdhal-yawmi wa khayra mâ ba'dah, wa a'ûdhu bika min sharri mâ fî hâdhal-yawmi wa sharri mâ ba'dah. Rabbi a'ûdhu bika minal-kasali wa sû'il-kibar, Rabbi a'ûdhu bika min 'adhâbin fin-nâri wa 'adhâbin fil-qabr.",
        fr: "Nous voici au matin, et le règne appartient à Allah. Louange à Allah ! Il n'y a de divinité qu'Allah, Seul, sans associé ; à Lui la royauté et la louange, et Il est capable de toute chose. Seigneur, je Te demande le bien de ce jour et de ce qui le suit, et je cherche protection auprès de Toi contre le mal de ce jour et de ce qui le suit. Seigneur, je cherche protection auprès de Toi contre la paresse et les maux de la vieillesse ; Seigneur, je cherche protection auprès de Toi contre un châtiment dans le Feu et un châtiment dans la tombe.",
        source: "Muslim",
        note: "Le soir, dire « Amsaynâ wa amsal-mulku lillâh… » et « …hâdhihil-laylah » (cette nuit).",
      },
      {
        titre: "C'est par Toi que nous vivons",
        arabe:
          "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ",
        translit:
          "Allâhumma bika aṣbaḥnâ, wa bika amsaynâ, wa bika naḥyâ, wa bika namûtu, wa ilaykan-nushûr.",
        fr: "Ô Allah, c'est par Toi que nous atteignons le matin et le soir, par Toi que nous vivons et mourons, et vers Toi est la résurrection.",
        source: "At-Tirmidhi & Abu Dawud",
        note: "Le soir : « Allâhumma bika amsaynâ, wa bika aṣbaḥnâ… wa ilaykal-maṣîr » (et vers Toi est le retour).",
      },
      {
        titre: "Demander la préservation",
        arabe:
          "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي، اللَّهُمَّ اسْتُرْ عَوْرَاتِي وَآمِنْ رَوْعَاتِي، اللَّهُمَّ احْفَظْنِي مِنْ بَيْنِ يَدَيَّ وَمِنْ خَلْفِي، وَعَنْ يَمِينِي وَعَنْ شِمَالِي، وَمِنْ فَوْقِي، وَأَعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي",
        translit:
          "Allâhumma innî as'alukal-'afwa wal-'âfiyata fid-dunyâ wal-âkhirah. Allâhumma innî as'alukal-'afwa wal-'âfiyata fî dînî wa dunyâya wa ahlî wa mâlî. Allâhumma-stur 'awrâtî wa âmin raw'âtî. Allâhumma-ḥfaẓnî min bayni yadayya wa min khalfî, wa 'an yamînî wa 'an shimâlî, wa min fawqî, wa a'ûdhu bi'aẓamatika an ughtâla min taḥtî.",
        fr: "Ô Allah, je Te demande le pardon et la préservation ici-bas et dans l'au-delà. Ô Allah, je Te demande le pardon et la préservation dans ma religion, ma vie, ma famille et mes biens. Ô Allah, couvre mes défauts et apaise mes craintes. Ô Allah, protège-moi par-devant, par-derrière, à ma droite, à ma gauche et par-dessus, et je cherche refuge dans Ta grandeur contre le fait d'être pris par-dessous.",
        source: "Abu Dawud & Ibn Mâjah",
        note: "Le Prophète ﷺ ne la délaissait jamais, matin et soir.",
      },
      {
        titre: "Ô Vivant, ô Subsistant",
        arabe:
          "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ",
        translit:
          "Yâ Ḥayyu yâ Qayyûm, biraḥmatika astaghîth, aṣliḥ lî sha'nî kullah, wa lâ takilnî ilâ nafsî ṭarfata 'ayn.",
        fr: "Ô Vivant, ô Celui qui subsiste par Lui-même, c'est Ta miséricorde que j'implore : améliore toutes mes affaires et ne me laisse pas à moi-même, ne serait-ce qu'un clin d'œil.",
        source: "Al-Hâkim & An-Nasa'i (bon)",
      },
      {
        titre: "Gloire à Allah autant que Sa création (3 fois, le matin)",
        arabe:
          "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ",
        translit:
          "Subḥânallâhi wa biḥamdihi 'adada khalqihi, wa riḍâ nafsihi, wa zinata 'arshihi, wa midâda kalimâtih.",
        fr: "Gloire et louange à Allah, autant que le nombre de Ses créatures, autant qu'il Lui plaît, autant que le poids de Son Trône et que l'encre de Ses paroles.",
        source: "Muslim",
        note: "Ces paroles, dites trois fois, pèsent plus que tout un matin de dhikr.",
      },
      {
        titre: "Subḥânallâhi wa biḥamdih (100 fois)",
        arabe: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
        translit: "Subḥânallâhi wa biḥamdih.",
        fr: "Gloire et louange à Allah.",
        source: "Al-Bukhari & Muslim",
        note: "Cent fois par jour : ses péchés sont effacés, fussent-ils comme l'écume de la mer.",
      },
      {
        titre: "L'unicité (100 fois par jour)",
        arabe:
          "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
        translit:
          "Lâ ilâha illâ-llâhu waḥdahu lâ sharîka lah, lahul-mulku wa lahul-ḥamd, wa huwa 'alâ kulli shay'in qadîr.",
        fr: "Nulle divinité hormis Allah, Seul, sans associé ; à Lui la royauté et la louange, et Il est capable de toute chose.",
        source: "Al-Bukhari & Muslim",
        note: "Cent fois par jour : l'équivalent de dix esclaves affranchis, cent bonnes actions inscrites, cent fautes effacées et une protection contre Satan jusqu'au soir.",
      },
      {
        titre: "Le soir : par les paroles parfaites d'Allah (3 fois)",
        arabe: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
        translit: "A'ûdhu bikalimâtillâhit-tâmmâti min sharri mâ khalaq.",
        fr: "Je cherche protection par les paroles parfaites d'Allah contre le mal de ce qu'Il a créé.",
        source: "Muslim",
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
        titre: "Souffler dans ses mains et réciter",
        arabe:
          "قُلْ هُوَ اللَّهُ أَحَدٌ • قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ • قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
        translit: "Al-Ikhlâṣ, al-Falaq et an-Nâs, trois fois.",
        fr: "Joindre les mains, souffler dedans, réciter les trois sourates, puis passer les mains sur tout le corps en commençant par la tête et le visage.",
        source: "Al-Bukhari",
        note: "Le Prophète ﷺ le faisait chaque nuit, trois fois.",
      },
      {
        titre: "Âyat al-Kursî avant de dormir",
        arabe:
          "اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
        translit: "Allâhu lâ ilâha illâ huwal-Ḥayyul-Qayyûm… (Coran 2:255)",
        fr: "Le verset du Trône (Coran 2:255) : Allah ! Point de divinité que Lui, le Vivant, Celui qui subsiste par Lui-même…",
        source: "Al-Bukhari",
        note: "Qui le récite en se couchant reste sous la protection d'Allah : aucun démon ne l'approche jusqu'au matin.",
        lien: { href: "/sourate/2#v-255", libelle: "Lire avec le tajwid" },
      },
      {
        titre: "Les deux derniers versets d'al-Baqara",
        arabe:
          "آمَنَ الرَّسُولُ بِمَا أُنْزِلَ إِلَيْهِ مِنْ رَبِّهِ وَالْمُؤْمِنُونَ … رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِ ۖ وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَا ۚ أَنْتَ مَوْلَانَا فَانْصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ",
        translit: "Âmanar-rasûlu bimâ unzila ilayhi min rabbihi wal-mu'minûn… (Coran 2:285-286)",
        fr: "Le Messager a cru en ce qu'on a fait descendre vers lui de la part de son Seigneur, ainsi que les croyants… Pardonne-nous, fais-nous miséricorde, Tu es notre Maître : donne-nous la victoire sur les mécréants.",
        source: "Al-Bukhari & Muslim",
        note: "Qui les récite la nuit, ils lui suffisent.",
        lien: { href: "/sourate/2#v-285", libelle: "Lire les deux versets" },
      },
      {
        titre: "En te couchant sur le côté droit",
        arabe:
          "بِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي، وَبِكَ أَرْفَعُهُ، فَإِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ",
        translit:
          "Bismika Rabbî waḍa'tu janbî, wa bika arfa'uh, fa-in amsakta nafsî farḥamhâ, wa in arsaltahâ faḥfaẓhâ bimâ taḥfaẓu bihi 'ibâdakaṣ-ṣâliḥîn.",
        fr: "C'est en Ton nom, mon Seigneur, que je pose mon flanc et par Toi que je le relève. Si Tu retiens mon âme, fais-lui miséricorde ; si Tu la renvoies, protège-la comme Tu protèges Tes serviteurs vertueux.",
        source: "Al-Bukhari & Muslim",
      },
      {
        titre: "Je m'en remets à Toi",
        arabe:
          "اللَّهُمَّ أَسْلَمْتُ نَفْسِي إِلَيْكَ، وَفَوَّضْتُ أَمْرِي إِلَيْكَ، وَوَجَّهْتُ وَجْهِي إِلَيْكَ، وَأَلْجَأْتُ ظَهْرِي إِلَيْكَ، رَغْبَةً وَرَهْبَةً إِلَيْكَ، لَا مَلْجَأَ وَلَا مَنْجَا مِنْكَ إِلَّا إِلَيْكَ، آمَنْتُ بِكِتَابِكَ الَّذِي أَنْزَلْتَ، وَبِنَبِيِّكَ الَّذِي أَرْسَلْتَ",
        translit:
          "Allâhumma aslamtu nafsî ilayk, wa fawwaḍtu amrî ilayk, wa wajjahtu wajhî ilayk, wa alja'tu ẓahrî ilayk, raghbatan wa rahbatan ilayk, lâ malja'a wa lâ manjâ minka illâ ilayk, âmantu bikitâbikal-ladhî anzalt, wa binabiyyikal-ladhî arsalt.",
        fr: "Ô Allah, je Te soumets mon âme, je Te confie mon affaire, je tourne mon visage vers Toi et je m'adosse à Toi, par désir et par crainte de Toi. Il n'y a de refuge ni de salut contre Toi qu'auprès de Toi. Je crois en Ton Livre que Tu as révélé et en Ton Prophète que Tu as envoyé.",
        source: "Al-Bukhari & Muslim",
        note: "Ce doit être tes dernières paroles : si tu meurs cette nuit, tu meurs sur la fitra.",
      },
      {
        titre: "En se couchant (variante)",
        arabe: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ",
        translit: "Allâhumma qinî 'adhâbaka yawma tab'athu 'ibâdak.",
        fr: "Ô Allah, préserve-moi de Ton châtiment le jour où Tu ressusciteras Tes serviteurs.",
        source: "Abu Dawud & At-Tirmidhi",
      },
      {
        titre: "Le tasbîh du coucher (33-33-34)",
        arabe: "سُبْحَانَ اللَّهِ (٣٣) الْحَمْدُ لِلَّهِ (٣٣) اللَّهُ أَكْبَرُ (٣٤)",
        translit: "SubḥânAllâh (33), al-ḥamdu lillâh (33), Allâhu akbar (34).",
        fr: "Gloire à Allah (33 fois), louange à Allah (33 fois), Allah est le plus Grand (34 fois).",
        source: "Al-Bukhari & Muslim",
        note: "Le Prophète ﷺ l'enseigna à 'Alî et Fâṭima : « C'est meilleur pour vous qu'un serviteur. »",
      },
      {
        titre: "Après un mauvais rêve",
        arabe: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
        translit: "A'ûdhu billâhi minash-shayṭânir-rajîm.",
        fr: "Je cherche protection auprès d'Allah contre Satan le lapidé.",
        source: "Muslim",
        note: "Souffle légèrement trois fois à ta gauche, dis ceci trois fois, change de côté, et ne raconte ce rêve à personne : il ne te nuira pas. Tu peux aussi te lever et prier.",
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
    id: "ablutions-priere",
    nom: "Ablutions & prière",
    icone: "goutte",
    invocations: [
      {
        titre: "Avant les ablutions",
        arabe: "بِسْمِ اللَّهِ",
        translit: "Bismillâh.",
        fr: "Au nom d'Allah.",
        source: "Abu Dawud & Ibn Mâjah",
      },
      {
        titre: "Après les ablutions",
        arabe:
          "أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ، اللَّهُمَّ اجْعَلْنِي مِنَ التَّوَّابِينَ، وَاجْعَلْنِي مِنَ الْمُتَطَهِّرِينَ",
        translit:
          "Ash-hadu an lâ ilâha illâ-llâhu waḥdahu lâ sharîka lah, wa ash-hadu anna Muḥammadan 'abduhu wa rasûluh. Allâhumma-j'alnî minat-tawwâbîn, waj'alnî minal-mutaṭahhirîn.",
        fr: "J'atteste qu'il n'y a de divinité qu'Allah, Seul, sans associé, et j'atteste que Muhammad est Son serviteur et Son messager. Ô Allah, place-moi parmi ceux qui se repentent et parmi ceux qui se purifient.",
        source: "Muslim (1re partie) & At-Tirmidhi",
        note: "Les huit portes du Paradis lui sont ouvertes : il entre par celle qu'il veut.",
      },
      {
        titre: "Répondre à l'appel à la prière",
        arabe: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
        translit: "Lâ ḥawla wa lâ quwwata illâ billâh.",
        fr: "Répète chaque phrase après le muezzin, sauf « Ḥayya 'alaṣ-ṣalâh » et « Ḥayya 'alal-falâḥ », où tu dis : Il n'y a de force ni de puissance qu'en Allah.",
        source: "Al-Bukhari & Muslim",
      },
      {
        titre: "Après l'appel à la prière",
        arabe:
          "اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ",
        translit:
          "Allâhumma Rabba hâdhihid-da'watit-tâmmah, waṣ-ṣalâtil-qâ'imah, âti Muḥammadanil-wasîlata wal-faḍîlah, wab'ath-hu maqâman maḥmûdanil-ladhî wa'adtah.",
        fr: "Ô Allah, Seigneur de cet appel parfait et de cette prière qui va être accomplie, accorde à Muhammad l'intercession et le haut rang, et ressuscite-le à la station louable que Tu lui as promise.",
        source: "Al-Bukhari",
        note: "Prie d'abord sur le Prophète ﷺ (Muslim). Son intercession est alors acquise le Jour de la Résurrection. Invoque ensuite : l'invocation entre l'appel et l'iqâma n'est pas rejetée (Abu Dawud & At-Tirmidhi).",
      },
      {
        titre: "Ouverture de la prière",
        arabe:
          "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، وَتَبَارَكَ اسْمُكَ، وَتَعَالَى جَدُّكَ، وَلَا إِلَهَ غَيْرُكَ",
        translit:
          "Subḥânaka-llâhumma wa biḥamdik, wa tabârakasmuk, wa ta'âlâ jadduk, wa lâ ilâha ghayruk.",
        fr: "Gloire et louange à Toi, ô Allah. Béni soit Ton nom, élevée soit Ta majesté, et il n'y a de divinité que Toi.",
        source: "Abu Dawud & At-Tirmidhi",
      },
      {
        titre: "Ouverture de la prière (autre formule)",
        arabe:
          "اللَّهُمَّ بَاعِدْ بَيْنِي وَبَيْنَ خَطَايَايَ كَمَا بَاعَدْتَ بَيْنَ الْمَشْرِقِ وَالْمَغْرِبِ، اللَّهُمَّ نَقِّنِي مِنْ خَطَايَايَ كَمَا يُنَقَّى الثَّوْبُ الْأَبْيَضُ مِنَ الدَّنَسِ، اللَّهُمَّ اغْسِلْنِي مِنْ خَطَايَايَ بِالثَّلْجِ وَالْمَاءِ وَالْبَرَدِ",
        translit:
          "Allâhumma bâ'id baynî wa bayna khaṭâyâya kamâ bâ'adta baynal-mashriqi wal-maghrib. Allâhumma naqqinî min khaṭâyâya kamâ yunaqqath-thawbul-abyaḍu minad-danas. Allâhumma-ghsilnî min khaṭâyâya bith-thalji wal-mâ'i wal-barad.",
        fr: "Ô Allah, éloigne-moi de mes fautes comme Tu as éloigné l'Orient de l'Occident. Ô Allah, purifie-moi de mes fautes comme on nettoie le vêtement blanc de la saleté. Ô Allah, lave mes fautes avec la neige, l'eau et la grêle.",
        source: "Al-Bukhari & Muslim",
      },
      {
        titre: "Dans l'inclinaison (rukû')",
        arabe: "سُبْحَانَ رَبِّيَ الْعَظِيمِ",
        translit: "Subḥâna Rabbiyal-'Aẓîm (3 fois).",
        fr: "Gloire à mon Seigneur, l'Immense.",
        source: "Muslim & Abu Dawud",
      },
      {
        titre: "En se relevant de l'inclinaison",
        arabe: "سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ، رَبَّنَا وَلَكَ الْحَمْدُ",
        translit: "Sami'allâhu liman ḥamidah, Rabbanâ wa lakal-ḥamd.",
        fr: "Allah entend celui qui Le loue. Notre Seigneur, à Toi la louange.",
        source: "Al-Bukhari",
      },
      {
        titre: "Dans la prosternation (sujûd)",
        arabe: "سُبْحَانَ رَبِّيَ الْأَعْلَى",
        translit: "Subḥâna Rabbiyal-A'lâ (3 fois).",
        fr: "Gloire à mon Seigneur, le Très-Haut.",
        source: "Muslim & Abu Dawud",
        note: "Multiplie les invocations en prosternation : c'est là que le serviteur est le plus proche de son Seigneur (Muslim).",
      },
      {
        titre: "Entre les deux prosternations",
        arabe: "رَبِّ اغْفِرْ لِي، رَبِّ اغْفِرْ لِي",
        translit: "Rabbi-ghfir lî, Rabbi-ghfir lî.",
        fr: "Seigneur, pardonne-moi. Seigneur, pardonne-moi.",
        source: "Abu Dawud & Ibn Mâjah",
      },
      {
        titre: "Le tashahhud",
        arabe:
          "التَّحِيَّاتُ لِلَّهِ، وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
        translit:
          "At-taḥiyyâtu lillâh, waṣ-ṣalawâtu waṭ-ṭayyibât. As-salâmu 'alayka ayyuhan-nabiyyu wa raḥmatullâhi wa barakâtuh. As-salâmu 'alaynâ wa 'alâ 'ibâdillâhiṣ-ṣâliḥîn. Ash-hadu an lâ ilâha illâ-llâh, wa ash-hadu anna Muḥammadan 'abduhu wa rasûluh.",
        fr: "Les salutations sont à Allah, ainsi que les prières et les bonnes choses. Paix sur toi, ô Prophète, ainsi que la miséricorde d'Allah et Ses bénédictions. Paix sur nous et sur les pieux serviteurs d'Allah. J'atteste qu'il n'y a de divinité qu'Allah et j'atteste que Muhammad est Son serviteur et Son messager.",
        source: "Al-Bukhari & Muslim",
      },
      {
        titre: "La prière sur le Prophète ﷺ",
        arabe:
          "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ، اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ",
        translit:
          "Allâhumma ṣalli 'alâ Muḥammadin wa 'alâ âli Muḥammad, kamâ ṣallayta 'alâ Ibrâhîma wa 'alâ âli Ibrâhîm, innaka Ḥamîdun Majîd. Allâhumma bârik 'alâ Muḥammadin wa 'alâ âli Muḥammad, kamâ bârakta 'alâ Ibrâhîma wa 'alâ âli Ibrâhîm, innaka Ḥamîdun Majîd.",
        fr: "Ô Allah, prie sur Muhammad et sur la famille de Muhammad comme Tu as prié sur Abraham et sur la famille d'Abraham, Tu es certes Digne de louange et de gloire. Ô Allah, bénis Muhammad et la famille de Muhammad comme Tu as béni Abraham et la famille d'Abraham, Tu es certes Digne de louange et de gloire.",
        source: "Al-Bukhari",
      },
      {
        titre: "Avant le salâm",
        arabe:
          "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، وَمِنْ عَذَابِ جَهَنَّمَ، وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ، وَمِنْ شَرِّ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ",
        translit:
          "Allâhumma innî a'ûdhu bika min 'adhâbil-qabr, wa min 'adhâbi jahannam, wa min fitnatil-maḥyâ wal-mamât, wa min sharri fitnatil-masîḥid-dajjâl.",
        fr: "Ô Allah, je cherche protection auprès de Toi contre le châtiment de la tombe, le châtiment de l'Enfer, l'épreuve de la vie et de la mort, et le mal de l'épreuve du faux messie.",
        source: "Al-Bukhari & Muslim",
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
        titre: "Nul ne retient ce que Tu donnes",
        arabe:
          "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، اللَّهُمَّ لَا مَانِعَ لِمَا أَعْطَيْتَ، وَلَا مُعْطِيَ لِمَا مَنَعْتَ، وَلَا يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ",
        translit:
          "Lâ ilâha illâ-llâhu waḥdahu lâ sharîka lah, lahul-mulku wa lahul-ḥamdu wa huwa 'alâ kulli shay'in qadîr. Allâhumma lâ mâni'a limâ a'ṭayt, wa lâ mu'ṭiya limâ mana't, wa lâ yanfa'u dhal-jaddi minkal-jadd.",
        fr: "Nulle divinité hormis Allah, Seul, sans associé ; à Lui la royauté et la louange, et Il est capable de toute chose. Ô Allah, nul ne peut retenir ce que Tu donnes ni donner ce que Tu retiens, et la fortune du fortuné ne lui sert à rien face à Toi.",
        source: "Al-Bukhari & Muslim",
      },
      {
        titre: "Le tasbîh (33-33-33 + 1)",
        arabe:
          "سُبْحَانَ اللَّهِ (٣٣) الْحَمْدُ لِلَّهِ (٣٣) اللَّهُ أَكْبَرُ (٣٣) لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
        translit:
          "SubḥânAllâh (33), al-ḥamdu lillâh (33), Allâhu akbar (33), puis : lâ ilâha illâ-llâhu waḥdahu lâ sharîka lah, lahul-mulku wa lahul-ḥamdu wa huwa 'alâ kulli shay'in qadîr.",
        fr: "Gloire à Allah (33 fois), louange à Allah (33 fois), Allah est le plus Grand (33 fois), puis la parole d'unicité pour compléter la centaine.",
        source: "Muslim",
        note: "Ses fautes sont pardonnées, fussent-elles comme l'écume de la mer.",
      },
      {
        titre: "Âyat al-Kursî après chaque prière",
        arabe:
          "اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ …",
        translit: "Allâhu lâ ilâha illâ huwal-Ḥayyul-Qayyûm… (Coran 2:255)",
        fr: "Le verset du Trône.",
        source: "An-Nasa'i",
        note: "Rien ne sépare de l'entrée au Paradis celui qui le récite après chaque prière obligatoire, si ce n'est la mort.",
        lien: { href: "/sourate/2#v-255", libelle: "Lire le verset" },
      },
      {
        titre: "Aide-moi à T'adorer",
        arabe:
          "اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ",
        translit:
          "Allâhumma a'innî 'alâ dhikrika wa shukrika wa ḥusni 'ibâdatik.",
        fr: "Ô Allah, aide-moi à me souvenir de Toi, à Te remercier et à T'adorer de la meilleure façon.",
        source: "Abu Dawud & An-Nasa'i",
        note: "Le Prophète ﷺ recommanda à Mu'âdh de ne jamais la délaisser après chaque prière.",
      },
      {
        titre: "Al-Ikhlâṣ, al-Falaq et an-Nâs",
        arabe: "قُلْ هُوَ اللَّهُ أَحَدٌ • قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ • قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
        translit: "Une fois après chaque prière obligatoire.",
        fr: "Les trois sourates protectrices.",
        source: "Abu Dawud & An-Nasa'i",
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
        note: "On lui dit : « Tu es guidé, suffi et protégé », et le démon s'écarte de lui.",
      },
      {
        titre: "En sortant (autre formule)",
        arabe:
          "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ أَنْ أَضِلَّ أَوْ أُضَلَّ، أَوْ أَزِلَّ أَوْ أُزَلَّ، أَوْ أَظْلِمَ أَوْ أُظْلَمَ، أَوْ أَجْهَلَ أَوْ يُجْهَلَ عَلَيَّ",
        translit:
          "Allâhumma innî a'ûdhu bika an aḍilla aw uḍall, aw azilla aw uzall, aw aẓlima aw uẓlam, aw ajhala aw yujhala 'alayy.",
        fr: "Ô Allah, je cherche protection auprès de Toi contre le fait de m'égarer ou d'être égaré, de trébucher ou d'être fait trébucher, d'être injuste ou de subir l'injustice, d'agir en ignorant ou d'être traité avec ignorance.",
        source: "Abu Dawud & At-Tirmidhi",
      },
      {
        titre: "En entrant à la maison",
        arabe: "بِسْمِ اللَّهِ",
        translit: "Bismillâh — puis saluer : As-salâmu 'alaykum.",
        fr: "Au nom d'Allah. Quand l'homme mentionne Allah en entrant chez lui et en mangeant, Satan dit : « Pas de gîte ni de dîner pour vous ce soir. »",
        source: "Muslim",
      },
      {
        titre: "En entrant à la mosquée",
        arabe:
          "أَعُوذُ بِاللَّهِ الْعَظِيمِ، وَبِوَجْهِهِ الْكَرِيمِ، وَسُلْطَانِهِ الْقَدِيمِ، مِنَ الشَّيْطَانِ الرَّجِيمِ — اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
        translit:
          "A'ûdhu billâhil-'Aẓîm, wa biwajhihil-karîm, wa sulṭânihil-qadîm, minash-shayṭânir-rajîm. — Allâhumma-ftaḥ lî abwâba raḥmatik.",
        fr: "Je cherche protection auprès d'Allah l'Immense, par Son noble Visage et Son pouvoir éternel, contre Satan le lapidé. — Ô Allah, ouvre-moi les portes de Ta miséricorde.",
        source: "Abu Dawud — Muslim",
        note: "Entre du pied droit.",
      },
      {
        titre: "En sortant de la mosquée",
        arabe: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ",
        translit: "Allâhumma innî as'aluka min faḍlik.",
        fr: "Ô Allah, je Te demande de Ta grâce.",
        source: "Muslim",
        note: "Sors du pied gauche.",
      },
      {
        titre: "En entrant aux toilettes",
        arabe: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ",
        translit: "(Bismillâh) Allâhumma innî a'ûdhu bika minal-khubuthi wal-khabâ'ith.",
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
        fr: "Au nom d'Allah. (En cas d'oubli, dire : « Bismillâhi awwalahu wa âkhirah » — Au nom d'Allah au début et à la fin.)",
        source: "Abu Dawud & At-Tirmidhi",
        note: "Mange de la main droite et de ce qui est devant toi (Al-Bukhari & Muslim).",
      },
      {
        titre: "Après le repas",
        arabe:
          "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا، وَرَزَقَنِيهِ، مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
        translit:
          "Al-ḥamdu lillâhil-ladhî aṭ'amanî hâdhâ, wa razaqanîh, min ghayri ḥawlin minnî wa lâ quwwah.",
        fr: "Louange à Allah qui m'a nourri de ceci et me l'a accordé sans force ni puissance de ma part.",
        source: "Abu Dawud & At-Tirmidhi",
        note: "Ses péchés antérieurs lui sont pardonnés.",
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
        titre: "Pour ton hôte",
        arabe:
          "اللَّهُمَّ بَارِكْ لَهُمْ فِيمَا رَزَقْتَهُمْ، وَاغْفِرْ لَهُمْ وَارْحَمْهُمْ",
        translit:
          "Allâhumma bârik lahum fîmâ razaqtahum, waghfir lahum warḥamhum.",
        fr: "Ô Allah, bénis-les dans ce que Tu leur as accordé, pardonne-leur et fais-leur miséricorde.",
        source: "Muslim",
      },
      {
        titre: "Pour celui qui t'a offert à manger",
        arabe: "اللَّهُمَّ أَطْعِمْ مَنْ أَطْعَمَنِي وَاسْقِ مَنْ سَقَانِي",
        translit: "Allâhumma aṭ'im man aṭ'amanî wasqi man saqânî.",
        fr: "Ô Allah, nourris celui qui m'a nourri et abreuve celui qui m'a abreuvé.",
        source: "Muslim",
      },
      {
        titre: "Chez ceux qui t'offrent le repas de rupture",
        arabe:
          "أَفْطَرَ عِنْدَكُمُ الصَّائِمُونَ، وَأَكَلَ طَعَامَكُمُ الْأَبْرَارُ، وَصَلَّتْ عَلَيْكُمُ الْمَلَائِكَةُ",
        translit:
          "Afṭara 'indakumuṣ-ṣâ'imûn, wa akala ṭa'âmakumul-abrâr, wa ṣallat 'alaykumul-malâ'ikah.",
        fr: "Que des jeûneurs rompent leur jeûne chez vous, que des gens pieux mangent votre nourriture, et que les anges prient sur vous.",
        source: "Abu Dawud",
      },
    ],
  },
  {
    id: "quotidien",
    nom: "Vie quotidienne",
    icone: "etoile",
    invocations: [
      {
        titre: "En éternuant",
        arabe:
          "الْحَمْدُ لِلَّهِ — يَرْحَمُكَ اللَّهُ — يَهْدِيكُمُ اللَّهُ وَيُصْلِحُ بَالَكُمْ",
        translit:
          "Celui qui éternue : Al-ḥamdu lillâh. Celui qui l'entend : Yarḥamukallâh. Celui qui a éternué répond : Yahdîkumullâhu wa yuṣliḥu bâlakum.",
        fr: "Louange à Allah. — Qu'Allah te fasse miséricorde. — Qu'Allah vous guide et améliore votre état.",
        source: "Al-Bukhari",
      },
      {
        titre: "En s'habillant",
        arabe:
          "الْحَمْدُ لِلَّهِ الَّذِي كَسَانِي هَذَا الثَّوْبَ وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
        translit:
          "Al-ḥamdu lillâhil-ladhî kasânî hâdhath-thawba wa razaqanîhi min ghayri ḥawlin minnî wa lâ quwwah.",
        fr: "Louange à Allah qui m'a habillé de ce vêtement et me l'a accordé sans force ni puissance de ma part.",
        source: "Abu Dawud & At-Tirmidhi",
      },
      {
        titre: "En portant un nouveau vêtement",
        arabe:
          "اللَّهُمَّ لَكَ الْحَمْدُ أَنْتَ كَسَوْتَنِيهِ، أَسْأَلُكَ مِنْ خَيْرِهِ وَخَيْرِ مَا صُنِعَ لَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّهِ وَشَرِّ مَا صُنِعَ لَهُ",
        translit:
          "Allâhumma lakal-ḥamdu anta kasawtanîh, as'aluka min khayrihi wa khayri mâ ṣuni'a lah, wa a'ûdhu bika min sharrihi wa sharri mâ ṣuni'a lah.",
        fr: "Ô Allah, à Toi la louange, c'est Toi qui m'en as vêtu. Je Te demande son bien et le bien pour lequel il a été fait, et je cherche protection auprès de Toi contre son mal et le mal pour lequel il a été fait.",
        source: "Abu Dawud & At-Tirmidhi",
      },
      {
        titre: "Pour clore une assemblée",
        arabe:
          "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا أَنْتَ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ",
        translit:
          "Subḥânaka-llâhumma wa biḥamdik, ash-hadu an lâ ilâha illâ ant, astaghfiruka wa atûbu ilayk.",
        fr: "Gloire et louange à Toi, ô Allah. J'atteste qu'il n'y a de divinité que Toi, je Te demande pardon et je me repens à Toi.",
        source: "At-Tirmidhi & Abu Dawud",
        note: "Ce qui s'est dit de futile dans cette assemblée lui est pardonné.",
      },
      {
        titre: "Pour remercier quelqu'un",
        arabe: "جَزَاكَ اللَّهُ خَيْرًا",
        translit: "Jazâkallâhu khayran.",
        fr: "Qu'Allah te récompense par le bien.",
        source: "At-Tirmidhi",
        note: "Celui qui le dit a pleinement fait l'éloge de son bienfaiteur.",
      },
      {
        titre: "Devant une bonne nouvelle",
        arabe: "الْحَمْدُ لِلَّهِ الَّذِي بِنِعْمَتِهِ تَتِمُّ الصَّالِحَاتُ",
        translit: "Al-ḥamdu lillâhil-ladhî bini'matihi tatimmuṣ-ṣâliḥât.",
        fr: "Louange à Allah, par la grâce de qui s'accomplissent les bonnes choses.",
        source: "Ibn Mâjah & Al-Hâkim",
        note: "Devant une chose désagréable : « Al-ḥamdu lillâhi 'alâ kulli ḥâl » (Louange à Allah en toute circonstance).",
      },
      {
        titre: "Quand la colère monte",
        arabe: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
        translit: "A'ûdhu billâhi minash-shayṭânir-rajîm.",
        fr: "Je cherche protection auprès d'Allah contre Satan le lapidé.",
        source: "Al-Bukhari & Muslim",
        note: "Si tu es debout, assieds-toi ; si la colère persiste, allonge-toi (Abu Dawud).",
      },
      {
        titre: "En voyant quelqu'un d'éprouvé",
        arabe:
          "الْحَمْدُ لِلَّهِ الَّذِي عَافَانِي مِمَّا ابْتَلَاكَ بِهِ، وَفَضَّلَنِي عَلَى كَثِيرٍ مِمَّنْ خَلَقَ تَفْضِيلًا",
        translit:
          "Al-ḥamdu lillâhil-ladhî 'âfânî mimmab-talâka bih, wa faḍḍalanî 'alâ kathîrin mimman khalaqa tafḍîlâ.",
        fr: "Louange à Allah qui m'a préservé de ce par quoi Il t'a éprouvé et m'a favorisé sur beaucoup de Ses créatures.",
        source: "At-Tirmidhi",
        note: "À dire à voix basse, sans que la personne l'entende.",
      },
      {
        titre: "Féliciter les mariés",
        arabe:
          "بَارَكَ اللَّهُ لَكَ، وَبَارَكَ عَلَيْكَ، وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ",
        translit:
          "Bârakallâhu lak, wa bâraka 'alayk, wa jama'a baynakumâ fî khayr.",
        fr: "Qu'Allah te bénisse, qu'Il répande Sa bénédiction sur toi et qu'Il vous réunisse dans le bien.",
        source: "Abu Dawud & At-Tirmidhi",
      },
      {
        titre: "Quand une chose te plaît",
        arabe: "اللَّهُمَّ بَارِكْ عَلَيْهِ",
        translit: "Allâhumma bârik 'alayh (ou : Bârakallâhu fîh).",
        fr: "Ô Allah, bénis-le.",
        source: "Mâlik & Ibn Mâjah",
        note: "Le Prophète ﷺ reprocha à un Compagnon : « Pourquoi n'as-tu pas invoqué la bénédiction ? » — cela protège du mauvais œil.",
      },
    ],
  },
  {
    id: "nature",
    nom: "Pluie & nature",
    icone: "nuage",
    invocations: [
      {
        titre: "Quand il pleut",
        arabe: "اللَّهُمَّ صَيِّبًا نَافِعًا",
        translit: "Allâhumma ṣayyiban nâfi'â.",
        fr: "Ô Allah, (fais-en) une pluie bénéfique.",
        source: "Al-Bukhari",
      },
      {
        titre: "Après la pluie",
        arabe: "مُطِرْنَا بِفَضْلِ اللَّهِ وَرَحْمَتِهِ",
        translit: "Muṭirnâ bifaḍlillâhi wa raḥmatih.",
        fr: "Nous avons reçu la pluie par la grâce d'Allah et Sa miséricorde.",
        source: "Al-Bukhari & Muslim",
      },
      {
        titre: "Pour demander la pluie",
        arabe: "اللَّهُمَّ أَغِثْنَا، اللَّهُمَّ أَغِثْنَا، اللَّهُمَّ أَغِثْنَا",
        translit: "Allâhumma aghithnâ (3 fois).",
        fr: "Ô Allah, secours-nous (par la pluie).",
        source: "Al-Bukhari & Muslim",
      },
      {
        titre: "Quand le vent souffle",
        arabe:
          "اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَهَا، وَخَيْرَ مَا فِيهَا، وَخَيْرَ مَا أُرْسِلَتْ بِهِ، وَأَعُوذُ بِكَ مِنْ شَرِّهَا، وَشَرِّ مَا فِيهَا، وَشَرِّ مَا أُرْسِلَتْ بِهِ",
        translit:
          "Allâhumma innî as'aluka khayrahâ, wa khayra mâ fîhâ, wa khayra mâ ursilat bih, wa a'ûdhu bika min sharrihâ, wa sharri mâ fîhâ, wa sharri mâ ursilat bih.",
        fr: "Ô Allah, je Te demande son bien, le bien qu'il contient et le bien avec lequel il a été envoyé, et je cherche protection auprès de Toi contre son mal, le mal qu'il contient et le mal avec lequel il a été envoyé.",
        source: "Muslim",
      },
      {
        titre: "En entendant le tonnerre",
        arabe:
          "سُبْحَانَ الَّذِي يُسَبِّحُ الرَّعْدُ بِحَمْدِهِ وَالْمَلَائِكَةُ مِنْ خِيفَتِهِ",
        translit:
          "Subḥânal-ladhî yusabbiḥur-ra'du biḥamdihi wal-malâ'ikatu min khîfatih.",
        fr: "Gloire à Celui que le tonnerre glorifie par Sa louange, ainsi que les anges par crainte de Lui.",
        source: "Mâlik (parole de 'Abdullâh ibn az-Zubayr)",
      },
      {
        titre: "En voyant le croissant de lune",
        arabe:
          "اللَّهُمَّ أَهِلَّهُ عَلَيْنَا بِالْيُمْنِ وَالْإِيمَانِ، وَالسَّلَامَةِ وَالْإِسْلَامِ، رَبِّي وَرَبُّكَ اللَّهُ",
        translit:
          "Allâhumma ahillahu 'alaynâ bil-yumni wal-îmân, was-salâmati wal-islâm, Rabbî wa Rabbukallâh.",
        fr: "Ô Allah, fais-le apparaître sur nous avec la prospérité et la foi, la sécurité et l'islam. Mon Seigneur et ton Seigneur est Allah.",
        source: "At-Tirmidhi",
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
          "اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى، وَمِنَ الْعَمَلِ مَا تَرْضَى، اللَّهُمَّ هَوِّنْ عَلَيْنَا سَفَرَنَا هَذَا وَاطْوِ عَنَّا بُعْدَهُ، اللَّهُمَّ أَنْتَ الصَّاحِبُ فِي السَّفَرِ، وَالْخَلِيفَةُ فِي الْأَهْلِ",
        translit:
          "Allâhumma innâ nas'aluka fî safarinâ hâdhal-birra wat-taqwâ, wa minal-'amali mâ tarḍâ. Allâhumma hawwin 'alaynâ safaranâ hâdhâ waṭwi 'annâ bu'dah. Allâhumma antaṣ-ṣâḥibu fis-safar, wal-khalîfatu fil-ahl.",
        fr: "Ô Allah, nous Te demandons dans ce voyage la bonté et la piété, et des œuvres que Tu agrées. Ô Allah, facilite-nous ce voyage et raccourcis-en la distance. Ô Allah, Tu es le Compagnon du voyage et Celui qui veille sur la famille.",
        source: "Muslim",
        note: "L'invocation du voyageur est exaucée (Abu Dawud & At-Tirmidhi).",
      },
      {
        titre: "En faisant halte quelque part",
        arabe: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
        translit: "A'ûdhu bikalimâtillâhit-tâmmâti min sharri mâ khalaq.",
        fr: "Je cherche protection par les paroles parfaites d'Allah contre le mal de ce qu'Il a créé.",
        source: "Muslim",
        note: "Rien ne lui nuira jusqu'à ce qu'il quitte ce lieu.",
      },
      {
        titre: "Pour dire au revoir au voyageur",
        arabe: "أَسْتَوْدِعُ اللَّهَ دِينَكَ، وَأَمَانَتَكَ، وَخَوَاتِيمَ عَمَلِكَ",
        translit: "Astawdi'ullâha dînak, wa amânatak, wa khawâtîma 'amalik.",
        fr: "Je confie à Allah ta religion, ta loyauté et la fin de tes œuvres.",
        source: "Abu Dawud & At-Tirmidhi",
        note: "Le voyageur répond : « Astawdi'ukumullâhal-ladhî lâ taḍî'u wadâ'i'uh » — Je vous confie à Allah, auprès de qui rien de ce qu'on Lui confie ne se perd (Ahmad & Ibn Mâjah).",
      },
      {
        titre: "En montant et en descendant",
        arabe: "اللَّهُ أَكْبَرُ — سُبْحَانَ اللَّهِ",
        translit: "Allâhu akbar en montant ; SubḥânAllâh en descendant.",
        fr: "Allah est le plus Grand. — Gloire à Allah.",
        source: "Al-Bukhari",
      },
      {
        titre: "Au retour de voyage",
        arabe: "آيِبُونَ، تَائِبُونَ، عَابِدُونَ، لِرَبِّنَا حَامِدُونَ",
        translit: "Âyibûn, tâ'ibûn, 'âbidûn, lirabbinâ ḥâmidûn.",
        fr: "Nous revenons, repentants, adorant et louant notre Seigneur.",
        source: "Muslim",
      },
    ],
  },
  {
    id: "malade-deces",
    nom: "Maladie & deuil",
    icone: "coeur",
    invocations: [
      {
        titre: "En rendant visite à un malade",
        arabe: "لَا بَأْسَ، طَهُورٌ إِنْ شَاءَ اللَّهُ",
        translit: "Lâ ba's, ṭahûrun in shâ'a-llâh.",
        fr: "Ce n'est rien : c'est une purification, si Allah le veut.",
        source: "Al-Bukhari",
      },
      {
        titre: "Pour la guérison d'un malade (7 fois)",
        arabe:
          "أَسْأَلُ اللَّهَ الْعَظِيمَ، رَبَّ الْعَرْشِ الْعَظِيمِ، أَنْ يَشْفِيَكَ",
        translit: "As'alullâhal-'Aẓîm, Rabbal-'arshil-'aẓîm, an yashfiyak.",
        fr: "Je demande à Allah l'Immense, Seigneur du Trône immense, de te guérir.",
        source: "Abu Dawud & At-Tirmidhi",
        note: "Dite sept fois auprès d'un malade dont le terme n'est pas arrivé, Allah le guérit.",
      },
      {
        titre: "La roqya du Prophète ﷺ",
        arabe:
          "اللَّهُمَّ رَبَّ النَّاسِ، أَذْهِبِ الْبَأْسَ، اشْفِهِ وَأَنْتَ الشَّافِي، لَا شِفَاءَ إِلَّا شِفَاؤُكَ، شِفَاءً لَا يُغَادِرُ سَقَمًا",
        translit:
          "Allâhumma Rabban-nâs, adh-hibil-ba's, ishfihi wa antash-shâfî, lâ shifâ'a illâ shifâ'uk, shifâ'an lâ yughâdiru saqamâ.",
        fr: "Ô Allah, Seigneur des hommes, fais disparaître le mal, guéris-le, Tu es Celui qui guérit ; il n'y a de guérison que la Tienne, une guérison qui ne laisse aucune maladie.",
        source: "Al-Bukhari & Muslim",
      },
      {
        titre: "Contre une douleur",
        arabe:
          "بِسْمِ اللَّهِ (٣) — أَعُوذُ بِاللَّهِ وَقُدْرَتِهِ مِنْ شَرِّ مَا أَجِدُ وَأُحَاذِرُ (٧)",
        translit:
          "Bismillâh (3 fois), puis : A'ûdhu billâhi wa qudratihi min sharri mâ ajidu wa uḥâdhir (7 fois).",
        fr: "Pose la main sur l'endroit douloureux : Au nom d'Allah (3 fois). Je cherche protection auprès d'Allah et de Sa puissance contre le mal que je ressens et que je redoute (7 fois).",
        source: "Muslim",
      },
      {
        titre: "Frappé par un malheur",
        arabe:
          "إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ، اللَّهُمَّ أْجُرْنِي فِي مُصِيبَتِي، وَأَخْلِفْ لِي خَيْرًا مِنْهَا",
        translit:
          "Innâ lillâhi wa innâ ilayhi râji'ûn. Allâhumma'jurnî fî muṣîbatî, wa akhlif lî khayran minhâ.",
        fr: "Nous appartenons à Allah et c'est vers Lui que nous retournerons. Ô Allah, récompense-moi pour mon épreuve et remplace-la-moi par meilleur.",
        source: "Muslim",
        note: "Umm Salama la dit à la mort de son mari : Allah lui donna meilleur que lui, le Prophète ﷺ.",
      },
      {
        titre: "Présenter ses condoléances",
        arabe:
          "إِنَّ لِلَّهِ مَا أَخَذَ، وَلَهُ مَا أَعْطَى، وَكُلُّ شَيْءٍ عِنْدَهُ بِأَجَلٍ مُسَمًّى، فَلْتَصْبِرْ وَلْتَحْتَسِبْ",
        translit:
          "Inna lillâhi mâ akhadh, wa lahu mâ a'ṭâ, wa kullu shay'in 'indahu bi-ajalin musammâ, faltaṣbir waltaḥtasib.",
        fr: "À Allah appartient ce qu'Il a repris et ce qu'Il a donné, et toute chose a auprès de Lui un terme fixé. Sois patient et espère la récompense.",
        source: "Al-Bukhari & Muslim",
      },
      {
        titre: "Pour le défunt (prière funéraire)",
        arabe:
          "اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ، وَعَافِهِ وَاعْفُ عَنْهُ، وَأَكْرِمْ نُزُلَهُ، وَوَسِّعْ مُدْخَلَهُ، وَاغْسِلْهُ بِالْمَاءِ وَالثَّلْجِ وَالْبَرَدِ، وَنَقِّهِ مِنَ الْخَطَايَا كَمَا نَقَّيْتَ الثَّوْبَ الْأَبْيَضَ مِنَ الدَّنَسِ",
        translit:
          "Allâhumma-ghfir lahu warḥamh, wa 'âfihi wa'fu 'anh, wa akrim nuzulah, wa wassi' mudkhalah, waghsilhu bil-mâ'i wath-thalji wal-barad, wa naqqihi minal-khaṭâyâ kamâ naqqaytath-thawbal-abyaḍa minad-danas.",
        fr: "Ô Allah, pardonne-lui, fais-lui miséricorde, préserve-le et efface ses fautes, honore sa demeure, élargis sa tombe, lave-le avec l'eau, la neige et la grêle, et purifie-le de ses péchés comme on purifie le vêtement blanc de la saleté.",
        source: "Muslim (début de l'invocation)",
        note: "Pour une défunte : « lahâ… hâ » au lieu de « lahu… hu ».",
      },
      {
        titre: "En visitant les tombes",
        arabe:
          "السَّلَامُ عَلَيْكُمْ أَهْلَ الدِّيَارِ مِنَ الْمُؤْمِنِينَ وَالْمُسْلِمِينَ، وَإِنَّا إِنْ شَاءَ اللَّهُ بِكُمْ لَلَاحِقُونَ، أَسْأَلُ اللَّهَ لَنَا وَلَكُمُ الْعَافِيَةَ",
        translit:
          "As-salâmu 'alaykum ahlad-diyâri minal-mu'minîna wal-muslimîn, wa innâ in shâ'a-llâhu bikum lalâḥiqûn, as'alullâha lanâ wa lakumul-'âfiyah.",
        fr: "Paix sur vous, habitants de ces demeures, croyants et musulmans. Nous allons, si Allah le veut, vous rejoindre. Je demande à Allah le salut pour nous et pour vous.",
        source: "Muslim",
      },
    ],
  },
  {
    id: "protection",
    nom: "Protection",
    icone: "bouclier",
    invocations: [
      {
        titre: "Pour protéger ses enfants",
        arabe:
          "أُعِيذُكُمَا بِكَلِمَاتِ اللَّهِ التَّامَّةِ، مِنْ كُلِّ شَيْطَانٍ وَهَامَّةٍ، وَمِنْ كُلِّ عَيْنٍ لَامَّةٍ",
        translit:
          "U'îdhukumâ bikalimâtillâhit-tâmmah, min kulli shayṭânin wa hâmmah, wa min kulli 'aynin lâmmah.",
        fr: "Je vous place sous la protection des paroles parfaites d'Allah contre tout démon, toute bête nuisible et tout mauvais œil.",
        source: "Al-Bukhari",
        note: "Le Prophète ﷺ la disait pour al-Ḥasan et al-Ḥusayn. Pour un enfant : « U'îdhuka » (garçon) / « U'îdhuki » (fille) ; pour plusieurs : « U'îdhukum ».",
      },
      {
        titre: "Quand on craint des gens",
        arabe: "اللَّهُمَّ اكْفِنِيهِمْ بِمَا شِئْتَ",
        translit: "Allâhumma-kfinîhim bimâ shi't.",
        fr: "Ô Allah, protège-moi d'eux comme Tu le veux.",
        source: "Muslim",
      },
      {
        titre: "Face à un ennemi",
        arabe: "اللَّهُمَّ إِنَّا نَجْعَلُكَ فِي نُحُورِهِمْ، وَنَعُوذُ بِكَ مِنْ شُرُورِهِمْ",
        translit: "Allâhumma innâ naj'aluka fî nuḥûrihim, wa na'ûdhu bika min shurûrihim.",
        fr: "Ô Allah, nous Te plaçons face à eux et nous cherchons protection auprès de Toi contre leur mal.",
        source: "Abu Dawud",
      },
      {
        titre: "Quand le doute s'installe dans la foi",
        arabe: "آمَنْتُ بِاللَّهِ وَرُسُلِهِ",
        translit: "Âmantu billâhi wa rusulih.",
        fr: "Je crois en Allah et en Ses messagers.",
        source: "Muslim",
        note: "Cherche protection auprès d'Allah et coupe court à ces pensées (Al-Bukhari & Muslim).",
      },
      {
        titre: "Distrait par Satan dans la prière",
        arabe: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
        translit: "A'ûdhu billâhi minash-shayṭânir-rajîm.",
        fr: "Je cherche protection auprès d'Allah contre Satan le lapidé.",
        source: "Muslim",
        note: "Puis souffle légèrement trois fois à ta gauche : c'est le conseil du Prophète ﷺ à 'Uthmân ibn Abî al-'Âṣ.",
      },
      {
        titre: "Contre l'association (shirk)",
        arabe:
          "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ أَنْ أُشْرِكَ بِكَ وَأَنَا أَعْلَمُ، وَأَسْتَغْفِرُكَ لِمَا لَا أَعْلَمُ",
        translit:
          "Allâhumma innî a'ûdhu bika an ushrika bika wa anâ a'lam, wa astaghfiruka limâ lâ a'lam.",
        fr: "Ô Allah, je cherche protection auprès de Toi contre le fait de T'associer quoi que ce soit en le sachant, et je Te demande pardon pour ce que je ne sais pas.",
        source: "Al-Bukhari (Al-Adab al-Mufrad)",
      },
    ],
  },
  {
    id: "difficulte",
    nom: "Difficulté & pardon",
    icone: "montagne",
    invocations: [
      {
        titre: "Dans l'angoisse et l'épreuve",
        arabe:
          "لَا إِلَهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ الْعَرْشِ الْعَظِيمِ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ السَّمَاوَاتِ وَرَبُّ الْأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيمِ",
        translit:
          "Lâ ilâha illâ-llâhul-'Aẓîmul-Ḥalîm, lâ ilâha illâ-llâhu Rabbul-'arshil-'aẓîm, lâ ilâha illâ-llâhu Rabbus-samâwâti wa Rabbul-arḍi wa Rabbul-'arshil-karîm.",
        fr: "Il n'y a de divinité digne d'adoration qu'Allah, l'Immense, le Longanime. Il n'y a de divinité qu'Allah, Seigneur du Trône immense. Il n'y a de divinité qu'Allah, Seigneur des cieux, Seigneur de la terre et Seigneur du noble Trône.",
        source: "Al-Bukhari & Muslim",
      },
      {
        titre: "Contre les soucis et la tristesse",
        arabe:
          "اللَّهُمَّ إِنِّي عَبْدُكَ، ابْنُ عَبْدِكَ، ابْنُ أَمَتِكَ، نَاصِيَتِي بِيَدِكَ، مَاضٍ فِيَّ حُكْمُكَ، عَدْلٌ فِيَّ قَضَاؤُكَ، أَسْأَلُكَ بِكُلِّ اسْمٍ هُوَ لَكَ سَمَّيْتَ بِهِ نَفْسَكَ، أَوْ أَنْزَلْتَهُ فِي كِتَابِكَ، أَوْ عَلَّمْتَهُ أَحَدًا مِنْ خَلْقِكَ، أَوِ اسْتَأْثَرْتَ بِهِ فِي عِلْمِ الْغَيْبِ عِنْدَكَ، أَنْ تَجْعَلَ الْقُرْآنَ رَبِيعَ قَلْبِي، وَنُورَ صَدْرِي، وَجَلَاءَ حُزْنِي، وَذَهَابَ هَمِّي",
        translit:
          "Allâhumma innî 'abduk, ibnu 'abdik, ibnu amatik, nâṣiyatî biyadik, mâḍin fiyya ḥukmuk, 'adlun fiyya qaḍâ'uk. As'aluka bikulli-smin huwa lak, sammayta bihi nafsak, aw anzaltahu fî kitâbik, aw 'allamtahu aḥadan min khalqik, awista'tharta bihi fî 'ilmil-ghaybi 'indak, an taj'alal-Qur'âna rabî'a qalbî, wa nûra ṣadrî, wa jalâ'a ḥuznî, wa dhahâba hammî.",
        fr: "Ô Allah, je suis Ton serviteur, fils de Ton serviteur, fils de Ta servante. Mon toupet est dans Ta main, Ton jugement s'accomplit en moi, Ton décret à mon égard est juste. Je Te demande, par chacun des noms qui T'appartiennent, par lesquels Tu T'es nommé, que Tu as révélés dans Ton Livre, enseignés à l'une de Tes créatures ou gardés dans la science de l'invisible, de faire du Coran le printemps de mon cœur, la lumière de ma poitrine, ce qui dissipe ma tristesse et chasse mes soucis.",
        source: "Ahmad (authentique)",
        note: "Allah remplace alors son souci et sa tristesse par la joie.",
      },
      {
        titre: "Contre l'impuissance et la paresse",
        arabe:
          "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ، وَغَلَبَةِ الرِّجَالِ",
        translit:
          "Allâhumma innî a'ûdhu bika minal-hammi wal-ḥazan, wal-'ajzi wal-kasal, wal-bukhli wal-jubn, wa ḍala'id-dayn, wa ghalabatir-rijâl.",
        fr: "Ô Allah, je cherche protection auprès de Toi contre le souci et la tristesse, l'incapacité et la paresse, l'avarice et la lâcheté, le poids des dettes et la domination des hommes.",
        source: "Al-Bukhari",
      },
      {
        titre: "L'invocation de Yûnus",
        arabe: "لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",
        translit: "Lâ ilâha illâ anta subḥânaka innî kuntu minaẓ-ẓâlimîn.",
        fr: "Il n'y a de divinité que Toi. Gloire à Toi ! J'ai été vraiment du nombre des injustes. (Coran 21:87)",
        source: "At-Tirmidhi",
        note: "Aucun musulman ne l'invoque pour quelque chose sans qu'Allah ne l'exauce.",
      },
      {
        titre: "Ne me laisse pas à moi-même",
        arabe:
          "اللَّهُمَّ رَحْمَتَكَ أَرْجُو، فَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ، وَأَصْلِحْ لِي شَأْنِي كُلَّهُ، لَا إِلَهَ إِلَّا أَنْتَ",
        translit:
          "Allâhumma raḥmataka arjû, falâ takilnî ilâ nafsî ṭarfata 'ayn, wa aṣliḥ lî sha'nî kullah, lâ ilâha illâ ant.",
        fr: "Ô Allah, c'est Ta miséricorde que j'espère : ne me laisse pas à moi-même, ne serait-ce qu'un clin d'œil, et améliore toutes mes affaires. Il n'y a de divinité que Toi.",
        source: "Abu Dawud",
      },
      {
        titre: "Allah, mon Seigneur",
        arabe: "اللَّهُ اللَّهُ رَبِّي لَا أُشْرِكُ بِهِ شَيْئًا",
        translit: "Allâhu Allâhu Rabbî lâ ushriku bihi shay'â.",
        fr: "Allah, Allah est mon Seigneur, je ne Lui associe rien.",
        source: "Abu Dawud & Ibn Mâjah",
      },
      {
        titre: "Quand une chose est difficile",
        arabe:
          "اللَّهُمَّ لَا سَهْلَ إِلَّا مَا جَعَلْتَهُ سَهْلًا، وَأَنْتَ تَجْعَلُ الْحَزْنَ إِذَا شِئْتَ سَهْلًا",
        translit:
          "Allâhumma lâ sahla illâ mâ ja'altahu sahlâ, wa anta taj'alul-ḥazna idhâ shi'ta sahlâ.",
        fr: "Ô Allah, rien n'est facile sauf ce que Tu rends facile, et Tu rends facile, si Tu le veux, ce qui est difficile.",
        source: "Ibn Hibbân",
      },
      {
        titre: "Pour s'acquitter d'une dette",
        arabe:
          "اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ، وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ",
        translit:
          "Allâhumma-kfinî biḥalâlika 'an ḥarâmik, wa aghninî bifaḍlika 'amman siwâk.",
        fr: "Ô Allah, suffis-moi par ce que Tu as permis au lieu de ce que Tu as interdit, et enrichis-moi par Ta grâce pour que je ne dépende que de Toi.",
        source: "At-Tirmidhi",
      },
      {
        titre: "Quand une chose t'accable",
        arabe: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
        translit: "Ḥasbunâ-llâhu wa ni'mal-wakîl.",
        fr: "Allah nous suffit, et quel excellent Garant !",
        source: "Al-Bukhari",
      },
      {
        titre: "Demande de pardon (100 fois)",
        arabe:
          "رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ",
        translit: "Rabbi-ghfir lî wa tub 'alayya innaka anta-t-Tawwâbur-Raḥîm.",
        fr: "Seigneur, pardonne-moi et accepte mon repentir. Tu es certes le Très Accueillant au repentir, le Très Miséricordieux.",
        source: "Abu Dawud & At-Tirmidhi",
        note: "On comptait au Prophète ﷺ cent fois cette invocation dans une même assemblée.",
        lien: { href: "/invocations/tawba", libelle: "Guide du repentir" },
      },
    ],
  },
];
