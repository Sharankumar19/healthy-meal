import { foodsFor, getFood, SLOT_LABELS } from "@/data/foods";
import type {
  Food,
  FoodTag,
  Goal,
  MealPlan,
  MealType,
  PlanDay,
  PlanMeal,
  UserProfile,
} from "@/lib/types";

const GOAL_TAG: Record<Goal, FoodTag> = {
  loss: "weight-loss",
  maintain: "balanced",
  muscle: "muscle-gain",
  gain: "muscle-gain",
};

const SLOT_ROTATION: Record<MealType, number> = {
  breakfast: 0,
  lunch: 2,
  dinner: 1,
  snack: 3,
};

export function includedSlots(mealsPerDay: 1 | 2 | 3): MealType[] {
  if (mealsPerDay === 1) return ["lunch", "snack"];
  if (mealsPerDay === 2) return ["breakfast", "dinner", "snack"];
  return ["breakfast", "lunch", "dinner", "snack"];
}

export function rankedFoods(
  slot: MealType,
  profile: UserProfile,
): Food[] {
  const matchesGoal = GOAL_TAG[profile.goal];
  return foodsFor(slot, profile.foodPreference).sort((a, b) => {
    const aGoal = a.tags.includes(matchesGoal) ? 1 : 0;
    const bGoal = b.tags.includes(matchesGoal) ? 1 : 0;
    if (aGoal !== bGoal) return bGoal - aGoal;
    return b.rating - a.rating;
  });
}

function emptyDay(): PlanDay {
  return { breakfast: null, lunch: null, dinner: null, snack: null };
}

function makeMeal(day: number, slot: MealType, food: Food): PlanMeal {
  return {
    uid: `plan-${day}-${slot}-${food.id}`,
    foodId: food.id,
    slot,
  };
}

export function generateMealPlan(profile: UserProfile): MealPlan {
  const slots = includedSlots(profile.mealsPerDay);
  const days: PlanDay[] = [];

  for (let day = 0; day < 7; day += 1) {
    const planDay = emptyDay();
    for (const slot of slots) {
      const options = rankedFoods(slot, profile);
      if (options.length === 0) continue;
      const food = options[(day + SLOT_ROTATION[slot]) % options.length];
      planDay[slot] = makeMeal(day, slot, food);
    }
    days.push(planDay);
  }

  return { days, generatedAt: new Date().toISOString() };
}

export function nextMealOption(
  slot: MealType,
  profile: UserProfile,
  currentFoodId?: string,
): Food | null {
  const options = rankedFoods(slot, profile);
  if (options.length <= 1) return options[0] ?? null;
  const currentIndex = options.findIndex((food) => food.id === currentFoodId);
  const next = options[(currentIndex + 1 + options.length) % options.length];
  return next ?? options[0];
}

export function planDayCalories(day: PlanDay | undefined) {
  if (!day) return 0;
  return planMealList(day).reduce((sum, meal) => sum + meal.food.calories, 0);
}

export interface ResolvedPlanMeal {
  meal: PlanMeal;
  food: Food;
}

export function planMealList(day: PlanDay): ResolvedPlanMeal[] {
  const meals: ResolvedPlanMeal[] = [];
  const slots: MealType[] = ["breakfast", "lunch", "dinner", "snack"];
  for (const slot of slots) {
    const meal = day[slot];
    if (!meal) continue;
    const food = getFood(meal.foodId);
    if (food) meals.push({ meal, food });
  }
  return meals;
}

export interface PlanTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  price: number;
}

export function planTotals(meals: ResolvedPlanMeal[]): PlanTotals {
  return meals.reduce(
    (totals, { food }) => ({
      calories: totals.calories + food.calories,
      protein: totals.protein + food.protein,
      carbs: totals.carbs + food.carbs,
      fat: totals.fat + food.fat,
      price: totals.price + food.price,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, price: 0 },
  );
}

export function slotLabel(slot: MealType) {
  return SLOT_LABELS[slot];
}
