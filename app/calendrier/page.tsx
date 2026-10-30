"use client";

import { useEffect, useState } from "react";
import { EVENEMENTS, type Evenement } from "@/data/evenements";
import {
  joursRestants,
  libelleHijri,
  prochaineDateHijri,
  versHijri,
} from "@/lib/hijri";
import Entete from "@/components/Entete";
import EnTeteRubrique from "@/components/EnTeteRubrique";
import { Cadeau, ICONES_EVENEMENTS, Lune, Verifie } from "@/components/Icones";

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
      // Jours blancs : les 13, 14 et 15 du mois lunaire
      const h = versHijri(auj);
      let date: Date;
      if (h.jour >= 13 && h.jour <= 15) {
        date = new Date(auj); // en cours
      } else {
        const mois = h.jour < 13 ? h.mois : (h.mois % 12) + 1;
        date = prochaineDateHijri(mois, 13, auj);
      }
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

  const enCours = agenda.filter((a) => a.jours !== null && a.jours <= 0);
  const aVenir = agenda.filter((a) => a.jours === null || a.jours > 0);
  const prochain = aVenir.find((a) => a.jours !== null) ?? null;

  const moisCourt = (d: Date) =>
    d.toLocaleDateString("fr-FR", { month: "short" }).replace(".", "");

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-4">
      <Entete />

      <EnTeteRubrique
        surtitre="Au quotidien"
        titre="Calendrier religieux"
        teinte="#4b55a8"
        filigrane="التقويم"
        image="https://images.pexels.com/photos/25181345/pexels-photo-25181345.jpeg?auto=compress&cs=tinysrgb&w=320&h=320&fit=crop"
        texte={
          hijriAuj
            ? `Aujourd'hui : ${hijriAuj} H — calendrier Umm al-Qura, à un jour près selon l'observation de la lune.`
            : "Les grandes dates de l'année, comptées depuis aujourd'hui."
        }
        enfants={
          prochain && prochain.date ? (
            <div className="mt-4 flex items-end gap-3">
              <span className="chiffre-edito" style={{ fontSize: "3.4rem", color: "var(--accent-fort)" }}>
                {prochain.jours}
              </span>
              <span className="pb-1 text-sm leading-tight">
                <span className="block font-extrabold">
                  jour{prochain.jours && prochain.jours > 1 ? "s" : ""} avant
                </span>
                <span className="block" style={{ color: "var(--muted)" }}>
                  {prochain.evt.nom.toLowerCase()}
                </span>
              </span>
            </div>
          ) : null
        }
      />

      {enCours.length > 0 && (
        <section className="mt-6 cascade">
          {enCours.map(({ evt }) => {
            const Icone = ICONES_EVENEMENTS[evt.icone] ?? Lune;
            return (
              <article
                key={evt.id}
                className="card relief rounded-3xl p-5"
                style={{ borderColor: "#2e7d5b" }}
              >
                <p className="hero-surtitre" style={{ color: "#2e7d5b" }}>
                  En ce moment
                </p>
                <h2 className="mt-2 flex items-center gap-3 text-2xl font-bold" style={{ fontFamily: "Marcellus, serif" }}>
                  <span style={{ color: "#2e7d5b" }}>
                    <Icone taille={26} />
                  </span>
                  {evt.nom}
                </h2>
                <p className="mt-2 text-sm">{evt.description}</p>
                <ul className="mt-3 space-y-1">
                  {evt.conseils.map((c, i) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <span style={{ color: "#2e7d5b" }}>•</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </section>
      )}

      <div className="titre-edito">
        <small>I</small>
        <h2>À venir</h2>
      </div>

      <main className="frise cascade">
        {aVenir.map(({ evt, date, jours }) => {
          const Icone = ICONES_EVENEMENTS[evt.icone] ?? Lune;
          return (
            <details key={evt.id} className="group relative mb-3">
              <span className="frise-point">
                <Icone taille={18} />
              </span>
              <summary className="card flex cursor-pointer list-none items-center gap-3 rounded-3xl p-4 shadow-soft transition active:scale-[0.99]">
                {date ? (
                  <span className="w-12 shrink-0 text-center">
                    <span className="chiffre-edito block" style={{ fontSize: "2.1rem" }}>
                      {date.getDate()}
                    </span>
                    <span
                      className="block text-[11px] font-extrabold uppercase tracking-widest"
                      style={{ color: "var(--muted)" }}
                    >
                      {moisCourt(date)}
                    </span>
                  </span>
                ) : (
                  <span className="w-12 shrink-0 text-center">
                    <span className="chiffre-edito block" style={{ fontSize: "1.3rem", lineHeight: 1.1 }}>
                      L · J
                    </span>
                    <span
                      className="block text-[11px] font-extrabold uppercase tracking-widest"
                      style={{ color: "var(--muted)" }}
                    >
                      hebdo
                    </span>
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block font-extrabold leading-tight">{evt.nom}</span>
                  <span className="mt-0.5 block text-xs" style={{ color: "var(--muted)" }}>
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
                <span className={`etiquette ${jours !== null && jours <= 0 ? "en-cours" : ""}`}>
                  {libelleDelai(jours)}
                </span>
              </summary>
              <div
                className="card mt-2 space-y-3 rounded-3xl p-4"
                style={{ borderColor: "color-mix(in srgb, var(--accent) 35%, var(--border))" }}
              >
                <p className="text-sm">{evt.description}</p>
                <div>
                  <p className="flex items-center gap-1.5 text-sm font-bold">
                    <Verifie taille={15} /> Conseillé :
                  </p>
                  <ul className="mt-1 space-y-1">
                    {evt.conseils.map((c, i) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <span style={{ color: "var(--accent-fort)" }}>•</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
                <div
                  className="rounded-2xl p-3 text-sm"
                  style={{ backgroundColor: "color-mix(in srgb, var(--accent) 10%, transparent)" }}
                >
                  <p className="flex items-center gap-1.5 font-bold">
                    <Cadeau taille={15} /> Récompense :
                  </p>
                  <p className="mt-1 italic">{evt.recompense}</p>
                  <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                    — {evt.source}
                  </p>
                </div>
              </div>
            </details>
          );
        })}
      </main>

      <p className="mt-6 text-center text-xs" style={{ color: "var(--muted)" }}>
        Les dates exactes dépendent de l&apos;observation de la lune : vérifie
        auprès de ta mosquée à l&apos;approche d&apos;un événement.
      </p>
    </div>
  );
}
