import Image from "next/image";
import { Image as ImageIcon, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/Button";
import type { MemoryPhoto } from "@/types/birthday";

interface MemoryRevealProps {
  memories: MemoryPhoto[];
  onContinue: () => void;
}

export function MemoryReveal({ memories, onContinue }: MemoryRevealProps) {
  const carouselMemories = memories.length > 0 ? [...memories, ...memories] : [];

  return (
    <section className="soft-panel flex h-full min-h-0 items-center overflow-hidden rounded-[1.5rem] p-3 sm:rounded-[2rem] sm:p-5">
      <div className="mx-auto w-full max-w-5xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-pink-100/65 sm:tracking-[0.35em]">The memory string</p>
        <h1 className="mt-1 font-serif text-3xl text-white sm:mt-2 sm:text-5xl">Moments worth keeping.</h1>
        <p className="mx-auto mt-1 max-w-xl text-xs leading-5 text-[#c9b8c7] sm:text-sm sm:leading-6">
          Every photo is a little window into the people, places, and days that made this year special.
        </p>

        <div className="relative mt-3 rounded-[1.5rem] border border-pink-100/10 bg-gradient-to-b from-pink-200/8 to-transparent px-3 pb-3 pt-7 sm:mt-5 sm:rounded-[1.8rem] sm:px-5 sm:pb-5 sm:pt-9">
          <div className="absolute left-8 right-8 top-7 h-px bg-amber-100/25 sm:left-14 sm:right-14" />
          <div className="absolute left-7 right-7 top-5 flex justify-between sm:left-12 sm:right-12">
            {Array.from({ length: Math.max(5, memories.length) }).map((_, index) => (
              <span key={index} className="h-2.5 w-2.5 rounded-full bg-amber-200 shadow-[0_0_14px_rgba(253,230,138,0.95)]" />
            ))}
          </div>

          {memories.length > 0 ? (
            <div className="memory-carousel overflow-hidden py-2">
              <div className="memory-carousel-track flex w-max gap-3 sm:gap-4">
                {carouselMemories.map((memory, index) => (
                  <div
                    key={`${memory.id}-${index}`}
                    className="memory-carousel-card relative h-[clamp(8rem,30dvh,18rem)] w-[clamp(7rem,18vw,11rem)] shrink-0 overflow-hidden rounded-2xl border border-white/15 bg-black/20 shadow-[0_22px_45px_rgba(0,0,0,0.24)]"
                  >
                    <Image
                      src={memory.url}
                      alt={memory.fileName}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 35vw, 180px"
                      className="object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-3 pb-3 pt-8 text-left">
                      <span className="text-xs text-white">Memory {(index % memories.length) + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex min-h-[clamp(9rem,32dvh,16rem)] flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-black/10 px-6 text-center">
              <ImageIcon className="h-10 w-10 text-pink-200/65" />
              <p className="mt-4 text-sm font-semibold text-white">A little space saved for memories.</p>
              <p className="mt-1 text-xs text-[#c9b8c7]">This surprise can still be beautiful without photos.</p>
            </div>
          )}
        </div>

        <div className="mt-3 flex flex-col items-center gap-2 sm:mt-4 sm:gap-3">
          <div className="inline-flex items-center gap-2 text-xs text-[#c9b8c7]">
            <Sparkles className="h-3.5 w-3.5 text-pink-200" />
            Tap to continue
          </div>
          <Button type="button" onClick={onContinue} className="min-h-10 px-4 text-xs sm:min-h-11 sm:text-sm">
            Continue to the letter
          </Button>
        </div>
      </div>
    </section>
  );
}
