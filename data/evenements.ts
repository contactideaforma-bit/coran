export interface Evenement {
  id: string;
  nom: string;
  icone: string; // id dans ICONES_EVENEMENTS
  /** Date hégirienne : mois (1-12) et jour ; duree en jours (défaut 1).
   *  Les jours blancs (13-15 de chaque mois) sont gérés à part. */
  hijri?: { mois: number; jour: number; duree?: number };
  recurrent?: "mensuel" | "hebdomadaire";
  description: string;
  conseils: string[];
  recompense: string;
  source: string;
}

export const EVENEMENTS: Evenement[] = [
  {
    id: "nouvel-an",
    nom: "Nouvel an hégirien",
    icone: "lune",
    hijri: { mois: 1, jour: 1 },
    description:
      "Début de l'année musulmane, qui commémore l'Hégire (émigration du Prophète ﷺ de La Mecque à Médine). Muharram est l'un des quatre mois sacrés.",
    conseils: [
      "Multiplier le jeûne durant Muharram",
      "Faire le bilan de son année et prendre de bonnes résolutions",
    ],
    recompense:
      "« Le meilleur jeûne après celui de Ramadan est le jeûne du mois d'Allah, Muharram. »",
    source: "Muslim",
  },
  {
    id: "achoura",
    nom: "Achoura (9-10 Muharram)",
    icone: "etoile",
    hijri: { mois: 1, jour: 9, duree: 2 },
    description:
      "Le 10 Muharram, jour où Allah sauva Moussa (Moïse) et son peuple. Le Prophète ﷺ a recommandé d'y joindre le 9 pour se distinguer.",
    conseils: [
      "Jeûner le 9 et le 10 Muharram (ou le 10 et le 11)",
      "Multiplier les bonnes actions",
    ],
    recompense:
      "« Je compte sur Allah pour que le jeûne du jour de 'Achoura expie les péchés de l'année précédente. »",
    source: "Muslim",
  },
  {
    id: "ramadan",
    nom: "Début du Ramadan",
    icone: "lune",
    hijri: { mois: 9, jour: 1, duree: 29 },
    description:
      "Le mois du jeûne, de la révélation du Coran et de la générosité. Un pilier de l'islam.",
    conseils: [
      "Jeûner de l'aube au coucher du soleil",
      "Lire et méditer le Coran chaque jour",
      "Prier tarawih la nuit",
      "Multiplier aumônes et invocations",
    ],
    recompense:
      "« Quiconque jeûne le Ramadan avec foi et espoir de récompense, ses péchés passés lui sont pardonnés. »",
    source: "Al-Bukhari & Muslim",
  },
  {
    id: "dix-dernieres-nuits",
    nom: "Les 10 dernières nuits de Ramadan",
    icone: "etincelles",
    hijri: { mois: 9, jour: 21, duree: 10 },
    description:
      "Les nuits les plus précieuses de l'année : l'une d'elles est Laylat al-Qadr, « meilleure que mille mois » (Coran 97:3), à rechercher surtout les nuits impaires.",
    conseils: [
      "Intensifier la prière de nuit",
      "Réciter : « Allâhumma innaka 'afuwwun tuhibbul-'afwa fa'fu 'annî »",
      "Faire des invocations et des aumônes chaque nuit",
    ],
    recompense:
      "« Quiconque veille Laylat al-Qadr avec foi et espoir de récompense, ses péchés passés lui sont pardonnés. »",
    source: "Al-Bukhari & Muslim",
  },
  {
    id: "eid-fitr",
    nom: "Aïd al-Fitr",
    icone: "cadeau",
    hijri: { mois: 10, jour: 1 },
    description:
      "La fête de la rupture du jeûne, jour de joie, de prière en commun et de partage. Il est interdit de jeûner ce jour-là.",
    conseils: [
      "Donner la zakat al-fitr avant la prière de l'Aïd",
      "Assister à la prière de l'Aïd en famille",
      "Se parfumer, porter ses beaux habits, féliciter les siens",
    ],
    recompense:
      "Jour de récompense pour le jeûneur : « Le jeûneur a deux joies : l'une à la rupture du jeûne et l'autre à la rencontre de son Seigneur. »",
    source: "Al-Bukhari & Muslim",
  },
  {
    id: "six-chawwal",
    nom: "Les 6 jours de Chawwal",
    icone: "calendrier",
    hijri: { mois: 10, jour: 2, duree: 28 },
    description:
      "Jeûner six jours durant le mois de Chawwal (après l'Aïd), d'affilée ou non.",
    conseils: ["Jeûner 6 jours quand tu veux dans le mois, hors jour de l'Aïd"],
    recompense:
      "« Quiconque jeûne le Ramadan puis le fait suivre de six jours de Chawwal, c'est comme s'il avait jeûné toute l'année. »",
    source: "Muslim",
  },
  {
    id: "dix-dhul-hijja",
    nom: "Les 10 premiers jours de Dhoul-Hijja",
    icone: "cube",
    hijri: { mois: 12, jour: 1, duree: 10 },
    description:
      "Les meilleurs jours de l'année pour les bonnes œuvres, période du pèlerinage.",
    conseils: [
      "Multiplier dhikr : tahlîl, takbîr, tahmîd",
      "Jeûner les 9 premiers jours si possible",
      "Multiplier aumônes et lecture du Coran",
    ],
    recompense:
      "« Il n'y a pas de jours où les bonnes œuvres sont plus aimées d'Allah que ces dix jours. »",
    source: "Al-Bukhari",
  },
  {
    id: "arafat",
    nom: "Jour de 'Arafat",
    icone: "montagne",
    hijri: { mois: 12, jour: 9 },
    description:
      "Le 9 Dhoul-Hijja, jour où les pèlerins se tiennent sur le mont 'Arafat. Le jeûne y est fortement recommandé pour les non-pèlerins.",
    conseils: [
      "Jeûner ce jour (pour qui n'est pas en pèlerinage)",
      "Multiplier les invocations : la meilleure invocation est celle du jour de 'Arafat",
    ],
    recompense:
      "« Le jeûne du jour de 'Arafat expie les péchés de l'année précédente et de l'année suivante. »",
    source: "Muslim",
  },
  {
    id: "eid-adha",
    nom: "Aïd al-Adha",
    icone: "cadeau",
    hijri: { mois: 12, jour: 10 },
    description:
      "La fête du sacrifice, en souvenir d'Ibrahim (Abraham). Jour de prière, de sacrifice et de partage.",
    conseils: [
      "Assister à la prière de l'Aïd",
      "Sacrifier une bête (pour qui le peut) et partager la viande",
      "Dire les takbîrs jusqu'au 13 Dhoul-Hijja",
    ],
    recompense:
      "Le sacrifice est l'une des œuvres les plus aimées d'Allah en ce jour.",
    source: "At-Tirmidhi & Ibn Majah",
  },
  {
    id: "jours-blancs",
    nom: "Les jours blancs (13-14-15 du mois)",
    icone: "lune-pleine",
    recurrent: "mensuel",
    description:
      "Les 13, 14 et 15 de chaque mois lunaire, quand la lune est pleine. Le Prophète ﷺ recommandait d'y jeûner.",
    conseils: ["Jeûner ces trois jours chaque mois lunaire"],
    recompense:
      "« Jeûner trois jours par mois équivaut au jeûne de toute l'année. »",
    source: "Al-Bukhari & Muslim",
  },
  {
    id: "lundi-jeudi",
    nom: "Lundi et jeudi",
    icone: "repeter",
    recurrent: "hebdomadaire",
    description:
      "Le Prophète ﷺ jeûnait régulièrement le lundi et le jeudi : les œuvres y sont présentées à Allah.",
    conseils: ["Jeûner le lundi et/ou le jeudi quand c'est possible"],
    recompense:
      "« Les œuvres sont présentées le lundi et le jeudi, et j'aime que mon œuvre soit présentée alors que je jeûne. »",
    source: "At-Tirmidhi (authentique)",
  },
];
