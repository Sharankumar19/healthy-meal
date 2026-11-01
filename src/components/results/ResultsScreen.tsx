"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Beef,
  CalendarRange,
  Droplets,
  Dumbbell,
  Flame,
  Gauge,
  Info,
  Pencil,
  Sparkles,
  UtensilsCrossed,
  Wheat,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { BootLoader } from "@/components/layout/BootLoader";
import { Logo } from "@/components/brand/Logo";
import { BmiScale } from "@/components/results/BmiScale";
import { MacroDonut } from "@/components/results/MacroDonut";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Card";
import { ProgressRing } from "@/components/ui/ProgressRing";
import {
  ACTIVITY_LABELS,
  GOAL_LABELS,
} from "@/data/profile-options";
import { DIET_LABELS, SLOT_LABELS } from "@/data/foods";
import { useUser } from "@/context/UserContext";
import {
  generateMealPlan,
  planMealList,
  planTotals,
} from "@/lib/meal-plan";
import { clamp, cn } from "@/lib/utils";

const MACRO_ICONS = {
  protein: Beef,
  carbs: Wheat,
  fat: Droplets,
} as const;

export function ResultsScreen() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const { hydrated, state, profile, nutrition, todayIndex } = useUser();

  useEffect(() => {
    if (!hydrated) return;
    if (!state.phone) {
      router.replace("/");
      return;
    }
    if (!profile) router.replace("/onboarding");
  }, [hydrated, state.phone, profile, router]);

  const mealPlanDay =
    state.plan?.days[todayIndex] ??
    (profile ? generateMealPlan(profile).days[todayIndex] : null);
  const dayMeals = useMemo(
    () => (mealPlanDay ? planMealList(mealPlanDay) : []),
    [mealPlanDay],
  );
  const totals = useMemo(() => planTotals(dayMeals), [dayMeals]);

  if (!hydrated || !profile || !nutrition) {
    return <BootLoader onComplete={() => undefined} />;
  }

  const firstName = profile.name.split(" ")[0];
  const maintenancePercent = Math.round(
    (nutrition.calorieTarget / nutrition.tdee) * 100,
  );
  const adjustmentLabel =
    nutrition.goalAdjustment === 0
      ? "Maintain"
      : `${nutrition.goalAdjustment > 0 ? "+" : ""}${nutrition.goalAdjustment}`;

  const macroCards = [
    {
      key: "protein",
      label: "Protein",
      value: nutrition.protein,
      unit: "g",
      note: `${nutrition.proteinPerKg}g per kg`,
      color: "bg-forest",
      bar: "bg-forest",
      icon: Beef,
    },
    {
      key: "carbs",
      label: "Carbs",
      value: nutrition.carbs,
      unit: "g",
      note: "Training fuel",
      color: "bg-[#D9F0A5]",
      bar: "bg-[#A5CE5C]",
      icon: Wheat,
    },
    {
      key: "fat",
      label: "Fats",
      value: nutrition.fat,
      unit: "g",
      note: "Hormone support",
      color: "bg-fresh",
      bar: "bg-fresh",
      icon: Droplets,
    },
  ];

  return (
    <main className="min-h-dvh pb-16">
      <header className="mx-auto flex w-full max-w-[1240px] items-center justify-between px-4 py-4 sm:px-6 lg:px-8 lg:py-5">
        <Logo size={38} />
        <div className="flex items-center gap-2.5">
          <span className="hidden rounded-full border border-line bg-white/70 px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-muted sm:inline-flex">
            Nutrition summary
          </span>
          <Button
            variant="white"
            size="sm"
            icon={Pencil}
            iconPosition="left"
            onClick={() => router.push("/onboarding")}
          >
            Edit details
          </Button>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-[760px]"
        >
          <div className="flex items-center gap-2">
            <Pill tone="lime" icon={Sparkles}>
              Your plan is ready
            </Pill>
            {nutrition.isMinor ? <Pill tone="sand">Teen growth mode</Pill> : null}
          </div>
          <h1 className="mt-4 font-display text-[2.15rem] font-extrabold leading-[1.04] tracking-[-0.05em] text-charcoal sm:text-[2.85rem]">
            Here&apos;s what your body needs,{" "}
            <span className="text-forest">{firstName}</span>.
          </h1>
          <p className="mt-3 max-w-[560px] text-[0.9rem] leading-relaxed text-muted">
            Built from your measurements, daily routine and goal — then shaped
            into real meals you&apos;ll actually look forward to.
          </p>
        </motion.div>

        <div className="mt-5 flex flex-wrap gap-2">
          {[
            `${profile.age} years`,
            `${Math.round(profile.heightCm)} cm`,
            `${Math.round(profile.weightKg * 10) / 10} kg`,
            ACTIVITY_LABELS[profile.activity],
            GOAL_LABELS[profile.goal],
            DIET_LABELS[profile.foodPreference],
          ].map((label) => (
            <span
              key={label}
              className="rounded-full border border-line/80 bg-white/60 px-3 py-1.5 text-[0.68rem] font-medium text-muted"
            >
              {label}
            </span>
          ))}
        </div>

        <div className="mt-7 grid gap-4 lg:grid-cols-12 lg:gap-5">
          {/* Hero calorie card */}
          <motion.section
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-[30px] bg-forest p-5 text-cream shadow-float sm:p-7 lg:col-span-8 lg:p-8"
          >
            <div className="pointer-events-none absolute -right-24 -top-28 size-80 rounded-full bg-lime/15 blur-[80px]" />
            <div className="pointer-events-none absolute -bottom-32 -left-20 size-80 rounded-full bg-fresh/15 blur-[90px]" />
            <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.06]" />

            <div className="relative">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-lime">
                  <Flame className="size-3" />
                  Daily calorie target
                </span>
                <span className="rounded-full bg-lime px-3 py-1.5 text-[0.58rem] font-bold uppercase tracking-[0.12em] text-forest-deep">
                  {nutrition.goalCopy.badge}
                </span>
              </div>

              <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-end gap-2">
                    <span className="font-display text-[3.7rem] font-extrabold leading-none tracking-[-0.065em] text-cream sm:text-[4.5rem]">
                      <AnimatedNumber value={nutrition.calorieTarget} />
                    </span>
                    <span className="mb-2 text-[0.8rem] font-medium text-cream/55">
                      kcal / day
                    </span>
                  </div>
                  <p className="mt-2.5 max-w-[300px] text-[0.82rem] leading-snug text-cream/65">
                    {nutrition.goalCopy.headline}
                  </p>
                </div>

                <ProgressRing
                  value={clamp(maintenancePercent, 0, 100)}
                  size={142}
                  stroke={9}
                  from="#C5ED79"
                  to="#F7F8F2"
                  trackClassName="stroke-white/10"
                  delay={0.5}
                  className="mx-auto shrink-0 sm:mx-0"
                >
                  <span className="font-display text-[1.6rem] font-extrabold leading-none tracking-[-0.05em] text-cream">
                    {maintenancePercent}%
                  </span>
                  <span className="mt-1 max-w-[74px] text-[0.5rem] font-semibold uppercase leading-tight tracking-[0.14em] text-cream/50">
                    of maintenance
                  </span>
                </ProgressRing>
              </div>

              <p className="mt-4 max-w-[540px] text-[0.8rem] leading-relaxed text-cream/65">
                {nutrition.goalCopy.description}
              </p>

              <div className="mt-6 grid grid-cols-3 gap-2">
                {[
                  { label: "BMR", value: nutrition.bmr, unit: "kcal" },
                  { label: "TDEE", value: nutrition.tdee, unit: "kcal" },
                  { label: "Goal shift", value: adjustmentLabel, unit: "kcal" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-2.5 backdrop-blur-sm"
                  >
                    <p className="text-[0.52rem] font-semibold uppercase tracking-[0.14em] text-cream/40">
                      {stat.label}
                    </p>
                    <p className="mt-1 font-display text-[0.95rem] font-bold leading-none text-cream">
                      {typeof stat.value === "number" ? (
                        <AnimatedNumber value={stat.value} />
                      ) : (
                        stat.value
                      )}
                      <span className="ml-1 text-[0.55rem] font-medium text-cream/40">
                        {stat.unit}
                      </span>
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                <Button
                  variant="lime"
                  size="lg"
                  icon={ArrowRight}
                  onClick={() => router.push("/home")}
                  className="sm:px-7"
                >
                  Build My Meal Plan
                </Button>
                <Link
                  href="/menu"
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-white/15 px-6 text-[0.88rem] font-semibold text-cream/80 transition hover:border-white/30 hover:bg-white/5 hover:text-cream"
                >
                  <UtensilsCrossed className="size-4" />
                  Browse meals first
                </Link>
              </div>
            </div>
          </motion.section>

          {/* Macro panel */}
          <motion.section
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col rounded-[30px] border border-white/80 bg-white p-5 shadow-card lg:col-span-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-muted">
                  Macro split
                </p>
                <h2 className="mt-1 font-display text-[1.12rem] font-bold tracking-[-0.03em] text-charcoal">
                  Your daily balance
                </h2>
              </div>
              <span className="rounded-full bg-fresh-soft px-2.5 py-1 text-[0.55rem] font-semibold uppercase tracking-[0.1em] text-forest">
                {GOAL_LABELS[profile.goal]}
              </span>
            </div>

            <div className="mt-5 flex flex-1 items-center justify-center">
              <MacroDonut
                protein={nutrition.protein}
                carbs={nutrition.carbs}
                fat={nutrition.fat}
                calories={nutrition.calorieTarget}
              />
            </div>

            <div className="mt-5 space-y-3 border-t border-line/70 pt-4">
              {macroCards.map((macro) => {
                const Icon = MACRO_ICONS[macro.key as keyof typeof MACRO_ICONS];
                const kcal = Math.round(
                  macro.key === "fat" ? macro.value * 9 : macro.value * 4,
                );
                const percent = Math.round((kcal / nutrition.calorieTarget) * 100);
                return (
                  <div key={macro.key}>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-[0.72rem] font-medium text-charcoal">
                        <Icon className="size-3.5 text-forest" />
                        {macro.label}
                      </span>
                      <span className="text-[0.72rem] font-semibold text-charcoal">
                        {macro.value}g
                        <span className="ml-1 text-[0.6rem] font-normal text-muted">
                          · {percent}%
                        </span>
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-cream-deep">
                      <div
                        className={cn("h-full rounded-full", macro.bar)}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="mt-4 rounded-xl bg-cream/80 px-3 py-2 text-[0.65rem] leading-relaxed text-muted">
              Protein is prioritised to support{" "}
              {profile.goal === "loss"
                ? "muscle retention while losing fat."
                : profile.goal === "maintain"
                  ? "your current routine."
                  : "muscle repair and growth."}
            </p>
          </motion.section>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            <BmiScale nutrition={nutrition} />
          </motion.div>

          {/* Hydration */}
          <motion.section
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-[30px] border border-white/80 bg-gradient-to-br from-[#EAF4EC] via-[#F4F8EF] to-white p-5 shadow-card sm:p-6 lg:col-span-5"
          >
            <div className="pointer-events-none absolute -bottom-14 -right-10 size-44 rounded-full bg-lime/25 blur-3xl" />
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-muted">
                  Hydration goal
                </p>
                <div className="mt-2 flex items-end gap-2">
                  <span className="font-display text-[2.5rem] font-extrabold leading-none tracking-[-0.06em] text-forest">
                    {(nutrition.waterMl / 1000).toFixed(1).replace(/\.0$/, "")}
                  </span>
                  <span className="mb-1 font-display text-[1.3rem] font-bold text-forest/70">
                    L
                  </span>
                  <span className="mb-1.5 text-[0.7rem] text-muted">every day</span>
                </div>
              </div>
              <span className="flex size-11 items-center justify-center rounded-2xl bg-forest text-lime">
                <Droplets className="size-5" />
              </span>
            </div>

            <p className="relative mt-2 text-[0.72rem] leading-relaxed text-muted">
              That&apos;s about{" "}
              <strong className="font-semibold text-charcoal">
                {Math.round(nutrition.waterMl / 250)} glasses
              </strong>{" "}
              of 250ml. Add an extra glass for every intense workout.
            </p>

            <div className="relative mt-5 grid grid-cols-8 gap-1.5">
              {Array.from({
                length: Math.min(16, Math.round(nutrition.waterMl / 250)),
              }).map((_, index) => (
                <motion.span
                  key={index}
                  initial={reduceMotion ? false : { opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.035 }}
                  className="flex h-7 items-center justify-center rounded-md border border-fresh/25 bg-white/70"
                >
                  <span className="h-3.5 w-2 rounded-b-full rounded-t-sm bg-fresh/60" />
                </motion.span>
              ))}
            </div>
            <p className="relative mt-3 text-[0.62rem] font-medium text-forest/60">
              Spread it across the day — not all at once.
            </p>
          </motion.section>
        </div>

        {/* Recommended plate */}
        <section className="mt-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted">
                A taste of your plan
              </p>
              <h2 className="mt-1 font-display text-[1.4rem] font-extrabold tracking-[-0.035em] text-charcoal sm:text-[1.65rem]">
                A day on your plate
              </h2>
              <p className="mt-1 text-[0.78rem] text-muted">
                Matched to your {DIET_LABELS[profile.foodPreference].toLowerCase()} preference and{" "}
                {GOAL_LABELS[profile.goal].toLowerCase()} goal.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white/70 px-3.5 py-2 text-[0.68rem] font-semibold text-forest">
              <Flame className="size-3.5 text-[#D9973F]" />
              {totals.calories.toLocaleString("en-IN")} kcal · {totals.protein}g protein
            </span>
          </div>

          <div className="mt-4 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            {dayMeals.map(({ meal, food }, index) => (
              <motion.article
                key={meal.uid}
                initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: index * 0.06 }}
                className="group overflow-hidden rounded-[24px] border border-white/80 bg-white shadow-card"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={food.image}
                    alt={food.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-charcoal/60 to-transparent" />
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[0.55rem] font-bold uppercase tracking-[0.1em] text-forest backdrop-blur">
                    {SLOT_LABELS[food.mealType]}
                  </span>
                  <span className="absolute bottom-3 left-3 text-[0.65rem] font-semibold text-cream">
                    {food.calories} kcal
                  </span>
                </div>
                <div className="p-3.5">
                  <h3 className="text-[0.88rem] font-bold leading-tight tracking-[-0.02em] text-charcoal">
                    {food.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-[0.66rem] leading-snug text-muted">
                    {food.description}
                  </p>
                  <div className="mt-2.5 flex items-center justify-between text-[0.62rem] font-medium text-muted">
                    <span>{food.protein}g protein</span>
                    <span>₹{food.price}</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {totals.calories < nutrition.calorieTarget - 120 ? (
            <p className="mt-3 flex items-center gap-2 text-[0.68rem] text-muted">
              <Sparkles className="size-3.5 text-fresh" />
              This preview sits {Math.round(nutrition.calorieTarget - totals.calories)} kcal
              under target — snacks and portion tweaks fill the gap in your full plan.
            </p>
          ) : null}
        </section>

        <div className="mt-8 grid gap-3.5 lg:grid-cols-[1.4fr_1fr]">
          <section className="flex items-start gap-3 rounded-[24px] border border-line/80 bg-white/60 p-4 sm:p-5">
            <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-cream-deep text-forest">
              <Info className="size-4" />
            </span>
            <div>
              <p className="text-[0.78rem] font-semibold text-charcoal">
                Estimates, not medical advice
              </p>
              <p className="mt-1 text-[0.7rem] leading-relaxed text-muted">
                Your numbers use the Mifflin–St Jeor equation and an activity
                multiplier. They&apos;re a starting point — adjust based on how
                you feel over 2–3 weeks. If you&apos;re under 18, pregnant or
                managing a health condition, talk to a doctor or registered
                dietitian before changing your diet.
              </p>
            </div>
          </section>

          <section className="relative overflow-hidden rounded-[24px] bg-lime p-5 text-forest-deep">
            <div className="pointer-events-none absolute -right-8 -top-10 size-32 rounded-full bg-white/25 blur-2xl" />
            <div className="relative flex items-center justify-between gap-4">
              <div>
                <p className="font-serif text-[1.35rem] italic leading-tight">
                  Ready when you are.
                </p>
                <p className="mt-1 text-[0.7rem] font-medium text-forest/70">
                  Your personalised week is waiting.
                </p>
              </div>
              <Link
                href="/home"
                aria-label="Build my meal plan"
                className="flex size-12 shrink-0 items-center justify-center rounded-full bg-forest text-lime transition hover:scale-105 hover:bg-forest-deep"
              >
                <ArrowRight className="size-5" />
              </Link>
            </div>
          </section>
        </div>

        <p className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center text-[0.6rem] font-medium uppercase tracking-[0.14em] text-muted/60">
          <span className="inline-flex items-center gap-1.5">
            <Gauge className="size-3" /> Mifflin–St Jeor
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarRange className="size-3" /> Weekly plan
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Dumbbell className="size-3" /> Goal-aware
          </span>
        </p>
      </div>
    </main>
  );
}
