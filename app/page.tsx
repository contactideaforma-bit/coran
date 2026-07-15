"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { hadithDuJour, type Hadith } from "@/data/hadiths";
import { SOURATES } from "@/data/sourates";
import { libelleHijri, versHijri } from "@/lib/hijri";
import { depuis, lireMarquePage, type MarquePage } from "@/lib/marquePage";
import Entete from "@/components/Entete";
import GuideInstallation from "@/components/GuideInstallation";
import {
  Calendrier as IconeCalendrier,
  Citation,
  Coeur,
  Pinceau,
  Horloge,
  Lettres,
  LivreOuvert,
  Manette,
  MarquePageIcone,
} from "@/components/Icones";

const MODULES = [
  {
    href: "/coran",
    icone: LivreOuvert,
    nom: "Coran",
    description: "Lire avec le tajwid en couleur, écouter mot à mot",
  },
  {
    href: "/nourania",
    icone: Lettres,
    nom: "Nourania",
    description: "Apprendre à lire l'arabe pas à pas",
  },
  {
    href: "/invocations",
    icone: Coeur,
    nom: "Invocations",
    description: "Les douas authentiques du quotidien",
  },
  {
    href: "/prieres",
    icone: Horloge,
    nom: "Prières",
    description: "Les horaires selon ta ville",
  },
  {
    href: "/calendrier",
    icone: IconeCalendrier,
    nom: "Calendrier",
    description: "Événements de l'année, conseils et récompenses",
  },
  {
    href: "/jeux",
    icone: Manette,
    nom: "Jeux",
    description: "Jeu Nourania (niveaux par leçon) et quiz de connaissances",
  },
];


export default function Accueil() {
  const [hadith, setHadith] = useState<Hadith | null>(null);
  const [hijri, setHijri] = useState("");
  const [marque, setMarque] = useState<MarquePage | null>(null);

  useEffect(() => {
    setHadith(hadithDuJour());
    setHijri(libelleHijri(versHijri(new Date())));
    setMarque(lireMarquePage());
  }, []);

  const sourateMarquee = marque
    ? SOURATES.find((s) => s.n === marque.s)
    : null;

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-4">
      <Entete />

      {/* Basmala + salutation + date hijri */}
      <section className="mt-8 text-center">
        <p
          className="arabic font-amiri text-4xl"
          style={{ color: "var(--accent)" }}
        >
          ﷽
        </p>
        <h2 className="mt-4 text-2xl font-extrabold">Assalâmu alaykum</h2>
        {hijri && (
          <div className="ornement mx-auto mt-3 max-w-xs text-sm">
            <span style={{ color: "var(--muted)" }}>
              {hijri} <span className="font-bold">H</span>
            </span>
          </div>
        )}
      </section>

      {/* Hadith du jour */}
      {hadith && (
        <div
          className="card mt-5 rounded-3xl p-6 shadow-soft"
          style={{ borderColor: "var(--accent)" }}
        >
          <p
            className="flex items-center gap-1.5 text-sm font-bold"
            style={{ color: "var(--accent)" }}
          >
            <Citation taille={16} /> Hadith du jour
          </p>
          <p className="mt-2 text-lg leading-relaxed">
            « {hadith.texte} »
          </p>
          <p className="mt-3 text-sm font-bold" style={{ color: "var(--muted)" }}>
            — Rapporté par {hadith.source}
          </p>
        </div>
      )}

      {/* Reprendre la lecture */}
      {marque && sourateMarquee && (
        <Link
          href={`/sourate/${marque.s}#v-${marque.v}`}
          className="card mt-4 flex items-center gap-3 rounded-2xl p-4 shadow-soft transition hover:scale-[1.02] active:scale-[0.98]"
        >
          <span style={{ color: "var(--accent)" }}>
            <MarquePageIcone taille={24} rempli />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-bold">Reprendre ma lecture</span>
            <span className="block text-sm" style={{ color: "var(--muted)" }}>
              {sourateMarquee.nom} — verset {marque.v}
              {marque.t ? ` • ${depuis(marque.t)}` : ""}
            </span>
          </span>
          <span style={{ color: "var(--accent)" }}>→</span>
        </Link>
      )}

      {/* Installer l'appli sur le téléphone */}
      <GuideInstallation />

      {/* Modules */}
      <main className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {MODULES.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className="card flex items-center gap-4 rounded-2xl p-5 shadow-soft transition hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="tuile-icone">
              <m.icone taille={24} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-extrabold">{m.nom}</span>
              <span className="block text-sm" style={{ color: "var(--muted)" }}>
                {m.description}
              </span>
            </span>
            <span style={{ color: "var(--accent)" }}>→</span>
          </Link>
        ))}
      </main>

      <p
        className="mt-8 flex items-center justify-center gap-1.5 text-center text-xs"
        style={{ color: "var(--muted)" }}
      >
        <Pinceau taille={14} /> Personnalise ton appli (thème, couleurs,
        récitateur) — tes réglages restent sur ton appareil.
      </p>
    </div>
  );
}
