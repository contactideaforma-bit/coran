"use client";

/* Verset cité par l'assistant IA : chargé depuis le texte coranique de l'appli
   (API Quran.com via lib/coran.ts) pour afficher l'arabe et la traduction réels
   plutôt qu'un texte reformulé par le modèle. */

import { useEffect, useState } from "react";
import Link from "next/link";
import { chargerSourate } from "@/lib/coran";
import { nomSourate } from "@/data/fil";
import { usePrefs } from "@/lib/prefs";

export default function VersetCite({ s, v, pourquoi }: { s: number; v: number; pourquoi?: string }) {
  const { prefs } = usePrefs();
  const [texte, setTexte] = useState<{ arabe: string; fr: string } | null | undefined>(undefined);

  useEffect(() => {
    let annule = false;
    chargerSourate(s)
      .then((d) => {
        if (annule) return;
        const verset = d.verses.find((x) => x.n === v);
        setTexte(
          verset
            ? {
                arabe: verset.words.map((w) => w.segments.map((x) => x.t).join("")).join(" "),
                fr: verset.traduction,
              }
            : null
        );
      })
      .catch(() => !annule && setTexte(null));
    return () => {
      annule = true;
    };
  }, [s, v]);

  return (
    <div
      className="rounded-2xl border p-3"
      style={{ borderColor: "color-mix(in srgb, var(--accent) 30%, var(--border))", background: "var(--card)" }}
    >
      <div className="flex items-center justify-between gap-2 text-xs font-bold" style={{ color: "var(--accent-fort)" }}>
        <span>
          {nomSourate(s)} — {s}:{v}
        </span>
        <Link href={`/sourate/${s}`} className="underline">
          Lire la sourate
        </Link>
      </div>
      {texte === undefined && (
        <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
          Chargement du verset…
        </p>
      )}
      {texte === null && (
        <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
          Verset introuvable : vérifie la référence dans la sourate.
        </p>
      )}
      {texte && (
        <>
          <p className={`arabic mt-2 text-right text-xl leading-loose ${prefs.police}`} dir="rtl" lang="ar">
            {texte.arabe}
          </p>
          <p className="mt-1 text-sm leading-relaxed">{texte.fr}</p>
        </>
      )}
      {pourquoi && (
        <p className="mt-2 text-xs italic" style={{ color: "var(--muted)" }}>
          {pourquoi}
        </p>
      )}
    </div>
  );
}
