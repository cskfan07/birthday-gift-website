import type { ReactNode } from "react";

import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/Button";

interface StepShellProps {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  onPrevious?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  secondaryAction?: ReactNode;
}

export function StepShell({
  eyebrow,
  title,
  description,
  children,
  onPrevious,
  onNext,
  nextLabel = "Continue",
  nextDisabled = false,
  secondaryAction,
}: StepShellProps) {
  return (
    <section className="soft-panel rounded-[2rem] p-5 sm:p-8">
      <div className="mb-8 max-w-2xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-pink-200/75">
          {eyebrow}
        </p>
        <h1 className="font-serif text-4xl leading-tight text-white sm:text-5xl">{title}</h1>
        <p className="mt-3 text-sm leading-7 text-[#c9b8c7] sm:text-base">{description}</p>
      </div>

      {children}

      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          {onPrevious ? (
            <Button type="button" variant="ghost" onClick={onPrevious}>
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
          ) : null}
          {secondaryAction}
        </div>
        {onNext ? (
          <Button type="button" onClick={onNext} disabled={nextDisabled}>
            {nextLabel}
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : null}
      </div>
    </section>
  );
}
