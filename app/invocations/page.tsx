"use client";

import Link from "next/link";
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
} from "@/components/Icones";

const GUIDES = [
  {
    href: "/invocations/nuit",
    icone: LuneEtoile,
    nom: "La prière de la nuit",
    description: "Qiyâm al-layl : horaire du dernier tiers, étapes et witr",
  },
  {
    href: "/invocations/istikhara",
    icone: Boussole,
    nom: "La prière de consultation",
    description: "Istikhâra : quand, comment, et l'invocation complète",
  },
  {
    href: "/omra",
    icone: KaabaIcone,
    nom: "La Omra",
    description: "De la sacralisation à la coupe des cheveux",
  },
];

export default function Invocations() {
  const { prefs } = usePrefs();

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

      <p className="mt-4 text-center text-sm" style={{ color: "var(--muted)" }}>
        Invocations authentiques du quotidien (Hisn al-Muslim). Touche un titre
        pour dérouler.
      </p>

      <section className="mt-5">
        <h3 className="mb-2 text-lg font-extrabold">Guides pas à pas</h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {GUIDES.map((g) => (
            <Link
              key={g.href}
              href={g.href}
              className="card flex items-center gap-3 rounded-2xl p-4 shadow-soft transition hover:scale-[1.02] active:scale-[0.98] sm:flex-col sm:items-start"
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

      <main className="mt-6 space-y-6">
        {CATEGORIES_INVOCATIONS.map((cat) => {
          const Icone = ICONES_CATEGORIES[cat.icone] ?? Coeur;
          return (
            <section key={cat.id}>
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
                    className="card overflow-hidden rounded-2xl shadow-soft"
                  >
                    <summary className="flex cursor-pointer list-none items-center gap-3 p-4">
                      <span className="min-w-0 flex-1 font-bold">
                        {inv.titre}
                      </span>
                      <span
                        className="shrink-0 text-sm"
                        style={{ color: "var(--muted)" }}
                      >
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
                      <p
                        className="mt-2 text-xs font-bold"
                        style={{ color: "var(--muted)" }}
                      >
                        — {inv.source}
                      </p>
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
