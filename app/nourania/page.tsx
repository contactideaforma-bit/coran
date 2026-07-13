"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ALPHABET, LECONS_A_VENIR, type Lettre } from "@/data/nourania";
import { usePrefs } from "@/lib/prefs";
import Entete from "@/components/Entete";
import { HautParleur, Lettres, LivreOuvert } from "@/components/Icones";

export default function Nourania() {
  const { prefs } = usePrefs();
  const [lettreActive, setLettreActive] = useState<Lettre | null>(null);
  const [voixArabe, setVoixArabe] = useState<boolean | null>(null);
  const voixRef = useRef<SpeechSynthesisVoice | null>(null);

  // Charger la voix arabe du téléphone (peut arriver de façon asynchrone)
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
    return () =>
      speechSynthesis.removeEventListener("voiceschanged", chercher);
  }, []);

  const prononcer = (lettre: Lettre) => {
    if (typeof speechSynthesis === "undefined") return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(lettre.nomArabe);
    if (voixRef.current) u.voice = voixRef.current;
    u.lang = "ar-SA";
    u.rate = 0.75;
    speechSynthesis.speak(u);
  };

  const clicLettre = (lettre: Lettre) => {
    setLettreActive(lettre);
    prononcer(lettre);
  };

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
          <Lettres taille={22} /> Nourania
        </h2>
      </section>

      <div className="card mt-5 rounded-2xl p-4 shadow-soft">
        <p className="font-bold">Leçon 1 — L&apos;alphabet arabe</p>
        <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
          Touche une lettre pour l&apos;entendre et découvrir comment la
          prononcer.
        </p>
        {voixArabe === false && (
          <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
            Aucune voix arabe détectée sur cet appareil : la prononciation
            vocale sera approximative ou muette. Sur iPhone : Réglages →
            Accessibilité → Contenu énoncé → Voix → ajouter l&apos;arabe.
          </p>
        )}
      </div>

      {/* Grille des lettres */}
      <main className="mt-5 grid grid-cols-4 gap-2 sm:grid-cols-7">
        {ALPHABET.map((l) => (
          <button
            key={l.nom}
            onClick={() => clicLettre(l)}
            className="card flex flex-col items-center rounded-2xl p-3 shadow-soft transition hover:scale-105 active:scale-95"
          >
            <span className={`arabic text-4xl ${prefs.police}`}>{l.arabe}</span>
            <span className="mt-1 text-xs font-bold">{l.nom}</span>
          </button>
        ))}
      </main>

      {/* Leçons à venir */}
      <section className="mt-8">
        <h3 className="mb-2 flex items-center gap-2 text-lg font-extrabold">
          <LivreOuvert taille={20} /> La suite du programme
        </h3>
        <div className="space-y-2">
          {LECONS_A_VENIR.map((lecon) => (
            <div
              key={lecon.titre}
              className="card relative flex items-center gap-3 rounded-2xl p-4 opacity-60"
            >
              <span className="min-w-0 flex-1">
                <span className="block font-bold">{lecon.titre}</span>
                <span
                  className="block text-sm"
                  style={{ color: "var(--muted)" }}
                >
                  {lecon.description}
                </span>
              </span>
              <span
                className="absolute -top-2 right-3 rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                style={{ backgroundColor: "var(--muted)" }}
              >
                Bientôt
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Fiche lettre */}
      {lettreActive && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6"
          onClick={() => setLettreActive(null)}
        >
          <div
            className="card pop w-full max-w-md rounded-3xl p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
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
            <div className="mt-5 flex justify-center gap-2">
              <button
                onClick={() => prononcer(lettreActive)}
                className="flex h-12 w-12 items-center justify-center rounded-full text-white transition active:scale-95"
                style={{ backgroundColor: "var(--accent)" }}
                aria-label="Écouter la lettre"
              >
                <HautParleur taille={22} className="text-white" />
              </button>
              <button
                onClick={() => setLettreActive(null)}
                className="rounded-full px-6 py-2 font-bold text-white transition active:scale-95"
                style={{ backgroundColor: "var(--accent)" }}
              >
                Compris !
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
