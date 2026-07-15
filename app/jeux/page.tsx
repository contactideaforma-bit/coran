"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ALPHABET, LECONS, type Lettre } from "@/data/nourania";
import { QUESTIONS_QUIZ } from "@/data/quiz";
import { usePrefs } from "@/lib/prefs";
import { urlMot } from "@/lib/audio";
import Entete from "@/components/Entete";
import {
  HautParleur,
  Lettres,
  LivreOuvert,
  Manette,
  Trophee,
} from "@/components/Icones";

/* ===== Utilitaires ===== */

const NB_QUESTIONS = 10;

function melanger<T>(liste: T[]): T[] {
  const copie = [...liste];
  for (let i = copie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copie[i], copie[j]] = [copie[j], copie[i]];
  }
  return copie;
}

function lireRecords(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem("coran-jeux") ?? "{}");
  } catch {
    return {};
  }
}

function enregistrerRecord(cle: string, score: number) {
  const records = lireRecords();
  if (score > (records[cle] ?? 0)) {
    records[cle] = score;
    try {
      localStorage.setItem("coran-jeux", JSON.stringify(records));
    } catch {}
  }
}

function lireProgressionNourania(): number[] {
  try {
    const p = JSON.parse(localStorage.getItem("coran-nourania") ?? "[]");
    return Array.isArray(p) ? p : [];
  } catch {
    return [];
  }
}

/* ===== Niveaux basés sur les leçons Nourania ===== */

type NiveauId =
  | "lettres"
  | "voyelles"
  | "tanwin"
  | "madd"
  | "soukoun"
  | "shadda"
  | "mots";

const NIVEAUX: {
  id: NiveauId;
  nom: string;
  lecon: number;
  description: string;
}[] = [
  { id: "lettres", nom: "Les lettres", lecon: 1, description: "Reconnaître les 28 lettres à l'oreille" },
  { id: "voyelles", nom: "Les voyelles", lecon: 3, description: "ba, bi, bou : retrouver la bonne syllabe" },
  { id: "tanwin", nom: "Le tanwîn", lecon: 4, description: "ban, bin, boun : les doubles voyelles" },
  { id: "madd", nom: "Les prolongations", lecon: 5, description: "bâ, bî, boû : entendre le son qui s'allonge" },
  { id: "soukoun", nom: "Le soukoun", lecon: 6, description: "ab, ib, oub : les syllabes fermées" },
  { id: "shadda", nom: "La shadda", lecon: 7, description: "abba, ibbi : les lettres doublées" },
  { id: "mots", nom: "Les mots du Coran", lecon: 8, description: "Reconnaître de vrais mots (audio récité)" },
];

/** Familles de lettres proches (pour des pièges pertinents). */
const FAMILLES: string[][] = [
  ["ب", "ت", "ث", "ن", "ي"],
  ["ج", "ح", "خ"],
  ["د", "ذ", "ر", "ز"],
  ["س", "ش", "ص", "ض"],
  ["ط", "ظ"],
  ["ع", "غ"],
  ["ف", "ق"],
  ["ك", "ل"],
  ["ه", "م"],
  ["ا", "و"],
];

const memeFamille = (a: string, b: string) =>
  FAMILLES.some((f) => f.includes(a) && f.includes(b));

// Signes (Unicode)
const F = "َ", K = "ِ", D = "ُ";
const FN = "ً", KN = "ٍ", DN = "ٌ";
const SK = "ْ", SH = "ّ";

const CONSONNES = ALPHABET.filter((l) => l.arabe !== "ا");

interface Choix {
  arabe: string;
  translit: string;
}

interface Question {
  vocal: string; // texte pour la synthèse vocale
  audio?: [number, number, number]; // enregistrement réel si disponible
  bonne: Choix;
  options: Choix[];
  explication: string;
}

/** Les trois variantes d'une lettre pour un niveau syllabique. */
function variantes(l: Lettre, niveau: NiveauId): Choix[] {
  const a = l.arabe;
  const t = l.translit;
  switch (niveau) {
    case "voyelles":
      return [
        { arabe: `${a}${F}`, translit: `${t}a` },
        { arabe: `${a}${K}`, translit: `${t}i` },
        { arabe: `${a}${D}`, translit: `${t}ou` },
      ];
    case "tanwin":
      return [
        { arabe: `${a}${FN}`, translit: `${t}an` },
        { arabe: `${a}${KN}`, translit: `${t}in` },
        { arabe: `${a}${DN}`, translit: `${t}oun` },
      ];
    case "madd":
      return [
        { arabe: `${a}${F}ا`, translit: `${t}â` },
        { arabe: `${a}${K}ي`, translit: `${t}î` },
        { arabe: `${a}${D}و`, translit: `${t}oû` },
      ];
    case "soukoun":
      return [
        { arabe: `أ${F}${a}${SK}`, translit: `a${t}` },
        { arabe: `إ${K}${a}${SK}`, translit: `i${t}` },
        { arabe: `أ${D}${a}${SK}`, translit: `ou${t}` },
      ];
    case "shadda":
      return [
        { arabe: `أ${F}${a}${SH}${F}`, translit: `a${t}${t}a` },
        { arabe: `إ${K}${a}${SH}${K}`, translit: `i${t}${t}i` },
        { arabe: `أ${D}${a}${SH}${D}`, translit: `ou${t}${t}ou` },
      ];
    default:
      return [];
  }
}

function genererQuestions(niveau: NiveauId): Question[] {
  // Niveau lettres : retrouver la lettre entendue
  if (niveau === "lettres") {
    return melanger(ALPHABET)
      .slice(0, NB_QUESTIONS)
      .map((bonne) => {
        const distracteurs = melanger(
          ALPHABET.filter((l) => l.nom !== bonne.nom)
        ).slice(0, 3);
        return {
          vocal: bonne.nomArabe,
          bonne: { arabe: bonne.arabe, translit: bonne.nom },
          options: melanger(
            [bonne, ...distracteurs].map((l) => ({
              arabe: l.arabe,
              translit: l.nom,
            }))
          ),
          explication: `C'était ${bonne.nom} (${bonne.translit}) — ${bonne.conseil}`,
        };
      });
  }

  // Niveau mots : vrais mots du Coran avec audio récité
  if (niveau === "mots") {
    const mots = LECONS.find((l) => l.id === 8)!.elements;
    return melanger(mots)
      .slice(0, NB_QUESTIONS)
      .map((bon) => {
        const distracteurs = melanger(
          mots.filter((m) => m.principal !== bon.principal)
        ).slice(0, 3);
        return {
          vocal: bon.vocal,
          audio: bon.audio,
          bonne: { arabe: bon.principal, translit: bon.translit },
          options: melanger(
            [bon, ...distracteurs].map((m) => ({
              arabe: m.principal,
              translit: m.translit,
            }))
          ),
          explication: `${bon.translit} — ${bon.aide ?? ""}`,
        };
      });
  }

  // Niveaux syllabiques : la bonne syllabe parmi les 3 variantes de la
  // lettre + une variante d'une lettre proche (piège)
  return melanger(CONSONNES)
    .slice(0, NB_QUESTIONS)
    .map((lettre) => {
      const formes = variantes(lettre, niveau);
      const idx = Math.floor(Math.random() * 3);
      const bonne = formes[idx];
      const proches = CONSONNES.filter(
        (l) => l.nom !== lettre.nom && memeFamille(l.arabe, lettre.arabe)
      );
      const autre =
        proches[Math.floor(Math.random() * proches.length)] ??
        melanger(CONSONNES.filter((l) => l.nom !== lettre.nom))[0];
      const piege = variantes(autre, niveau)[idx];
      return {
        vocal: bonne.arabe,
        bonne,
        options: melanger([...formes, piege]),
        explication: `C'était « ${bonne.translit} » (lettre ${lettre.nom}).`,
      };
    });
}

/* ===== Habillage commun ===== */

function CadrePartie({
  question,
  score,
  children,
  quitter,
}: {
  question: number;
  score: number;
  children: React.ReactNode;
  quitter: () => void;
}) {
  return (
    <div className="card mt-6 rounded-3xl p-5 shadow-soft">
      <div className="mb-4 flex items-center justify-between text-sm font-bold">
        <button onClick={quitter} style={{ color: "var(--muted)" }}>
          ✕ Quitter
        </button>
        <span>
          Question {Math.min(question + 1, NB_QUESTIONS)}/{NB_QUESTIONS}
        </span>
        <span style={{ color: "var(--accent)" }}>{score} pts</span>
      </div>
      <div
        className="mb-5 h-2 overflow-hidden rounded-full"
        style={{ backgroundColor: "var(--border)" }}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${(question / NB_QUESTIONS) * 100}%`,
            backgroundColor: "var(--accent)",
          }}
        />
      </div>
      {children}
    </div>
  );
}

function EcranFin({
  cleRecord,
  score,
  rejouer,
  menu,
}: {
  cleRecord: string;
  score: number;
  rejouer: () => void;
  menu: () => void;
}) {
  const [record, setRecord] = useState(0);

  useEffect(() => {
    enregistrerRecord(cleRecord, score);
    setRecord(Math.max(lireRecords()[cleRecord] ?? 0, score));
  }, [cleRecord, score]);

  const message =
    score === NB_QUESTIONS
      ? "Parfait, mâshâ'Allâh !"
      : score >= 7
        ? "Très bien, continue comme ça !"
        : score >= 4
          ? "Pas mal ! Rejoue pour progresser."
          : "Chaque partie te fait progresser, réessaie !";

  return (
    <div className="card mt-6 rounded-3xl p-8 text-center shadow-soft">
      <p className="flex justify-center" style={{ color: "var(--accent)" }}>
        <Trophee taille={44} />
      </p>
      <p className="mt-3 text-3xl font-extrabold">
        {score}/{NB_QUESTIONS}
      </p>
      <p className="mt-1 font-bold">{message}</p>
      <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
        Record sur cet appareil : {record}/{NB_QUESTIONS}
      </p>
      <div className="mt-5 flex justify-center gap-2">
        <button
          onClick={rejouer}
          className="rounded-full px-6 py-2 font-bold text-white transition active:scale-95"
          style={{ backgroundColor: "var(--accent)" }}
        >
          Rejouer
        </button>
        <button onClick={menu} className="card rounded-full px-6 py-2 font-bold">
          Autres jeux
        </button>
      </div>
    </div>
  );
}

function BoutonReponse({
  contenu,
  etat,
  onClick,
  desactive,
}: {
  contenu: React.ReactNode;
  etat: "neutre" | "bon" | "mauvais";
  onClick: () => void;
  desactive: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={desactive}
      className="w-full rounded-xl border p-3 text-left font-semibold transition active:scale-[0.99]"
      style={{
        borderColor:
          etat === "bon"
            ? "#2e7d5b"
            : etat === "mauvais"
              ? "#dc2626"
              : "var(--border)",
        backgroundColor:
          etat === "bon"
            ? "color-mix(in srgb, #2e7d5b 15%, var(--card))"
            : etat === "mauvais"
              ? "color-mix(in srgb, #dc2626 12%, var(--card))"
              : "var(--card)",
      }}
    >
      {contenu}
    </button>
  );
}

/* ===== Jeu Nourania (tous niveaux) ===== */

function JeuNourania({
  niveau,
  quitter,
}: {
  niveau: NiveauId;
  quitter: () => void;
}) {
  const { prefs } = usePrefs();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [choix, setChoix] = useState<Choix | null>(null);
  const [fini, setFini] = useState(false);
  const [voixArabe, setVoixArabe] = useState<boolean | null>(null);
  const voixRef = useRef<SpeechSynthesisVoice | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof speechSynthesis === "undefined") {
      setVoixArabe(false);
      return;
    }
    const chercher = () => {
      const voix = speechSynthesis
        .getVoices()
        .find((v) => v.lang.toLowerCase().startsWith("ar"));
      voixRef.current = voix ?? null;
      setVoixArabe(!!voix);
    };
    chercher();
    speechSynthesis.addEventListener("voiceschanged", chercher);
    return () => speechSynthesis.removeEventListener("voiceschanged", chercher);
  }, []);

  const nouvellePartie = () => {
    setQuestions(genererQuestions(niveau));
    setIdx(0);
    setScore(0);
    setChoix(null);
    setFini(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(nouvellePartie, [niveau]);

  const prononcer = (texte: string) => {
    if (typeof speechSynthesis === "undefined") return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(texte);
    if (voixRef.current) u.voice = voixRef.current;
    u.lang = "ar-SA";
    u.rate = 0.7;
    speechSynthesis.speak(u);
  };

  const ecouter = (q: Question) => {
    audioRef.current?.pause();
    if (q.audio) {
      const [s, v, w] = q.audio;
      const audio = new Audio(urlMot(s, v, w));
      audioRef.current = audio;
      // Si l'enregistrement ne charge pas (hors-ligne…), replier sur la
      // synthèse vocale pour que la question reste jouable.
      let replie = false;
      const replier = () => {
        if (!replie) {
          replie = true;
          prononcer(q.vocal);
        }
      };
      audio.onerror = replier;
      audio.play().catch(replier);
      return;
    }
    prononcer(q.vocal);
  };

  // Jouer automatiquement à chaque nouvelle question
  useEffect(() => {
    const q = questions[idx];
    if (q && (q.audio || voixArabe)) ecouter(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, questions, voixArabe]);

  // Couper l'audio en quittant
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel();
    };
  }, []);

  if (fini)
    return (
      <EcranFin
        cleRecord={`nourania-${niveau}`}
        score={score}
        rejouer={nouvellePartie}
        menu={quitter}
      />
    );

  const q = questions[idx];
  if (!q) return null;

  const infos = NIVEAUX.find((n) => n.id === niveau)!;
  const audible = !!q.audio || voixArabe;

  const repondre = (c: Choix) => {
    if (choix) return;
    setChoix(c);
    if (c.arabe === q.bonne.arabe) setScore((s) => s + 1);
  };

  const suivant = () => {
    setChoix(null);
    if (idx + 1 >= questions.length) setFini(true);
    else setIdx((i) => i + 1);
  };

  return (
    <CadrePartie question={idx} score={score} quitter={quitter}>
      <p
        className="mb-2 text-center text-xs font-bold uppercase tracking-wide"
        style={{ color: "var(--muted)" }}
      >
        {infos.nom} (leçon {infos.lecon})
      </p>
      {audible ? (
        <>
          <p className="text-center font-bold">
            {niveau === "mots"
              ? "Quel mot entends-tu ?"
              : niveau === "lettres"
                ? "Quelle lettre entends-tu ?"
                : "Quelle syllabe entends-tu ?"}
          </p>
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => ecouter(q)}
              className="flex h-16 w-16 items-center justify-center rounded-full text-white transition hover:scale-105 active:scale-95"
              style={{ backgroundColor: "var(--accent)" }}
              aria-label="Réécouter"
            >
              <HautParleur taille={28} className="text-white" />
            </button>
          </div>
        </>
      ) : (
        <p className="text-center font-bold">
          Trouve :{" "}
          <span style={{ color: "var(--accent)" }}>{q.bonne.translit}</span>
        </p>
      )}
      <div
        className={`mt-5 grid gap-2 ${
          q.options.length > 4 ? "grid-cols-3" : "grid-cols-2"
        }`}
      >
        {q.options.map((c) => (
          <BoutonReponse
            key={c.arabe}
            desactive={!!choix}
            onClick={() => repondre(c)}
            etat={
              !choix
                ? "neutre"
                : c.arabe === q.bonne.arabe
                  ? "bon"
                  : c.arabe === choix.arabe
                    ? "mauvais"
                    : "neutre"
            }
            contenu={
              <span
                className={`arabic block text-center ${
                  niveau === "mots" ? "text-3xl" : "text-4xl"
                } ${prefs.police}`}
                dir="rtl"
              >
                {c.arabe}
              </span>
            }
          />
        ))}
      </div>
      {choix && (
        <div className="mt-4 space-y-3">
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            {q.explication}
          </p>
          <button
            onClick={suivant}
            className="w-full rounded-full px-6 py-3 font-bold text-white transition active:scale-95"
            style={{ backgroundColor: "var(--accent)" }}
          >
            {idx + 1 >= questions.length ? "Voir mon score" : "Question suivante"}
          </button>
        </div>
      )}
    </CadrePartie>
  );
}

/** Choix du niveau, aligné sur la progression Nourania. */
function ChoixNiveau({
  records,
  choisir,
  retour,
}: {
  records: Record<string, number>;
  choisir: (n: NiveauId) => void;
  retour: () => void;
}) {
  const progression = lireProgressionNourania();
  // Niveau conseillé : celui de la leçon terminée la plus avancée
  const derniereLecon = Math.max(0, ...progression);
  const conseille =
    [...NIVEAUX].reverse().find((n) => n.lecon <= derniereLecon)?.id ??
    "lettres";

  return (
    <div className="mt-6 space-y-3">
      <p className="text-center font-bold">
        Choisis ton niveau (suivant tes leçons Nourania) :
      </p>
      {NIVEAUX.map((n) => (
        <button
          key={n.id}
          onClick={() => choisir(n.id)}
          className="card flex w-full items-center gap-4 rounded-2xl p-4 text-left shadow-soft transition hover:scale-[1.01] active:scale-[0.99]"
        >
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-extrabold"
            style={{ borderColor: "var(--accent)", color: "var(--accent)" }}
          >
            L{n.lecon}
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-2 font-extrabold">
              {n.nom}
              {n.id === conseille && (
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                  style={{ backgroundColor: "var(--accent)" }}
                >
                  Conseillé
                </span>
              )}
            </span>
            <span className="block text-sm" style={{ color: "var(--muted)" }}>
              {n.description}
            </span>
            {(records[`nourania-${n.id}`] ?? 0) > 0 && (
              <span
                className="mt-1 flex items-center gap-1 text-xs font-bold"
                style={{ color: "var(--accent)" }}
              >
                <Trophee taille={13} /> Record : {records[`nourania-${n.id}`]}/
                {NB_QUESTIONS}
              </span>
            )}
          </span>
          <span style={{ color: "var(--accent)" }}>→</span>
        </button>
      ))}
      <button
        onClick={retour}
        className="card mx-auto block rounded-full px-6 py-2 font-bold"
      >
        ← Retour aux jeux
      </button>
    </div>
  );
}

/* ===== Quiz connaissances ===== */

interface QuestionPreparee {
  question: string;
  bonne: string;
  options: string[];
  explication: string;
}

function JeuQuiz({ quitter }: { quitter: () => void }) {
  const [questions, setQuestions] = useState<QuestionPreparee[]>([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [choix, setChoix] = useState<string | null>(null);
  const [fini, setFini] = useState(false);

  const nouvellePartie = () => {
    const qs = melanger(QUESTIONS_QUIZ)
      .slice(0, NB_QUESTIONS)
      .map((q) => ({
        question: q.question,
        bonne: q.options[0],
        options: melanger(q.options),
        explication: q.explication,
      }));
    setQuestions(qs);
    setIdx(0);
    setScore(0);
    setChoix(null);
    setFini(false);
  };

  useEffect(nouvellePartie, []);

  if (fini)
    return (
      <EcranFin
        cleRecord="quiz"
        score={score}
        rejouer={nouvellePartie}
        menu={quitter}
      />
    );

  const q = questions[idx];
  if (!q) return null;

  const repondre = (o: string) => {
    if (choix) return;
    setChoix(o);
    if (o === q.bonne) setScore((s) => s + 1);
  };

  const suivant = () => {
    setChoix(null);
    if (idx + 1 >= questions.length) setFini(true);
    else setIdx((i) => i + 1);
  };

  return (
    <CadrePartie question={idx} score={score} quitter={quitter}>
      <p className="text-center font-bold">{q.question}</p>
      <div className="mt-5 space-y-2">
        {q.options.map((o) => (
          <BoutonReponse
            key={o}
            desactive={!!choix}
            onClick={() => repondre(o)}
            etat={
              !choix
                ? "neutre"
                : o === q.bonne
                  ? "bon"
                  : o === choix
                    ? "mauvais"
                    : "neutre"
            }
            contenu={o}
          />
        ))}
      </div>
      {choix && (
        <div className="mt-4 space-y-3">
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            {q.explication}
          </p>
          <button
            onClick={suivant}
            className="w-full rounded-full px-6 py-3 font-bold text-white transition active:scale-95"
            style={{ backgroundColor: "var(--accent)" }}
          >
            {idx + 1 >= questions.length ? "Voir mon score" : "Question suivante"}
          </button>
        </div>
      )}
    </CadrePartie>
  );
}

/* ===== Page ===== */

type Ecran =
  | { vue: "menu" }
  | { vue: "choix-niveau" }
  | { vue: "nourania"; niveau: NiveauId }
  | { vue: "quiz" };

export default function Jeux() {
  const [ecran, setEcran] = useState<Ecran>({ vue: "menu" });
  const [records, setRecords] = useState<Record<string, number>>({});

  useEffect(() => {
    if (ecran.vue === "menu" || ecran.vue === "choix-niveau") {
      setRecords(lireRecords());
    }
  }, [ecran]);

  const meilleurNourania = Math.max(
    0,
    ...NIVEAUX.map((n) => records[`nourania-${n.id}`] ?? 0)
  );

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
          <Manette taille={22} /> Jeux
        </h2>
      </section>

      {ecran.vue === "menu" && (
        <>
          <p
            className="mt-4 text-center text-sm"
            style={{ color: "var(--muted)" }}
          >
            10 questions par partie. Apprends en t&apos;amusant !
          </p>
          <main className="mt-5 space-y-3">
            <button
              onClick={() => setEcran({ vue: "choix-niveau" })}
              className="card flex w-full items-center gap-4 rounded-2xl p-5 text-left shadow-soft transition hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="tuile-icone">
                <Lettres taille={24} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-extrabold">Jeu Nourania</span>
                <span
                  className="block text-sm"
                  style={{ color: "var(--muted)" }}
                >
                  Entraîne ton oreille, leçon par leçon (7 niveaux)
                </span>
                {meilleurNourania > 0 && (
                  <span
                    className="mt-1 flex items-center gap-1 text-xs font-bold"
                    style={{ color: "var(--accent)" }}
                  >
                    <Trophee taille={13} /> Meilleur record : {meilleurNourania}
                    /{NB_QUESTIONS}
                  </span>
                )}
              </span>
              <span style={{ color: "var(--accent)" }}>→</span>
            </button>

            <button
              onClick={() => setEcran({ vue: "quiz" })}
              className="card flex w-full items-center gap-4 rounded-2xl p-5 text-left shadow-soft transition hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="tuile-icone">
                <LivreOuvert taille={24} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-extrabold">Quiz connaissances</span>
                <span
                  className="block text-sm"
                  style={{ color: "var(--muted)" }}
                >
                  Événements, hadiths, tajwid : teste-toi !
                </span>
                {(records["quiz"] ?? 0) > 0 && (
                  <span
                    className="mt-1 flex items-center gap-1 text-xs font-bold"
                    style={{ color: "var(--accent)" }}
                  >
                    <Trophee taille={13} /> Record : {records["quiz"]}/
                    {NB_QUESTIONS}
                  </span>
                )}
              </span>
              <span style={{ color: "var(--accent)" }}>→</span>
            </button>
          </main>
        </>
      )}

      {ecran.vue === "choix-niveau" && (
        <ChoixNiveau
          records={records}
          choisir={(niveau) => setEcran({ vue: "nourania", niveau })}
          retour={() => setEcran({ vue: "menu" })}
        />
      )}

      {ecran.vue === "nourania" && (
        <JeuNourania
          niveau={ecran.niveau}
          quitter={() => setEcran({ vue: "choix-niveau" })}
        />
      )}

      {ecran.vue === "quiz" && (
        <JeuQuiz quitter={() => setEcran({ vue: "menu" })} />
      )}
    </div>
  );
}
