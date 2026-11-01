"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getFood } from "@/data/foods";
import { calculateNutrition } from "@/lib/nutrition";
import {
  generateMealPlan,
  nextMealOption,
  planMealList,
  planTotals,
  type ResolvedPlanMeal,
} from "@/lib/meal-plan";
import {
  clearUserState,
  EMPTY_USER_STATE,
  loadUserState,
  saveUserState,
} from "@/lib/storage";
import type {
  MealType,
  NutritionResult,
  PlanMeal,
  UserProfile,
  UserState,
} from "@/lib/types";
import { clamp, dateKey, todayPlanIndex } from "@/lib/utils";

interface UserContextValue {
  state: UserState;
  hydrated: boolean;
  profile: UserProfile | null;
  nutrition: NutritionResult | null;
  todayKey: string;
  todayIndex: number;
  todayMeals: ResolvedPlanMeal[];
  todayExtras: ResolvedPlanMeal[];
  todayAllMeals: ResolvedPlanMeal[];
  consumedMeals: ResolvedPlanMeal[];
  consumed: { calories: number; protein: number; carbs: number; fat: number };
  waterMl: number;
  completedMealIds: string[];
  setVerifiedPhone: (phone: string) => void;
  completeOnboarding: (profile: UserProfile) => void;
  toggleMealComplete: (uid: string) => void;
  addWater: (deltaMl: number) => void;
  setWater: (ml: number) => void;
  addExtraMeal: (foodId: string) => "added" | "duplicate";
  removeExtraMeal: (uid: string) => void;
  replacePlanMeal: (dayIndex: number, slot: MealType) => boolean;
  resetAll: () => void;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<UserState>(EMPTY_USER_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [today, setToday] = useState({ key: "", index: 0 });

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setToday((prev) => {
        const key = dateKey(now);
        const index = todayPlanIndex(now);
        if (prev.key === key && prev.index === index) return prev;
        return { key, index };
      });
    };
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const stored = loadUserState();
    if (stored) setState(stored);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveUserState(state);
  }, [state, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    setState((prev) =>
      prev.profile && !prev.plan
        ? { ...prev, plan: generateMealPlan(prev.profile) }
        : prev,
    );
  }, [hydrated]);

  const profile = state.profile;
  const nutrition = useMemo(
    () => (profile ? calculateNutrition(profile) : null),
    [profile],
  );

  const todayKey = today.key;
  const todayIndex = today.index;
  const todayPlanMeals = useMemo(
    () => (state.plan ? planMealList(state.plan.days[todayIndex]) : []),
    [state.plan, todayIndex],
  );
  const todayExtras = useMemo(() => {
    const extras = state.extras[todayKey] ?? [];
    return extras.flatMap((meal) => {
      const food = getFood(meal.foodId);
      return food ? [{ meal, food }] : [];
    });
  }, [state.extras, todayKey]);

  const todayAllMeals = useMemo(
    () => [...todayPlanMeals, ...todayExtras],
    [todayPlanMeals, todayExtras],
  );

  const completedMealIds = state.completedMealIds;

  const consumedMeals = useMemo(
    () =>
      todayAllMeals.filter(({ meal }) => completedMealIds.includes(meal.uid)),
    [todayAllMeals, completedMealIds],
  );

  const consumed = useMemo(() => {
    const totals = planTotals(consumedMeals);
    return {
      calories: totals.calories,
      protein: totals.protein,
      carbs: totals.carbs,
      fat: totals.fat,
    };
  }, [consumedMeals]);

  const setVerifiedPhone = useCallback((phone: string) => {
    setState((prev) => ({ ...prev, phone }));
  }, []);

  const completeOnboarding = useCallback((nextProfile: UserProfile) => {
    setState((prev) => ({
      ...prev,
      profile: nextProfile,
      plan: generateMealPlan(nextProfile),
      completedMealIds: [],
    }));
  }, []);

  const toggleMealComplete = useCallback((uid: string) => {
    setState((prev) => ({
      ...prev,
      completedMealIds: prev.completedMealIds.includes(uid)
        ? prev.completedMealIds.filter((id) => id !== uid)
        : [...prev.completedMealIds, uid],
    }));
  }, []);

  const setWater = useCallback((ml: number) => {
    const key = dateKey();
    setState((prev) => ({
      ...prev,
      logs: {
        ...prev.logs,
        [key]: { waterMl: clamp(Math.round(ml), 0, 6000) },
      },
    }));
  }, []);

  const addWater = useCallback((deltaMl: number) => {
    const key = dateKey();
    setState((prev) => {
      const current = prev.logs[key]?.waterMl ?? 0;
      return {
        ...prev,
        logs: {
          ...prev.logs,
          [key]: { waterMl: clamp(current + deltaMl, 0, 6000) },
        },
      };
    });
  }, []);

  const addExtraMeal = useCallback(
    (foodId: string): "added" | "duplicate" => {
      const key = dateKey();
      const existing = state.extras[key] ?? [];
      if (existing.some((meal) => meal.foodId === foodId)) return "duplicate";
      const extra: PlanMeal = {
        uid: `extra-${key}-${foodId}-${Date.now()}`,
        foodId,
        slot: getFood(foodId)?.mealType ?? "snack",
      };
      setState((prev) => ({
        ...prev,
        extras: {
          ...prev.extras,
          [key]: [...(prev.extras[key] ?? []), extra],
        },
      }));
      return "added";
    },
    [state.extras],
  );

  const removeExtraMeal = useCallback((uid: string) => {
    const key = dateKey();
    setState((prev) => ({
      ...prev,
      extras: {
        ...prev.extras,
        [key]: (prev.extras[key] ?? []).filter((meal) => meal.uid !== uid),
      },
      completedMealIds: prev.completedMealIds.filter((id) => id !== uid),
    }));
  }, []);

  const replacePlanMeal = useCallback(
    (dayIndex: number, slot: MealType): boolean => {
      if (!profile) return false;
      const day = state.plan?.days[dayIndex];
      if (!day) return false;
      const current = day[slot];
      const next = nextMealOption(slot, profile, current?.foodId);
      if (!next || next.id === current?.foodId) return false;
      const nextMeal: PlanMeal = {
        uid: `plan-${dayIndex}-${slot}-${next.id}`,
        foodId: next.id,
        slot,
      };
      setState((prev) => {
        if (!prev.plan) return prev;
        const days = prev.plan.days.map((item, index) =>
          index === dayIndex ? { ...item, [slot]: nextMeal } : item,
        );
        return {
          ...prev,
          plan: { ...prev.plan, days },
          completedMealIds: prev.completedMealIds.filter(
            (id) => id !== current?.uid,
          ),
        };
      });
      return true;
    },
    [profile, state.plan],
  );

  const resetAll = useCallback(() => {
    clearUserState();
    setState(EMPTY_USER_STATE);
  }, []);

  const value = useMemo<UserContextValue>(
    () => ({
      state,
      hydrated,
      profile,
      nutrition,
      todayKey,
      todayIndex,
      todayMeals: todayPlanMeals,
      todayExtras,
      todayAllMeals,
      consumedMeals,
      consumed,
      waterMl: state.logs[todayKey]?.waterMl ?? 0,
      completedMealIds,
      setVerifiedPhone,
      completeOnboarding,
      toggleMealComplete,
      addWater,
      setWater,
      addExtraMeal,
      removeExtraMeal,
      replacePlanMeal,
      resetAll,
    }),
    [
      state,
      hydrated,
      profile,
      nutrition,
      todayKey,
      todayIndex,
      todayPlanMeals,
      todayExtras,
      todayAllMeals,
      consumedMeals,
      consumed,
      completedMealIds,
      setVerifiedPhone,
      completeOnboarding,
      toggleMealComplete,
      addWater,
      setWater,
      addExtraMeal,
      removeExtraMeal,
      replacePlanMeal,
      resetAll,
    ],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used inside a UserProvider");
  }
  return context;
}
