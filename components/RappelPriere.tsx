"use client";

import { useEffect } from "react";
import { chargerHoraires, lireConfigPriere } from "@/lib/prieres";
import {
  montrerNotification,
  notifsActivees,
  pushActif,
} from "@/lib/notifications";
import {
  NOMS_PRIERES,
  PRIERES_NOTIFIABLES,
  enMinutes,
  lireConfigNotifs,
} from "@/lib/rappels";

interface Echeance {
  quand: number; // horodatage
  titre: string;
  corps: string;
  url: string;
}

/** Mode secours (sans Web Push) : planifie la prochaine notification tant
 *  que l'appli est ouverte. Monté dans le layout : actif sur toutes les pages.
 *  Inactif dès que l'appareil est abonné au push (le serveur s'en charge). */
export default function RappelPriere() {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    let annule = false;

    const poser = (fn: () => void, delai: number) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(fn, Math.min(delai, 2_147_000_000));
    };

    /** Prochaine échéance (prière ou rappel Coran) à partir de maintenant. */
    const prochaine = async (): Promise<Echeance | null> => {
      const notifs = lireConfigNotifs();
      const maintenant = new Date();
      const candidats: Echeance[] = [];

      const aDate = (hhmm: string, decalageJours = 0, avance = 0) => {
        const d = new Date(maintenant);
        d.setDate(d.getDate() + decalageJours);
        d.setHours(0, enMinutes(hhmm) - avance, 0, 0);
        return d.getTime();
      };

      // Prières du jour
      const config = lireConfigPriere();
      const voulues = PRIERES_NOTIFIABLES.filter((p) => notifs.prieres[p]);
      if (config && voulues.length) {
        const h = await chargerHoraires(config); // peut lever (hors-ligne)
        for (const p of voulues) {
          const quand = aDate(h[p], 0, notifs.avance);
          if (quand > maintenant.getTime()) {
            candidats.push({
              quand,
              titre:
                notifs.avance > 0
                  ? `${NOMS_PRIERES[p]} dans ${notifs.avance} min 🕌`
                  : `C'est l'heure de ${NOMS_PRIERES[p]} 🕌`,
              corps: `${h[p]} — ${config.ville}`,
              url: "/prieres",
            });
          }
        }
      }

      // Rappels Coran (aujourd'hui et les 7 prochains jours)
      for (const r of notifs.rappels) {
        if (!r.actif || r.jours.length === 0) continue;
        for (let j = 0; j <= 7; j++) {
          const d = new Date(maintenant);
          d.setDate(d.getDate() + j);
          if (!r.jours.includes(d.getDay())) continue;
          const quand = aDate(r.heure, j);
          if (quand > maintenant.getTime()) {
            candidats.push({
              quand,
              titre: "Rappel Coran 📖",
              corps: r.message,
              url: "/coran",
            });
            break;
          }
        }
      }

      candidats.sort((a, b) => a.quand - b.quand);
      return candidats[0] ?? null;
    };

    const planifier = async () => {
      if (annule || !notifsActivees() || pushActif()) return;
      let e: Echeance | null;
      try {
        e = await prochaine();
      } catch {
        poser(planifier, 30 * 60_000); // hors-ligne : réessayer dans 30 min
        return;
      }
      if (annule) return;
      if (!e) {
        // Rien avant demain : replanifier juste après minuit
        const demain = new Date();
        demain.setHours(24, 5, 0, 0);
        poser(planifier, demain.getTime() - Date.now());
        return;
      }
      poser(() => {
        montrerNotification(e.titre, e.corps, e.url);
        poser(planifier, 61_000);
      }, Math.max(0, e.quand - Date.now()));
    };

    planifier();

    // Les minuteurs sont gelés quand l'onglet dort : recaler au réveil
    const recaler = () => {
      if (document.visibilityState === "visible") planifier();
    };
    document.addEventListener("visibilitychange", recaler);
    window.addEventListener("notifs-priere-changees", planifier);
    window.addEventListener("notifs-changees", planifier);
    return () => {
      annule = true;
      if (timer) clearTimeout(timer);
      document.removeEventListener("visibilitychange", recaler);
      window.removeEventListener("notifs-priere-changees", planifier);
      window.removeEventListener("notifs-changees", planifier);
    };
  }, []);

  return null;
}
