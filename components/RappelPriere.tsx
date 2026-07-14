"use client";

import { useEffect } from "react";
import {
  chargerHoraires,
  lireConfigPriere,
  prochainePriere,
  type HorairesJour,
} from "@/lib/prieres";
import { montrerNotification, notifsActivees } from "@/lib/notifications";

const NOMS: Partial<Record<keyof HorairesJour, string>> = {
  fajr: "Fajr",
  dhuhr: "Dhuhr",
  asr: "Asr",
  maghrib: "Maghrib",
  isha: "Isha",
};

/** Planifie la notification de la prochaine prière tant que l'appli
 *  est ouverte. Monté dans le layout : actif sur toutes les pages. */
export default function RappelPriere() {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    let annule = false;

    const poser = (fn: () => void, delai: number) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(fn, delai);
    };

    const planifier = async () => {
      if (annule || !notifsActivees()) return;
      const config = lireConfigPriere();
      if (!config) return;

      let h: HorairesJour;
      try {
        h = await chargerHoraires(config);
      } catch {
        poser(planifier, 30 * 60_000); // hors-ligne : réessayer dans 30 min
        return;
      }
      if (annule) return;

      const id = prochainePriere(h);
      if (!id) {
        // Toutes les prières du jour sont passées : replanifier après minuit
        const demain = new Date();
        demain.setHours(24, 5, 0, 0);
        poser(planifier, demain.getTime() - Date.now());
        return;
      }

      const [hh, mm] = h[id].split(":").map(Number);
      const cible = new Date();
      cible.setHours(hh, mm, 0, 0);
      poser(() => {
        montrerNotification(
          `C'est l'heure de ${NOMS[id]} 🕌`,
          `${h[id]} — ${config.ville}`
        );
        // Passer à la prière suivante
        poser(planifier, 61_000);
      }, Math.max(0, cible.getTime() - Date.now()));
    };

    planifier();

    // Les minuteurs sont gelés quand l'onglet dort : recaler au réveil
    const recaler = () => {
      if (document.visibilityState === "visible") planifier();
    };
    document.addEventListener("visibilitychange", recaler);
    window.addEventListener("notifs-priere-changees", planifier);
    return () => {
      annule = true;
      if (timer) clearTimeout(timer);
      document.removeEventListener("visibilitychange", recaler);
      window.removeEventListener("notifs-priere-changees", planifier);
    };
  }, []);

  return null;
}
