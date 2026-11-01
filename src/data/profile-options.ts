import type {
  ActivityLevel,
  FoodPreference,
  Gender,
  Goal,
  MealsPerDay,
} from "@/lib/types";

export interface ChoiceOption<T extends string | number> {
  value: T;
  title: string;
  description: string;
  icon: string;
}

export const GENDER_OPTIONS: ChoiceOption<Gender>[] = [
  {
    value: "male",
    title: "Male",
    description: "Physiology-based estimates",
    icon: "male",
  },
  {
    value: "female",
    title: "Female",
    description: "Physiology-based estimates",
    icon: "female",
  },
];

export const ACTIVITY_OPTIONS: ChoiceOption<ActivityLevel>[] = [
  {
    value: "sedentary",
    title: "Mostly sitting",
    description: "Office, IT, student",
    icon: "chair",
  },
  {
    value: "light",
    title: "On my feet a lot",
    description: "Shop, teacher, sales",
    icon: "footsteps",
  },
  {
    value: "active",
    title: "Physical work",
    description: "Labour, delivery, farm",
    icon: "activity",
  },
];

export const GOAL_OPTIONS: (ChoiceOption<Goal> & { accent: string })[] = [
  {
    value: "loss",
    title: "Weight loss",
    description: "Lose fat, keep your energy",
    icon: "trending-down",
    accent: "Gentle deficit",
  },
  {
    value: "maintain",
    title: "Maintenance",
    description: "Stay consistent, feel great",
    icon: "scale",
    accent: "Balanced",
  },
  {
    value: "muscle",
    title: "Muscle gain",
    description: "Build lean strength",
    icon: "dumbbell",
    accent: "Lean surplus",
  },
  {
    value: "gain",
    title: "Weight gain",
    description: "Add healthy size",
    icon: "trending-up",
    accent: "Calorie surplus",
  },
];

export const FOOD_PREFERENCE_OPTIONS: ChoiceOption<FoodPreference>[] = [
  {
    value: "veg",
    title: "Pure veg",
    description: "Plants, dairy & grains",
    icon: "leaf",
  },
  {
    value: "egg",
    title: "Veg + egg",
    description: "Vegetarian, plus eggs",
    icon: "egg",
  },
  {
    value: "non-veg",
    title: "Non-veg",
    description: "Chicken, fish, eggs & more",
    icon: "drumstick",
  },
];

export const MEALS_OPTIONS: ChoiceOption<MealsPerDay>[] = [
  {
    value: 1,
    title: "1 meal",
    description: "One big, satisfying plate",
    icon: "one",
  },
  {
    value: 2,
    title: "2 meals",
    description: "A lighter eating window",
    icon: "two",
  },
  {
    value: 3,
    title: "3 meals",
    description: "The classic rhythm",
    icon: "three",
  },
];

export const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: "Mostly sitting",
  light: "On my feet a lot",
  active: "Physical work",
};

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  active: 1.55,
};

export const GOAL_LABELS: Record<Goal, string> = {
  loss: "Weight loss",
  maintain: "Maintenance",
  muscle: "Muscle gain",
  gain: "Weight gain",
};

export const MEALS_PER_DAY_LABELS: Record<MealsPerDay, string> = {
  1: "1 meal a day",
  2: "2 meals a day",
  3: "3 meals a day",
};
