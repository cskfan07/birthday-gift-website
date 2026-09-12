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
    <section className="soft-panel relative min-h-[640px] overflow-hidden rounded-[2rem] p-5 text-center sm:p-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(244,114,154,0.25),transparent_28rem)]" />
      <div className="relative mx-auto flex min-h-[580px] max-w-2xl flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0, rotate: -12 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 150, damping: 12 }}
          className="flex h-16 w-16 items-center justify-center rounded-full border border-pink-200/30 bg-pink-300/12 text-pink-100 shadow-[0_0_40px_rgba(244,114,154,0.25)]"
        >
          <Heart className="h-8 w-8 fill-pink-200/20" />
        </motion.div>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.35em] text-pink-100/70">The final surprise</p>
        <h1 className="mt-4 font-serif text-5xl leading-none text-white sm:text-7xl">Happy Birthday</h1>
        <h2 className="mt-4 text-3xl font-semibold text-pink-100 sm:text-4xl">{name}!</h2>
        <p className="mt-5 max-w-md text-sm leading-7 text-[#d9c9d8]">
          Here&apos;s to {age} years of being completely wonderful. May this next chapter be full of soft mornings, brave dreams, and beautiful surprises.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.7 }}
          className="relative mt-8 h-64 w-64 sm:h-72 sm:w-72"
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

        <div className="mt-3 flex items-center gap-2 text-sm text-pink-100/80">
          <Sparkles className="h-4 w-4" />
          Made with love by {yourName}
          <Sparkles className="h-4 w-4" />
        </div>
        <Button type="button" onClick={() => setShowGift(true)} className="mt-7">
          <Gift className="h-4 w-4" />
          One more surprise
        </Button>
        <Button type="button" variant="secondary" onClick={onRestart} className="mt-7">
          <RotateCcw className="h-4 w-4" />
          {isShared ? "Play again" : "Make another surprise"}
        </Button>
      </div>
      {showGift ? <GiftSurprise onClose={() => setShowGift(false)} /> : null}
    </section>
  );
}
