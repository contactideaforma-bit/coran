"use client";

import Link from "next/link";
import { CATEGORIES_INVOCATIONS } from "@/data/invocations";
import { usePrefs } from "@/lib/prefs";
import Entete from "@/components/Entete";
import { Ampoule, Coeur, ICONES_CATEGORIES } from "@/components/Icones";

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

      <main className="mt-5 space-y-6">
        {CATEGORIES_INVOCATIONS.map((cat) => {
          const Icone = ICONES_CATEGORIES[cat.icone] ?? Coeur;
          return (
            <section key={cat.id}>
              <h3 className="mb-2 flex items-center gap-2 text-lg font-extrabold">
                <span style={{ color: "var(--accent)" }}>
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
                        style={{ color: "var(--accent)" }}
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
