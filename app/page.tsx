"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { hadithDuJour, type Hadith } from "@/data/hadiths";
import { EVENEMENTS, type Evenement } from "@/data/evenements";
import { SOURATES } from "@/data/sourates";
import {
  joursRestants,
  libelleHijri,
  prochaineDateHijri,
  versHijri,
} from "@/lib/hijri";
import { lireMarquePage, type MarquePage } from "@/lib/marquePage";
import Entete from "@/components/Entete";
import {
  Calendrier as IconeCalendrier,
  Citation,
  Coeur,
  Etincelles,
  Horloge,
  ICONES_EVENEMENTS,
  Lettres,
  LivreOuvert,
  Lune,
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
];

interface ProchainEvenement {
  evt: Evenement;
  date: Date;
  jours: number;
}

function prochainEvenement(): ProchainEvenement | null {
  const auj = new Date();
  let meilleur: ProchainEvenement | null = null;
  for (const evt of EVENEMENTS) {
    if (!evt.hijri) continue;
    let date = prochaineDateHijri(evt.hijri.mois, evt.hijri.jour, auj);
    const duree = evt.hijri.duree ?? 1;
    const h = versHijri(auj);
    if (
      h.mois === evt.hijri.mois &&
      h.jour >= evt.hijri.jour &&
      h.jour < evt.hijri.jour + duree
    ) {
      date = new Date(auj);
    }
    const jours = joursRestants(date);
    if (!meilleur || jours < meilleur.jours) {
      meilleur = { evt, date, jours };
    }
  }
  return meilleur;
}

export default function Accueil() {
  const [hadith, setHadith] = useState<Hadith | null>(null);
  const [hijri, setHijri] = useState("");
  const [prochain, setProchain] = useState<ProchainEvenement | null>(null);
  const [marque, setMarque] = useState<MarquePage | null>(null);

  useEffect(() => {
    setHadith(hadithDuJour());
    setHijri(libelleHijri(versHijri(new Date())));
    setProchain(prochainEvenement());
    setMarque(lireMarquePage());
  }, []);

  const sourateMarquee = marque
    ? SOURATES.find((s) => s.n === marque.s)
    : null;

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-4">
      <Entete />

      {/* Salutation + date hijri */}
      <section className="mt-6 text-center">
        <h2 className="text-2xl font-extrabold">Assalâmu alaykum</h2>
        {hijri && (
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            Nous sommes le <span className="font-bold">{hijri} H</span>
          </p>
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
            </span>
          </span>
          <span style={{ color: "var(--accent)" }}>→</span>
        </Link>
      )}

      {/* Prochain événement */}
      {prochain && (
        <Link
          href="/calendrier"
          className="card mt-4 flex items-center gap-3 rounded-2xl p-4 shadow-soft transition hover:scale-[1.02] active:scale-[0.98]"
        >
          <span style={{ color: "var(--accent)" }}>
            {(() => {
              const Icone = ICONES_EVENEMENTS[prochain.evt.icone] ?? Lune;
              return <Icone taille={24} />;
            })()}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-bold">{prochain.evt.nom}</span>
            <span className="block text-sm" style={{ color: "var(--muted)" }}>
              {prochain.date.toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </span>
          </span>
          <span
            className="shrink-0 rounded-full px-3 py-1 text-xs font-bold text-white"
            style={{
              backgroundColor:
                prochain.jours <= 0 ? "#2e7d5b" : "var(--accent)",
            }}
          >
            {prochain.jours <= 0
              ? "En cours !"
              : prochain.jours === 1
                ? "Demain"
                : `Dans ${prochain.jours} jours`}
          </span>
        </Link>
      )}

      {/* Modules */}
      <main className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {MODULES.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className="card flex items-center gap-4 rounded-2xl p-5 shadow-soft transition hover:scale-[1.02] active:scale-[0.98]"
          >
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
              style={{
                backgroundColor:
                  "color-mix(in srgb, var(--accent) 15%, transparent)",
                color: "var(--accent)",
              }}
            >
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
        <Etincelles taille={14} /> Personnalise ton appli (thème, couleurs,
        récitateur) — tes réglages restent sur ton appareil.
      </p>
    </div>
  );
}
