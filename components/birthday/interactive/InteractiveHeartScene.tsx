"use client";

import { useState } from "react";
import { ArrowRight, Hand } from "lucide-react";
import { motion } from "framer-motion";

interface InteractiveHeartSceneProps {
  name: string;
  onComplete: () => void;
}

export function InteractiveHeartScene({ name, onComplete }: InteractiveHeartSceneProps) {
  const [knocks, setKnocks] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  function knock() {
    if (isOpen) return;
    setKnocks((current) => {
      const next = Math.min(current + 1, 3);
      if (next === 3) setIsOpen(true);
      return next;
    });
  }

  return (
    <section
      className="soft-panel relative min-h-[640px] overflow-hidden rounded-[2rem] p-5 text-center sm:p-10"
      onClick={knock}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          knock();
        }
      }}
      role={isOpen ? undefined : "button"}
      tabIndex={isOpen ? -1 : 0}
      aria-label={isOpen ? undefined : "Knock on the gate"}
    >
      <div className="relative mx-auto flex min-h-[580px] w-full max-w-4xl flex-col items-center justify-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-pink-100/70">A little something for you</p>
        <h1 className="mt-4 font-serif text-4xl text-white sm:text-6xl">The birthday gate</h1>
        <p className="mt-3 max-w-lg text-sm leading-7 text-[#d9c9d8]">
          {isOpen ? "A new chapter is waiting on the other side." : "Knock three times to open the way."}
        </p>

        <div className="relative mt-8 flex h-[23rem] w-full max-w-3xl items-end justify-center overflow-hidden rounded-[2rem] bg-black/20 pb-0 shadow-inner shadow-pink-100/5">
          <div className="absolute bottom-0 h-[21rem] w-[min(78vw,25rem)] rounded-t-[10rem] border-8 border-amber-100/30 bg-[#211525] shadow-[0_0_55px_rgba(244,114,154,0.22)]">
            <div className="absolute inset-3 overflow-hidden rounded-t-[8.5rem] border border-amber-100/20">
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:2.8rem_2.8rem]" />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-pink-950/70 to-transparent" />
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isOpen ? 1 : 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center"
            >
              <p className="font-serif text-3xl text-white drop-shadow-[0_2px_10px_rgba(244,114,154,0.8)] sm:text-4xl">Welcome, {name}</p>
              <button type="button" onClick={(event) => { event.stopPropagation(); onComplete(); }} className="mt-4 inline-flex items-center gap-2 rounded-full border border-pink-200/30 bg-pink-200/10 px-4 py-2 text-sm font-semibold text-pink-50 transition hover:bg-pink-200/20">
                Continue
                <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
            <motion.div animate={{ x: isOpen ? "-96%" : 0 }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }} className="absolute inset-y-0 left-0 w-1/2 origin-left border-r border-amber-100/20 bg-gradient-to-br from-rose-950 via-[#502642] to-[#241526] shadow-[inset_-12px_0_25px_rgba(0,0,0,0.3)]" />
            <motion.div animate={{ x: isOpen ? "96%" : 0 }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }} className="absolute inset-y-0 right-0 w-1/2 origin-right border-l border-amber-100/20 bg-gradient-to-bl from-rose-950 via-[#502642] to-[#241526] shadow-[inset_12px_0_25px_rgba(0,0,0,0.3)]" />
            <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-amber-100/80 transition-opacity duration-500" style={{ opacity: isOpen ? 0 : 1 }}>
              <Hand className="mx-auto h-8 w-8" />
              <span className="mt-2 block text-[0.65rem] font-semibold uppercase tracking-[0.28em]">Knock</span>
            </div>
          </div>
          <div className="absolute bottom-4 flex gap-3" aria-label={`${knocks} of 3 knocks`}>
            {[1, 2, 3].map((knockNumber) => (
              <span key={knockNumber} className={`h-2.5 w-2.5 rounded-full border border-pink-100/60 transition-all ${knocks >= knockNumber ? "bg-pink-200 shadow-[0_0_12px_rgba(255,190,210,0.9)]" : "bg-transparent"}`} />
            ))}
          </div>
        </div>

        {!isOpen ? (
          <p className="mt-5 text-xs uppercase tracking-[0.28em] text-pink-100/60">Knocks: {knocks} / 3</p>
        ) : null}
      </div>
    </section>
  );
}
