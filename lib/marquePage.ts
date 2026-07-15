export interface MarquePage {
  s: number; // sourate
  v: number; // verset
  t?: number; // date de pose (ms) — absent sur les anciens marque-pages
}

const CLE = "coran-marque-page";

export function lireMarquePage(): MarquePage | null {
  try {
    const brut = localStorage.getItem(CLE);
    if (!brut) return null;
    const m = JSON.parse(brut);
    if (typeof m.s === "number" && typeof m.v === "number") return m;
  } catch {}
  return null;
}

export function ecrireMarquePage(m: MarquePage | null) {
  try {
    if (m) localStorage.setItem(CLE, JSON.stringify({ ...m, t: Date.now() }));
    else localStorage.removeItem(CLE);
  } catch {}
}

/** « à l'instant », « il y a 25 min », « il y a 3 h », « il y a 2 jours ». */
export function depuis(t: number): string {
  const min = Math.floor((Date.now() - t) / 60_000);
  if (min < 1) return "à l'instant";
  if (min < 60) return `il y a ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `il y a ${h} h`;
  const j = Math.floor(h / 24);
  return j === 1 ? "hier" : `il y a ${j} jours`;
}
