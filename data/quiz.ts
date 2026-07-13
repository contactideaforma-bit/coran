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
];
