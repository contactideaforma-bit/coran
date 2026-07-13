"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ALPHABET, type Lettre } from "@/data/nourania";
import { QUESTIONS_QUIZ } from "@/data/quiz";
import { usePrefs } from "@/lib/prefs";
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

/* ===== Niveaux du jeu des lettres ===== */

type Niveau = "facile" | "moyen" | "difficile";

const NIVEAUX: { id: Niveau; nom: string; description: string; choix: number }[] = [
  {
    id: "facile",
    nom: "Facile",
    description: "3 propositions, lettres bien différentes",
    choix: 3,
  },
  {
    id: "moyen",
    nom: "Moyen",
    description: "4 propositions au hasard",
    choix: 4,
  },
  {
    id: "difficile",
    nom: "Difficile",
    description: "6 propositions, avec les lettres qui se ressemblent",
    choix: 6,
  },
];

/** Familles de lettres visuellement ou auditivement proches. */
const FAMILLES: string[][] = [
  ["ب", "ت", "ث", "ن", "ي"],
  ["ج", "ح", "خ"],
  ["د", "ذ", "ر", "ز"],
  ["س", "ش", "ص", "ض"],
  ["ط", "ظ"],
  ["ع", "غ"],
  ["ف", "ق"],
  ["ك", "ل"],
  ["ه", "ة", "م"],
  ["ا", "و"],
];

function famille(lettre: string): string[] {
  return FAMILLES.find((f) => f.includes(lettre)) ?? [];
}

function memeFamille(a: string, b: string): boolean {
  return famille(a).includes(b);
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

/* ===== Jeu des lettres ===== */

interface QuestionLettre {
  bonne: Lettre;
  options: Lettre[];
}

function genererQuestions(niveau: Niveau): QuestionLettre[] {
  const nbChoix = NIVEAUX.find((n) => n.id === niveau)!.choix;
  return melanger(ALPHABET)
    .slice(0, NB_QUESTIONS)
    .map((bonne) => {
      const autres = ALPHABET.filter((l) => l.nom !== bonne.nom);
      let distracteurs: Lettre[];
      if (niveau === "facile") {
        // Lettres d'autres familles : visuellement bien distinctes
        distracteurs = melanger(
          autres.filter((l) => !memeFamille(bonne.arabe, l.arabe))
        ).slice(0, nbChoix - 1);
      } else if (niveau === "difficile") {
        // D'abord les lettres de la même famille, puis compléter au hasard
        const proches = melanger(
          autres.filter((l) => memeFamille(bonne.arabe, l.arabe))
        );
        const restants = melanger(
          autres.filter((l) => !memeFamille(bonne.arabe, l.arabe))
        );
        distracteurs = [...proches, ...restants].slice(0, nbChoix - 1);
      } else {
        distracteurs = melanger(autres).slice(0, nbChoix - 1);
      }
      return { bonne, options: melanger([bonne, ...distracteurs]) };
    });
}

function JeuLettres({
  niveau,
  quitter,
}: {
  niveau: Niveau;
  quitter: () => void;
}) {
  const { prefs } = usePrefs();
  const [questions, setQuestions] = useState<QuestionLettre[]>([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [choix, setChoix] = useState<Lettre | null>(null);
  const [fini, setFini] = useState(false);
  const [voixArabe, setVoixArabe] = useState<boolean | null>(null);
  const voixRef = useRef<SpeechSynthesisVoice | null>(null);

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

  const prononcer = (l: Lettre) => {
    if (typeof speechSynthesis === "undefined") return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(l.nomArabe);
    if (voixRef.current) u.voice = voixRef.current;
    u.lang = "ar-SA";
    u.rate = 0.75;
    speechSynthesis.speak(u);
  };

  // Prononcer automatiquement à chaque nouvelle question
  useEffect(() => {
    const q = questions[idx];
    if (q && voixArabe) prononcer(q.bonne);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, questions, voixArabe]);

  if (fini)
    return (
      <EcranFin
        cleRecord={`lettres-${niveau}`}
        score={score}
        rejouer={nouvellePartie}
        menu={quitter}
      />
    );

  const q = questions[idx];
  if (!q) return null;

  const repondre = (l: Lettre) => {
    if (choix) return;
    setChoix(l);
    if (l.nom === q.bonne.nom) setScore((s) => s + 1);
  };

  const suivant = () => {
    setChoix(null);
    if (idx + 1 >= questions.length) setFini(true);
    else setIdx((i) => i + 1);
  };

  const nomNiveau = NIVEAUX.find((n) => n.id === niveau)!.nom;

  return (
    <CadrePartie question={idx} score={score} quitter={quitter}>
      <p
        className="mb-2 text-center text-xs font-bold uppercase tracking-wide"
        style={{ color: "var(--muted)" }}
      >
        Niveau {nomNiveau}
      </p>
      {voixArabe ? (
        <>
          <p className="text-center font-bold">Quelle lettre entends-tu ?</p>
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => prononcer(q.bonne)}
              className="flex h-16 w-16 items-center justify-center rounded-full text-white transition hover:scale-105 active:scale-95"
              style={{ backgroundColor: "var(--accent)" }}
              aria-label="Réécouter la lettre"
            >
              <HautParleur taille={28} className="text-white" />
            </button>
          </div>
        </>
      ) : (
        <p className="text-center font-bold">
          Trouve la lettre : {q.bonne.nom}{" "}
          <span style={{ color: "var(--accent)" }}>({q.bonne.translit})</span>
        </p>
      )}
      <div
        className={`mt-5 grid gap-2 ${
          q.options.length > 4 ? "grid-cols-3" : "grid-cols-2"
        }`}
      >
        {q.options.map((l) => (
          <BoutonReponse
            key={l.nom}
            desactive={!!choix}
            onClick={() => repondre(l)}
            etat={
              !choix
                ? "neutre"
                : l.nom === q.bonne.nom
                  ? "bon"
                  : l.nom === choix.nom
                    ? "mauvais"
                    : "neutre"
            }
            contenu={
              <span
                className={`arabic block text-center text-4xl ${prefs.police}`}
              >
                {l.arabe}
              </span>
            }
          />
        ))}
      </div>
      {choix && (
        <div className="mt-4 space-y-3">
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            C&apos;était {q.bonne.nom} ({q.bonne.translit}) — {q.bonne.conseil}
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

/** Écran de choix du niveau. */
function ChoixNiveau({
  records,
  choisir,
  retour,
}: {
  records: Record<string, number>;
  choisir: (n: Niveau) => void;
  retour: () => void;
}) {
  return (
    <div className="mt-6 space-y-3">
      <p className="text-center font-bold">Choisis ton niveau :</p>
      {NIVEAUX.map((n) => (
        <button
          key={n.id}
          onClick={() => choisir(n.id)}
          className="card flex w-full items-center gap-4 rounded-2xl p-5 text-left shadow-soft transition hover:scale-[1.02] active:scale-[0.98]"
        >
          <span className="min-w-0 flex-1">
            <span className="block font-extrabold">{n.nom}</span>
            <span className="block text-sm" style={{ color: "var(--muted)" }}>
              {n.description}
            </span>
            {(records[`lettres-${n.id}`] ?? 0) > 0 && (
              <span
                className="mt-1 flex items-center gap-1 text-xs font-bold"
                style={{ color: "var(--accent)" }}
              >
                <Trophee taille={13} /> Record : {records[`lettres-${n.id}`]}/
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
  | { vue: "lettres"; niveau: Niveau }
  | { vue: "quiz" };

export default function Jeux() {
  const [ecran, setEcran] = useState<Ecran>({ vue: "menu" });
  const [records, setRecords] = useState<Record<string, number>>({});

  useEffect(() => {
    if (ecran.vue === "menu" || ecran.vue === "choix-niveau") {
      setRecords(lireRecords());
    }
  }, [ecran]);

  const meilleurLettres = Math.max(
    records["lettres-facile"] ?? 0,
    records["lettres-moyen"] ?? 0,
    records["lettres-difficile"] ?? 0
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
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--accent) 15%, transparent)",
                  color: "var(--accent)",
                }}
              >
                <Lettres taille={24} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-extrabold">Jeu des lettres</span>
                <span
                  className="block text-sm"
                  style={{ color: "var(--muted)" }}
                >
                  Écoute une lettre et retrouve-la — 3 niveaux de difficulté
                </span>
                {meilleurLettres > 0 && (
                  <span
                    className="mt-1 flex items-center gap-1 text-xs font-bold"
                    style={{ color: "var(--accent)" }}
                  >
                    <Trophee taille={13} /> Meilleur record : {meilleurLettres}/
                    {NB_QUESTIONS}
                  </span>
                )}
              </span>
              <span style={{ color: "var(--accent)" }}>→</span>
            </button>

            <button
              onClick={() => setEcran({ vue: "quiz" })}
              className="card flex w-full items-center gap-4 rounded-2xl p-5 text-left shadow-soft transition hover:scale-[1.02] active:scale-[0.98]"
            >
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--accent) 15%, transparent)",
                  color: "var(--accent)",
                }}
              >
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
          choisir={(niveau) => setEcran({ vue: "lettres", niveau })}
          retour={() => setEcran({ vue: "menu" })}
        />
      )}

      {ecran.vue === "lettres" && (
        <JeuLettres
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
