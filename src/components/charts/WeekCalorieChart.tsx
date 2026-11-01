"use client";

import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MealPlan } from "@/lib/types";
import { planDayCalories } from "@/lib/meal-plan";
import { WEEKDAYS } from "@/lib/utils";

interface ChartPoint {
  day: string;
  full: string;
  kcal: number;
  today: boolean;
}

function ChartTooltip({
  active,
  payload,
  target,
}: {
  active?: boolean;
  payload?: Array<{ payload?: ChartPoint }>;
  target: number;
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0]?.payload;
  if (!point) return null;
  return (
    <div className="rounded-xl border border-line bg-white px-3 py-2 shadow-lift">
      <p className="text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-muted">
        {point.full}
      </p>
      <p className="mt-0.5 text-[0.82rem] font-bold text-charcoal">
        {point.kcal.toLocaleString("en-IN")} kcal planned
      </p>
      <p className="text-[0.6rem] text-muted">
        Target {target.toLocaleString("en-IN")} kcal
      </p>
    </div>
  );
}

export function WeekCalorieChart({
  plan,
  target,
  height = 190,
}: {
  plan: MealPlan;
  target: number;
  height?: number;
}) {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [today, setToday] = useState(0);

  useEffect(() => {
    setMounted(true);
    const now = new Date();
    setToday((now.getDay() + 6) % 7);
  }, []);

  const data: ChartPoint[] = useMemo(
    () =>
      WEEKDAYS.map((day, index) => ({
        day: day.short,
        full: day.long,
        kcal: planDayCalories(plan.days[index]),
        today: index === today,
      })),
    [plan, today],
  );

  const maxValue =
    Math.max(target, ...data.map((point) => point.kcal)) + 260;

  if (!mounted) {
    return (
      <div className="flex h-full items-end gap-2.5 pb-7 pt-2" style={{ height }}>
        {[62, 78, 54, 88, 70, 84, 58].map((value, index) => (
          <div key={index} className="flex flex-1 items-end">
            <div
              className="skeleton w-full rounded-t-lg"
              style={{ height: `${value}%` }}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 12, right: 4, left: -18, bottom: 0 }}
          barCategoryGap="28%"
        >
          <CartesianGrid
            vertical={false}
            stroke="rgba(23,77,54,0.08)"
            strokeDasharray="3 6"
          />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: "#6C7A6D", fontWeight: 600 }}
            dy={6}
          />
          <YAxis
            domain={[0, maxValue]}
            axisLine={false}
            tickLine={false}
            width={48}
            tick={{ fontSize: 9, fill: "#98A398" }}
            tickFormatter={(value: number) => `${Math.round(value / 100) / 10}k`}
          />
          <Tooltip
            cursor={{ fill: "rgba(197,237,121,0.16)", radius: 10 }}
            content={<ChartTooltip target={target} />}
          />
          <ReferenceLine
            y={target}
            stroke="#174D36"
            strokeDasharray="4 5"
            strokeOpacity={0.45}
          />
          <Bar
            dataKey="kcal"
            radius={[7, 7, 7, 7]}
            isAnimationActive={!reduceMotion}
            animationDuration={900}
          >
            {data.map((point) => (
              <Cell
                key={point.day}
                fill={point.today ? "#174D36" : "#A9D8A9"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
