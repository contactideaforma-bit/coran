"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { chargerSourate, type SourateData, type Verse } from "@/lib/coran";
import { SOURATES } from "@/data/sourates";
import { sectionsJuz } from "@/data/juz";
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
  v: number; // verset joué (pour le surlignage)
  w?: number; // index du mot joué (mode passage)
}

const REPETITIONS = [1, 2, 3, 5, 7, 10];

export default function Apprentissage() {
  const { prefs } = usePrefs();
  const [n, setN] = useState(1);
  const [data, setData] = useState<SourateData | null>(null);
  const [erreur, setErreur] = useState(false);
  const [section, setSection] = useState(0);
  const [mode, setMode] = useState<"versets" | "passage">("versets");
  const [reps, setReps] = useState(3);

  // Mode « versets » : numéros de versets cochés
  const [coches, setCoches] = useState<Set<number>>(new Set());

  // Mode « partie d'un verset »
  const [vPassage, setVPassage] = useState<number | null>(null);
  const [motDebut, setMotDebut] = useState<number | null>(null);
  const [motFin, setMotFin] = useState<number | null>(null);

  // Lecture
  const [etat, setEtat] = useState<"arret" | "lecture" | "pause">("arret");
  const [progression, setProgression] = useState("");
  const [etapeCourante, setEtapeCourante] = useState<Etape | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileRef = useRef<Etape[]>([]);
  const indexRef = useRef(0);
  const etatRef = useRef<"arret" | "lecture" | "pause">("arret");

  const meta = SOURATES.find((s) => s.n === n)!;
  const police = prefs.police;
  const taille = prefs.taille;
  const sections = sectionsJuz(n, meta.versets);

  // Sourate présélectionnée via /apprentissage?s=12
  useEffect(() => {
    const m = window.location.search.match(/[?&]s=(\d+)/);
    if (!m) return;
    const s = Number(m[1]);
    if (s >= 1 && s <= 114) setN(s);
  }, []);

  // Charger la sourate choisie (et tout réinitialiser)
  useEffect(() => {
    let annule = false;
    stopAudio();
    setData(null);
    setErreur(false);
    setSection(0);
    setCoches(new Set());
    setVPassage(null);
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

  // Nouvelle sélection de mots quand on change de verset cible
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
    setEtapeCourante(null);
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
    setEtapeCourante(file[i]);
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

  /** File du mode « versets » : chaque verset coché, répété N fois. */
  const lancerVersets = () => {
    const liste = Array.from(coches).sort((a, b) => a - b);
    const file: Etape[] = [];
    for (const v of liste) {
      for (let r = 1; r <= reps; r++) {
        file.push({
          url: urlVerset(n, v, prefs.recitateur),
          label: `Verset ${v} — répétition ${r}/${reps}`,
          v,
        });
      }
    }
    lancerFile(file);
  };

  /** File du mode « passage » : les mots choisis, enchaînés, N fois. */
  const lancerPassage = () => {
    const verse = data?.verses.find((x) => x.n === vPassage);
    if (!verse || motDebut === null) return;
    const fin = motFin ?? motDebut;
    const file: Etape[] = [];
    for (let r = 1; r <= reps; r++) {
      for (let w = motDebut; w <= fin; w++) {
        file.push({
          url: urlMot(n, verse.n, verse.words[w].audio),
          label: `Mots ${motDebut + 1} à ${fin + 1} du verset ${verse.n} — répétition ${r}/${reps}`,
          v: verse.n,
          w,
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

  const basculerVerset = (v: number) => {
    setCoches((prev) => {
      const suiv = new Set(prev);
      if (suiv.has(v)) suiv.delete(v);
      else suiv.add(v);
      return suiv;
    });
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
    motDebut !== null && i >= motDebut && i <= (motFin ?? motDebut);

  const nomRecitateur =
    RECITATEURS.find((r) => r.id === prefs.recitateur)?.nom ?? "";

  const sec = sections[Math.min(section, sections.length - 1)];
  const versetsAffiches = data
    ? sections.length > 1
      ? data.verses.filter((v) => v.n >= sec.debut && v.n <= sec.fin)
      : data.verses
    : [];

  const pretALancer =
    mode === "versets" ? coches.size > 0 : vPassage !== null && motDebut !== null;

  /** Texte arabe d'un verset (segments colorés tajwid). */
  const texteArabe = (v: Verse) => (
    <span>
      {v.words.map((word, wi) => (
        <span key={wi}>
          {wi > 0 && " "}
          {word.segments.map((s, si) =>
            s.r ? (
              <span key={si} style={{ color: couleur(RULE_BY_ID[s.r]) }}>
                {s.t}
              </span>
            ) : (
              <span key={si}>{s.t}</span>
            )
          )}
        </span>
      ))}
    </span>
  );

  return (
    <div className="mx-auto max-w-3xl px-4 pb-52 pt-4">
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
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--card)",
              color: "var(--text)",
            }}
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
            { id: "versets", nom: "Versets à cocher" },
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

      <p className="mt-3 text-center text-sm" style={{ color: "var(--muted)" }}>
        {mode === "versets"
          ? "Coche les versets à mémoriser : chacun sera répété avant de passer au suivant."
          : "Touche un verset pour le choisir, puis touche le premier et le dernier mot à répéter."}
      </p>

      {/* Pagination par juz' pour les longues sourates */}
      {data && sections.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {sections.map((s, i) => (
            <button
              key={s.juz}
              onClick={() => setSection(i)}
              className="shrink-0 rounded-full border px-4 py-1.5 text-sm font-bold transition active:scale-95"
              style={{
                borderColor: section === i ? "var(--accent)" : "var(--border)",
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

      {/* ===== Versets, affichés comme en mode lecture ===== */}
      {data && (
        <main className="mt-4 space-y-3">
          {versetsAffiches.map((v) => {
            const coche = coches.has(v.n);
            const choisi = vPassage === v.n;
            const enLecture = etapeCourante?.v === v.n;
            const actif = mode === "versets" ? coche : choisi;

            return (
              <article
                key={v.n}
                onClick={() =>
                  mode === "versets" ? basculerVerset(v.n) : setVPassage(v.n)
                }
                className="card cursor-pointer rounded-2xl p-4 shadow-soft transition active:scale-[0.995]"
                style={{
                  boxShadow: enLecture
                    ? "0 0 0 2px var(--accent)"
                    : actif
                      ? "0 0 0 1.5px color-mix(in srgb, var(--accent) 60%, transparent)"
                      : undefined,
                  backgroundColor: actif
                    ? "color-mix(in srgb, var(--accent) 6%, var(--card))"
                    : undefined,
                }}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="badge-verset">
                    <span className="relative z-10">{v.n}</span>
                  </span>
                  {/* Case à cocher (mode versets) / pastille choix (mode passage) */}
                  <span
                    aria-hidden="true"
                    className="flex h-6 w-6 items-center justify-center rounded-full border-2 text-sm font-bold transition"
                    style={{
                      borderColor: actif ? "var(--accent)" : "var(--border)",
                      backgroundColor: actif ? "var(--accent)" : "transparent",
                      color: "#fff",
                    }}
                  >
                    {actif ? "✓" : ""}
                  </span>
                </div>

                {/* Texte arabe */}
                {mode === "passage" && choisi ? (
                  <>
                    <p className="mb-2 text-sm font-bold">
                      {motDebut === null
                        ? "Touche le premier mot à répéter :"
                        : motFin === null
                          ? "Touche maintenant le dernier mot :"
                          : `Mots ${motDebut + 1} à ${(motFin ?? motDebut) + 1} sélectionnés — touche un mot pour recommencer.`}
                    </p>
                    <div
                      className={`arabic verset-mots ${police} ${TAILLES[taille].arabe}`}
                      dir="rtl"
                    >
                      {v.words.map((word, wi) => {
                        const borne = wi === motDebut || wi === motFin;
                        const motJoue =
                          enLecture && etapeCourante?.w === wi;
                        return (
                          <button
                            key={wi}
                            onClick={() => choisirMot(wi)}
                            className="rounded-md px-0.5 transition active:scale-95"
                            style={{
                              backgroundColor: motJoue
                                ? "color-mix(in srgb, var(--accent) 55%, transparent)"
                                : dansSelection(wi)
                                  ? borne
                                    ? "color-mix(in srgb, var(--accent) 40%, transparent)"
                                    : "color-mix(in srgb, var(--accent) 18%, transparent)"
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
                  </>
                ) : (
                  <p
                    className={`arabic ${police} ${TAILLES[taille].arabe}`}
                    dir="rtl"
                  >
                    {texteArabe(v)}
                  </p>
                )}

                {/* Traduction */}
                <p
                  className={`mt-3 border-t pt-2 ${TAILLES[taille].trad}`}
                  style={{ color: "var(--muted)", borderColor: "var(--border)" }}
                >
                  {v.traduction}
                </p>
              </article>
            );
          })}
        </main>
      )}

      {/* ===== Barre de lecture fixe ===== */}
      {data && (
        <div className="fixed inset-x-0 bottom-0 z-30 px-4 pb-4 pt-2">
          <div
            className="card mx-auto max-w-3xl space-y-2.5 rounded-2xl p-3 shadow-lg"
            style={{
              borderColor: "color-mix(in srgb, var(--accent) 40%, var(--border))",
            }}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold" style={{ color: "var(--muted)" }}>
                  Répétitions :
                </span>
                {REPETITIONS.map((r) => (
                  <button
                    key={r}
                    onClick={() => setReps(r)}
                    className="rounded-full border px-2.5 py-1 text-xs font-bold transition active:scale-95"
                    style={{
                      borderColor:
                        reps === r ? "var(--accent)" : "var(--border)",
                      backgroundColor:
                        reps === r ? "var(--accent)" : "var(--card)",
                      color: reps === r ? "#fff" : "var(--text)",
                    }}
                  >
                    ×{r}
                  </button>
                ))}
              </div>
              {mode === "versets" && coches.size > 0 && etat === "arret" && (
                <button
                  onClick={() => setCoches(new Set())}
                  className="text-xs font-bold underline"
                  style={{ color: "var(--muted)" }}
                >
                  Tout décocher
                </button>
              )}
            </div>

            {etat === "arret" ? (
              <button
                onClick={() =>
                  mode === "versets" ? lancerVersets() : lancerPassage()
                }
                disabled={!pretALancer}
                className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold text-white shadow-soft transition active:scale-[0.99] disabled:opacity-40"
                style={{ backgroundColor: "var(--accent)" }}
              >
                <IconeLecture taille={15} />
                {mode === "versets"
                  ? coches.size === 0
                    ? "Coche au moins un verset"
                    : `Répéter ${coches.size} verset${coches.size > 1 ? "s" : ""} (×${reps})`
                  : vPassage === null
                    ? "Touche un verset pour commencer"
                    : motDebut === null
                      ? "Touche le premier mot à répéter"
                      : `Répéter la sélection du verset ${vPassage} (×${reps})`}
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={basculerPause}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 font-bold transition active:scale-[0.99]"
                  style={{
                    borderColor: "var(--accent)",
                    color: "var(--accent)",
                  }}
                >
                  {etat === "pause" ? (
                    <>
                      <IconeLecture taille={15} /> Reprendre
                    </>
                  ) : (
                    <>
                      <Pause taille={15} /> Pause
                    </>
                  )}
                </button>
                <button
                  onClick={stopAudio}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold text-white transition active:scale-[0.99]"
                  style={{ backgroundColor: "var(--accent)" }}
                >
                  ■ Arrêter
                </button>
              </div>
            )}

            <p
              className="text-center text-xs font-bold"
              style={{ color: progression ? "var(--accent)" : "var(--muted)" }}
            >
              {progression ||
                (mode === "versets"
                  ? `Récitation : ${nomRecitateur}`
                  : "Voix mot à mot • idéal pour les longs versets")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
