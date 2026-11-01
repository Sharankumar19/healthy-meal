"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Clock3, Plus } from "lucide-react";
import Image from "next/image";
import { TiltCard } from "@/components/motion/Interactive";
import { DietMark } from "@/components/ui/Card";
import type { Food } from "@/lib/types";
import { cn, formatInr } from "@/lib/utils";

export function FoodCard({
  food,
  added,
  onAdd,
  onRemove,
}: {
  food: Food;
  added: boolean;
  onAdd: () => void;
  onRemove: () => void;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <TiltCard className="h-full">
      <article
        className={cn(
          "group relative flex h-full overflow-hidden rounded-[24px] border bg-white shadow-card transition-colors duration-300 sm:flex-col",
          added ? "border-fresh/60" : "border-white/80 hover:border-fresh/30",
        )}
      >
        <div className="relative h-auto w-[118px] shrink-0 overflow-hidden sm:h-auto sm:w-full sm:aspect-[4/3]">
          <Image
            src={food.image}
            alt={food.name}
            fill
            sizes="(max-width: 640px) 120px, (max-width: 1024px) 45vw, 300px"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/35 via-transparent to-transparent opacity-70" />

          <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2 py-1.5 text-[0.5rem] font-bold uppercase tracking-[0.08em] text-forest shadow-sm backdrop-blur sm:left-3 sm:top-3 sm:px-2.5">
            <DietMark diet={food.diet} />
            <span className="hidden sm:inline">
              {food.diet === "non-veg"
                ? "Non-veg"
                : food.diet === "egg"
                  ? "Egg"
                  : "Veg"}
            </span>
          </span>

          {added ? (
            <motion.span
              initial={reduceMotion ? false : { opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute right-2.5 top-2.5 flex size-7 items-center justify-center rounded-full bg-forest text-lime shadow-sm sm:right-3 sm:top-3"
            >
              <Check className="size-3.5" strokeWidth={3} />
            </motion.span>
          ) : (
            <span className="absolute right-2.5 top-2.5 flex items-center gap-1 rounded-full bg-charcoal/35 px-2 py-1 text-[0.5rem] font-semibold text-cream backdrop-blur sm:right-3 sm:top-3">
              <Clock3 className="size-2.5" />
              {food.prepTime}m
            </span>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-3.5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-[0.82rem] font-bold leading-tight tracking-[-0.02em] text-charcoal sm:text-[0.9rem]">
                {food.name}
              </h3>
              <p className="mt-1 line-clamp-2 text-[0.62rem] leading-snug text-muted">
                {food.description}
              </p>
            </div>
            <span className="flex shrink-0 items-center gap-0.5 rounded-full bg-cream px-1.5 py-0.5 text-[0.52rem] font-bold text-[#7E6A21] sm:hidden">
              ★ {food.rating.toFixed(1)}
            </span>
          </div>

          <div className="mt-2 flex items-center gap-2 sm:mt-3">
            <Macro label="P" value={food.protein} tone="bg-forest" />
            <Macro label="C" value={food.carbs} tone="bg-[#A9D863]" />
            <Macro label="F" value={food.fat} tone="bg-fresh" />
            <span className="ml-auto text-[0.52rem] font-medium text-muted/70">
              {food.calories} kcal
            </span>
          </div>

          <div className="mt-auto flex items-center justify-between gap-2 pt-3">
            <div>
              <p className="font-display text-[0.95rem] font-extrabold tracking-[-0.03em] text-charcoal">
                {formatInr(food.price)}
              </p>
              <p className="text-[0.5rem] font-medium text-muted/60">per meal</p>
            </div>
            <motion.button
              type="button"
              whileTap={reduceMotion ? undefined : { scale: 0.94 }}
              onClick={added ? onRemove : onAdd}
              aria-pressed={added}
              className={cn(
                "inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[0.64rem] font-bold transition-colors sm:h-9 sm:px-3.5",
                added
                  ? "bg-forest text-cream hover:bg-forest-deep"
                  : "bg-forest-soft text-forest hover:bg-lime",
              )}
            >
              <AnimatePresence mode="wait" initial={false}>
                {added ? (
                  <motion.span
                    key="added"
                    initial={{ rotate: -30, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1"
                  >
                    <Check className="size-3.5" strokeWidth={3} />
                    Added
                  </motion.span>
                ) : (
                  <motion.span
                    key="add"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1"
                  >
                    <Plus className="size-3.5" strokeWidth={2.6} />
                    Add
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </article>
    </TiltCard>
  );
}

function Macro({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <span className="inline-flex items-center gap-1 text-[0.56rem] font-semibold text-muted sm:text-[0.6rem]">
      <span className={cn("size-1.5 rounded-full", tone)} />
      {value}g {label}
    </span>
  );
}
