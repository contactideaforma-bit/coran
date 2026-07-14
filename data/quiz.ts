export interface QuestionQuiz {
  question: string;
  options: string[]; // la première est la bonne réponse (mélangées à l'affichage)
  explication: string;
}

/** Questions de culture religieuse basées sur le contenu de l'appli. */
export const QUESTIONS_QUIZ: QuestionQuiz[] = [
  {
    question: "Combien y a-t-il de sourates dans le Coran ?",
    options: ["114", "99", "100", "120"],
    explication: "Le Coran compte 114 sourates, d'Al-Fâtiha à An-Nâs.",
  },
  {
    question:
      "Quel jeûne expie les péchés de l'année précédente ET de l'année suivante ?",
    options: [
      "Le jour de 'Arafat",
      "Achoura",
      "Les jours blancs",
      "Le lundi",
    ],
    explication:
      "« Le jeûne du jour de 'Arafat expie les péchés de l'année précédente et de l'année suivante. » (Muslim)",
  },
  {
    question: "Le jeûne d'Achoura expie les péchés…",
    options: [
      "de l'année précédente",
      "des deux années à venir",
      "de toute la vie",
      "du mois en cours",
    ],
    explication:
      "« Je compte sur Allah pour que le jeûne d'Achoura expie les péchés de l'année précédente. » (Muslim)",
  },
  {
    question: "Quels sont les « jours blancs » de chaque mois lunaire ?",
    options: ["Les 13, 14 et 15", "Les 1, 2 et 3", "Les 10, 11 et 12", "Les 27, 28 et 29"],
    explication:
      "Les 13, 14 et 15 du mois lunaire, quand la lune est pleine — le Prophète ﷺ recommandait d'y jeûner.",
  },
  {
    question: "Quelle nuit est décrite comme « meilleure que mille mois » ?",
    options: [
      "Laylat al-Qadr",
      "La nuit du vendredi",
      "La nuit de l'Aïd",
      "La première nuit de Ramadan",
    ],
    explication:
      "Laylat al-Qadr (la Nuit du Destin), à rechercher dans les 10 dernières nuits de Ramadan (Coran 97:3).",
  },
  {
    question:
      "Combien de jours faut-il jeûner en Chawwal pour avoir la récompense d'une année entière ?",
    options: ["6", "3", "10", "29"],
    explication:
      "« Quiconque jeûne le Ramadan puis six jours de Chawwal, c'est comme s'il avait jeûné toute l'année. » (Muslim)",
  },
  {
    question: "Qu'est-ce que la ghunna en tajwid ?",
    options: [
      "Un son nasal tenu sur نّ et مّ",
      "Une prolongation de 6 temps",
      "Un rebond sonore",
      "Une lettre muette",
    ],
    explication:
      "La ghunna est un son qui résonne dans le nez (~2 temps) sur le noun et le mim portant une shadda.",
  },
  {
    question: "Quelles lettres produisent la qalqala ?",
    options: ["ق ط ب ج د", "ا و ي", "ن م", "ص ض ط ظ"],
    explication:
      "Les cinq lettres de « qutb jad » : ق ط ب ج د, qui rebondissent quand elles portent un soukoun.",
  },
  {
    question: "Combien de temps dure un madd lâzim ?",
    options: ["6 temps", "2 temps", "4 temps", "1 temps"],
    explication:
      "Le madd lâzim est la plus longue prolongation : 6 temps, comme dans الضَّالِّينَ.",
  },
  {
    question: "Avec l'iqlâb, le noun sâkin se transforme en quel son ?",
    options: ["Mim (م)", "Lam (ل)", "Ba (ب)", "Ya (ي)"],
    explication:
      "Devant la lettre ب, le noun sâkin ou tanwin se prononce comme un mim léger avec ghunna.",
  },
  {
    question: "Dans الرَّحْمَٰن, comment se comporte le lâm de l'article ?",
    options: [
      "Il ne se prononce pas (lâm solaire)",
      "Il se prononce clairement",
      "Il se transforme en noun",
      "Il double le alif",
    ],
    explication:
      "Devant une lettre solaire comme ر, le lâm de الـ est muet : on dit ar-Rahmân, pas al-Rahmân.",
  },
  {
    question: "Quelle sourate ouvre le Coran ?",
    options: ["Al-Fâtiha", "Al-Baqara", "An-Nâs", "Yâ-Sîn"],
    explication:
      "Al-Fâtiha (« L'Ouverture »), récitée dans chaque unité de prière.",
  },
  {
    question: "Selon le hadith : « Les actes ne valent que par… »",
    options: [
      "les intentions",
      "leur nombre",
      "leur difficulté",
      "leur durée",
    ],
    explication:
      "« Les actes ne valent que par les intentions. » (Al-Bukhari & Muslim) — premier hadith du recueil de l'imam An-Nawawi.",
  },
  {
    question:
      "Selon le hadith d'Al-Bukhari, le meilleur d'entre nous est celui qui…",
    options: [
      "apprend le Coran et l'enseigne",
      "jeûne le plus",
      "prie toute la nuit",
      "donne le plus d'aumônes",
    ],
    explication:
      "« Le meilleur d'entre vous est celui qui apprend le Coran et l'enseigne. » (Al-Bukhari)",
  },
  {
    question: "Que dit-on avant de dormir ?",
    options: [
      "Bismika Allâhumma amûtu wa ahyâ",
      "Alhamdulillâhi-lladhî ahyânâ",
      "Allâhumma-ftah lî abwâba rahmatik",
      "Hasbunallâhu wa ni'mal-wakîl",
    ],
    explication:
      "« C'est en Ton nom, ô Allah, que je meurs et que je vis. » (Al-Bukhari)",
  },
  {
    question: "Quel est le premier mois de l'année hégirienne ?",
    options: ["Muharram", "Ramadan", "Chawwâl", "Rajab"],
    explication:
      "Muharram, l'un des quatre mois sacrés, ouvre l'année musulmane.",
  },
  {
    question: "Ramadan est le combientième mois du calendrier hégirien ?",
    options: ["9e", "1er", "10e", "12e"],
    explication: "Ramadan est le 9e mois ; l'Aïd al-Fitr ouvre le 10e (Chawwâl).",
  },
  {
    question:
      "La prière en commun surpasse la prière individuelle de combien de degrés ?",
    options: ["27", "7", "70", "100"],
    explication:
      "« La prière en commun surpasse la prière accomplie seul de vingt-sept degrés. » (Al-Bukhari & Muslim)",
  },
  {
    question: "Lire une lettre du Coran rapporte combien de bonnes actions ?",
    options: ["10", "1", "100", "70"],
    explication:
      "« Quiconque lit une lettre du Livre d'Allah en aura une bonne action, et la bonne action vaut dix fois sa valeur. » (At-Tirmidhi)",
  },
  {
    question: "Quels jours le Prophète ﷺ jeûnait-il régulièrement ?",
    options: [
      "Le lundi et le jeudi",
      "Le mardi et le mercredi",
      "Le samedi et le dimanche",
      "Le vendredi",
    ],
    explication:
      "« Les œuvres sont présentées le lundi et le jeudi, et j'aime que mon œuvre soit présentée alors que je jeûne. » (At-Tirmidhi)",
  },

  /* ===== Le Coran ===== */
  {
    question: "Quelle est la plus longue sourate du Coran ?",
    options: ["Al-Baqara", "Âli 'Imrân", "An-Nisâ'", "Al-Kahf"],
    explication:
      "Al-Baqara (« La Vache ») compte 286 versets — c'est la plus longue sourate.",
  },
  {
    question: "Quelle est la plus courte sourate du Coran ?",
    options: ["Al-Kawthar", "Al-Ikhlâs", "An-Nâs", "Al-'Asr"],
    explication: "Al-Kawthar (« L'Abondance ») ne compte que 3 versets.",
  },
  {
    question: "Quelle sourate ne commence pas par la basmala ?",
    options: ["At-Tawba", "Al-Baqara", "Yâ-Sîn", "Al-Mulk"],
    explication:
      "At-Tawba (« Le Repentir ») est la seule sourate qui ne commence pas par Bismillâhi-r-Rahmâni-r-Rahîm.",
  },
  {
    question: "Dans quelle sourate se trouve le « verset du Trône » (Ayat al-Kursî) ?",
    options: ["Al-Baqara", "Al-Fâtiha", "Al-Ikhlâs", "Yâ-Sîn"],
    explication:
      "Ayat al-Kursî est le verset 255 de la sourate Al-Baqara — le plus grand verset du Coran selon le hadith (Muslim).",
  },
  {
    question: "Combien de versets compte Al-Fâtiha ?",
    options: ["7", "5", "10", "3"],
    explication:
      "Al-Fâtiha compte 7 versets — « les sept versets répétés » (Coran 15:87).",
  },
  {
    question: "Quelle sourate équivaut au tiers du Coran selon le hadith ?",
    options: ["Al-Ikhlâs", "Al-Fâtiha", "Al-Kâfiroûn", "An-Nasr"],
    explication:
      "« Qul huwa Allâhu ahad équivaut au tiers du Coran. » (Al-Bukhari)",
  },
  {
    question: "Quelles sont les deux sourates protectrices (al-mu'awwidhatân) ?",
    options: [
      "Al-Falaq et An-Nâs",
      "Al-Fâtiha et Al-Baqara",
      "Al-Ikhlâs et Al-Kawthar",
      "Yâ-Sîn et Al-Mulk",
    ],
    explication:
      "Al-Falaq et An-Nâs, récitées pour se protéger, notamment avant de dormir (Al-Bukhari).",
  },
  {
    question: "Quel est le premier mot révélé du Coran ?",
    options: ["Iqra' (Lis !)", "Bismillâh", "Alhamdulillâh", "Qul (Dis !)"],
    explication:
      "« Iqra' » (« Lis ! ») — les premiers versets de la sourate Al-'Alaq, révélés dans la grotte de Hirâ'.",
  },
  {
    question: "Dans quelle grotte le Prophète ﷺ a-t-il reçu la première révélation ?",
    options: ["Hirâ'", "Thawr", "Ouhoud", "Minâ"],
    explication:
      "Dans la grotte de Hirâ', sur le mont An-Noûr, près de La Mecque.",
  },
  {
    question: "En quel mois le Coran a-t-il commencé à être révélé ?",
    options: ["Ramadan", "Muharram", "Rajab", "Dhoul-Hijja"],
    explication:
      "« Le mois de Ramadan, au cours duquel le Coran a été descendu… » (Coran 2:185)",
  },
  {
    question: "En combien de juz' (parties) le Coran est-il divisé ?",
    options: ["30", "60", "114", "20"],
    explication:
      "Le Coran est divisé en 30 juz', pratique pour le lire en un mois.",
  },
  {
    question: "Quel prophète est le plus souvent cité dans le Coran ?",
    options: ["Moûssâ (Moïse)", "Ibrâhîm", "'Îssâ (Jésus)", "Noûh (Noé)"],
    explication:
      "Moûssâ est mentionné environ 136 fois — plus que tout autre prophète.",
  },
  {
    question: "Quelle est la seule femme nommée dans le Coran ?",
    options: ["Maryam", "Khadîja", "Âsiya", "Hawwâ'"],
    explication:
      "Maryam (Marie), mère de 'Îssâ — une sourate entière porte son nom.",
  },
  {
    question: "Quelle sourate porte le nom d'un métal ?",
    options: ["Al-Hadîd (le fer)", "An-Nahl", "Al-Fîl", "Ad-Dukhân"],
    explication:
      "Al-Hadîd (« Le Fer »), 57e sourate : « Nous avons fait descendre le fer… » (57:25)",
  },
  {
    question: "Quelle sourate porte le nom d'une araignée ?",
    options: ["Al-'Ankaboût", "An-Naml", "An-Nahl", "Al-Fîl"],
    explication:
      "Al-'Ankaboût (« L'Araignée »), 29e sourate. An-Naml est la fourmi et An-Nahl l'abeille.",
  },
  {
    question: "Quelle sourate est-il recommandé de lire le vendredi ?",
    options: ["Al-Kahf", "Yâ-Sîn", "Al-Mulk", "Ar-Rahmân"],
    explication:
      "« Quiconque lit la sourate Al-Kahf le vendredi, une lumière l'éclaire jusqu'au vendredi suivant. » (Al-Hâkim)",
  },
  {
    question: "Que signifie « Al-Baqara » ?",
    options: ["La vache", "L'ouverture", "La lumière", "Le voyage nocturne"],
    explication:
      "Al-Baqara signifie « La Vache », en référence à l'histoire de la vache des fils d'Israël (2:67-73).",
  },

  /* ===== Les prophètes ===== */
  {
    question: "Qui est le premier prophète ?",
    options: ["Âdam", "Noûh", "Ibrâhîm", "Idrîs"],
    explication: "Âdam, le premier homme, est aussi le premier prophète.",
  },
  {
    question: "Quel prophète a été avalé par un énorme poisson ?",
    options: ["Yoûnous", "Moûssâ", "Yoûssouf", "Ayyoûb"],
    explication:
      "Yoûnous (Jonas), qui invoqua dans le ventre du poisson : « Lâ ilâha illâ anta subhânaka innî kuntu mina-z-zâlimîn » (21:87).",
  },
  {
    question: "Quel prophète a construit l'arche ?",
    options: ["Noûh", "Ibrâhîm", "Moûssâ", "Hoûd"],
    explication:
      "Noûh (Noé) construisit l'arche sur ordre d'Allah avant le déluge (11:37).",
  },
  {
    question: "Quel prophète-roi comprenait le langage des oiseaux et des fourmis ?",
    options: ["Soulaymân", "Dâwoûd", "Yoûssouf", "Zakariyyâ"],
    explication:
      "Soulaymân (Salomon), à qui Allah soumit le vent, les jinns et le langage des animaux (27:16-19).",
  },
  {
    question: "Quel prophète est surnommé Khalîl Allah (l'ami intime d'Allah) ?",
    options: ["Ibrâhîm", "Moûssâ", "Muhammad ﷺ", "'Îssâ"],
    explication:
      "« Allah a pris Ibrâhîm pour ami intime (khalîl). » (Coran 4:125)",
  },
  {
    question: "Quel prophète a été jeté dans le feu, qui devint fraîcheur pour lui ?",
    options: ["Ibrâhîm", "Loût", "Ismâ'îl", "Yahyâ"],
    explication:
      "« Ô feu, sois fraîcheur et paix pour Ibrâhîm. » (Coran 21:69)",
  },
  {
    question: "Quel prophète est célèbre pour sa patience dans l'épreuve ?",
    options: ["Ayyoûb", "Yoûnous", "Âdam", "Sâlih"],
    explication:
      "Ayyoûb (Job), éprouvé dans sa santé et ses biens, resta patient et reconnaissant (38:44).",
  },
  {
    question: "Quel prophète a reçu le Zaboûr (les Psaumes) ?",
    options: ["Dâwoûd", "Moûssâ", "'Îssâ", "Ibrâhîm"],
    explication: "« Et Nous avons donné le Zaboûr à Dâwoûd. » (Coran 17:55)",
  },
  {
    question: "Quel prophète a reçu la Torah (At-Tawrât) ?",
    options: ["Moûssâ", "Dâwoûd", "'Îssâ", "Hâroûn"],
    explication:
      "La Torah fut révélée à Moûssâ (Moïse) sur le mont Sinaï (7:145).",
  },
  {
    question: "Quel prophète a reçu l'Évangile (Al-Injîl) ?",
    options: ["'Îssâ", "Moûssâ", "Yahyâ", "Zakariyyâ"],
    explication: "L'Injîl fut révélé à 'Îssâ (Jésus), fils de Maryam (5:46).",
  },
  {
    question: "Qui a reconstruit la Ka'ba avec son fils ?",
    options: ["Ibrâhîm et Ismâ'îl", "Âdam et Chîth", "Moûssâ et Hâroûn", "Dâwoûd et Soulaymân"],
    explication:
      "« Et quand Ibrâhîm et Ismâ'îl élevaient les assises de la Maison… » (Coran 2:127)",
  },

  /* ===== Le Prophète ﷺ et la sîra ===== */
  {
    question: "Comment s'appelle l'année de naissance du Prophète ﷺ ?",
    options: [
      "L'année de l'Éléphant",
      "L'année de la Tristesse",
      "L'année du Déluge",
      "L'année de la Victoire",
    ],
    explication:
      "L'année de l'Éléphant ('âm al-fîl), celle où Abraha attaqua la Ka'ba avec son éléphant (sourate Al-Fîl).",
  },
  {
    question: "Dans quelle ville le Prophète ﷺ est-il né ?",
    options: ["La Mecque", "Médine", "Tâ'if", "Jérusalem"],
    explication:
      "Le Prophète ﷺ est né à La Mecque, vers l'an 570 de l'ère chrétienne.",
  },
  {
    question: "Vers quelle ville le Prophète ﷺ a-t-il émigré (l'Hégire) ?",
    options: ["Médine", "Tâ'if", "La Mecque", "Damas"],
    explication:
      "L'Hégire est l'émigration de La Mecque vers Médine (Yathrib) en 622 — début du calendrier musulman.",
  },
  {
    question: "Qui fut le premier muezzin de l'islam ?",
    options: ["Bilâl ibn Rabâh", "Aboû Bakr", "'Umar ibn al-Khattâb", "Salmân al-Fârisî"],
    explication:
      "Bilâl ibn Rabâh, ancien esclave affranchi, choisi pour sa belle voix.",
  },
  {
    question: "Qui fut la première épouse du Prophète ﷺ ?",
    options: ["Khadîja", "'Â'isha", "Hafsa", "Zaynab"],
    explication:
      "Khadîja bint Khuwaylid, la première à croire en sa mission.",
  },
  {
    question: "Quel compagnon est surnommé As-Siddîq (le véridique) ?",
    options: ["Aboû Bakr", "'Umar", "'Uthmân", "'Alî"],
    explication:
      "Aboû Bakr, pour avoir cru immédiatement au voyage nocturne — premier calife de l'islam.",
  },
  {
    question: "Quel ange transmettait la révélation au Prophète ﷺ ?",
    options: ["Jibrîl", "Mîkâ'îl", "Isrâfîl", "Mâlik"],
    explication:
      "Jibrîl (Gabriel), l'ange chargé de transmettre la révélation aux prophètes.",
  },
  {
    question: "Comment s'appelle le voyage nocturne du Prophète ﷺ vers Jérusalem ?",
    options: ["Al-Isrâ'", "Al-Hijra", "Al-Fath", "Al-Mawlid"],
    explication:
      "Al-Isrâ' (le voyage nocturne), suivi du Mi'râj (l'ascension) — sourate 17.",
  },
  {
    question: "Lors de quel événement les 5 prières ont-elles été prescrites ?",
    options: ["Le Mi'râj (l'ascension)", "L'Hégire", "La bataille de Badr", "Le pèlerinage d'adieu"],
    explication:
      "Lors du Mi'râj, Allah prescrivit directement les cinq prières quotidiennes (Al-Bukhari & Muslim).",
  },
  {
    question: "Quelle fut la première grande bataille de l'islam ?",
    options: ["Badr", "Ouhoud", "Le Fossé (Khandaq)", "Hunayn"],
    explication:
      "La bataille de Badr, la 2e année de l'Hégire, pendant le Ramadan (Coran 3:123).",
  },

  /* ===== Piliers et pratique ===== */
  {
    question: "Combien y a-t-il de piliers de l'islam ?",
    options: ["5", "6", "4", "7"],
    explication:
      "Cinq : la shahâda, la prière, la zakât, le jeûne de Ramadan et le pèlerinage (Al-Bukhari & Muslim).",
  },
  {
    question: "Quel est le premier pilier de l'islam ?",
    options: [
      "La shahâda (attestation de foi)",
      "La prière",
      "La zakât",
      "Le jeûne",
    ],
    explication:
      "L'attestation qu'il n'y a de divinité qu'Allah et que Muhammad est Son messager.",
  },
  {
    question: "Combien y a-t-il de piliers de la foi (îmân) ?",
    options: ["6", "5", "4", "7"],
    explication:
      "Six : croire en Allah, Ses anges, Ses livres, Ses messagers, au Jour dernier et au destin (hadith de Jibrîl, Muslim).",
  },
  {
    question: "Quelle prière est accomplie avant le lever du soleil ?",
    options: ["Al-Fajr", "Adh-Dhuhr", "Al-Maghrib", "Al-'Ishâ'"],
    explication:
      "Al-Fajr (l'aube), 2 unités — « la prière de l'aube est témoignée » (Coran 17:78).",
  },
  {
    question: "Comment s'appelle la direction vers laquelle on prie ?",
    options: ["La qibla", "Le mihrâb", "Le minbar", "La sutra"],
    explication:
      "La qibla : la direction de la Ka'ba à La Mecque (Coran 2:144).",
  },
  {
    question: "Comment s'appellent les petites ablutions ?",
    options: ["Al-wudoû'", "Al-ghusl", "At-tayammum", "As-siwâk"],
    explication:
      "Al-wudoû' : laver visage, mains, avant-bras, tête et pieds avant la prière (Coran 5:6).",
  },
  {
    question: "Comment s'appelle l'ablution sèche (sans eau) ?",
    options: ["At-tayammum", "Al-ghusl", "Al-istinjâ'", "Al-wudoû'"],
    explication:
      "At-tayammum, avec de la terre propre, quand l'eau manque ou nuit (Coran 4:43).",
  },
  {
    question: "Comment s'appelle la prière du vendredi en commun ?",
    options: ["Al-Jumu'a", "At-Tarâwîh", "Al-'Aïd", "Al-Witr"],
    explication:
      "Salât al-Jumu'a, qui remplace le Dhuhr — une sourate porte son nom (62).",
  },
  {
    question: "Comment s'appellent les prières de nuit propres au Ramadan ?",
    options: ["At-Tarâwîh", "Al-Witr", "Ad-Duhâ", "Al-Istikhâra"],
    explication:
      "At-Tarâwîh, accomplies en groupe après la prière de l''Ishâ' pendant le Ramadan.",
  },
  {
    question: "Comment s'appelle la retraite spirituelle à la mosquée en fin de Ramadan ?",
    options: ["Al-i'tikâf", "Al-hijra", "Al-'umra", "Al-khalwa"],
    explication:
      "L'i'tikâf : le Prophète ﷺ le pratiquait les dix dernières nuits de Ramadan (Al-Bukhari).",
  },
  {
    question: "Comment s'appelle le repas pris avant l'aube pendant le Ramadan ?",
    options: ["As-suhoûr", "Al-iftâr", "Al-walîma", "Al-'ashâ'"],
    explication:
      "As-suhoûr — « Prenez le suhoûr, car il y a en lui une bénédiction. » (Al-Bukhari & Muslim). L'iftâr est la rupture du jeûne.",
  },
  {
    question: "Avant quoi doit-on donner la zakât al-Fitr ?",
    options: [
      "La prière de l'Aïd al-Fitr",
      "Le début du Ramadan",
      "La nuit du destin",
      "Le mois de Muharram",
    ],
    explication:
      "Elle doit être versée avant la prière de l'Aïd pour purifier le jeûneur et nourrir les pauvres (Aboû Dâwoûd).",
  },
  {
    question: "En quel mois a lieu le pèlerinage (hajj) ?",
    options: ["Dhoul-Hijja", "Ramadan", "Muharram", "Chawwâl"],
    explication:
      "Le hajj a lieu en Dhoul-Hijja, 12e et dernier mois de l'année hégirienne.",
  },
  {
    question: "Combien de tours effectue-t-on autour de la Ka'ba lors du tawâf ?",
    options: ["7", "3", "5", "10"],
    explication:
      "Sept tours, en commençant à la pierre noire, dans le sens inverse des aiguilles d'une montre.",
  },
  {
    question: "Quel jour a lieu l'Aïd al-Adha (fête du sacrifice) ?",
    options: ["Le 10 Dhoul-Hijja", "Le 1er Chawwâl", "Le 10 Muharram", "Le 27 Rajab"],
    explication:
      "Le 10 Dhoul-Hijja, en souvenir du sacrifice d'Ibrâhîm — lendemain du jour de 'Arafat.",
  },
  {
    question: "Quelle est la troisième mosquée sainte de l'islam ?",
    options: [
      "Al-Aqsâ (Jérusalem)",
      "La mosquée de Qubâ'",
      "La mosquée des Omeyyades",
      "La mosquée de Cordoue",
    ],
    explication:
      "Après Masjid al-Harâm (La Mecque) et la mosquée du Prophète ﷺ (Médine) : la mosquée Al-Aqsâ (Al-Bukhari).",
  },
  {
    question: "Comment s'appelle la source d'eau située près de la Ka'ba ?",
    options: ["Zamzam", "Al-Kawthar", "Salsabîl", "Tasnîm"],
    explication:
      "Zamzam, jaillie pour Hâjar et son fils Ismâ'îl — les pèlerins en boivent encore aujourd'hui.",
  },

  /* ===== Tajwid ===== */
  {
    question: "Quelles sont les lettres de l'idghâm (fusion du noun sâkin) ?",
    options: ["ي ر م ل و ن", "ق ط ب ج د", "ء ه ع ح غ خ", "ص ض ط ظ"],
    explication:
      "Les six lettres du mot يرملون : le noun sâkin ou tanwin fusionne avec elles.",
  },
  {
    question: "Combien de temps dure le madd tabî'î (prolongation naturelle) ?",
    options: ["2 temps", "6 temps", "4 temps", "1 temps"],
    explication:
      "Le madd naturel dure 2 temps, comme dans قَالَ — c'est la base des prolongations.",
  },
  {
    question: "Devant quelles lettres s'applique l'izhâr (prononciation claire) ?",
    options: [
      "Les lettres de la gorge (ء ه ع ح غ خ)",
      "Les lettres de يرملون",
      "La lettre ب",
      "Les lettres solaires",
    ],
    explication:
      "Devant les 6 lettres gutturales, le noun sâkin se prononce clairement, sans ghunna prolongée.",
  },
  {
    question: "Qu'est-ce que l'ikhfâ' en tajwid ?",
    options: [
      "Une prononciation dissimulée du noun avec ghunna",
      "Un rebond de la lettre",
      "Une fusion complète",
      "Une prolongation de 6 temps",
    ],
    explication:
      "L'ikhfâ' : devant 15 lettres, le noun sâkin se prononce entre izhâr et idghâm, avec un son nasal discret.",
  },

  /* ===== Calendrier et divers ===== */
  {
    question: "Combien y a-t-il de mois sacrés dans l'année ?",
    options: ["4", "2", "1", "6"],
    explication:
      "Quatre : Dhoul-Qi'da, Dhoul-Hijja, Muharram et Rajab (Coran 9:36).",
  },
  {
    question: "Combien de jours compte environ l'année lunaire hégirienne ?",
    options: ["354", "365", "360", "340"],
    explication:
      "Environ 354 jours — c'est pourquoi le Ramadan avance d'environ 11 jours chaque année.",
  },
  {
    question: "À quel événement correspond l'an 1 du calendrier musulman ?",
    options: [
      "L'Hégire (émigration à Médine)",
      "La naissance du Prophète ﷺ",
      "La première révélation",
      "La conquête de La Mecque",
    ],
    explication:
      "Le calendrier hégirien commence à l'Hégire (622), choisie sous le califat de 'Umar.",
  },
  {
    question: "Combien de noms d'Allah sont cités dans le hadith célèbre ?",
    options: ["99", "100", "50", "70"],
    explication:
      "« Allah a 99 noms ; quiconque les dénombre entrera au Paradis. » (Al-Bukhari & Muslim)",
  },
  {
    question: "Selon le hadith célèbre, le Paradis se trouve sous les pieds…",
    options: ["des mères", "des savants", "des martyrs", "des pèlerins"],
    explication:
      "« Le Paradis se trouve sous les pieds des mères. » (An-Nasâ'î) — rappel de l'immense rang de la mère.",
  },
  {
    question: "Que répond-on à celui qui dit « alhamdulillâh » après avoir éternué ?",
    options: [
      "Yarhamouka-Llâh",
      "Âmîn",
      "Bâraka-Llâhu fîk",
      "Jazâka-Llâhu khayran",
    ],
    explication:
      "« Yarhamouka-Llâh » (qu'Allah te fasse miséricorde), et il répond : « Yahdîkumu-Llâh wa yuslihu bâlakum. » (Al-Bukhari)",
  },
  {
    question: "Que signifie « as-salâmu 'alaykum » ?",
    options: [
      "Que la paix soit sur vous",
      "Bienvenue chez vous",
      "Qu'Allah vous bénisse",
      "Bonne journée à vous",
    ],
    explication:
      "« Que la paix soit sur vous » — la salutation des musulmans, à laquelle on répond « wa 'alaykumu-s-salâm ».",
  },
  {
    question: "Quel est le meilleur jour de la semaine selon le hadith ?",
    options: ["Le vendredi", "Le lundi", "Le samedi", "Le jeudi"],
    explication:
      "« Le meilleur jour où le soleil se lève est le vendredi. » (Muslim) — jour de la création d'Âdam.",
  },
];
