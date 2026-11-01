"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Segmented<T extends string | number>({
  options,
  value,
  onChange,
  className,
  size = "md",
  ariaLabel,
}: {
  options: { value: T; label: ReactNode }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  size?: "sm" | "md";
  ariaLabel?: string;
}) {
  const layoutId = useId();
  const reduceMotion = useReducedMotion();

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-line/80 bg-white/60 p-1 backdrop-blur-sm",
        className,
      )}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={String(option.value)}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "relative flex items-center justify-center rounded-full font-semibold transition-colors duration-200",
              size === "sm" ? "h-7 px-3 text-[0.68rem]" : "h-9 px-4 text-[0.75rem]",
              active ? "text-forest" : "text-muted hover:text-forest",
            )}
          >
            {active ? (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-full bg-white shadow-[0_2px_10px_rgba(23,77,54,0.12)]"
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 420, damping: 34 }
                }
              />
            ) : null}
            <span className="relative z-10 flex items-center gap-1.5">
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
