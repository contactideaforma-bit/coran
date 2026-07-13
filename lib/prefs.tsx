"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

/* ========== Options de personnalisation ========== */

export const FONDS = [
  { id: "creme", nom: "Crème", bg: "#faf6ef", card: "#ffffff", border: "#ece4d4" },
  { id: "blanc", nom: "Blanc", bg: "#f7f7f7", card: "#ffffff", border: "#e5e5e5" },
  { id: "vert-eau", nom: "Vert d'eau", bg: "#eef5ef", card: "#ffffff", border: "#d9e7db" },
  { id: "ciel", nom: "Ciel", bg: "#eef3f8", card: "#ffffff", border: "#d8e3ee" },
  { id: "rose", nom: "Rose poudré", bg: "#f9f0f0", card: "#ffffff", border: "#eddcdc" },
  { id: "sable", nom: "Sable", bg: "#f6efe3", card: "#fffdf8", border: "#e8dcc4" },
];

export const ACCENTS = [
  { id: "or", nom: "Or", clair: "#c9a24b", sombre: "#d9b566" },
  { id: "vert", nom: "Vert", clair: "#2e7d5b", sombre: "#5fbf8a" },
  { id: "bleu", nom: "Bleu", clair: "#3b6ea5", sombre: "#7da5f8" },
  { id: "violet", nom: "Violet", clair: "#7c5cad", sombre: "#b394e6" },
  { id: "corail", nom: "Corail", clair: "#c96a4b", sombre: "#e8926f" },
];

export const TAILLES = [
  { label: "S", arabe: "text-2xl", trad: "text-sm" },
  { label: "M", arabe: "text-3xl", trad: "text-base" },
  { label: "L", arabe: "text-4xl", trad: "text-lg" },
  { label: "XL", arabe: "text-5xl", trad: "text-xl" },
];

export const RECITATEURS = [
  { id: "Husary_128kbps", nom: "Mahmoud Khalil Al-Husary", detail: "Référence pour apprendre le tajwid, débit posé" },
  { id: "Abdul_Basit_Murattal_192kbps", nom: "Abdul Basit Abdus-Samad", detail: "Voix légendaire, récitation murattal" },
  { id: "Minshawy_Murattal_128kbps", nom: "Mohamed Siddiq El-Minshawi", detail: "Grand classique égyptien" },
  { id: "Abdurrahmaan_As-Sudais_192kbps", nom: "Abdurrahman As-Sudais", detail: "Imam de la Mecque" },
  { id: "Saood_ash-Shuraym_128kbps", nom: "Saoud Ash-Shuraym", detail: "Imam de la Mecque" },
  { id: "Ghamadi_40kbps", nom: "Saad Al-Ghamdi", detail: "Voix douce très appréciée" },
];

export const POLICES = [
  { id: "font-amiri", nom: "Amiri" },
  { id: "font-scheherazade", nom: "Scheherazade" },
  { id: "font-noto", nom: "Noto Naskh" },
];

/* ========== Préférences (stockées sur l'appareil) ========== */

export interface Prefs {
  dark: boolean;
  taille: number;
  police: string;
  fond: string; // id dans FONDS
  accent: string; // id dans ACCENTS
  recitateur: string; // id dans RECITATEURS (dossier everyayah.com)
}

const DEFAUTS: Prefs = {
  dark: false,
  taille: 1,
  police: "font-amiri",
  fond: "creme",
  accent: "or",
  recitateur: "Husary_128kbps",
};

const CLE = "coran-prefs";

const PALETTE_SOMBRE = {
  bg: "#17161a",
  card: "#211f26",
  border: "#35323c",
  text: "#eae6de",
  muted: "#9a948a",
};

const TEXTE_CLAIR = { text: "#2d2a26", muted: "#8a8378" };

function appliquer(p: Prefs) {
  const root = document.documentElement;
  const fond = FONDS.find((f) => f.id === p.fond) ?? FONDS[0];
  const accent = ACCENTS.find((a) => a.id === p.accent) ?? ACCENTS[0];

  root.classList.toggle("dark", p.dark);

  const vars = p.dark
    ? { ...PALETTE_SOMBRE, accent: accent.sombre }
    : { ...fond, ...TEXTE_CLAIR, accent: accent.clair };

  root.style.setProperty("--bg", vars.bg);
  root.style.setProperty("--card", vars.card);
  root.style.setProperty("--border", vars.border);
  root.style.setProperty("--text", vars.text);
  root.style.setProperty("--muted", vars.muted);
  root.style.setProperty("--accent", vars.accent);

  // Mémoriser les couleurs calculées pour les appliquer dès le prochain
  // chargement de page, avant React (évite le flash de thème)
  try {
    localStorage.setItem(
      "coran-couleurs",
      JSON.stringify({
        bg: vars.bg,
        card: vars.card,
        border: vars.border,
        text: vars.text,
        muted: vars.muted,
        accent: vars.accent,
      })
    );
  } catch {}
}

/* ========== Contexte React ========== */

interface PrefsContexte {
  prefs: Prefs;
  maj: (changements: Partial<Prefs>) => void;
}

const Ctx = createContext<PrefsContexte>({ prefs: DEFAUTS, maj: () => {} });

export function usePrefs() {
  return useContext(Ctx);
}

export function PrefsProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState<Prefs>(DEFAUTS);
  const [charge, setCharge] = useState(false);

  // Lire les préférences de CET appareil (localStorage : rien ne quitte le téléphone)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CLE);
      if (saved) setPrefs({ ...DEFAUTS, ...JSON.parse(saved) });
    } catch {}
    setCharge(true);
  }, []);

  // Appliquer + sauvegarder à chaque changement
  useEffect(() => {
    if (!charge) return;
    appliquer(prefs);
    localStorage.setItem(CLE, JSON.stringify(prefs));
  }, [prefs, charge]);

  const maj = useCallback((changements: Partial<Prefs>) => {
    setPrefs((p) => ({ ...p, ...changements }));
  }, []);

  return <Ctx.Provider value={{ prefs, maj }}>{children}</Ctx.Provider>;
}

/** Couleur d'accent courante (utile hors CSS). */
export function accentCourant(p: Prefs) {
  const a = ACCENTS.find((x) => x.id === p.accent) ?? ACCENTS[0];
  return p.dark ? a.sombre : a.clair;
}
