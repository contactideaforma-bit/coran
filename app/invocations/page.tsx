"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CATEGORIES_INVOCATIONS } from "@/data/invocations";
import { usePrefs } from "@/lib/prefs";
import Entete from "@/components/Entete";
import {
  Ampoule,
  Boussole,
  Coeur,
  ICONES_CATEGORIES,
  KaabaIcone,
  LuneEtoile,
  Recherche,
  Repeter,
} from "@/components/Icones";

const GUIDES = [
  {
    href: "/invocations/nuit",
    icone: LuneEtoile,
    nom: "La prière de la nuit",
    description: "Qiyâm al-layl, witr et dernier tiers de la nuit",
  },
  {
    href: "/invocations/istikhara",
    icone: Boussole,
    nom: "La prière de consultation",
    description: "Istikhâra : quand, comment, et l'invocation complète",
  },
  {
    href: "/invocations/tawba",
    icone: Repeter,
    nom: "Le repentir (tawba)",
    description: "Revenir vers Allah : conditions, prière et formules",
  },
  {
    href: "/omra",
    icone: KaabaIcone,
    nom: "La Omra",
    description: "De la sacralisation à la coupe des cheveux",
  },
];

/** Minuscules sans accents ni signes de translittération, pour la recherche. */
const normaliser = (t: string) =>
  t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ'’ʿʾ-]/g, "");

export default function Invocations() {
  const { prefs } = usePrefs();
  const [q, setQ] = useState("");

  const categories = useMemo(() => {
    const n = normaliser(q.trim());
    if (!n) return CATEGORIES_INVOCATIONS;
    return CATEGORIES_INVOCATIONS.map((c) => ({
      ...c,
      invocations: c.invocations.filter((inv) =>
        normaliser(`${inv.titre} ${inv.fr} ${inv.translit} ${inv.note ?? ""} ${c.nom}`).includes(n)
      ),
    })).filter((c) => c.invocations.length > 0);
  }, [q]);

  const total = CATEGORIES_INVOCATIONS.reduce((s, c) => s + c.invocations.length, 0);
  const trouvees = categories.reduce((s, c) => s + c.invocations.length, 0);

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
          <Coeur taille={22} /> Invocations
        </h2>
      </section>

      <section className="mt-5">
        <h3 className="mb-2 text-lg font-extrabold">Guides pas à pas</h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {GUIDES.map((g) => (
            <Link
              key={g.href}
              href={g.href}
              className="card flex items-center gap-3 rounded-2xl p-4 shadow-soft transition hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="tuile-icone">
                <g.icone taille={22} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-extrabold leading-tight">{g.nom}</span>
                <span className="mt-0.5 block text-xs" style={{ color: "var(--muted)" }}>
                  {g.description}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-7">
        <h3 className="text-lg font-extrabold">La Citadelle du musulman</h3>
        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
          {total} invocations authentiques (Hisn al-Muslim). Touche un titre pour dérouler.
        </p>

        <label className="card mt-3 flex items-center gap-2 rounded-2xl px-4 py-3 shadow-soft">
          <span style={{ color: "var(--accent-fort)" }}>
            <Recherche taille={18} />
          </span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher : pluie, colère, voyage, malade…"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none"
            style={{ color: "var(--text)" }}
          />
          {q && (
            <span className="shrink-0 text-xs font-bold" style={{ color: "var(--muted)" }}>
              {trouvees} résultat{trouvees > 1 ? "s" : ""}
            </span>
          )}
        </label>

        {!q && (
          <nav className="mt-3 flex flex-wrap gap-2" aria-label="Catégories">
            {CATEGORIES_INVOCATIONS.map((c) => (
              <a
                key={c.id}
                href={`#cat-${c.id}`}
                className="rounded-full px-3 py-1.5 text-xs font-bold transition active:scale-95"
                style={{
                  border: "1px solid color-mix(in srgb, var(--accent) 45%, var(--border))",
                  background: "var(--card)",
                }}
              >
                {c.nom}{" "}
                <span style={{ color: "var(--muted)" }}>{c.invocations.length}</span>
              </a>
            ))}
          </nav>
        )}
      </section>

      <main className="mt-6 space-y-6">
        {categories.length === 0 && (
          <p className="text-center text-sm" style={{ color: "var(--muted)" }}>
            Aucune invocation ne correspond à « {q} ».
          </p>
        )}
        {categories.map((cat) => {
          const Icone = ICONES_CATEGORIES[cat.icone] ?? Coeur;
          return (
            <section key={cat.id} id={`cat-${cat.id}`} className="scroll-mt-24">
              <h3 className="mb-2 flex items-center gap-2 text-lg font-extrabold">
                <span style={{ color: "var(--accent-fort)" }}>
                  <Icone taille={20} />
                </span>
                {cat.nom}
              </h3>
              <div className="space-y-2">
                {cat.invocations.map((inv, i) => (
                  <details
                    key={i}
                    open={q.trim().length > 0 && categories.length === 1 && cat.invocations.length === 1}
                    className="card overflow-hidden rounded-2xl shadow-soft"
                  >
                    <summary className="flex cursor-pointer list-none items-center gap-3 p-4">
                      <span className="min-w-0 flex-1 font-bold">{inv.titre}</span>
                      <span className="shrink-0 text-sm" style={{ color: "var(--muted)" }}>
                        ▾
                      </span>
                    </summary>
                    <div
                      className="border-t px-4 pb-4 pt-3"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <p
                        className={`arabic text-2xl leading-loose ${prefs.police}`}
                        dir="rtl"
                      >
                        {inv.arabe}
                      </p>
                      <p
                        className="mt-3 text-sm italic"
                        style={{ color: "var(--accent-fort)" }}
                      >
                        {inv.translit}
                      </p>
                      <p className="mt-2 text-sm">{inv.fr}</p>
                      {inv.note && (
                        <p
                          className="mt-2 flex items-start gap-1.5 text-xs"
                          style={{ color: "var(--muted)" }}
                        >
                          <Ampoule taille={14} className="mt-0.5 shrink-0" />
                          {inv.note}
                        </p>
                      )}
                      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                        <p className="text-xs font-bold" style={{ color: "var(--muted)" }}>
                          — {inv.source}
                        </p>
                        {inv.lien && (
                          <Link
                            href={inv.lien.href}
                            className="text-xs font-bold underline"
                            style={{ color: "var(--accent-fort)" }}
                          >
                            {inv.lien.libelle} →
                          </Link>
                        )}
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}
