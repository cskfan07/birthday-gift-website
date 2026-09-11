import { Check, ChevronRight } from "lucide-react";

import { CAKE_OPTIONS } from "@/lib/birthday-options";
import { cn } from "@/lib/utils";
import { StepShell } from "@/components/birthday/StepShell";
import type { BirthdayFormData, CakeId } from "@/types/birthday";

interface StepCakeProps {
  selectedCake: BirthdayFormData["cake"];
  onSelect: (cake: CakeId) => void;
  onPrevious: () => void;
  onNext: () => void;
}

export function StepCake({ selectedCake, onSelect, onPrevious, onNext }: StepCakeProps) {
  return (
    <StepShell
      eyebrow="Step 2 of 5 · The centerpiece"
      title="Pick their birthday cake."
      description="Choose the cake that sets the color and mood for the birthday animation."
      onPrevious={onPrevious}
      onNext={onNext}
      nextDisabled={!selectedCake}
      nextLabel="Continue"
    >
      <div className="space-y-4">
        {CAKE_OPTIONS.map((cake, index) => {
          const selected = cake.id === selectedCake;
          return (
            <button
              key={cake.id}
              type="button"
              onClick={() => onSelect(cake.id)}
              className={cn(
                "group relative grid w-full gap-5 rounded-[1.6rem] border p-4 text-left transition duration-200 sm:grid-cols-[180px_1fr_auto] sm:items-center sm:p-5",
                selected
                  ? "border-pink-300/70 bg-white/10 shadow-[0_18px_48px_rgba(244,114,154,0.16)]"
                  : "border-white/10 bg-white/4 hover:border-pink-200/35 hover:bg-white/8",
              )}
            >
              <div className={cn("relative flex h-32 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br", cake.colors)}>
                <div className="relative h-16 w-20 rounded-t-[2rem] rounded-b-xl border-2 border-white/25 bg-white/15 shadow-[0_16px_25px_rgba(0,0,0,0.2)]">
                  <span className="absolute -top-5 left-1/2 h-8 w-1 -translate-x-1/2 rounded-full bg-white/80" />
                  <span className="absolute -top-6 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-amber-200 shadow-[0_0_18px_rgba(253,230,138,0.9)]" />
                  <span className="absolute inset-x-0 top-5 h-1 bg-white/25" />
                  <span className="absolute inset-x-0 top-10 h-1 bg-white/20" />
                </div>
                <span className="absolute bottom-3 left-4 text-xl text-white/70">{String.fromCodePoint(0x2726)}</span>
                <span className="absolute right-5 top-3 text-sm text-white/70">{String.fromCodePoint(0x2728)}</span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-[0.25em] text-pink-100/60">Cake 0{index + 1}</span>
                  {selected ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-pink-300/15 px-2 py-1 text-[11px] font-semibold text-pink-100">
                      <Check className="h-3 w-3" />
                      Selected
                    </span>
                  ) : null}
                </div>
                <h2 className="mt-2 text-xl font-semibold text-white">{cake.name}</h2>
                <p className="mt-2 text-sm leading-6 text-[#c9b8c7]">{cake.description}</p>
              </div>

              <ChevronRight className="hidden h-5 w-5 text-pink-100/60 transition group-hover:translate-x-1 sm:block" />
            </button>
          );
        })}
      </div>
    </StepShell>
  );
}
