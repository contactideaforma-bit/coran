export interface MarquePage {
  s: number; // sourate
  v: number; // verset
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
    if (m) localStorage.setItem(CLE, JSON.stringify(m));
    else localStorage.removeItem(CLE);
  } catch {}
}
