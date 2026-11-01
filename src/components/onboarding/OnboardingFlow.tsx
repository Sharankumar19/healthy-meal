"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronLeft,
  Leaf,
  Sparkles,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import type {
  Control,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import { HeightField, WeightField } from "@/components/onboarding/MeasureFields";
import { SelectCard } from "@/components/onboarding/SelectCard";
import { BootLoader } from "@/components/layout/BootLoader";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { TextInput } from "@/components/ui/TextInput";
import {
  ACTIVITY_OPTIONS,
  FOOD_PREFERENCE_OPTIONS,
  GENDER_OPTIONS,
  GOAL_OPTIONS,
  MEALS_OPTIONS,
} from "@/data/profile-options";
import { useUser } from "@/context/UserContext";
import type {
  ActivityLevel,
  FoodPreference,
  Gender,
  Goal,
  MealsPerDay,
  UserProfile,
} from "@/lib/types";
import { cn } from "@/lib/utils";

interface FormValues {
  name: string;
  gender?: Gender;
  age?: number;
  heightCm?: number;
  weightKg?: number;
  activity?: ActivityLevel;
  goal?: Goal;
  foodPreference?: FoodPreference;
  mealsPerDay?: MealsPerDay;
}

const STEPS = [
  {
    key: "about",
    label: "About you",
    eyebrow: "First things first",
    title: "Let's get to know you.",
    subtitle:
      "A few details help us create your perfect nutrition plan.",
    fields: ["name", "gender"] as (keyof FormValues)[],
  },
  {
    key: "day",
    label: "Your day",
    eyebrow: "Daily rhythm",
    title: "How does your day look?",
    subtitle:
      "Your routine changes how much energy your body needs each day.",
    fields: ["age", "activity"] as (keyof FormValues)[],
  },
  {
    key: "measure",
    label: "Measurements",
    eyebrow: "The numbers",
    title: "Let's get your measurements.",
    subtitle:
      "We'll use these for your BMI, BMR and daily calorie needs. Switch units anytime.",
    fields: ["heightCm", "weightKg"] as (keyof FormValues)[],
  },
  {
    key: "goal",
    label: "Your goal",
    eyebrow: "The direction",
    title: "What are you working towards?",
    subtitle:
      "Your goal decides whether we create a deficit, a surplus or balance.",
    fields: ["goal"] as (keyof FormValues)[],
  },
  {
    key: "food",
    label: "Food & meals",
    eyebrow: "On your plate",
    title: "What's on your plate?",
    subtitle:
      "We'll only recommend meals that match how you eat and how often you eat.",
    fields: ["foodPreference", "mealsPerDay"] as (keyof FormValues)[],
  },
] as const;

const slide = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 34 : -34,
  }),
  center: { opacity: 1, x: 0 },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -26 : 26,
  }),
};

export function OnboardingFlow() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const { hydrated, profile, state, completeOnboarding } = useUser();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [saving, setSaving] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const {
    register,
    control,
    trigger,
    handleSubmit,
    getValues,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onTouched",
    shouldUnregister: false,
    defaultValues: {
      name: profile?.name ?? "",
      gender: profile?.gender,
      age: profile?.age,
      heightCm: profile?.heightCm ?? 0,
      weightKg: profile?.weightKg ?? 0,
      activity: profile?.activity,
      goal: profile?.goal,
      foodPreference: profile?.foodPreference,
      mealsPerDay: profile?.mealsPerDay,
    },
  });

  const current = STEPS[step];
  const percent = Math.round(((step + 1) / STEPS.length) * 100);
  const watchedAge = watch("age");
  const isMinor = typeof watchedAge === "number" && watchedAge >= 13 && watchedAge < 18;

  useEffect(() => {
    if (!hydrated) return;
    if (!state.phone) router.replace("/");
  }, [hydrated, state.phone, router]);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  if (!hydrated) {
    return <BootLoader onComplete={() => undefined} />;
  }

  if (!state.phone) {
    return <BootLoader onComplete={() => undefined} />;
  }

  function goBack() {
    if (step === 0) {
      router.push(profile ? "/results" : "/");
      return;
    }
    setDirection(-1);
    setStep((value) => Math.max(0, value - 1));
  }

  async function goNext() {
    if (step < STEPS.length - 1) {
      const valid = await trigger([...current.fields], { shouldFocus: true });
      if (!valid) return;
      setDirection(1);
      setStep((value) => value + 1);
      return;
    }
    const valid = await trigger(undefined, { shouldFocus: true });
    if (!valid) return;
    void handleSubmit(onComplete)();
  }

  function onComplete(values: FormValues) {
    if (
      !values.gender ||
      !values.activity ||
      !values.goal ||
      !values.foodPreference ||
      !values.mealsPerDay ||
      !values.age ||
      !values.heightCm ||
      !values.weightKg
    ) {
      return;
    }
    setSaving(true);
    const nextProfile: UserProfile = {
      name: values.name.trim(),
      gender: values.gender,
      age: values.age,
      heightCm: Math.round(values.heightCm * 10) / 10,
      weightKg: Math.round(values.weightKg * 10) / 10,
      activity: values.activity,
      goal: values.goal,
      foodPreference: values.foodPreference,
      mealsPerDay: values.mealsPerDay,
      createdAt: profile?.createdAt ?? new Date().toISOString(),
    };
    completeOnboarding(nextProfile);
    router.push("/results");
  }

  return (
    <main className="min-h-dvh px-0 py-0 sm:px-4 sm:py-4 lg:p-5">
      <div className="mx-auto w-full max-w-[1120px] overflow-hidden rounded-none border-line/60 bg-white/40 shadow-soft sm:rounded-[34px] sm:border lg:min-h-[calc(100dvh-2.5rem)]">
        <div className="grid lg:grid-cols-[330px_1fr]">
          <OnboardingRail
            step={step}
            percent={percent}
            profileName={getValues("name") || profile?.name}
          />

          <form
            onSubmit={(event) => {
              event.preventDefault();
              void goNext();
            }}
            className="flex min-h-dvh flex-col sm:min-h-0 lg:min-h-[calc(100dvh-2.5rem)]"
          >
            <MobileProgress
              step={step}
              percent={percent}
              goBack={goBack}
            />

            <div className="hidden items-center justify-between px-10 pt-8 lg:flex">
              <button
                type="button"
                onClick={goBack}
                className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[0.72rem] font-semibold text-muted transition hover:text-forest"
              >
                <ChevronLeft className="size-4" />
                {step === 0 ? "Exit" : "Back"}
              </button>
              <span className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-muted">
                Step {step + 1} of {STEPS.length} · {percent}% complete
              </span>
            </div>
            <div className="mx-10 mt-4 hidden h-1.5 overflow-hidden rounded-full bg-cream-deep lg:block">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-fresh to-forest"
                animate={{ width: `${percent}%` }}
                transition={{ duration: reduceMotion ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>

            <div className="flex-1 px-5 pb-6 pt-7 sm:px-8 lg:px-10 lg:pb-8 lg:pt-9">
              <div className="mx-auto w-full max-w-[560px]">
                <div className="mb-7">
                  <span className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-fresh">
                    {current.eyebrow}
                  </span>
                  <h1
                    ref={headingRef}
                    tabIndex={-1}
                    className="mt-2 font-display text-[1.95rem] font-extrabold leading-[1.08] tracking-[-0.048em] text-charcoal outline-none sm:text-[2.25rem]"
                  >
                    {current.title}
                  </h1>
                  <p className="mt-2.5 max-w-[460px] text-[0.88rem] leading-relaxed text-muted">
                    {current.subtitle}
                  </p>
                </div>

                <AnimatePresence mode="wait" custom={direction} initial={false}>
                  <motion.div
                    key={current.key}
                    custom={direction}
                    variants={reduceMotion ? undefined : slide}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-6"
                  >
                    {step === 0 ? (
                      <StepAbout register={register} control={control} errors={errors} />
                    ) : null}
                    {step === 1 ? (
                      <StepDay
                        register={register}
                        control={control}
                        errors={errors}
                        isMinor={isMinor}
                      />
                    ) : null}
                    {step === 2 ? (
                      <StepMeasure control={control} errors={errors} />
                    ) : null}
                    {step === 3 ? (
                      <StepGoal control={control} errors={errors} />
                    ) : null}
                    {step === 4 ? (
                      <StepFood
                        control={control}
                        errors={errors}
                        isMinor={isMinor}
                      />
                    ) : null}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="sticky bottom-0 z-10 border-t border-line/70 bg-cream/90 px-5 py-4 backdrop-blur-xl sm:px-8 lg:px-10 lg:py-5">
              <div className="mx-auto flex w-full max-w-[560px] items-center gap-3">
                {step > 0 ? (
                  <Button
                    variant="white"
                    size="lg"
                    onClick={goBack}
                    icon={ArrowLeft}
                    iconPosition="left"
                    className="w-14 shrink-0 px-0 sm:w-auto sm:px-6"
                    aria-label="Go back"
                  >
                    <span className="hidden sm:inline">Back</span>
                  </Button>
                ) : null}
                <Button
                  type="submit"
                  size="lg"
                  fullWidth
                  loading={saving}
                  icon={step === STEPS.length - 1 ? Sparkles : ArrowRight}
                >
                  {step === STEPS.length - 1 ? "See my nutrition" : "Continue"}
                </Button>
              </div>
              <p className="mx-auto mt-2.5 hidden max-w-[560px] text-center text-[0.62rem] text-muted/70 sm:block">
                Your details are stored locally for this demo and stay on your
                device.
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

function OnboardingRail({
  step,
  percent,
  profileName,
}: {
  step: number;
  percent: number;
  profileName?: string;
}) {
  return (
    <aside className="relative hidden flex-col justify-between overflow-hidden bg-forest p-7 text-cream lg:flex">
      <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-lime/10 blur-[70px]" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 size-72 rounded-full bg-fresh/10 blur-[80px]" />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.05]" />

      <div className="relative">
        <Logo theme="light" size={38} wordmarkClassName="text-[1.2rem]" />

        <div className="mt-11">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-lime">
            <Sparkles className="size-3" />
            Built around you
          </span>
          <h2 className="mt-4 font-serif text-[2.15rem] italic leading-[1.08] text-cream">
            {profileName ? (
              <>Nice to see you, {profileName.split(" ")[0]}.</>
            ) : (
              <>Your plan starts with you.</>
            )}
          </h2>
          <p className="mt-3 text-[0.76rem] leading-relaxed text-cream/60">
            No fads. No guesswork. Just numbers and meals that make sense for
            your real life.
          </p>
        </div>

        <div className="mt-8 flex items-center gap-4 rounded-[20px] border border-white/10 bg-white/[0.04] p-4">
          <ProgressRing
            value={percent}
            size={76}
            stroke={6}
            from="#C5ED79"
            to="#F7F8F2"
            trackClassName="stroke-white/10"
            delay={0.1}
          >
            <span className="font-display text-[0.95rem] font-bold text-cream">
              {percent}%
            </span>
          </ProgressRing>
          <div>
            <p className="text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-cream/45">
              Profile progress
            </p>
            <p className="mt-1 text-[0.84rem] font-semibold text-cream">
              {STEPS[step].label}
            </p>
            <p className="mt-0.5 text-[0.66rem] text-cream/50">
              Step {step + 1} of {STEPS.length}
            </p>
          </div>
        </div>

        <ol className="mt-8 space-y-1">
          {STEPS.map((item, index) => {
            const done = index < step;
            const active = index === step;
            return (
              <li
                key={item.key}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-2 py-2 transition",
                  active && "bg-white/[0.06]",
                )}
              >
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full border text-[0.6rem] font-bold transition",
                    done && "border-lime/60 bg-lime text-forest",
                    active && "border-lime text-lime",
                    !done && !active && "border-white/15 text-cream/35",
                  )}
                >
                  {done ? <Check className="size-3" strokeWidth={3} /> : index + 1}
                </span>
                <span
                  className={cn(
                    "text-[0.76rem] font-medium",
                    active ? "text-cream" : done ? "text-cream/60" : "text-cream/35",
                  )}
                >
                  {item.label}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="relative mt-10">
        <div className="relative h-[150px] overflow-hidden rounded-[22px] border border-white/10">
          <Image
            src="/food/thali.jpg"
            alt="A balanced Indian thali with dal, vegetables, roti and rice"
            fill
            sizes="280px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/90 via-forest-deep/15 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <p className="text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-lime/80">
              Real food, real life
            </p>
            <p className="mt-0.5 font-serif text-[1.05rem] italic leading-tight text-cream">
              Balanced, fresh, familiar.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function MobileProgress({
  step,
  percent,
  goBack,
}: {
  step: number;
  percent: number;
  goBack: () => void;
}) {
  return (
    <div className="px-5 pt-5 lg:hidden">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={goBack}
          aria-label={step === 0 ? "Exit onboarding" : "Go back"}
          className="flex size-10 items-center justify-center rounded-full border border-line bg-white/80 text-forest shadow-sm transition hover:border-fresh"
        >
          <ArrowLeft className="size-4" />
        </button>
        <Logo size={30} wordmarkClassName="text-[1.02rem]" />
        <span className="rounded-full bg-forest-soft px-3 py-1.5 text-[0.6rem] font-bold uppercase tracking-[0.1em] text-forest">
          {step + 1} / {STEPS.length}
        </span>
      </div>
      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-[0.6rem] font-semibold uppercase tracking-[0.14em]">
          <span className="text-muted">{STEPS[step].label}</span>
          <span className="text-forest">{percent}% complete</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-cream-deep">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-fresh to-forest"
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>
    </div>
  );
}

type FieldErrorsMap = FieldErrors<FormValues>;
type FormControl = Control<FormValues>;
type Register = UseFormRegister<FormValues>;

function StepAbout({
  register,
  control,
  errors,
}: {
  register: Register;
  control: FormControl;
  errors: FieldErrorsMap;
}) {
  return (
    <div className="space-y-6">
      <TextInput
        label="Your name"
        placeholder="Rahul"
        autoComplete="given-name"
        leading={<UserRound className="size-4" />}
        error={errors.name?.message}
        {...register("name", {
          required: "Tell us what to call you.",
          minLength: { value: 2, message: "Use at least 2 characters." },
          maxLength: { value: 40, message: "That name is a little too long." },
        })}
      />

      <div>
        <p className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted">
          Gender
        </p>
        <Controller
          control={control}
          name="gender"
          rules={{ required: "Choose the option that fits you." }}
          render={({ field }) => (
            <div className="grid grid-cols-2 gap-3">
              {GENDER_OPTIONS.map((option) => (
                <SelectCard
                  key={option.value}
                  selected={field.value === option.value}
                  onClick={() => field.onChange(option.value)}
                  title={option.title}
                  description={option.description}
                  icon={option.icon}
                />
              ))}
            </div>
          )}
        />
        <AnimatePresence initial={false}>
          {errors.gender ? (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 pl-1 text-xs font-medium text-tomato"
              role="alert"
            >
              {errors.gender.message}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="flex items-start gap-2.5 rounded-2xl bg-fresh-soft/60 px-3.5 py-3 text-[0.72rem] leading-relaxed text-forest/80">
        <Leaf className="mt-0.5 size-3.5 shrink-0 text-fresh" />
        <p>
          These details only shape your nutrition estimate. You can review and
          edit everything before seeing your plan.
        </p>
      </div>
    </div>
  );
}

function StepDay({
  register,
  control,
  errors,
  isMinor,
}: {
  register: Register;
  control: FormControl;
  errors: FieldErrorsMap;
  isMinor: boolean;
}) {
  return (
    <div className="space-y-6">
      <TextInput
        label="Age"
        type="number"
        inputMode="numeric"
        placeholder="28"
        leading={<CalendarDays className="size-4" />}
        error={errors.age?.message}
        containerClassName="max-w-[220px]"
        {...register("age", {
          valueAsNumber: true,
          required: "We need your age for accurate estimates.",
          min: { value: 13, message: "This app is designed for ages 13+." },
          max: { value: 90, message: "Please enter a valid age." },
        })}
      />

      <div>
        <p className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted">
          What&apos;s your day like?
        </p>
        <Controller
          control={control}
          name="activity"
          rules={{ required: "Choose the closest match." }}
          render={({ field }) => (
            <div className="space-y-2.5">
              {ACTIVITY_OPTIONS.map((option) => (
                <SelectCard
                  key={option.value}
                  selected={field.value === option.value}
                  onClick={() => field.onChange(option.value)}
                  title={option.title}
                  description={option.description}
                  icon={option.icon}
                />
              ))}
            </div>
          )}
        />
        <AnimatePresence initial={false}>
          {errors.activity ? (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 pl-1 text-xs font-medium text-tomato"
              role="alert"
            >
              {errors.activity.message}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>

      {isMinor ? (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-lime/60 bg-lime/20 px-4 py-3"
        >
          <p className="text-[0.76rem] font-semibold text-forest">
            Growing bodies need fuel, not restriction.
          </p>
          <p className="mt-1 text-[0.7rem] leading-relaxed text-forest/70">
            Because you&apos;re under 18, we&apos;ll skip calorie deficits and
            build a plan around steady growth and energy.
          </p>
        </motion.div>
      ) : null}
    </div>
  );
}

function StepMeasure({
  control,
  errors,
}: {
  control: FormControl;
  errors: FieldErrorsMap;
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <Controller
        control={control}
        name="heightCm"
        rules={{
          validate: (value) => {
            if (!value) return "Add your height to continue.";
            if (value < 120 || value > 230) {
              return "Enter a height between 120 and 230 cm.";
            }
            return true;
          },
        }}
        render={({ field }) => (
          <HeightField
            value={field.value ?? 0}
            onChange={field.onChange}
            error={errors.heightCm?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="weightKg"
        rules={{
          validate: (value) => {
            if (!value) return "Add your weight to continue.";
            if (value < 35 || value > 200) {
              return "Enter a weight between 35 and 200 kg.";
            }
            return true;
          },
        }}
        render={({ field }) => (
          <WeightField
            value={field.value ?? 0}
            onChange={field.onChange}
            error={errors.weightKg?.message}
          />
        )}
      />
      <div className="sm:col-span-2">
        <div className="flex items-start gap-3 rounded-2xl bg-cream-deep/60 px-4 py-3.5 text-[0.72rem] leading-relaxed text-muted">
          <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-white text-forest">
            <Sparkles className="size-3.5" />
          </span>
          <p>
            <strong className="font-semibold text-charcoal">
              Why we ask:
            </strong>{" "}
            your height and weight feed the Mifflin-St Jeor formula, the same
            evidence-based equation dietitians use to estimate energy needs.
          </p>
        </div>
      </div>
    </div>
  );
}

function StepGoal({
  control,
  errors,
}: {
  control: FormControl;
  errors: FieldErrorsMap;
}) {
  return (
    <div>
      <Controller
        control={control}
        name="goal"
        rules={{ required: "Pick the goal that matters most right now." }}
        render={({ field }) => (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {GOAL_OPTIONS.map((option) => (
              <SelectCard
                key={option.value}
                selected={field.value === option.value}
                onClick={() => field.onChange(option.value)}
                title={option.title}
                description={option.description}
                icon={option.icon}
                badge={option.accent}
                variant="tile"
                className="min-h-[142px]"
              />
            ))}
          </div>
        )}
      />
      <AnimatePresence initial={false}>
        {errors.goal ? (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 pl-1 text-xs font-medium text-tomato"
            role="alert"
          >
            {errors.goal.message}
          </motion.p>
        ) : null}
      </AnimatePresence>

      <div className="mt-6 flex items-start gap-3 rounded-2xl bg-cream-deep/60 px-4 py-3.5 text-[0.72rem] leading-relaxed text-muted">
        <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-white text-forest">
          <Sparkles className="size-3.5" />
        </span>
        <p>
          Not sure? Choose{" "}
          <strong className="font-semibold text-charcoal">Maintenance</strong>{" "}
          and start with balance. You can change your goal whenever you like.
        </p>
      </div>
    </div>
  );
}

function StepFood({
  control,
  errors,
  isMinor,
}: {
  control: FormControl;
  errors: FieldErrorsMap;
  isMinor: boolean;
}) {
  return (
    <div className="space-y-7">
      <div>
        <p className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted">
          Food preference
        </p>
        <Controller
          control={control}
          name="foodPreference"
          rules={{ required: "Choose how you eat." }}
          render={({ field }) => (
            <div className="space-y-2.5">
              {FOOD_PREFERENCE_OPTIONS.map((option) => (
                <SelectCard
                  key={option.value}
                  selected={field.value === option.value}
                  onClick={() => field.onChange(option.value)}
                  title={option.title}
                  description={option.description}
                  icon={option.icon}
                />
              ))}
            </div>
          )}
        />
        <AnimatePresence initial={false}>
          {errors.foodPreference ? (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 pl-1 text-xs font-medium text-tomato"
              role="alert"
            >
              {errors.foodPreference.message}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>

      <div>
        <p className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted">
          Meals a day
        </p>
        <Controller
          control={control}
          name="mealsPerDay"
          rules={{ required: "Choose your usual meal rhythm." }}
          render={({ field }) => (
            <div className="grid grid-cols-3 gap-2.5">
              {MEALS_OPTIONS.map((option) => (
                <SelectCard
                  key={option.value}
                  selected={field.value === option.value}
                  onClick={() => field.onChange(option.value)}
                  title={option.title}
                  description={option.description}
                  number={String(option.value)}
                  variant="tile"
                  className="min-h-[130px] justify-between"
                />
              ))}
            </div>
          )}
        />
        <AnimatePresence initial={false}>
          {errors.mealsPerDay ? (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 pl-1 text-xs font-medium text-tomato"
              role="alert"
            >
              {errors.mealsPerDay.message}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>

      {isMinor ? (
        <div className="rounded-2xl border border-lime/60 bg-lime/20 px-4 py-3 text-[0.7rem] leading-relaxed text-forest/75">
          <strong className="font-semibold">Teen mode is on.</strong> Your plan
          will focus on balanced meals and enough energy — no restrictive
          calorie targets. A parent or doctor can help you fine-tune it.
        </div>
      ) : null}
    </div>
  );
}
