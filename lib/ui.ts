"use client";

import { useEffect } from "react";

/** Ferme une fenêtre (modale, bulle…) avec la touche Échap. */
export function useEchap(actif: boolean, fermer: () => void) {
  useEffect(() => {
    if (!actif) return;
    const surTouche = (e: KeyboardEvent) => {
      if (e.key === "Escape") fermer();
    };
    window.addEventListener("keydown", surTouche);
    return () => window.removeEventListener("keydown", surTouche);
  }, [actif, fermer]);
}
