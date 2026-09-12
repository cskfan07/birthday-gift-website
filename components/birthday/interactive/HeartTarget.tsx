import { motion } from "framer-motion";

interface HeartTargetProps {
  x: number;
  y: number;
  broken: boolean;
}

export function HeartTarget({ x, y, broken }: HeartTargetProps) {
  return (
    <motion.div className="absolute" style={{ left: x, top: y, translate: "-50% -50%" }} animate={broken ? { scale: [1, 1.14, 0.98] } : { scale: [1, 1.025, 1] }} transition={{ duration: broken ? 0.45 : 2.8, repeat: broken ? 0 : Infinity, ease: "easeInOut" }}>
      <svg width="150" height="140" viewBox="0 0 150 140" aria-label="Heart target">
        <defs>
          <radialGradient id="target-heart" cx="35%" cy="25%">
            <stop offset="0" stopColor="#ffdbe7" />
            <stop offset="0.36" stopColor="#ff719b" />
            <stop offset="1" stopColor="#b20f52" />
          </radialGradient>
        </defs>
        <path d="M75 126 C63 114 14 84 14 43 C14 17 46 7 75 36 C104 7 136 17 136 43 C136 84 87 114 75 126Z" fill="url(#target-heart)" stroke="rgba(255,232,241,0.78)" strokeWidth="2" />
        {broken ? <path d="M74 26 L65 54 L79 65 L67 88 L82 101" fill="none" stroke="#fff1f6" strokeLinecap="round" strokeWidth="4" /> : null}
      </svg>
    </motion.div>
  );
}
