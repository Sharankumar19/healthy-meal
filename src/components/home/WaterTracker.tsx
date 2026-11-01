"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Droplets, Plus, RotateCcw } from "lucide-react";
import { useToast } from "@/components/feedback/ToastProvider";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";

export function WaterTracker({ className }: { className?: string }) {
  const { waterMl, nutrition, addWater, setWater } = useUser();
  const { toast } = useToast();
  const reduceMotion = useReducedMotion();
  const target = nutrition?.waterMl ?? 2500;
  const percent = Math.min(100, Math.round((waterMl / target) * 100));
  const glassCount = Math.min(12, Math.max(8, Math.round(target / 250)));
  const filled = Math.min(glassCount, Math.floor(waterMl / 250));
  const goalReached = waterMl >= target;

  function handleAdd(amount: number) {
    const next = waterMl + amount;
    addWater(amount);
    if (next >= target && waterMl < target) {
      toast({
        title: "Hydration goal reached",
        description: "Nicely done. Keep sipping through the evening.",
      });
    }
  }

  return (
    <section className={cn("relative flex flex-col overflow-hidden rounded-[30px] border border-white/80 bg-gradient-to-br from-[#E9F4EC] via-[#F4F8EF] to-white p-5 shadow-card", className)}>
      <div className="pointer-events-none absolute -bottom-16 -right-10 size-44 rounded-full bg-lime/30 blur-3xl" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex size-10 items-center justify-center rounded-[14px] bg-forest text-lime">
            <Droplets className="size-[18px]" />
          </span>
          <div>
            <p className="text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-muted">
              Hydration
            </p>
            <p className="text-[0.82rem] font-bold leading-tight text-charcoal">
              Water intake
            </p>
          </div>
        </div>
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-[0.56rem] font-bold uppercase tracking-[0.08em]",
            goalReached
              ? "bg-forest text-lime"
              : "bg-white/80 text-forest/70",
          )}
        >
          {goalReached ? "Goal hit" : `${percent}%`}
        </span>
      </div>

      <div className="relative mt-4 flex items-end gap-1.5">
        <span className="font-display text-[2.4rem] font-extrabold leading-none tracking-[-0.06em] text-forest">
          <AnimatedNumber
            value={waterMl / 1000}
            decimals={2}
            duration={0.8}
          />
        </span>
        <span className="mb-1 text-[0.82rem] font-semibold text-forest/60">
          / {(target / 1000).toFixed(1)} L
        </span>
        <span className="mb-1 ml-auto text-[0.62rem] font-medium text-muted">
          {Math.round(target / 250)} glasses
        </span>
      </div>

      <div className="relative mt-3.5 grid grid-cols-6 gap-1.5">
        {Array.from({ length: glassCount }).map((_, index) => {
          const isFilled = index < filled;
          return (
            <motion.span
              key={index}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.025 }}
              className={cn(
                "flex h-8 items-end justify-center rounded-lg border pb-1.5 transition-colors duration-300",
                isFilled
                  ? "border-fresh/40 bg-fresh/15"
                  : "border-fresh/20 bg-white/60",
              )}
            >
              <motion.span
                initial={false}
                animate={{
                  height: isFilled ? "16px" : "6px",
                  opacity: isFilled ? 1 : 0.35,
                }}
                transition={{ duration: reduceMotion ? 0 : 0.4 }}
                className={cn(
                  "w-2.5 rounded-b-full rounded-t-[3px]",
                  isFilled ? "bg-forest" : "bg-fresh/50",
                )}
              />
            </motion.span>
          );
        })}
      </div>

      <div className="relative mt-auto flex items-center gap-2 pt-4">
        <button
          type="button"
          onClick={() => handleAdd(250)}
          className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full bg-forest text-[0.68rem] font-semibold text-cream transition hover:bg-forest-deep active:scale-[0.98]"
        >
          <Plus className="size-3.5" />
          250 ml
        </button>
        <button
          type="button"
          onClick={() => handleAdd(500)}
          className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full border border-forest/15 bg-white/80 text-[0.68rem] font-semibold text-forest transition hover:border-fresh hover:bg-white active:scale-[0.98]"
        >
          <Plus className="size-3.5" />
          500 ml
        </button>
        <button
          type="button"
          onClick={() => setWater(Math.max(0, waterMl - 250))}
          disabled={waterMl === 0}
          aria-label="Remove 250 ml"
          className="flex size-9 items-center justify-center rounded-full border border-forest/10 bg-white/60 text-muted transition hover:text-forest disabled:opacity-35"
        >
          <RotateCcw className="size-3.5" />
        </button>
      </div>
    </section>
  );
}
