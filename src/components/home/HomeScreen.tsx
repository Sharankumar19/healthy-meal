"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Flame,
  Leaf,
  Plus,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { WeekCalorieChart } from "@/components/charts/WeekCalorieChart";
import { EnergyCard } from "@/components/home/EnergyCard";
import { HomeSkeleton } from "@/components/home/HomeSkeleton";
import { MacroPanel } from "@/components/home/MacroPanel";
import { MealQuickCard } from "@/components/home/MealQuickCard";
import { MotivationCard } from "@/components/home/MotivationCard";
import { QuickActions } from "@/components/home/QuickActions";
import { WaterTracker } from "@/components/home/WaterTracker";
import { Pill, SectionHeading } from "@/components/ui/Card";
import { PageTransition } from "@/components/motion/PageTransition";
import { GOAL_LABELS } from "@/data/profile-options";
import { useUser } from "@/context/UserContext";
import { useFirstLoad } from "@/hooks/useFirstLoad";
import { generateMealPlan, planMealList, planTotals } from "@/lib/meal-plan";
import { greetingForHour } from "@/lib/utils";

const SLOT_ORDER = { breakfast: 0, lunch: 1, dinner: 2, snack: 3 } as const;

export function HomeScreen() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const loading = useFirstLoad("home");
  const {
    profile,
    nutrition,
    state,
    consumed,
    consumedMeals,
    completedMealIds,
    toggleMealComplete,
    todayAllMeals,
    todayIndex,
    removeExtraMeal,
  } = useUser();

  useEffect(() => {
    if (!profile) router.replace("/onboarding");
  }, [profile, router]);

  const [nowLabel, setNowLabel] = useState<{ greeting: string; date: string } | null>(
    null,
  );

  useEffect(() => {
    const now = new Date();
    setNowLabel({
      greeting: greetingForHour(now.getHours()),
      date: new Intl.DateTimeFormat("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }).format(now),
    });
  }, []);

  const plan = state.plan ?? (profile ? generateMealPlan(profile) : null);
  const todayPlan = plan?.days[todayIndex] ?? null;

  const sortedMeals = useMemo(
    () =>
      [...todayAllMeals].sort(
        (a, b) => SLOT_ORDER[a.meal.slot] - SLOT_ORDER[b.meal.slot],
      ),
    [todayAllMeals],
  );

  if (!profile || !nutrition) return null;

  if (loading) {
    return (
      <div className="pt-2">
        <HomeSkeleton />
      </div>
    );
  }

  const firstName = profile.name.split(" ")[0];
  const greeting = nowLabel?.greeting ?? "Hello";
  const dateLabel = nowLabel?.date ?? "Today";
  const remaining = Math.max(0, nutrition.calorieTarget - consumed.calories);
  const weekPlanned = plan
    ? Math.round(
        plan.days.reduce(
          (sum, day) => sum + planTotals(planMealList(day)).calories,
          0,
        ) / 7,
      )
    : 0;
  const todayPlanCalories = todayPlan
    ? planTotals(planMealList(todayPlan)).calories
    : 0;

  return (
    <PageTransition className="space-y-5">
      <header className="pt-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line/80 bg-white/60 px-3 py-1.5 text-[0.62rem] font-semibold text-muted">
            <CalendarDays className="size-3 text-fresh" />
            {dateLabel}
          </span>
          <Pill tone="fresh" className="normal-case tracking-[0.04em]">
            {GOAL_LABELS[profile.goal]}
          </Pill>
          <span className="hidden items-center gap-1.5 rounded-full bg-white/60 px-3 py-1.5 text-[0.62rem] font-medium text-muted sm:inline-flex">
            <Flame className="size-3 text-[#D9973F]" />
            {nutrition.calorieTarget.toLocaleString("en-IN")} kcal target
          </span>
        </div>

        <div className="mt-3 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1
              className="font-display text-[1.9rem] font-extrabold leading-[1.06] tracking-[-0.05em] text-charcoal sm:text-[2.35rem]"
            >
              {greeting},{" "}
              <span className="relative inline-block text-forest">
                {firstName}
                <svg
                  viewBox="0 0 100 10"
                  className="absolute -bottom-0.5 left-0 h-2 w-full text-lime"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 8C24 3.5 58 2.5 98 5"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </span>
              !
            </h1>
            <p className="mt-2.5 max-w-[520px] text-[0.86rem] leading-relaxed text-muted">
              {sortedMeals.length > 0 ? (
                <>
                  You have{" "}
                  <strong className="font-semibold text-charcoal">
                    {sortedMeals.length} meals
                  </strong>{" "}
                  lined up and{" "}
                  <strong className="font-semibold text-charcoal">
                    {todayPlanCalories.toLocaleString("en-IN")} kcal
                  </strong>{" "}
                  planned.{" "}
                  {remaining > 0
                    ? `${remaining.toLocaleString("en-IN")} kcal left in today's budget.`
                    : "Target reached — beautifully done."}
                </>
              ) : (
                "Your personalised meals are ready to explore."
              )}
            </p>
          </div>
          <QuickActions />
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <EnergyCard
            consumed={consumed.calories}
            target={nutrition.calorieTarget}
            planned={todayPlanCalories}
            macros={consumed}
            targets={{
              protein: nutrition.protein,
              carbs: nutrition.carbs,
              fat: nutrition.fat,
            }}
            loggedMeals={consumedMeals.length}
            totalMeals={sortedMeals.length}
          />
        </div>

        <div className="lg:col-span-4 lg:h-full">
          <WaterTracker className="h-full" />
        </div>

        <section className="lg:col-span-8">
          <SectionHeading
            eyebrow="Recommended for today"
            title="Today's plate"
            action={
              <Link
                href="/plan"
                className="group inline-flex items-center gap-1.5 text-[0.72rem] font-semibold text-forest transition hover:text-fresh"
              >
                Full plan
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            }
          />

          <div className="no-scrollbar -mx-4 mt-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:-mx-1 sm:px-1">
            {sortedMeals.map(({ meal, food }) => {
              const completed = completedMealIds.includes(meal.uid);
              const extra = meal.uid.startsWith("extra-");
              return (
                <div
                  key={meal.uid}
                  className="snap-start sm:min-w-[220px]"
                >
                  <MealQuickCard
                    food={food}
                    completed={completed}
                    extra={extra}
                    onToggle={() => toggleMealComplete(meal.uid)}
                    onRemove={
                      extra ? () => removeExtraMeal(meal.uid) : undefined
                    }
                  />
                </div>
              );
            })}

            {sortedMeals.length < 4 ? (
              <Link
                href="/menu"
                className="flex min-h-[250px] w-[190px] shrink-0 snap-start flex-col items-center justify-center gap-3 rounded-[24px] border border-dashed border-forest/15 bg-white/40 px-5 text-center transition hover:border-fresh hover:bg-white/70"
              >
                <span className="flex size-11 items-center justify-center rounded-full bg-white text-forest shadow-sm">
                  <Plus className="size-4" />
                </span>
                <span>
                  <span className="block text-[0.8rem] font-bold text-charcoal">
                    Add a meal
                  </span>
                  <span className="mt-1 block text-[0.64rem] leading-snug text-muted">
                    Browse fresh, goal-friendly dishes
                  </span>
                </span>
              </Link>
            ) : null}
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-[0.62rem] text-muted/70">
            <Sparkles className="size-3 text-fresh" />
            Tap the circle on a meal once you&apos;ve eaten it to update your day.
          </p>
        </section>

        <div className="lg:col-span-4">
          <MacroPanel consumed={consumed} nutrition={nutrition} className="h-full" />
        </div>

        <section className="rounded-[30px] border border-white/80 bg-white p-5 shadow-card lg:col-span-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-muted">
                Weekly nutrition
              </p>
              <h2 className="mt-0.5 font-display text-[1.02rem] font-bold tracking-[-0.025em] text-charcoal">
                Your week at a glance
              </h2>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-cream px-2.5 py-1.5 text-[0.6rem] font-semibold text-muted">
              <Leaf className="size-3 text-fresh" />
              ~{weekPlanned.toLocaleString("en-IN")} kcal / day
            </span>
          </div>

          <div className="mt-3">
            {plan ? (
              <WeekCalorieChart plan={plan} target={nutrition.calorieTarget} />
            ) : null}
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-line/60 pt-3">
            <div className="flex items-center gap-3 text-[0.6rem] font-medium text-muted">
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-forest" /> Today
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#A9D8A9]" /> Planned
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-px w-4 border-t border-dashed border-forest/50" />{" "}
                Target
              </span>
            </div>
            <Link
              href="/plan"
              className="text-[0.66rem] font-semibold text-forest hover:text-fresh"
            >
              Open weekly plan →
            </Link>
          </div>
        </section>

        <div className="lg:col-span-4">
          <MotivationCard className="h-full" />
        </div>
      </div>

      <motion.p
        initial={reduceMotion ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="pb-2 text-center text-[0.58rem] leading-relaxed text-muted/60"
      >
        Nutrition estimates are a starting point, not medical advice. Listen to
        your body and adjust with a professional when needed.
      </motion.p>
    </PageTransition>
  );
}
