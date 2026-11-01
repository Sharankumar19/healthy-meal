"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeftRight,
  CalendarDays,
  Check,
  RefreshCw,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { DietMark } from "@/components/ui/Card";
import { SLOT_LABELS, SLOT_TIMES } from "@/data/foods";
import type { Food, MealType } from "@/lib/types";
import { cn, formatInr } from "@/lib/utils";

export function MealSlotCard({
  food,
  slot,
  completed,
  extra = false,
  onToggle,
  onReplace,
  onRemove,
  canReplace = true,
  canToggle = true,
}: {
  food: Food;
  slot: MealType;
  completed: boolean;
  extra?: boolean;
  onToggle: () => void;
  onReplace?: () => void;
  onRemove?: () => void;
  canReplace?: boolean;
  canToggle?: boolean;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      layout
      className={cn(
        "group relative flex overflow-hidden rounded-[22px] border bg-white shadow-card transition-colors sm:rounded-[24px]",
        completed
          ? "border-fresh/50 bg-gradient-to-r from-fresh-soft/40 to-white"
          : "border-white/80",
      )}
    >
      <div className="relative w-[104px] shrink-0 overflow-hidden sm:w-[156px]">
        <Image
          src={food.image}
          alt={food.name}
          fill
          sizes="(max-width: 640px) 104px, 156px"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/55 via-transparent to-transparent" />
        <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[0.48rem] font-bold uppercase tracking-[0.06em] text-forest backdrop-blur sm:bottom-2.5 sm:left-2.5">
          <DietMark diet={food.diet} className="!size-3" />
          {SLOT_LABELS[slot]}
        </span>
        {completed ? (
          <motion.span
            initial={reduceMotion ? false : { scale: 0, rotate: -25 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 20 }}
            className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-forest text-lime shadow-sm"
          >
            <Check className="size-3" strokeWidth={3.2} />
          </motion.span>
        ) : null}
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <p className="text-[0.52rem] font-bold uppercase tracking-[0.12em] text-fresh">
                {SLOT_LABELS[slot]} · {SLOT_TIMES[slot]}
              </p>
              {extra ? (
                <span className="rounded-full bg-sand/80 px-1.5 py-0.5 text-[0.46rem] font-bold uppercase tracking-[0.06em] text-[#7C6B45]">
                  Added
                </span>
              ) : null}
            </div>
            <h3 className="mt-1 text-[0.9rem] font-bold leading-tight tracking-[-0.025em] text-charcoal sm:text-[0.98rem]">
              {food.name}
            </h3>
            <p className="mt-1 line-clamp-2 text-[0.63rem] leading-snug text-muted sm:text-[0.68rem]">
              {food.description}
            </p>
          </div>
          <span className="hidden shrink-0 text-right sm:block">
            <span className="block font-display text-[0.88rem] font-bold text-charcoal">
              {formatInr(food.price)}
            </span>
            <span className="text-[0.5rem] text-muted/60">per meal</span>
          </span>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.56rem] font-semibold sm:text-[0.6rem]">
          <span className="text-charcoal">{food.calories} kcal</span>
          <span className="inline-flex items-center gap-1 text-muted">
            <span className="size-1.5 rounded-full bg-forest" /> {food.protein}g P
          </span>
          <span className="inline-flex items-center gap-1 text-muted">
            <span className="size-1.5 rounded-full bg-[#A9D863]" /> {food.carbs}g C
          </span>
          <span className="inline-flex items-center gap-1 text-muted">
            <span className="size-1.5 rounded-full bg-fresh" /> {food.fat}g F
          </span>
        </div>

        <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-line/60 pt-2.5 sm:mt-3 sm:pt-3">
          <span className="text-[0.56rem] font-medium text-muted sm:hidden">
            {formatInr(food.price)}
          </span>
          <div className="ml-auto flex items-center gap-1.5">
            {onRemove ? (
              <button
                type="button"
                onClick={onRemove}
                aria-label={`Remove ${food.name}`}
                className="flex size-8 items-center justify-center rounded-full border border-line text-muted transition hover:border-tomato/30 hover:bg-[#FBEAE6] hover:text-tomato"
              >
                <Trash2 className="size-3.5" />
              </button>
            ) : null}
            {onReplace && canReplace ? (
              <motion.button
                type="button"
                onClick={onReplace}
                whileTap={reduceMotion ? undefined : { scale: 0.94 }}
                className="inline-flex h-8 items-center gap-1.5 rounded-full border border-line bg-white px-2.5 text-[0.6rem] font-semibold text-muted transition hover:border-fresh/60 hover:text-forest sm:px-3"
              >
                <RefreshCw className="hidden size-3 sm:block" />
                <span className="hidden sm:inline">Replace</span>
                <ArrowLeftRight className="size-3 sm:hidden" />
              </motion.button>
            ) : null}
            {canToggle ? (
              <motion.button
                type="button"
                onClick={onToggle}
                whileTap={reduceMotion ? undefined : { scale: 0.94 }}
                aria-pressed={completed}
                className={cn(
                  "inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[0.6rem] font-bold transition-colors",
                  completed
                    ? "bg-forest text-lime"
                    : "bg-forest-soft text-forest hover:bg-lime",
                )}
              >
                <Check className="size-3" strokeWidth={3} />
                {completed ? "Eaten" : "Mark eaten"}
              </motion.button>
            ) : (
              <span className="inline-flex h-8 items-center gap-1.5 rounded-full bg-cream px-2.5 text-[0.58rem] font-semibold text-muted">
                <CalendarDays className="size-3 text-fresh" />
                Planned
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
