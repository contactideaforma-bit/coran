/* Scroll halal : les cartes du fil (extraits du Coran récités, hadiths,
   invocations). Le fil est composé de séries de 10 cartes tirées au hasard,
   suivies d'une carte « pause ». */

import { HADITHS } from "@/data/hadiths";
import { CATEGORIES_INVOCATIONS } from "@/data/invocations";
import { SOURATES } from "@/data/sourates";

export type SceneId = "aube" | "mer" | "desert" | "nuit" | "foret" | "montagnes";
export const SCENES: SceneId[] = ["aube", "mer", "desert", "nuit", "foret", "montagnes"];

export type Carte =
  | { type: "coran"; id: string; s: number; de: number; a: number; theme: string }
  | { type: "hadith"; id: string; texte: string; source: string }
  | {
      type: "invocation";
      id: string;
      titre: string;
      arabe: string;
      translit: string;
      fr: string;
      source: string;
    };

export type Filtre = "tout" | "coran" | "hadith" | "invocation" | "favoris";

/** Passages courts et apaisants (sourate, premier et dernier verset). */
const EXTRAITS: [number, number, number, string][] = [
  [1, 1, 7, "L'Ouverture"],
  [2, 152, 153, "Souvenez-vous de Moi"],
  [2, 186, 186, "Je suis tout proche"],
  [2, 255, 255, "Le verset du Trône"],
  [2, 286, 286, "Allah n'impose à personne plus qu'elle ne peut"],
  [3, 190, 191, "Les signes pour les doués d'intelligence"],
  [13, 28, 28, "Les cœurs s'apaisent"],
  [17, 23, 24, "La bonté envers les parents"],
  [18, 10, 10, "L'invocation des gens de la caverne"],
  [20, 25, 28, "L'invocation de Moïse"],
  [21, 87, 87, "L'invocation de Jonas"],
  [29, 69, 69, "Ceux qui luttent pour Nous"],
  [39, 53, 53, "Ne désespérez pas"],
  [40, 60, 60, "Invoquez-Moi, Je vous répondrai"],
  [49, 13, 13, "Le plus noble d'entre vous"],
  [50, 16, 16, "Plus proche que la veine jugulaire"],
  [55, 1, 13, "Le Tout Miséricordieux"],
  [65, 2, 3, "Il lui donnera une issue"],
  [67, 1, 2, "La Royauté"],
  [93, 1, 11, "Le Jour montant"],
  [94, 1, 8, "Avec la difficulté, la facilité"],
  [97, 1, 5, "La Nuit du Destin"],
  [103, 1, 3, "Le Temps"],
  [112, 1, 4, "Le Monothéisme pur"],
  [113, 1, 5, "L'Aube naissante"],
  [114, 1, 6, "Les Hommes"],
];

export const CARTES_CORAN: Carte[] = EXTRAITS.map(([s, de, a, theme]) => ({
  type: "coran",
  id: `coran-${s}-${de}-${a}`,
  s,
  de,
  a,
  theme,
}));

export const CARTES_HADITH: Carte[] = HADITHS.map((h, i) => ({
  type: "hadith",
  id: `hadith-${i}`,
  texte: h.texte,
  source: h.source,
}));

/** Seules les invocations assez courtes pour tenir sur un écran. */
export const CARTES_INVOCATION: Carte[] = CATEGORIES_INVOCATIONS.flatMap((c) =>
  c.invocations
    .map((inv, i) => ({ inv, i }))
    .filter(({ inv }) => inv.arabe.length <= 240 && inv.fr.length <= 320)
    .map(({ inv, i }) => ({
      type: "invocation" as const,
      id: `inv-${c.id}-${i}`,
      titre: inv.titre,
      arabe: inv.arabe,
      translit: inv.translit,
      fr: inv.fr,
      source: inv.source,
    }))
);

export const TOUTES_LES_CARTES: Carte[] = [
  ...CARTES_CORAN,
  ...CARTES_HADITH,
  ...CARTES_INVOCATION,
];

export const trouverCarte = (id: string) => TOUTES_LES_CARTES.find((c) => c.id === id);

export function nomSourate(s: number) {
  return SOURATES.find((x) => x.n === s)?.nom ?? `Sourate ${s}`;
}

const hacher = (id: string) => {
  let h = 0;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
};

/** Scène de fond stable pour une carte donnée. */
export function sceneDe(id: string): SceneId {
  return SCENES[hacher(id) % SCENES.length];
}

/** Nombre de vidéos réelles (Pexels, compressées dans public/fonds) par scène. */
const VIDEOS_PAR_SCENE: Record<SceneId, number> = {
  aube: 2,
  mer: 2,
  desert: 2,
  nuit: 2,
  foret: 2,
  montagnes: 2,
};

/** Vidéo de fond d'une carte : /fonds/<scene>-<n>.mp4 (+ .jpg en aperçu). */
export function videoDe(id: string): string | null {
  const scene = sceneDe(id);
  const nb = VIDEOS_PAR_SCENE[scene];
  if (!nb) return null;
  return `/fonds/${scene}-${(Math.floor(hacher(id) / SCENES.length) % nb) + 1}`;
}

function melanger<T>(t: T[]): T[] {
  const r = [...t];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

/** Tire une série de `n` cartes, en évitant celles déjà vues si possible.
 *  En mode « tout », on alterne Coran / hadith / invocation. */
export function tirerSerie(
  filtre: Filtre,
  favoris: Set<string>,
  dejaVues: Set<string>,
  n = 10
): Carte[] {
  const pool = (liste: Carte[]) => {
    const neuves = liste.filter((c) => !dejaVues.has(c.id));
    return melanger(neuves.length >= Math.min(n, liste.length) ? neuves : liste);
  };
  if (filtre === "favoris") {
    return pool(TOUTES_LES_CARTES.filter((c) => favoris.has(c.id))).slice(0, n);
  }
  if (filtre !== "tout") {
    const src = filtre === "coran" ? CARTES_CORAN : filtre === "hadith" ? CARTES_HADITH : CARTES_INVOCATION;
    return pool(src).slice(0, n);
  }
  const c = pool(CARTES_CORAN);
  const h = pool(CARTES_HADITH);
  const v = pool(CARTES_INVOCATION);
  const ordre: Carte[][] = [c, v, h, c, h, v, c, v, h, c];
  return ordre.map((l) => l.shift()!).filter(Boolean).slice(0, n);
}
