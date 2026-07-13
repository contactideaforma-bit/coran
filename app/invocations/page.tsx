"use client";

import Link from "next/link";
import { CATEGORIES_INVOCATIONS } from "@/data/invocations";
import { usePrefs } from "@/lib/prefs";
import Entete from "@/components/Entete";

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
        <h2 className="text-xl font-extrabold">🤲 Invocations</h2>
      </section>

      <p className="mt-4 text-center text-sm" style={{ color: "var(--muted)" }}>
        Invocations authentiques du quotidien (Hisn al-Muslim), avec
        translittération pour bien les prononcer.
      </p>

      <main className="mt-5 space-y-6">
        {CATEGORIES_INVOCATIONS.map((cat) => (
          <section key={cat.id}>
            <h3 className="mb-2 text-lg font-extrabold">
              {cat.emoji} {cat.nom}
            </h3>
            <div className="space-y-3">
              {cat.invocations.map((inv, i) => (
                <article
                  key={i}
                  className="card rounded-2xl p-5 shadow-soft"
                >
                  <p className="font-bold">{inv.titre}</p>
                  <p
                    className={`arabic mt-3 text-2xl leading-loose ${prefs.police}`}
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
                      className="mt-2 text-xs"
                      style={{ color: "var(--muted)" }}
                    >
                      💡 {inv.note}
                    </p>
                  )}
                  <p
                    className="mt-2 text-xs font-bold"
                    style={{ color: "var(--muted)" }}
                  >
                    — {inv.source}
                  </p>
                </article>
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
