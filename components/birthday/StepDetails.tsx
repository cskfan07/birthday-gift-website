import { Cake, CalendarDays, UserRound } from "lucide-react";

import { FieldLabel } from "@/components/ui/FieldLabel";
import { StepShell } from "@/components/birthday/StepShell";
import type { BirthdayFormData } from "@/types/birthday";

interface StepDetailsProps {
  data: BirthdayFormData;
  onChange: (changes: Partial<BirthdayFormData>) => void;
  onNext: () => void;
}

export function StepDetails({ data, onChange, onNext }: StepDetailsProps) {
  const canStart = Boolean(
    data.theirName.trim() &&
      data.yourName.trim() &&
      data.turningAge.trim() &&
      data.birthday,
  );

  return (
    <StepShell
      eyebrow="Step 1 of 5 · The beginning"
      title="Let&apos;s make their birthday unforgettable."
      description="Tell us a few simple things first. We will use them to shape the story, the wishes, and the final birthday reveal."
      onNext={onNext}
      nextLabel="Let&apos;s Begin"
      nextDisabled={!canStart}
    >
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <FieldLabel htmlFor="their-name" hint="The person this surprise is made for.">
            Their name
          </FieldLabel>
          <div className="relative">
            <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-pink-200/70" />
            <input
              id="their-name"
              value={data.theirName}
              onChange={(event) => onChange({ theirName: event.target.value })}
              placeholder="e.g. Lucky"
              className="soft-input h-12 w-full rounded-2xl pl-11 pr-4 text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <FieldLabel htmlFor="your-name" hint="The name signed on the final message.">
            Your name
          </FieldLabel>
          <div className="relative">
            <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-pink-200/70" />
            <input
              id="your-name"
              value={data.yourName}
              onChange={(event) => onChange({ yourName: event.target.value })}
              placeholder="e.g. Ankit"
              className="soft-input h-12 w-full rounded-2xl pl-11 pr-4 text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <FieldLabel htmlFor="turning-age" hint="How old will they be this birthday?">
            Turning age
          </FieldLabel>
          <div className="relative">
            <Cake className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-pink-200/70" />
            <input
              id="turning-age"
              type="number"
              min="1"
              max="120"
              value={data.turningAge}
              onChange={(event) => onChange({ turningAge: event.target.value })}
              placeholder="e.g. 21"
              className="soft-input h-12 w-full rounded-2xl pl-11 pr-4 text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <FieldLabel htmlFor="birthday" hint="We will use this in the birthday preview.">
            Their birthday
          </FieldLabel>
          <div className="relative">
            <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-pink-200/70" />
            <input
              id="birthday"
              type="date"
              value={data.birthday}
              onChange={(event) => onChange({ birthday: event.target.value })}
              className="soft-input h-12 w-full rounded-2xl pl-11 pr-4 text-sm [color-scheme:dark]"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3 rounded-2xl border border-pink-200/10 bg-pink-300/5 p-4 text-sm text-[#e5cddd]">
        <span className="text-xl">{String.fromCodePoint(0x2728)}</span>
        <p>Just the essentials for now. You can make the surprise personal in the next steps.</p>
      </div>
    </StepShell>
  );
}
