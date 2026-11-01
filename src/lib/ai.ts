import { foodsFor, SLOT_LABELS } from "@/data/foods";
import type { Food, NutritionResult, UserProfile } from "@/lib/types";
import { formatWater } from "@/lib/nutrition";
import { delay } from "@/lib/utils";

/**
 * The demo assistant is deterministic, local, and rule-based.
 * Swap `getAssistantReply` for a streaming API call later — the chat UI only
 * depends on this signature.
 */
export interface AssistantContext {
  profile: UserProfile;
  nutrition: NutritionResult;
}

export interface AssistantReply {
  content: string;
}

function pickFoods(
  slot: "breakfast" | "lunch" | "dinner" | "snack",
  profile: UserProfile,
  count = 3,
): Food[] {
  return foodsFor(slot, profile.foodPreference)
    .slice()
    .sort((a, b) => b.protein - a.protein)
    .slice(0, count);
}

function foodLines(foods: Food[]) {
  return foods
    .map(
      (food) =>
        `• ${food.name} — ${food.protein}g protein, ${food.calories} kcal`,
    )
    .join("\n");
}

function proteinReply({ profile, nutrition }: AssistantContext) {
  return `Your plan sets protein at about ${nutrition.protein}g a day — around ${nutrition.proteinPerKg}g per kg of body weight. That's a solid target for ${profile.goal === "loss" ? "keeping muscle while losing fat" : profile.goal === "maintain" ? "maintaining your current shape" : "supporting muscle growth"}.

Easy ways to hit it:
• Spread it across ${profile.mealsPerDay} meal${profile.mealsPerDay > 1 ? "s" : ""} plus snacks
• Aim for a palm-sized protein portion at each meal
• Keep a quick option ready — Greek yogurt or a protein shake works

High-protein picks for you:
${foodLines(pickFoods("lunch", profile, 3))}`;
}

function breakfastReply({ profile }: AssistantContext) {
  const foods = pickFoods("breakfast", profile, 3);
  return `Here are a few high-protein breakfasts that fit your ${profile.foodPreference === "veg" ? "vegetarian" : profile.foodPreference === "egg" ? "veg + egg" : "non-veg"} preference:

${foodLines(foods)}

My pick: the ${foods[0]?.name ?? "protein breakfast"}, followed by a short walk. A breakfast with 20g+ protein tends to keep you full well past mid-morning.`;
}

function postWorkoutReply({ profile, nutrition }: AssistantContext) {
  return `After training, aim for a mix of protein and carbs within a couple of hours — you don't need to sprint for a shake.

A practical target: ${Math.round(nutrition.protein * 0.3)}–${Math.round(nutrition.protein * 0.4)}g protein and 30–50g carbs.

Good options from your plan:
${foodLines([
  ...pickFoods("lunch", profile, 2),
  ...pickFoods("snack", profile, 1),
])}

If you train in the evening, make dinner your recovery meal. Hydrate too — you're targeting ${formatWater(nutrition.waterMl)} a day.`;
}

function weightLossReply({ profile, nutrition }: AssistantContext) {
  const deficit = Math.abs(nutrition.goalAdjustment);
  return `Your target is ${nutrition.calorieTarget.toLocaleString("en-IN")} kcal a day${
    deficit ? ` — about ${deficit} kcal under maintenance` : ""
  }. That's deliberately moderate: it's easier to stick to and helps protect muscle.

What matters most:
• Hit your protein (${nutrition.protein}g) — it keeps you full
• Fill half the plate with vegetables at lunch and dinner
• Walk 7–8k steps most days
• Sleep 7–8 hours; poor sleep makes cravings louder

For your ${profile.mealsPerDay}-meal rhythm, keep each plate simple: protein + fibre + a measured carb portion. Slow progress is still progress — aim for 0.3–0.5 kg a week, not more.`;
}

function vegPlanReply({ profile, nutrition }: AssistantContext) {
  const meals = ["breakfast", "lunch", "dinner"].map((slot) => {
    const food = pickFoods(slot as "breakfast", profile, 1)[0];
    return food ? `${SLOT_LABELS[slot as "breakfast"]}: ${food.name}` : null;
  }).filter(Boolean);

  return `Here's a simple vegetarian day built around your ${nutrition.calorieTarget.toLocaleString("en-IN")} kcal target:

${meals.join("\n")}
Snack: ${pickFoods("snack", profile, 1)[0]?.name ?? "Greek yogurt with fruit"}

That lands near ${Math.round(nutrition.protein * 0.75)}g protein before snacks. To close the gap, add paneer, tofu, dal, chickpeas or a yogurt bowl. Vegetarian plans need a little more intention around protein — but they work beautifully when you plan for it.`;
}

function waterReply({ nutrition }: AssistantContext) {
  return `A sensible daily target for you is ${formatWater(nutrition.waterMl)}.

A rhythm that works:
• 1 glass on waking
• 2 glasses with each main meal
• 500ml around training
• Stop heavy drinking an hour before bed

Thirst, dark urine and afternoon headaches are simple signals you're behind. Tea and coffee count toward fluids, but water should be the default.`;
}

function caloriesReply({ profile, nutrition }: AssistantContext) {
  return `Your numbers at a glance:

• BMR: ${nutrition.bmr.toLocaleString("en-IN")} kcal — what you'd burn at complete rest
• TDEE: ${nutrition.tdee.toLocaleString("en-IN")} kcal — with your "${profile.activity === "sedentary" ? "mostly sitting" : profile.activity === "light" ? "on my feet" : "physical work"}" lifestyle
• Daily target: ${nutrition.calorieTarget.toLocaleString("en-IN")} kcal
• Macros: ${nutrition.protein}g protein · ${nutrition.carbs}g carbs · ${nutrition.fat}g fat

Think of these as a starting point. Track loosely for two weeks, then adjust based on energy, training and the scale trend.`;
}

function supplementsReply() {
  return `Food first — supplements are there to fill gaps, not replace meals.

Worth considering:
• Vitamin D if you're mostly indoors
• Vitamin B12, especially on a vegetarian diet
• Omega-3 if you rarely eat fish
• Whey or plant protein only if you struggle to hit your protein target

Please check with a doctor before starting anything, especially if you're under 18, pregnant or on medication.`;
}

function tiredReply({ nutrition }: AssistantContext) {
  return `Low energy usually comes down to a few usual suspects: under-eating, low iron, poor sleep or dehydration.

Quick audit:
• Are you eating close to ${nutrition.calorieTarget.toLocaleString("en-IN")} kcal? Big accidental deficits are common.
• Are you getting ${nutrition.protein}g protein and enough carbs around training?
• Are you hitting ${formatWater(nutrition.waterMl)} water?
• How consistent is your sleep?

If fatigue persists for more than two weeks, please see a doctor — this demo can't replace a proper check-up.`;
}

export async function getAssistantReply(
  message: string,
  context: AssistantContext,
): Promise<AssistantReply> {
  await delay(900 + Math.random() * 700);
  const text = message.toLowerCase();
  const { profile } = context;

  if (/(protein)/.test(text)) return { content: proteinReply(context) };
  if (/(breakfast|morning)/.test(text)) return { content: breakfastReply(context) };
  if (/(after (a )?workout|post[- ]?workout|recovery)/.test(text))
    return { content: postWorkoutReply(context) };
  if (/(lose|loss|fat|weight down|slim)/.test(text))
    return { content: weightLossReply(context) };
  if (/(veg|vegetarian|plant)/.test(text))
    return { content: vegPlanReply(context) };
  if (/(water|hydrat)/.test(text))
    return { content: waterReply(context) };
  if (/(calorie|kcal|tdee|bmr|macro)/.test(text))
    return { content: caloriesReply(context) };
  if (/(supplement|vitamin|creatine|whey)/.test(text))
    return { content: supplementsReply() };
  if (/(tired|energy|fatigue|sleep)/.test(text))
    return { content: tiredReply(context) };
  if (/(hi|hello|hey)\b/.test(text)) {
    return {
      content: `Hi ${profile.name.split(" ")[0]}! Ask me about protein, meal ideas, hydration, post-workout food or your calorie target. I'll keep everything aligned with your ${profile.goal === "loss" ? "fat-loss" : profile.goal === "maintain" ? "maintenance" : "muscle-building"} plan.`,
    };
  }

  return {
    content: `I can help with nutrition, food choices, protein, hydration and your goals. Try asking:

• "How much protein do I need?"
• "Suggest a high-protein breakfast"
• "What should I eat after a workout?"
• "Create a vegetarian meal plan"

Based on your profile, your daily target is ${context.nutrition.calorieTarget.toLocaleString("en-IN")} kcal with ${context.nutrition.protein}g protein.`,
  };
}

export const SUGGESTED_PROMPTS = [
  "How much protein do I need?",
  "Suggest a high-protein breakfast",
  "What should I eat after a workout?",
  "Help me lose weight",
  "Create a vegetarian meal plan",
] as const;
