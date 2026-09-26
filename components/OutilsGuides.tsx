"use client";

/* Outils interactifs des guides : compteur de tawâf, compteur de sa'y,
   et calcul du dernier tiers de la nuit à partir des horaires de prière. */

import Link from "next/link";
import { useEffect, useState } from "react";
import { chargerHoraires, lireConfigPriere, type HorairesJour } from "@/lib/prieres";
import { Kaaba } from "@/components/IllustrationsGuides";

/* ---------- Compteurs persistés (on ne perd pas le compte si l'appli se ferme) ---------- */

function useCompteur(cle: string, max: number) {
  const [n, setN] = useState(0);
  useEffect(() => {
    try {
      const v = Number(localStorage.getItem(cle));
      if (Number.isInteger(v) && v >= 0 && v <= max) setN(v);
    } catch {}
  }, [cle, max]);
  const changer = (v: number) => {
    const borne = Math.max(0, Math.min(max, v));
    setN(borne);
    try {
      localStorage.setItem(cle, String(borne));
    } catch {}
    try {
      navigator.vibrate?.(borne === max ? [40, 60, 40] : 30);
    } catch {}
  };
  return [n, changer] as const;
}

const bouton =
  "rounded-full px-4 py-2 text-sm font-bold transition active:scale-95 disabled:opacity-40";

/** Arc de cercle (angles en degrés, 0 = en haut, sens horaire). */
function arc(cx: number, cy: number, r: number, de: number, a: number) {
  const pt = (deg: number) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return `${(cx + r * Math.cos(rad)).toFixed(2)} ${(cy + r * Math.sin(rad)).toFixed(2)}`;
  };
  return `M${pt(de)} A${r} ${r} 0 0 ${a > de ? 1 : 0} ${pt(a)}`;
}

export function CompteurTawaf() {
  const [n, changer] = useCompteur("coran-omra-tawaf", 7);
  const fini = n === 7;
  const tour = n + 1;

  let message: string;
  if (fini) message = "Tawâf terminé ! Recouvre ton épaule droite et va vers le Maqâm Ibrâhîm.";
  else if (n === 0)
    message = "Face à la Pierre noire : montre-la de la main droite, dis « Allâhu akbar » et démarre, la Ka'ba à ta gauche.";
  else
    message = `Tour ${tour} : ${
      tour <= 3 ? "marche rapide à petits pas (raml) pour les hommes" : "marche normale"
    }. En repassant la Pierre noire : « Allâhu akbar ».`;

  return (
    <div className="card mt-4 rounded-2xl p-4 text-center">
      <p className="text-sm font-extrabold" style={{ color: "var(--accent)" }}>
        Compteur de tours
      </p>
      <svg viewBox="0 0 200 200" className="mx-auto mt-2 h-48 w-48" aria-hidden="true">
        {/* 7 segments, dans le sens inverse des aiguilles d'une montre */}
        {Array.from({ length: 7 }, (_, i) => {
          const de = -i * (360 / 7) - 3;
          const a = -(i + 1) * (360 / 7) + 3;
          return (
            <path
              key={i}
              d={arc(100, 100, 82, de, a)}
              fill="none"
              strokeWidth="14"
              strokeLinecap="round"
              stroke={i < n ? "var(--accent)" : "var(--border)"}
              style={{ transition: "stroke .3s" }}
            />
          );
        })}
        <g transform="translate(76 66) scale(1.5)">
          <Kaaba x={0} y={0} />
        </g>
      </svg>
      <p className="-mt-2 text-3xl font-extrabold">
        {n}
        <span className="text-lg" style={{ color: "var(--muted)" }}>
          /7
        </span>
      </p>
      <p className="mt-2 text-sm" aria-live="polite">
        {message}
      </p>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => changer(n - 1)}
          disabled={n === 0}
          className={`${bouton} card`}
          aria-label="Retirer un tour"
        >
          −1
        </button>
        <button
          onClick={() => changer(n + 1)}
          disabled={fini}
          className={`${bouton} px-6 py-3 text-base text-white shadow-soft`}
          style={{ background: "var(--accent)" }}
        >
          {fini ? "7 tours ✓" : `Tour ${tour} terminé ✓`}
        </button>
        <button onClick={() => changer(0)} disabled={n === 0} className={`${bouton} card`}>
          Recommencer
        </button>
      </div>
    </div>
  );
}

export function CompteurSay() {
  const [n, changer] = useCompteur("coran-omra-say", 7);
  const fini = n === 7;
  const trajet = n + 1;
  const versMarwa = trajet % 2 === 1;
  const aMarwa = n % 2 === 1; // position actuelle

  const message = fini
    ? "Sa'y terminé à Marwa ! Il ne reste plus que la coupe des cheveux."
    : n === 0
      ? "Sur le Ṣafâ : face à la Ka'ba, dis le dhikr 3 fois en invoquant entre chaque, puis descends vers Marwa."
      : `Trajet ${trajet} : ${versMarwa ? "Ṣafâ → Marwa" : "Marwa → Ṣafâ"}. Arrivé, refais le dhikr face à la Ka'ba.`;

  return (
    <div className="card mt-4 rounded-2xl p-4 text-center">
      <p className="text-sm font-extrabold" style={{ color: "var(--accent)" }}>
        Compteur de trajets
      </p>
      <div className="mt-3 flex items-center gap-2">
        <span
          className="shrink-0 rounded-full px-3 py-1 text-xs font-extrabold"
          style={{
            background: !aMarwa ? "var(--accent)" : "transparent",
            color: !aMarwa ? "#fff" : "var(--text)",
            border: "1px solid var(--accent)",
          }}
        >
          Ṣafâ
        </span>
        <div className="flex flex-1 items-center justify-between">
          {Array.from({ length: 7 }, (_, i) => (
            <span
              key={i}
              className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold"
              style={{
                background: i < n ? "var(--accent)" : "transparent",
                color: i < n ? "#fff" : "var(--muted)",
                border: `2px solid ${i === n ? "var(--accent)" : "var(--border)"}`,
                transition: "background .3s",
              }}
            >
              {i + 1}
            </span>
          ))}
        </div>
        <span
          className="shrink-0 rounded-full px-3 py-1 text-xs font-extrabold"
          style={{
            background: aMarwa ? "var(--accent)" : "transparent",
            color: aMarwa ? "#fff" : "var(--text)",
            border: "1px solid var(--accent)",
          }}
        >
          Marwa
        </span>
      </div>
      {!fini && (
        <p className="mt-3 text-2xl font-extrabold" style={{ color: "var(--accent)" }}>
          {versMarwa ? "→" : "←"}
        </p>
      )}
      <p className="mt-1 text-sm" aria-live="polite">
        {message}
      </p>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => changer(n - 1)}
          disabled={n === 0}
          className={`${bouton} card`}
          aria-label="Retirer un trajet"
        >
          −1
        </button>
        <button
          onClick={() => changer(n + 1)}
          disabled={fini}
          className={`${bouton} px-6 py-3 text-base text-white shadow-soft`}
          style={{ background: "var(--accent)" }}
        >
          {fini ? "7 trajets ✓" : `Arrivé ${versMarwa ? "à Marwa" : "au Ṣafâ"} ✓`}
        </button>
        <button onClick={() => changer(0)} disabled={n === 0} className={`${bouton} card`}>
          Recommencer
        </button>
      </div>
    </div>
  );
}

/* ---------- Dernier tiers de la nuit ---------- */

const enMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
const enHeure = (min: number) => {
  const m = ((Math.round(min) % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
};

/** La nuit va du Maghrib au Fajr du lendemain (approximé par le Fajr du jour). */
export function calculerNuit(h: Pick<HorairesJour, "maghrib" | "fajr">) {
  const debut = enMin(h.maghrib);
  const fin = enMin(h.fajr) + 1440;
  const duree = fin - debut;
  return {
    milieu: enHeure(debut + duree / 2),
    dernierTiers: enHeure(fin - duree / 3),
    fajr: h.fajr,
    maghrib: h.maghrib,
  };
}

export function DernierTiers() {
  const [etat, setEtat] = useState<
    | { t: "chargement" }
    | { t: "sans-ville" }
    | { t: "erreur" }
    | { t: "ok"; ville: string; nuit: ReturnType<typeof calculerNuit> }
  >({ t: "chargement" });

  useEffect(() => {
    const config = lireConfigPriere();
    if (!config) {
      setEtat({ t: "sans-ville" });
      return;
    }
    chargerHoraires(config)
      .then((h) => setEtat({ t: "ok", ville: config.ville, nuit: calculerNuit(h) }))
      .catch(() => setEtat({ t: "erreur" }));
  }, []);

  return (
    <div className="card mt-4 rounded-2xl p-4">
      <p className="text-sm font-extrabold" style={{ color: "var(--accent)" }}>
        Ta nuit ce soir
      </p>
      {etat.t === "chargement" && (
        <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
          Calcul en cours…
        </p>
      )}
      {etat.t === "sans-ville" && (
        <p className="mt-2 text-sm">
          Choisis ta ville dans{" "}
          <Link href="/prieres" className="font-bold underline" style={{ color: "var(--accent)" }}>
            Prières
          </Link>{" "}
          pour voir l'heure du dernier tiers de la nuit.
        </p>
      )}
      {etat.t === "erreur" && (
        <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
          Horaires indisponibles pour le moment (hors ligne ?).
        </p>
      )}
      {etat.t === "ok" && (
        <>
          <div className="mt-3 grid grid-cols-2 gap-2 text-center sm:grid-cols-4">
            {[
              { l: "Maghrib", v: etat.nuit.maghrib },
              { l: "Milieu de la nuit", v: etat.nuit.milieu },
              { l: "Dernier tiers", v: etat.nuit.dernierTiers, fort: true },
              { l: "Fajr", v: etat.nuit.fajr },
            ].map((c) => (
              <div
                key={c.l}
                className="rounded-xl p-2"
                style={{
                  border: `${c.fort ? 2 : 1}px solid ${c.fort ? "var(--accent)" : "var(--border)"}`,
                }}
              >
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  {c.l}
                </p>
                <p className="text-lg font-extrabold" style={c.fort ? { color: "var(--accent)" } : undefined}>
                  {c.v}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
            À {etat.ville}, le dernier tiers commence vers {etat.nuit.dernierTiers} et dure
            jusqu'au Fajr ({etat.nuit.fajr}). Horaires approximatifs.
          </p>
        </>
      )}
    </div>
  );
}
