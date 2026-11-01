import { ACTIVITY_MULTIPLIERS } from "@/data/profile-options";
import type {
  BmiCategory,
  Goal,
  NutritionResult,
  UserProfile,
} from "@/lib/types";

const GOAL_ADJUSTMENT: Record<Goal, number> = {
  loss: -400,
  maintain: 0,
  muscle: 250,
  gain: 400,
};

const PROTEIN_PER_KG: Record<Goal, number> = {
  loss: 1.8,
  maintain: 1.5,
  muscle: 2,
  gain: 1.7,
};

export const ACTIVITY_WATER_BONUS = {
  sedentary: 0,
  light: 250,
  active: 500,
} as const;

export function getBmiCategory(bmi: number): BmiCategory {
  if (bmi < 18.5) return "underweight";
  if (bmi < 25) return "healthy";
  if (bmi < 30) return "overweight";
  return "obese";
}

export const BMI_COPY: Record<
  BmiCategory,
  { label: string; tone: string; note: string }
> = {
  underweight: {
    label: "Underweight",
    tone: "amber",
    note: "Your plan will focus on steady, nourishing fuel.",
  },
  healthy: {
    label: "Healthy range",
    tone: "green",
    note: "A great place to build from. Let's keep it that way.",
  },
  overweight: {
    label: "Above range",
    tone: "amber",
    note: "Small, consistent changes will move the needle.",
  },
  obese: {
    label: "High range",
    tone: "rose",
    note: "We'll keep things gradual and judgement-free.",
  },
};

/**
 * Mifflin-St Jeor BMR + activity multiplier + goal adjustment.
 * All outputs are rounded for display. Estimates only — not medical advice.
 */
export function calculateNutrition(profile: UserProfile): NutritionResult {
  const { gender, age, heightCm, weightKg, activity, goal } = profile;
  const isMinor = age < 18;

  const bmr =
    gender === "male"
      ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

  const tdee = bmr * ACTIVITY_MULTIPLIERS[activity];
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  const bmiCategory = getBmiCategory(bmi);

  let adjustment = GOAL_ADJUSTMENT[goal];

  // Safety rails: no deficit for underweight users or minors.
  if (goal === "loss" && (isMinor || bmi < 18.5)) {
    adjustment = 0;
  }
  if (isMinor) {
    adjustment = Math.min(adjustment, 200);
  }

  const floor = gender === "male" ? 1500 : 1200;
  const rawTarget = tdee + adjustment;
  const calorieTarget = Math.round(
    isMinor ? rawTarget : Math.max(rawTarget, Math.min(tdee, floor)),
  );

  const proteinPerKg = isMinor ? 1.5 : PROTEIN_PER_KG[goal];
  const proteinCap = (calorieTarget * 0.38) / 4;
  const protein = Math.round(
    Math.min(weightKg * proteinPerKg, proteinCap),
  );
  const fat = Math.round((calorieTarget * 0.25) / 9);
  const carbs = Math.max(
    50,
    Math.round((calorieTarget - protein * 4 - fat * 9) / 4),
  );

  const waterMl =
    Math.round(
      (weightKg * 35 + ACTIVITY_WATER_BONUS[activity] + (isMinor ? -100 : 0)) /
        100,
    ) * 100;

  const healthyWeightKg = {
    min: Math.round(18.5 * heightM * heightM * 10) / 10,
    max: Math.round(24.9 * heightM * heightM * 10) / 10,
  };

  return {
    bmi: Math.round(bmi * 10) / 10,
    bmiCategory,
    bmiRange: { min: 18.5, max: 24.9 },
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    calorieTarget,
    goalAdjustment: Math.round(adjustment),
    protein,
    carbs,
    fat,
    waterMl: Math.min(4500, waterMl),
    isMinor,
    proteinPerKg,
    healthyWeightKg,
    goalCopy: buildGoalCopy({
      goal,
      isMinor,
      bmiCategory,
      calorieTarget,
      adjustment,
    }),
  };
}

function buildGoalCopy({
  goal,
  isMinor,
  bmiCategory,
  calorieTarget,
  adjustment,
}: {
  goal: Goal;
  isMinor: boolean;
  bmiCategory: BmiCategory;
  calorieTarget: number;
  adjustment: number;
}): NutritionResult["goalCopy"] {
  if (isMinor) {
    return {
      badge: "Teen growth mode",
      headline: "Built for growth, not restriction.",
      description:
        "Because you're under 18, we've skipped calorie deficits and set a plan around steady energy for school, sport and growth. Check in with a parent or doctor before changing how you eat.",
    };
  }

  if (goal === "loss" && bmiCategory === "underweight") {
    return {
      badge: "Fuel-first plan",
      headline: "You don't need a deficit right now.",
      description: `Your BMI sits below the healthy range, so we've set ${calorieTarget.toLocaleString(
        "en-IN",
      )} kcal — roughly your maintenance needs — instead of cutting calories. A doctor can help you build a plan that fits you.`,
    };
  }

  const base = {
    loss: {
      badge: "Fat loss",
      headline: "Fat loss, without the crash diets.",
      description: `A gentle ${Math.abs(
        adjustment,
      )} kcal daily deficit puts you at ${calorieTarget.toLocaleString(
        "en-IN",
      )} kcal. Slow and steady protects your energy and muscle.`,
    },
    maintain: {
      badge: "Maintenance",
      headline: "Consistency is the whole game.",
      description: `You're eating around ${calorieTarget.toLocaleString(
        "en-IN",
      )} kcal — in line with what your body uses. Pair it with daily movement and good sleep.`,
    },
    muscle: {
      badge: "Lean surplus",
      headline: "Feed the muscle you're building.",
      description: `A small ${adjustment} kcal surplus takes you to ${calorieTarget.toLocaleString(
        "en-IN",
      )} kcal. Enough to grow, small enough to stay lean.`,
    },
    gain: {
      badge: "Calorie surplus",
      headline: "Gain size, the healthy way.",
      description: `A ${adjustment} kcal surplus takes you to ${calorieTarget.toLocaleString(
        "en-IN",
      )} kcal, with protein spread through the day to support healthy weight gain.`,
    },
  } as const;

  return base[goal];
}

export function macroCalories(protein: number, carbs: number, fat: number) {
  return protein * 4 + carbs * 4 + fat * 9;
}

export function formatWater(ml: number) {
  if (ml < 1000) return `${ml} ml`;
  return `${(ml / 1000).toFixed(1).replace(/\.0$/, "")} L`;
}

export function calorieSplitByMeals(calories: number, meals: 1 | 2 | 3) {
  const split = meals === 1 ? [1] : meals === 2 ? [0.4, 0.6] : [0.3, 0.4, 0.3];
  return split.map((part) => Math.round(calories * part));
}
