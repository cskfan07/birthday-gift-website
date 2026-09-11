"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/Button";

interface BalloonRevealProps {
  reasons: string[];
  popped: boolean[];
  onPop: (index: number) => void;
  onContinue: () => void;
}

export function BalloonReveal({ reasons, popped, onPop, onContinue }: BalloonRevealProps) {
  const allPopped = popped.every(Boolean);

  return (
    <section className="soft-panel min-h-[640px] rounded-[2rem] p-5 sm:p-10">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-pink-100/65">The balloon reveal</p>
        <h1 className="mt-4 font-serif text-4xl text-white sm:text-5xl">Five little reasons.</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#c9b8c7]">
          Tap each balloon in order. One pop, one reason, one more reminder of how loved they are.
        </p>

        <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-5">
          {reasons.map((reason, index) => {
            const isAvailable = !popped[index];
            return (
              <div key={`${reason}-${index}`} className="flex min-h-[18rem] flex-col items-center justify-start text-center">
                <AnimatePresence mode="wait">
                  {popped[index] ? (
                    <motion.div
                      key="message"
                      initial={{ scale: 0.5, opacity: 0, rotate: -8 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      className="flex h-28 w-full max-w-[150px] items-center justify-center rounded-[1.5rem] border border-pink-200/30 bg-pink-300/12 p-3 text-xs leading-5 text-pink-50 shadow-[0_0_34px_rgba(244,114,154,0.18)]"
                    >
                      {reason}
                    </motion.div>
                  ) : (
                    <motion.button
                      key="balloon"
                      type="button"
                      onClick={() => onPop(index)}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1, y: [0, -8, 0] }}
                      exit={{ scale: 1.5, opacity: 0, rotate: 14 }}
                      transition={{
                        duration: 0.55,
                        y: { duration: 3.2 + index * 0.35, repeat: Infinity, ease: "easeInOut", delay: index * 0.15 },
                      }}
                      className={`balloon relative flex h-[15.5rem] w-32 items-start justify-center border-0 p-0 text-white outline-none transition hover:scale-105 ${isAvailable ? "" : "opacity-60"}`}
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
                  )}
                </AnimatePresence>
                <span className="mt-2 text-xs text-[#c9b8c7]">{popped[index] ? "Revealed" : "Tap to pop"}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-pink-100">
            <Sparkles className="h-3.5 w-3.5" />
            {popped.filter(Boolean).length} of 5 balloons popped
          </div>
          <Button type="button" onClick={onContinue} disabled={!allPopped}>
            See the memories
          </Button>
        </div>
      </div>
    </section>
  );
}
