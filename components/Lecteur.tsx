"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  BASMALA,
  chargerMotsFr,
  chargerSourate,
  motFr,
  type SourateData,
  type Word,
} from "@/lib/coran";
import { SOURATES } from "@/data/sourates";
import { sectionsJuz } from "@/data/juz";
import {
  ecrireMarquePage,
  lireMarquePage,
  type MarquePage,
} from "@/lib/marquePage";
import { TAJWID_RULES, RULE_BY_ID, type TajwidRule } from "@/lib/tajwid";
import { urlMot, urlVerset } from "@/lib/audio";
import { RECITATEURS, TAILLES, usePrefs } from "@/lib/prefs";
import Entete from "@/components/Entete";

type Lecture =
  | { type: "mot"; v: number; w: number }
  | { type: "verset"; v: number }
  | { type: "sourate"; v: number }
  | null;

interface MotActif {
  v: number;
  w: number;
  word: Word;
}

export default function Lecteur({ n }: { n: number }) {
  const { prefs } = usePrefs();
  const [data, setData] = useState<SourateData | null>(null);
  const [erreur, setErreur] = useState(false);
  const [section, setSection] = useState(0);
  const [marque, setMarque] = useState<MarquePage | null>(null);
  const [legendeOuverte, setLegendeOuverte] = useState(false);
  const [regleActive, setRegleActive] = useState<TajwidRule | null>(null);
  const [lecture, setLecture] = useState<Lecture>(null);
  const [motActif, setMotActif] = useState<MotActif | null>(null);
  const [motsFrPrets, setMotsFrPrets] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const dataRef = useRef<SourateData | null>(null);

  // Précharger les traductions mot à mot françaises (en arrière-plan)
  useEffect(() => {
    chargerMotsFr()
      .then(() => setMotsFrPrets(true))
      .catch(() => {});
  }, []);

  const meta = SOURATES.find((s) => s.n === n)!;
  const police = prefs.police;
  const taille = prefs.taille;
  const sections = sectionsJuz(n, meta.versets);

  const sectionDuVerset = (v: number) =>
    Math.max(
      0,
      sections.findIndex((s) => v >= s.debut && v <= s.fin)
    );

  // Charger la sourate + marque-page
  useEffect(() => {
    let annule = false;
    setData(null);
    setErreur(false);
    setMotActif(null);
    setSection(0);
    setMarque(lireMarquePage());
    chargerSourate(n)
      .then((d) => {
        if (annule) return;
        dataRef.current = d;
        setData(d);
      })
      .catch(() => {
        if (!annule) setErreur(true);
      });
    return () => {
      annule = true;
    };
  }, [n]);

  // Aller au verset indiqué dans l'URL (#v-12) après chargement
  useEffect(() => {
    if (!data) return;
    const m = window.location.hash.match(/^#v-(\d+)$/);
    if (!m) return;
    const cible = Number(m[1]);
    setSection(sectionDuVerset(cible));
    setTimeout(() => {
      document
        .getElementById(`v-${cible}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 150);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

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
    jouer(urlMot(n, v, word.audio), { type: "mot", v, w });
    setMotActif({ v, w, word });
  };

  const clicVerset = (v: number) => {
    if (
      (lecture?.type === "verset" || lecture?.type === "sourate") &&
      lecture.v === v
    ) {
      stopAudio();
    } else {
      jouer(urlVerset(n, v, prefs.recitateur), { type: "verset", v });
    }
  };

  // Lecture de la sourate entière (enchaînement des versets)
  const jouerSourateDepuis = (idx: number) => {
    const verses = dataRef.current?.verses;
    if (!verses || idx >= verses.length) {
      setLecture(null);
      return;
    }
    const v = verses[idx];
    audioRef.current?.pause();
    const audio = new Audio(urlVerset(n, v.n, prefs.recitateur));
    audioRef.current = audio;
    setLecture({ type: "sourate", v: v.n });
    setSection(sectionDuVerset(v.n));
    setTimeout(() => {
      document
        .getElementById(`v-${v.n}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
    audio.onended = () => jouerSourateDepuis(idx + 1);
    audio.onerror = () => setLecture(null);
    audio.play().catch(() => setLecture(null));
  };

  const clicSourate = () => {
    if (lecture?.type === "sourate") {
      stopAudio();
    } else {
      jouerSourateDepuis(0);
    }
  };

  const clicMarque = (v: number) => {
    const nouvelle =
      marque?.s === n && marque?.v === v ? null : { s: n, v };
    ecrireMarquePage(nouvelle);
    setMarque(nouvelle);
  };

  const reglesDuMot = (word: Word): TajwidRule[] => {
    const ids = new Set(word.segments.filter((s) => s.r).map((s) => s.r!));
    return Array.from(ids).map((id) => RULE_BY_ID[id]);
  };

  const motEnLecture = (v: number, w: number) =>
    lecture?.type === "mot" && lecture.v === v && lecture.w === w;

  const versetEnLecture = (v: number) =>
    (lecture?.type === "verset" || lecture?.type === "sourate") &&
    lecture.v === v;

  const nomRecitateur =
    RECITATEURS.find((r) => r.id === prefs.recitateur)?.nom ?? "";

  const sec = sections[Math.min(section, sections.length - 1)];
  const versetsAffiches = data
    ? sections.length > 1
      ? data.verses.filter((v) => v.n >= sec.debut && v.n <= sec.fin)
      : data.verses
    : [];

  const precedente = SOURATES.find((s) => s.n === n - 1);
  const suivante = SOURATES.find((s) => s.n === n + 1);

  return (
    <div className="mx-auto max-w-3xl px-4 pb-36 pt-4">
      <Entete />

      {/* ===== Titre + actions sourate ===== */}
      <section className="mt-5 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/"
            className="card rounded-full px-4 py-2 text-sm font-bold shadow-soft transition hover:scale-105 active:scale-95"
          >
            ← Sourates
          </Link>
          <div
            className="card inline-block rounded-full px-5 py-2 shadow-soft"
            style={{ borderColor: "var(--accent)" }}
          >
            <span className={`arabic text-xl font-bold ${police}`}>
              {meta.arabe}
            </span>
            <span className="mx-2" style={{ color: "var(--muted)" }}>
              •
            </span>
            <span className="text-sm font-bold">{meta.nom}</span>
          </div>
        </div>

        {data && (
          <button
            onClick={clicSourate}
            className="w-full rounded-2xl px-4 py-3 font-bold text-white shadow-soft transition hover:scale-[1.01] active:scale-[0.99]"
            style={{ backgroundColor: "var(--accent)" }}
          >
            {lecture?.type === "sourate"
              ? `⏸ Arrêter la lecture (verset ${lecture.v}/${meta.versets})`
              : "▶ Écouter toute la sourate"}
          </button>
        )}

        {/* Pagination par juz' pour les longues sourates */}
        {sections.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {sections.map((s, i) => (
              <button
                key={s.juz}
                onClick={() => setSection(i)}
                className="shrink-0 rounded-full border px-4 py-1.5 text-sm font-bold transition active:scale-95"
                style={{
                  borderColor:
                    section === i ? "var(--accent)" : "var(--border)",
                  backgroundColor:
                    section === i ? "var(--accent)" : "var(--card)",
                  color: section === i ? "#fff" : "var(--text)",
                }}
              >
                Juz&apos; {s.juz}{" "}
                <span className="font-normal opacity-75">
                  (v.{s.debut}-{s.fin})
                </span>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* ===== Basmala décorative (sauf Al-Fâtiha et At-Tawba) ===== */}
      {n !== 1 && n !== 9 && (
        <p
          className={`arabic mt-5 text-center text-2xl ${police}`}
          dir="rtl"
          style={{ color: "var(--accent)" }}
        >
          {BASMALA}
        </p>
      )}

      {/* ===== Chargement / erreur ===== */}
      {!data && !erreur && (
        <div className="card mt-6 rounded-2xl p-8 text-center shadow-soft">
          <p className="animate-pulse text-3xl">📖</p>
          <p className="mt-2 font-bold">Chargement de la sourate…</p>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            Texte tajwid + traduction française
          </p>
        </div>
      )}
      {erreur && (
        <div className="card mt-6 rounded-2xl p-8 text-center shadow-soft">
          <p className="text-3xl">📡</p>
          <p className="mt-2 font-bold">Impossible de charger la sourate</p>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            Vérifie ta connexion internet, puis réessaie.
          </p>
          <button
            onClick={() => {
              setErreur(false);
              chargerSourate(n)
                .then((d) => {
                  dataRef.current = d;
                  setData(d);
                })
                .catch(() => setErreur(true));
            }}
            className="mt-4 rounded-full px-6 py-2 font-bold text-white transition active:scale-95"
            style={{ backgroundColor: "var(--accent)" }}
          >
            Réessayer
          </button>
        </div>
      )}

      {/* ===== Versets ===== */}
      {data && (
        <main className="mt-5 space-y-4">
          {versetsAffiches.map((v) => {
            const estMarque = marque?.s === n && marque?.v === v.n;
            return (
              <article
                key={v.n}
                id={`v-${v.n}`}
                className="card rounded-2xl p-5 shadow-soft transition"
                style={{
                  borderColor: versetEnLecture(v.n)
                    ? "var(--accent)"
                    : undefined,
                  borderWidth: versetEnLecture(v.n) ? 2 : undefined,
                }}
              >
                {/* En-tête de carte : numéro + actions */}
                <div className="mb-3 flex items-center justify-between">
                  <span
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border text-sm font-bold"
                    style={{
                      borderColor: "var(--accent)",
                      color: "var(--accent)",
                    }}
                  >
                    {v.n}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => clicMarque(v.n)}
                      className={`card rounded-full px-3 py-1.5 text-sm transition hover:scale-105 active:scale-95 ${
                        estMarque ? "" : "opacity-40"
                      }`}
                      style={
                        estMarque ? { borderColor: "var(--accent)" } : undefined
                      }
                      aria-label={
                        estMarque
                          ? "Retirer le marque-page"
                          : "Poser un marque-page ici"
                      }
                      title={estMarque ? "Marque-page posé" : "Marque-page"}
                    >
                      🔖
                    </button>
                    <button
                      onClick={() => clicVerset(v.n)}
                      className="flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm font-bold transition hover:scale-105 active:scale-95"
                      style={{
                        borderColor: "var(--accent)",
                        color: versetEnLecture(v.n) ? "#fff" : "var(--accent)",
                        backgroundColor: versetEnLecture(v.n)
                          ? "var(--accent)"
                          : "transparent",
                      }}
                      aria-label={`Écouter le verset ${v.n} récité par ${nomRecitateur}`}
                    >
                      {versetEnLecture(v.n) ? "⏸ Stop" : "▶ Écouter"}
                    </button>
                  </div>
                </div>

                {/* Texte arabe : mots compacts, retour à la ligne naturel */}
                <div
                  className={`arabic verset-mots ${police} ${TAILLES[taille].arabe}`}
                  dir="rtl"
                >
                  {v.words.map((word, wi) => (
                    <button
                      key={wi}
                      onClick={() => clicMot(v.n, wi, word)}
                      className="rounded-md transition hover:opacity-75 active:scale-95"
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
                    </button>
                  ))}
                </div>

                {/* Traduction : toujours sur sa propre ligne */}
                <p
                  className={`mt-4 border-t pt-3 ${TAILLES[taille].trad}`}
                  style={{
                    color: "var(--muted)",
                    borderColor: "var(--border)",
                  }}
                >
                  {v.traduction}
                </p>
              </article>
            );
          })}

          {/* Navigation */}
          <nav className="flex items-center justify-between gap-3 pt-2">
            {sections.length > 1 && section > 0 ? (
              <button
                onClick={() => setSection(section - 1)}
                className="card rounded-full px-4 py-2 text-sm font-bold shadow-soft transition hover:scale-105 active:scale-95"
              >
                ← Juz&apos; {sections[section - 1].juz}
              </button>
            ) : precedente ? (
              <Link
                href={`/sourate/${precedente.n}`}
                className="card rounded-full px-4 py-2 text-sm font-bold shadow-soft transition hover:scale-105 active:scale-95"
              >
                ← {precedente.nom}
              </Link>
            ) : (
              <span />
            )}
            {sections.length > 1 && section < sections.length - 1 ? (
              <button
                onClick={() => setSection(section + 1)}
                className="card rounded-full px-4 py-2 text-sm font-bold shadow-soft transition hover:scale-105 active:scale-95"
              >
                Juz&apos; {sections[section + 1].juz} →
              </button>
            ) : suivante ? (
              <Link
                href={`/sourate/${suivante.n}`}
                className="card rounded-full px-4 py-2 text-sm font-bold shadow-soft transition hover:scale-105 active:scale-95"
              >
                {suivante.nom} →
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </main>
      )}

      <p className="mt-6 text-center text-xs" style={{ color: "var(--muted)" }}>
        💡 Touche un mot pour l&apos;entendre • Récitation : {nomRecitateur}{" "}
        (modifiable dans ✨) • 🔖 pour reprendre plus tard
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

      {/* ===== Barre mot actif ===== */}
      {motActif && (
        <div className="fixed inset-x-0 bottom-0 z-30 flex justify-center px-3 pb-3">
          <div className="card pop flex w-full max-w-3xl items-center gap-3 rounded-2xl px-4 py-3 shadow-soft">
            <button
              onClick={() => clicMot(motActif.v, motActif.w, motActif.word)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition active:scale-95"
              style={{ backgroundColor: "var(--accent)" }}
              aria-label="Réécouter le mot"
            >
              <svg
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="#fff"
                aria-hidden="true"
              >
                <path d="M3 9v6h4l5 5V4L7 9H3z" />
                <path d="M16.5 12a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z" />
                <path d="M14 3.8v2.1a6.5 6.5 0 0 1 0 12.2v2.1a8.5 8.5 0 0 0 0-16.4z" />
              </svg>
            </button>
            <span className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-0.5">
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
              <span
                className="text-sm font-medium"
                style={{ color: "var(--muted)" }}
              >
                {motFr(n, motActif.v, motActif.w) ??
                  (motsFrPrets ? "" : "traduction…")}
              </span>
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
                    className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold transition active:scale-95"
                    style={{ borderColor: couleur(r), color: "var(--text)" }}
                  >
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ backgroundColor: couleur(r) }}
                    />
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

      {/* ===== Légende ===== */}
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
