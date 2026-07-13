"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { chargerSourate, type Word } from "@/lib/coran";
import { ALPHABET, type Lettre } from "@/data/nourania";
import { QUESTIONS_QUIZ } from "@/data/quiz";
import { TAJWID_RULES, RULE_BY_ID, type TajwidRule } from "@/lib/tajwid";
import { usePrefs } from "@/lib/prefs";
import Entete from "@/components/Entete";
import {
  Goutte,
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

type JeuId = "tajwid" | "lettres" | "quiz";

function lireRecords(): Record<JeuId, number> {
  try {
    return {
      tajwid: 0,
      lettres: 0,
      quiz: 0,
      ...JSON.parse(localStorage.getItem("coran-jeux") ?? "{}"),
    };
  } catch {
    return { tajwid: 0, lettres: 0, quiz: 0 };
  }
}

function enregistrerRecord(jeu: JeuId, score: number) {
  const records = lireRecords();
  if (score > records[jeu]) {
    records[jeu] = score;
    try {
      localStorage.setItem("coran-jeux", JSON.stringify(records));
    } catch {}
  }
}

/* ===== Habillage commun d'une partie ===== */

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
  jeu,
  score,
  rejouer,
  menu,
}: {
  jeu: JeuId;
  score: number;
  rejouer: () => void;
  menu: () => void;
}) {
  const [record, setRecord] = useState(0);

  useEffect(() => {
    enregistrerRecord(jeu, score);
    setRecord(Math.max(lireRecords()[jeu], score));
  }, [jeu, score]);

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

/** Bouton de réponse avec feedback (vert = bon, contour rouge = mauvais choix). */
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

/* ===== Jeu 1 : Quiz tajwid ===== */

const SOURATES_JEU = [1, 78, 82, 84, 86, 87, 89, 91, 93, 95, 97, 99, 101, 103, 107, 109, 112, 113, 114];

interface QuestionTajwid {
  word: Word;
  bonne: TajwidRule;
  options: TajwidRule[];
}

function JeuTajwid({ quitter }: { quitter: () => void }) {
  const { prefs } = usePrefs();
  const [questions, setQuestions] = useState<QuestionTajwid[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [choix, setChoix] = useState<TajwidRule | null>(null);
  const [fini, setFini] = useState(false);
  const [cle, setCle] = useState(0); // pour rejouer

  useEffect(() => {
    let annule = false;
    setQuestions(null);
    setIdx(0);
    setScore(0);
    setChoix(null);
    setFini(false);
    (async () => {
      const pool = melanger(SOURATES_JEU).slice(0, 3);
      const candidats: { word: Word; regles: TajwidRule[] }[] = [];
      for (const n of pool) {
        try {
          const d = await chargerSourate(n);
          for (const v of d.verses) {
            for (const w of v.words) {
              const ids = Array.from(
                new Set(w.segments.filter((s) => s.r).map((s) => s.r!))
              );
              if (ids.length >= 1 && w.segments.length >= 2) {
                candidats.push({ word: w, regles: ids.map((i) => RULE_BY_ID[i]) });
              }
            }
          }
        } catch {}
      }
      if (annule) return;
      const qs: QuestionTajwid[] = melanger(candidats)
        .slice(0, NB_QUESTIONS)
        .map((c) => {
          const bonne = c.regles[Math.floor(Math.random() * c.regles.length)];
          const distracteurs = melanger(
            TAJWID_RULES.filter((r) => !c.regles.some((x) => x.id === r.id))
          ).slice(0, 3);
          return { word: c.word, bonne, options: melanger([bonne, ...distracteurs]) };
        });
      setQuestions(qs);
    })();
    return () => {
      annule = true;
    };
  }, [cle]);

  if (fini)
    return (
      <EcranFin
        jeu="tajwid"
        score={score}
        rejouer={() => setCle((c) => c + 1)}
        menu={quitter}
      />
    );

  if (!questions)
    return (
      <div className="card mt-6 rounded-3xl p-8 text-center shadow-soft">
        <p className="flex animate-pulse justify-center" style={{ color: "var(--accent)" }}>
          <LivreOuvert taille={36} />
        </p>
        <p className="mt-2 font-bold">Préparation des questions…</p>
      </div>
    );

  const q = questions[idx];
  const couleur = (r: TajwidRule) => (prefs.dark ? r.couleurSombre : r.couleur);

  const repondre = (r: TajwidRule) => {
    if (choix) return;
    setChoix(r);
    if (r.id === q.bonne.id) setScore((s) => s + 1);
  };

  const suivant = () => {
    setChoix(null);
    if (idx + 1 >= questions.length) setFini(true);
    else setIdx((i) => i + 1);
  };

  return (
    <CadrePartie question={idx} score={score} quitter={quitter}>
      <p className="text-center font-bold">
        Quelle règle de tajwid est colorée dans ce mot ?
      </p>
      <p
        className={`arabic mt-4 text-center text-5xl ${prefs.police}`}
        dir="rtl"
      >
        {q.word.segments.map((s, si) =>
          s.r ? (
            <span key={si} style={{ color: couleur(RULE_BY_ID[s.r]) }}>
              {s.t}
            </span>
          ) : (
            <span key={si}>{s.t}</span>
          )
        )}
      </p>
      <div className="mt-5 space-y-2">
        {q.options.map((r) => (
          <BoutonReponse
            key={r.id}
            desactive={!!choix}
            onClick={() => repondre(r)}
            etat={
              !choix
                ? "neutre"
                : r.id === q.bonne.id
                  ? "bon"
                  : r.id === choix.id
                    ? "mauvais"
                    : "neutre"
            }
            contenu={
              <span className="flex items-center gap-2">
                <span
                  className="tajwid-dot"
                  style={{ backgroundColor: couleur(r) }}
                />
                {r.nom}
              </span>
            }
          />
        ))}
      </div>
      {choix && (
        <div className="mt-4 space-y-3">
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            {q.bonne.resume} — {q.bonne.detail}
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

/* ===== Jeu 2 : Jeu des lettres ===== */

interface QuestionLettre {
  bonne: Lettre;
  options: Lettre[];
}

function JeuLettres({ quitter }: { quitter: () => void }) {
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
    const qs = melanger(ALPHABET)
      .slice(0, NB_QUESTIONS)
      .map((bonne) => ({
        bonne,
        options: melanger([
          bonne,
          ...melanger(ALPHABET.filter((l) => l.nom !== bonne.nom)).slice(0, 3),
        ]),
      }));
    setQuestions(qs);
    setIdx(0);
    setScore(0);
    setChoix(null);
    setFini(false);
  };

  useEffect(nouvellePartie, []);

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
      <EcranFin jeu="lettres" score={score} rejouer={nouvellePartie} menu={quitter} />
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

  return (
    <CadrePartie question={idx} score={score} quitter={quitter}>
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
      <div className="mt-5 grid grid-cols-2 gap-2">
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

/* ===== Jeu 3 : Quiz connaissances ===== */

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
      <EcranFin jeu="quiz" score={score} rejouer={nouvellePartie} menu={quitter} />
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

const JEUX: {
  id: JeuId;
  nom: string;
  description: string;
  icone: (p: { taille?: number }) => JSX.Element;
}[] = [
  {
    id: "tajwid",
    nom: "Quiz tajwid",
    description: "Retrouve la règle colorée dans un vrai mot du Coran",
    icone: Goutte,
  },
  {
    id: "lettres",
    nom: "Jeu des lettres",
    description: "Écoute une lettre et retrouve-la parmi quatre",
    icone: Lettres,
  },
  {
    id: "quiz",
    nom: "Quiz connaissances",
    description: "Événements, hadiths, tajwid : teste-toi !",
    icone: LivreOuvert,
  },
];

export default function Jeux() {
  const [jeu, setJeu] = useState<JeuId | null>(null);
  const [records, setRecords] = useState<Record<JeuId, number> | null>(null);

  useEffect(() => {
    if (jeu === null) setRecords(lireRecords());
  }, [jeu]);

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

      {jeu === null && (
        <>
          <p
            className="mt-4 text-center text-sm"
            style={{ color: "var(--muted)" }}
          >
            10 questions par partie. Apprends en t&apos;amusant !
          </p>
          <main className="mt-5 space-y-3">
            {JEUX.map((j) => (
              <button
                key={j.id}
                onClick={() => setJeu(j.id)}
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
                  <j.icone taille={24} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-extrabold">{j.nom}</span>
                  <span
                    className="block text-sm"
                    style={{ color: "var(--muted)" }}
                  >
                    {j.description}
                  </span>
                  {records && records[j.id] > 0 && (
                    <span
                      className="mt-1 flex items-center gap-1 text-xs font-bold"
                      style={{ color: "var(--accent)" }}
                    >
                      <Trophee taille={13} /> Record : {records[j.id]}/
                      {NB_QUESTIONS}
                    </span>
                  )}
                </span>
                <span style={{ color: "var(--accent)" }}>→</span>
              </button>
            ))}
          </main>
        </>
      )}

      {jeu === "tajwid" && <JeuTajwid quitter={() => setJeu(null)} />}
      {jeu === "lettres" && <JeuLettres quitter={() => setJeu(null)} />}
      {jeu === "quiz" && <JeuQuiz quitter={() => setJeu(null)} />}
    </div>
  );
}
