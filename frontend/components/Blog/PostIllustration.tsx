// Built-in illustration for blog posts that don't have a cover_image.
// The theme is picked from keywords in the post title (then the content).

type Theme = "savings" | "growth" | "protection" | "tips";

const THEMES: { theme: Theme; words: RegExp }[] = [
  { theme: "savings", words: /sav(e|ing)|cushion|emergency|fund|budget|k\d+/i },
  { theme: "growth", words: /hustle|income|business|grow|invest|profit|stall/i },
  { theme: "protection", words: /loan|debt|repay|borrow|credit|scam|protect/i },
];

export function pickTheme(title: string, content = ""): Theme {
  for (const text of [title, content]) {
    const match = THEMES.find((t) => t.words.test(text));
    if (match) return match.theme;
  }
  return "tips";
}

const ORANGE = "#F97316";
const GOLD = "#FBBF24";

function Coin({ x, y, r = 12 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={GOLD} stroke={ORANGE} strokeWidth={2} />
      <text x={x} y={y + r * 0.38} textAnchor="middle" fontSize={r} fontWeight={800} fill="#B45309">K</text>
    </g>
  );
}

function Savings() {
  return (
    <>
      {/* falling coins */}
      <Coin x={120} y={20} r={13} />
      <Coin x={150} y={6} r={9} />
      {/* jar */}
      <rect x={70} y={44} width={100} height={14} rx={6} fill={ORANGE} />
      <rect x={106} y={49} width={28} height={4} rx={2} fill="#0B1F4D" />
      <rect x={62} y={58} width={116} height={112} rx={24} fill="white" fillOpacity={0.12} stroke="white" strokeOpacity={0.5} strokeWidth={3} />
      {/* coins inside */}
      {[150, 140, 130, 120].map((y, i) => (
        <ellipse key={y} cx={i % 2 ? 128 : 112} cy={y} rx={30} ry={8} fill={GOLD} stroke={ORANGE} strokeWidth={2} />
      ))}
      <path d="M76 80 q0 -10 10 -12" stroke="white" strokeOpacity={0.6} strokeWidth={4} fill="none" strokeLinecap="round" />
    </>
  );
}

function Growth() {
  const bars = [
    { x: 40, h: 40 },
    { x: 80, h: 70 },
    { x: 120, h: 100 },
    { x: 160, h: 130 },
  ];
  return (
    <>
      <line x1={28} y1={170} x2={212} y2={170} stroke="white" strokeOpacity={0.5} strokeWidth={3} strokeLinecap="round" />
      {bars.map((b, i) => (
        <rect key={b.x} x={b.x} y={170 - b.h} width={28} height={b.h} rx={6} fill={i === bars.length - 1 ? ORANGE : "white"} fillOpacity={i === bars.length - 1 ? 1 : 0.25} />
      ))}
      <polyline points="34,128 82,98 118,108 188,34" fill="none" stroke={GOLD} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
      <polygon points="196,24 172,30 190,48" fill={GOLD} />
      <Coin x={54} y={110} r={11} />
    </>
  );
}

function Protection() {
  return (
    <>
      <path d="M120 16 L178 38 V88 C178 128 152 156 120 170 C88 156 62 128 62 88 V38 Z" fill="white" fillOpacity={0.12} stroke="white" strokeOpacity={0.5} strokeWidth={3} />
      <path d="M120 34 L162 50 V88 C162 118 144 140 120 152 C96 140 78 118 78 88 V50 Z" fill={ORANGE} />
      <polyline points="100,92 115,107 142,78" fill="none" stroke="white" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
      <Coin x={196} y={140} r={13} />
      <Coin x={40} y={60} r={10} />
    </>
  );
}

function Tips() {
  return (
    <>
      <circle cx={120} cy={78} r={46} fill={GOLD} fillOpacity={0.9} />
      <circle cx={120} cy={78} r={62} fill="none" stroke={GOLD} strokeOpacity={0.35} strokeWidth={3} />
      <rect x={102} y={124} width={36} height={14} rx={4} fill="white" fillOpacity={0.7} />
      <rect x={106} y={142} width={28} height={10} rx={4} fill="white" fillOpacity={0.5} />
      <path d="M108 86 l12 -18 l12 18" fill="none" stroke="#B45309" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
      <line x1={120} y1={70} x2={120} y2={110} stroke="#B45309" strokeWidth={5} strokeLinecap="round" />
      <Coin x={196} y={40} r={11} />
    </>
  );
}

export default function PostIllustration({ theme, className = "" }: { theme: Theme; className?: string }) {
  return (
    <svg viewBox="0 0 240 180" overflow="visible" className={className} role="img" aria-label={`${theme} illustration`}>
      <circle cx={30} cy={30} r={50} fill="white" fillOpacity={0.04} />
      <circle cx={220} cy={160} r={60} fill="white" fillOpacity={0.05} />
      {theme === "savings" && <Savings />}
      {theme === "growth" && <Growth />}
      {theme === "protection" && <Protection />}
      {theme === "tips" && <Tips />}
    </svg>
  );
}
