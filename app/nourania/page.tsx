"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ALPHABET,
  LECONS,
  type ElementLecon,
  type Lecon,
  type Lettre,
} from "@/data/nourania";
import { usePrefs } from "@/lib/prefs";
import { useEchap } from "@/lib/ui";
import { urlMot } from "@/lib/audio";
import Entete from "@/components/Entete";
import { HautParleur, Lettres, Verifie } from "@/components/Icones";

/* ===== Progression (sur l'appareil) ===== */

function lireProgression(): number[] {
  try {
    const p = JSON.parse(localStorage.getItem("coran-nourania") ?? "[]");
    return Array.isArray(p) ? p : [];
  } catch {
    return [];
  }
}

function basculerLecon(id: number): number[] {
  const p = lireProgression();
  const maj = p.includes(id) ? p.filter((x) => x !== id) : [...p, id];
  try {
    localStorage.setItem("coran-nourania", JSON.stringify(maj));
  } catch {}
  return maj;
}

/* ===== Synthèse vocale arabe (partagée) ===== */

function useVoixArabe() {
  const [dispo, setDispo] = useState<boolean | null>(null);
  const voixRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (typeof speechSynthesis === "undefined") {
      setDispo(false);
      return;
    }
    const chercher = () => {
      const voix = speechSynthesis
        .getVoices()
        .find((v) => v.lang.toLowerCase().startsWith("ar"));
      voixRef.current = voix ?? null;
      setDispo(!!voix);
    };
    chercher();
    speechSynthesis.addEventListener("voiceschanged", chercher);
    return () => speechSynthesis.removeEventListener("voiceschanged", chercher);
  }, []);

  const prononcer = (texte: string) => {
    if (typeof speechSynthesis === "undefined") return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(texte);
    if (voixRef.current) u.voice = voixRef.current;
    u.lang = "ar-SA";
    u.rate = 0.7;
    speechSynthesis.speak(u);
  };

  return { dispo, prononcer };
}

/* ===== Page ===== */

export default function Nourania() {
  const { prefs } = usePrefs();
  const { dispo, prononcer } = useVoixArabe();
  const [leconActive, setLeconActive] = useState<number | null>(null);
  const [progression, setProgression] = useState<number[]>([]);
  const [lettreActive, setLettreActive] = useState<Lettre | null>(null);
  const [elementActif, setElementActif] = useState<ElementLecon | null>(null);

  useEffect(() => {
    setProgression(lireProgression());
  }, []);

  const lecon: Lecon | undefined = LECONS.find((l) => l.id === leconActive);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Couper l'audio et la synthèse vocale quand on quitte la page
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel();
    };
  }, []);

  /** Joue l'élément : vrai enregistrement du Coran si disponible, sinon synthèse. */
  const jouerElement = (e: ElementLecon) => {
    audioRef.current?.pause();
    if (e.audio) {
      const [s, v, w] = e.audio;
      const audio = new Audio(urlMot(s, v, w));
      audioRef.current = audio;
      audio.play().catch(() => prononcer(e.vocal));
    } else {
      prononcer(e.vocal);
    }
  };

  const clicLettre = (l: Lettre) => {
    setLettreActive(l);
    prononcer(l.nomArabe);
  };

  const clicElement = (e: ElementLecon) => {
    setElementActif(e);
    jouerElement(e);
  };

  const terminer = (id: number) => {
    setProgression(basculerLecon(id));
    setLeconActive(null);
  };

  const titreLecon = (id: number) =>
    id === 1
      ? "Leçon 1 — L'alphabet arabe"
      : `${LECONS.find((l) => l.id === id)?.titre} — ${
          LECONS.find((l) => l.id === id)?.sousTitre
        }`;

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-4">
      <Entete />

      <section className="mt-6 flex items-center justify-between gap-3">
        {leconActive === null ? (
          <Link
            href="/"
            className="card rounded-full px-4 py-2 text-sm font-bold shadow-soft transition hover:scale-105 active:scale-95"
          >
            ← Accueil
          </Link>
        ) : (
          <button
            onClick={() => setLeconActive(null)}
            className="card rounded-full px-4 py-2 text-sm font-bold shadow-soft transition hover:scale-105 active:scale-95"
          >
            ← Leçons
          </button>
        )}
        <h2 className="flex items-center gap-2 text-xl font-extrabold">
          <Lettres taille={22} /> Nourania
        </h2>
      </section>

      {/* ===== Menu des leçons ===== */}
      {leconActive === null && (
        <>
          <p
            className="mt-4 text-center text-sm"
            style={{ color: "var(--muted)" }}
          >
            La Qâ&apos;ida Nourania, pas à pas : {progression.length}/8 leçons
            terminées.
          </p>
          <main className="mt-5 space-y-2">
            {[1, ...LECONS.map((l) => l.id)].map((id) => {
              const faite = progression.includes(id);
              return (
                <button
                  key={id}
                  onClick={() => setLeconActive(id)}
                  className="card flex w-full items-center gap-4 rounded-2xl p-4 text-left shadow-soft transition hover:scale-[1.01] active:scale-[0.99]"
                >
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border font-extrabold"
                    style={{
                      borderColor: "var(--accent)",
                      backgroundColor: faite ? "var(--accent)" : "transparent",
                      color: faite ? "#fff" : "var(--accent)",
                    }}
                  >
                    {faite ? <Verifie taille={18} /> : id}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold">{titreLecon(id)}</span>
                    <span
                      className="block text-sm"
                      style={{ color: "var(--muted)" }}
                    >
                      {id === 1
                        ? "Les 28 lettres, avec conseils de prononciation"
                        : LECONS.find((l) => l.id === id)?.intro.slice(0, 70) +
                          "…"}
                    </span>
                  </span>
                  <span style={{ color: "var(--accent)" }}>→</span>
                </button>
              );
            })}
          </main>
          {dispo === false && (
            <p
              className="mt-4 text-center text-xs"
              style={{ color: "var(--muted)" }}
            >
              Aucune voix arabe détectée sur cet appareil : la prononciation
              vocale sera approximative ou muette. Sur iPhone : Réglages →
              Accessibilité → Contenu énoncé → Voix → ajouter l&apos;arabe.
            </p>
          )}
        </>
      )}

      {/* ===== Leçon 1 : alphabet ===== */}
      {leconActive === 1 && (
        <>
          <div className="card mt-5 rounded-2xl p-4 shadow-soft">
            <p className="font-bold">Leçon 1 — L&apos;alphabet arabe</p>
            <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
              Touche une lettre pour l&apos;entendre et découvrir comment la
              prononcer.
            </p>
          </div>
          <main className="mt-5 grid grid-cols-4 gap-2 sm:grid-cols-7">
            {ALPHABET.map((l) => (
              <button
                key={l.nom}
                onClick={() => clicLettre(l)}
                className="card flex flex-col items-center rounded-2xl p-3 shadow-soft transition hover:scale-105 active:scale-95"
              >
                <span className={`arabic text-4xl ${prefs.police}`}>
                  {l.arabe}
                </span>
                <span className="mt-1 text-xs font-bold">{l.nom}</span>
              </button>
            ))}
          </main>
          <BoutonTerminer
            id={1}
            faite={progression.includes(1)}
            terminer={terminer}
          />
        </>
      )}

      {/* ===== Leçons 2 à 8 ===== */}
      {lecon && (
        <>
          <div className="card mt-5 rounded-2xl p-4 shadow-soft">
            <p className="font-bold">
              {lecon.titre} — {lecon.sousTitre}
            </p>
            <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
              {lecon.intro}
            </p>
          </div>
          <main
            className={`mt-5 grid gap-2 ${
              lecon.grandeGrille
                ? "grid-cols-2 sm:grid-cols-3"
                : "grid-cols-2 sm:grid-cols-4"
            }`}
          >
            {lecon.elements.map((e, i) => (
              <button
                key={i}
                onClick={() => clicElement(e)}
                className="card flex flex-col items-center rounded-2xl p-3 shadow-soft transition hover:scale-105 active:scale-95"
              >
                <span
                  className={`arabic text-3xl leading-relaxed ${prefs.police}`}
                  dir="rtl"
                >
                  {e.principal}
                </span>
                <span
                  className="mt-1 text-center text-xs font-bold"
                  style={{ color: "var(--muted)" }}
                >
                  {e.translit}
                </span>
              </button>
            ))}
          </main>
          <BoutonTerminer
            id={lecon.id}
            faite={progression.includes(lecon.id)}
            terminer={terminer}
          />
        </>
      )}

      {/* ===== Fiche lettre (leçon 1) ===== */}
      {lettreActive && (
        <Fiche fermer={() => setLettreActive(null)}>
          <p className={`arabic text-8xl ${prefs.police}`}>
            {lettreActive.arabe}
          </p>
          <h3 className="mt-3 text-xl font-extrabold">
            {lettreActive.nom}{" "}
            <span style={{ color: "var(--accent)" }}>
              ({lettreActive.translit})
            </span>
          </h3>
          <p className="mt-3">{lettreActive.conseil}</p>
          <BoutonsFiche
            ecouter={() => prononcer(lettreActive.nomArabe)}
            fermer={() => setLettreActive(null)}
          />
        </Fiche>
      )}

      {/* ===== Fiche élément (leçons 2-8) ===== */}
      {elementActif && (
        <Fiche fermer={() => setElementActif(null)}>
          <p
            className={`arabic text-5xl leading-relaxed ${prefs.police}`}
            dir="rtl"
          >
            {elementActif.principal}
          </p>
          <h3 className="mt-3 text-lg font-extrabold" style={{ color: "var(--accent)" }}>
            {elementActif.translit}
          </h3>
          {elementActif.aide && <p className="mt-3">{elementActif.aide}</p>}
          <BoutonsFiche
            ecouter={() => jouerElement(elementActif)}
            fermer={() => setElementActif(null)}
          />
        </Fiche>
      )}
    </div>
  );
}

/* ===== Petits composants ===== */

function Fiche({
  children,
  fermer,
}: {
  children: React.ReactNode;
  fermer: () => void;
}) {
  useEchap(true, fermer);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6"
      onClick={fermer}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="card pop w-full max-w-md rounded-3xl p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function BoutonsFiche({
  ecouter,
  fermer,
}: {
  ecouter: () => void;
  fermer: () => void;
}) {
  return (
    <div className="mt-5 flex justify-center gap-2">
      <button
        onClick={ecouter}
        className="flex h-12 w-12 items-center justify-center rounded-full text-white transition active:scale-95"
        style={{ backgroundColor: "var(--accent)" }}
        aria-label="Écouter"
      >
        <HautParleur taille={22} className="text-white" />
      </button>
      <button
        onClick={fermer}
        className="rounded-full px-6 py-2 font-bold text-white transition active:scale-95"
        style={{ backgroundColor: "var(--accent)" }}
      >
        Compris !
      </button>
    </div>
  );
}

function BoutonTerminer({
  id,
  faite,
  terminer,
}: {
  id: number;
  faite: boolean;
  terminer: (id: number) => void;
}) {
  return (
    <button
      onClick={() => terminer(id)}
      className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 font-bold shadow-soft transition hover:scale-[1.01] active:scale-[0.99]"
      style={
        faite
          ? {
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              color: "var(--muted)",
            }
          : { backgroundColor: "var(--accent)", color: "#fff" }
      }
    >
      <Verifie taille={18} />
      {faite ? "Leçon terminée — marquer à refaire" : "Marquer la leçon comme terminée"}
    </button>
  );
}
