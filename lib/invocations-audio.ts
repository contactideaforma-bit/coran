/* Appariement des invocations de l'appli avec les enregistrements audio de
   Hisn al-Muslim (hisnmuslim.com) : on compare le texte arabe, sans
   voyelles ni ponctuation, et on garde la meilleure correspondance. */

import { CATEGORIES_INVOCATIONS } from "@/data/invocations";

const INDEX = "https://www.hisnmuslim.com/api/ar/husn_ar.json";

/** Clé stable d'une invocation : <id catégorie>-<index> */
export function cleInvocation(categorieId: string, index: number) {
  return `${categorieId}-${index}`;
}

/** Normalise un texte arabe : sans harakât, tatwîl, ponctuation ; lettres unifiées. */
export function normaliserArabe(t: string): string {
  return t
    .replace(/[ً-ٰٟۖ-ۭـ]/g, "") // voyelles, signes, tatwîl
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/[^ء-ي\s]/g, " ") // tout ce qui n'est pas une lettre arabe
    .replace(/\s+/g, " ")
    .trim();
}

function jetons(t: string): Set<string> {
  return new Set(normaliserArabe(t).split(" ").filter((m) => m.length > 1));
}

interface Candidat {
  id: number;
  jetons: Set<string>;
}

async function chargerCandidats(): Promise<Candidat[]> {
  const res = await fetch(INDEX, { next: { revalidate: 60 * 60 * 24 * 30 } });
  if (!res.ok) throw new Error("Index Hisn al-Muslim indisponible");
  const index = (await res.json()) as Record<string, { ID: number; TEXT: string }[]>;
  const chapitres = Object.values(index).flat();
  const candidats: Candidat[] = [];
  await Promise.all(
    chapitres.map(async (ch) => {
      try {
        const url = String(ch.TEXT).replace(/^http:/, "https:");
        const r = await fetch(url, { next: { revalidate: 60 * 60 * 24 * 30 } });
        if (!r.ok) return;
        const json = (await r.json()) as Record<string, { ID: number; ARABIC_TEXT: string }[]>;
        for (const item of Object.values(json).flat()) {
          if (!item?.ARABIC_TEXT || typeof item.ID !== "number") continue;
          candidats.push({ id: item.ID, jetons: jetons(item.ARABIC_TEXT) });
        }
      } catch {
        /* chapitre ignoré */
      }
    })
  );
  return candidats;
}

/** Part des mots de `a` présents dans `b`. */
function couverture(a: Set<string>, b: Set<string>) {
  if (!a.size) return 0;
  let n = 0;
  a.forEach((m) => {
    if (b.has(m)) n++;
  });
  return n / a.size;
}

let memo: Promise<Record<string, number>> | null = null;

/** { clé invocation → ID audio Hisn al-Muslim } pour toutes les invocations appariées. */
export function correspondanceAudio(): Promise<Record<string, number>> {
  if (memo) return memo;
  memo = chargerCandidats()
    .then((candidats) => {
      const resultat: Record<string, number> = {};
      for (const cat of CATEGORIES_INVOCATIONS) {
        cat.invocations.forEach((inv, i) => {
          const mots = jetons(inv.arabe);
          let meilleur: Candidat | null = null;
          let score = 0;
          for (const c of candidats) {
            // Les deux sens comptent : notre texte doit être dans le leur et réciproquement
            const s = Math.min(couverture(mots, c.jetons), couverture(c.jetons, mots));
            if (s > score) {
              score = s;
              meilleur = c;
            }
          }
          if (meilleur && score >= 0.6) resultat[cleInvocation(cat.id, i)] = meilleur.id;
        });
      }
      return resultat;
    })
    .catch((e) => {
      memo = null;
      throw e;
    });
  return memo;
}
