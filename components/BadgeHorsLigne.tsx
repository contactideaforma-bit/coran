"use client";

import { useEffect, useState } from "react";

/** Petit badge discret quand l'appareil est hors connexion.
 *  Explique pourquoi l'audio récité peut basculer en voix de synthèse. */
export default function BadgeHorsLigne() {
  const [horsLigne, setHorsLigne] = useState(false);

  useEffect(() => {
    setHorsLigne(!navigator.onLine);
    const on = () => setHorsLigne(false);
    const off = () => setHorsLigne(true);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  if (!horsLigne) return null;

  return (
    <div
      role="status"
      className="card fixed bottom-6 left-6 z-30 flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold shadow-soft"
      style={{ color: "var(--muted)" }}
    >
      {/* nuage barré */}
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M6.5 19a4.5 4.5 0 0 1-.4-8.98 6 6 0 0 1 11.3-1.85A5 5 0 0 1 17.5 19h-11" />
        <line x1="3" y1="3" x2="21" y2="21" />
      </svg>
      Hors connexion
    </div>
  );
}
