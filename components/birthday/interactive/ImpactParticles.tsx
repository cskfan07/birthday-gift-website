import { motion } from "framer-motion";

const PARTICLES = Array.from({ length: 18 }, (_, index) => {
  const angle = (Math.PI * 2 * index) / 18;
  return { x: Math.cos(angle) * (45 + (index % 4) * 10), y: Math.sin(angle) * (45 + (index % 3) * 12), delay: (index % 5) * 0.025 };
});

export function ImpactParticles({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-30" aria-hidden="true">
      {PARTICLES.map((particle, index) => (
        <motion.span
          key={index}
          className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-pink-100 shadow-[0_0_12px_rgba(255,180,210,0.95)]"
          initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
          animate={{ x: particle.x, y: particle.y, opacity: 0, scale: 1.6 }}
          transition={{ duration: 0.8, delay: particle.delay, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}
