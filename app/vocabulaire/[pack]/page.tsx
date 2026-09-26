"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PACKS, type Mot } from "@/data/vocabulaire";
import {
  apresReponse,
  ecrireProgression,
  estMemorise,
  estNouveau,
  etat,
  lireProgression,
  marquerConnu,
  motsDeRevision,
  motsDeSession,
  statsPack,
  type Progression,
} from "@/lib/vocabulaire";
import Exercice, { Appariement, type TypeExercice } from "@/components/ExercicesVocabulaire";
import { Alerte, Trophee, Verifie } from "@/components/Icones";

interface Etape {
  mot: Mot;
  type: TypeExercice;
}

type Phase = "chargement" | "exercices" | "appariement" | "bilan";

function melanger<T>(liste: T[]): T[] {
  const t = [...liste];
  for (let i = t.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [t[i], t[j]] = [t[j], t[i]];
  }
  return t;
}

/**
 * Deux tours : le premier présente chaque mot (carte de découverte pour les
 * nouveaux), le second reprend les mêmes mots dans le désordre avec un autre
 * type d'exercice. Revoir un mot après en avoir vu d'autres vaut bien mieux
 * que d'enchaîner deux fois de suite sur le même.
 */
function construireEtapes(mots: Mot[], progression: Progression): Etape[] {
  const premier: Etape[] = [];
  const second: Etape[] = [];

  for (const mot of mots) {
    const e = etat(progression, mot.id);

    if (estNouveau(e)) {
      premier.push({ mot, type: "carte" });
      premier.push({ mot, type: "qcmArFr" });
      second.push({ mot, type: "qcmFrAr" });
    } else if (e.boite < 3) {
      premier.push({ mot, type: "qcmArFr" });
      second.push({ mot, type: "qcmFrAr" });
    } else {
      // Mot déjà mémorisé : on varie, et on tente de le replacer dans un verset.
      premier.push({ mot, type: Math.random() < 0.5 ? "audio" : "qcmFrAr" });
      second.push({ mot, type: "verset" });
    }
  }

  return [...premier, ...melanger(second)];
}

export default function SessionVocabulaire({ params }: { params: { pack: string } }) {
  const revision = params.pack === "revision";
  const pack = useMemo(() => PACKS.find((p) => p.id === params.pack), [params.pack]);

  const [phase, setPhase] = useState<Phase>("chargement");
  const [progression, setProgression] = useState<Progression>({});
  const [mots, setMots] = useState<Mot[]>([]);
  const [etapes, setEtapes] = useState<Etape[]>([]);
  const [index, setIndex] = useState(0);
  const [resultats, setResultats] = useState<Record<string, boolean>>({});
  const [gagnes, setGagnes] = useState(0);

  /* ------------------------------------------------ préparation de la session */

  const demarrer = useCallback(
    (p: Progression) => {
      const choisis = revision
        ? motsDeRevision(p, 12)
        : pack
          ? motsDeSession(pack, p, 8)
          : [];

      setProgression(p);
      setMots(choisis);
      setEtapes(construireEtapes(choisis, p));
      setResultats({});
      setIndex(0);
      setGagnes(0);
      setPhase(choisis.length ? "exercices" : "bilan");
    },
    [pack, revision]
  );

  useEffect(() => {
    demarrer(lireProgression());
  }, [demarrer]);

  /* ----------------------------------------------------- fin de la session -- */

  const terminer = useCallback(
    (scores: Record<string, boolean>) => {
      const suite: Progression = { ...progression };
      let nouveauxMemorises = 0;

      // Une seule montée de boîte par mot et par session : c'est l'espacement
      // entre deux sessions qui fait la mémorisation, pas la répétition immédiate.
      for (const mot of mots) {
        const avant = etat(suite, mot.id);
        const apres = apresReponse(avant, scores[mot.id] ?? false);
        suite[mot.id] = apres;
        if (!estMemorise(avant) && estMemorise(apres)) nouveauxMemorises++;
      }

      ecrireProgression(suite);
      setProgression(suite);
      setGagnes(nouveauxMemorises);
      setPhase("bilan");
    },
    [mots, progression]
  );

  const repondre = useCallback(
    (juste: boolean) => {
      const etape = etapes[index];
      if (!etape) return;

      // La carte de découverte n'est pas une réponse : elle ne compte pas.
      const scores =
        etape.type === "carte"
          ? resultats
          : { ...resultats, [etape.mot.id]: (resultats[etape.mot.id] ?? true) && juste };
      setResultats(scores);

      if (index + 1 < etapes.length) {
        setIndex(index + 1);
      } else if (mots.length >= 3) {
        setPhase("appariement");
      } else {
        terminer(scores);
      }
    },
    [etapes, index, resultats, mots.length, terminer]
  );

  /** Le verset n'a pas pu être chargé ou le mot n'y est pas repérable. */
  const remplacerEtape = useCallback(() => {
    setEtapes((precedentes) =>
      precedentes.map((e, i) => (i === index ? { ...e, type: "qcmArFr" } : e))
    );
  }, [index]);

  const sauterMot = useCallback(() => {
    const etape = etapes[index];
    if (!etape) return;

    const suite = { ...progression, [etape.mot.id]: marquerConnu(etat(progression, etape.mot.id)) };
    ecrireProgression(suite);
    setProgression(suite);

    const restantes = etapes.filter((e) => e.mot.id !== etape.mot.id);
    setMots((m) => m.filter((x) => x.id !== etape.mot.id));

    if (restantes.length) {
      setEtapes(restantes);
      setIndex(Math.min(index, restantes.length - 1));
    } else {
      terminer(resultats);
    }
  }, [etapes, index, progression, resultats, terminer]);

  /* ------------------------------------------------------------- rendu ----- */

  const titre = revision ? "Révision" : (pack?.titre ?? "Vocabulaire");

  if (!revision && !pack) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="font-bold">Ce pack n'existe pas.</p>
        <Link href="/vocabulaire" className="mt-4 inline-block font-bold" style={{ color: "var(--accent-fort)" }}>
          ← Retour au vocabulaire
        </Link>
      </div>
    );
  }

  const etape = etapes[index];
  const avancement = etapes.length ? (index / etapes.length) * 100 : 0;

  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-4">
      {/* Barre de session */}
      <header className="flex items-center gap-3">
        <Link href="/vocabulaire" className="text-sm font-bold" style={{ color: "var(--muted)" }}>
          ✕
        </Link>
        <div className="h-2 flex-1 overflow-hidden rounded-full" style={{ background: "var(--border)" }}>
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${phase === "exercices" ? avancement : 100}%`,
              background: "var(--accent-fort)",
            }}
          />
        </div>
        <span className="text-xs font-bold" style={{ color: "var(--muted)" }}>
          {phase === "exercices" ? `${index + 1}/${etapes.length}` : "✓"}
        </span>
      </header>

      <h1 className="mt-4 text-center text-sm font-bold" style={{ color: "var(--muted)" }}>
        {titre}
      </h1>

      <div className="mt-6">
        {phase === "chargement" && (
          <p className="py-20 text-center text-sm" style={{ color: "var(--muted)" }}>
            Préparation de la session…
          </p>
        )}

        {phase === "exercices" && etape && (
          <>
            <Exercice
              key={`${etape.mot.id}-${etape.type}-${index}`}
              type={etape.type}
              mot={etape.mot}
              onReponse={repondre}
              onImpossible={remplacerEtape}
            />

            {etape.type === "carte" && (
              <button
                onClick={sauterMot}
                className="mx-auto mt-4 block text-xs font-bold underline"
                style={{ color: "var(--muted)" }}
              >
                Je connais déjà ce mot
              </button>
            )}
          </>
        )}

        {phase === "appariement" && (
          <Appariement
            mots={mots.slice(0, 4)}
            onTermine={(justes, rates) => {
              const scores = { ...resultats };
              for (const id of justes) scores[id] = (scores[id] ?? true) && true;
              for (const id of rates) scores[id] = false;
              terminer(scores);
            }}
          />
        )}

        {phase === "bilan" && (
          <Bilan
            mots={mots}
            resultats={resultats}
            gagnes={gagnes}
            packId={revision ? null : (pack?.id ?? null)}
            progression={progression}
            onRecommencer={() => demarrer(progression)}
          />
        )}
      </div>
    </div>
  );
}

/* ============================================================== Bilan ===== */

function Bilan({
  mots,
  resultats,
  gagnes,
  packId,
  progression,
  onRecommencer,
}: {
  mots: Mot[];
  resultats: Record<string, boolean>;
  gagnes: number;
  packId: string | null;
  progression: Progression;
  onRecommencer: () => void;
}) {
  if (!mots.length) {
    return (
      <div className="py-16 text-center">
        <p className="text-4xl">✨</p>
        <p className="mt-4 text-xl font-extrabold">Rien à réviser pour le moment</p>
        <p className="mx-auto mt-2 max-w-sm text-sm" style={{ color: "var(--muted)" }}>
          Tous les mots de ce pack sont mémorisés et leur prochaine révision
          n'est pas encore due. Reviens plus tard, ou ouvre un autre pack.
        </p>
        <Link
          href="/vocabulaire"
          className="mt-6 inline-block rounded-2xl px-6 py-3 font-extrabold text-white"
          style={{ background: "var(--accent-fort)" }}
        >
          Retour aux packs
        </Link>
      </div>
    );
  }

  const justes = mots.filter((m) => resultats[m.id]).length;
  const pack = packId ? PACKS.find((p) => p.id === packId) : null;
  const restants = pack ? statsPack(pack, progression) : null;

  return (
    <div className="text-center">
      <p className="text-5xl">{justes === mots.length ? "🌟" : "👍"}</p>

      <h2 className="mt-4 text-2xl font-extrabold">
        {justes} / {mots.length} réussis
      </h2>

      {gagnes > 0 && (
        <p
          className="mx-auto mt-3 flex w-fit items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold"
          style={{ background: "var(--card)", color: "var(--accent-fort)" }}
        >
          <Trophee taille={16} /> {gagnes} nouveau{gagnes > 1 ? "x" : ""} mot
          {gagnes > 1 ? "s" : ""} mémorisé{gagnes > 1 ? "s" : ""}
        </p>
      )}

      <ul className="mt-6 grid gap-2 text-left">
        {mots.map((m) => (
          <li
            key={m.id}
            className="card flex items-center gap-3 rounded-2xl px-4 py-3"
            style={{ opacity: resultats[m.id] ? 1 : 0.75 }}
          >
            <span style={{ color: resultats[m.id] ? "rgb(34,197,94)" : "rgb(239,68,68)" }}>
              {resultats[m.id] ? <Verifie taille={18} /> : <Alerte taille={18} />}
            </span>
            <span className="arabic font-amiri text-2xl">{m.arabe}</span>
            <span className="min-w-0 flex-1 text-sm font-bold">{m.sens}</span>
            <span className="text-xs" style={{ color: "var(--muted)" }}>
              boîte {etat(progression, m.id).boite}/5
            </span>
          </li>
        ))}
      </ul>

      {restants && (
        <p className="mt-5 text-sm" style={{ color: "var(--muted)" }}>
          {restants.memorises}/{restants.total} mots mémorisés dans ce pack
        </p>
      )}

      <div className="mt-6 grid gap-2.5">
        {restants && restants.memorises < restants.total && (
          <button
            onClick={onRecommencer}
            className="rounded-2xl px-6 py-3.5 font-extrabold text-white transition active:scale-[0.98]"
            style={{ background: "var(--accent-fort)" }}
          >
            Continuer ce pack
          </button>
        )}
        <Link
          href="/vocabulaire"
          className="card rounded-2xl px-6 py-3.5 font-extrabold"
          style={{ color: "var(--accent-fort)" }}
        >
          Retour aux packs
        </Link>
      </div>
    </div>
  );
}
