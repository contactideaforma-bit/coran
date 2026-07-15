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
import {
  Alerte,
  Goutte,
  HautParleur,
  Lecture as IconeLecture,
  LivreOuvert,
  MarquePageIcone,
  Pause,
} from "@/components/Icones";

type Lecture =
  | { type: "mot"; v: number; w: number }
  | { type: "paire"; v: number; w: number } // mot w + mot w+1 enchaînés
  | { type: "verset"; v: number }
  | { type: "sourate"; v: number }
  | null;

interface MotActif {
  v: number;
  w: number;
  word: Word;
  /* Position de la bulle, relative au conteneur de la page */
  x: number;
  y: number;
  dessous: boolean; // bulle affichée sous le mot (mot trop haut dans l'écran)
  largeur: number;
  fleche: number; // décalage horizontal de la flèche dans la bulle
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
  const conteneurRef = useRef<HTMLDivElement | null>(null);

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

  // Charger la sourate + marque-page (et couper l'audio en cours)
  useEffect(() => {
    let annule = false;
    audioRef.current?.pause();
    audioRef.current = null;
    setLecture(null);
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

  // Fermer la bulle du mot quand on change de section (le mot n'est plus affiché)
  useEffect(() => {
    setMotActif(null);
  }, [section]);

  // Échap : fermer la fenêtre la plus haute (fiche règle > légende > bulle)
  useEffect(() => {
    const surTouche = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (regleActive) setRegleActive(null);
      else if (legendeOuverte) setLegendeOuverte(false);
      else if (motActif) setMotActif(null);
    };
    window.addEventListener("keydown", surTouche);
    return () => window.removeEventListener("keydown", surTouche);
  }, [regleActive, legendeOuverte, motActif]);

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

  const clicMot = (
    v: number,
    w: number,
    word: Word,
    e?: { currentTarget: HTMLElement }
  ) => {
    jouer(urlMot(n, v, word.audio), { type: "mot", v, w });
    if (e && conteneurRef.current) {
      // Positionner la bulle juste au-dessus (ou en dessous) du mot touché
      const r = e.currentTarget.getBoundingClientRect();
      const c = conteneurRef.current.getBoundingClientRect();
      const largeur = Math.min(340, window.innerWidth - 24);
      const demi = largeur / 2;
      const ancre = r.left + r.width / 2 - c.left;
      const x = Math.min(Math.max(ancre, demi + 4), c.width - demi - 4);
      const dessous = r.top < 200; // pas assez de place au-dessus
      const y = dessous ? r.bottom - c.top + 12 : r.top - c.top - 12;
      const fleche = Math.min(Math.max(ancre - (x - demi), 18), largeur - 18);
      setMotActif({ v, w, word, x, y, dessous, largeur, fleche });
    } else {
      setMotActif((prev) => (prev ? { ...prev, v, w, word } : prev));
    }
  };

  /** Écouter deux mots consécutifs enchaînés (travail des liaisons). */
  const jouerPaire = (v: number, w: number) => {
    const verse = dataRef.current?.verses.find((x) => x.n === v);
    const m1 = verse?.words[w];
    const m2 = verse?.words[w + 1];
    if (!m1 || !m2) return;
    audioRef.current?.pause();
    const audio1 = new Audio(urlMot(n, v, m1.audio));
    const audio2 = new Audio(urlMot(n, v, m2.audio));
    audio2.preload = "auto"; // précharger le 2e pour un enchaînement fluide
    audioRef.current = audio1;
    setLecture({ type: "paire", v, w });
    const fin = () => setLecture(null);
    audio1.onended = () => {
      audioRef.current = audio2;
      audio2.onended = fin;
      audio2.onerror = fin;
      audio2.play().catch(fin);
    };
    audio1.onerror = fin;
    audio1.play().catch(fin);
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
    (lecture?.type === "mot" && lecture.v === v && lecture.w === w) ||
    (lecture?.type === "paire" &&
      lecture.v === v &&
      (lecture.w === w || lecture.w + 1 === w));

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
    <div ref={conteneurRef} className="relative mx-auto max-w-3xl px-4 pb-36 pt-4">
      <Entete />

      {/* ===== Titre + actions sourate ===== */}
      <section className="mt-5 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/coran"
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
            className="flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 font-bold text-white shadow-soft transition hover:scale-[1.01] active:scale-[0.99]"
            style={{ backgroundColor: "var(--accent)" }}
          >
            {lecture?.type === "sourate" ? (
              <>
                <Pause taille={16} />
                Arrêter la lecture (verset {lecture.v}/{meta.versets})
              </>
            ) : (
              <>
                <IconeLecture taille={16} />
                Écouter toute la sourate
              </>
            )}
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
          <p
            className="flex animate-pulse justify-center"
            style={{ color: "var(--accent)" }}
          >
            <LivreOuvert taille={36} />
          </p>
          <p className="mt-2 font-bold">Chargement de la sourate…</p>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            Texte tajwid + traduction française
          </p>
        </div>
      )}
      {erreur && (
        <div className="card mt-6 rounded-2xl p-8 text-center shadow-soft">
          <p
            className="flex justify-center"
            style={{ color: "var(--accent)" }}
          >
            <Alerte taille={36} />
          </p>
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
                  boxShadow: versetEnLecture(v.n)
                    ? "0 0 0 2px var(--accent)"
                    : undefined,
                }}
              >
                {/* En-tête de carte : numéro + actions */}
                <div className="mb-3 flex items-center justify-between">
                  <span className="badge-verset">
                    <span className="relative z-10">{v.n}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => clicMarque(v.n)}
                      className={`card rounded-full px-3 py-1.5 text-sm transition hover:scale-105 active:scale-95 ${
                        estMarque ? "" : "opacity-40"
                      }`}
                      style={
                        estMarque
                          ? {
                              borderColor: "var(--accent)",
                              color: "var(--accent)",
                            }
                          : undefined
                      }
                      aria-label={
                        estMarque
                          ? "Retirer le marque-page"
                          : "Poser un marque-page ici"
                      }
                      title={estMarque ? "Marque-page posé" : "Marque-page"}
                    >
                      <MarquePageIcone taille={16} rempli={estMarque} />
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
                      {versetEnLecture(v.n) ? (
                        <>
                          <Pause taille={13} /> Stop
                        </>
                      ) : (
                        <>
                          <IconeLecture taille={13} /> Écouter
                        </>
                      )}
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
                      onClick={(e) => clicMot(v.n, wi, word, e)}
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
        Touche un mot pour l&apos;entendre • Récitation : {nomRecitateur}{" "}
        (modifiable dans les réglages) • Pose un marque-page pour reprendre
        plus tard
      </p>

      {/* ===== Bouton flottant légende ===== */}
      <button
        onClick={() => setLegendeOuverte(true)}
        className="fixed bottom-6 right-6 z-30 flex items-center gap-2 rounded-full px-5 py-3 font-bold text-white shadow-lg transition hover:scale-105 active:scale-95"
        style={{ backgroundColor: "var(--accent)" }}
      >
        <Goutte taille={18} className="text-white" /> Règles
      </button>

      {/* ===== Bulle mot actif (ancrée au mot touché) ===== */}
      {motActif && (
        <div
          className="absolute z-30"
          style={{
            left: motActif.x,
            top: motActif.y,
            width: motActif.largeur,
            transform: motActif.dessous
              ? "translateX(-50%)"
              : "translate(-50%, -100%)",
          }}
        >
          <div
            className="card pop relative rounded-2xl px-4 py-3 shadow-lg"
            style={{
              borderColor:
                "color-mix(in srgb, var(--accent) 50%, var(--border))",
            }}
          >
            {/* Flèche qui pointe vers le mot */}
            <span
              className="absolute h-3 w-3 rotate-45"
              style={{
                left: motActif.fleche - 6,
                ...(motActif.dessous ? { top: -7 } : { bottom: -7 }),
                background: "var(--card)",
                borderStyle: "solid",
                borderColor:
                  "color-mix(in srgb, var(--accent) 50%, var(--border))",
                borderWidth: motActif.dessous ? "1px 0 0 1px" : "0 1px 1px 0",
              }}
            />
            <div className="flex items-center gap-3">
              <button
                onClick={() => clicMot(motActif.v, motActif.w, motActif.word)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition active:scale-95"
                style={{ backgroundColor: "var(--accent)" }}
                aria-label="Réécouter le mot"
              >
                <HautParleur taille={20} className="text-white" />
              </button>
              <span className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className={`arabic text-2xl ${police}`} dir="rtl">
                  {motActif.word.segments.map((s, si) =>
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
                </span>
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--muted)" }}
                >
                  {motFr(n, motActif.v, motActif.w) ??
                    (motsFrPrets ? "" : "traduction…")}
                </span>
              </span>
              <button
                onClick={() => setMotActif(null)}
                className="self-start text-lg font-bold leading-none"
                style={{ color: "var(--muted)" }}
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {dataRef.current?.verses.find((x) => x.n === motActif.v)?.words[
                motActif.w + 1
              ] && (
                <button
                  onClick={() => jouerPaire(motActif.v, motActif.w)}
                  className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold transition active:scale-95"
                  style={{
                    borderColor: "var(--accent)",
                    color:
                      lecture?.type === "paire" &&
                      lecture.v === motActif.v &&
                      lecture.w === motActif.w
                        ? "#fff"
                        : "var(--accent)",
                    backgroundColor:
                      lecture?.type === "paire" &&
                      lecture.v === motActif.v &&
                      lecture.w === motActif.w
                        ? "var(--accent)"
                        : "transparent",
                  }}
                  title="Travailler la liaison entre les deux mots"
                >
                  <IconeLecture taille={11} /> Avec le mot suivant
                </button>
              )}
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
            </div>
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
            role="dialog"
            aria-modal="true"
            aria-label="Code couleur du tajwid"
            className="card pop max-h-[75vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-extrabold">
                <span style={{ color: "var(--accent)" }}>
                  <Goutte taille={20} />
                </span>
                Code couleur du tajwid
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
            role="dialog"
            aria-modal="true"
            aria-label="Fiche de la règle tajwid"
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
