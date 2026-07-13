export interface Hadith {
  texte: string;
  source: string;
}

/** Hadiths courts et authentiques (rotation quotidienne sur l'accueil). */
export const HADITHS: Hadith[] = [
  {
    texte:
      "Les actes ne valent que par les intentions, et chacun n'a que ce qu'il a eu réellement l'intention de faire.",
    source: "Al-Bukhari & Muslim",
  },
  {
    texte: "Le meilleur d'entre vous est celui qui apprend le Coran et l'enseigne.",
    source: "Al-Bukhari",
  },
  {
    texte:
      "Quiconque lit une lettre du Livre d'Allah en aura une bonne action, et la bonne action vaut dix fois sa valeur. Je ne dis pas que « Alif-Lâm-Mîm » est une lettre, mais Alif est une lettre, Lâm est une lettre et Mîm est une lettre.",
    source: "At-Tirmidhi (authentique)",
  },
  {
    texte:
      "Nul d'entre vous ne sera vraiment croyant tant qu'il n'aimera pas pour son frère ce qu'il aime pour lui-même.",
    source: "Al-Bukhari & Muslim",
  },
  {
    texte:
      "Que celui qui croit en Allah et au Jour dernier dise du bien ou qu'il se taise.",
    source: "Al-Bukhari & Muslim",
  },
  {
    texte: "Le sourire que tu adresses à ton frère est une aumône.",
    source: "At-Tirmidhi",
  },
  {
    texte: "La pureté est la moitié de la foi.",
    source: "Muslim",
  },
  {
    texte:
      "Quiconque emprunte un chemin à la recherche d'une science, Allah lui facilite par cela un chemin vers le Paradis.",
    source: "Muslim",
  },
  {
    texte:
      "L'homme fort n'est pas celui qui terrasse les autres ; l'homme fort est celui qui se maîtrise dans la colère.",
    source: "Al-Bukhari & Muslim",
  },
  {
    texte:
      "Facilitez et ne rendez pas les choses difficiles, annoncez la bonne nouvelle et ne faites pas fuir les gens.",
    source: "Al-Bukhari & Muslim",
  },
  {
    texte:
      "Ne méprise aucune bonne action, même le fait d'accueillir ton frère avec un visage souriant.",
    source: "Muslim",
  },
  {
    texte: "Celui qui ne remercie pas les gens ne remercie pas Allah.",
    source: "Abu Dawud & At-Tirmidhi",
  },
  {
    texte:
      "Les croyants sont, dans leur affection, leur miséricorde et leur bienveillance mutuelles, comme un seul corps : quand un membre souffre, tout le corps partage son insomnie et sa fièvre.",
    source: "Al-Bukhari & Muslim",
  },
  {
    texte:
      "Protégez-vous du Feu, ne serait-ce qu'avec la moitié d'une datte donnée en aumône.",
    source: "Al-Bukhari & Muslim",
  },
  {
    texte: "L'aumône ne diminue en rien la richesse.",
    source: "Muslim",
  },
  {
    texte:
      "Deux paroles légères sur la langue, lourdes dans la balance et aimées du Tout Miséricordieux : SubhânAllâhi wa bihamdihi, SubhânAllâhil-'Adhîm.",
    source: "Al-Bukhari & Muslim",
  },
  {
    texte:
      "Quiconque jeûne le mois de Ramadan avec foi et en espérant la récompense d'Allah, ses péchés passés lui sont pardonnés.",
    source: "Al-Bukhari & Muslim",
  },
  {
    texte:
      "La prière en commun surpasse la prière accomplie seul de vingt-sept degrés.",
    source: "Al-Bukhari & Muslim",
  },
  {
    texte: "Le meilleur d'entre vous est le meilleur envers sa famille.",
    source: "At-Tirmidhi (authentique)",
  },
  {
    texte:
      "Ne vous jalousez pas, ne vous détestez pas, ne vous tournez pas le dos ; soyez frères, ô serviteurs d'Allah.",
    source: "Al-Bukhari & Muslim",
  },
  {
    texte:
      "Allah ne regarde ni vos corps ni vos apparences, mais Il regarde vos cœurs et vos actes.",
    source: "Muslim",
  },
  {
    texte:
      "Les paroles les plus aimées d'Allah sont au nombre de quatre : SubhânAllâh, Al-hamdu lillâh, Lâ ilâha illa Allâh, Allâhu akbar.",
    source: "Muslim",
  },
  {
    texte:
      "Quiconque accomplit la prière de l'aube (Fajr) est sous la protection d'Allah.",
    source: "Muslim",
  },
  {
    texte:
      "La meilleure prière après les prières obligatoires est la prière de la nuit.",
    source: "Muslim",
  },
];

/** Hadith du jour : rotation stable basée sur la date. */
export function hadithDuJour(date = new Date()): Hadith {
  const debut = new Date(date.getFullYear(), 0, 0);
  const jourAnnee = Math.floor(
    (date.getTime() - debut.getTime()) / 86_400_000
  );
  return HADITHS[jourAnnee % HADITHS.length];
}
