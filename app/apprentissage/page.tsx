"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  chargerSourate,
  type SourateData,
  type Verse,
} from "@/lib/coran";
import { SOURATES } from "@/data/sourates";
import { RULE_BY_ID, type TajwidRule } from "@/lib/tajwid";
import { urlMot, urlVerset } from "@/lib/audio";
import { RECITATEURS, TAILLES, usePrefs } from "@/lib/prefs";
import Entete from "@/components/Entete";
import {
  Alerte,
  Lecture as IconeLecture,
  LivreOuvert,
  Pause,
  Repeter,
} from "@/components/Icones";

/* ===== File de lecture ===== */

interface Etape {
  url: string;
  label: string; // ex. « Verset 5 — répétition 2/3 »
}

const REPETITIONS = [1, 2, 3, 5, 7, 10];

export default function Apprentissage() {
  const { prefs } = usePrefs();
  const [n, setN] = useState(1);
  const [data, setData] = useState<SourateData | null>(null);
  const [erreur, setErreur] = useState(false);
  const [mode, setMode] = useState<"versets" | "passage">("versets");
  const [reps, setReps] = useState(3);

  // Mode « versets entiers »
  const [vDebut, setVDebut] = useState(1);
  const [vFin, setVFin] = useState(1);

  // Mode « partie d'un verset »
  const [vPassage, setVPassage] = useState(1);
  const [motDebut, setMotDebut] = useState<number | null>(null);
  const [motFin, setMotFin] = useState<number | null>(null);

  // Lecture
  const [etat, setEtat] = useState<"arret" | "lecture" | "pause">("arret");
  const [progression, setProgression] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileRef = useRef<Etape[]>([]);
  const indexRef = useRef(0);
  const etatRef = useRef<"arret" | "lecture" | "pause">("arret");

  const meta = SOURATES.find((s) => s.n === n)!;
  const police = prefs.police;
  const taille = prefs.taille;

  // Sourate présélectionnée via /apprentissage?s=12
  useEffect(() => {
    const m = window.location.search.match(/[?&]s=(\d+)/);
    if (!m) return;
    const s = Number(m[1]);
    if (s >= 1 && s <= 114) setN(s);
  }, []);

  // Charger la sourate choisie
  useEffect(() => {
    let annule = false;
    stopAudio();
    setData(null);
    setErreur(false);
    setVDebut(1);
    setVFin(1);
    setVPassage(1);
    setMotDebut(null);
    setMotFin(null);
    chargerSourate(n)
      .then((d) => {
        if (!annule) setData(d);
      })
      .catch(() => {
        if (!annule) setErreur(true);
      });
    return () => {
      annule = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n]);

  // Couper l'audio en quittant la page
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  // Nouvelle sélection de mots quand on change de verset
  useEffect(() => {
    setMotDebut(null);
    setMotFin(null);
  }, [vPassage]);

  const couleur = (r: TajwidRule) =>
    prefs.dark ? r.couleurSombre : r.couleur;

  const changerEtat = (e: "arret" | "lecture" | "pause") => {
    etatRef.current = e;
    setEtat(e);
  };

  const stopAudio = () => {
    audioRef.current?.pause();
    audioRef.current = null;
    fileRef.current = [];
    indexRef.current = 0;
    changerEtat("arret");
    setProgression("");
  };

  /** Joue l'étape `i` de la file, puis enchaîne. */
  const jouerEtape = (i: number) => {
    const file = fileRef.current;
    if (etatRef.current === "arret" || i >= file.length) {
      stopAudio();
      return;
    }
    indexRef.current = i;
    setProgression(`${file[i].label} • étape ${i + 1}/${file.length}`);
    const audio = new Audio(file[i].url);
    audioRef.current = audio;
    const suivant = () => jouerEtape(i + 1);
    audio.onended = suivant;
    audio.onerror = suivant; // un fichier manquant ne bloque pas la session
    audio.play().catch(suivant);
  };

  const lancerFile = (file: Etape[]) => {
    if (!file.length) return;
    audioRef.current?.pause();
    fileRef.current = file;
    changerEtat("lecture");
    jouerEtape(0);
  };

  /** File du mode « versets entiers » : chaque verset répété N fois. */
  const lancerVersets = () => {
    const debut = Math.min(vDebut, vFin);
    const fin = Math.max(vDebut, vFin);
    const file: Etape[] = [];
    for (let v = debut; v <= fin; v++) {
      for (let r = 1; r <= reps; r++) {
        file.push({
          url: urlVerset(n, v, prefs.recitateur),
          label: `Verset ${v} — répétition ${r}/${reps}`,
        });
      }
    }
    lancerFile(file);
  };

  /** File du mode « partie d'un verset » : les mots choisis, enchaînés, N fois. */
  const lancerPassage = (verse: Verse) => {
    if (motDebut === null) return;
    const fin = motFin ?? motDebut;
    const file: Etape[] = [];
    for (let r = 1; r <= reps; r++) {
      for (let w = motDebut; w <= fin; w++) {
        file.push({
          url: urlMot(n, verse.n, verse.words[w].audio),
          label: `Mots ${motDebut + 1} à ${fin + 1} du verset ${verse.n} — répétition ${r}/${reps}`,
        });
      }
    }
    lancerFile(file);
  };

  const basculerPause = () => {
    if (etat === "lecture") {
      audioRef.current?.pause();
      changerEtat("pause");
    } else if (etat === "pause") {
      changerEtat("lecture");
      audioRef.current?.play().catch(() => jouerEtape(indexRef.current + 1));
    }
  };

  /** Sélection d'un mot : 1er appui = début, 2e = fin, 3e = nouvelle sélection. */
  const choisirMot = (i: number) => {
    if (motDebut === null || motFin !== null) {
      setMotDebut(i);
      setMotFin(null);
    } else {
      setMotFin(Math.max(motDebut, i));
      setMotDebut(Math.min(motDebut, i));
    }
  };

  const dansSelection = (i: number) =>
    motDebut !== null &&
    i >= motDebut &&
    i <= (motFin ?? motDebut);

  const versePassage = data?.verses.find((v) => v.n === vPassage) ?? null;
  const nomRecitateur =
    RECITATEURS.find((r) => r.id === prefs.recitateur)?.nom ?? "";

  const selectStyle = {
    borderColor: "var(--border)",
    backgroundColor: "var(--card)",
    color: "var(--text)",
  } as const;

  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-4">
      <Entete />

      <section className="mt-6 flex items-center justify-between gap-3">
        <Link
          href="/"
          className="card rounded-full px-4 py-2 text-sm font-bold shadow-soft transition hover:scale-105 active:scale-95"
        >
          ← Accueil
        </Link>
        <h2 className="flex items-center gap-2 text-xl font-extrabold">
          <Repeter taille={22} /> Apprentissage
        </h2>
      </section>

      <p className="mt-3 text-center text-sm" style={{ color: "var(--muted)" }}>
        Mémorise en écoutant en boucle : des versets entiers, ou seulement une
        partie d&apos;un verset (du mot de départ au mot d&apos;arrivée).
      </p>

      {/* ===== Choix de la sourate ===== */}
      <div className="card mt-5 rounded-2xl p-4 shadow-soft">
        <label className="mb-1 block text-sm font-bold" htmlFor="sourate">
          Sourate
        </label>
        <div className="flex items-center gap-3">
          <select
            id="sourate"
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            className="w-full rounded-xl border px-3 py-2.5 font-semibold outline-none"
            style={selectStyle}
          >
            {SOURATES.map((s) => (
              <option key={s.n} value={s.n}>
                {s.n}. {s.nom} ({s.versets} versets)
              </option>
            ))}
          </select>
          <span className={`arabic shrink-0 text-2xl font-bold ${police}`}>
            {meta.arabe}
          </span>
        </div>
      </div>

      {/* ===== Mode ===== */}
      <div className="mt-4 flex gap-2">
        {(
          [
            { id: "versets", nom: "Versets entiers" },
            { id: "passage", nom: "Partie d'un verset" },
          ] as const
        ).map((m) => (
          <button
            key={m.id}
            onClick={() => {
              stopAudio();
              setMode(m.id);
            }}
            className="flex-1 rounded-full border px-4 py-2 text-sm font-bold transition active:scale-95"
            style={{
              borderColor: mode === m.id ? "var(--accent)" : "var(--border)",
              backgroundColor: mode === m.id ? "var(--accent)" : "var(--card)",
              color: mode === m.id ? "#fff" : "var(--text)",
            }}
          >
            {m.nom}
          </button>
        ))}
      </div>

      {/* ===== Chargement / erreur ===== */}
      {!data && !erreur && (
        <div className="card mt-4 rounded-2xl p-8 text-center shadow-soft">
          <p
            className="flex animate-pulse justify-center"
            style={{ color: "var(--accent)" }}
          >
            <LivreOuvert taille={32} />
          </p>
          <p className="mt-2 font-bold">Chargement de la sourate…</p>
        </div>
      )}
      {erreur && (
        <div className="card mt-4 rounded-2xl p-6 text-center shadow-soft">
          <p className="flex justify-center" style={{ color: "var(--accent)" }}>
            <Alerte taille={28} />
          </p>
          <p className="mt-2 font-bold">Impossible de charger la sourate</p>
          <button
            onClick={() => {
              setErreur(false);
              chargerSourate(n)
                .then(setData)
                .catch(() => setErreur(true));
            }}
            className="mt-3 rounded-full px-5 py-2 font-bold text-white"
            style={{ backgroundColor: "var(--accent)" }}
          >
            Réessayer
          </button>
        </div>
      )}

      {data && (
        <>
          {/* ===== Réglages du mode « versets entiers » ===== */}
          {mode === "versets" && (
            <div className="card mt-4 space-y-4 rounded-2xl p-4 shadow-soft">
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="mb-1 block text-sm font-bold" htmlFor="v1">
                    Du verset
                  </label>
                  <select
                    id="v1"
                    value={vDebut}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setVDebut(v);
                      if (v > vFin) setVFin(v);
                    }}
                    className="w-full rounded-xl border px-3 py-2.5 font-semibold outline-none"
                    style={selectStyle}
                  >
                    {Array.from({ length: meta.versets }, (_, i) => i + 1).map(
                      (v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      )
                    )}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="mb-1 block text-sm font-bold" htmlFor="v2">
                    Au verset
                  </label>
                  <select
                    id="v2"
                    value={vFin}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setVFin(v);
                      if (v < vDebut) setVDebut(v);
                    }}
                    className="w-full rounded-xl border px-3 py-2.5 font-semibold outline-none"
                    style={selectStyle}
                  >
                    {Array.from({ length: meta.versets }, (_, i) => i + 1).map(
                      (v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                Chaque verset est répété avant de passer au suivant • Récitation
                : {nomRecitateur}
              </p>
            </div>
          )}

          {/* ===== Réglages du mode « partie d'un verset » ===== */}
          {mode === "passage" && (
            <div className="card mt-4 space-y-4 rounded-2xl p-4 shadow-soft">
              <div>
                <label className="mb-1 block text-sm font-bold" htmlFor="vp">
                  Verset
                </label>
                <select
                  id="vp"
                  value={vPassage}
                  onChange={(e) => setVPassage(Number(e.target.value))}
                  className="w-full rounded-xl border px-3 py-2.5 font-semibold outline-none"
                  style={selectStyle}
                >
                  {Array.from({ length: meta.versets }, (_, i) => i + 1).map(
                    (v) => (
                      <option key={v} value={v}>
                        Verset {v}
                      </option>
                    )
                  )}
                </select>
              </div>

              {versePassage && (
                <>
                  <p className="text-sm font-bold">
                    {motDebut === null
                      ? "Touche le premier mot à répéter :"
                      : motFin === null
                        ? "Touche maintenant le dernier mot :"
                        : `Mots ${motDebut + 1} à ${(motFin ?? motDebut) + 1} sélectionnés — touche un mot pour recommencer.`}
                  </p>
                  <div
                    className={`arabic verset-mots rounded-xl border p-3 ${police} ${TAILLES[taille].arabe}`}
                    dir="rtl"
                    style={{ borderColor: "var(--border)" }}
                  >
                    {versePassage.words.map((word, wi) => {
                      const borne = wi === motDebut || wi === motFin;
                      return (
                        <button
                          key={wi}
                          onClick={() => choisirMot(wi)}
                          className="rounded-md px-0.5 transition active:scale-95"
                          style={{
                            backgroundColor: dansSelection(wi)
                              ? borne
                                ? "color-mix(in srgb, var(--accent) 45%, transparent)"
                                : "color-mix(in srgb, var(--accent) 20%, transparent)"
                              : undefined,
                          }}
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
                  <p className="text-xs" style={{ color: "var(--muted)" }}>
                    Les mots choisis sont enchaînés puis répétés (voix mot à
                    mot). Idéal pour découper les longs versets.
                  </p>
                </>
              )}
            </div>
          )}

          {/* ===== Répétitions ===== */}
          <div className="card mt-4 rounded-2xl p-4 shadow-soft">
            <p className="mb-2 text-sm font-bold">Nombre de répétitions</p>
            <div className="flex flex-wrap gap-2">
              {REPETITIONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setReps(r)}
                  className="min-w-[3rem] rounded-full border px-4 py-1.5 text-sm font-bold transition active:scale-95"
                  style={{
                    borderColor: reps === r ? "var(--accent)" : "var(--border)",
                    backgroundColor:
                      reps === r ? "var(--accent)" : "var(--card)",
                    color: reps === r ? "#fff" : "var(--text)",
                  }}
                >
                  ×{r}
                </button>
              ))}
            </div>
          </div>

          {/* ===== Lecture ===== */}
          <div className="mt-5 space-y-3">
            {etat === "arret" ? (
              <button
                onClick={() =>
                  mode === "versets"
                    ? lancerVersets()
                    : versePassage && lancerPassage(versePassage)
                }
                disabled={mode === "passage" && motDebut === null}
                className="flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3.5 font-bold text-white shadow-soft transition hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40"
                style={{ backgroundColor: "var(--accent)" }}
              >
                <IconeLecture taille={16} />
                {mode === "versets"
                  ? `Répéter les versets ${Math.min(vDebut, vFin)} à ${Math.max(vDebut, vFin)} (×${reps})`
                  : motDebut === null
                    ? "Choisis d'abord les mots à répéter"
                    : `Répéter la sélection (×${reps})`}
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={basculerPause}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl border px-4 py-3.5 font-bold transition active:scale-[0.99]"
                  style={{ borderColor: "var(--accent)", color: "var(--accent)" }}
                >
                  {etat === "pause" ? (
                    <>
                      <IconeLecture taille={16} /> Reprendre
                    </>
                  ) : (
                    <>
                      <Pause taille={16} /> Pause
                    </>
                  )}
                </button>
                <button
                  onClick={stopAudio}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-3.5 font-bold text-white transition active:scale-[0.99]"
                  style={{ backgroundColor: "var(--accent)" }}
                >
                  ■ Arrêter
                </button>
              </div>
            )}

            {progression && (
              <p
                className="text-center text-sm font-bold"
                style={{ color: "var(--accent)" }}
              >
                {progression}
              </p>
            )}
          </div>

          <p
            className="mt-6 text-center text-xs"
            style={{ color: "var(--muted)" }}
          >
            Astuce : commence par écouter, puis répète à voix haute en même
            temps que la récitation. Augmente le nombre de répétitions au fur
            et à mesure.
          </p>
        </>
      )}
    </div>
  );
}
