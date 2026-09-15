import Image from "next/image";
import { useState } from "react";
import { Gift, Heart, RotateCcw, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/Button";
import { GiftSurprise } from "@/components/birthday/preview/GiftSurprise";

interface FinalBirthdayProps {
  name: string;
  yourName: string;
  age: string;
  onRestart: () => void;
  isShared?: boolean;
}

export function FinalBirthday({ name, yourName, age, onRestart, isShared = false }: FinalBirthdayProps) {
  const [showGift, setShowGift] = useState(false);
  return (
    <section className="soft-panel relative h-full min-h-0 overflow-hidden rounded-[1.5rem] p-3 text-center sm:rounded-[2rem] sm:p-5">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(244,114,154,0.22),transparent_24rem)]" />
      <div className="relative mx-auto flex h-full min-h-0 max-w-2xl flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0, rotate: -12 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 150, damping: 12 }}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-pink-200/30 bg-pink-300/12 text-pink-100 shadow-[0_0_34px_rgba(244,114,154,0.22)] sm:h-14 sm:w-14"
        >
          <Heart className="h-6 w-6 fill-pink-200/20 sm:h-7 sm:w-7" />
        </motion.div>
        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.28em] text-pink-100/70 sm:tracking-[0.35em]">The final surprise</p>
        <h1 className="mt-1 font-serif text-4xl leading-none text-white sm:mt-2 sm:text-6xl">Happy Birthday</h1>
        <h2 className="mt-2 text-2xl font-semibold text-pink-100 sm:text-4xl">{name}!</h2>
        <p className="mt-2 max-w-md text-xs leading-5 text-[#d9c9d8] sm:text-sm sm:leading-6">
          Here&apos;s to {age} years of being completely wonderful. May this next chapter be full of soft mornings, brave dreams, and beautiful surprises.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.7 }}
          className="relative mt-2 h-[clamp(8rem,24dvh,15rem)] w-[clamp(8rem,24dvh,15rem)] sm:mt-4"
        >
          <Image
            src="/cute-cat-flower.png"
            alt="Cute kitten holding a pink flower"
            fill
            priority
            sizes="(max-width: 640px) 256px, 288px"
            className="object-contain drop-shadow-[0_20px_30px_rgba(244,114,154,0.28)]"
          />
        </motion.div>

        <div className="mt-2 flex items-center gap-2 text-xs text-pink-100/80 sm:text-sm">
          <Sparkles className="h-4 w-4" />
          Made with love by {yourName}
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <Button type="button" onClick={() => setShowGift(true)} className="min-h-10 px-4 text-xs sm:min-h-11 sm:text-sm">
            <Gift className="h-4 w-4" />
            One more surprise
          </Button>
          <Button type="button" variant="secondary" onClick={onRestart} className="min-h-10 px-4 text-xs sm:min-h-11 sm:text-sm">
            <RotateCcw className="h-4 w-4" />
            {isShared ? "Play again" : "Make another surprise"}
          </Button>
        </div>
      </div>
      {showGift ? <GiftSurprise onClose={() => setShowGift(false)} /> : null}
    </section>
  );
}
