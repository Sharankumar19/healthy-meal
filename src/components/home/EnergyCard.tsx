"use client";

import { Flame } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { ProgressBar, ProgressRing } from "@/components/ui/ProgressRing";
import { cn } from "@/lib/utils";

export function EnergyCard({
  consumed,
  target,
  planned,
  macros,
  targets,
  loggedMeals,
  totalMeals,
}: {
  consumed: number;
  target: number;
  planned: number;
  macros: { protein: number; carbs: number; fat: number };
  targets: { protein: number; carbs: number; fat: number };
  loggedMeals: number;
  totalMeals: number;
}) {
  const percent = Math.round((consumed / Math.max(1, target)) * 100);
  const remaining = Math.max(0, target - consumed);
  const macroRows = [
    {
      label: "Protein",
      value: macros.protein,
      target: targets.protein,
      bar: "bg-lime",
    },
    {
      label: "Carbs",
      value: macros.carbs,
      target: targets.carbs,
      bar: "bg-fresh",
    },
    {
      label: "Fats",
      value: macros.fat,
      target: targets.fat,
      bar: "bg-[#F0E6B8]",
    },
  ];

  return (
    <section className="relative overflow-hidden rounded-[30px] bg-forest p-5 text-cream shadow-float sm:p-6">
      <div className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-lime/15 blur-[70px]" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 size-64 rounded-full bg-fresh/15 blur-[70px]" />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.05]" />

      <div className="relative flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[0.56rem] font-semibold uppercase tracking-[0.16em] text-lime">
          <Flame className="size-3" />
          Today&apos;s energy
        </span>
        <span className="rounded-full bg-white/10 px-2.5 py-1.5 text-[0.56rem] font-semibold uppercase tracking-[0.1em] text-cream/60">
          {loggedMeals}/{totalMeals} meals logged
        </span>
      </div>

      <div className="relative mt-5 flex flex-col items-center gap-5 min-[400px]:flex-row sm:gap-6">
        <ProgressRing
          value={Math.min(percent, 100)}
          size={136}
          stroke={9}
          from="#C5ED79"
          to="#F7F8F2"
          trackClassName="stroke-white/10"
          delay={0.15}
          className="shrink-0"
        >
          <span className="font-display text-[1.8rem] font-extrabold leading-none tracking-[-0.055em] text-cream">
            <AnimatedNumber value={consumed} />
          </span>
          <span className="mt-1 text-[0.5rem] font-semibold uppercase tracking-[0.14em] text-cream/45">
            kcal eaten
          </span>
          <span className="mt-1.5 rounded-full bg-lime/15 px-2 py-0.5 text-[0.52rem] font-bold text-lime">
            {percent}%
          </span>
        </ProgressRing>

        <div className="w-full flex-1 space-y-0">
          <StatRow
            label="Daily target"
            value={target}
            unit="kcal"
            hint={`~${(target / 1000).toFixed(1)}k budget`}
          />
          <div className="my-1 h-px bg-white/10" />
          <StatRow
            label="Consumed"
            value={consumed}
            unit="kcal"
            hint={`${loggedMeals} meals logged`}
          />
          <div className="my-1 h-px bg-white/10" />
          <StatRow
            label="Remaining"
            value={remaining}
            unit="kcal"
            hint={`${planned.toLocaleString("en-IN")} planned today`}
            highlight
          />
        </div>
      </div>

      <div className="relative mt-5 grid grid-cols-3 gap-4 border-t border-white/10 pt-4">
        {macroRows.map((macro) => (
          <div key={macro.label}>
            <div className="flex items-baseline justify-between gap-1">
              <span className="text-[0.56rem] font-semibold uppercase tracking-[0.1em] text-cream/40">
                {macro.label}
              </span>
              <span className="text-[0.62rem] font-semibold text-cream/70">
                {macro.value}g
              </span>
            </div>
            <ProgressBar
              value={Math.min(100, (macro.value / Math.max(1, macro.target)) * 100)}
              className="mt-1.5 h-1.5 bg-white/10"
              barClassName={macro.bar}
              delay={0.4}
            />
            <p className="mt-1 text-[0.52rem] text-cream/30">of {macro.target}g</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function StatRow({
  label,
  value,
  unit,
  hint,
  highlight,
}: {
  label: string;
  value: number;
  unit: string;
  hint: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <div>
        <p className="text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-cream/40">
          {label}
        </p>
        <p className="mt-0.5 text-[0.6rem] text-cream/35">{hint}</p>
      </div>
      <p
        className={cn(
          "font-display text-[1.1rem] font-bold tracking-[-0.03em]",
          highlight ? "text-lime" : "text-cream",
        )}
      >
        <AnimatedNumber value={value} />
        <span className="ml-1 text-[0.55rem] font-medium text-cream/35">
          {unit}
        </span>
      </p>
    </div>
  );
}
