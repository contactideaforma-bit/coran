import type { TajwidRuleId } from "@/lib/tajwid";

/* ===== Types du texte coranique ===== */

export interface Segment {
  t: string; // texte arabe
  r?: TajwidRuleId; // règle tajwid (couleur)
}

export interface Word {
  segments: Segment[];
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

/** Découpe les segments en mots (les espaces marquent les frontières,
 *  y compris à l'intérieur d'un segment coloré, ex. ikhfa entre deux mots). */
function segmentsEnMots(segments: Segment[]): Word[] {
  const mots: Word[] = [];
  let courant: Segment[] = [];
  for (const s of segments) {
    const parties = s.t.split(/\s+/);
    parties.forEach((p, i) => {
      if (i > 0 && courant.length) {
        mots.push({ segments: courant });
        courant = [];
      }
      if (p) courant.push({ t: p, r: s.r });
    });
  }
  if (courant.length) mots.push({ segments: courant });
  return mots;
}

/** Retire les balises HTML de la traduction (notes de bas de page, etc.). */
function nettoyerTraduction(texte: string): string {
  return texte.replace(/<[^>]+>/g, "").trim();
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

export const BASMALA = "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ";
