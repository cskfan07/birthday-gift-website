import { motion } from "framer-motion";

interface BowProps {
  pull: number;
  width: number;
  height: number;
}

export function Bow({ pull, width, height }: BowProps) {
  const centerX = width * 0.27;
  const centerY = height * 0.58;
  const bowHeight = Math.min(210, height * 0.42);
  const gripX = centerX + pull;
  const topY = centerY - bowHeight / 2;
  const bottomY = centerY + bowHeight / 2;
  const limbBend = 26 + pull * 0.12;

  return (
    <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <defs>
        <linearGradient id="bow-wood" x1="0" x2="1">
          <stop offset="0" stopColor="#6b2e35" />
          <stop offset="0.5" stopColor="#f4b37d" />
          <stop offset="1" stopColor="#7c3544" />
        </linearGradient>
      </defs>
      <path d={`M ${centerX} ${centerY} Q ${centerX - limbBend} ${topY + bowHeight * 0.18} ${centerX - 2} ${topY}`} fill="none" stroke="url(#bow-wood)" strokeLinecap="round" strokeWidth="12" />
      <path d={`M ${centerX} ${centerY} Q ${centerX - limbBend} ${bottomY - bowHeight * 0.18} ${centerX - 2} ${bottomY}`} fill="none" stroke="url(#bow-wood)" strokeLinecap="round" strokeWidth="12" />
      <path d={`M ${centerX - 2} ${topY} L ${gripX} ${centerY} L ${centerX - 2} ${bottomY}`} fill="none" stroke="rgba(255,240,245,0.86)" strokeLinecap="round" strokeWidth="2" />
      <circle cx={gripX} cy={centerY} r={8 + pull * 0.025} fill="#ffd9b5" opacity="0.95" />
      <motion.circle cx={gripX} cy={centerY} r={18 + pull * 0.04} fill="none" stroke="#ffb5c9" strokeOpacity={pull > 4 ? 0.8 : 0.22} strokeWidth="2" animate={{ opacity: pull > 4 ? [0.45, 1, 0.45] : 0.2 }} transition={{ duration: 0.8, repeat: Infinity }} />
    </svg>
  );
}
