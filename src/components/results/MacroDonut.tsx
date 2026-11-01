"use client";

import { useReducedMotion } from "framer-motion";
import { Cell, Pie, PieChart } from "recharts";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

const COLORS = {
  protein: "#174D36",
  carbs: "#C5ED79",
  fat: "#68B984",
} as const;

export function MacroDonut({
  protein,
  carbs,
  fat,
  calories,
}: {
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
}) {
  const reduceMotion = useReducedMotion();
  const data = [
    { name: "Protein", grams: protein, value: protein * 4, color: COLORS.protein },
    { name: "Carbs", grams: carbs, value: carbs * 4, color: COLORS.carbs },
    { name: "Fat", grams: fat, value: fat * 9, color: COLORS.fat },
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <PieChart width={216} height={216}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx={108}
            cy={108}
            innerRadius={70}
            outerRadius={99}
            paddingAngle={3}
            cornerRadius={9}
            startAngle={90}
            endAngle={-270}
            stroke="none"
            isAnimationActive={!reduceMotion}
            animationDuration={1100}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-[1.65rem] font-extrabold leading-none tracking-[-0.05em] text-charcoal">
            <AnimatedNumber value={calories} />
          </span>
          <span className="mt-1 text-[0.55rem] font-semibold uppercase tracking-[0.16em] text-muted">
            kcal / day
          </span>
        </div>
      </div>

      <div className="mt-4 grid w-full grid-cols-3 gap-2">
        {data.map((item) => (
          <div key={item.name} className="text-center">
            <div className="flex items-center justify-center gap-1.5">
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-muted">
                {item.name}
              </span>
            </div>
            <p className="mt-1 font-display text-[0.95rem] font-bold tracking-[-0.02em] text-charcoal">
              {item.grams}
              <span className="ml-0.5 text-[0.6rem] font-medium text-muted">g</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
