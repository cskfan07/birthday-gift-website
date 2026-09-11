import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

export function Button({ className, variant = "primary", disabled = false, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-300/80 disabled:opacity-45",
        variant === "primary" &&
          "bg-gradient-to-r from-pink-400 via-rose-400 to-fuchsia-500 text-white shadow-[0_15px_36px_rgba(244,114,154,0.28)] hover:-translate-y-0.5 hover:brightness-110",
        variant === "secondary" &&
          "border border-white/15 bg-white/8 text-white hover:border-pink-300/40 hover:bg-white/12",
        variant === "ghost" && "text-pink-100 hover:bg-white/8",
        className,
      )}
      disabled={Boolean(disabled)}
      {...props}
    />
  );
}
