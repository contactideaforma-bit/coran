export type TajwidRuleId =
  | "ghunna"
  | "madd2"
  | "madd46"
  | "madd6"
  | "qalqala"
  | "ikhfa"
  | "idgham"
  | "lam-shamsiyya";

export interface TajwidRule {
  id: TajwidRuleId;
  nom: string;
  couleur: string; // couleur en mode clair
  couleurSombre: string; // couleur en mode sombre
  resume: string; // rappel court
  detail: string; // explication complète
  exemple: string;
}

export const TAJWID_RULES: TajwidRule[] = [
  {
    id: "ghunna",
    nom: "Ghunna (nasillement)",
    couleur: "#2e8b57",
    couleurSombre: "#5fbf8a",
    resume: "Son nasal tenu 2 temps sur نّ et مّ",
    detail:
      "Lorsque le noun (ن) ou le mim (م) porte une shadda, on fait résonner le son dans le nez pendant environ 2 temps.",
    exemple: "إِنَّ • ثُمَّ",
  },
  {
    id: "madd2",
    nom: "Madd naturel (2 temps)",
    couleur: "#d97706",
    couleurSombre: "#f5a94a",
    resume: "Prolongation courte de 2 temps",
    detail:
      "Prolongation naturelle d'une voyelle longue (ا، و، ي) : on allonge le son pendant 2 temps, ni plus ni moins.",
    exemple: "قَالَ • فِيهَا",
  },
  {
    id: "madd46",
    nom: "Madd obligatoire (4-5 temps)",
    couleur: "#dc2626",
    couleurSombre: "#f87171",
    resume: "Prolongation de 4 à 5 temps",
    detail:
      "Quand une lettre de prolongation est suivie d'une hamza dans le même mot (madd muttasil), on allonge 4 à 5 temps.",
    exemple: "جَاءَ • السَّمَاءِ",
  },
  {
    id: "madd6",
    nom: "Madd lâzim (6 temps)",
    couleur: "#7c2d12",
    couleurSombre: "#c4795a",
    resume: "Prolongation longue de 6 temps",
    detail:
      "Quand une lettre de prolongation est suivie d'une lettre portant une shadda ou un soukoun fixe, on allonge 6 temps.",
    exemple: "الضَّالِّينَ • الْحَاقَّةُ",
  },
  {
    id: "qalqala",
    nom: "Qalqala (rebond)",
    couleur: "#0e7490",
    couleurSombre: "#4fc3dd",
    resume: "Rebond sonore sur ق ط ب ج د",
    detail:
      "Les lettres ق، ط، ب، ج، د (regroupées dans « qutb jad ») portant un soukoun produisent un léger écho, comme un rebond.",
    exemple: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ",
  },
  {
    id: "ikhfa",
    nom: "Ikhfâ' (dissimulation)",
    couleur: "#7e22ce",
    couleurSombre: "#c084fc",
    resume: "Noun caché + ghunna légère",
    detail:
      "Quand un noun sâkin (نْ) ou un tanwin est suivi de l'une des 15 lettres de l'ikhfâ', on prononce un son intermédiaire nasalisé, sans articuler clairement le noun.",
    exemple: "مِن قَبْلُ • أَنتُمْ",
  },
  {
    id: "idgham",
    nom: "Idghâm (fusion)",
    couleur: "#1d4ed8",
    couleurSombre: "#7da5f8",
    resume: "Le noun fusionne dans la lettre suivante",
    detail:
      "Quand un noun sâkin ou un tanwin est suivi de ي، ر، م، ل، و، ن, le noun disparaît et fusionne avec la lettre suivante (avec ou sans ghunna).",
    exemple: "مِن رَّبِّهِمْ • مَن يَقُولُ",
  },
  {
    id: "lam-shamsiyya",
    nom: "Lâm solaire (muette)",
    couleur: "#9ca3af",
    couleurSombre: "#6b7280",
    resume: "Le ل de الـ ne se prononce pas",
    detail:
      "Devant une lettre solaire, le lâm de l'article الـ ne se prononce pas : la lettre suivante est doublée à la place.",
    exemple: "الرَّحْمَٰنِ → ar-Rahmân (pas al-Rahmân)",
  },
];

export const RULE_BY_ID: Record<TajwidRuleId, TajwidRule> = Object.fromEntries(
  TAJWID_RULES.map((r) => [r.id, r])
) as Record<TajwidRuleId, TajwidRule>;
