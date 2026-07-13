"use client";

import Link from "next/link";
import { useState } from "react";
import { usePrefs } from "@/lib/prefs";
import Personnalisation from "@/components/Personnalisation";

export default function Entete() {
  const { prefs, maj } = usePrefs();
  const [persoOuverte, setPersoOuverte] = useState(false);

  return (
    <>
      <header className="card sticky top-3 z-20 flex items-center justify-between rounded-2xl px-4 py-3 shadow-soft">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">📖</span>
          <span>
            <span className="block text-lg font-extrabold leading-tight">
              Coran Tajwid
            </span>
            <span className="block text-xs" style={{ color: "var(--muted)" }}>
              Lire, écouter, perfectionner
            </span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPersoOuverte(true)}
            aria-label="Personnaliser l'appli"
            className="card rounded-xl px-3 py-2 text-lg transition hover:scale-105 active:scale-95"
          >
            ✨
          </button>
          <button
            onClick={() => maj({ dark: !prefs.dark })}
            aria-label="Basculer le mode sombre"
            className="card rounded-xl px-3 py-2 text-lg transition hover:scale-105 active:scale-95"
          >
            {prefs.dark ? "☀️" : "🌙"}
          </button>
        </div>
      </header>

      <Personnalisation
        ouvert={persoOuverte}
        fermer={() => setPersoOuverte(false)}
      />
    </>
  );
}
