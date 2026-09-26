/* Paysages animés en SVG + CSS pour le fond du Scroll halal :
   aucun fichier vidéo à télécharger, aucun droit, fonctionne hors ligne.
   Animations définies dans globals.css (préfixe fil-). */

import { useId } from "react";
import type { SceneId } from "@/data/fil";

/** Générateur pseudo-aléatoire déterministe (mêmes étoiles à chaque rendu). */
function aleatoire(graine: number) {
  let x = graine;
  return () => {
    x = (x * 16807) % 2147483647;
    return (x - 1) / 2147483646;
  };
}

/** Vague répétitive (période 50) sur 250 unités de large, pour boucler par translation de 100. */
function vague(y: number, amp: number) {
  let d = `M-50 ${y}`;
  for (let i = 0; i < 6; i++) d += ` q12.5 ${-amp} 25 0 t25 0`;
  return `${d} V178 H-50 Z`;
}

function Degrade({ id, couleurs }: { id: string; couleurs: [number, string][] }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      {couleurs.map(([o, c]) => (
        <stop key={o} offset={o} stopColor={c} />
      ))}
    </linearGradient>
  );
}

function NuageSvg({ y, duree, retard, echelle = 1, opacite = 0.7 }: { y: number; duree: number; retard: number; echelle?: number; opacite?: number }) {
  return (
    <g className="fil-traverse" style={{ animationDuration: `${duree}s`, animationDelay: `${-retard}s` }}>
      <g transform={`translate(0 ${y}) scale(${echelle})`} fill="#fff" opacity={opacite}>
        <ellipse cx="0" cy="0" rx="12" ry="4" />
        <ellipse cx="6" cy="-2.5" rx="7" ry="4" />
        <ellipse cx="-5" cy="-1.5" rx="6" ry="3" />
      </g>
    </g>
  );
}

function Aube({ u }: { u: string }) {
  return (
    <>
      <defs>
        <Degrade id={`${u}c`} couleurs={[[0, "#c9b6e0"], [0.45, "#f3b6a0"], [0.75, "#fbd9b4"]]} />
      </defs>
      <rect width="100" height="178" fill={`url(#${u}c)`} />
      <circle cx="50" cy="118" r="30" fill="#fff3d6" className="fil-respire" />
      <circle cx="50" cy="118" r="15" fill="#fff6e2" />
      <NuageSvg y={40} duree={80} retard={20} />
      <NuageSvg y={70} duree={110} retard={70} echelle={0.7} opacite={0.5} />
      <g className="fil-traverse" style={{ animationDuration: "45s" }} fill="none" stroke="#5a4a6e" strokeWidth="0.6" strokeLinecap="round">
        <path d="M0 60 q2 -2 4 0 q2 -2 4 0" />
        <path d="M10 55 q1.5 -1.5 3 0 q1.5 -1.5 3 0" />
        <path d="M6 66 q1.5 -1.5 3 0 q1.5 -1.5 3 0" />
      </g>
      <path d="M0 128 Q25 112 50 126 T100 120 V178 H0z" fill="#b58fa3" />
      <path d="M0 144 Q30 130 60 145 T100 138 V178 H0z" fill="#8e6f8e" />
      <path d="M0 160 Q40 148 70 161 T100 156 V178 H0z" fill="#6d5577" />
    </>
  );
}

function Mer({ u }: { u: string }) {
  const r = aleatoire(7);
  return (
    <>
      <defs>
        <Degrade id={`${u}c`} couleurs={[[0, "#a9d6ee"], [0.55, "#fdf1dc"]]} />
        <Degrade id={`${u}m`} couleurs={[[0, "#6fb3cf"], [1, "#2b6a8f"]]} />
      </defs>
      <rect width="100" height="100" fill={`url(#${u}c)`} />
      <circle cx="70" cy="62" r="22" fill="#fff8e0" className="fil-respire" />
      <circle cx="70" cy="62" r="9" fill="#fffaf0" />
      <NuageSvg y={30} duree={90} retard={30} />
      <rect y="98" width="100" height="80" fill={`url(#${u}m)`} />
      <g className="fil-derive" style={{ animationDuration: "18s" }}>
        <path d={vague(104, 1.5)} fill="#8cc6dc" opacity="0.8" />
      </g>
      <g className="fil-derive fil-inverse" style={{ animationDuration: "13s" }}>
        <path d={vague(122, 2.5)} fill="#4f95b8" opacity="0.8" />
      </g>
      <g className="fil-derive" style={{ animationDuration: "9s" }}>
        <path d={vague(146, 3.5)} fill="#2f7aa3" opacity="0.85" />
      </g>
      {Array.from({ length: 14 }, (_, i) => (
        <ellipse
          key={i}
          cx={50 + r() * 45}
          cy={102 + r() * 30}
          rx={1.2 + r() * 1.5}
          ry="0.3"
          fill="#fff"
          className="fil-scintille"
          style={{ animationDelay: `${r() * 3}s` }}
        />
      ))}
    </>
  );
}

function Desert({ u }: { u: string }) {
  const r = aleatoire(3);
  return (
    <>
      <defs>
        <Degrade id={`${u}c`} couleurs={[[0, "#f6d7a7"], [0.6, "#fbe9c9"]]} />
      </defs>
      <rect width="100" height="178" fill={`url(#${u}c)`} />
      <circle cx="30" cy="72" r="28" fill="#fff4dc" className="fil-respire" />
      <circle cx="30" cy="72" r="13" fill="#fff8ea" />
      <path d="M0 118 Q30 100 60 116 T100 110 V178 H0z" fill="#ecc284" />
      <path d="M0 136 Q35 122 70 138 T100 130 V178 H0z" fill="#dda15e" />
      <path d="M0 156 Q45 140 80 158 T100 152 V178 H0z" fill="#c4833f" />
      <g className="fil-traverse" style={{ animationDuration: "14s" }} stroke="#fff" strokeWidth="0.4" strokeLinecap="round" opacity="0.5">
        {Array.from({ length: 10 }, (_, i) => {
          const y = 110 + r() * 50;
          const x = r() * 40;
          return <path key={i} d={`M${x} ${y} h${4 + r() * 6}`} />;
        })}
      </g>
    </>
  );
}

function Nuit({ u }: { u: string }) {
  const r = aleatoire(11);
  return (
    <>
      <defs>
        <Degrade id={`${u}c`} couleurs={[[0, "#0e1a38"], [0.7, "#2b3d6a"], [1, "#44557f"]]} />
      </defs>
      <rect width="100" height="178" fill={`url(#${u}c)`} />
      {Array.from({ length: 55 }, (_, i) => (
        <circle
          key={i}
          cx={r() * 100}
          cy={r() * 120}
          r={0.2 + r() * 0.45}
          fill="#fff"
          className="fil-scintille"
          style={{ animationDelay: `${r() * 4}s`, animationDuration: `${2.5 + r() * 3}s` }}
        />
      ))}
      <circle cx="72" cy="38" r="20" fill="#fdf3c8" opacity="0.12" className="fil-respire" />
      <path d="M72 26a12 12 0 1 0 9 20A10 10 0 1 1 72 26z" fill="#fdf3c8" />
      <path d="M0 140 L18 118 L30 130 L46 108 L62 128 L76 114 L100 136 V178 H0z" fill="#1b2747" />
      <path d="M0 156 L22 140 L40 152 L60 136 L82 150 L100 144 V178 H0z" fill="#121b33" />
    </>
  );
}

function Foret({ u }: { u: string }) {
  const r = aleatoire(5);
  const sapin = (x: number, y: number, h: number, c: string, k: number) => (
    <path key={k} d={`M${x} ${y - h} L${x + h * 0.32} ${y} L${x - h * 0.32} ${y}z`} fill={c} />
  );
  return (
    <>
      <defs>
        <Degrade id={`${u}c`} couleurs={[[0, "#b9cbc3"], [1, "#e4ece6"]]} />
      </defs>
      <rect width="100" height="178" fill={`url(#${u}c)`} />
      <NuageSvg y={34} duree={100} retard={10} echelle={1.4} opacite={0.55} />
      {Array.from({ length: 12 }, (_, i) => sapin(i * 9 + r() * 4, 132, 22 + r() * 10, "#8aa89a", i))}
      <rect y="130" width="100" height="48" fill="#8aa89a" />
      {Array.from({ length: 9 }, (_, i) => sapin(i * 12 + r() * 5, 156, 30 + r() * 14, "#4f7262", 20 + i))}
      <rect y="154" width="100" height="24" fill="#4f7262" />
      {Array.from({ length: 7 }, (_, i) => sapin(i * 16 + r() * 6, 178, 40 + r() * 16, "#2f4f41", 40 + i))}
      <g className="fil-pluie" stroke="#fff" strokeWidth="0.35" strokeLinecap="round" opacity="0.55">
        {Array.from({ length: 70 }, (_, i) => {
          const x = r() * 140;
          const y = r() * 356 - 178;
          return <path key={i} d={`M${x} ${y} l-1 5`} />;
        })}
      </g>
    </>
  );
}

function Montagnes({ u }: { u: string }) {
  return (
    <>
      <defs>
        <Degrade id={`${u}c`} couleurs={[[0, "#cfe2f5"], [0.7, "#f6efe6"]]} />
        <Degrade id={`${u}l`} couleurs={[[0, "#a7c4dc"], [1, "#7fa3c2"]]} />
      </defs>
      <rect width="100" height="178" fill={`url(#${u}c)`} />
      <NuageSvg y={36} duree={95} retard={40} echelle={1.2} />
      <NuageSvg y={58} duree={130} retard={5} echelle={0.8} opacite={0.5} />
      <path d="M0 132 L20 92 L32 108 L52 76 L70 104 L84 90 L100 118 V140 H0z" fill="#9fb3c8" />
      <path d="M52 76 L45 88 L50 86 L54 90 L58 85 L61 88z M20 92 L15 102 L20 100 L24 103z M84 90 L80 97 L85 96 L88 99z" fill="#fff" />
      <path d="M0 140 L28 112 L44 126 L64 106 L86 128 L100 120 V146 H0z" fill="#7f95ad" />
      <rect y="144" width="100" height="34" fill={`url(#${u}l)`} />
      <g className="fil-derive" style={{ animationDuration: "20s" }} opacity="0.35">
        <path d={vague(150, 0.6)} fill="#fff" opacity="0.4" />
      </g>
    </>
  );
}

const SCENES_SVG: Record<SceneId, (p: { u: string }) => JSX.Element> = {
  aube: Aube,
  mer: Mer,
  desert: Desert,
  nuit: Nuit,
  foret: Foret,
  montagnes: Montagnes,
};

export default function SceneNature({ scene, anime }: { scene: SceneId; anime: boolean }) {
  const u = useId().replace(/[^a-zA-Z0-9]/g, "");
  const Dessin = SCENES_SVG[scene];
  return (
    <svg
      viewBox="0 0 100 178"
      preserveAspectRatio="xMidYMid slice"
      className={`absolute inset-0 h-full w-full ${anime ? "" : "scene-fige"}`}
      aria-hidden="true"
    >
      <Dessin u={u} />
    </svg>
  );
}
