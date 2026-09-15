"use client";

import { useEffect, useState } from "react";
import { DoorOpen, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface GateOpeningProps {
  name: string;
  onContinue: () => void;
}

const KNOCKS_TO_OPEN = 3;

function RoseVine({ side }: { side: "left" | "right" }) {
  const roses = [
    { top: "12%", size: "h-7 w-7" },
    { top: "28%", size: "h-5 w-5" },
    { top: "47%", size: "h-6 w-6" },
    { top: "67%", size: "h-5 w-5" },
    { top: "83%", size: "h-7 w-7" },
  ];

  return (
    <div className={`absolute top-[12%] z-20 h-[78%] w-20 ${side === "left" ? "-left-4" : "-right-4"}`} aria-hidden="true">
      <div className={`absolute inset-y-0 ${side === "left" ? "left-8" : "right-8"} w-6 rounded-full bg-gradient-to-b from-emerald-900/20 via-emerald-500/45 to-emerald-950/30 blur-[1px]`} />
      {Array.from({ length: 18 }).map((_, index) => (
        <span
          key={index}
          className="absolute h-5 w-3 rounded-[70%_30%_60%_40%] bg-gradient-to-br from-lime-200 to-emerald-700 shadow-[0_3px_8px_rgba(0,0,0,0.25)]"
          style={{
            top: `${8 + index * 5}%`,
            left: side === "left" ? `${22 + (index % 2) * 20}px` : `${34 - (index % 2) * 20}px`,
            transform: `rotate(${side === "left" ? -28 + index * 7 : 28 - index * 7}deg)`,
          }}
        />
      ))}
      {roses.map((rose, index) => (
        <span
          key={index}
          className={`gate-rose absolute ${rose.size} ${side === "left" ? "left-1" : "right-1"}`}
          style={{ top: rose.top }}
        />
      ))}
    </div>
  );
}

function Lantern({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute z-30 ${className}`} aria-hidden="true">
      <div className="mx-auto h-2 w-7 rounded-t-full bg-[#2b1711]" />
      <div className="relative h-16 w-12 rounded-t-[1.7rem] rounded-b-lg border-[3px] border-[#2b1711] bg-gradient-to-b from-amber-200 via-amber-400 to-orange-500 shadow-[0_0_34px_rgba(251,191,36,0.75)]">
        <div className="absolute inset-x-3 top-1 h-12 rounded-full bg-white/70 blur-sm" />
        <div className="absolute inset-y-1 left-1/2 w-0.5 -translate-x-1/2 bg-[#2b1711]/55" />
        <div className="absolute inset-x-1 top-6 h-0.5 bg-[#2b1711]/45" />
      </div>
      <div className="mx-auto h-2 w-8 rounded-b-full bg-[#2b1711]" />
    </div>
  );
}

export function GateOpening({ name, onContinue }: GateOpeningProps) {
  const [knocks, setKnocks] = useState(0);
  const [isOpening, setIsOpening] = useState(false);
  const [knockPulse, setKnockPulse] = useState(0);

  useEffect(() => {
    if (!isOpening) {
      return;
    }

    const timeout = window.setTimeout(onContinue, 1800);
    return () => window.clearTimeout(timeout);
  }, [isOpening, onContinue]);

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
    <section className="soft-panel relative min-h-[640px] overflow-hidden rounded-[2rem] px-3 py-6 text-center sm:p-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,205,134,0.22),transparent_24rem),linear-gradient(180deg,rgba(58,31,31,0.45),transparent_60%)]" />
      <div className="relative mx-auto flex min-h-[590px] max-w-5xl flex-col items-center justify-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-100/70">A little door before the surprise</p>
        <h1 className="mt-4 font-serif text-4xl leading-tight text-white sm:text-6xl">Knock to enter</h1>
        <p className="mt-3 max-w-lg text-sm leading-7 text-[#ead8dc]">
          Tap the birthday gate three times for {name}&apos;s surprise.
        </p>

        <motion.button
          type="button"
          onClick={handleKnock}
          aria-label={isOpening ? "Gate is opening" : `Knock on the gate. ${knocks} of ${KNOCKS_TO_OPEN} knocks done.`}
          disabled={isOpening}
          animate={knockPulse ? { x: [0, -5, 5, -3, 3, 0] } : undefined}
          transition={{ duration: 0.34 }}
          className={`gate-stage relative mt-8 h-[25rem] w-full max-w-[54rem] border-0 bg-transparent p-0 text-white outline-none transition focus-visible:ring-4 focus-visible:ring-pink-200/45 sm:h-[32rem] ${isOpening ? "gate-open" : "hover:scale-[1.01]"}`}
        >
          <div className="absolute inset-x-8 bottom-0 z-0 h-[7rem] rounded-[50%] bg-black/35 blur-2xl" />
          <div className="absolute bottom-0 left-1/2 z-10 h-[4.3rem] w-[88%] -translate-x-1/2 rounded-t-xl border border-stone-300/25 bg-gradient-to-b from-stone-200 to-stone-500 shadow-[0_-10px_25px_rgba(255,255,255,0.12)_inset]" />
          <div className="absolute bottom-7 left-1/2 z-10 h-10 w-[58%] -translate-x-1/2 rounded-sm bg-gradient-to-b from-[#c8925c] to-[#8a552e] shadow-[0_8px_18px_rgba(0,0,0,0.35)]">
            <span className="font-serif text-3xl font-semibold leading-10 text-[#35170e] sm:text-4xl">Welcome</span>
          </div>

          <div className="gate-pillar left-[2%]">
            <Lantern className="-top-16 left-1/2 -translate-x-1/2 scale-75 sm:scale-100" />
            <RoseVine side="left" />
          </div>
          <div className="gate-pillar right-[2%]">
            <Lantern className="-top-16 left-1/2 -translate-x-1/2 scale-75 sm:scale-100" />
            <RoseVine side="right" />
            <div className="absolute right-4 top-[30%] z-30 hidden rounded-md border border-amber-900/25 bg-[#d89b59] px-4 py-5 font-serif text-lg leading-8 text-[#24100b] shadow-xl sm:block">
              Good<br />Friends<br />Brighter Days<br />Happier You
            </div>
          </div>

          <div className="gate-arch absolute left-1/2 top-[6%] z-20 h-[9rem] w-[58%] -translate-x-1/2 rounded-t-full border-[18px] border-b-0 border-[#3a2018] bg-transparent shadow-[0_-8px_0_rgba(255,190,95,0.28)_inset]" />
          <div className="absolute left-1/2 top-[17%] z-10 h-[66%] w-[50%] -translate-x-1/2 overflow-hidden rounded-t-[9rem] bg-gradient-to-b from-[#ffb05f] via-[#643330] to-[#160d12] opacity-0 transition-opacity duration-700 gate-room">
            <div className="absolute left-1/2 top-12 -translate-x-1/2 font-serif text-4xl text-pink-100 drop-shadow-[0_0_14px_rgba(255,91,132,0.9)] sm:text-6xl">
              Cute Birthday
            </div>
            <div className="absolute bottom-10 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-gradient-to-b from-[#e8b78a] to-[#b16d4c] shadow-[0_0_35px_rgba(255,210,160,0.55)]">
              <span className="absolute left-2 top-1 h-8 w-8 rounded-full bg-[#d69766]" />
              <span className="absolute right-2 top-1 h-8 w-8 rounded-full bg-[#d69766]" />
              <span className="absolute left-7 top-9 h-3 w-3 rounded-full bg-black" />
              <span className="absolute right-7 top-9 h-3 w-3 rounded-full bg-black" />
              <span className="absolute bottom-7 left-1/2 h-5 w-9 -translate-x-1/2 rounded-b-full border-b-4 border-[#4a2118]" />
            </div>
            <div className="absolute bottom-28 left-[22%] h-20 w-20 rounded-lg bg-pink-200 shadow-xl" />
            <div className="absolute bottom-32 right-[21%] h-24 w-24 rounded-full bg-pink-400/85 shadow-xl" />
          </div>

          <div className="gate-door-wrap absolute left-1/2 top-[18%] z-30 flex h-[66%] w-[50%] -translate-x-1/2 overflow-visible rounded-t-[8rem]">
            <div className="gate-door gate-door-left">
              <span className="gate-scroll left-[22%] top-[16%]" />
              <span className="gate-scroll left-[18%] top-[58%]" />
              <span className="gate-heart right-7 top-[38%]" />
              <span className="gate-handle right-3 top-[56%]" />
            </div>
            <div className="gate-door gate-door-right">
              <span className="gate-scroll right-[22%] top-[16%]" />
              <span className="gate-scroll right-[18%] top-[58%]" />
              <span className="gate-heart left-7 top-[38%]" />
              <span className="gate-handle left-3 top-[56%]" />
            </div>
          </div>

          <div className="absolute left-1/2 top-[52%] z-40 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/15 bg-black/30 px-4 py-2 text-xs font-semibold text-amber-50 backdrop-blur-md">
            <DoorOpen className="h-4 w-4" />
            {isOpening ? "Opening..." : `${knocks}/${KNOCKS_TO_OPEN} knocks`}
          </div>
        </motion.button>

        <div className="mt-5 flex items-center gap-2 text-xs text-pink-100/75">
          <Sparkles className="h-4 w-4" />
          {isOpening ? "Gate open ho raha hai..." : "Third knock ke baad surprise start hoga"}
        </div>
      </div>
    </section>
  );
}
