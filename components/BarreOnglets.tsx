"use client";

/* Barre d'onglets fixe en bas de l'écran, présente sur toutes les pages
   (sauf le Scroll halal, qui est plein écran). */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Coeur, Defiler, Horloge, LivreOuvert, Maison } from "@/components/Icones";

const ONGLETS = [
  { href: "/", nom: "Accueil", icone: Maison, actif: (p: string) => p === "/" },
  {
    href: "/coran",
    nom: "Coran",
    icone: LivreOuvert,
    actif: (p: string) => /^\/(coran|sourate|apprentissage|nourania|vocabulaire)/.test(p),
  },
  {
    href: "/prieres",
    nom: "Prières",
    icone: Horloge,
    actif: (p: string) => /^\/(prieres|rappels|calendrier)/.test(p),
  },
  {
    href: "/invocations",
    nom: "Invocations",
    icone: Coeur,
    actif: (p: string) => /^\/(invocations|omra)/.test(p),
  },
  { href: "/scroll", nom: "Scroll", icone: Defiler, actif: (p: string) => p.startsWith("/scroll") },
];

export default function BarreOnglets() {
  const chemin = usePathname() ?? "/";
  const masquee = chemin.startsWith("/scroll");

  // Réserve la place de la barre en bas de page (voir globals.css)
  useEffect(() => {
    document.documentElement.classList.toggle("avec-onglets", !masquee);
  }, [masquee]);

  if (masquee) return null;

  return (
    <nav
      aria-label="Navigation principale"
      className="barre-onglets fixed inset-x-0 bottom-0 z-40"
    >
      <ul className="mx-auto flex max-w-3xl items-stretch justify-around px-2">
        {ONGLETS.map((o) => {
          const actif = o.actif(chemin);
          return (
            <li key={o.href} className="flex-1">
              <Link
                href={o.href}
                aria-current={actif ? "page" : undefined}
                className="flex flex-col items-center gap-0.5 py-2 transition active:scale-90"
                style={{ color: actif ? "var(--accent-fort)" : "var(--muted)" }}
              >
                <span
                  className="flex h-8 w-14 items-center justify-center rounded-full transition-colors"
                  style={{
                    background: actif
                      ? "color-mix(in srgb, var(--accent) 18%, transparent)"
                      : "transparent",
                  }}
                >
                  <o.icone taille={22} />
                </span>
                <span className={`text-[11px] leading-none ${actif ? "font-extrabold" : "font-semibold"}`}>
                  {o.nom}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
