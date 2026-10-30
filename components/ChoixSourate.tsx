"use client";

/* Sélecteur de sourate : un gros bouton qui affiche la sourate en cours,
   et une feuille qui monte du bas avec recherche (nom, numéro, arabe). */

import { useEffect, useMemo, useState } from "react";
import { SOURATES } from "@/data/sourates";
import { usePrefs } from "@/lib/prefs";
import { Recherche } from "@/components/Icones";

function normaliser(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

interface Props {
  valeur: number;
  surChoix: (n: number) => void;
  /** Petit libellé au-dessus du nom (« Sourate à réviser »…) */
  libelle?: string;
}

export default function ChoixSourate({ valeur, surChoix, libelle = "Sourate" }: Props) {
  const { prefs } = usePrefs();
  const [ouvert, setOuvert] = useState(false);
  const [q, setQ] = useState("");
  const meta = SOURATES.find((s) => s.n === valeur) ?? SOURATES[0];

  useEffect(() => {
    if (!ouvert) return;
    const surTouche = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOuvert(false);
    };
    window.addEventListener("keydown", surTouche);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", surTouche);
      document.body.style.overflow = "";
    };
  }, [ouvert]);

  const resultats = useMemo(() => {
    const n = normaliser(q.trim());
    if (!n) return SOURATES;
    return SOURATES.filter(
      (s) => normaliser(s.nom).includes(n) || String(s.n) === n || s.arabe.includes(q.trim())
    );
  }, [q]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOuvert(true)}
        className="card relief flex w-full items-center gap-4 rounded-3xl p-4 text-left transition active:scale-[0.99]"
        aria-haspopup="dialog"
      >
        <span className="badge-verset">
          <span className="relative z-10">{meta.n}</span>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[11px] font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>
            {libelle}
          </span>
          <span className="block text-xl font-extrabold leading-tight">{meta.nom}</span>
          <span className="block text-xs" style={{ color: "var(--muted)" }}>
            {meta.versets} versets • touche pour changer
          </span>
        </span>
        <span className={`arabic shrink-0 text-3xl ${prefs.police}`} dir="rtl" style={{ color: "var(--accent-fort)" }}>
          {meta.arabe}
        </span>
      </button>

      {ouvert && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
          onClick={() => setOuvert(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Choisir une sourate"
        >
          <div
            className="pop flex w-full max-w-2xl flex-col rounded-t-3xl"
            style={{ background: "var(--bg)", maxHeight: "85dvh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 pb-2">
              <div className="mx-auto mb-3 h-1.5 w-12 rounded-full" style={{ background: "var(--border)" }} />
              <label className="card flex items-center gap-2 rounded-2xl px-4 py-3">
                <span style={{ color: "var(--accent-fort)" }}>
                  <Recherche taille={18} />
                </span>
                <input
                  autoFocus
                  type="search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Nom ou numéro de sourate…"
                  className="min-w-0 flex-1 bg-transparent outline-none"
                  style={{ color: "var(--text)" }}
                />
              </label>
            </div>
            <ul className="flex-1 space-y-1.5 overflow-y-auto px-4 pb-6">
              {resultats.map((s) => {
                const actif = s.n === valeur;
                return (
                  <li key={s.n}>
                    <button
                      type="button"
                      onClick={() => {
                        surChoix(s.n);
                        setOuvert(false);
                        setQ("");
                      }}
                      className="card flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition active:scale-[0.99]"
                      style={actif ? { borderColor: "var(--accent)", boxShadow: "0 0 0 2px var(--accent)" } : undefined}
                    >
                      <span className="w-8 text-center text-sm font-extrabold" style={{ color: "var(--accent-fort)" }}>
                        {s.n}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-bold">{s.nom}</span>
                        <span className="block text-xs" style={{ color: "var(--muted)" }}>
                          {s.versets} versets
                        </span>
                      </span>
                      <span className={`arabic shrink-0 text-xl ${prefs.police}`} dir="rtl">
                        {s.arabe}
                      </span>
                    </button>
                  </li>
                );
              })}
              {resultats.length === 0 && (
                <li className="py-8 text-center text-sm" style={{ color: "var(--muted)" }}>
                  Aucune sourate pour « {q} »
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
