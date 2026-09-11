import { useState } from "react";
import { Heart, Sparkles } from "lucide-react";

import { READY_REASONS } from "@/lib/birthday-options";
import { cn } from "@/lib/utils";
import { StepShell } from "@/components/birthday/StepShell";
import type { BirthdayFormData } from "@/types/birthday";

interface StepReasonsProps {
  reasons: BirthdayFormData["reasons"];
  onChange: (reasons: string[]) => void;
  onPrevious: () => void;
  onNext: () => void;
}

export function StepReasons({ reasons, onChange, onPrevious, onNext }: StepReasonsProps) {
  const [popped, setPopped] = useState<boolean[]>([false, false, false, false, false]);
  const [presetMessage, setPresetMessage] = useState("");

  function updateReason(index: number, value: string) {
    const nextReasons = [...reasons];
    nextReasons[index] = value;
    onChange(nextReasons);
  }

  function addPreset(message: string) {
    const firstEmpty = reasons.findIndex((reason) => !reason.trim());
    const targetIndex = firstEmpty === -1 ? 4 : firstEmpty;
    updateReason(targetIndex, message);
    setPresetMessage(`Added to balloon ${targetIndex + 1}`);
  }

  function popBalloon(index: number) {
    const firstUnpopped = popped.findIndex((item) => !item);
    if (index !== firstUnpopped || !reasons[index]?.trim()) {
      return;
    }
    const nextPopped = [...popped];
    nextPopped[index] = true;
    setPopped(nextPopped);
  }

  const complete = reasons.length === 5 && reasons.every((reason) => reason.trim());

  return (
    <StepShell
      eyebrow="Step 3 of 5 · The little reasons"
      title="Fill the balloons with love."
      description="Each balloon hides one reason they are loved. They will pop them one by one to reveal your messages."
      onPrevious={onPrevious}
      onNext={onNext}
      nextDisabled={!complete}
      nextLabel="Continue"
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {reasons.map((reason, index) => (
          <label key={index} className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-100/60">
              Balloon {index + 1}
            </span>
            <input
              value={reason}
              onChange={(event) => updateReason(index, event.target.value)}
              placeholder="A reason they are loved"
              className="soft-input h-14 w-full rounded-2xl px-4 text-sm"
            />
          </label>
        ))}
      </div>

      <div className="mt-8 rounded-[1.6rem] border border-pink-200/10 bg-pink-300/5 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Sparkles className="h-4 w-4 text-pink-200" />
              Ready-made reasons
            </div>
            <p className="mt-1 text-xs leading-5 text-[#c9b8c7]">Click one to fill the next empty balloon.</p>
          </div>
          {presetMessage ? <span className="text-xs text-pink-200">{presetMessage}</span> : null}
        </div>
        <div className="mt-4 grid gap-2 md:grid-cols-2">
          {READY_REASONS.map((message) => (
            <button
              key={message}
              type="button"
              onClick={() => addPreset(message)}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-left text-xs leading-5 text-[#eadcea] transition hover:border-pink-300/35 hover:bg-pink-300/8"
            >
              {message}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 rounded-[1.6rem] border border-white/10 bg-black/10 p-5">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Balloon preview</h2>
            <p className="mt-1 text-xs text-[#c9b8c7]">Pop them in order to reveal each message.</p>
          </div>
          <span className="rounded-full bg-white/8 px-3 py-1 text-xs text-pink-100">
            {popped.filter(Boolean).length}/5 popped
          </span>
        </div>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-5">
          {reasons.map((reason, index) => (
            <button
              key={index}
              type="button"
              onClick={() => popBalloon(index)}
              disabled={popped[index] || !reason.trim() || index !== popped.findIndex((item) => !item)}
              className="group flex min-h-36 flex-col items-center justify-center gap-3 text-center disabled:cursor-default"
            >
              {popped[index] ? (
                <span className="flex h-20 w-20 items-center justify-center rounded-full border border-pink-200/30 bg-pink-300/12 px-2 text-xs leading-4 text-pink-50 shadow-[0_0_35px_rgba(244,114,154,0.18)]">
                  {reason}
                </span>
              ) : (
                <span
                  className={cn(
                    "animate-balloon relative flex h-20 w-16 items-center justify-center rounded-[50%] border border-white/30 bg-gradient-to-b from-pink-300 via-rose-400 to-fuchsia-600 text-white shadow-[0_16px_30px_rgba(244,114,154,0.25)] transition group-hover:scale-105",
                    index === popped.findIndex((item) => !item) && "ring-4 ring-pink-200/10",
                  )}
                  style={{ animationDelay: `${index * 0.18}s` }}
                >
                  <Heart className="h-6 w-6 fill-white/25" />
                  <span className="absolute -bottom-4 left-1/2 h-5 w-px -translate-x-1/2 bg-white/30" />
                </span>
              )}
              <span className="text-xs text-[#c9b8c7]">{popped[index] ? "Revealed" : "Tap to pop"}</span>
            </button>
          ))}
        </div>
      </div>
    </StepShell>
  );
}
