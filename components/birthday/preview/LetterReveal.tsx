"use client";

import { useState } from "react";
import { MailOpen, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/Button";

interface LetterRevealProps {
  letter: string;
  yourName: string;
  onContinue: () => void;
}

export function LetterReveal({ letter, yourName, onContinue }: LetterRevealProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="soft-panel flex h-full min-h-0 items-center overflow-hidden rounded-[1.5rem] p-3 sm:rounded-[2rem] sm:p-5">
      <div className="mx-auto w-full max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-pink-100/65 sm:tracking-[0.35em]">The letter</p>
        <h1 className="mt-1 font-serif text-3xl text-white sm:mt-2 sm:text-5xl">One last thing to read.</h1>
        <p className="mx-auto mt-1 max-w-xl text-xs leading-5 text-[#c9b8c7] sm:text-sm sm:leading-6">
          There is a letter waiting inside. Tap the envelope to open it.
        </p>

        <div className={`relative mx-auto mt-3 h-[clamp(12.5rem,39dvh,17rem)] max-w-lg sm:mt-5 ${isOpen ? "pb-2" : ""}`}>
          {isOpen ? (
            <motion.div
              initial={{ opacity: 0, y: 80, scale: 0.86 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="letter-paper relative z-20 max-h-[clamp(11rem,36dvh,16rem)] overflow-auto rounded-[1.5rem] border border-amber-100/50 bg-[#fff1df] p-4 text-left text-slate-900 shadow-[0_25px_70px_rgba(0,0,0,0.28)] sm:p-5"
            >
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-rose-700/70">
                <MailOpen className="h-4 w-4" />
                Opened with love
              </div>
              <p className="birthday-script mt-3 whitespace-pre-wrap text-lg leading-7 text-slate-700 sm:text-xl">{letter}</p>
              <p className="birthday-script mt-3 text-xl font-semibold text-rose-700">With love, {yourName}</p>
            </motion.div>
          ) : null}

          <motion.button
            type="button"
            onClick={() => setIsOpen(true)}
            animate={{ y: isOpen ? 86 : 0, opacity: isOpen ? 0.45 : 1 }}
            transition={{ duration: 0.65, ease: "easeInOut" }}
            className={`envelope ${isOpen ? "envelope-open" : ""} absolute bottom-0 left-1/2 z-10 h-36 w-full max-w-md -translate-x-1/2 rounded-2xl border border-rose-200/40 bg-gradient-to-br from-rose-300 via-rose-400 to-fuchsia-800 shadow-[inset_-10px_-12px_25px_rgba(112,24,98,0.22),0_22px_60px_rgba(244,114,154,0.26)] sm:h-44`}
          >
            <span className="envelope-flap absolute inset-x-0 top-0 z-30 h-32 bg-gradient-to-br from-pink-200/80 to-rose-400/90" />
            <span className="absolute left-1/2 top-1/2 z-40 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-white/20 text-white backdrop-blur-md">
              <Sparkles className="h-6 w-6" />
            </span>
            <span className="absolute bottom-5 left-0 right-0 z-20 text-xs font-semibold uppercase tracking-[0.25em] text-white/85">
              {isOpen ? "Letter opened" : "Tap to open"}
            </span>
          </motion.button>
        </div>

        <div className="relative z-30 mt-3 flex flex-col items-center gap-2 sm:mt-4 sm:gap-3">
          {!isOpen ? <p className="text-xs text-[#c9b8c7]">The envelope is sealed just for them.</p> : null}
          <Button type="button" onClick={onContinue} disabled={!isOpen} className="min-h-10 px-4 text-xs sm:min-h-11 sm:text-sm">
            Continue to the finale
          </Button>
        </div>
      </div>
    </section>
  );
}
