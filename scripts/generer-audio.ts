/* Génère les mp3 des leçons Nourania (public/audio/nourania/) et des mots
 * de vocabulaire (public/audio/vocabulaire/<id>.mp3) avec une voix arabe
 * neuronale (Microsoft Edge TTS, gratuite).
 *
 * Prérequis (une seule fois) :  pip3 install edge-tts
 * Lancer :                      npm run audio
 * (edge-tts est appelé via « python3 -m edge_tts » : pas besoin qu'il soit
 * dans le PATH. Pour un autre python : PYTHON=python3.12 npm run audio)
 * Les fichiers déjà présents sont ignorés (relancer = compléter).
 * Voix : ar-SA-HamedNeural (homme, posé). Autres : ar-EG-ShakirNeural,
 * ar-SA-ZariyahNeural (femme). Passer la voix en argument pour changer.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { listeAudioNourania } from "../data/nourania";
import { TOUS_LES_MOTS } from "../data/vocabulaire";

const VOIX = process.argv[2] ?? "ar-SA-HamedNeural";
const PYTHON = process.env.PYTHON ?? "python3";

// Vérification préalable : edge-tts est-il installé pour ce python ?
try {
  execFileSync(PYTHON, ["-m", "edge_tts", "--version"], { stdio: "pipe" });
} catch {
  console.error(
    `edge-tts introuvable pour « ${PYTHON} ». Installe-le avec :\n  ${PYTHON} -m pip install edge-tts\n(ou indique le bon python : PYTHON=python3.12 npm run audio)`
  );
  process.exit(1);
}
const RACINE = join(process.cwd(), "public", "audio");

const liste = [
  ...listeAudioNourania().map((x) => ({ ...x, dossier: "nourania" })),
  ...TOUS_LES_MOTS.map((m) => ({ cle: m.id, texte: m.arabe, dossier: "vocabulaire" })),
];
let faits = 0;
let sautes = 0;
let erreurs = 0;

for (const { cle, texte, dossier } of liste) {
  mkdirSync(join(RACINE, dossier), { recursive: true });
  const fichier = join(RACINE, dossier, `${cle}.mp3`);
  if (existsSync(fichier) && statSync(fichier).size > 1000) {
    sautes++;
    continue;
  }
  // Les virgules arabes deviennent des pauses ; débit ralenti pour l'apprentissage
  const lu = texte.replace(/،/g, "، ");
  try {
    execFileSync(
      PYTHON,
      ["-m", "edge_tts", "--voice", VOIX, "--rate=-20%", "--text", lu, "--write-media", fichier],
      { stdio: ["ignore", "ignore", "pipe"] }
    );
    faits++;
    console.log(`✓ ${dossier}/${cle}  ${texte}`);
  } catch (e) {
    erreurs++;
    const detail = String((e as { stderr?: Buffer }).stderr ?? "").trim().split("\n").pop();
    console.error(`✗ ${cle} — échec${detail ? ` : ${detail}` : ""}`);
    if (erreurs >= 5 && faits === 0) {
      console.error("\nTout échoue : problème d'installation ou de réseau, on s'arrête.");
      break;
    }
  }
}

console.log(
  `\n${faits} générés, ${sautes} déjà présents, ${erreurs} erreurs — ${liste.length} au total.`
);
if (erreurs) process.exit(1);
