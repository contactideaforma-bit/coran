"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { EVENEMENTS, type Evenement } from "@/data/evenements";
import {
  joursRestants,
  libelleHijri,
  prochaineDateHijri,
  versHijri,
} from "@/lib/hijri";
import Entete from "@/components/Entete";

interface EvenementDate {
  evt: Evenement;
  date: Date | null; // null = récurrent hebdomadaire
  jours: number | null;
}

function calculerAgenda(): EvenementDate[] {
  const auj = new Date();
  const liste: EvenementDate[] = [];

  for (const evt of EVENEMENTS) {
    if (evt.recurrent === "hebdomadaire") {
      liste.push({ evt, date: null, jours: null });
      continue;
    }
    if (evt.recurrent === "mensuel") {
      // Jours blancs : prochaine occurrence du 13 du mois lunaire
      const h = versHijri(auj);
      const mois = h.jour <= 15 ? h.mois : (h.mois % 12) + 1;
      const date = prochaineDateHijri(mois, 13, auj);
      liste.push({ evt, date, jours: joursRestants(date) });
      continue;
    }
    if (evt.hijri) {
      let date = prochaineDateHijri(evt.hijri.mois, evt.hijri.jour, auj);
      // Événement sur plusieurs jours déjà commencé ? Afficher "en cours"
      const duree = evt.hijri.duree ?? 1;
      const h = versHijri(auj);
      if (
        h.mois === evt.hijri.mois &&
        h.jour >= evt.hijri.jour &&
        h.jour < evt.hijri.jour + duree
      ) {
        date = new Date(auj);
      }
      liste.push({ evt, date, jours: joursRestants(date) });
    }
  }

  return liste.sort((a, b) => {
    if (a.jours === null) return 1;
    if (b.jours === null) return -1;
    return a.jours - b.jours;
  });
}

function libelleDelai(jours: number | null): string {
  if (jours === null) return "Chaque semaine";
  if (jours <= 0) return "En cours !";
  if (jours === 1) return "Demain";
  if (jours < 30) return `Dans ${jours} jours`;
  const mois = Math.round(jours / 30);
  return `Dans ~${mois} mois`;
}

export default function Calendrier() {
  const [agenda, setAgenda] = useState<EvenementDate[]>([]);
  const [hijriAuj, setHijriAuj] = useState("");

  useEffect(() => {
    setAgenda(calculerAgenda());
    setHijriAuj(libelleHijri(versHijri(new Date())));
  }, []);

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
        <h2 className="text-xl font-extrabold">📅 Calendrier religieux</h2>
      </section>

      {hijriAuj && (
        <p className="mt-4 text-center text-sm" style={{ color: "var(--muted)" }}>
          Aujourd&apos;hui : <span className="font-bold">{hijriAuj} H</span>{" "}
          (calendrier Umm al-Qura — la date peut varier d&apos;un jour selon
          l&apos;observation de la lune)
        </p>
      )}

      <main className="mt-5 space-y-3">
        {agenda.map(({ evt, date, jours }) => (
          <details
            key={evt.id}
            className="card overflow-hidden rounded-2xl shadow-soft"
          >
            <summary className="flex cursor-pointer list-none items-center gap-3 p-4">
              <span className="text-2xl">{evt.emoji}</span>
              <span className="min-w-0 flex-1">
                <span className="block font-bold">{evt.nom}</span>
                <span
                  className="block text-sm"
                  style={{ color: "var(--muted)" }}
                >
                  {date
                    ? date.toLocaleDateString("fr-FR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "Lundi et jeudi"}
                </span>
              </span>
              <span
                className="shrink-0 rounded-full px-3 py-1 text-xs font-bold text-white"
                style={{
                  backgroundColor:
                    jours !== null && jours <= 0
                      ? "#2e7d5b"
                      : "var(--accent)",
                }}
              >
                {libelleDelai(jours)}
              </span>
            </summary>
            <div
              className="space-y-3 border-t px-4 pb-4 pt-3"
              style={{ borderColor: "var(--border)" }}
            >
              <p className="text-sm">{evt.description}</p>
              <div>
                <p className="text-sm font-bold">✅ Conseillé :</p>
                <ul className="mt-1 space-y-1">
                  {evt.conseils.map((c, i) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <span style={{ color: "var(--accent)" }}>•</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
              <div
                className="rounded-xl p-3 text-sm"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--accent) 10%, transparent)",
                }}
              >
                <p className="font-bold">🎁 Récompense :</p>
                <p className="mt-1 italic">{evt.recompense}</p>
                <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                  — {evt.source}
                </p>
              </div>
            </div>
          </details>
        ))}
      </main>

      <p className="mt-6 text-center text-xs" style={{ color: "var(--muted)" }}>
        Les dates exactes dépendent de l&apos;observation de la lune : vérifie
        auprès de ta mosquée à l&apos;approche d&apos;un événement.
      </p>
    </div>
  );
}
