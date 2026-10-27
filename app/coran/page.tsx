"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SOURATES } from "@/data/sourates";
import { JUZ_DEBUTS } from "@/data/juz";
import { usePrefs } from "@/lib/prefs";
import { lireMarquePage, type MarquePage } from "@/lib/marquePage";
import Entete from "@/components/Entete";
import {
  LivreOuvert,
  MarquePageIcone,
  Recherche,
} from "@/components/Icones";

type Mode = "sourates" | "juz";

const CLE_ETAT = "coran-liste-etat";
/** Posé par le Lecteur quand on revient à la liste : on restaure la position */
const CLE_RETOUR = "coran-liste-retour";

/** Étendue de chaque juz' : premier et dernier verset, sourates traversées. */
const JUZ = JUZ_DEBUTS.map((j, i) => {
  const suivant = JUZ_DEBUTS[i + 1];
  const finSourate = suivant ? (suivant.verset === 1 ? suivant.sourate - 1 : suivant.sourate) : 114;
  const finVerset = suivant
    ? suivant.verset === 1
      ? SOURATES[suivant.sourate - 2].versets
      : suivant.verset - 1
    : 6;
  const sourates = SOURATES.filter((s) => s.n >= j.sourate && s.n <= finSourate).map((s) => ({
    ...s,
    versetDebut: s.n === j.sourate ? j.verset : 1,
  }));
  return { juz: j.juz, debut: j, fin: { sourate: finSourate, verset: finVerset }, sourates };
});

function normaliser(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    // supprime les accents (â, é, û…)
    .replace(/[̀-ͯ]/g, "");
}

export default function Coran() {
  const { prefs } = usePrefs();
  const [recherche, setRecherche] = useState("");
  const [mode, setMode] = useState<Mode>("sourates");
  const [marque, setMarque] = useState<MarquePage | null>(null);
  const restaure = useRef(false);

  useEffect(() => {
    setMarque(lireMarquePage());
    // Revenir là où on était (mode, recherche, position) quand on
    // retourne à la liste depuis une sourate
    try {
      // Seulement au retour depuis une sourate (bouton « ← Sourates »)
      const retour = sessionStorage.getItem(CLE_RETOUR) === "1";
      sessionStorage.removeItem(CLE_RETOUR);
      const brut = retour ? sessionStorage.getItem(CLE_ETAT) : null;
      if (brut) {
        const e = JSON.parse(brut) as { mode?: Mode; recherche?: string; y?: number };
        if (e.mode) setMode(e.mode);
        if (e.recherche) setRecherche(e.recherche);
        const y = e.y ?? 0;
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            window.scrollTo({ top: y, behavior: "auto" });
            restaure.current = true;
          })
        );
        return;
      }
    } catch {
      /* rien à restaurer */
    }
    restaure.current = true;
  }, []);

  // Mémoriser l'état de la liste au fil du défilement
  useEffect(() => {
    let attente: number | null = null;
    const sauver = () => {
      if (!restaure.current) return;
      try {
        sessionStorage.setItem(
          CLE_ETAT,
          JSON.stringify({ mode, recherche, y: window.scrollY })
        );
      } catch {
        /* stockage indisponible */
      }
    };
    const surDefilement = () => {
      if (attente !== null) return;
      attente = window.setTimeout(() => {
        attente = null;
        sauver();
      }, 150);
    };
    window.addEventListener("scroll", surDefilement, { passive: true });
    sauver();
    return () => {
      window.removeEventListener("scroll", surDefilement);
      if (attente !== null) window.clearTimeout(attente);
    };
  }, [mode, recherche]);

  const sourateMarquee = marque
    ? SOURATES.find((s) => s.n === marque.s)
    : null;

  const q = normaliser(recherche.trim());
  const numeroJuz = q.match(/^(?:juz'?|j)\s*(\d{1,2})$/)?.[1];
  const juzFiltres = JUZ.filter(
    (j) =>
      q === "" ||
      (numeroJuz ? j.juz === Number(numeroJuz) : false) ||
      String(j.juz) === q ||
      j.sourates.some((s) => normaliser(s.nom).includes(q) || String(s.n) === q)
  );
  const resultats = SOURATES.filter(
    (s) =>
      q === "" ||
      normaliser(s.nom).includes(q) ||
      s.arabe.includes(recherche.trim()) ||
      String(s.n) === q
  );

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-4">
      <Entete />

      <section className="mt-6 flex items-center justify-between gap-3">
        <Link
          href="/"
          className="card rounded-full px-4 py-2 text-sm font-bold shadow-soft transition hover:scale-105 active:scale-95"
        >
          ← Accueil
        </Link>
        <h2 className="flex items-center gap-2 text-xl font-extrabold">
          <LivreOuvert taille={22} /> Le Coran
        </h2>
      </section>

      {/* Reprendre la lecture (marque-page) */}
      {marque && sourateMarquee && (
        <Link
          href={`/sourate/${marque.s}#v-${marque.v}`}
          className="card mt-5 flex items-center gap-3 rounded-2xl p-4 shadow-soft transition hover:scale-[1.02] active:scale-[0.98]"
          style={{ borderColor: "var(--accent)" }}
        >
          <span style={{ color: "var(--accent-fort)" }}>
            <MarquePageIcone taille={24} rempli />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-bold">Reprendre la lecture</span>
            <span className="block text-sm" style={{ color: "var(--muted)" }}>
              {sourateMarquee.nom} — verset {marque.v}
            </span>
          </span>
          <span style={{ color: "var(--accent-fort)" }}>→</span>
        </Link>
      )}

      {/* Parcourir par sourate ou par juz' */}
      <div className="mt-5 flex gap-2">
        {(
          [
            { id: "sourates", nom: "Par sourate" },
            { id: "juz", nom: "Par juz'" },
          ] as const
        ).map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className="flex-1 rounded-full border px-4 py-2 text-sm font-bold transition active:scale-95"
            style={{
              borderColor: mode === m.id ? "var(--accent)" : "var(--border)",
              backgroundColor: mode === m.id ? "var(--accent-fort)" : "var(--card)",
              color: mode === m.id ? "var(--sur-accent)" : "var(--text)",
            }}
          >
            {m.nom}
          </button>
        ))}
      </div>

      {/* Recherche */}
      <div className="card mt-3 flex items-center gap-2 rounded-2xl px-4 py-3 shadow-soft">
        <span style={{ color: "var(--muted)" }}>
          <Recherche taille={18} />
        </span>
        <input
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          placeholder={mode === "juz" ? "Chercher un juz' (numéro) ou une sourate…" : "Chercher une sourate (nom ou numéro)…"}
          aria-label="Chercher une sourate"
          className="w-full bg-transparent outline-none"
          style={{ color: "var(--text)" }}
        />
        {recherche && (
          <button
            onClick={() => setRecherche("")}
            className="font-bold"
            style={{ color: "var(--muted)" }}
            aria-label="Effacer la recherche"
          >
            ✕
          </button>
        )}
      </div>

      {/* Liste des juz' */}
      {mode === "juz" && (
        <main className="mt-5 space-y-3">
          {juzFiltres.map((j) => {
            const premiere = SOURATES[j.debut.sourate - 1];
            const derniere = SOURATES[j.fin.sourate - 1];
            return (
              <section key={j.juz} className="card rounded-2xl p-4 shadow-soft">
                <Link
                  href={`/sourate/${j.debut.sourate}#v-${j.debut.verset}`}
                  className="flex items-center gap-3"
                >
                  <span className="badge-verset">
                    <span className="relative z-10">{j.juz}</span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold">Juz&apos; {j.juz}</span>
                    <span className="block text-xs" style={{ color: "var(--muted)" }}>
                      {premiere.nom} {j.debut.verset} → {derniere.nom} {j.fin.verset}
                    </span>
                  </span>
                  <span style={{ color: "var(--accent-fort)" }}>→</span>
                </Link>
                <div className="mt-3 flex flex-wrap gap-2">
                  {j.sourates.map((s) => (
                    <Link
                      key={s.n}
                      href={`/sourate/${s.n}#v-${s.versetDebut}`}
                      className="rounded-full border px-3 py-1 text-xs font-bold transition active:scale-95"
                      style={{
                        borderColor: "color-mix(in srgb, var(--accent) 40%, var(--border))",
                        background: "color-mix(in srgb, var(--accent) 8%, transparent)",
                        color: "var(--accent-fort)",
                      }}
                    >
                      {s.n}. {s.nom}
                      {s.versetDebut > 1 ? ` (v. ${s.versetDebut})` : ""}
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
          {juzFiltres.length === 0 && (
            <p className="py-10 text-center" style={{ color: "var(--muted)" }}>
              Aucun juz&apos; trouvé pour « {recherche} »
            </p>
          )}
        </main>
      )}

      {/* Liste des sourates */}
      {mode === "sourates" && (
      <main className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {resultats.map((s) => (
          <Link
            key={s.n}
            href={`/sourate/${s.n}`}
            className="card flex items-center gap-3 rounded-2xl p-4 shadow-soft transition hover:scale-[1.02] active:scale-[0.98]"
            style={{ borderColor: "var(--accent)" }}
          >
            <span className="badge-verset">
              <span className="relative z-10">{s.n}</span>
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-bold">{s.nom}</span>
              <span className="block text-xs" style={{ color: "var(--muted)" }}>
                {s.versets} versets
              </span>
            </span>
            <span
              className={`arabic shrink-0 text-2xl ${prefs.police}`}
              dir="rtl"
            >
              {s.arabe}
            </span>
          </Link>
        ))}
        {resultats.length === 0 && (
          <p
            className="col-span-full py-10 text-center"
            style={{ color: "var(--muted)" }}
          >
            Aucune sourate trouvée pour « {recherche} »
          </p>
        )}
      </main>
      )}
    </div>
  );
}
