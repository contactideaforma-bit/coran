"use client";

/* Boussole de la Qibla : direction de la Kaaba depuis la position de
   l'utilisateur. Le cadran tourne avec l'orientation du téléphone ;
   l'aiguille dorée pointe vers La Mecque. Sans capteur (ordinateur),
   le cadran reste fixe, nord en haut. */

import { useCallback, useEffect, useRef, useState } from "react";
import { Boussole, KaabaIcone } from "@/components/Icones";

const KAABA = { lat: 21.422487, lon: 39.826206 };

/** Azimut (0-360°, depuis le nord, sens horaire) de la Kaaba. */
export function azimutQibla(lat: number, lon: number): number {
  const rad = Math.PI / 180;
  const φ1 = lat * rad;
  const φ2 = KAABA.lat * rad;
  const Δλ = (KAABA.lon - lon) * rad;
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return ((Math.atan2(y, x) / rad) + 360) % 360;
}

/** Distance orthodromique en km. */
function distanceKaaba(lat: number, lon: number): number {
  const rad = Math.PI / 180;
  const dφ = (KAABA.lat - lat) * rad;
  const dλ = (KAABA.lon - lon) * rad;
  const a =
    Math.sin(dφ / 2) ** 2 +
    Math.cos(lat * rad) * Math.cos(KAABA.lat * rad) * Math.sin(dλ / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const POINTS = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];
function pointCardinal(deg: number) {
  return POINTS[Math.round(deg / 45) % 8];
}

interface Props {
  /** Ville et pays des horaires, utilisés si la géolocalisation est refusée */
  ville?: string;
  pays?: string;
}

type EtatCapteur = "inconnu" | "actif" | "absent" | "refuse";

export default function BoussoleQibla({ ville, pays }: Props) {
  const [position, setPosition] = useState<{ lat: number; lon: number } | null>(null);
  const [origine, setOrigine] = useState<"gps" | "ville" | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  // Orientation du téléphone, arrondie au degré (mise à jour seulement
  // quand elle change : pas de re-rendu à 60 images/seconde)
  const [cap, setCap] = useState<number | null>(null);
  const [capteur, setCapteur] = useState<EtatCapteur>("inconnu");
  const [chargement, setChargement] = useState(false);
  const capLisse = useRef<number | null>(null);
  const cadranRef = useRef<SVGSVGElement | null>(null);
  const kaabaRef = useRef<HTMLDivElement | null>(null);
  const qiblaRef = useRef<number | null>(null);
  const imageRef = useRef<number | null>(null);

  /* ---- Position ---- */
  const localiserParVille = useCallback(async () => {
    if (!ville) throw new Error("Aucune ville enregistrée");
    const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(
      ville
    )}&country=${encodeURIComponent(pays || "France")}`;
    const res = await fetch(url);
    const json = await res.json();
    if (json.code !== 200) throw new Error("Ville introuvable");
    return { lat: Number(json.data.meta.latitude), lon: Number(json.data.meta.longitude) };
  }, [ville, pays]);

  const localiser = useCallback(() => {
    setChargement(true);
    setErreur(null);
    const parVille = () =>
      localiserParVille()
        .then((p) => {
          setPosition(p);
          setOrigine("ville");
        })
        .catch(() =>
          setErreur("Impossible de déterminer ta position. Autorise la localisation ou enregistre ta ville.")
        )
        .finally(() => setChargement(false));
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      parVille();
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        setOrigine("gps");
        setChargement(false);
      },
      () => parVille(),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 10 * 60 * 1000 }
    );
  }, [localiserParVille]);

  /* ---- Orientation du téléphone ---- */
  useEffect(() => {
    if (!position) return;
    if (typeof window === "undefined" || !("DeviceOrientationEvent" in window)) {
      setCapteur("absent");
      return;
    }
    let recu = false;
    const appliquer = () => {
      imageRef.current = null;
      const c = capLisse.current;
      if (c === null) return;
      const q = qiblaRef.current ?? 0;
      // Rotation appliquée directement au DOM (fluide, sans re-rendu React)
      if (cadranRef.current) cadranRef.current.style.transform = `rotate(${-c}deg)`;
      if (kaabaRef.current) kaabaRef.current.style.transform = `rotate(${q - c}deg)`;
      setCap((prev) => (prev !== null && Math.round(prev) === Math.round(c) ? prev : c));
    };
    const surOrientation = (e: DeviceOrientationEvent) => {
      // iOS fournit directement le cap boussole ; Android donne alpha (absolu)
      const ios = (e as DeviceOrientationEvent & { webkitCompassHeading?: number })
        .webkitCompassHeading;
      let valeur: number | null = null;
      if (typeof ios === "number" && !Number.isNaN(ios)) valeur = ios;
      else if (typeof e.alpha === "number") valeur = (360 - e.alpha) % 360;
      if (valeur === null) return;
      if (!recu) {
        recu = true;
        setCapteur("actif");
      }
      // Lissage circulaire pour éviter les tremblements
      const precedent = capLisse.current;
      if (precedent === null) capLisse.current = valeur;
      else {
        let delta = valeur - precedent;
        if (delta > 180) delta -= 360;
        if (delta < -180) delta += 360;
        capLisse.current = (precedent + delta * 0.25 + 360) % 360;
      }
      if (imageRef.current === null) imageRef.current = requestAnimationFrame(appliquer);
    };
    const abs = "ondeviceorientationabsolute" in window;
    const nom = abs ? "deviceorientationabsolute" : "deviceorientation";
    window.addEventListener(nom, surOrientation as EventListener, true);
    const verif = window.setTimeout(() => {
      if (!recu) setCapteur((c) => (c === "actif" ? c : "absent"));
    }, 2500);
    return () => {
      window.removeEventListener(nom, surOrientation as EventListener, true);
      window.clearTimeout(verif);
      if (imageRef.current !== null) cancelAnimationFrame(imageRef.current);
      imageRef.current = null;
    };
  }, [position]);

  /** iOS 13+ : la permission capteur doit être demandée sur un geste. */
  const demarrer = async () => {
    const DOE = (window as unknown as {
      DeviceOrientationEvent?: { requestPermission?: () => Promise<"granted" | "denied"> };
    }).DeviceOrientationEvent;
    if (DOE?.requestPermission) {
      try {
        const rep = await DOE.requestPermission();
        if (rep !== "granted") setCapteur("refuse");
      } catch {
        setCapteur("refuse");
      }
    }
    localiser();
  };

  const qibla = position ? azimutQibla(position.lat, position.lon) : null;
  qiblaRef.current = qibla;
  const distance = position ? distanceKaaba(position.lat, position.lon) : null;
  // Rotation du cadran : on tourne tout le cadran de -cap pour que le nord
  // réel reste en haut de l'écran ; l'aiguille Qibla est fixée sur le cadran.
  const rotationCadran = cap === null ? 0 : -cap;
  const ecart =
    qibla !== null && cap !== null
      ? ((((qibla - cap) % 360) + 540) % 360) - 180 // -180..180
      : null;
  const aligne = ecart !== null && Math.abs(ecart) < 4;

  return (
    <div className="card relief rounded-3xl p-5 shadow-soft">
      <div className="flex items-center gap-3">
        <span className="tuile-icone">
          <Boussole taille={22} />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-extrabold">Direction de la Qibla</h3>
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            {qibla === null
              ? "Trouve la direction de la Kaaba depuis l'endroit où tu es."
              : `${Math.round(qibla)}° ${pointCardinal(qibla)} • ${Math.round(
                  distance ?? 0
                ).toLocaleString("fr-FR")} km de La Mecque`}
          </p>
        </div>
      </div>

      {qibla === null ? (
        <div className="mt-4 text-center">
          <button
            onClick={demarrer}
            disabled={chargement}
            className="rounded-full px-6 py-3 font-bold shadow-soft transition hover:scale-105 active:scale-95 disabled:opacity-60"
            style={{ background: "var(--accent-fort)", color: "var(--sur-accent)" }}
          >
            {chargement ? "Localisation…" : "Afficher la boussole"}
          </button>
          {erreur && (
            <p className="mt-3 text-sm" style={{ color: "#b4452f" }}>
              {erreur}
            </p>
          )}
          <p className="mt-3 text-xs" style={{ color: "var(--muted)" }}>
            Ta position n&apos;est jamais envoyée ailleurs que pour le calcul sur ton appareil.
          </p>
        </div>
      ) : (
        <div className="mt-5 flex flex-col items-center">
          {/* Cadran */}
          <div
            className="relative rounded-full"
            style={{
              width: 240,
              height: 240,
              boxShadow: aligne ? "0 0 0 6px rgba(47,143,91,0.25), 0 0 32px rgba(47,143,91,0.45)" : "none",
              transition: "box-shadow 0.3s",
            }}
          >
            {/* Repère fixe en haut : direction où pointe le téléphone */}
            <div
              className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1"
              style={{
                width: 0,
                height: 0,
                borderLeft: "8px solid transparent",
                borderRight: "8px solid transparent",
                borderTop: `14px solid ${aligne ? "#2f8f5b" : "var(--accent-fort)"}`,
                transition: "border-color 0.3s",
              }}
            />
            <svg
              ref={cadranRef}
              viewBox="0 0 200 200"
              width={240}
              height={240}
              style={{
                transform: `rotate(${rotationCadran}deg)`,
                willChange: "transform",
                filter: "drop-shadow(0 8px 20px rgba(60,45,15,0.18))",
              }}
            >
              {/* Disque */}
              <defs>
                <radialGradient id="qibla-fond" cx="50%" cy="38%" r="70%">
                  <stop offset="0%" stopColor="var(--card)" />
                  <stop
                    offset="100%"
                    stopColor="color-mix(in srgb, var(--accent) 14%, var(--card))"
                  />
                </radialGradient>
              </defs>
              <circle cx="100" cy="100" r="96" fill="url(#qibla-fond)" />
              <circle
                cx="100"
                cy="100"
                r="96"
                fill="none"
                stroke="color-mix(in srgb, var(--accent) 55%, var(--border))"
                strokeWidth="2"
              />
              <circle
                cx="100"
                cy="100"
                r="78"
                fill="none"
                stroke="color-mix(in srgb, var(--accent) 30%, transparent)"
                strokeWidth="1"
              />
              {/* Graduations */}
              {Array.from({ length: 72 }).map((_, i) => {
                const grand = i % 9 === 0;
                const moyen = i % 3 === 0;
                return (
                  <line
                    key={i}
                    x1="100"
                    y1="8"
                    x2="100"
                    y2={grand ? 20 : moyen ? 15 : 12}
                    stroke={grand ? "var(--accent-fort)" : "var(--muted)"}
                    strokeWidth={grand ? 2 : 1}
                    strokeOpacity={grand ? 1 : 0.5}
                    transform={`rotate(${i * 5} 100 100)`}
                  />
                );
              })}
              {/* Points cardinaux */}
              {[
                ["N", 0],
                ["E", 90],
                ["S", 180],
                ["O", 270],
              ].map(([lettre, deg]) => (
                <text
                  key={lettre as string}
                  x="100"
                  y="34"
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="800"
                  fill={lettre === "N" ? "#b4452f" : "var(--text)"}
                  transform={`rotate(${deg} 100 100)`}
                  style={{ fontFamily: "inherit" }}
                >
                  {lettre}
                </text>
              ))}
              {/* Aiguille Qibla (fixée au cadran, orientée sur l'azimut) */}
              <g transform={`rotate(${qibla} 100 100)`}>
                <line
                  x1="100"
                  y1="100"
                  x2="100"
                  y2="44"
                  stroke="var(--accent-fort)"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <polygon
                  points="100,30 109,50 91,50"
                  fill="var(--accent-fort)"
                />
                <line
                  x1="100"
                  y1="100"
                  x2="100"
                  y2="140"
                  stroke="var(--muted)"
                  strokeWidth="3"
                  strokeOpacity="0.5"
                  strokeLinecap="round"
                />
              </g>
              <circle cx="100" cy="100" r="7" fill="var(--accent-fort)" />
              <circle cx="100" cy="100" r="3" fill="var(--card)" />
            </svg>
            {/* Kaaba sur l'aiguille, au-dessus du cadran */}
            <div
              ref={kaabaRef}
              className="pointer-events-none absolute inset-0 flex items-start justify-center"
              style={{
                transform: `rotate(${rotationCadran + (qibla ?? 0)}deg)`,
                willChange: "transform",
              }}
            >
              <span
                className="mt-[-2px] flex h-8 w-8 items-center justify-center rounded-full shadow-soft"
                style={{ background: "var(--card)", color: "var(--accent-fort)" }}
              >
                <KaabaIcone taille={18} />
              </span>
            </div>
          </div>

          {/* Lecture */}
          <div className="mt-4 text-center" style={{ minHeight: "6.5rem" }}>
            {capteur === "actif" && ecart !== null ? (
              <p
                className="text-lg font-extrabold tabular-nums"
                style={{ color: aligne ? "#2f8f5b" : "var(--text)", minHeight: "1.75rem" }}
              >
                {aligne
                  ? "Tu es face à la Qibla"
                  : ecart > 0
                    ? `Tourne vers la droite (${Math.round(Math.abs(ecart))}°)`
                    : `Tourne vers la gauche (${Math.round(Math.abs(ecart))}°)`}
              </p>
            ) : (
              <p className="text-sm font-bold">
                La Qibla est à {Math.round(qibla)}° — vers le {pointCardinal(qibla)}
              </p>
            )}
            <p className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
              {capteur === "actif"
                ? "Tiens le téléphone à plat et éloigne-le des objets métalliques."
                : capteur === "refuse"
                  ? "Accès à la boussole refusé : le cadran est fixe, nord en haut."
                  : capteur === "absent"
                    ? "Pas de capteur d'orientation ici : nord en haut, l'aiguille dorée montre la Qibla."
                    : "Recherche du capteur…"}
              {origine === "ville" && " Position estimée d'après ta ville."}
            </p>
            <button
              onClick={localiser}
              className="mt-3 text-xs font-bold underline underline-offset-2"
              style={{ color: "var(--accent-fort)" }}
            >
              Actualiser ma position
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
