"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePrefs } from "@/lib/prefs";
import Personnalisation from "@/components/Personnalisation";
import { Etincelles, Lune, Soleil } from "@/components/Icones";

export default function Entete() {
  const { prefs, maj } = usePrefs();
  const [persoOuverte, setPersoOuverte] = useState(false);
  const [cachee, setCachee] = useState(false);

  // Masquer l'en-tête quand on descend, la réafficher quand on remonte
  useEffect(() => {
    let dernierY = window.scrollY;
    const surScroll = () => {
      const y = window.scrollY;
      if (y < 60) {
        setCachee(false);
      } else if (y > dernierY + 6) {
        setCachee(true);
      } else if (y < dernierY - 6) {
        setCachee(false);
      }
      dernierY = y;
    };
    window.addEventListener("scroll", surScroll, { passive: true });
    return () => window.removeEventListener("scroll", surScroll);
  }, []);

  return (
    <>
      <header
        className="entete-verre sticky top-3 z-20 flex items-center justify-between rounded-2xl px-4 py-3 shadow-soft transition-transform duration-300 ease-out"
        style={{
          transform: cachee ? "translateY(calc(-100% - 1rem))" : "translateY(0)",
        }}
      >
        <Link href="/" className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="My Easy Muslim"
            className="h-10 w-10 rounded-xl border"
            style={{ borderColor: "color-mix(in srgb, var(--accent) 25%, transparent)" }}
          />
          <span>
            <span className="block text-lg font-extrabold leading-tight">
              My Easy Muslim
            </span>
            <span className="block text-xs" style={{ color: "var(--muted)" }}>
              Ton compagnon du quotidien
            </span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPersoOuverte(true)}
            aria-label="Personnaliser l'appli"
            className="card rounded-xl p-2.5 transition hover:scale-105 active:scale-95"
            style={{ color: "var(--accent)" }}
          >
            <Etincelles taille={20} />
          </button>
          <button
            onClick={() => maj({ dark: !prefs.dark })}
            aria-label="Basculer le mode sombre"
            className="card rounded-xl p-2.5 transition hover:scale-105 active:scale-95"
            style={{ color: "var(--accent)" }}
          >
            {prefs.dark ? <Soleil taille={20} /> : <Lune taille={20} />}
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
