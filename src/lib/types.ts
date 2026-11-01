export type Gender = "male" | "female";

export type ActivityLevel = "sedentary" | "light" | "active";

export type Goal = "loss" | "maintain" | "muscle" | "gain";

export type FoodPreference = "veg" | "egg" | "non-veg";

export type MealsPerDay = 1 | 2 | 3;

export type HeightUnit = "cm" | "ft";

export type WeightUnit = "kg" | "lb";

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export type Diet = "veg" | "egg" | "non-veg";

export type FoodTag =
  | "high-protein"
  | "weight-loss"
  | "muscle-gain"
  | "low-calorie"
  | "balanced"
  | "quick";

export interface UserProfile {
  name: string;
  gender: Gender;
  age: number;
  heightCm: number;
  weightKg: number;
  activity: ActivityLevel;
  goal: Goal;
  foodPreference: FoodPreference;
  mealsPerDay: MealsPerDay;
  createdAt: string;
}

export interface Food {
  id: string;
  name: string;
  description: string;
  image: string;
  mealType: MealType;
  diet: Diet;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  price: number;
  tags: FoodTag[];
  prepTime: number;
  rating: number;
}

export interface PlanMeal {
  uid: string;
  foodId: string;
  slot: MealType;
}

export interface PlanDay {
  breakfast: PlanMeal | null;
  lunch: PlanMeal | null;
  dinner: PlanMeal | null;
  snack: PlanMeal | null;
}

export interface MealPlan {
  days: PlanDay[];
  generatedAt: string;
}

export interface DayLog {
  waterMl: number;
}

export interface UserState {
  phone: string | null;
  profile: UserProfile | null;
  plan: MealPlan | null;
  logs: Record<string, DayLog>;
  extras: Record<string, PlanMeal[]>;
  completedMealIds: string[];
  savedFoodIds: string[];
}

export interface NutritionResult {
  bmi: number;
  bmiCategory: BmiCategory;
  bmiRange: { min: number; max: number };
  bmr: number;
  tdee: number;
  calorieTarget: number;
  goalAdjustment: number;
  protein: number;
  carbs: number;
  fat: number;
  waterMl: number;
  isMinor: boolean;
  proteinPerKg: number;
  healthyWeightKg: { min: number; max: number };
  goalCopy: {
    headline: string;
    description: string;
    badge: string;
  };
}

export type BmiCategory =
  | "underweight"
  | "healthy"
  | "overweight"
  | "obese";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
}
