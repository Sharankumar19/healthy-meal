"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Info } from "lucide-react";
import { BMI_COPY } from "@/lib/nutrition";
import type { BmiCategory, NutritionResult } from "@/lib/types";
import { clamp, cn } from "@/lib/utils";

const SEGMENTS: { key: BmiCategory; label: string; color: string }[] = [
  { key: "underweight", label: "Under", color: "#E6C36B" },
  { key: "healthy", label: "Healthy", color: "#68B984" },
  { key: "overweight", label: "Over", color: "#E5A94F" },
  { key: "obese", label: "High", color: "#C97A64" },
];

export function BmiScale({ nutrition }: { nutrition: NutritionResult }) {
  const reduceMotion = useReducedMotion();
  const position = clamp(((nutrition.bmi - 15) / 20) * 100, 2, 98);
  const copy = BMI_COPY[nutrition.bmiCategory];

  return (
    <div className="rounded-card border border-white/80 bg-white p-5 shadow-card sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-muted">
            Body mass index
          </p>
          <div className="mt-1.5 flex items-end gap-2">
            <span className="font-display text-[2.6rem] font-extrabold leading-none tracking-[-0.06em] text-charcoal">
              {nutrition.bmi.toFixed(1)}
            </span>
            <span
              className={cn(
                "mb-1 rounded-full px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.08em]",
                nutrition.bmiCategory === "healthy"
                  ? "bg-fresh-soft text-forest"
                  : "bg-[#FBF1DC] text-[#8A6520]",
              )}
            >
              {copy.label}
            </span>
          </div>
          <p className="mt-1.5 text-[0.72rem] text-muted">
            Healthy weight range for your height:{" "}
            <strong className="font-semibold text-charcoal">
              {nutrition.healthyWeightKg.min}–{nutrition.healthyWeightKg.max} kg
            </strong>
          </p>
        </div>
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-cream-deep text-forest">
          <Info className="size-4" />
        </div>
      </div>

      <div className="mt-7">
        <div className="relative">
          <div className="flex h-2.5 w-full gap-1 overflow-hidden rounded-full">
            {SEGMENTS.map((segment) => (
              <span
                key={segment.key}
                className="h-full flex-1 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
            ))}
          </div>
          <motion.div
            className="absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
            initial={{ left: "2%", opacity: 0 }}
            animate={{ left: `${position}%`, opacity: 1 }}
            transition={{
              duration: reduceMotion ? 0 : 1.2,
              delay: reduceMotion ? 0 : 0.25,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="relative flex size-7 items-center justify-center rounded-full border-[3px] border-white bg-forest shadow-[0_3px_10px_rgba(23,77,54,0.4)]">
              <span className="size-1.5 rounded-full bg-lime" />
            </div>
          </motion.div>
        </div>
        <div className="mt-2.5 flex justify-between text-[0.56rem] font-medium uppercase tracking-[0.08em] text-muted/80">
          <span>Under 18.5</span>
          <span>18.5 – 25</span>
          <span>25 – 30</span>
          <span>30+</span>
        </div>
      </div>

      <p className="mt-4 rounded-xl bg-cream/80 px-3 py-2.5 text-[0.7rem] leading-relaxed text-muted">
        {copy.note}{" "}
        {nutrition.isMinor
          ? "BMI ranges shown are for adults; for teens it is a screening tool only."
          : "BMI is a screening tool, not a full picture of health."}
      </p>
    </div>
  );
}
