/* Illustrations des guides pas à pas (prière de la nuit, istikhâra, omra).
   SVG maison, trait = couleur du texte (currentColor), aplats = var(--accent). */

const A = "var(--accent)";
const DOUX = "color-mix(in srgb, var(--accent) 18%, transparent)";

function Cadre({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 96 96"
      width="100%"
      height="100%"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

/** Petite étoile à 4 branches. */
const Scintille = ({ x, y, r = 3 }: { x: number; y: number; r?: number }) => (
  <path
    d={`M${x} ${y - r}Q${x} ${y} ${x + r} ${y}Q${x} ${y} ${x} ${y + r}Q${x} ${y} ${x - r} ${y}Q${x} ${y} ${x} ${y - r}z`}
    fill={A}
    stroke="none"
  />
);

/** La Ka'ba vue de trois quarts. */
function Kaaba({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 8 L16 0 L32 8 L32 34 L16 42 L0 34z" fill="#26221f" stroke="none" />
      <path d="M16 0 L32 8 L16 16 L0 8z" fill="#3a3430" stroke="none" />
      <path d="M16 16 L16 42" stroke="#4a433d" strokeWidth="1" />
      <path d="M0 14 L16 22 L32 14" stroke={A} strokeWidth="3" />
      <path d="M21 27.5 L27 24.5 L27 34.5 L21 37.5z" fill={A} stroke="none" />
    </g>
  );
}

const ILLUSTRATIONS: Record<string, () => JSX.Element> = {
  lune: () => (
    <Cadre>
      <path d="M60 14a26 26 0 1 0 22 36A21 21 0 1 1 60 14z" fill={A} stroke="none" />
      <Scintille x={22} y={20} r={4} />
      <Scintille x={36} y={34} r={2.5} />
      <Scintille x={16} y={44} r={2.5} />
      <path d="M6 84c14-10 26-10 42 0s28 10 42 0" />
    </Cadre>
  ),
  lit: () => (
    <Cadre>
      <path d="M10 70V40M10 58h76v12M86 58V50a8 8 0 0 0-8-8H40v16" />
      <rect x="16" y="46" width="18" height="10" rx="5" fill={DOUX} />
      <path d="M58 16h10l-10 12h10M74 8h7l-7 8h7" stroke={A} />
      <path d="M8 78h80" />
    </Cadre>
  ),
  reveil: () => (
    <Cadre>
      <circle cx="48" cy="52" r="26" fill={DOUX} />
      <path d="M48 36v16l10 8" />
      <path d="M22 26l10-8M74 26l-10-8" stroke={A} strokeWidth="4" />
      <path d="M32 78l-6 8M64 78l6 8" />
      <path d="M40 10h16" stroke={A} />
    </Cadre>
  ),
  goutte: () => (
    <Cadre>
      <path d="M48 12c-2 14-20 26-20 44a20 20 0 0 0 40 0c0-18-18-30-20-44z" fill={A} stroke="none" />
      <path d="M40 58a9 9 0 0 0 8 9" stroke="var(--sur-accent)" strokeWidth="3" />
      <path d="M14 84c6-4 12-4 18 0s12 4 18 0 12-4 18 0 12 4 14 2" />
    </Cadre>
  ),
  paires: () => (
    <Cadre>
      {[8, 26, 52, 70].map((x, i) => (
        <g key={x}>
          <rect x={x} y="30" width="16" height="40" rx="3" fill={i < 2 ? A : DOUX} stroke={i < 2 ? "none" : "currentColor"} />
          <path d={`M${x + 4} 38a4 4 0 0 1 8 0`} stroke={i < 2 ? "#fff" : "currentColor"} />
        </g>
      ))}
      <path d="M16 80h18M60 80h18" stroke={A} />
      <text x="48" y="22" textAnchor="middle" fontSize="12" fill="currentColor" stroke="none" fontWeight="700">2 + 2 + …</text>
    </Cadre>
  ),
  witr: () => (
    <Cadre>
      <rect x="10" y="34" width="16" height="36" rx="3" fill={DOUX} />
      <rect x="30" y="34" width="16" height="36" rx="3" fill={DOUX} />
      <rect x="56" y="24" width="26" height="50" rx="4" fill={A} stroke="none" />
      <text x="69" y="56" textAnchor="middle" fontSize="20" fill="var(--sur-accent)" stroke="none" fontWeight="800">1</text>
      <Scintille x={86} y={16} r={5} />
    </Cadre>
  ),
  impair: () => (
    <Cadre>
      {[1, 3, 5, 7].map((n, i) => (
        <g key={n}>
          <circle cx={16 + i * 21} cy={i % 2 ? 58 : 42} r="9" fill={i === 0 ? A : DOUX} stroke={i === 0 ? "none" : "currentColor"} />
          <text x={16 + i * 21} y={(i % 2 ? 58 : 42) + 4.5} textAnchor="middle" fontSize="13" fontWeight="800" fill={i === 0 ? "#fff" : "currentColor"} stroke="none">{n}</text>
        </g>
      ))}
      <path d="M58 16a12 12 0 1 0 10 18A9.5 9.5 0 1 1 58 16z" fill={A} stroke="none" transform="translate(52 -2) scale(0.6)" />
      <path d="M10 82h76" strokeDasharray="3 5" />
    </Cadre>
  ),
  porte: () => (
    <Cadre>
      <path d="M22 88V34a26 26 0 0 1 52 0v54" fill={DOUX} />
      <path d="M48 88V20" strokeWidth="1.5" />
      <path d="M48 88L66 80V26L48 20" fill={A} stroke="none" />
      <circle cx="61" cy="54" r="2.5" fill="var(--sur-accent)" stroke="none" />
      <path d="M8 88h80" />
      <path d="M36 4v6M18 12l4 5M78 12l-4 5" stroke={A} strokeWidth="3" />
    </Cadre>
  ),
  coeur: () => (
    <Cadre>
      <path d="M48 82C26 66 12 54 12 36a18 18 0 0 1 36-4 18 18 0 0 1 36 4c0 18-14 30-36 46z" fill={DOUX} />
      <path d="M48 82C70 66 84 54 84 36a18 18 0 0 0-36-4z" fill={A} stroke="none" />
      <path d="M48 32l-6 12 10 6-6 12" strokeWidth="3" />
    </Cadre>
  ),
  balance: () => (
    <Cadre>
      <path d="M48 12v70M30 86h36M20 24h56" />
      <circle cx="48" cy="12" r="4" fill={A} stroke="none" />
      <path d="M20 24L8 52h24zM76 24L64 52h24z" />
      <path d="M8 52a12 6 0 0 0 24 0z" fill={A} stroke="none" />
      <path d="M64 52a12 6 0 0 0 24 0z" fill={DOUX} />
    </Cadre>
  ),
  mains: () => (
    <Cadre>
      <path d="M46 84V56c0-6-3-10-8-14l-10-9c-3-3-7 0-5 4l7 12-12-16c-3-3-7 0-5 4l12 18c-3 6-1 14 6 20" fill={DOUX} />
      <path d="M50 84V56c0-6 3-10 8-14l10-9c3-3 7 0 5 4l-7 12 12-16c3-3 7 0 5 4L71 59c3 6 1 14-6 20" fill={DOUX} />
      <path d="M48 8v10M30 14l5 8M66 14l-5 8" stroke={A} strokeWidth="3" />
    </Cadre>
  ),
  etoile: () => (
    <Cadre>
      {Array.from({ length: 7 }, (_, i) => (
        <circle key={i} cx={12 + i * 12} cy="62" r="5" fill={i < 5 ? A : "none"} stroke={i < 5 ? "none" : "currentColor"} />
      ))}
      <path d="M12 62h72" strokeWidth="1.5" strokeDasharray="2 4" />
      <path d="M48 12l6 13 14 2-10 10 2 14-12-7-12 7 2-14-10-10 14-2z" fill={A} stroke="none" />
    </Cadre>
  ),
  carrefour: () => (
    <Cadre>
      <path d="M48 88V58L22 30M48 58l26-28" strokeWidth="6" stroke={DOUX} />
      <path d="M48 88V58L22 30M48 58l26-28" />
      <path d="M16 36l6-6 2 8M80 36l-6-6-2 8" />
      <text x="48" y="30" textAnchor="middle" fontSize="26" fill={A} stroke="none" fontWeight="800">?</text>
    </Cadre>
  ),
  tapis: () => (
    <Cadre>
      <rect x="24" y="12" width="48" height="70" rx="3" fill={DOUX} />
      <path d="M32 44V30a16 16 0 0 1 32 0v14" stroke={A} strokeWidth="3" />
      <rect x="32" y="52" width="32" height="20" rx="2" />
      <path d="M28 82v6M36 82v6M44 82v6M52 82v6M60 82v6M68 82v6" strokeWidth="1.5" />
    </Cadre>
  ),
  chemin: () => (
    <Cadre>
      <path d="M22 88c10-20 34-18 30-38s14-24 18-32" strokeWidth="7" stroke={DOUX} />
      <path d="M22 88c10-20 34-18 30-38s14-24 18-32" strokeDasharray="4 6" />
      <circle cx="72" cy="16" r="9" fill={A} stroke="none" />
      <path d="M72 2v4M86 16h-4M82 6l-3 3M62 6l3 3" stroke={A} />
    </Cadre>
  ),
  valise: () => (
    <Cadre>
      <rect x="16" y="32" width="64" height="46" rx="6" fill={DOUX} />
      <path d="M36 32v-8a4 4 0 0 1 4-4h16a4 4 0 0 1 4 4v8M36 32v46M60 32v46" />
      <path d="M70 40l10-10" stroke={A} />
      <rect x="74" y="20" width="12" height="9" rx="2" transform="rotate(-45 80 25)" fill={A} stroke="none" />
    </Cadre>
  ),
  miqat: () => (
    <Cadre>
      <path d="M8 80h80" />
      <path d="M30 80V30" strokeWidth="3" />
      <path d="M30 30h32l-6 8 6 8H30" fill={A} stroke="none" />
      <path transform="translate(56 4) scale(1.3) rotate(60 12 12)" d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="currentColor" stroke="none" />
      <path d="M44 60c10-2 22-2 40 4" strokeDasharray="3 5" />
    </Cadre>
  ),
  talbiya: () => (
    <Cadre>
      <path d="M14 20h52a8 8 0 0 1 8 8v24a8 8 0 0 1-8 8H34l-14 12v-12h-6a8 8 0 0 1-8-8V28a8 8 0 0 1 8-8z" fill={DOUX} />
      <text x="40" y="46" textAnchor="middle" fontSize="15" fill="currentColor" stroke="none" fontWeight="700" fontFamily="serif">لبيك</text>
      <path d="M80 30c4 4 4 12 0 16M86 24c7 7 7 21 0 28" stroke={A} />
    </Cadre>
  ),
  interdits: () => (
    <Cadre>
      <rect x="22" y="36" width="20" height="34" rx="4" fill={DOUX} />
      <path d="M28 36v-8h8v8M26 24h12" />
      <circle cx="62" cy="62" r="6" />
      <circle cx="74" cy="62" r="6" />
      <path d="M65 57L78 30M71 57L58 30" />
      <circle cx="48" cy="48" r="40" stroke={A} strokeWidth="4" />
      <path d="M20 20l56 56" stroke={A} strokeWidth="4" />
    </Cadre>
  ),
  mosquee: () => (
    <Cadre>
      <path d="M8 84h80" />
      <path d="M28 84V52h40v32" fill={DOUX} />
      <path d="M30 52c0-14 18-16 18-28 0 12 18 14 18 28z" fill={A} stroke="none" />
      <path d="M14 84V34M82 84V34" strokeWidth="4" />
      <path d="M11 34h6l-3-10zM79 34h6l-3-10z" fill={A} stroke="none" />
      <path d="M42 84V70a6 6 0 0 1 12 0v14" />
    </Cadre>
  ),
  tawaf: () => (
    <Cadre>
      <ellipse cx="48" cy="60" rx="40" ry="20" strokeDasharray="5 5" />
      <path d="M86 52l2 8-8-2" stroke={A} strokeWidth="3" />
      <path d="M20 44c-6 4-10 9-10 14" stroke={A} strokeWidth="3" />
      <Kaaba x={32} y={30} s={1} />
    </Cadre>
  ),
  maqam: () => (
    <Cadre>
      <rect x="36" y="44" width="24" height="26" rx="3" fill={DOUX} />
      <path d="M36 44c0-12 24-12 24 0" fill={A} stroke="none" />
      <path d="M48 26v6" stroke={A} />
      <path d="M40 52v14M48 52v14M56 52v14" strokeWidth="1.5" />
      <path d="M30 70h36v6H30z" />
      <rect x="38" y="80" width="20" height="10" rx="2" fill={A} stroke="none" />
    </Cadre>
  ),
  zamzam: () => (
    <Cadre>
      <path d="M28 40h40l-5 44H33z" fill={DOUX} />
      <path d="M30 56h36" stroke={A} />
      <path d="M48 8c-1 7-9 12-9 19a9 9 0 0 0 18 0c0-7-8-12-9-19z" fill={A} stroke="none" />
    </Cadre>
  ),
  say: () => (
    <Cadre>
      <path d="M2 80c6-22 14-26 22-26s12 10 16 26z" fill={DOUX} />
      <path d="M56 80c4-16 8-26 16-26s16 4 22 26z" fill={DOUX} />
      <text x="20" y="48" textAnchor="middle" fontSize="10" fill="currentColor" stroke="none" fontWeight="700">Ṣafâ</text>
      <text x="74" y="48" textAnchor="middle" fontSize="10" fill="currentColor" stroke="none" fontWeight="700">Marwa</text>
      <path d="M26 30h40" stroke={A} strokeWidth="3" />
      <path d="M60 24l6 6-6 6" stroke={A} strokeWidth="3" />
      <path d="M66 20H30" strokeDasharray="3 4" />
      <path d="M34 15l-5 5 5 5" />
      <path d="M40 84V70M56 84V70" stroke="#3aa76d" strokeWidth="4" />
    </Cadre>
  ),
  ciseaux: () => (
    <Cadre>
      <circle cx="28" cy="70" r="10" />
      <circle cx="56" cy="74" r="10" />
      <path d="M34 62L76 14M50 66L30 20" strokeWidth="3" />
      <path d="M70 60c6-2 10 2 14-2M74 70c5 0 8 4 12 2M66 50c4-4 10-2 12-6" stroke={A} strokeWidth="3" />
    </Cadre>
  ),
  fin: () => (
    <Cadre>
      <circle cx="48" cy="48" r="32" fill={A} stroke="none" />
      <path d="M34 48l10 10 20-22" stroke="var(--sur-accent)" strokeWidth="6" />
      <Scintille x={14} y={18} r={5} />
      <Scintille x={84} y={22} r={4} />
      <Scintille x={82} y={80} r={5} />
      <Scintille x={12} y={76} r={3} />
    </Cadre>
  ),
};

export default function Illustration({ nom }: { nom: string }) {
  const Dessin = ILLUSTRATIONS[nom] ?? ILLUSTRATIONS.fin;
  return <Dessin />;
}

export { Kaaba };
