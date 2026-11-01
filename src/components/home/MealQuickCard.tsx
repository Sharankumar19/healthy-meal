"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check, X } from "lucide-react";
import Image from "next/image";
import { DietMark } from "@/components/ui/Card";
import { SLOT_LABELS } from "@/data/foods";
import type { Food } from "@/lib/types";
import { cn } from "@/lib/utils";

export function MealQuickCard({
  food,
  completed,
  extra = false,
  onToggle,
  onRemove,
}: {
  food: Food;
  completed: boolean;
  extra?: boolean;
  onToggle: () => void;
  onRemove?: () => void;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      layout
      className={cn(
        "group relative w-[252px] shrink-0 overflow-hidden rounded-[24px] border bg-white shadow-card transition-colors sm:w-auto",
        completed ? "border-fresh/60" : "border-white/80",
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={food.image}
          alt={food.name}
          fill
          sizes="(max-width: 640px) 252px, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <div className="image-scrim absolute inset-0" />

        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[0.54rem] font-bold uppercase tracking-[0.08em] text-forest backdrop-blur">
          <DietMark diet={food.diet} />
          {SLOT_LABELS[food.mealType]}
        </span>

        <motion.button
          type="button"
          onClick={onToggle}
          whileTap={reduceMotion ? undefined : { scale: 0.88 }}
          aria-pressed={completed}
          aria-label={
            completed
              ? `Mark ${food.name} as not eaten`
              : `Mark ${food.name} as eaten`
          }
          className={cn(
            "absolute right-3 top-3 flex size-9 items-center justify-center rounded-full border shadow-sm backdrop-blur transition-colors",
            completed
              ? "border-forest bg-forest text-lime"
              : "border-white/80 bg-white/90 text-forest/50 hover:text-forest",
          )}
        >
          <Check
            className="size-4"
            strokeWidth={3}
            opacity={completed ? 1 : 0.45}
          />
        </motion.button>

        <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between gap-2">
          <p className="text-[0.6rem] font-medium text-cream/80">
            {food.calories} kcal
          </p>
          {extra ? (
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-[0.5rem] font-bold uppercase tracking-[0.08em] text-cream backdrop-blur">
              Added by you
            </span>
          ) : null}
        </div>
      </div>

      <div className="p-3.5">
        <h3 className="text-[0.88rem] font-bold leading-tight tracking-[-0.02em] text-charcoal">
          {food.name}
        </h3>
        <p className="mt-1 flex items-center gap-1.5 text-[0.64rem] text-muted">
          <span className="font-semibold text-forest">{food.protein}g protein</span>
          <span className="size-0.5 rounded-full bg-line" />
          <span>{food.carbs}g carbs</span>
          <span className="size-0.5 rounded-full bg-line" />
          <span>{food.fat}g fat</span>
        </p>

        <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-line/60 pt-2.5">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-[0.6rem] font-semibold",
              completed ? "text-forest" : "text-muted/70",
            )}
          >
            <span
              className={cn(
                "size-1.5 rounded-full",
                completed ? "bg-fresh" : "bg-line",
              )}
            />
            {completed ? "Eaten today" : "Not logged yet"}
          </span>
          {onRemove ? (
            <button
              type="button"
              onClick={onRemove}
              aria-label={`Remove ${food.name} from today`}
              className="rounded-full p-1 text-muted/60 transition hover:bg-[#FBEAE6] hover:text-tomato"
            >
              <X className="size-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onToggle}
              className="text-[0.6rem] font-semibold text-forest/70 transition hover:text-forest"
            >
              {completed ? "Undo" : "Log it"}
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}
