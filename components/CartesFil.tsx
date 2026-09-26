"use client";

/* Contenu d'une carte du Scroll halal : extrait du Coran (récité verset par
   verset, texte synchronisé) ou texte (hadith, invocation). */

import { useEffect, useState } from "react";
import type { Carte } from "@/data/fil";
import { nomSourate } from "@/data/fil";
import { chargerPhonetique, chargerSourate } from "@/lib/coran";
import { urlVerset } from "@/lib/audio";
import { usePrefs } from "@/lib/prefs";

interface VersetFil {
  n: number;
  arabe: string;
  fr: string;
  phon: string;
}

const tailleArabe = (t: string) =>
  t.length > 260 ? "text-xl" : t.length > 140 ? "text-2xl" : t.length > 60 ? "text-3xl" : "text-4xl";

export function CarteCoran({
  carte,
  proche,
  actif,
  lecture,
  audio,
}: {
  carte: Extract<Carte, { type: "coran" }>;
  proche: boolean; // charger les données à l'avance
  actif: boolean; // carte visible
  lecture: boolean; // démarré et pas en pause
  audio: HTMLAudioElement | null;
}) {
  const { prefs } = usePrefs();
  const [versets, setVersets] = useState<VersetFil[] | null>(null);
  const [erreur, setErreur] = useState(false);
  const [pos, setPos] = useState({ i: 0, tour: 0 });

  useEffect(() => {
    if (!proche || versets) return;
    let annule = false;
    Promise.all([chargerSourate(carte.s), chargerPhonetique(carte.s).catch(() => [] as string[])])
      .then(([d, phon]) => {
        if (annule) return;
        setVersets(
          d.verses
            .filter((v) => v.n >= carte.de && v.n <= carte.a)
            .map((v) => ({
              n: v.n,
              arabe: v.words.map((w) => w.segments.map((s) => s.t).join("")).join(" "),
              fr: v.traduction,
              phon: phon[v.n - 1] ?? "",
            }))
        );
      })
      .catch(() => !annule && setErreur(true));
    return () => {
      annule = true;
    };
  }, [proche, versets, carte.s, carte.de, carte.a]);

  // Revenir au premier verset quand la carte sort de l'écran
  useEffect(() => {
    if (!actif) setPos({ i: 0, tour: 0 });
  }, [actif]);

  // Lecture enchaînée des versets, en boucle
  useEffect(() => {
    if (!audio || !actif || !lecture || !versets?.length) return;
    let annule = false;
    const v = versets[pos.i];
    const suivant = (delai: number) =>
      window.setTimeout(() => {
        if (annule) return;
        setPos((p) =>
          p.i < versets.length - 1 ? { i: p.i + 1, tour: p.tour } : { i: 0, tour: p.tour + 1 }
        );
      }, delai);
    let minuterie = 0;
    audio.onended = () => {
      minuterie = suivant(pos.i === versets.length - 1 ? 1800 : 250);
    };
    // Sans réseau : on laisse le temps de lire puis on passe au verset suivant
    audio.onerror = () => {
      minuterie = suivant(4000 + v.arabe.length * 40);
    };
    audio.src = urlVerset(carte.s, v.n, prefs.recitateur);
    audio.play().catch(() => {});
    return () => {
      annule = true;
      clearTimeout(minuterie);
      audio.onended = null;
      audio.onerror = null;
      audio.pause();
    };
  }, [audio, actif, lecture, versets, pos, carte.s, prefs.recitateur]);

  const v = versets?.[pos.i];

  return (
    <div className="verre w-full rounded-3xl p-5 shadow-soft">
      <p className="text-xs font-extrabold uppercase tracking-wide" style={{ color: "var(--accent-fort)" }}>
        Coran · {nomSourate(carte.s)} {carte.s}:{carte.de}
        {carte.a > carte.de ? `-${carte.a}` : ""}
      </p>
      <p className="mt-0.5 text-sm font-bold">{carte.theme}</p>

      {erreur && (
        <p className="mt-4 text-sm" style={{ color: "var(--muted)" }}>
          Texte indisponible hors connexion.
        </p>
      )}
      {!versets && !erreur && (
        <p className="mt-4 text-sm" style={{ color: "var(--muted)" }}>
          Chargement…
        </p>
      )}
      {v && (
        <div key={`${v.n}-${pos.tour}`} className="pop mt-4">
          <p className={`arabic ${tailleArabe(v.arabe)} leading-loose ${prefs.police}`} dir="rtl">
            {v.arabe} <span className="text-base" style={{ color: "var(--accent-fort)" }}>﴿{v.n}﴾</span>
          </p>
          {v.phon && (
            <p className="mt-2 text-sm italic" style={{ color: "var(--accent-fort)" }}>
              {v.phon}
            </p>
          )}
          <p className="mt-2 text-sm leading-relaxed">{v.fr}</p>
        </div>
      )}
      {versets && versets.length > 1 && (
        <div className="mt-4 flex justify-center gap-1.5">
          {versets.map((x, i) => (
            <span
              key={x.n}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: i === pos.i ? 18 : 6,
                background: i <= pos.i ? "var(--accent-fort)" : "var(--border)",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CarteTexte({ carte }: { carte: Exclude<Carte, { type: "coran" }> }) {
  const { prefs } = usePrefs();
  if (carte.type === "hadith") {
    return (
      <div className="verre w-full rounded-3xl p-6 shadow-soft">
        <p className="text-xs font-extrabold uppercase tracking-wide" style={{ color: "var(--accent-fort)" }}>
          Hadith
        </p>
        <p className="mt-3 text-xl leading-relaxed" style={{ fontFamily: "Marcellus, serif" }}>
          « {carte.texte} »
        </p>
        <p className="mt-4 text-sm font-bold" style={{ color: "var(--muted)" }}>
          — Rapporté par {carte.source}
        </p>
      </div>
    );
  }
  return (
    <div className="verre w-full rounded-3xl p-5 shadow-soft">
      <p className="text-xs font-extrabold uppercase tracking-wide" style={{ color: "var(--accent-fort)" }}>
        Invocation
      </p>
      <p className="mt-0.5 text-sm font-bold">{carte.titre}</p>
      <p className={`arabic mt-4 ${tailleArabe(carte.arabe)} leading-loose ${prefs.police}`} dir="rtl">
        {carte.arabe}
      </p>
      <p className="mt-2 text-sm italic" style={{ color: "var(--accent-fort)" }}>
        {carte.translit}
      </p>
      <p className="mt-2 text-sm leading-relaxed">{carte.fr}</p>
      <p className="mt-3 text-xs font-bold" style={{ color: "var(--muted)" }}>
        — {carte.source}
      </p>
    </div>
  );
}
