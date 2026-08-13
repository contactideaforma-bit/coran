"use client";

/**
 * Les exercices d'une session de vocabulaire.
 *
 * Chaque exercice appelle `onReponse(juste)` une fois que l'utilisateur a
 * validé et lu la correction. La carte de découverte, elle, n'est jamais
 * comptée comme une réponse : elle sert seulement à présenter le mot.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Mot } from "@/data/vocabulaire";
import { leurres, trouverMotDansVerset } from "@/lib/vocabulaire";
import { chargerSourate } from "@/lib/coran";
import { SOURATES } from "@/data/sourates";
import { Alerte, HautParleur, Verifie } from "@/components/Icones";

export type TypeExercice = "carte" | "qcmArFr" | "qcmFrAr" | "audio" | "verset";

/* ============================================================== Outils ==== */

function melanger<T>(liste: T[]): T[] {
  const t = [...liste];
  for (let i = t.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [t[i], t[j]] = [t[j], t[i]];
  }
  return t;
}

/** Prononce un mot arabe avec la synthèse vocale du navigateur. */
export function dire(texte: string) {
  try {
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel();
    const message = new SpeechSynthesisUtterance(texte);
    message.lang = "ar-SA";
    message.rate = 0.75;
    const voix = synth.getVoices().find((v) => v.lang.startsWith("ar"));
    if (voix) message.voice = voix;
    synth.speak(message);
  } catch {}
}

function refVerset(mot: Mot): string {
  const sourate = SOURATES.find((s) => s.n === mot.exemple[0]);
  return `${sourate?.nom ?? `Sourate ${mot.exemple[0]}`} ${mot.exemple[0]}:${mot.exemple[1]}`;
}

/* ======================================================== Sous-éléments === */

function Correction({
  juste,
  mot,
  onSuivant,
}: {
  juste: boolean;
  mot: Mot;
  onSuivant: () => void;
}) {
  return (
    <div className="mt-5">
      <div
        className="flex items-start gap-2 rounded-2xl p-4"
        style={{
          background: juste ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
          color: juste ? "rgb(21,128,61)" : "rgb(185,28,28)",
        }}
      >
        <span className="mt-0.5 shrink-0">
          {juste ? <Verifie taille={18} /> : <Alerte taille={18} />}
        </span>
        <div className="min-w-0">
          <p className="font-bold">
            {juste ? "Bonne réponse" : `Réponse : ${mot.sens}`}
          </p>
          {mot.precision && (
            <p className="mt-1 text-sm opacity-90">{mot.precision}</p>
          )}
        </div>
      </div>

      <button
        onClick={onSuivant}
        className="mt-4 w-full rounded-2xl px-4 py-3.5 font-extrabold text-white transition active:scale-[0.98]"
        style={{ background: "var(--accent)" }}
      >
        Suivant
      </button>
    </div>
  );
}

function Choix({
  options,
  bonne,
  arabe,
  choisi,
  onChoisir,
}: {
  options: string[];
  bonne: string;
  arabe?: boolean;
  choisi: string | null;
  onChoisir: (valeur: string) => void;
}) {
  return (
    <div className="mt-6 grid gap-2.5">
      {options.map((option) => {
        const actif = choisi !== null;
        const estBonne = option === bonne;
        const estChoisie = option === choisi;

        let style: React.CSSProperties = { borderColor: "var(--border)" };
        if (actif && estBonne) {
          style = { borderColor: "rgb(34,197,94)", background: "rgba(34,197,94,0.12)" };
        } else if (actif && estChoisie) {
          style = { borderColor: "rgb(239,68,68)", background: "rgba(239,68,68,0.12)" };
        }

        return (
          <button
            key={option}
            disabled={actif}
            onClick={() => onChoisir(option)}
            style={style}
            className={`card rounded-2xl border-2 px-4 py-3.5 text-left transition active:scale-[0.98] disabled:cursor-default ${
              arabe ? "arabic font-amiri text-2xl text-right" : "font-bold"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

/* ============================================================== Carte ===== */

function Carte({ mot, onSuivant }: { mot: Mot; onSuivant: () => void }) {
  useEffect(() => {
    dire(mot.arabe);
  }, [mot.arabe]);

  return (
    <div className="text-center">
      <p className="text-sm font-bold" style={{ color: "var(--muted)" }}>
        Nouveau mot
      </p>

      <p className="arabic font-amiri mt-4 text-6xl" style={{ color: "var(--accent)" }}>
        {mot.arabe}
      </p>
      <p className="mt-2 text-lg italic" style={{ color: "var(--muted)" }}>
        {mot.translit}
      </p>

      <button
        onClick={() => dire(mot.arabe)}
        className="mx-auto mt-4 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold"
        style={{ background: "var(--card)", color: "var(--accent)" }}
      >
        <HautParleur taille={16} /> Écouter
      </button>

      <p className="mt-6 text-3xl font-extrabold">{mot.sens}</p>
      {mot.precision && (
        <p className="mx-auto mt-3 max-w-md text-sm" style={{ color: "var(--muted)" }}>
          {mot.precision}
        </p>
      )}

      <div
        className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs"
        style={{ color: "var(--muted)" }}
      >
        {mot.racine && (
          <span>
            Racine <span className="arabic font-amiri text-base">{mot.racine}</span>
          </span>
        )}
        <span>{mot.frequence.toLocaleString("fr-FR")} mots du Coran</span>
        <span>{refVerset(mot)}</span>
      </div>

      <button
        onClick={onSuivant}
        className="mt-8 w-full rounded-2xl px-4 py-3.5 font-extrabold text-white transition active:scale-[0.98]"
        style={{ background: "var(--accent)" }}
      >
        J'ai compris
      </button>
    </div>
  );
}

/* ========================================================= QCM arabe → fr = */

function QcmArFr({
  mot,
  onReponse,
  audio,
}: {
  mot: Mot;
  onReponse: (juste: boolean) => void;
  audio?: boolean;
}) {
  const options = useMemo(
    () => melanger([mot.sens, ...leurres(mot).map((m) => m.sens)]),
    [mot]
  );
  const [choisi, setChoisi] = useState<string | null>(null);

  useEffect(() => {
    if (audio) dire(mot.arabe);
  }, [audio, mot.arabe]);

  return (
    <div>
      <p className="text-center text-sm font-bold" style={{ color: "var(--muted)" }}>
        {audio ? "Écoute et choisis la traduction" : "Que veut dire ce mot ?"}
      </p>

      {audio ? (
        <button
          onClick={() => dire(mot.arabe)}
          className="mx-auto mt-6 flex h-24 w-24 items-center justify-center rounded-full text-white transition active:scale-95"
          style={{ background: "var(--accent)" }}
          aria-label="Réécouter le mot"
        >
          <HautParleur taille={40} />
        </button>
      ) : (
        <p
          className="arabic font-amiri mt-6 text-center text-6xl"
          style={{ color: "var(--accent)" }}
        >
          {mot.arabe}
        </p>
      )}

      <Choix
        options={options}
        bonne={mot.sens}
        choisi={choisi}
        onChoisir={setChoisi}
      />

      {choisi !== null && (
        <Correction
          juste={choisi === mot.sens}
          mot={mot}
          onSuivant={() => onReponse(choisi === mot.sens)}
        />
      )}
    </div>
  );
}

/* ========================================================= QCM fr → arabe = */

function QcmFrAr({ mot, onReponse }: { mot: Mot; onReponse: (juste: boolean) => void }) {
  const options = useMemo(
    () => melanger([mot.arabe, ...leurres(mot).map((m) => m.arabe)]),
    [mot]
  );
  const [choisi, setChoisi] = useState<string | null>(null);

  return (
    <div>
      <p className="text-center text-sm font-bold" style={{ color: "var(--muted)" }}>
        Quel mot arabe correspond ?
      </p>
      <p className="mt-6 text-center text-3xl font-extrabold">{mot.sens}</p>

      <Choix
        options={options}
        bonne={mot.arabe}
        arabe
        choisi={choisi}
        onChoisir={(valeur) => {
          setChoisi(valeur);
          dire(valeur);
        }}
      />

      {choisi !== null && (
        <Correction
          juste={choisi === mot.arabe}
          mot={mot}
          onSuivant={() => onReponse(choisi === mot.arabe)}
        />
      )}
    </div>
  );
}

/* ==================================================== Repérer dans un verset */

function DansLeVerset({
  mot,
  onReponse,
  onImpossible,
}: {
  mot: Mot;
  onReponse: (juste: boolean) => void;
  onImpossible: () => void;
}) {
  const [mots, setMots] = useState<string[] | null>(null);
  const [traduction, setTraduction] = useState("");
  const [cible, setCible] = useState<number | null>(null);
  const [choisi, setChoisi] = useState<number | null>(null);
  const [erreur, setErreur] = useState(false);

  useEffect(() => {
    let annule = false;
    const [s, v] = mot.exemple;

    chargerSourate(s)
      .then((data) => {
        if (annule) return;
        const verset = data.verses.find((x) => x.n === v);
        if (!verset) return setErreur(true);

        const formes = verset.words.map((w) => w.segments.map((seg) => seg.t).join(""));
        const position = trouverMotDansVerset(mot, formes);
        if (position === null) return setErreur(true);

        setMots(formes);
        setTraduction(verset.traduction);
        setCible(position);
      })
      .catch(() => {
        if (!annule) setErreur(true);
      });

    return () => {
      annule = true;
    };
  }, [mot]);

  // Mot introuvable dans le verset ou réseau indisponible : on bascule sur un
  // autre exercice plutôt que de bloquer la session.
  useEffect(() => {
    if (erreur) onImpossible();
  }, [erreur, onImpossible]);

  if (erreur) return null;

  if (!mots || cible === null) {
    return (
      <p className="py-16 text-center text-sm" style={{ color: "var(--muted)" }}>
        Chargement du verset…
      </p>
    );
  }

  return (
    <div>
      <p className="text-center text-sm font-bold" style={{ color: "var(--muted)" }}>
        Retrouve <span style={{ color: "var(--accent)" }}>{mot.sens}</span> dans le verset
      </p>
      <p className="mt-1 text-center text-xs" style={{ color: "var(--muted)" }}>
        {refVerset(mot)}
      </p>

      <div className="mt-6 flex flex-row-reverse flex-wrap justify-center gap-2" dir="rtl">
        {mots.map((forme, i) => {
          const actif = choisi !== null;
          let style: React.CSSProperties = { borderColor: "var(--border)" };
          if (actif && i === cible) {
            style = { borderColor: "rgb(34,197,94)", background: "rgba(34,197,94,0.15)" };
          } else if (actif && i === choisi) {
            style = { borderColor: "rgb(239,68,68)", background: "rgba(239,68,68,0.15)" };
          }

          return (
            <button
              key={i}
              disabled={actif}
              onClick={() => {
                setChoisi(i);
                dire(forme);
              }}
              style={style}
              className="arabic font-amiri card rounded-xl border-2 px-3 py-2 text-3xl transition active:scale-95 disabled:cursor-default"
            >
              {forme}
            </button>
          );
        })}
      </div>

      {choisi !== null && (
        <>
          <p className="mt-5 text-center text-sm italic" style={{ color: "var(--muted)" }}>
            « {traduction} »
          </p>
          <Correction
            juste={choisi === cible}
            mot={mot}
            onSuivant={() => onReponse(choisi === cible)}
          />
        </>
      )}
    </div>
  );
}

/* ========================================================== Appariement === */

export function Appariement({
  mots,
  onTermine,
}: {
  mots: Mot[];
  onTermine: (justes: string[], rates: string[]) => void;
}) {
  const gauche = useMemo(() => melanger(mots), [mots]);
  const droite = useMemo(() => melanger(mots), [mots]);

  const [selection, setSelection] = useState<string | null>(null);
  const [apparies, setApparies] = useState<string[]>([]);
  const [rates, setRates] = useState<string[]>([]);
  const [rate, setRate] = useState<string | null>(null);

  const choisirSens = useCallback(
    (id: string) => {
      if (!selection || apparies.includes(id)) return;

      if (selection === id) {
        const suite = [...apparies, id];
        setApparies(suite);
        setSelection(null);
        if (suite.length === mots.length) {
          onTermine(
            suite.filter((x) => !rates.includes(x)),
            rates
          );
        }
      } else {
        if (!rates.includes(selection)) setRates([...rates, selection]);
        setRate(id);
        setTimeout(() => setRate(null), 500);
        setSelection(null);
      }
    },
    [selection, apparies, rates, mots.length, onTermine]
  );

  return (
    <div>
      <p className="text-center text-sm font-bold" style={{ color: "var(--muted)" }}>
        Relie chaque mot à sa traduction
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="grid gap-2.5">
          {gauche.map((m) => {
            const fait = apparies.includes(m.id);
            return (
              <button
                key={m.id}
                disabled={fait}
                onClick={() => {
                  setSelection(m.id);
                  dire(m.arabe);
                }}
                style={{
                  borderColor: selection === m.id ? "var(--accent)" : "var(--border)",
                  opacity: fait ? 0.35 : 1,
                }}
                className="arabic font-amiri card rounded-2xl border-2 px-3 py-3 text-2xl transition active:scale-[0.98]"
              >
                {m.arabe}
              </button>
            );
          })}
        </div>

        <div className="grid gap-2.5">
          {droite.map((m) => {
            const fait = apparies.includes(m.id);
            return (
              <button
                key={m.id}
                disabled={fait}
                onClick={() => choisirSens(m.id)}
                style={{
                  borderColor: rate === m.id ? "rgb(239,68,68)" : "var(--border)",
                  opacity: fait ? 0.35 : 1,
                }}
                className="card rounded-2xl border-2 px-3 py-3 text-sm font-bold transition active:scale-[0.98]"
              >
                {m.sens}
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-5 text-center text-xs" style={{ color: "var(--muted)" }}>
        {apparies.length} / {mots.length} appariés
      </p>
    </div>
  );
}

/* ============================================================ Aiguillage == */

export default function Exercice({
  type,
  mot,
  onReponse,
  onImpossible,
}: {
  type: TypeExercice;
  mot: Mot;
  onReponse: (juste: boolean) => void;
  onImpossible: () => void;
}) {
  switch (type) {
    case "carte":
      return <Carte mot={mot} onSuivant={() => onReponse(true)} />;
    case "qcmFrAr":
      return <QcmFrAr mot={mot} onReponse={onReponse} />;
    case "audio":
      return <QcmArFr mot={mot} onReponse={onReponse} audio />;
    case "verset":
      return <DansLeVerset mot={mot} onReponse={onReponse} onImpossible={onImpossible} />;
    default:
      return <QcmArFr mot={mot} onReponse={onReponse} />;
  }
}
