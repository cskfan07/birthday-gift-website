import Image from "next/image";
import { Image as ImageIcon, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/Button";
import type { MemoryPhoto } from "@/types/birthday";

interface MemoryRevealProps {
  memories: MemoryPhoto[];
  onContinue: () => void;
}

export function MemoryReveal({ memories, onContinue }: MemoryRevealProps) {
  return (
    <section className="soft-panel min-h-[640px] rounded-[2rem] p-5 sm:p-10">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-pink-100/65">The memory string</p>
        <h1 className="mt-4 font-serif text-4xl text-white sm:text-5xl">Moments worth keeping.</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#c9b8c7]">
          Every photo is a little window into the people, places, and days that made this year special.
        </p>

        <div className="relative mt-12 rounded-[1.8rem] border border-pink-100/10 bg-gradient-to-b from-pink-200/8 to-transparent px-4 pb-8 pt-12 sm:px-8">
          <div className="absolute left-8 right-8 top-7 h-px bg-amber-100/25 sm:left-14 sm:right-14" />
          <div className="absolute left-7 right-7 top-5 flex justify-between sm:left-12 sm:right-12">
            {Array.from({ length: Math.max(5, memories.length) }).map((_, index) => (
              <span key={index} className="h-2.5 w-2.5 rounded-full bg-amber-200 shadow-[0_0_14px_rgba(253,230,138,0.95)]" />
            ))}
          </div>

          {memories.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {memories.map((memory, index) => (
                <div key={memory.id} className="relative overflow-hidden rounded-2xl border border-white/15 bg-black/20">
                  <div className="relative aspect-[4/5]">
                    <Image
                      src={memory.url}
                      alt={memory.fileName}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, 20vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-3 pb-3 pt-8 text-left">
                    <span className="text-xs text-white">Memory {index + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-black/10 px-6 text-center">
              <ImageIcon className="h-10 w-10 text-pink-200/65" />
              <p className="mt-4 text-sm font-semibold text-white">A little space saved for memories.</p>
              <p className="mt-1 text-xs text-[#c9b8c7]">This surprise can still be beautiful without photos.</p>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-2 text-xs text-[#c9b8c7]">
            <Sparkles className="h-3.5 w-3.5 text-pink-200" />
            Tap to continue
          </div>
          <Button type="button" onClick={onContinue}>
            Continue to the letter
          </Button>
        </div>
      </div>
    </section>
  );
}
