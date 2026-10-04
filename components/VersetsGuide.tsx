"use client";

/* Groupe de versets affiché dans un guide pas à pas (ex. roqya) :
   texte arabe + phonétique (si l'option est active) + traduction,
   avec un bouton pour écouter la récitation enchaînée (everyayah,
   récitateur des préférences). Le texte vient de l'API Quran.com
   (cache de lib/coran.ts). */

import { useEffect, useRef, useState } from "react";
import type { VersetsGuide as GroupeVersets } from "@/data/guides";
import { chargerPhonetique, chargerSourate } from "@/lib/coran";
import { nomSourate } from "@/data/fil";
import { urlVerset } from "@/lib/audio";
import { usePrefs } from "@/lib/prefs";
import { Lecture, Pause } from "@/components/Icones";

interface Verset {
  n: number;
  arabe: string;
  fr: string;
  phon: string;
}

export default function VersetsGuide({ groupe }: { groupe: GroupeVersets }) {
  const { prefs } = usePrefs();
  const [versets, setVersets] = useState<Verset[] | null>(null);
  const [erreur, setErreur] = useState(false);
  const [enCours, setEnCours] = useState<number | null>(null); // index du verset joué
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let annule = false;
    Promise.all([
      chargerSourate(groupe.s),
      prefs.phonetique ? chargerPhonetique(groupe.s).catch(() => [] as string[]) : Promise.resolve([] as string[]),
    ])
      .then(([d, phon]) => {
        if (annule) return;
        setVersets(
          d.verses
            .filter((v) => v.n >= groupe.de && v.n <= groupe.a)
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
  }, [groupe.s, groupe.de, groupe.a, prefs.phonetique]);

  // Arrêter l'audio quand le composant disparaît (changement d'étape)
  useEffect(() => () => arreter(), []);

  const arreter = () => {
    const a = audioRef.current;
    if (a) {
      a.onended = null;
      a.onerror = null;
      a.pause();
    }
    setEnCours(null);
  };

  const jouer = (i: number) => {
    if (!versets || i >= versets.length) {
      arreter();
      return;
    }
    if (!audioRef.current) audioRef.current = new Audio();
    const a = audioRef.current;
    a.onended = () => jouer(i + 1);
    a.onerror = () => arreter();
    a.src = urlVerset(groupe.s, versets[i].n, prefs.recitateur);
    setEnCours(i);
    a.play().catch(() => arreter());
  };

  const plage = groupe.a > groupe.de ? `${groupe.de}-${groupe.a}` : `${groupe.de}`;

  return (
    <div className="mt-4 rounded-2xl p-4" style={{ border: "1px solid var(--border)" }}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-extrabold uppercase tracking-wide" style={{ color: "var(--accent-fort)" }}>
            {groupe.titre}
          </p>
          <p className="mt-0.5 text-xs font-bold" style={{ color: "var(--muted)" }}>
            {nomSourate(groupe.s)} · {groupe.s}:{plage}
          </p>
        </div>
        <button
          onClick={() => (enCours === null ? jouer(0) : arreter())}
          disabled={!versets}
          aria-label={enCours === null ? "Écouter la récitation" : "Arrêter"}
          className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-extrabold shadow-soft transition active:scale-95 disabled:opacity-40"
          style={{ background: "var(--accent-fort)", color: "var(--sur-accent)" }}
        >
          {enCours === null ? <Lecture taille={12} /> : <Pause taille={12} />}
          {enCours === null ? "Écouter" : "Stop"}
        </button>
      </div>

      {groupe.note && <p className="mt-2 text-sm leading-relaxed">{groupe.note}</p>}

      {erreur && (
        <p className="mt-3 text-sm" style={{ color: "var(--muted)" }}>
          Texte indisponible hors connexion.
        </p>
      )}
      {!versets && !erreur && (
        <p className="mt-3 text-sm" style={{ color: "var(--muted)" }}>
          Chargement…
        </p>
      )}

      {versets && (
        <div className="mt-3 space-y-4">
          {versets.map((v, i) => (
            <div
              key={v.n}
              className="rounded-xl px-2 py-1 transition"
              style={{
                background: enCours === i ? "color-mix(in srgb, var(--accent) 14%, transparent)" : undefined,
              }}
            >
              <p className={`arabic text-2xl leading-loose ${prefs.police}`} dir="rtl">
                {v.arabe}{" "}
                <span className="text-base" style={{ color: "var(--accent-fort)" }}>
                  ﴿{v.n}﴾
                </span>
              </p>
              {v.phon && (
                <p className="mt-1 text-sm italic" style={{ color: "var(--accent-fort)" }}>
                  {v.phon}
                </p>
              )}
              <p className="mt-1 text-sm leading-relaxed">{v.fr}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
