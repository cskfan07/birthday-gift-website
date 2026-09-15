"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Hand, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/Button";

interface GateOpeningProps {
  name: string;
  onContinue: () => void;
}

const KNOCKS_TO_OPEN = 3;

export function GateOpening({ name, onContinue }: GateOpeningProps) {
  const [knocks, setKnocks] = useState(0);
  const [isOpening, setIsOpening] = useState(false);
  const [knockPulse, setKnockPulse] = useState(0);

  function handleKnock() {
    if (isOpening) {
      return;
    }

    const nextKnocks = Math.min(knocks + 1, KNOCKS_TO_OPEN);
    setKnocks(nextKnocks);
    setKnockPulse((current) => current + 1);
    if (nextKnocks === KNOCKS_TO_OPEN) {
      window.setTimeout(() => setIsOpening(true), 280);
    }
  }

  return (
    <section className="soft-panel relative h-full min-h-0 overflow-hidden rounded-[1.5rem] px-3 py-2 text-center sm:rounded-[2rem] sm:p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,205,134,0.2),transparent_24rem),linear-gradient(180deg,rgba(58,31,31,0.45),transparent_60%)]" />
      <div className="relative mx-auto flex h-full min-h-0 max-w-6xl flex-col items-center justify-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-100/70">A little door before the surprise</p>
        <h1 className="mt-1 font-serif text-3xl leading-tight text-white sm:mt-2 sm:text-5xl">Knock to enter</h1>
        <p className="mt-1 max-w-lg text-xs leading-5 text-[#ead8dc] sm:text-sm sm:leading-6">
          Tap the birthday gate three times for {name}&apos;s surprise.
        </p>

        <motion.button
          type="button"
          onClick={handleKnock}
          aria-label={isOpening ? "Gate is open" : `Knock on the gate. ${knocks} of ${KNOCKS_TO_OPEN} knocks done.`}
          disabled={isOpening}
          animate={knockPulse ? { x: [0, -5, 5, -3, 3, 0] } : undefined}
          transition={{ duration: 0.34 }}
          className="relative mt-2 w-full max-w-[58rem] border-0 bg-transparent p-0 text-white outline-none transition hover:scale-[1.01] focus-visible:ring-4 focus-visible:ring-pink-200/45 disabled:hover:scale-100 sm:mt-3"
        >
          <Image
            src={isOpening ? "/birthday-gate-open.png" : "/birthday-gate-closed.png"}
            alt={isOpening ? "Open birthday gate" : "Closed birthday gate"}
            width={1374}
            height={1145}
            priority
            className="mx-auto max-h-[clamp(11rem,45dvh,28rem)] w-auto max-w-full drop-shadow-[0_28px_55px_rgba(0,0,0,0.42)]"
          />
          <div className="absolute left-1/2 top-[52%] flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/15 bg-black/35 px-4 py-2 text-xs font-semibold text-amber-50 shadow-2xl backdrop-blur-md">
            <Hand className="h-4 w-4" />
            {isOpening ? "Gate open" : `${knocks}/${KNOCKS_TO_OPEN} knocks`}
          </div>
        </motion.button>

        {isOpening ? (
          <Button type="button" onClick={onContinue} className="mt-2 min-h-10 px-4 text-xs sm:mt-3 sm:min-h-11 sm:text-sm">
            Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <div className="mt-2 flex items-center gap-2 text-xs text-pink-100/75 sm:mt-3">
            <Sparkles className="h-4 w-4" />
            Third knock ke baad open gate dikhega
          </div>
        )}
      </div>
    </section>
  );
}
