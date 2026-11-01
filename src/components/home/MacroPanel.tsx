"use client";

import { ArrowUpRight, Beef, Droplets, Wheat } from "lucide-react";
import Link from "next/link";
import { ProgressBar } from "@/components/ui/ProgressRing";
import type { NutritionResult } from "@/lib/types";
import { cn } from "@/lib/utils";

export function MacroPanel({
  consumed,
  nutrition,
  className,
}: {
  consumed: { calories: number; protein: number; carbs: number; fat: number };
  nutrition: NutritionResult;
  className?: string;
}) {
  const rows = [
    {
      label: "Protein",
      icon: Beef,
      value: consumed.protein,
      target: nutrition.protein,
      bar: "bg-forest",
      tint: "bg-forest-soft text-forest",
    },
    {
      label: "Carbs",
      icon: Wheat,
      value: consumed.carbs,
      target: nutrition.carbs,
      bar: "bg-[#A9D863]",
      tint: "bg-lime/40 text-[#4D6B16]",
    },
    {
      label: "Fats",
      icon: Droplets,
      value: consumed.fat,
      target: nutrition.fat,
      bar: "bg-fresh",
      tint: "bg-fresh-soft text-forest",
    },
  ];

  const caloriePercent = Math.round(
    (consumed.calories / Math.max(1, nutrition.calorieTarget)) * 100,
  );

  return (
    <section className={cn("flex flex-col rounded-[30px] border border-white/80 bg-white p-5 shadow-card", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-muted">
            Daily nutrition
          </p>
          <p className="mt-0.5 text-[0.95rem] font-bold tracking-[-0.02em] text-charcoal">
            Macro progress
          </p>
        </div>
        <span className="rounded-full bg-cream px-2.5 py-1 text-[0.58rem] font-bold text-muted">
          {caloriePercent}% kcal
        </span>
      </div>

      <div className="mt-4 space-y-4 pb-4">
        {rows.map((row) => {
          const Icon = row.icon;
          const percent = Math.round(
            (row.value / Math.max(1, row.target)) * 100,
          );
          return (
            <div key={row.label}>
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-[0.74rem] font-semibold text-charcoal">
                  <span
                    className={cn(
                      "flex size-6 items-center justify-center rounded-lg",
                      row.tint,
                    )}
                  >
                    <Icon className="size-3.5" />
                  </span>
                  {row.label}
                </span>
                <span className="text-[0.7rem] font-medium text-muted">
                  <strong className="font-bold text-charcoal">{row.value}g</strong>{" "}
                  / {row.target}g
                </span>
              </div>
              <ProgressBar
                value={Math.min(100, percent)}
                className="mt-2 h-1.5"
                barClassName={row.bar}
                delay={0.2}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 rounded-2xl bg-cream/80 px-3 py-2.5">
        <p className="text-[0.64rem] leading-snug text-muted">
          {consumed.protein >= nutrition.protein * 0.8
            ? "Protein is looking strong — keep it steady."
            : "Protein is the lever. Add a high-protein snack."}
        </p>
        <Link
          href="/menu"
          aria-label="Browse high-protein meals"
          className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white text-forest shadow-sm transition hover:bg-lime"
        >
          <ArrowUpRight className="size-3.5" />
        </Link>
      </div>
    </section>
  );
}
