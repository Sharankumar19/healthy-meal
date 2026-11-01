"use client";

import { ArrowRight, Check, Flame, Sparkles, Utensils } from "lucide-react";
import Link from "next/link";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Pill } from "@/components/ui/Card";
import { ProgressBar, ProgressRing } from "@/components/ui/ProgressRing";
import { formatInr } from "@/lib/utils";

export function DayOverview({
  dayLabel,
  dateLabel,
  plannedCalories,
  targetCalories,
  totals,
  targets,
  price,
  mealCount,
  eaten,
  isToday,
}: {
  dayLabel: string;
  dateLabel: string;
  plannedCalories: number;
  targetCalories: number;
  totals: { protein: number; carbs: number; fat: number };
  targets: { protein: number; carbs: number; fat: number };
  price: number;
  mealCount: number;
  eaten: number;
  isToday: boolean;
}) {
  const coverage = Math.min(
    100,
    Math.round((plannedCalories / Math.max(1, targetCalories)) * 100),
  );
  const gap = targetCalories - plannedCalories;

  const macros = [
    {
      label: "Protein",
      value: totals.protein,
      target: targets.protein,
      bar: "bg-lime",
    },
    {
      label: "Carbs",
      value: totals.carbs,
      target: targets.carbs,
      bar: "bg-fresh",
    },
    {
      label: "Fats",
      value: totals.fat,
      target: targets.fat,
      bar: "bg-[#E2C87E]",
    },
  ];

  return (
    <section className="relative overflow-hidden rounded-[30px] border border-white/80 bg-white p-5 shadow-card sm:p-6">
      <div className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-lime/20 blur-[60px]" />

      <div className="relative flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-fresh">
            {isToday ? "Today" : dayLabel} · {dateLabel}
          </p>
          <h2 className="mt-1 font-display text-[1.15rem] font-bold tracking-[-0.03em] text-charcoal">
            Day at a glance
          </h2>
        </div>
        {isToday ? (
          <Pill tone="lime" icon={Check}>
            {eaten}/{mealCount} eaten
          </Pill>
        ) : (
          <Pill tone="fresh" icon={Utensils}>
            {mealCount} meals planned
          </Pill>
        )}
      </div>

      <div className="relative mt-4 flex flex-col items-center gap-5 min-[420px]:flex-row sm:gap-6">
        <ProgressRing
          value={coverage}
          size={138}
          stroke={10}
          from="#68B984"
          to="#C5ED79"
          delay={0.2}
          className="shrink-0"
        >
          <span className="font-display text-[1.7rem] font-extrabold leading-none tracking-[-0.05em] text-charcoal">
            <AnimatedNumber value={plannedCalories} />
          </span>
          <span className="mt-1 text-[0.5rem] font-semibold uppercase tracking-[0.13em] text-muted">
            kcal planned
          </span>
          <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-fresh-soft px-2 py-0.5 text-[0.54rem] font-bold text-forest">
            <Flame className="size-2.5" />
            {coverage}% of target
          </span>
        </ProgressRing>

        <div className="w-full flex-1">
          <div className="space-y-2.5">
            {macros.map((macro) => (
              <div key={macro.label}>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-muted">
                    {macro.label}
                  </span>
                  <span className="text-[0.64rem] font-semibold text-charcoal">
                    {Math.round(macro.value)}g
                    <span className="ml-1 font-normal text-muted/70">
                      / {macro.target}g
                    </span>
                  </span>
                </div>
                <ProgressBar
                  value={(macro.value / Math.max(1, macro.target)) * 100}
                  className="mt-1.5 h-1.5"
                  barClassName={macro.bar}
                  delay={0.35}
                />
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between gap-2 border-t border-line/70 pt-2.5">
            <span className="inline-flex items-center gap-1.5 text-[0.6rem] font-medium text-muted">
              <Sparkles className="size-3 text-fresh" />
              {mealCount} meals · {formatInr(price)}
            </span>
            <span className="text-[0.58rem] font-semibold text-forest">
              Target {targetCalories.toLocaleString("en-IN")} kcal
            </span>
          </div>
        </div>
      </div>

      <div className="relative mt-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-cream/80 px-3.5 py-2.5">
        <p className="text-[0.66rem] leading-snug text-muted">
          {gap > 150 ? (
            <>
              About{" "}
              <strong className="font-semibold text-charcoal">
                {gap.toLocaleString("en-IN")} kcal
              </strong>{" "}
              below target — add a snack to close the gap.
            </>
          ) : gap < -150 ? (
            <>
              Runs{" "}
              <strong className="font-semibold text-charcoal">
                {Math.abs(gap).toLocaleString("en-IN")} kcal
              </strong>{" "}
              over target — try swapping a heavier meal.
            </>
          ) : (
            "This day sits close to your daily target."
          )}
        </p>
        <Link
          href="/menu"
          className="group inline-flex shrink-0 items-center gap-1 text-[0.66rem] font-semibold text-forest transition hover:text-fresh"
        >
          {gap > 150 ? "Find a snack" : "Browse menu"}
          <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}
