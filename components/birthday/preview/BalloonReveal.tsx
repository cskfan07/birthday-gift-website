"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/Button";

interface BalloonRevealProps {
  reasons: string[];
  popped: boolean[];
  onPop: (index: number) => void;
  onContinue: () => void;
}

const BURST_PARTICLES = Array.from({ length: 18 }, (_, index) => ({
  angle: (index / 18) * Math.PI * 2,
  distance: 34 + (index % 4) * 12,
  size: 5 + (index % 3) * 2,
  color: ["#fb7185", "#f472b6", "#facc15", "#ffffff", "#f9a8d4", "#f43f5e"][index % 6],
}));

export function BalloonReveal({ reasons, popped, onPop, onContinue }: BalloonRevealProps) {
  const allPopped = popped.every(Boolean);
  const [bursts, setBursts] = useState<Record<number, number>>({});

  function popWithBurst(index: number) {
    setBursts((current) => ({ ...current, [index]: (current[index] ?? 0) + 1 }));
    onPop(index);
  }

  return (
    <section className="soft-panel flex h-full min-h-0 items-center overflow-hidden rounded-[1.5rem] p-3 sm:rounded-[2rem] sm:p-5">
      <div className="mx-auto w-full max-w-4xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-pink-100/65 sm:tracking-[0.35em]">The balloon reveal</p>
        <h1 className="mt-1 font-serif text-3xl text-white sm:mt-2 sm:text-5xl">Five little reasons.</h1>
        <p className="mx-auto mt-1 max-w-xl text-xs leading-5 text-[#c9b8c7] sm:text-sm sm:leading-6">
          Tap each balloon in order. One pop, one reason, one more reminder of how loved they are.
        </p>

        <div className="mt-3 grid grid-cols-5 gap-1.5 sm:mt-5 sm:gap-4">
          {reasons.map((reason, index) => {
            const isAvailable = !popped[index];
            return (
              <div key={`${reason}-${index}`} className="flex min-h-0 flex-col items-center justify-start text-center">
                <div className="relative flex h-[clamp(7.4rem,30dvh,14.5rem)] w-full items-start justify-center">
                  <AnimatePresence>
                    {bursts[index] ? (
                      <motion.div key={`burst-${index}-${bursts[index]}`} className="pointer-events-none absolute left-1/2 top-[36%] z-20 h-1 w-1">
                        {BURST_PARTICLES.map((particle, particleIndex) => (
                          <motion.span
                            key={particleIndex}
                            initial={{ x: 0, y: 0, scale: 0.4, opacity: 1, rotate: 0 }}
                            animate={{
                              x: Math.cos(particle.angle) * particle.distance,
                              y: Math.sin(particle.angle) * particle.distance,
                              scale: [1, 0.8, 0],
                              opacity: [1, 0.9, 0],
                              rotate: 220,
                            }}
                            transition={{ duration: 0.72, ease: "easeOut" }}
                            className="absolute rounded-full shadow-[0_0_14px_rgba(255,255,255,0.55)]"
                            style={{
                              width: particle.size,
                              height: particle.size,
                              backgroundColor: particle.color,
                            }}
                          />
                        ))}
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                  <AnimatePresence mode="wait">
                    {!popped[index] ? (
                    <motion.button
                      key="balloon"
                      type="button"
                      onClick={() => popWithBurst(index)}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1, y: [0, -8, 0] }}
                      exit={{ scale: 1.65, opacity: 0, rotate: 20, filter: "blur(2px)" }}
                      transition={{
                        duration: 0.55,
                        y: { duration: 3.2 + index * 0.35, repeat: Infinity, ease: "easeInOut", delay: index * 0.15 },
                      }}
                      className={`balloon relative flex h-[clamp(7rem,28dvh,14rem)] w-14 items-start justify-center border-0 p-0 text-white outline-none transition hover:scale-105 sm:w-32 ${isAvailable ? "" : "opacity-60"}`}
                    >
                      <span className="balloon-art" aria-hidden="true">
                        <span className="balloon-body">
                          <span className="balloon-highlight" />
                        </span>
                        <span className="balloon-knot" />
                        <svg className="balloon-string" viewBox="0 0 28 100" aria-hidden="true">
                          <path d="M14 0 C2 16 26 30 14 49 C2 68 26 82 14 100" />
                        </svg>
                      </span>
                    </motion.button>
                    ) : (
                      <motion.div
                        key="popped"
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="mt-7 flex h-16 w-16 items-center justify-center rounded-full border border-pink-200/25 bg-pink-300/10 text-xs font-semibold text-pink-100 shadow-[0_0_30px_rgba(244,114,154,0.22)]"
                      >
                        Pop!
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <span className="mt-1 text-[10px] text-[#c9b8c7] sm:mt-2 sm:text-xs">{popped[index] ? "Revealed" : "Tap to pop"}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-3 overflow-hidden rounded-2xl border border-pink-200/15 bg-white/5 py-2">
          <motion.div
            className="flex w-max gap-3 px-3"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 18, ease: "linear", repeat: Infinity }}
          >
            {[...reasons, ...reasons].map((reason, index) => {
              const reasonIndex = index % reasons.length;
              const isVisible = popped[reasonIndex];
              return (
                <div
                  key={`${reasonIndex}-${index}`}
                  className={`flex h-16 w-48 shrink-0 items-center justify-center rounded-2xl border px-3 text-center text-[11px] leading-4 transition sm:h-20 sm:w-60 sm:text-xs sm:leading-5 ${
                    isVisible ? "border-pink-200/30 bg-pink-300/12 text-pink-50" : "border-white/10 bg-white/5 text-white/35"
                  }`}
                >
                  {isVisible ? reason : "Pop the balloon to reveal"}
                </div>
              );
            })}
          </motion.div>
        </div>

        <div className="mt-3 flex flex-col items-center gap-2 sm:mt-4 sm:gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-pink-100">
            <Sparkles className="h-3.5 w-3.5" />
            {popped.filter(Boolean).length} of 5 balloons popped
          </div>
          <Button type="button" onClick={onContinue} disabled={!allPopped} className="min-h-10 px-4 text-xs sm:min-h-11 sm:text-sm">
            See the memories
          </Button>
        </div>
      </div>
    </section>
  );
}
