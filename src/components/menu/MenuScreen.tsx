"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpDown,
  Check,
  ChevronDown,
  Coffee,
  Cookie,
  Dumbbell,
  Flame,
  Leaf,
  Moon,
  Salad,
  Search,
  Sparkles,
  Sun,
  TrendingDown,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/components/feedback/ToastProvider";
import { FoodCard } from "@/components/menu/FoodCard";
import { MenuSkeleton } from "@/components/menu/MenuSkeleton";
import { PageTransition } from "@/components/motion/PageTransition";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Card";
import { useUser } from "@/context/UserContext";
import { DIET_LABELS, FOODS, isFoodCompatible } from "@/data/foods";
import { useFirstLoad } from "@/hooks/useFirstLoad";
import type { Food } from "@/lib/types";
import { cn } from "@/lib/utils";

type CategoryId =
  | "all"
  | "breakfast"
  | "lunch"
  | "dinner"
  | "snack"
  | "high-protein"
  | "weight-loss"
  | "muscle-gain";

const CATEGORIES: { id: CategoryId; label: string; icon: typeof Salad }[] = [
  { id: "all", label: "All", icon: Sparkles },
  { id: "breakfast", label: "Breakfast", icon: Coffee },
  { id: "lunch", label: "Lunch", icon: Sun },
  { id: "dinner", label: "Dinner", icon: Moon },
  { id: "high-protein", label: "High Protein", icon: Dumbbell },
  { id: "weight-loss", label: "Weight Loss", icon: TrendingDown },
  { id: "muscle-gain", label: "Muscle Gain", icon: Zap },
  { id: "snack", label: "Snacks", icon: Cookie },
];

type SortId = "recommended" | "protein" | "calories" | "price";

const SORT_OPTIONS: { id: SortId; label: string }[] = [
  { id: "recommended", label: "Recommended" },
  { id: "protein", label: "Highest protein" },
  { id: "calories", label: "Lowest calories" },
  { id: "price", label: "Price: low to high" },
];

function matchesCategory(food: Food, category: CategoryId) {
  if (category === "all") return true;
  if (
    category === "breakfast" ||
    category === "lunch" ||
    category === "dinner" ||
    category === "snack"
  ) {
    return food.mealType === category;
  }
  return food.tags.includes(category);
}

export function MenuScreen() {
  const { profile, state, addExtraMeal, removeExtraMeal, todayKey } = useUser();
  const { toast } = useToast();
  const reduceMotion = useReducedMotion();
  const loading = useFirstLoad("menu");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryId>("all");
  const [sort, setSort] = useState<SortId>("recommended");
  const [sortOpen, setSortOpen] = useState(false);

  useEffect(() => {
    const close = () => setSortOpen(false);
    if (!sortOpen) return;
    window.addEventListener("scroll", close, { passive: true });
    return () => window.removeEventListener("scroll", close);
  }, [sortOpen]);

  const compatibleFoods = useMemo(
    () =>
      FOODS.filter((food) =>
        isFoodCompatible(food, profile?.foodPreference ?? "non-veg"),
      ),
    [profile?.foodPreference],
  );

  const leftovers = useMemo(
    () =>
      state.extras[todayKey]?.map((meal) => ({
        uid: meal.uid,
        foodId: meal.foodId,
      })) ?? [],
    [state.extras, todayKey],
  );

  const addedIds = useMemo(
    () => new Set(leftovers.map((item) => item.foodId)),
    [leftovers],
  );

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    let list = compatibleFoods.filter((food) => {
      if (!matchesCategory(food, category)) return false;
      if (!term) return true;
      return (
        food.name.toLowerCase().includes(term) ||
        food.description.toLowerCase().includes(term) ||
        food.tags.some((tag) => tag.includes(term))
      );
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case "protein":
          return b.protein - a.protein;
        case "calories":
          return a.calories - b.calories;
        case "price":
          return a.price - b.price;
        default:
          return b.rating - a.rating;
      }
    });

    return list;
  }, [compatibleFoods, category, query, sort]);

  if (!profile) return null;

  function handleAdd(food: Food) {
    const existing = leftovers.find((item) => item.foodId === food.id);
    if (existing) {
      removeExtraMeal(existing.uid);
      toast({
        title: `${food.name} removed`,
        description: "Taken out of today's plate.",
        tone: "info",
      });
      return;
    }
    const result = addExtraMeal(food.id);
    if (result === "added") {
      toast({
        title: `${food.name} added`,
        description: "Added to today's plate on Home.",
      });
    } else {
      toast({
        title: "Already on today's plate",
        description: "You'll find it on your dashboard.",
        tone: "info",
      });
    }
  }

  function resetFilters() {
    setQuery("");
    setCategory("all");
    setSort("recommended");
  }

  const activeSortLabel =
    SORT_OPTIONS.find((option) => option.id === sort)?.label ?? "Recommended";

  if (loading) {
    return (
      <div className="pt-2">
        <MenuSkeleton />
      </div>
    );
  }

  return (
    <PageTransition className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-4 pt-1">
        <div>
          <span className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-fresh">
            The menu
          </span>
          <h1 className="mt-1.5 font-display text-[1.95rem] font-extrabold leading-[1.05] tracking-[-0.05em] text-charcoal sm:text-[2.35rem]">
            Good food, made for{" "}
            <span className="relative inline-block text-forest">
              your goals
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
            Chef-crafted, macro-counted meals that fit the way you eat. Add
            anything straight to today&apos;s plate.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Pill tone="fresh" icon={Leaf}>
            {DIET_LABELS[profile.foodPreference]} kitchen
          </Pill>
          <Pill tone="sand" icon={Flame}>
            {profile.mealsPerDay} meals / day
          </Pill>
        </div>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="group relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted/60" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search dishes, ingredients or goals…"
            aria-label="Search the menu"
            className="h-[52px] w-full rounded-full border border-line bg-white/85 pl-11 pr-11 text-[0.85rem] font-medium text-charcoal outline-none transition-all duration-200 placeholder:font-normal placeholder:text-muted/55 focus:border-fresh focus:bg-white focus:shadow-[0_0_0_4px_rgba(104,185,132,0.12)]"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full bg-cream text-muted transition hover:bg-forest-soft hover:text-forest"
            >
              <X className="size-3.5" />
            </button>
          ) : null}
        </div>

        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setSortOpen((open) => !open)}
            aria-haspopup="listbox"
            aria-expanded={sortOpen}
            className="flex h-[52px] w-full items-center justify-between gap-2 rounded-full border border-line bg-white/85 px-4 text-[0.8rem] font-semibold text-charcoal transition hover:border-fresh/60 sm:w-[200px]"
          >
            <span className="flex items-center gap-2">
              <ArrowUpDown className="size-3.5 text-fresh" />
              <span className="truncate">{activeSortLabel}</span>
            </span>
            <ChevronDown
              className={cn(
                "size-3.5 shrink-0 text-muted transition-transform",
                sortOpen && "rotate-180",
              )}
            />
          </button>

          <AnimatePresence>
            {sortOpen ? (
              <>
                <button
                  type="button"
                  aria-label="Close sorting menu"
                  className="fixed inset-0 z-20 cursor-default"
                  onClick={() => setSortOpen(false)}
                />
                <motion.div
                  role="listbox"
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-[60px] z-30 w-full min-w-[210px] overflow-hidden rounded-2xl border border-line bg-white p-1.5 shadow-float sm:w-[220px]"
                >
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      role="option"
                      aria-selected={sort === option.id}
                      onClick={() => {
                        setSort(option.id);
                        setSortOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-[0.76rem] font-medium transition",
                        sort === option.id
                          ? "bg-forest-soft text-forest"
                          : "text-charcoal hover:bg-cream",
                      )}
                    >
                      {option.label}
                      {sort === option.id ? (
                        <Check className="size-3.5 text-forest" strokeWidth={3} />
                      ) : null}
                    </button>
                  ))}
                </motion.div>
              </>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      <div className="no-scrollbar -mx-4 flex items-center gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        {CATEGORIES.map((item) => {
          const Icon = item.icon;
          const active = category === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setCategory(item.id)}
              aria-pressed={active}
              className={cn(
                "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-[0.7rem] font-semibold transition-all duration-200",
                active
                  ? "border-forest bg-forest text-cream shadow-[0_8px_20px_-12px_rgba(23,77,54,0.8)]"
                  : "border-line bg-white/70 text-muted hover:border-fresh/50 hover:bg-white hover:text-forest",
              )}
            >
              <Icon
                className={cn("size-3.5", active ? "text-lime" : "text-fresh")}
              />
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[0.7rem] font-medium text-muted" aria-live="polite">
          <strong className="font-bold text-charcoal">{results.length}</strong>{" "}
          {results.length === 1 ? "dish" : "dishes"}
          {category !== "all" ? (
            <>
              {" "}
              in{" "}
              <span className="font-semibold text-forest">
                {CATEGORIES.find((item) => item.id === category)?.label}
              </span>
            </>
          ) : null}
          {query ? (
            <>
              {" "}
              for <span className="font-semibold text-forest">“{query}”</span>
            </>
          ) : null}
        </p>
        <p className="inline-flex items-center gap-1.5 text-[0.62rem] text-muted/75">
          <Leaf className="size-3 text-fresh" />
          Filtered to your {DIET_LABELS[profile.foodPreference].toLowerCase()}{" "}
          preference
        </p>
      </div>

      {results.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[28px] border border-dashed border-forest/15 bg-white/50 px-6 py-16 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-cream-deep text-forest">
            <Salad className="size-6" />
          </span>
          <h2 className="mt-4 font-display text-[1.15rem] font-bold tracking-[-0.03em] text-charcoal">
            No dishes match that yet
          </h2>
          <p className="mt-1.5 max-w-[320px] text-[0.78rem] leading-relaxed text-muted">
            Try a different ingredient or clear the filters to see the full
            goal-friendly menu.
          </p>
          <Button
            variant="primary"
            size="sm"
            className="mt-5"
            onClick={resetFilters}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 gap-3 pb-2 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {results.map((food) => {
              const added = addedIds.has(food.id);
              return (
                <motion.div
                  key={food.id}
                  layout
                  initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? {} : { opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <FoodCard
                    food={food}
                    added={added}
                    onAdd={() => handleAdd(food)}
                    onRemove={() => handleAdd(food)}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      <p className="pt-1 text-center text-[0.6rem] text-muted/60">
        All prices include taxes. Nutritional values are per serving and may
        vary slightly with seasonal produce.
      </p>
    </PageTransition>
  );
}
