"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FATIHA, type Word } from "@/data/fatiha";
import { TAJWID_RULES, RULE_BY_ID, type TajwidRule } from "@/lib/tajwid";
import { urlMot, urlVerset } from "@/lib/audio";
import { TAILLES, usePrefs } from "@/lib/prefs";
import Entete from "@/components/Entete";

type Lecture =
  | { type: "mot"; v: number; w: number }
  | { type: "verset"; v: number }
  | null;

interface MotActif {
  v: number;
  w: number;
  word: Word;
}

export default function Lecteur() {
  const { prefs } = usePrefs();
  const [legendeOuverte, setLegendeOuverte] = useState(false);
  const [regleActive, setRegleActive] = useState<TajwidRule | null>(null);
  const [lecture, setLecture] = useState<Lecture>(null);
  const [motActif, setMotActif] = useState<MotActif | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const police = prefs.police;
  const taille = prefs.taille;

  // Couper l'audio quand on quitte la page
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const couleur = (r: TajwidRule) =>
    prefs.dark ? r.couleurSombre : r.couleur;

  const stopAudio = () => {
    audioRef.current?.pause();
    audioRef.current = null;
    setLecture(null);
  };

  const jouer = (url: string, etat: Lecture) => {
    audioRef.current?.pause();
    const audio = new Audio(url);
    audioRef.current = audio;
    setLecture(etat);
    audio.onended = () => setLecture(null);
    audio.onerror = () => setLecture(null);
    audio.play().catch(() => setLecture(null));
  };

  const clicMot = (v: number, w: number, word: Word) => {
    jouer(urlMot(FATIHA.sourate, v, w + 1), { type: "mot", v, w });
    setMotActif({ v, w, word });
  };

  const clicVerset = (v: number) => {
    if (lecture?.type === "verset" && lecture.v === v) {
      stopAudio();
    } else {
      jouer(urlVerset(FATIHA.sourate, v), { type: "verset", v });
    }
  };

  const reglesDuMot = (word: Word): TajwidRule[] => {
    const ids = new Set(word.segments.filter((s) => s.r).map((s) => s.r!));
    return Array.from(ids).map((id) => RULE_BY_ID[id]);
  };

  const motEnLecture = (v: number, w: number) =>
    lecture?.type === "mot" && lecture.v === v && lecture.w === w;

  return (
    <div className="mx-auto max-w-3xl px-4 pb-36 pt-4">
      <Entete />

      {/* ===== Titre de la sourate ===== */}
      <section className="mt-5 flex items-center justify-between gap-3">
        <Link
          href="/"
          className="card rounded-full px-4 py-2 text-sm font-bold shadow-soft transition hover:scale-105 active:scale-95"
        >
          ← Sourates
        </Link>
        <div
          className="card inline-block rounded-full px-6 py-2 shadow-soft"
          style={{ borderColor: "var(--accent)" }}
        >
          <span className={`arabic text-2xl font-bold ${police}`}>
            {FATIHA.nomArabe}
          </span>
          <span className="mx-2" style={{ color: "var(--muted)" }}>
            •
          </span>
          <span className="text-sm font-bold">{FATIHA.nomFr}</span>
        </div>
      </section>

      {/* ===== Versets ===== */}
      <main className="mt-5 space-y-4">
        {FATIHA.verses.map((v) => (
          <article key={v.n} className="card rounded-2xl p-5 shadow-soft">
            <p
              className={`arabic ${police} ${TAILLES[taille].arabe}`}
              dir="rtl"
            >
              {v.words.map((word, wi) => (
                <span key={wi}>
                  <button
                    onClick={() => clicMot(v.n, wi, word)}
                    className="rounded-lg px-1 transition hover:opacity-75 active:scale-95"
                    style={{
                      backgroundColor: motEnLecture(v.n, wi)
                        ? "color-mix(in srgb, var(--accent) 25%, transparent)"
                        : undefined,
                    }}
                    title="Écouter ce mot"
                  >
                    {word.segments.map((s, si) =>
                      s.r ? (
                        <span
                          key={si}
                          style={{ color: couleur(RULE_BY_ID[s.r]) }}
                        >
                          {s.t}
                        </span>
                      ) : (
                        <span key={si}>{s.t}</span>
                      )
                    )}
                  </button>{" "}
                </span>
              ))}
              <span
                className="mx-1 inline-flex h-8 w-8 items-center justify-center rounded-full border text-sm font-bold"
                style={{ borderColor: "var(--accent)", color: "var(--accent)" }}
              >
                {v.n}
              </span>
            </p>
            <div className="mt-3 flex items-start justify-between gap-3">
              <p
                className={TAILLES[taille].trad}
                style={{ color: "var(--muted)" }}
              >
                {v.n}. {v.traduction}
              </p>
              <button
                onClick={() => clicVerset(v.n)}
                className="flex shrink-0 items-center gap-1 rounded-full border px-3 py-1.5 text-sm font-bold transition hover:scale-105 active:scale-95"
                style={{
                  borderColor: "var(--accent)",
                  color:
                    lecture?.type === "verset" && lecture.v === v.n
                      ? "#fff"
                      : "var(--accent)",
                  backgroundColor:
                    lecture?.type === "verset" && lecture.v === v.n
                      ? "var(--accent)"
                      : "transparent",
                }}
                aria-label={`Écouter le verset ${v.n} récité par Al-Afasy`}
              >
                {lecture?.type === "verset" && lecture.v === v.n
                  ? "⏸ Stop"
                  : "▶ Verset"}
              </button>
            </div>
          </article>
        ))}
      </main>

      <p className="mt-6 text-center text-xs" style={{ color: "var(--muted)" }}>
        💡 Touche un mot pour l&apos;entendre • ▶ Verset pour la récitation
        d&apos;Al-Afasy • 🎨 pour le code couleur
      </p>

      {/* ===== Bouton flottant légende ===== */}
      <button
        onClick={() => setLegendeOuverte(true)}
        className={`fixed right-6 z-30 flex items-center gap-2 rounded-full px-5 py-3 font-bold text-white shadow-lg transition hover:scale-105 active:scale-95 ${
          motActif ? "bottom-28" : "bottom-6"
        }`}
        style={{ backgroundColor: "var(--accent)" }}
      >
        🎨 Règles
      </button>

      {/* ===== Barre mot actif (prononciation + règles du mot) ===== */}
      {motActif && (
        <div className="fixed inset-x-0 bottom-0 z-30 flex justify-center px-3 pb-3">
          <div className="card pop flex w-full max-w-3xl items-center gap-3 rounded-2xl px-4 py-3 shadow-soft">
            <button
              onClick={() => clicMot(motActif.v, motActif.w, motActif.word)}
              className="rounded-full px-3 py-2 text-lg text-white transition active:scale-95"
              style={{ backgroundColor: "var(--accent)" }}
              aria-label="Réécouter le mot"
            >
              🔊
            </button>
            <span className={`arabic text-2xl ${police}`} dir="rtl">
              {motActif.word.segments.map((s, si) =>
                s.r ? (
                  <span key={si} style={{ color: couleur(RULE_BY_ID[s.r]) }}>
                    {s.t}
                  </span>
                ) : (
                  <span key={si}>{s.t}</span>
                )
              )}
            </span>
            <span className="flex flex-1 flex-wrap justify-end gap-1.5">
              {reglesDuMot(motActif.word).length === 0 ? (
                <span className="text-xs" style={{ color: "var(--muted)" }}>
                  Pas de règle particulière
                </span>
              ) : (
                reglesDuMot(motActif.word).map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setRegleActive(r)}
                    className="rounded-full border px-2.5 py-1 text-xs font-bold transition active:scale-95"
                    style={{ borderColor: couleur(r), color: couleur(r) }}
                  >
                    {r.nom.split(" (")[0]}
                  </button>
                ))
              )}
            </span>
            <button
              onClick={() => setMotActif(null)}
              className="text-lg font-bold"
              style={{ color: "var(--muted)" }}
              aria-label="Fermer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ===== Légende (bottom sheet) ===== */}
      {legendeOuverte && (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center bg-black/40"
          onClick={() => setLegendeOuverte(false)}
        >
          <div
            className="card pop max-h-[75vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-extrabold">
                🎨 Code couleur du tajwid
              </h2>
              <button
                onClick={() => setLegendeOuverte(false)}
                className="card rounded-full px-3 py-1 font-bold"
              >
                ✕
              </button>
            </div>
            <ul className="space-y-2">
              {TAJWID_RULES.map((r) => (
                <li key={r.id}>
                  <button
                    onClick={() => setRegleActive(r)}
                    className="flex w-full items-center gap-3 rounded-xl border p-3 text-left transition hover:scale-[1.01] active:scale-[0.99]"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <span
                      className="tajwid-dot"
                      style={{ backgroundColor: couleur(r) }}
                    />
                    <span className="flex-1">
                      <span className="block font-bold">{r.nom}</span>
                      <span
                        className="block text-sm"
                        style={{ color: "var(--muted)" }}
                      >
                        {r.resume}
                      </span>
                    </span>
                    <span style={{ color: "var(--muted)" }}>›</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ===== Fiche règle ===== */}
      {regleActive && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6"
          onClick={() => setRegleActive(null)}
        >
          <div
            className="card pop w-full max-w-md rounded-3xl p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <span
              className="tajwid-dot mx-auto mb-3 !h-6 !w-6"
              style={{ backgroundColor: couleur(regleActive) }}
            />
            <h3
              className="text-xl font-extrabold"
              style={{ color: couleur(regleActive) }}
            >
              {regleActive.nom}
            </h3>
            <p className="mt-3">{regleActive.detail}</p>
            <p
              className={`arabic mt-4 text-2xl ${police}`}
              style={{ color: couleur(regleActive) }}
            >
              {regleActive.exemple}
            </p>
            <button
              onClick={() => setRegleActive(null)}
              className="mt-5 rounded-full px-6 py-2 font-bold text-white transition active:scale-95"
              style={{ backgroundColor: "var(--accent)" }}
            >
              Compris !
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
