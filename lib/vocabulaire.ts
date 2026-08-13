/**
 * Moteur de mémorisation du vocabulaire coranique.
 *
 * Système de Leitner à 5 boîtes : chaque bonne réponse fait monter le mot
 * d'une boîte et repousse sa prochaine révision ; une erreur le renvoie en
 * boîte 1. Un mot est considéré « mémorisé » à partir de la boîte 3, donc
 * après trois bonnes réponses espacées dans le temps — jamais sur simple
 * déclaration de l'utilisateur.
 *
 * La progression vit dans le localStorage, comme le marque-page. Tout passe
 * par les fonctions de ce fichier : c'est le seul endroit à modifier le jour
 * où la progression sera synchronisée sur un compte.
 */

import { PACKS, TOUS_LES_MOTS, type Mot, type PackVocabulaire } from "@/data/vocabulaire";

/* ===================================================== Boîtes et délais === */

/** Boîte à partir de laquelle un mot est annoncé « mémorisé » à l'utilisateur. */
export const BOITE_MEMORISE = 3;
export const BOITE_MAX = 5;

/** Délai avant la révision suivante, en jours, pour chaque boîte (index = boîte). */
const INTERVALLES = [0, 1, 3, 7, 21, 60];
const JOUR = 86_400_000;

const CLE = "coran-vocabulaire";
const VERSION = 1;

/* ============================================================== Modèle ==== */

export interface EtatMot {
  /** 0 = jamais rencontré, 1 à 5 = boîte de Leitner. */
  boite: number;
  /** Date de la prochaine révision (ms). */
  prochaine: number;
  /** Nombre de fois où le mot a été présenté. */
  vus: number;
  /** Nombre de bonnes réponses cumulées. */
  reussites: number;
}

export type Progression = Record<string, EtatMot>;

const NEUF: EtatMot = { boite: 0, prochaine: 0, vus: 0, reussites: 0 };

/* ============================================================ Stockage ==== */

export function lireProgression(): Progression {
  try {
    const brut = localStorage.getItem(CLE);
    if (!brut) return {};
    const donnees = JSON.parse(brut);
    if (donnees?.v !== VERSION || typeof donnees.mots !== "object") return {};
    return donnees.mots as Progression;
  } catch {
    return {};
  }
}

export function ecrireProgression(progression: Progression) {
  try {
    localStorage.setItem(CLE, JSON.stringify({ v: VERSION, mots: progression }));
  } catch {}
}

export function effacerProgression() {
  try {
    localStorage.removeItem(CLE);
  } catch {}
}

/* ============================================================ Lecture ===== */

export function etat(progression: Progression, id: string): EtatMot {
  return progression[id] ?? NEUF;
}

export function estMemorise(e: EtatMot): boolean {
  return e.boite >= BOITE_MEMORISE;
}

export function estNouveau(e: EtatMot): boolean {
  return e.boite === 0;
}

/** Un mot déjà rencontré dont la date de révision est passée. */
export function estDu(e: EtatMot, maintenant = Date.now()): boolean {
  return e.boite > 0 && e.boite < BOITE_MAX && e.prochaine <= maintenant;
}

/* ========================================================== Écriture ====== */

/** Applique une réponse : montée d'une boîte si juste, retour en boîte 1 sinon. */
export function apresReponse(e: EtatMot, juste: boolean): EtatMot {
  const boite = juste ? Math.min(e.boite + 1, BOITE_MAX) : 1;
  return {
    boite,
    prochaine: Date.now() + INTERVALLES[boite] * JOUR,
    vus: e.vus + 1,
    reussites: e.reussites + (juste ? 1 : 0),
  };
}

/**
 * Raccourci manuel « je connais déjà ce mot » : place directement le mot au
 * seuil de mémorisation, sans le déclarer acquis pour autant — il repassera
 * en révision et devra se confirmer comme les autres.
 */
export function marquerConnu(e: EtatMot): EtatMot {
  return {
    boite: BOITE_MEMORISE,
    prochaine: Date.now() + INTERVALLES[BOITE_MEMORISE] * JOUR,
    vus: e.vus + 1,
    reussites: e.reussites,
  };
}

/* ======================================================== Statistiques ==== */

export interface StatsPack {
  total: number;
  memorises: number;
  enCours: number;
  nouveaux: number;
  dus: number;
  /** Mots du Coran couverts par les mots déjà mémorisés de ce pack. */
  motsCouverts: number;
}

export function statsPack(pack: PackVocabulaire, progression: Progression): StatsPack {
  const maintenant = Date.now();
  let memorises = 0;
  let enCours = 0;
  let nouveaux = 0;
  let dus = 0;
  let motsCouverts = 0;

  for (const mot of pack.mots) {
    const e = etat(progression, mot.id);
    if (estNouveau(e)) nouveaux++;
    else if (estMemorise(e)) {
      memorises++;
      motsCouverts += mot.frequence;
    } else enCours++;
    if (estDu(e, maintenant)) dus++;
  }
  return { total: pack.mots.length, memorises, enCours, nouveaux, dus, motsCouverts };
}

export interface StatsGlobales {
  total: number;
  memorises: number;
  dus: number;
  /** Part du Coran reconnaissable grâce aux mots mémorisés, en pourcentage. */
  couverture: number;
}

/** Nombre total de mots du Coran, d'après le corpus morphologique. */
const MOTS_DU_CORAN = 77_429;

export function statsGlobales(progression: Progression): StatsGlobales {
  const maintenant = Date.now();
  let memorises = 0;
  let dus = 0;
  let couverts = 0;

  for (const mot of TOUS_LES_MOTS) {
    const e = etat(progression, mot.id);
    if (estMemorise(e)) {
      memorises++;
      couverts += mot.frequence;
    }
    if (estDu(e, maintenant)) dus++;
  }
  return {
    total: TOUS_LES_MOTS.length,
    memorises,
    dus,
    couverture: (couverts / MOTS_DU_CORAN) * 100,
  };
}

/** Un pack est ouvert si le précédent est mémorisé à moitié au moins. */
export function packOuvert(pack: PackVocabulaire, progression: Progression): boolean {
  if (pack.ordre <= 1) return true;
  const precedent = PACKS.find((p) => p.ordre === pack.ordre - 1);
  if (!precedent) return true;
  const s = statsPack(precedent, progression);
  return s.memorises >= Math.ceil(s.total / 2);
}

/* ====================================================== Choix des mots ==== */

function melanger<T>(liste: T[]): T[] {
  const t = [...liste];
  for (let i = t.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [t[i], t[j]] = [t[j], t[i]];
  }
  return t;
}

/**
 * Mots à travailler dans une session de pack : les révisions dues d'abord,
 * complétées par des mots jamais vus.
 */
export function motsDeSession(
  pack: PackVocabulaire,
  progression: Progression,
  taille = 8
): Mot[] {
  const maintenant = Date.now();
  const dus = pack.mots.filter((m) => estDu(etat(progression, m.id), maintenant));
  const enCours = pack.mots.filter((m) => {
    const e = etat(progression, m.id);
    return e.boite > 0 && !estMemorise(e) && !estDu(e, maintenant);
  });
  const nouveaux = pack.mots.filter((m) => estNouveau(etat(progression, m.id)));

  return [...dus, ...nouveaux, ...enCours].slice(0, taille);
}

/**
 * Tirage pour la révision libre : priorité aux mots dus, puis aux boîtes
 * basses. Un mot en boîte 5 ne ressort qu'une fois les autres épuisés.
 */
export function motsDeRevision(progression: Progression, taille = 12): Mot[] {
  const maintenant = Date.now();
  const connus = TOUS_LES_MOTS.filter((m) => !estNouveau(etat(progression, m.id)));

  const parPriorite = melanger(connus).sort((a, b) => {
    const ea = etat(progression, a.id);
    const eb = etat(progression, b.id);
    const duA = estDu(ea, maintenant) ? 0 : 1;
    const duB = estDu(eb, maintenant) ? 0 : 1;
    return duA - duB || ea.boite - eb.boite;
  });

  return parPriorite.slice(0, taille);
}

/** Distracteurs plausibles : des mots du même pack, à défaut d'autres packs. */
export function leurres(mot: Mot, nombre = 3): Mot[] {
  const pack = PACKS.find((p) => p.mots.some((m) => m.id === mot.id));
  const memePack = melanger((pack?.mots ?? []).filter((m) => m.id !== mot.id));
  const autres = melanger(TOUS_LES_MOTS.filter((m) => m.id !== mot.id));
  const choisis: Mot[] = [];

  for (const candidat of [...memePack, ...autres]) {
    if (choisis.length >= nombre) break;
    if (choisis.some((m) => m.sens === candidat.sens || m.id === candidat.id)) continue;
    choisis.push(candidat);
  }
  return choisis;
}

/* ================================================== Recherche dans un verset */

const DIACRITIQUES = /[ً-ْٰـۖ-ۭ]/g;

/** Squelette comparable d'un mot arabe : sans voyelles, hamzas fusionnées. */
export function cleArabe(texte: string): string {
  return texte
    .replace(/\s/g, "")
    .replace(DIACRITIQUES, "")
    .replace(/[أإآٱاءؤئ]/g, "ء")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه");
}

/**
 * Retrouve la position d'un mot dans un verset, en tolérant les préfixes
 * collés (وَ، الْ، بِ…). Renvoie null si le mot n'est pas reconnaissable :
 * l'exercice « repère le mot » est alors simplement remplacé par un autre.
 */
export function trouverMotDansVerset(mot: Mot, motsDuVerset: string[]): number | null {
  const cible = cleArabe(mot.arabe).replace(/^ءل/, "");
  if (cible.length < 2) return null;

  for (let i = 0; i < motsDuVerset.length; i++) {
    const candidat = cleArabe(motsDuVerset[i]);
    if (candidat.includes(cible)) return i;
  }
  return null;
}
