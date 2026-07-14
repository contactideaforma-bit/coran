"use client";

import { useEffect, useState } from "react";

/* ============================================================
   Guide d'installation de l'appli (PWA) sur l'écran d'accueil.
   - Bannière sur l'accueil, masquée si l'appli est déjà installée
     ou si l'utilisateur l'a fermée.
   - Guide illustré étape par étape, iOS / Android détecté
     automatiquement (changeable par onglets).
   - Sur Android/Chrome : installation native en 1 clic quand
     le navigateur le permet (beforeinstallprompt).
   ============================================================ */

type Os = "ios" | "android";

interface EvenementInstallation extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const CLE_MASQUE = "coran-guide-install-masque";

/* ===== Illustrations (dessinées aux couleurs du thème) ===== */

const Cadre = ({ children }: { children: React.ReactNode }) => (
  <svg
    viewBox="0 0 220 150"
    className="h-32 w-full"
    role="img"
    aria-hidden="true"
  >
    {/* écran de téléphone */}
    <rect
      x="30"
      y="6"
      width="160"
      height="138"
      rx="16"
      fill="var(--bg)"
      stroke="var(--border)"
      strokeWidth="2"
    />
    {children}
  </svg>
);

const Surligne = ({ x, y, r }: { x: number; y: number; r: number }) => (
  <circle
    cx={x}
    cy={y}
    r={r}
    fill="none"
    stroke="var(--accent)"
    strokeWidth="2.5"
    strokeDasharray="4 3"
  />
);

/** iOS étape 1 : le bouton Partager de Safari */
const IllusPartageIos = () => (
  <Cadre>
    {/* contenu de page */}
    <rect x="44" y="22" width="132" height="8" rx="4" fill="var(--border)" />
    <rect x="44" y="38" width="100" height="8" rx="4" fill="var(--border)" />
    <rect x="44" y="54" width="118" height="8" rx="4" fill="var(--border)" />
    {/* barre Safari en bas */}
    <rect x="30" y="106" width="160" height="38" rx="14" fill="var(--card)" />
    <path
      d="M62 128 l0 -12 m-5 5 l5 -5 l5 5"
      stroke="var(--muted)"
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
    />
    {/* icône partager au centre : carré + flèche vers le haut */}
    <rect
      x="102"
      y="119"
      width="16"
      height="14"
      rx="3"
      fill="none"
      stroke="var(--accent)"
      strokeWidth="2.5"
    />
    <path
      d="M110 126 V110 M104.5 115 L110 109.5 L115.5 115"
      stroke="var(--accent)"
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="158" cy="125" r="7" fill="none" stroke="var(--muted)" strokeWidth="2" />
    <Surligne x={110} y={122} r={17} />
  </Cadre>
);

/** iOS étape 2 : « Sur l'écran d'accueil » dans le menu de partage */
const IllusMenuIos = () => (
  <Cadre>
    {/* feuille de partage */}
    <rect x="38" y="30" width="144" height="106" rx="12" fill="var(--card)" />
    <rect x="50" y="44" width="80" height="7" rx="3.5" fill="var(--border)" />
    <rect x="50" y="60" width="60" height="7" rx="3.5" fill="var(--border)" />
    {/* ligne mise en avant */}
    <rect
      x="44"
      y="76"
      width="132"
      height="26"
      rx="8"
      fill="color-mix(in srgb, var(--accent) 12%, transparent)"
      stroke="var(--accent)"
      strokeWidth="2"
    />
    <rect x="52" y="82" width="76" height="7" rx="3.5" fill="var(--accent)" />
    {/* icône plus dans un carré */}
    <rect
      x="150"
      y="80"
      width="18"
      height="18"
      rx="4"
      fill="none"
      stroke="var(--accent)"
      strokeWidth="2"
    />
    <path
      d="M159 84.5 v9 M154.5 89 h9"
      stroke="var(--accent)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <rect x="50" y="112" width="70" height="7" rx="3.5" fill="var(--border)" />
  </Cadre>
);

/** Android étape 1 : le menu ⋮ de Chrome */
const IllusMenuAndroid = () => (
  <Cadre>
    {/* barre Chrome en haut */}
    <rect x="30" y="6" width="160" height="34" rx="14" fill="var(--card)" />
    <rect x="44" y="15" width="106" height="16" rx="8" fill="var(--bg)" stroke="var(--border)" />
    <rect x="52" y="21" width="66" height="5" rx="2.5" fill="var(--border)" />
    {/* trois points */}
    <circle cx="170" cy="17" r="2.4" fill="var(--accent)" />
    <circle cx="170" cy="24" r="2.4" fill="var(--accent)" />
    <circle cx="170" cy="31" r="2.4" fill="var(--accent)" />
    <Surligne x={170} y={24} r={12} />
    {/* contenu */}
    <rect x="44" y="54" width="132" height="8" rx="4" fill="var(--border)" />
    <rect x="44" y="70" width="100" height="8" rx="4" fill="var(--border)" />
    <rect x="44" y="86" width="118" height="8" rx="4" fill="var(--border)" />
  </Cadre>
);

/** Android étape 2 : « Ajouter à l'écran d'accueil » */
const IllusMenuAndroid2 = () => (
  <Cadre>
    {/* menu déroulant */}
    <rect x="70" y="14" width="116" height="122" rx="10" fill="var(--card)" />
    <rect x="82" y="26" width="70" height="7" rx="3.5" fill="var(--border)" />
    <rect x="82" y="44" width="56" height="7" rx="3.5" fill="var(--border)" />
    <rect x="82" y="62" width="80" height="7" rx="3.5" fill="var(--border)" />
    {/* ligne mise en avant */}
    <rect
      x="76"
      y="78"
      width="104"
      height="26"
      rx="8"
      fill="color-mix(in srgb, var(--accent) 12%, transparent)"
      stroke="var(--accent)"
      strokeWidth="2"
    />
    {/* petit téléphone avec + */}
    <rect
      x="84"
      y="83"
      width="11"
      height="16"
      rx="2.5"
      fill="none"
      stroke="var(--accent)"
      strokeWidth="2"
    />
    <path d="M97 87 h6 M100 84 v6" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
    <rect x="110" y="87" width="60" height="7" rx="3.5" fill="var(--accent)" />
    <rect x="82" y="114" width="64" height="7" rx="3.5" fill="var(--border)" />
  </Cadre>
);

/** Étape finale (commune) : l'icône sur l'écran d'accueil */
const IllusAccueil = () => (
  <Cadre>
    {/* grille d'icônes */}
    {[0, 1, 2].map((c) =>
      [0, 1].map((l) => (
        <rect
          key={`${c}-${l}`}
          x={52 + c * 42}
          y={26 + l * 44}
          width="26"
          height="26"
          rx="7"
          fill="var(--border)"
        />
      ))
    )}
    {/* l'icône de l'appli, mise en avant */}
    <rect x="136" y="114" width="0" height="0" fill="none" />
    <rect
      x="92"
      y="108"
      width="30"
      height="30"
      rx="8"
      fill="var(--accent)"
    />
    {/* livre ouvert simplifié */}
    <path
      d="M99 117 q8 -4 8 0 v10 q0 -4 -8 0 Z M115 117 q-8 -4 -8 0 v10 q0 -4 8 0 Z"
      fill="var(--card)"
    />
    <Surligne x={107} y={123} r={21} />
  </Cadre>
);

/* ===== Étapes ===== */

const ETAPES: Record<
  Os,
  { titre: string; texte: string; illus: () => React.ReactNode }[]
> = {
  ios: [
    {
      titre: "Ouvre le site dans Safari",
      texte:
        "Puis touche le bouton Partager (le carré avec une flèche vers le haut), en bas au centre de l'écran.",
      illus: IllusPartageIos,
    },
    {
      titre: "« Sur l'écran d'accueil »",
      texte:
        "Fais défiler la liste et touche « Sur l'écran d'accueil » (icône carré avec un +).",
      illus: IllusMenuIos,
    },
    {
      titre: "Touche « Ajouter »",
      texte:
        "L'icône My Easy Muslim apparaît sur ton écran d'accueil, comme une vraie appli — et elle fonctionne même hors connexion.",
      illus: IllusAccueil,
    },
  ],
  android: [
    {
      titre: "Ouvre le site dans Chrome",
      texte:
        "Puis touche le menu ⋮ (les trois points), en haut à droite de l'écran.",
      illus: IllusMenuAndroid,
    },
    {
      titre: "« Ajouter à l'écran d'accueil »",
      texte:
        "Touche « Ajouter à l'écran d'accueil » ou « Installer l'application », puis confirme.",
      illus: IllusMenuAndroid2,
    },
    {
      titre: "C'est installé !",
      texte:
        "L'icône My Easy Muslim apparaît sur ton écran d'accueil, comme une vraie appli — et elle fonctionne même hors connexion.",
      illus: IllusAccueil,
    },
  ],
};

/* ===== Composant ===== */

export default function GuideInstallation() {
  const [banniere, setBanniere] = useState(false);
  const [ouvert, setOuvert] = useState(false);
  const [os, setOs] = useState<Os>("android");
  const [promptNatif, setPromptNatif] = useState<EvenementInstallation | null>(
    null
  );

  useEffect(() => {
    // Déjà installée (mode standalone) : ne rien afficher
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;
    if (standalone) return;

    // Détection du système
    const estIos =
      /iphone|ipad|ipod/i.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setOs(estIos ? "ios" : "android");

    if (localStorage.getItem(CLE_MASQUE) !== "1") setBanniere(true);

    // Android/Chrome : capter l'invitation d'installation native
    const surPrompt = (e: Event) => {
      e.preventDefault();
      setPromptNatif(e as EvenementInstallation);
    };
    const surInstallee = () => {
      setBanniere(false);
      setOuvert(false);
    };
    window.addEventListener("beforeinstallprompt", surPrompt);
    window.addEventListener("appinstalled", surInstallee);
    return () => {
      window.removeEventListener("beforeinstallprompt", surPrompt);
      window.removeEventListener("appinstalled", surInstallee);
    };
  }, []);

  const masquer = () => {
    setBanniere(false);
    try {
      localStorage.setItem(CLE_MASQUE, "1");
    } catch {}
  };

  const installerNatif = async () => {
    if (!promptNatif) return;
    await promptNatif.prompt();
    const { outcome } = await promptNatif.userChoice;
    setPromptNatif(null);
    if (outcome === "accepted") {
      setBanniere(false);
      setOuvert(false);
      masquer();
    }
  };

  return (
    <>
      {/* ===== Bannière sur l'accueil ===== */}
      {banniere && (
        <div
          className="card mt-4 flex items-center gap-3 rounded-2xl p-4 shadow-soft"
          style={{ borderColor: "var(--accent)" }}
        >
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--accent) 15%, transparent)",
              color: "var(--accent)",
            }}
          >
            {/* petit téléphone avec flèche */}
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
              <rect
                x="7"
                y="2.5"
                width="10"
                height="19"
                rx="2.5"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M12 14.5 V7.5 M9 10.5 L12 7.5 L15 10.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-extrabold">
              Installe l&apos;appli sur ton téléphone
            </span>
            <span className="block text-xs" style={{ color: "var(--muted)" }}>
              Gratuit, en 30 secondes — accessible même hors connexion
            </span>
          </span>
          <button
            onClick={() => setOuvert(true)}
            className="shrink-0 rounded-full px-4 py-2 text-sm font-bold text-white transition active:scale-95"
            style={{ backgroundColor: "var(--accent)" }}
          >
            Voir comment
          </button>
          <button
            onClick={masquer}
            className="shrink-0 text-lg font-bold"
            style={{ color: "var(--muted)" }}
            aria-label="Ne plus afficher"
          >
            ✕
          </button>
        </div>
      )}

      {/* ===== Guide illustré ===== */}
      {ouvert && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
          onClick={() => setOuvert(false)}
        >
          <div
            className="card pop max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-t-3xl p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-extrabold">
                Installer l&apos;appli
              </h2>
              <button
                onClick={() => setOuvert(false)}
                className="card rounded-full px-3 py-1 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Onglets iOS / Android */}
            <div className="mb-4 flex gap-2">
              {(
                [
                  ["ios", "iPhone / iPad"],
                  ["android", "Android"],
                ] as [Os, string][]
              ).map(([id, nom]) => (
                <button
                  key={id}
                  onClick={() => setOs(id)}
                  className="flex-1 rounded-full border px-4 py-2 text-sm font-bold transition active:scale-95"
                  style={{
                    borderColor: os === id ? "var(--accent)" : "var(--border)",
                    backgroundColor:
                      os === id ? "var(--accent)" : "var(--card)",
                    color: os === id ? "#fff" : "var(--text)",
                  }}
                >
                  {nom}
                </button>
              ))}
            </div>

            {/* Installation en 1 clic (Android/Chrome) */}
            {os === "android" && promptNatif && (
              <button
                onClick={installerNatif}
                className="mb-4 w-full rounded-2xl px-4 py-3 font-bold text-white shadow-soft transition active:scale-[0.99]"
                style={{ backgroundColor: "var(--accent)" }}
              >
                📲 Installer maintenant (en 1 clic)
              </button>
            )}

            <ol className="space-y-4">
              {ETAPES[os].map((e, i) => (
                <li
                  key={i}
                  className="rounded-2xl border p-4"
                  style={{ borderColor: "var(--border)" }}
                >
                  <p className="flex items-center gap-2 font-extrabold">
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm text-white"
                      style={{ backgroundColor: "var(--accent)" }}
                    >
                      {i + 1}
                    </span>
                    {e.titre}
                  </p>
                  <div className="mt-3">{e.illus()}</div>
                  <p
                    className="mt-2 text-sm"
                    style={{ color: "var(--muted)" }}
                  >
                    {e.texte}
                  </p>
                </li>
              ))}
            </ol>

            <p
              className="mt-4 text-center text-xs"
              style={{ color: "var(--muted)" }}
            >
              {os === "ios"
                ? "Astuce : sur iPhone, l'installation ne fonctionne que depuis Safari."
                : "Astuce : sur Android, utilise Chrome pour installer l'appli."}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
