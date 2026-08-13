#!/usr/bin/env node
/**
 * Vérifie et recalcule les données de data/vocabulaire.ts à partir du corpus
 * morphologique du Coran (Quranic Arabic Corpus).
 *
 *   node scripts/verifier-vocabulaire.mjs           → rapport seul
 *   node scripts/verifier-vocabulaire.mjs --ecrire  → réécrit les fréquences
 *
 * Nécessite Node 18+ (fetch natif) et une connexion internet au premier lancement.
 * Le corpus est mis en cache dans .cache/quran-morphology.txt.
 *
 * Ce que le script contrôle :
 *   1. chaque racine (ou chaque lemme, pour les particules) existe dans le corpus ;
 *   2. sa fréquence réelle, toutes formes dérivées confondues ;
 *   3. que le verset d'exemple contient bien ce mot.
 *
 * Deux formats de corpus sont acceptés : celui en arabe (mustafa0x) et celui
 * en translittération Buckwalter (corpus.quran.com v0.4).
 */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ICI = path.dirname(fileURLToPath(import.meta.url));
const RACINE_PROJET = path.resolve(ICI, "..");
const FICHIER_VOCAB = path.join(RACINE_PROJET, "data", "vocabulaire.ts");
const CACHE = path.join(RACINE_PROJET, ".cache", "quran-morphology.txt");
const ECRIRE = process.argv.includes("--ecrire");

const SOURCES = [
  "https://raw.githubusercontent.com/mustafa0x/quran-morphology/master/quran-morphology.txt",
  "https://raw.githubusercontent.com/kaisdukes/quranic-corpus/main/data/quranic-corpus-morphology-0.4.txt",
];

/* ================================================================ corpus == */

async function chargerCorpus() {
  if (existsSync(CACHE)) return readFile(CACHE, "utf8");

  await mkdir(path.dirname(CACHE), { recursive: true });
  for (const url of SOURCES) {
    try {
      process.stdout.write(`Téléchargement du corpus depuis ${new URL(url).hostname}… `);
      const rep = await fetch(url);
      if (!rep.ok) throw new Error(`HTTP ${rep.status}`);
      const texte = await rep.text();
      if (texte.length < 500_000) throw new Error("fichier trop court, source inattendue");
      await writeFile(CACHE, texte, "utf8");
      console.log("ok");
      return texte;
    } catch (e) {
      console.log(`échec (${e.message})`);
    }
  }
  console.error(
    "\nImpossible de télécharger le corpus.\n" +
      "Télécharge-le à la main depuis https://corpus.quran.com/download/\n" +
      `puis place le fichier .txt ici : ${CACHE}`
  );
  process.exit(1);
}

/* ====================================================== normalisation ===== */

const BUCKWALTER_VERS_ARABE = {
  A: "ا", b: "ب", t: "ت", v: "ث", j: "ج", H: "ح", x: "خ", d: "د", "*": "ذ",
  r: "ر", z: "ز", s: "س", $: "ش", S: "ص", D: "ض", T: "ط", Z: "ظ", E: "ع",
  g: "غ", f: "ف", q: "ق", k: "ك", l: "ل", m: "م", n: "ن", h: "ه", w: "و",
  y: "ي", "'": "ء", ">": "أ", "<": "إ", "|": "آ", "&": "ؤ", "}": "ئ",
  "{": "ا", p: "ة", Y: "ى",
};

const A_ARABE = /[؀-ۿ]/;
const DIACRITIQUES = /[ً-ْٰـۖ-ۭٓ-ٕ]/g;

/**
 * Réduit un mot ou une racine à un squelette comparable :
 * diacritiques retirées, toutes les graphies de la hamza et de l'alif fusionnées,
 * ى ramené à ي et ة à ه. Accepte l'arabe comme le buckwalter.
 */
function cle(s) {
  if (!s) return "";
  let t = s.replace(/\s/g, "");
  if (!A_ARABE.test(t)) {
    t = [...t].map((c) => BUCKWALTER_VERS_ARABE[c] ?? c).join("");
  }
  return t
    .replace(DIACRITIQUES, "")
    .replace(/[أإآٱاء؞ؤئ]/g, "ء")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه");
}

/* ====================================================== lecture corpus ==== */

/**
 * Format d'une ligne : sourate:verset:mot:segment \t forme \t catégorie \t traits
 * (la référence est parfois entre parenthèses selon la source).
 * Les traits contiennent éventuellement ROOT:… et LEM:…
 */
function analyserCorpus(texte) {
  const motsParRacine = new Map(); // racine → Set("s:v:m")
  const motsParLemme = new Map();
  const motsParForme = new Map(); // secours : pronoms et particules sans LEM
  const racinesParVerset = new Map(); // "s:v" → Set(racines)
  const lemmesParVerset = new Map();
  const formesParVerset = new Map();
  const tousLesMots = new Set();
  const tailleVerset = new Map(); // "s:v" → nombre de mots
  const segmentsDuMot = new Map(); // "s:v:m" → forme recollée

  for (const ligne of texte.split("\n")) {
    const colonnes = ligne.split("\t");
    if (colonnes.length < 4) continue;
    const ref = colonnes[0].replace(/[()]/g, "").trim();
    const m = ref.match(/^(\d+):(\d+):(\d+):(\d+)$/);
    if (!m) continue;

    const cleVerset = `${m[1]}:${m[2]}`;
    const cleMot = `${m[1]}:${m[2]}:${m[3]}`;
    tousLesMots.add(cleMot);
    tailleVerset.set(cleVerset, Math.max(tailleVerset.get(cleVerset) ?? 0, Number(m[3])));

    segmentsDuMot.set(cleMot, (segmentsDuMot.get(cleMot) ?? "") + colonnes[1]);

    const forme = cle(colonnes[1]);
    if (forme) {
      if (!motsParForme.has(forme)) motsParForme.set(forme, new Set());
      motsParForme.get(forme).add(cleMot);
      if (!formesParVerset.has(cleVerset)) formesParVerset.set(cleVerset, new Set());
      formesParVerset.get(cleVerset).add(forme);
    }

    const traits = colonnes[3];
    const racine = traits.match(/ROOT:([^|\s]+)/)?.[1];
    const lemme = traits.match(/LEM:([^|\s]+)/)?.[1];

    if (racine) {
      const k = cle(racine);
      if (!motsParRacine.has(k)) motsParRacine.set(k, new Set());
      motsParRacine.get(k).add(cleMot);
      if (!racinesParVerset.has(cleVerset)) racinesParVerset.set(cleVerset, new Set());
      racinesParVerset.get(cleVerset).add(k);
    }
    if (lemme) {
      const k = cle(lemme);
      if (!motsParLemme.has(k)) motsParLemme.set(k, new Set());
      motsParLemme.get(k).add(cleMot);
      if (!lemmesParVerset.has(cleVerset)) lemmesParVerset.set(cleVerset, new Set());
      lemmesParVerset.get(cleVerset).add(k);
    }
  }
  // Beaucoup de mots sont découpés en segments (هَٰ+ذَا, كَ+مَا, هُمُ…) : on
  // reconstitue la forme complète pour pouvoir les retrouver entiers.
  const motsEntiers = new Map();
  const entiersParVerset = new Map();
  for (const [cleMot, forme] of segmentsDuMot) {
    const k = cle(forme);
    if (!k) continue;
    const cleVerset = cleMot.split(":").slice(0, 2).join(":");
    if (!motsEntiers.has(k)) motsEntiers.set(k, new Set());
    motsEntiers.get(k).add(cleMot);
    if (!entiersParVerset.has(cleVerset)) entiersParVerset.set(cleVerset, new Set());
    entiersParVerset.get(cleVerset).add(k);
  }

  return { motsParRacine, motsParLemme, motsParForme, motsEntiers, racinesParVerset,
           lemmesParVerset, formesParVerset, entiersParVerset, tousLesMots, tailleVerset };
}

/* ============================================================ vocab.ts ==== */

function lireVocabulaire(source) {
  const mots = [];
  const champ = (ligne, nom) => ligne.match(new RegExp(`${nom}: "([^"]+)"`))?.[1] ?? null;

  source.split("\n").forEach((ligne, i) => {
    if (!/^\s*\{ id: "/.test(ligne)) return;
    const exemple = ligne.match(/exemple: \[(\d+), (\d+)\]/);
    mots.push({
      id: champ(ligne, "id"),
      arabe: champ(ligne, "arabe"),
      translit: champ(ligne, "translit"),
      racine: champ(ligne, "racine"),
      frequence: Number(ligne.match(/frequence: (\d+)/)?.[1] ?? 0),
      sourate: Number(exemple?.[1] ?? 0),
      verset: Number(exemple?.[2] ?? 0),
      ligne: i + 1,
    });
  });
  return mots;
}

/* ================================================================= main === */

const texteCorpus = await chargerCorpus();
const corpus = analyserCorpus(texteCorpus);
const sourceVocab = await readFile(FICHIER_VOCAB, "utf8");
const mots = lireVocabulaire(sourceVocab);

console.log(
  `\n${mots.length} mots analysés · corpus : ${corpus.tousLesMots.size} mots, ` +
    `${corpus.motsParRacine.size} racines, ${corpus.motsParLemme.size} lemmes.\n`
);

const introuvables = [];
const exemplesDouteux = [];
const ecarts = [];
const correctifs = new Map();
const motsCouverts = new Set();

for (const mot of mots) {
  // Un mot pourvu d'une racine est compté sur sa racine (toutes formes dérivées),
  // les autres — particules, pronoms, noms propres — sur leur lemme.
  const parRacine = mot.racine ? corpus.motsParRacine.get(cle(mot.racine)) : null;
  const parLemme = corpus.motsParLemme.get(cle(mot.arabe));
  const parForme = corpus.motsParForme.get(cle(mot.arabe));
  const parEntier = corpus.motsEntiers.get(cle(mot.arabe));
  const trouve = parRacine ?? parLemme ?? parForme ?? parEntier;
  const via = parRacine ? "racine" : parLemme ? "lemme" : parForme ? "forme" : "mot entier";

  if (!trouve) {
    introuvables.push(mot);
    continue;
  }

  trouve.forEach((k) => motsCouverts.add(k));
  const reelle = trouve.size;
  correctifs.set(mot.id, reelle);

  if (Math.abs(reelle - mot.frequence) / Math.max(reelle, 1) > 0.35) {
    ecarts.push({ ...mot, reelle, via });
  }

  // Un même mot peut être découpé différemment d'un verset à l'autre : on
  // le cherche via les quatre index avant de le déclarer absent.
  const cleVerset = `${mot.sourate}:${mot.verset}`;
  const cleRacine = mot.racine ? cle(mot.racine) : null;
  const cleMot = cle(mot.arabe);
  const present =
    (cleRacine && corpus.racinesParVerset.get(cleVerset)?.has(cleRacine)) ||
    corpus.lemmesParVerset.get(cleVerset)?.has(cleMot) ||
    corpus.formesParVerset.get(cleVerset)?.has(cleMot) ||
    corpus.entiersParVerset.get(cleVerset)?.has(cleMot);

  if (!present) {
    // On propose le verset le plus court qui contient le mot : plus lisible pour un débutant.
    const candidats = [...trouve]
      .map((k) => k.split(":").slice(0, 2).join(":"))
      .filter((v, i, t) => t.indexOf(v) === i)
      .sort((a, b) => (corpus.tailleVerset.get(a) - corpus.tailleVerset.get(b)) ||
                      (Number(a.split(":")[0]) - Number(b.split(":")[0])));
    exemplesDouteux.push({ ...mot, via, propose: candidats[0] ?? "?" });
  }
}

const section = (titre, lignes) => {
  console.log(`\n=== ${titre} (${lignes.length}) ===`);
  if (!lignes.length) console.log("  rien à signaler");
  else lignes.forEach((l) => console.log("  " + l));
};

section(
  "Mots introuvables dans le corpus — racine ou graphie à corriger",
  introuvables.map((m) => `l.${m.ligne} ${m.id} (${m.translit}) ${m.arabe} racine "${m.racine ?? "—"}"`)
);

section(
  "Versets d'exemple ne contenant pas le mot — à revoir",
  exemplesDouteux.map((m) =>
    `l.${m.ligne} ${m.id} (${m.translit}) → ${m.sourate}:${m.verset} absent ` +
    `[${m.via}] — proposition : ${m.propose}`)
);

section(
  "Écarts de fréquence supérieurs à 35 %",
  ecarts
    .sort((a, b) => b.reelle - a.reelle)
    .map((m) => `${m.id.padEnd(18)} estimé ${String(m.frequence).padStart(5)} → réel ${String(m.reelle).padStart(5)}  [${m.via}]`)
);

/* ------------------------------------------------- écriture des correctifs */

if (ECRIRE) {
  let sortie = sourceVocab;
  let n = 0;
  for (const [id, reelle] of correctifs) {
    const avant = sortie;
    sortie = sortie.replace(
      new RegExp(`(\\{ id: "${id}",[^\\n]*?frequence: )\\d+`),
      `$1${reelle}`
    );
    if (sortie !== avant) n++;
  }
  await writeFile(FICHIER_VOCAB, sortie, "utf8");
  console.log(`\n${n} fréquences réécrites dans data/vocabulaire.ts`);
} else {
  console.log("\n(relance avec --ecrire pour appliquer les fréquences réelles)");
}

/* --------------------------------------------------------- couverture ---- */

const couverture = (motsCouverts.size / corpus.tousLesMots.size) * 100;
console.log(
  `\nCouverture : ces ${correctifs.size} entrées correspondent à ${motsCouverts.size} mots ` +
    `du Coran sur ${corpus.tousLesMots.size}, soit ${couverture.toFixed(1)} % du texte.\n`
);
