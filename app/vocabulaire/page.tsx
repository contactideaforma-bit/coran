"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PACKS } from "@/data/vocabulaire";
import {
  lireProgression,
  statsGlobales,
  statsPack,
  type Progression,
} from "@/lib/vocabulaire";
import Entete from "@/components/Entete";
import { Cube, Etincelles, Repeter, Trophee, Verifie } from "@/components/Icones";

export default function Vocabulaire() {
  const [progression, setProgression] = useState<Progression | null>(null);

  useEffect(() => {
    setProgression(lireProgression());
  }, []);

  // Tant que le localStorage n'est pas lu, on affiche une progression vide :
  // le rendu serveur et le premier rendu client restent identiques.
  const p = progression ?? {};
  const global = statsGlobales(p);

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-4">
      <Entete />

      <section className="mt-8 text-center">
        <h1 className="text-2xl font-extrabold">Vocabulaire du Coran</h1>
        <p className="mx-auto mt-2 max-w-md text-sm" style={{ color: "var(--muted)" }}>
          Les mots les plus fréquents du Coran, par thèmes. Mémorise-les et le
          texte s'éclaire de lui-même.
        </p>
      </section>

      {/* Compteur de couverture */}
      <div className="card mt-6 rounded-3xl p-6 shadow-soft">
        <p className="flex items-center gap-1.5 text-sm font-bold" style={{ color: "var(--accent)" }}>
          <Trophee taille={16} /> Ta progression
        </p>

        <p className="mt-3 text-4xl font-extrabold">
          {global.couverture.toFixed(1)} %
          <span className="ml-2 text-base font-bold" style={{ color: "var(--muted)" }}>
            du Coran
          </span>
        </p>

        <div
          className="mt-3 h-2.5 w-full overflow-hidden rounded-full"
          style={{ background: "var(--border)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(global.couverture, 100)}%`,
              background: "var(--accent)",
            }}
          />
        </div>

        <p className="mt-3 text-sm" style={{ color: "var(--muted)" }}>
          {global.memorises} mot{global.memorises > 1 ? "s" : ""} mémorisé
          {global.memorises > 1 ? "s" : ""} sur {global.total}
          {global.couverture > 0 && " — chaque mot appris en fait reconnaître des dizaines"}
        </p>
      </div>

      {/* Révision libre */}
      {global.dus > 0 && (
        <Link
          href="/vocabulaire/revision"
          className="card mt-4 flex items-center gap-3 rounded-2xl p-4 shadow-soft transition hover:scale-[1.02] active:scale-[0.98]"
          style={{ borderColor: "var(--accent)" }}
        >
          <span style={{ color: "var(--accent)" }}>
            <Repeter taille={24} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-bold">Réviser maintenant</span>
            <span className="block text-sm" style={{ color: "var(--muted)" }}>
              {global.dus} mot{global.dus > 1 ? "s" : ""} à revoir aujourd'hui
            </span>
          </span>
          <span style={{ color: "var(--accent)" }}>→</span>
        </Link>
      )}

      {/* Packs */}
      <main className="mt-6 grid gap-3">
        {PACKS.map((pack) => {
          const s = statsPack(pack, p);
          const fini = s.memorises === s.total;
          const pourcent = (s.memorises / s.total) * 100;

          return (
            <Link
              key={pack.id}
              href={`/vocabulaire/${pack.id}`}
              className="card flex items-center gap-4 rounded-2xl p-5 shadow-soft transition hover:scale-[1.01] active:scale-[0.99]"
            >
              <span className="tuile-icone shrink-0">
                {fini ? <Verifie taille={22} /> : <Cube taille={22} />}
              </span>

              <span className="min-w-0 flex-1">
                <span className="flex items-baseline gap-2">
                  <span className="font-extrabold">{pack.titre}</span>
                  <span className="text-xs" style={{ color: "var(--muted)" }}>
                    {s.total} mots
                  </span>
                </span>

                <span className="mt-0.5 block text-sm" style={{ color: "var(--muted)" }}>
                  {pack.description}
                </span>

                <span
                  className="mt-2 block h-1.5 w-full overflow-hidden rounded-full"
                  style={{ background: "var(--border)" }}
                >
                  <span
                    className="block h-full rounded-full transition-all"
                    style={{ width: `${pourcent}%`, background: "var(--accent)" }}
                  />
                </span>

                <span
                  className="mt-1.5 flex flex-wrap items-center gap-x-3 text-xs"
                  style={{ color: "var(--muted)" }}
                >
                  <span>
                    {s.memorises}/{s.total} mémorisés
                  </span>
                  {s.dus > 0 && (
                    <span style={{ color: "var(--accent)" }}>{s.dus} à revoir</span>
                  )}
                </span>
              </span>

              <span style={{ color: "var(--accent)" }}>→</span>
            </Link>
          );
        })}
      </main>

      <p
        className="mt-8 flex items-center justify-center gap-1.5 text-center text-xs"
        style={{ color: "var(--muted)" }}
      >
        <Etincelles taille={14} /> Ta progression reste sur ton appareil.
      </p>
    </div>
  );
}
