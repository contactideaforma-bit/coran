import type { TajwidRuleId } from "@/lib/tajwid";

export interface Segment {
  t: string; // texte arabe
  r?: TajwidRuleId; // règle tajwid appliquée (couleur)
}

export interface Word {
  segments: Segment[];
}

export interface Verse {
  n: number;
  words: Word[]; // découpage par mot → audio mot à mot
  traduction: string;
}

/**
 * Sourate Al-Fâtiha — annotation tajwid de démonstration.
 * NOTE : annotation simplifiée pour le prototype, à faire valider
 * par un spécialiste avant publication.
 *
 * Audio mot à mot : https://verses.quran.com/wbw/001_{verset}_{mot}.mp3
 * Audio verset (Al-Afasy) : https://everyayah.com/data/Alafasy_128kbps/001{verset}.mp3
 */
export const FATIHA: { nomArabe: string; nomFr: string; sourate: number; verses: Verse[] } = {
  nomArabe: "الفاتحة",
  nomFr: "Al-Fâtiha (L'Ouverture)",
  sourate: 1,
  verses: [
    {
      n: 1,
      words: [
        { segments: [{ t: "بِسْمِ" }] },
        { segments: [{ t: "اللَّهِ" }] },
        {
          segments: [
            { t: "ال", r: "lam-shamsiyya" },
            { t: "رَّحْ" },
            { t: "مَٰ", r: "madd2" },
            { t: "نِ" },
          ],
        },
        {
          segments: [
            { t: "ال", r: "lam-shamsiyya" },
            { t: "رَّحِ" },
            { t: "ي", r: "madd2" },
            { t: "مِ" },
          ],
        },
      ],
      traduction: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux.",
    },
    {
      n: 2,
      words: [
        { segments: [{ t: "الْحَمْدُ" }] },
        { segments: [{ t: "لِلَّهِ" }] },
        { segments: [{ t: "رَبِّ" }] },
        {
          segments: [
            { t: "الْعَ" },
            { t: "ا", r: "madd2" },
            { t: "لَمِ" },
            { t: "ي", r: "madd2" },
            { t: "نَ" },
          ],
        },
      ],
      traduction: "Louange à Allah, Seigneur des mondes.",
    },
    {
      n: 3,
      words: [
        {
          segments: [
            { t: "ال", r: "lam-shamsiyya" },
            { t: "رَّحْ" },
            { t: "مَٰ", r: "madd2" },
            { t: "نِ" },
          ],
        },
        {
          segments: [
            { t: "ال", r: "lam-shamsiyya" },
            { t: "رَّحِ" },
            { t: "ي", r: "madd2" },
            { t: "مِ" },
          ],
        },
      ],
      traduction: "Le Tout Miséricordieux, le Très Miséricordieux.",
    },
    {
      n: 4,
      words: [
        {
          segments: [{ t: "مَ" }, { t: "ا", r: "madd2" }, { t: "لِكِ" }],
        },
        { segments: [{ t: "يَوْمِ" }] },
        {
          segments: [
            { t: "ال", r: "lam-shamsiyya" },
            { t: "دِّ" },
            { t: "ي", r: "madd2" },
            { t: "نِ" },
          ],
        },
      ],
      traduction: "Maître du Jour de la rétribution.",
    },
    {
      n: 5,
      words: [
        {
          segments: [{ t: "إِيَّ" }, { t: "ا", r: "madd2" }, { t: "كَ" }],
        },
        { segments: [{ t: "نَعْبُدُ" }] },
        {
          segments: [{ t: "وَإِيَّ" }, { t: "ا", r: "madd2" }, { t: "كَ" }],
        },
        {
          segments: [{ t: "نَسْتَعِ" }, { t: "ي", r: "madd2" }, { t: "نُ" }],
        },
      ],
      traduction:
        "C'est Toi que nous adorons, et c'est Toi dont nous implorons secours.",
    },
    {
      n: 6,
      words: [
        {
          segments: [{ t: "اهْدِنَ" }, { t: "ا", r: "madd2" }],
        },
        {
          segments: [
            { t: "ال", r: "lam-shamsiyya" },
            { t: "صِّرَ" },
            { t: "ا", r: "madd2" },
            { t: "طَ" },
          ],
        },
        {
          segments: [{ t: "الْمُسْتَقِ" }, { t: "ي", r: "madd2" }, { t: "مَ" }],
        },
      ],
      traduction: "Guide-nous dans le droit chemin,",
    },
    {
      n: 7,
      words: [
        {
          segments: [{ t: "صِرَ" }, { t: "ا", r: "madd2" }, { t: "طَ" }],
        },
        {
          segments: [{ t: "الَّذِ" }, { t: "ي", r: "madd2" }, { t: "نَ" }],
        },
        { segments: [{ t: "أَنْعَمْتَ" }] },
        { segments: [{ t: "عَلَيْهِمْ" }] },
        { segments: [{ t: "غَيْرِ" }] },
        { segments: [{ t: "الْمَغْضُوبِ" }] },
        { segments: [{ t: "عَلَيْهِمْ" }] },
        {
          segments: [{ t: "وَلَ" }, { t: "ا", r: "madd2" }],
        },
        {
          segments: [
            { t: "ال", r: "lam-shamsiyya" },
            { t: "ضَّ" },
            { t: "الِّ", r: "madd6" },
            { t: "ي", r: "madd2" },
            { t: "نَ" },
          ],
        },
      ],
      traduction:
        "le chemin de ceux que Tu as comblés de faveurs, non pas de ceux qui ont encouru Ta colère, ni des égarés.",
    },
  ],
};
