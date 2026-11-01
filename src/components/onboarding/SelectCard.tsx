"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Armchair,
  Check,
  Drumstick,
  Dumbbell,
  Egg,
  Footprints,
  HardHat,
  Leaf,
  Mars,
  Scale,
  Soup,
  TrendingDown,
  TrendingUp,
  Venus,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const optionIcons: Record<string, LucideIcon> = {
  male: Mars,
  female: Venus,
  chair: Armchair,
  footsteps: Footprints,
  activity: HardHat,
  "trending-down": TrendingDown,
  scale: Scale,
  dumbbell: Dumbbell,
  "trending-up": TrendingUp,
  leaf: Leaf,
  egg: Egg,
  drumstick: Drumstick,
  one: Soup,
  two: Soup,
  three: Soup,
};

export function SelectCard({
  selected,
  onClick,
  title,
  description,
  icon,
  variant = "row",
  badge,
  className,
  number,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  description?: string;
  icon?: string;
  variant?: "row" | "tile";
  badge?: string;
  className?: string;
  number?: string;
}) {
  const reduceMotion = useReducedMotion();
  const Icon = icon ? optionIcons[icon] : undefined;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={reduceMotion ? undefined : { scale: 0.985 }}
      whileHover={reduceMotion ? undefined : { y: -2 }}
      transition={{ type: "spring", stiffness: 380, damping: 26 }}
      aria-pressed={selected}
      className={cn(
        "group relative w-full overflow-hidden rounded-[20px] border text-left transition-colors duration-200",
        variant === "row" ? "flex items-center gap-3 p-3.5" : "flex flex-col gap-3 p-4",
        selected
          ? "border-forest/80 bg-forest-soft/70 shadow-[0_12px_30px_-22px_rgba(23,77,54,0.7)]"
          : "border-line/90 bg-white/80 hover:border-fresh/60 hover:bg-white",
        className,
      )}
    >
      {selected ? (
        <motion.span
          layoutId={`selected-glow-${title}`}
          className="pointer-events-none absolute inset-0 rounded-[20px] ring-1 ring-inset ring-forest/10"
        />
      ) : null}

      {Icon && !number ? (
        <span
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-[14px] transition-colors duration-200",
            selected
              ? "bg-forest text-lime"
              : "bg-cream-deep text-forest group-hover:bg-fresh-soft",
          )}
        >
          <Icon className="size-[19px]" strokeWidth={1.9} />
        </span>
      ) : null}

      {number ? (
        <span
          className={cn(
            "font-display text-[1.7rem] font-extrabold leading-none tracking-[-0.05em]",
            selected ? "text-forest" : "text-charcoal/70",
          )}
        >
          {number}
        </span>
      ) : null}

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span
            className={cn(
              "font-display text-[0.92rem] font-bold tracking-[-0.02em]",
              selected ? "text-forest" : "text-charcoal",
            )}
          >
            {title}
          </span>
          {badge ? (
            <span className="rounded-full bg-lime/70 px-2 py-0.5 text-[0.52rem] font-bold uppercase tracking-[0.08em] text-forest">
              {badge}
            </span>
          ) : null}
        </span>
        {description ? (
          <span
            className={cn(
              "mt-0.5 block text-[0.72rem] leading-snug",
              selected ? "text-forest/65" : "text-muted",
            )}
          >
            {description}
          </span>
        ) : null}
      </span>

      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-full border transition-all duration-200",
          variant === "tile" && "absolute right-4 top-4",
          selected
            ? "border-forest bg-forest text-lime"
            : "border-line bg-white text-transparent",
        )}
      >
        <Check className="size-3" strokeWidth={3.2} />
      </span>
    </motion.button>
  );
}
