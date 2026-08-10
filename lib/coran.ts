import type { TajwidRuleId } from "@/lib/tajwid";

/* ===== Types du texte coranique ===== */

export interface Segment {
  t: string; // texte arabe
  r?: TajwidRuleId; // règle tajwid (couleur)
}

export interface Word {
  segments: Segment[];
  /** Numéro du fichier audio mot à mot (les signes de pause ۖ ۗ ۞ comptent
   *  dans la numérotation officielle, d'où ce champ dédié). */
  audio: number;
}

export interface Verse {
  n: number;
  words: Word[];
  traduction: string;
}

export interface SourateData {
  verses: Verse[];
}

/* ===== Correspondance classes Quran.com → nos règles =====
 * Source du balisage : API Quran.com v4, texte "uthmani_tajweed"
 * (le même balisage que les mushafs tajwid imprimés).
 */
const CLASSE_VERS_REGLE: Record<string, TajwidRuleId | undefined> = {
  ghunnah: "ghunna",
  madda_normal: "madd2",
  madda_permissible: "madd46",
  madda_obligatory: "madd46",
  madda_necessary: "madd6",
  qalaqah: "qalqala",
  ikhafa: "ikhfa",
  ikhafa_shafawi: "ikhfa",
  idgham_ghunnah: "idgham",
  idgham_wo_ghunnah: "idgham",
  idgham_shafawi: "idgham",
  idgham_mutajanisayn: "idgham",
  idgham_mutaqaribayn: "idgham",
  iqlab: "iqlab",
  laam_shamsiyah: "lam-shamsiyya",
  ham_wasl: "muet",
  slnt: "muet",
};

/* ===== Parseur du balisage tajwid ===== */

function parserTajweed(html: string): Segment[] {
  // Signes de pause (ۖ ۗ ۚ…) : Quran.com les rattache au mot par un
  // liant sans largeur (ZWNJ), si bien qu'ils s'empilent sur la voyelle
  // de la dernière lettre (ex. la damma de وَٱلْحِجَارَةُ‌ۖ). On les pose
  // sur une espace insécable : le signe retrouve sa place « après le
  // mot », comme dans les mushafs imprimés, tout en restant dans le
  // même mot (numérotation audio inchangée).
  html = html
    .replace(/\u200C(?=[\u06D6-\u06DC])/g, "\u00A0")
    .replace(/([\u064B-\u0652\u0670])([\u06D6-\u06DC])/g, "$1\u00A0$2");

  const segments: Segment[] = [];
  const re =
    /<tajweed class="?([\w-]+)"?>([\s\S]*?)<\/tajweed>|<span class="?end"?>[\s\S]*?<\/span>|([^<]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    if (m[1] !== undefined) {
      segments.push({ t: m[2], r: CLASSE_VERS_REGLE[m[1]] });
    } else if (m[3] !== undefined) {
      segments.push({ t: m[3] });
    }
    // <span class=end>…</span> (numéro de fin de verset) : ignoré,
    // on affiche notre propre pastille de numéro.
  }
  return segments;
}

/* ===== Recollage des signes et liaison des lettres =====
 *
 * Le balisage tajwid de Quran.com ne coupe PAS aux frontières de lettres :
 * il coupe au milieu des groupes « lettre + signes ». Exemples réels :
 *   50:21   س<tajweed>َا</tajweed>ٓئِ…   le segment coloré COMMENCE par la fatha
 *   50:21   …<tajweed>د</tajweed>ٌ       le tanwin est SEUL dans son segment
 *   2:24    <tajweed>ل</tajweed>َّمْ     la shadda est dans le segment suivant
 *
 * Chaque segment devenant un <span> de couleur différente, un signe placé
 * en tête de segment se retrouve dans une autre boîte que sa lettre
 * porteuse : il s'affiche détaché, décalé, ou flottant tout seul.
 *
 * Correction en deux temps :
 *   1) recollerSignes : tout signe en tête de segment repart sur la lettre
 *      qui le porte, dans le segment précédent. Un segment ne commence donc
 *      plus jamais par un signe, et les segments réduits à un signe seul
 *      disparaissent. La couleur suit la lettre, comme dans les mushafs.
 *   2) lierSegments : les frontières restantes tombent alors entre deux
 *      vraies lettres. On y pose un liant invisible (ZWJ, U+200D) de part
 *      et d'autre, car beaucoup de navigateurs (Safari iOS en tête) ne
 *      relient pas les lettres arabes à travers une frontière d'élément :
 *      sans lui, نَفْ|سٍ s'affiche « نَفْ سٍ », le mot coupé en deux.
 *
 * L'ordre compte : lier AVANT de recoller remettrait un ZWJ entre une
 * lettre et sa voyelle — c'est le défaut d'affichage corrigé ici. */

const ZWJ = "‍";

/** Signes indissociables de leur lettre porteuse : harakât, shadda,
 *  soukoun, alif suscrit, petits signes coraniques.
 *  Volontairement EXCLUS : les signes de pause ۖ ۗ ۘ ۙ ۚ ۛ (U+06D6-06DC),
 *  le ۝ (U+06DD), le ۞ (U+06DE) et le ۩ (U+06E9) — ce sont des symboles
 *  autonomes posés après le mot, pas des marques de voyelle. */
const SIGNE_COLLE =
  /[\u064B-\u065F\u0670\u06DF-\u06E8\u06EA-\u06ED\u08D3-\u08FF]/;

/** Signes de pause : posés après le mot, jamais collés à la lettre. */
const SIGNE_PAUSE = /[\u06D6-\u06DC]/;

/** Vraies lettres arabes — à l'exclusion des chiffres, des signes de pause
 *  et des symboles ۝ ۞ ۩ qui vivent dans le même bloc Unicode. */
const LETTRE =
  /[\u0621-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06EE\u06EF\u06FA-\u06FF]/;

// Lettres qui ne se lient jamais à la lettre suivante (à leur gauche).
const SANS_LIAISON_GAUCHE = new Set([
  "ا", "أ", "إ", "آ", "ٱ", "د", "ذ", "ر", "ز", "و", "ؤ", "ة", "ء",
]);

/** Dernier caractère porteur d'un texte : on remonte par-dessus les signes,
 *  transparents pour la liaison arabe. */
const derniereLettre = (t: string) => {
  for (let i = t.length - 1; i >= 0; i--) {
    if (!SIGNE_COLLE.test(t[i])) return t[i];
  }
  return "";
};

/** Ramène sur leur lettre porteuse les signes orphelins en tête de segment. */
function recollerSignes(segments: Segment[]): Segment[] {
  const sortie: Segment[] = [];
  for (const s of segments) {
    let t = s.t;
    const prec = sortie[sortie.length - 1];
    if (prec) {
      const fin = prec.t[prec.t.length - 1] ?? "";
      // On ne recolle jamais par-dessus une espace ni par-dessus un signe
      // de pause : ceux-là clôturent déjà le groupe.
      if (!/[\s\u00A0]/.test(fin) && !SIGNE_PAUSE.test(fin)) {
        let i = 0;
        while (i < t.length && SIGNE_COLLE.test(t[i])) i++;
        if (i > 0) {
          prec.t += t.slice(0, i);
          t = t.slice(i);
        }
      }
      // Un signe de pause en tête de segment garde son espace insécable,
      // sinon il s'empile sur la voyelle de la lettre précédente.
      if (t && SIGNE_PAUSE.test(t[0]) && !/[\s\u00A0]/.test(prec.t.slice(-1))) {
        t = "\u00A0" + t;
      }
    }
    if (t) sortie.push({ t, r: s.r });
  }
  return sortie;
}

/** La frontière entre ces deux textes doit-elle recevoir un liant ?
 *  Uniquement entre deux vraies lettres qui se lient. */
const doitLier = (avant: string, apres: string) => {
  const a = derniereLettre(avant);
  const b = apres[0] ?? "";
  return (
    LETTRE.test(a) &&
    LETTRE.test(b) &&
    !SANS_LIAISON_GAUCHE.has(a) &&
    b !== "ء"
  );
};

/** Ajoute les liants invisibles aux frontières des segments d'un mot. */
function lierSegments(segments: Segment[]): Segment[] {
  return segments.map((s, i) => {
    let t = s.t;
    if (i > 0 && doitLier(segments[i - 1].t, s.t)) t = ZWJ + t;
    if (i < segments.length - 1 && doitLier(s.t, segments[i + 1].t))
      t = t + ZWJ;
    return { t, r: s.r };
  });
}

/** Prépare un mot pour l'affichage : signes recollés, puis lettres liées. */
const finaliserMot = (segments: Segment[]): Segment[] =>
  lierSegments(recollerSignes(segments));

/** Découpe les segments en mots (les espaces marquent les frontières,
 *  y compris à l'intérieur d'un segment coloré, ex. ikhfa entre deux mots). */
function segmentsEnMots(segments: Segment[]): Word[] {
  // 1) Découpage en tokens. Seules les espaces ORDINAIRES séparent les
  //    mots : l'espace insécable (U+00A0) porte un signe de pause et
  //    reste dans le mot.
  const tokens: Segment[][] = [];
  let courant: Segment[] = [];
  const fermerToken = () => {
    if (courant.length) tokens.push(courant);
    courant = [];
  };
  for (const s of segments) {
    const parties = s.t.split(/ +/);
    parties.forEach((p, i) => {
      if (i > 0) fermerToken();
      if (p) courant.push({ t: p, r: s.r });
    });
  }
  fermerToken();

  // 2) Les symboles autonomes isolés par une espace (۞ en début de verset,
  //    ۩ en fin) ne sont PAS des mots pour Quran.com : le mot 1 de 2:60 est
  //    « ۞ وَإِذِ » et le dernier mot de 7:206 est « يَسْجُدُونَ ۩ ». Les compter
  //    décalerait d'un cran tous les audios mot à mot du verset. On les
  //    rattache donc au mot voisin, comme le fait le mushaf.
  const mots: Segment[][] = [];
  let prefixe: Segment[] = [];
  for (const tok of tokens) {
    const texte = tok.map((s) => s.t).join("");
    if (!LETTRE.test(texte)) {
      if (mots.length) mots[mots.length - 1].push({ t: "\u00A0" }, ...tok);
      else prefixe.push(...tok, { t: "\u00A0" });
      continue;
    }
    mots.push([...prefixe, ...tok]);
    prefixe = [];
  }
  if (prefixe.length) mots.push(prefixe);

  return mots.map((segs, i) => ({
    segments: finaliserMot(segs),
    audio: i + 1,
  }));
}

/** Retire les balises HTML de la traduction, y compris les appels de notes
 *  de bas de page (<sup>1</sup>) dont le chiffre resterait sinon collé au texte. */
function nettoyerTraduction(texte: string): string {
  return texte
    .replace(/<sup[^>]*>[\s\S]*?<\/sup>/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/* ===== Chargement d'une sourate ===== */

const API = "https://api.quran.com/api/v4";
const TRADUCTION_FR = 31; // Muhammad Hamidullah

const cache = new Map<number, SourateData>();

export async function chargerSourate(n: number): Promise<SourateData> {
  const enCache = cache.get(n);
  if (enCache) return enCache;

  const [texteRes, tradRes] = await Promise.all([
    fetch(`${API}/quran/verses/uthmani_tajweed?chapter_number=${n}`),
    fetch(`${API}/quran/translations/${TRADUCTION_FR}?chapter_number=${n}`),
  ]);
  if (!texteRes.ok || !tradRes.ok) {
    throw new Error("Impossible de charger la sourate");
  }

  const texteJson = await texteRes.json();
  const tradJson = await tradRes.json();

  const verses: Verse[] = texteJson.verses.map(
    (v: { verse_key: string; text_uthmani_tajweed: string }, i: number) => ({
      n: Number(v.verse_key.split(":")[1]),
      words: segmentsEnMots(parserTajweed(v.text_uthmani_tajweed)),
      traduction: nettoyerTraduction(tradJson.translations?.[i]?.text ?? ""),
    })
  );

  const data: SourateData = { verses };
  cache.set(n, data);
  return data;
}

/* ===== Phonétique (translittération latine, verset par verset) =====
 * Ressource 57 de Quran.com. Chargée uniquement quand l'option
 * « phonétique » est activée, puis gardée en cache. */

const PHONETIQUE_ID = 57;
const cachePhonetique = new Map<number, string[]>();

/** Phonétique de chaque verset de la sourate `n` (index 0 = verset 1). */
export async function chargerPhonetique(n: number): Promise<string[]> {
  const enCache = cachePhonetique.get(n);
  if (enCache) return enCache;
  const res = await fetch(
    `${API}/quran/translations/${PHONETIQUE_ID}?chapter_number=${n}`
  );
  if (!res.ok) throw new Error("Phonétique indisponible");
  const json = await res.json();
  const liste: string[] = (json.translations ?? []).map(
    (t: { text?: string }) => nettoyerTraduction(t.text ?? "")
  );
  cachePhonetique.set(n, liste);
  return liste;
}

export const BASMALA = "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ";

/* ===== Traduction française mot à mot =====
 * Source : QuranWBW (Dr. Usama Nonnenmacher), fichier statique couvrant
 * tout le Coran, structure { sourate: { verset: [[mots…]] } }.
 */
const MOTS_FR_URL =
  "https://static.quranwbw.com/data/v4/words-data/translations/11.json?version=1";

type MotsFr = Record<string, Record<string, string[][]>>;

let motsFrData: MotsFr | null = null;
let motsFrPromesse: Promise<MotsFr> | null = null;

export async function chargerMotsFr(): Promise<MotsFr> {
  if (motsFrData) return motsFrData;
  if (!motsFrPromesse) {
    motsFrPromesse = fetch(MOTS_FR_URL)
      .then((r) => {
        if (!r.ok) throw new Error("mots-fr indisponibles");
        return r.json();
      })
      .then((d: MotsFr) => {
        motsFrData = d;
        return d;
      })
      .catch((e) => {
        motsFrPromesse = null;
        throw e;
      });
  }
  return motsFrPromesse;
}

/** Traduction française du mot `w` (index d'affichage, base 0). */
export function motFr(sourate: number, verset: number, w: number): string | null {
  return motsFrData?.[String(sourate)]?.[String(verset)]?.[0]?.[w] ?? null;
}
