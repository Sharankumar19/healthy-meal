"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChefHat,
  Flame,
  Leaf,
  Repeat2,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { WeekCalorieChart } from "@/components/charts/WeekCalorieChart";
import { useToast } from "@/components/feedback/ToastProvider";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { DayOverview } from "@/components/plan/DayOverview";
import { MealSlotCard } from "@/components/plan/MealSlotCard";
import { PlanSkeleton } from "@/components/plan/PlanSkeleton";
import { SubscriptionCard } from "@/components/plan/SubscriptionCard";
import { PageTransition } from "@/components/motion/PageTransition";
import { Button } from "@/components/ui/Button";
import { Pill, SectionHeading } from "@/components/ui/Card";
import { useUser } from "@/context/UserContext";
import { DIET_LABELS, SLOT_LABELS } from "@/data/foods";
import {
  ACTIVITY_LABELS,
  GOAL_LABELS,
  MEALS_PER_DAY_LABELS,
} from "@/data/profile-options";
import { useFirstLoad } from "@/hooks/useFirstLoad";
import {
  generateMealPlan,
  includedSlots,
  planMealList,
  planTotals,
} from "@/lib/meal-plan";
import type { MealType } from "@/lib/types";
import { cn, WEEKDAYS, weekDates } from "@/lib/utils";

interface WeekDay {
  short: string;
  long: string;
  dateNum: number;
  month: string;
  isToday: boolean;
}

export function PlanScreen() {
  const loading = useFirstLoad("plan");
  const reduceMotion = useReducedMotion();
  const { toast } = useToast();
  const {
    profile,
    nutrition,
    state,
    todayIndex,
    todayExtras,
    completedMealIds,
    toggleMealComplete,
    replacePlanMeal,
    removeExtraMeal,
  } = useUser();

  const [week, setWeek] = useState<WeekDay[]>([]);
  const [weekLabel, setWeekLabel] = useState("");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => {
    const dates = weekDates();
    setWeek(
      dates.map((date, index) => ({
        short: WEEKDAYS[index].short,
        long: WEEKDAYS[index].long,
        dateNum: date.getDate(),
        month: date.toLocaleString("en-IN", { month: "short" }),
        isToday: index === todayIndex,
      })),
    );

    const first = dates[0];
    const last = dates[6];
    setWeekLabel(
      first.getMonth() === last.getMonth()
        ? first.toLocaleString("en-IN", { month: "long", year: "numeric" })
        : `${first.toLocaleString("en-IN", { month: "short" })} – ${last.toLocaleString(
            "en-IN",
            { month: "short", year: "numeric" },
          )}`,
    );

    setSelectedDay((current) => current ?? todayIndex);
  }, [todayIndex]);

  const plan = useMemo(
    () => state.plan ?? (profile ? generateMealPlan(profile) : null),
    [state.plan, profile],
  );

  const weekTotals = useMemo(() => {
    if (!plan) return { price: 0, meals: 0 };
    return plan.days.reduce(
      (totals, day) => {
        const dayTotals = planTotals(planMealList(day));
        return {
          price: totals.price + dayTotals.price,
          meals: totals.meals + planMealList(day).length,
        };
      },
      { price: 0, meals: 0 },
    );
  }, [plan]);

  if (!profile || !nutrition) return null;

  if (loading || selectedDay === null || week.length === 0) {
    return (
      <div className="pt-2">
        <PlanSkeleton />
      </div>
    );
  }

  const dayInfo = week[selectedDay];
  const isToday = selectedDay === todayIndex;
  const day = plan?.days[selectedDay];
  const dayMeals = day ? planMealList(day) : [];
  const totals = planTotals(dayMeals);
  const eatenCount = dayMeals.filter(({ meal }) =>
    completedMealIds.includes(meal.uid),
  ).length;
  const extrasForDay = isToday ? todayExtras : [];
  const slots = includedSlots(profile.mealsPerDay)
    .map((slot) => SLOT_LABELS[slot])
    .join(" · ");
  const perDayPrice = Math.round(weekTotals.price / 7);

  function handleReplace(slot: MealType) {
    if (selectedDay === null) return;
    const replaced = replacePlanMeal(selectedDay, slot);
    if (replaced) {
      toast({
        title: "Meal swapped",
        description: `${SLOT_LABELS[slot]} on ${dayInfo.long} has a new dish.`,
      });
    } else {
      toast({
        title: "No other match yet",
        description:
          "That slot has only one dish for your preference. Explore the menu for more.",
        tone: "info",
      });
    }
  }

  return (
    <PageTransition className="space-y-5">
      <header className="pt-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-fresh">
            Weekly plan
          </span>
          <Pill tone="lime" icon={Sparkles} className="normal-case tracking-[0.04em]">
            Built for you
          </Pill>
        </div>

        <div className="mt-1.5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-[1.95rem] font-extrabold leading-[1.05] tracking-[-0.05em] text-charcoal sm:text-[2.35rem]">
              Your week, planned{" "}
              <span className="relative inline-block text-forest">
                properly
                <svg
                  viewBox="0 0 120 10"
                  className="absolute -bottom-0.5 left-0 h-2 w-full text-lime"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 8C30 3 70 2 118 5"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </span>
              .
            </h1>
            <p className="mt-2.5 max-w-[520px] text-[0.86rem] leading-relaxed text-muted">
              Every dish is picked around your goal and kitchen preference.
              Swap, mark meals eaten, and watch the numbers move.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Pill tone="fresh" icon={Leaf}>
              {DIET_LABELS[profile.foodPreference]}
            </Pill>
            <Pill tone="sand" icon={Flame}>
              {GOAL_LABELS[profile.goal]}
            </Pill>
          </div>
        </div>
      </header>

      <section className="rounded-[26px] border border-white/80 bg-white/85 p-3 shadow-card backdrop-blur-sm sm:p-4">
        <div className="flex items-center justify-between gap-3 px-1 pb-2.5">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-full bg-forest-soft text-forest">
              <CalendarDays className="size-3.5" />
            </span>
            <div>
              <p className="text-[0.54rem] font-semibold uppercase tracking-[0.15em] text-muted">
                This week
              </p>
              <p className="text-[0.72rem] font-semibold text-charcoal">
                {weekLabel}
              </p>
            </div>
          </div>
          <span className="hidden items-center gap-1.5 rounded-full bg-cream px-2.5 py-1.5 text-[0.58rem] font-semibold text-muted sm:inline-flex">
            <ChefHat className="size-3 text-fresh" />
            {MEALS_PER_DAY_LABELS[profile.mealsPerDay]}
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
          {week.map((dayInfoItem, index) => {
            const active = selectedDay === index;
            return (
              <button
                key={dayInfoItem.short}
                type="button"
                onClick={() => setSelectedDay(index)}
                aria-pressed={active}
                aria-label={`${dayInfoItem.long}, ${dayInfoItem.dateNum} ${dayInfoItem.month}${
                  dayInfoItem.isToday ? ", today" : ""
                }`}
                className={cn(
                  "group flex h-[62px] flex-col items-center justify-center rounded-2xl border text-center transition-all duration-200 sm:h-[68px]",
                  active
                    ? "border-forest bg-forest text-cream shadow-[0_12px_26px_-14px_rgba(23,77,54,0.85)]"
                    : "border-transparent text-charcoal hover:border-line hover:bg-cream",
                  !active && dayInfoItem.isToday && "border-fresh/40 bg-fresh-soft/40",
                )}
              >
                <span
                  className={cn(
                    "text-[0.5rem] font-bold uppercase tracking-[0.08em]",
                    active ? "text-cream/55" : "text-muted/70",
                  )}
                >
                  {dayInfoItem.short}
                </span>
                <span
                  className={cn(
                    "mt-0.5 font-display text-[1rem] font-extrabold leading-none tracking-[-0.03em]",
                    active ? "text-lime" : "text-charcoal",
                  )}
                >
                  {dayInfoItem.dateNum}
                </span>
                <span
                  className={cn(
                    "mt-1 size-1 rounded-full",
                    active
                      ? "bg-lime"
                      : dayInfoItem.isToday
                        ? "bg-fresh"
                        : "bg-transparent",
                  )}
                />
              </button>
            );
          })}
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-12">
        <div className="space-y-5 lg:col-span-8">
          <DayOverview
            dayLabel={dayInfo.long}
            dateLabel={`${dayInfo.dateNum} ${dayInfo.month}`}
            plannedCalories={totals.calories}
            targetCalories={nutrition.calorieTarget}
            totals={totals}
            targets={{
              protein: nutrition.protein,
              carbs: nutrition.carbs,
              fat: nutrition.fat,
            }}
            price={totals.price}
            mealCount={dayMeals.length}
            eaten={eatenCount}
            isToday={isToday}
          />

          <section>
            <SectionHeading
              eyebrow={isToday ? "On today's plate" : "On the plan"}
              title={`${dayInfo.long}'s meals`}
              action={
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-[0.6rem] font-semibold text-muted">
                  <UtensilsCrossed className="size-3 text-fresh" />
                  {dayMeals.length} meals · {totals.calories.toLocaleString("en-IN")}{" "}
                  kcal
                </span>
              }
            />

            {dayMeals.length === 0 ? (
              <div className="mt-4 flex flex-col items-center justify-center rounded-[26px] border border-dashed border-forest/15 bg-white/50 px-6 py-12 text-center">
                <span className="flex size-12 items-center justify-center rounded-full bg-cream-deep text-forest">
                  <ChefHat className="size-5" />
                </span>
                <h3 className="mt-3 font-display text-[1rem] font-bold text-charcoal">
                  Nothing planned here yet
                </h3>
                <p className="mt-1 max-w-[300px] text-[0.72rem] leading-relaxed text-muted">
                  Add a dish from the menu and it will show up on today&apos;s
                  plate.
                </p>
                <Link href="/menu" className="mt-4">
                  <Button size="sm" icon={ArrowRight}>
                    Browse the menu
                  </Button>
                </Link>
              </div>
            ) : (
              <Stagger className="mt-4 space-y-3" staggerChildren={0.06}>
                {dayMeals.map(({ meal, food }) => (
                  <StaggerItem key={meal.uid}>
                    <MealSlotCard
                      food={food}
                      slot={meal.slot}
                      completed={completedMealIds.includes(meal.uid)}
                      canToggle={isToday}
                      onToggle={() => toggleMealComplete(meal.uid)}
                      onReplace={() => handleReplace(meal.slot)}
                    />
                  </StaggerItem>
                ))}
              </Stagger>
            )}

            <p className="mt-3 flex items-start gap-1.5 text-[0.62rem] leading-relaxed text-muted/70">
              <Repeat2 className="mt-0.5 size-3 shrink-0 text-fresh" />
              Replace swaps the dish for the next best match for your
              preference. Meals can be marked eaten on the day itself.
            </p>
          </section>

          {extrasForDay.length > 0 ? (
            <motion.section
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <SectionHeading
                eyebrow="Added from the menu"
                title="On today's plate"
                action={
                  <Pill tone="sand" icon={CheckCircle2}>
                    {extrasForDay.length} extra
                  </Pill>
                }
              />
              <div className="mt-4 space-y-3">
                {extrasForDay.map(({ meal, food }) => (
                  <MealSlotCard
                    key={meal.uid}
                    food={food}
                    slot={meal.slot}
                    extra
                    completed={completedMealIds.includes(meal.uid)}
                    canReplace={false}
                    onToggle={() => toggleMealComplete(meal.uid)}
                    onRemove={() => {
                      removeExtraMeal(meal.uid);
                      toast({
                        title: `${food.name} removed`,
                        description: "Taken off today's plate.",
                        tone: "info",
                      });
                    }}
                  />
                ))}
              </div>
            </motion.section>
          ) : null}
        </div>

        <aside className="space-y-5 lg:col-span-4">
          <SubscriptionCard
            perDay={perDayPrice}
            perWeek={weekTotals.price}
            mealCount={weekTotals.meals}
          />

          <section className="rounded-[26px] border border-white/80 bg-white p-5 shadow-card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[0.54rem] font-semibold uppercase tracking-[0.15em] text-muted">
                  Weekly overview
                </p>
                <h2 className="mt-0.5 font-display text-[1rem] font-bold tracking-[-0.025em] text-charcoal">
                  Balance across the week
                </h2>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-cream px-2.5 py-1 text-[0.56rem] font-semibold text-muted">
                <Leaf className="size-3 text-fresh" />
                {Math.round(
                  (plan
                    ? plan.days.reduce(
                        (sum, day) => sum + planTotals(planMealList(day)).calories,
                        0,
                      )
                    : 0) / 7,
                ).toLocaleString("en-IN")}{" "}
                kcal / day
              </span>
            </div>

            <div className="mt-3">
              {plan ? (
                <WeekCalorieChart
                  plan={plan}
                  target={nutrition.calorieTarget}
                  height={168}
                />
              ) : null}
            </div>

            <p className="mt-2 border-t border-line/60 pt-2.5 text-[0.58rem] leading-relaxed text-muted/70">
              Bars show planned calories per day. Select a day above to see its
              full menu.
            </p>
          </section>

          <section className="rounded-[26px] border border-white/80 bg-gradient-to-br from-forest-soft/80 to-white p-5 shadow-card">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-full bg-white text-forest shadow-sm">
                <Sparkles className="size-3.5" />
              </span>
              <h2 className="font-display text-[0.98rem] font-bold tracking-[-0.025em] text-charcoal">
                Built around you
              </h2>
            </div>

            <dl className="mt-3.5 space-y-2.5 text-[0.66rem]">
              <div className="flex items-start justify-between gap-3">
                <dt className="text-muted">Daily rhythm</dt>
                <dd className="text-right font-semibold text-charcoal">{slots}</dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="text-muted">Lifestyle</dt>
                <dd className="text-right font-semibold text-charcoal">
                  {ACTIVITY_LABELS[profile.activity]}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="text-muted">Calorie target</dt>
                <dd className="text-right font-semibold text-charcoal">
                  {nutrition.calorieTarget.toLocaleString("en-IN")} kcal
                </dd>
              </div>
              <div className="flex items-start justify-between gap-3">
                <dt className="text-muted">Kitchen</dt>
                <dd className="text-right font-semibold text-charcoal">
                  {DIET_LABELS[profile.foodPreference]}
                </dd>
              </div>
            </dl>

            <Link
              href="/onboarding"
              className="group mt-4 inline-flex items-center gap-1.5 text-[0.66rem] font-semibold text-forest transition hover:text-fresh"
            >
              Update my preferences
              <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </section>
        </aside>
      </div>

      <p className="pb-2 text-center text-[0.58rem] leading-relaxed text-muted/60">
        Plans are built from the demo menu and general nutrition estimates — not
        medical advice. Swap meals freely and adjust with a professional when
        needed.
      </p>
    </PageTransition>
  );
}
