"use client";

/* Bouton « Écouter » d'une invocation : lit l'enregistrement Hisn al-Muslim
   correspondant (via /api/invocations/audio). Un seul son à la fois. */

import { useEffect, useState } from "react";
import { HautParleur, Pause } from "@/components/Icones";

let elementPartage: HTMLAudioElement | null = null;
let cleEnCours: string | null = null;
const abonnes = new Set<() => void>();
const prevenir = () => abonnes.forEach((f) => f());

function element() {
  if (!elementPartage) {
    elementPartage = new Audio();
    elementPartage.preload = "none";
    elementPartage.onended = () => {
      cleEnCours = null;
      prevenir();
    };
    elementPartage.onpause = () => {
      if (elementPartage?.ended === false && elementPartage.currentTime > 0) {
        cleEnCours = null;
        prevenir();
      }
    };
  }
  return elementPartage;
}

/** Table { clé → id audio } chargée une fois pour toute la page. */
export function useCorrespondanceAudio() {
  const [table, setTable] = useState<Record<string, number> | null>(null);
  useEffect(() => {
    let annule = false;
    fetch("/api/invocations/correspondance")
      .then((r) => (r.ok ? r.json() : {}))
      .then((t) => {
        if (!annule) setTable(t);
      })
      .catch(() => {
        if (!annule) setTable({});
      });
    return () => {
      annule = true;
    };
  }, []);
  return table;
}

export default function EcouteInvocation({ cle, idAudio }: { cle: string; idAudio: number }) {
  const [, forcer] = useState(0);
  useEffect(() => {
    const f = () => forcer((x) => x + 1);
    abonnes.add(f);
    return () => {
      abonnes.delete(f);
    };
  }, []);
  const actif = cleEnCours === cle;

  const basculer = () => {
    const el = element();
    if (actif) {
      el.pause();
      cleEnCours = null;
      prevenir();
      return;
    }
    el.pause();
    el.src = `/api/invocations/audio/${idAudio}`;
    cleEnCours = cle;
    prevenir();
    el.play().catch(() => {
      cleEnCours = null;
      prevenir();
    });
  };

  return (
    <button
      type="button"
      onClick={basculer}
      aria-pressed={actif}
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition active:scale-95"
      style={{
        background: actif ? "var(--accent-fort)" : "color-mix(in srgb, var(--accent) 12%, transparent)",
        color: actif ? "var(--sur-accent)" : "var(--accent-fort)",
        border: "1px solid color-mix(in srgb, var(--accent) 35%, transparent)",
      }}
    >
      {actif ? <Pause taille={14} /> : <HautParleur taille={14} />}
      {actif ? "Pause" : "Écouter"}
    </button>
  );
}
