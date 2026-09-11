import type { ReactNode } from "react";

interface FieldLabelProps {
  htmlFor?: string;
  children: ReactNode;
  hint?: string;
}

export function FieldLabel({ htmlFor, children, hint }: FieldLabelProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="text-sm font-semibold text-white">
        {children}
      </label>
      {hint ? <p className="text-xs leading-5 text-[#c9b8c7]">{hint}</p> : null}
    </div>
  );
}
