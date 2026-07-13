"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SOURATES } from "@/data/sourates";
import { usePrefs } from "@/lib/prefs";
import { lireMarquePage, type MarquePage } from "@/lib/marquePage";
import Entete from "@/components/Entete";

function normaliser(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    // supprime les accents (â, é, û…)
    .replace(/[\u0300-\u036f]/g, "");
}

export default function Accueil() {
  const { prefs } = usePrefs();
  const [recherche, setRecherche] = useState("");
  const [marque, setMarque] = useState<MarquePage | null>(null);

  useEffect(() => {
    setMarque(lireMarquePage());
  }, []);

  const sourateMarquee = marque
    ? SOURATES.find((s) => s.n === marque.s)
    : null;

  const q = normaliser(recherche.trim());
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

      {/* Accroche */}
      <section className="mt-6 text-center">
        <h2 className="text-2xl font-extrabold">
          Assalâmu alaykum 👋
        </h2>
        <p className="mt-1" style={{ color: "var(--muted)" }}>
          Que veux-tu lire aujourd&apos;hui ?
        </p>
      </section>

      {/* Reprendre la lecture (marque-page) */}
      {marque && sourateMarquee && (
        <Link
          href={`/sourate/${marque.s}#v-${marque.v}`}
          className="card mt-5 flex items-center gap-3 rounded-2xl p-4 shadow-soft transition hover:scale-[1.02] active:scale-[0.98]"
          style={{ borderColor: "var(--accent)" }}
        >
          <span className="text-2xl">🔖</span>
          <span className="min-w-0 flex-1">
            <span className="block font-bold">Reprendre la lecture</span>
            <span className="block text-sm" style={{ color: "var(--muted)" }}>
              {sourateMarquee.nom} — verset {marque.v}
            </span>
          </span>
          <span style={{ color: "var(--accent)" }}>→</span>
        </Link>
      )}

      {/* Recherche */}
      <div className="card mt-5 flex items-center gap-2 rounded-2xl px-4 py-3 shadow-soft">
        <span>🔍</span>
        <input
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          placeholder="Chercher une sourate (nom ou numéro)…"
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

      {/* Liste des sourates */}
      <main className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {resultats.map((s) => {
          const contenu = (
            <>
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-extrabold"
                style={{
                  borderColor: "var(--accent)",
                  color: "var(--accent)",
                }}
              >
                {s.n}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-bold">{s.nom}</span>
                <span
                  className="block text-xs"
                  style={{ color: "var(--muted)" }}
                >
                  {s.versets} versets
                </span>
              </span>
              <span
                className={`arabic shrink-0 text-2xl ${prefs.police}`}
                dir="rtl"
              >
                {s.arabe}
              </span>
            </>
          );

          return s.disponible ? (
            <Link
              key={s.n}
              href={`/sourate/${s.n}`}
              className="card flex items-center gap-3 rounded-2xl p-4 shadow-soft transition hover:scale-[1.02] active:scale-[0.98]"
              style={{ borderColor: "var(--accent)" }}
            >
              {contenu}
            </Link>
          ) : (
            <div
              key={s.n}
              className="card relative flex items-center gap-3 rounded-2xl p-4 opacity-60"
            >
              {contenu}
              <span
                className="absolute -top-2 right-3 rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                style={{ backgroundColor: "var(--muted)" }}
              >
                Bientôt
              </span>
            </div>
          );
        })}
        {resultats.length === 0 && (
          <p
            className="col-span-full py-10 text-center"
            style={{ color: "var(--muted)" }}
          >
            Aucune sourate trouvée pour « {recherche} »
          </p>
        )}
      </main>

      <p className="mt-8 text-center text-xs" style={{ color: "var(--muted)" }}>
        ✨ Personnalise ton appli (thème, couleurs, police) — tes réglages
        restent sur ton appareil.
      </p>
    </div>
  );
}
