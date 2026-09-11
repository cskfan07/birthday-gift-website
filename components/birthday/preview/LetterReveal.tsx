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
    <section className="soft-panel min-h-[640px] rounded-[2rem] p-5 sm:p-10">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-pink-100/65">The letter</p>
        <h1 className="mt-4 font-serif text-4xl text-white sm:text-5xl">One last thing to read.</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#c9b8c7]">
          There is a letter waiting inside. Tap the envelope to open it.
        </p>

        <div className={`relative mx-auto mt-12 min-h-[290px] max-w-lg ${isOpen ? "pb-4" : ""}`}>
          {isOpen ? (
            <motion.div
              initial={{ opacity: 0, y: 80, scale: 0.86 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="letter-paper relative z-20 rounded-[1.5rem] border border-amber-100/50 bg-[#fff1df] p-6 text-left text-slate-900 shadow-[0_25px_70px_rgba(0,0,0,0.28)] sm:p-8"
            >
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-rose-700/70">
                <MailOpen className="h-4 w-4" />
                Opened with love
              </div>
              <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-slate-700">{letter}</p>
              <p className="mt-6 text-sm font-semibold text-rose-700">With love, {yourName}</p>
            </motion.div>
          ) : null}

          <motion.button
            type="button"
            onClick={() => setIsOpen(true)}
            animate={{ y: isOpen ? 165 : 0, opacity: isOpen ? 0.45 : 1 }}
            transition={{ duration: 0.65, ease: "easeInOut" }}
            className={`envelope ${isOpen ? "envelope-open" : ""} absolute bottom-0 left-1/2 z-10 h-48 w-full max-w-md -translate-x-1/2 rounded-2xl border border-rose-200/40 bg-gradient-to-br from-rose-300 via-rose-400 to-fuchsia-800 shadow-[inset_-10px_-12px_25px_rgba(112,24,98,0.22),0_22px_60px_rgba(244,114,154,0.26)]`}
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

        <div className="relative z-30 mt-8 flex flex-col items-center gap-4">
          {!isOpen ? <p className="text-xs text-[#c9b8c7]">The envelope is sealed just for them.</p> : null}
          <Button type="button" onClick={onContinue} disabled={!isOpen}>
            Continue to the finale
          </Button>
        </div>
      </div>
    </section>
  );
}
