"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  BASMALA,
  chargerMotsFr,
  chargerPhonetique,
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
import { LecteurPlage, chargerAudioSourate, type AudioSourate } from "@/lib/audio-sourate";
import { pagesDeSourate } from "@/lib/coran";
import { declarerMediaSession, effacerMediaSession, etatMediaSession } from "@/lib/media-session";
import { RECITATEURS, TAILLES, usePrefs } from "@/lib/prefs";
import {
  indexMemorises,
  lireProgression,
  reconnaitre,
  type IndexVocabulaire,
} from "@/lib/vocabulaire";
import { VOCABULAIRE_MASQUE, packDuMot } from "@/data/vocabulaire";
import Entete from "@/components/Entete";
import {
  Alerte,
  Goutte,
  HautParleur,
  Lecture as IconeLecture,
  LivreOuvert,
  MarquePageIcone,
  Pause,
  Repeter,
  Verifie,
} from "@/components/Icones";

/** Texte brut d'un mot, segments de tajwid recollés. */
function formeDuMot(word: Word): string {
  return word.segments.map((s) => s.t).join("");
}

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
  const { prefs, maj } = usePrefs();
  const [data, setData] = useState<SourateData | null>(null);
  const [erreur, setErreur] = useState(false);
  const [phonetiques, setPhonetiques] = useState<string[] | null>(null);
  const [section, setSection] = useState(0);
  const [marque, setMarque] = useState<MarquePage | null>(null);
  const [legendeOuverte, setLegendeOuverte] = useState(false);
  const [regleActive, setRegleActive] = useState<TajwidRule | null>(null);
  const [bulleReglesVisible, setBulleReglesVisible] = useState(true);
  const [lecture, setLecture] = useState<Lecture>(null);
  const [motActif, setMotActif] = useState<MotActif | null>(null);
  const [motsFrPrets, setMotsFrPrets] = useState(false);
  const [vocab, setVocab] = useState<IndexVocabulaire | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Verset suivant déjà téléchargé pendant la lecture de la sourate (secours <audio>)
  const prechargeRef = useRef<{ url: string; audio: HTMLAudioElement } | null>(null);
  // Fichier complet de la sourate (récitation d'origine) + minutages
  const plageRef = useRef<LecteurPlage | null>(null);
  const audioSourateRef = useRef<AudioSourate | null>(null);
  const dataRef = useRef<SourateData | null>(null);
  const conteneurRef = useRef<HTMLDivElement | null>(null);
  const bulleRef = useRef<HTMLDivElement | null>(null);

  // Mots de vocabulaire déjà mémorisés, pour les signaler dans le texte
  useEffect(() => {
    setVocab(indexMemorises(lireProgression()));
  }, []);

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
    plageRef.current?.arreter();
    setLecture(null);
    setData(null);
    setErreur(false);
    setMotActif(null);
    setSection(0);
    setPhonetiques(null);
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

  // Préparer le fichier complet de la sourate (récitation d'origine)
  useEffect(() => {
    let annule = false;
    audioSourateRef.current = null;
    chargerAudioSourate(prefs.recitateur, n).then((a) => {
      if (!annule) audioSourateRef.current = a;
    });
    return () => {
      annule = true;
    };
  }, [n, prefs.recitateur]);

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
      plageRef.current?.arreter();
    };
  }, []);

  // Charger la phonétique quand l'option est activée
  useEffect(() => {
    if (!prefs.phonetique) return;
    let annule = false;
    chargerPhonetique(n)
      .then((p) => {
        if (!annule) setPhonetiques(p);
      })
      .catch(() => {});
    return () => {
      annule = true;
    };
  }, [n, prefs.phonetique]);

  // Fermer la bulle du mot quand on change de section (le mot n'est plus affiché)
  useEffect(() => {
    setMotActif(null);
  }, [section]);

  // Le bouton flottant « Règles » recouvre la traduction du verset qui passe
  // dessous : on l'escamote pendant la descente et on le ramène dès que
  // l'utilisateur remonte (ou arrive en bas de page).
  useEffect(() => {
    let dernier = window.scrollY;
    const surDefilement = () => {
      const y = window.scrollY;
      if (Math.abs(y - dernier) < 10) return;
      const enBas =
        y + window.innerHeight >= document.body.scrollHeight - 120;
      setBulleReglesVisible(y < dernier || y < 80 || enBas);
      dernier = y;
    };
    window.addEventListener("scroll", surDefilement, { passive: true });
    return () => window.removeEventListener("scroll", surDefilement);
  }, []);

  // Fermer la bulle en touchant n'importe où en dehors d'elle.
  // (Toucher un autre mot ferme puis rouvre la bulle sur ce mot :
  // le pointerdown ferme, le click du mot la repositionne ensuite.)
  useEffect(() => {
    if (!motActif) return;
    const fermerSiDehors = (e: PointerEvent) => {
      const cible = e.target as Node | null;
      if (cible && bulleRef.current?.contains(cible)) return;
      setMotActif(null);
    };
    document.addEventListener("pointerdown", fermerSiDehors);
    return () => document.removeEventListener("pointerdown", fermerSiDehors);
  }, [motActif]);

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
    prechargeRef.current = null;
    plageRef.current?.arreter();
    effacerMediaSession();
    setLecture(null);
  };

  const jouer = (url: string, etat: Lecture) => {
    audioRef.current?.pause();
    plageRef.current?.arreter();
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
    plageRef.current?.arreter();
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

  /** Précharge l'audio du verset d'index idx (pour enchaîner sans coupure). */
  const prechargerVerset = (idx: number) => {
    const verses = dataRef.current?.verses;
    if (!verses || idx >= verses.length) {
      prechargeRef.current = null;
      return;
    }
    const url = urlVerset(n, verses[idx].n, prefs.recitateur);
    if (prechargeRef.current?.url === url) return;
    const audio = new Audio(url);
    audio.preload = "auto";
    audio.load();
    prechargeRef.current = { url, audio };
  };

  // Lecture de la sourate entière (enchaînement des versets sans coupure :
  // le verset suivant est téléchargé pendant la lecture du verset en cours,
  // et démarre dès la fin du précédent sans attendre le réseau)
  const jouerSourateDepuis = (idx: number) => {
    const verses = dataRef.current?.verses;
    if (!verses || idx >= verses.length) {
      prechargeRef.current = null;
      setLecture(null);
      return;
    }
    const v = verses[idx];
    audioRef.current?.pause();
    const url = urlVerset(n, v.n, prefs.recitateur);
    const pret = prechargeRef.current;
    const audio = pret && pret.url === url ? pret.audio : new Audio(url);
    prechargeRef.current = null;
    audioRef.current = audio;
    setLecture({ type: "sourate", v: v.n });
    setSection(sectionDuVerset(v.n));
    declarerSession(v.n);
    setTimeout(() => {
      document
        .getElementById(`v-${v.n}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
    let enchaine = false;
    const suivant = () => {
      if (enchaine) return;
      enchaine = true;
      jouerSourateDepuis(idx + 1);
    };
    audio.onended = suivant;
    audio.onerror = () => setLecture(null);
    // Dès que la lecture démarre, on précharge le verset suivant
    audio.onplaying = () => prechargerVerset(idx + 1);
    audio.play().catch(() => setLecture(null));
    prechargerVerset(idx + 1);
  };

  /** Affiche le verset en cours de récitation (surlignage + défilement). */
  const montrerVersetLu = (v: number) => {
    setLecture((prev) =>
      prev?.type === "sourate" && prev.v === v ? prev : { type: "sourate", v }
    );
    setSection(sectionDuVerset(v));
    setTimeout(() => {
      document
        .getElementById(`v-${v}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 50);
  };

  /** Lecture de la sourate : fichier complet d'origine si le récitateur est
   *  disponible, sinon enchaînement sans coupure (Web Audio), sinon <audio>. */
  const lancerSourate = (idx: number) => {
    const verses = dataRef.current?.verses;
    if (!verses || !verses.length) return;
    audioRef.current?.pause();
    audioRef.current = null;
    const complet = audioSourateRef.current;
    if (complet) {
      if (!plageRef.current) plageRef.current = new LecteurPlage();
      montrerVersetLu(verses[idx].n);
      declarerSession(verses[idx].n);
      plageRef.current.jouer(complet, verses[idx].n, verses[verses.length - 1].n, {
        surVerset: (v) => {
          montrerVersetLu(v);
          declarerSession(v);
        },
        surFin: () => {
          effacerMediaSession();
          setLecture(null);
        },
        surErreur: () => lancerSourateParVersets(idx),
      });
      return;
    }
    lancerSourateParVersets(idx);
  };

  /** Secours : enchaînement verset par verset (<audio> préchargé). */
  const lancerSourateParVersets = (idx: number) => {
    jouerSourateDepuis(idx);
  };

  /** Contrôles de l'écran verrouillé + maintien de la lecture en arrière-plan. */
  const declarerSession = (v: number) => {
    declarerMediaSession({
      titre: `${meta.nom} — verset ${v}`,
      artiste: RECITATEURS.find((r) => r.id === prefs.recitateur)?.nom,
      surLecture: () => {
        plageRef.current?.reprendre();
        audioRef.current?.play().catch(() => {});
        etatMediaSession("playing");
      },
      surPause: () => {
        plageRef.current?.pause();
        audioRef.current?.pause();
        etatMediaSession("paused");
      },
      surArret: () => stopAudio(),
    });
  };

  const clicSourate = () => {
    if (lecture?.type === "sourate") {
      stopAudio();
    } else {
      lancerSourate(0);
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

  const pagesMushaf = data ? pagesDeSourate(data) : [];
  const [saisieVerset, setSaisieVerset] = useState("");
  // Arrivée depuis le rappel du vendredi (/sourate/18?ecouter=1) : proposer l'écoute
  const [invitationEcoute, setInvitationEcoute] = useState(false);
  useEffect(() => {
    setInvitationEcoute(/[?&]ecouter=1/.test(window.location.search));
  }, [n]);

  /** Aller à un verset : bonne section de juz', puis défilement. */
  const allerAuVerset = (v: number) => {
    if (!data || v < 1 || v > meta.versets) return;
    setSection(sectionDuVerset(v));
    setTimeout(() => {
      document.getElementById(`v-${v}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

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

      {invitationEcoute && (
        <section
          className="card relief pop mt-5 flex items-center gap-3 rounded-3xl p-4"
          style={{ borderColor: "var(--accent)" }}
        >
          <span className="text-3xl" aria-hidden>🌟</span>
          <div className="min-w-0 flex-1">
            <p className="font-extrabold leading-tight">
              {n === 18 ? "Vendredi : sourate Al-Kahf" : `Sourate ${meta.nom}`}
            </p>
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              Lis-la ci-dessous, ou lance la récitation complète.
            </p>
          </div>
          <button
            onClick={() => {
              setInvitationEcoute(false);
              if (lecture?.type !== "sourate") lancerSourate(0);
            }}
            disabled={!data}
            className="shrink-0 rounded-full px-4 py-2 text-sm font-bold shadow-soft transition active:scale-95 disabled:opacity-60"
            style={{ background: "var(--accent-fort)", color: "var(--sur-accent)" }}
          >
            {data ? "▶ Écouter" : "Chargement…"}
          </button>
        </section>
      )}

      {/* ===== Titre + actions sourate ===== */}
      <section className="mt-5 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/coran"
            onClick={() => {
              // Demander à la liste de revenir là où on était
              try {
                sessionStorage.setItem("coran-liste-retour", "1");
              } catch {
                /* stockage indisponible */
              }
            }}
            className="card rounded-full px-4 py-2 text-sm font-bold shadow-soft transition hover:scale-105 active:scale-95"
          >
            ← Sourates
          </Link>
          <div className="text-right">
            <p className="hero-surtitre justify-end">Sourate {meta.n}</p>
          </div>
        </div>

        {/* Titre éditorial : nom arabe en grand, nom français, infos */}
        <div className="card relief relative overflow-hidden rounded-3xl px-5 py-4">
          <span
            className={`hero-filigrane ${police}`}
            style={{ fontSize: "5.5rem", top: "-0.6rem", right: "0.25rem" }}
            aria-hidden
          >
            {meta.n}
          </span>
          <div className="relative flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h1 className="hero-titre" style={{ fontSize: "clamp(1.6rem, 6.5vw, 2.2rem)" }}>
                {meta.nom}
              </h1>
              <p className="mt-1 text-xs font-bold" style={{ color: "var(--muted)" }}>
                {meta.versets} versets
                {pagesMushaf.length > 0 && ` • pages ${pagesMushaf[0].page}–${pagesMushaf[pagesMushaf.length - 1].page}`}
              </p>
            </div>
            <span className={`arabic shrink-0 text-4xl font-bold ${police}`} dir="rtl" style={{ color: "var(--accent-fort)" }}>
              {meta.arabe}
            </span>
          </div>
        </div>

        {data && (
          <button
            onClick={clicSourate}
            className="flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 font-bold text-white shadow-soft transition hover:scale-[1.01] active:scale-[0.99]"
            style={{ backgroundColor: "var(--accent-fort)" }}
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

        {data && (
          <Link
            href={`/apprentissage?s=${n}`}
            className="card flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold shadow-soft transition hover:scale-[1.01] active:scale-[0.99]"
            style={{ color: "var(--accent-fort)" }}
          >
            <Repeter taille={15} /> Mode apprentissage : répéter des versets ou
            des mots
          </Link>
        )}

        {data && (
          <button
            onClick={() => maj({ phonetique: !prefs.phonetique })}
            role="switch"
            aria-checked={prefs.phonetique}
            className="card flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-2.5 text-sm font-bold shadow-soft transition active:scale-[0.99]"
            style={
              prefs.phonetique ? { borderColor: "var(--accent)" } : undefined
            }
          >
            <span>Phonétique (prononciation en lettres latines)</span>
            <span
              className="relative h-6 w-11 shrink-0 rounded-full transition"
              style={{
                backgroundColor: prefs.phonetique
                  ? "var(--accent-fort)"
                  : "var(--border)",
              }}
            >
              <span
                className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all"
                style={{ left: prefs.phonetique ? "1.375rem" : "0.125rem" }}
              />
            </span>
          </button>
        )}

        {data && !VOCABULAIRE_MASQUE && (
          <button
            onClick={() => maj({ vocabulaire: !prefs.vocabulaire })}
            role="switch"
            aria-checked={prefs.vocabulaire}
            className="card mt-2 flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-2.5 text-sm font-bold shadow-soft transition active:scale-[0.99]"
            style={
              prefs.vocabulaire ? { borderColor: "var(--accent)" } : undefined
            }
          >
            <span>Souligner les mots que j'ai mémorisés</span>
            <span
              className="relative h-6 w-11 shrink-0 rounded-full transition"
              style={{
                backgroundColor: prefs.vocabulaire
                  ? "var(--accent-fort)"
                  : "var(--border)",
              }}
            >
              <span
                className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all"
                style={{ left: prefs.vocabulaire ? "1.375rem" : "0.125rem" }}
              />
            </span>
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
                    section === i ? "var(--accent-fort)" : "var(--card)",
                  color: section === i ? "var(--sur-accent)" : "var(--text)",
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

        {/* Aller à un verset ou à une page du mushaf */}
        {data && (
          <div className="card rounded-2xl p-3 shadow-soft">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--muted)" }}>
                Aller au verset
              </span>
              <form
                className="flex items-center gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  allerAuVerset(Number(saisieVerset));
                }}
              >
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={meta.versets}
                  value={saisieVerset}
                  onChange={(e) => setSaisieVerset(e.target.value)}
                  placeholder={`1-${meta.versets}`}
                  aria-label="Numéro de verset"
                  className="w-20 rounded-full border px-3 py-1 text-sm outline-none"
                  style={{ borderColor: "var(--border)", background: "var(--card)", color: "var(--text)" }}
                />
                <button
                  type="submit"
                  className="rounded-full px-3 py-1 text-sm font-bold"
                  style={{ background: "var(--accent-fort)", color: "var(--sur-accent)" }}
                >
                  OK
                </button>
              </form>
            </div>
            {pagesMushaf.length > 0 && (
              <div className="mt-2 flex items-center gap-2">
                <span className="shrink-0 text-xs font-bold uppercase tracking-wide" style={{ color: "var(--muted)" }}>
                  Page du mushaf
                </span>
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {pagesMushaf.map((p) => (
                    <button
                      key={p.page}
                      onClick={() => allerAuVerset(p.premierVerset)}
                      className="shrink-0 rounded-full border px-2.5 py-1 text-xs font-bold transition active:scale-95"
                      style={{ borderColor: "var(--border)", background: "var(--card)" }}
                      title={`Page ${p.page} — à partir du verset ${p.premierVerset}`}
                    >
                      {p.page}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ===== Basmala décorative (sauf Al-Fâtiha et At-Tawba) ===== */}
      {n !== 1 && n !== 9 && (
        <p
          className={`arabic mt-5 text-center text-2xl ${police}`}
          dir="rtl"
          style={{ color: "var(--accent-fort)" }}
        >
          {BASMALA}
        </p>
      )}

      {/* ===== Chargement / erreur ===== */}
      {!data && !erreur && (
        <div className="card mt-6 rounded-2xl p-8 text-center shadow-soft">
          <p
            className="flex animate-pulse justify-center"
            style={{ color: "var(--accent-fort)" }}
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
            style={{ color: "var(--accent-fort)" }}
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
            style={{ backgroundColor: "var(--accent-fort)" }}
          >
            Réessayer
          </button>
        </div>
      )}

      {/* ===== Versets ===== */}
      {data && (
        <main className="mt-5 space-y-4">
          {versetsAffiches.map((v, iv) => {
            const estMarque = marque?.s === n && marque?.v === v.n;
            const nouvellePage =
              v.page > 0 && (iv === 0 || versetsAffiches[iv - 1].page !== v.page);
            return (
              <div key={v.n} className="space-y-4">
              {nouvellePage && (
                <p className="ornement text-xs font-bold uppercase tracking-widest" aria-label={`Page ${v.page}`}>
                  Page {v.page}
                </p>
              )}
              <article
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
                              color: "var(--accent-fort)",
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
                        color: versetEnLecture(v.n) ? "var(--sur-accent)" : "var(--accent-fort)",
                        backgroundColor: versetEnLecture(v.n)
                          ? "var(--accent-fort)"
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
                  {v.words.map((word, wi) => {
                    const connu = prefs.vocabulaire
                      ? reconnaitre(formeDuMot(word), vocab)
                      : null;

                    return (
                    <button
                      key={wi}
                      onClick={(e) => clicMot(v.n, wi, word, e)}
                      className="rounded-md transition hover:opacity-75 active:scale-95"
                      style={{
                        backgroundColor: motEnLecture(v.n, wi)
                          ? "color-mix(in srgb, var(--accent) 25%, transparent)"
                          : undefined,
                        borderBottom: connu
                          ? "2px dotted color-mix(in srgb, var(--accent) 60%, transparent)"
                          : undefined,
                      }}
                      title={connu ? `${connu.sens} — mot mémorisé` : "Écouter ce mot"}
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
                    );
                  })}
                </div>

                {/* Phonétique (option) */}
                {prefs.phonetique && phonetiques?.[v.n - 1] && (
                  <p
                    className={`mt-3 italic ${TAILLES[taille].trad}`}
                    style={{ color: "var(--accent-fort)" }}
                  >
                    {phonetiques[v.n - 1]}
                  </p>
                )}

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
              </div>
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
        aria-hidden={!bulleReglesVisible}
        className="fixed right-6 z-30 flex items-center gap-2 rounded-full px-5 py-3 font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
        style={{
          backgroundColor: "var(--accent-fort)",
          bottom: "calc(1rem + var(--hauteur-onglets))",
          opacity: bulleReglesVisible ? 1 : 0,
          transform: bulleReglesVisible
            ? "translateY(0)"
            : "translateY(150%)",
          pointerEvents: bulleReglesVisible ? "auto" : "none",
        }}
      >
        <Goutte taille={18} className="text-white" /> Règles
      </button>

      {/* ===== Bulle mot actif (ancrée au mot touché) ===== */}
      {motActif && (
        <div
          ref={bulleRef}
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
                style={{ backgroundColor: "var(--accent-fort)" }}
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

            {/* Mot déjà mémorisé dans l'onglet vocabulaire */}
            {prefs.vocabulaire &&
              !VOCABULAIRE_MASQUE &&
              (() => {
                const connu = reconnaitre(formeDuMot(motActif.word), vocab);
                if (!connu) return null;
                const pack = packDuMot(connu.id);
                return (
                  <div
                    className="mt-2 flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs"
                    style={{
                      background:
                        "color-mix(in srgb, var(--accent) 12%, transparent)",
                    }}
                  >
                    <span style={{ color: "var(--accent-fort)" }}>
                      <Verifie taille={13} />
                    </span>
                    <span className="font-bold" style={{ color: "var(--accent-fort)" }}>
                      {connu.sens}
                    </span>
                    <span style={{ color: "var(--muted)" }}>· mot mémorisé</span>
                    {pack && (
                      <Link
                        href={`/vocabulaire/${pack.id}`}
                        className="ml-auto shrink-0 font-bold underline"
                        style={{ color: "var(--accent-fort)" }}
                      >
                        réviser
                      </Link>
                    )}
                  </div>
                );
              })()}

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
                        ? "var(--sur-accent)"
                        : "var(--accent-fort)",
                    backgroundColor:
                      lecture?.type === "paire" &&
                      lecture.v === motActif.v &&
                      lecture.w === motActif.w
                        ? "var(--accent-fort)"
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
                <span style={{ color: "var(--accent-fort)" }}>
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
              style={{ backgroundColor: "var(--accent-fort)" }}
            >
              Compris !
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
