import type { UserState } from "@/lib/types";

export const USER_STATE_KEY = "healthy-meal:user:v1";

export const EMPTY_USER_STATE: UserState = {
  phone: null,
  profile: null,
  plan: null,
  logs: {},
  extras: {},
  completedMealIds: [],
  savedFoodIds: [],
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/**
 * Persistence is intentionally isolated here so it can be swapped for a
 * backend session (cookies / API) without touching UI components.
 */
export function loadUserState(): UserState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(USER_STATE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isObject(parsed)) return null;
    return {
      ...EMPTY_USER_STATE,
      ...(parsed as Partial<UserState>),
      logs: isObject(parsed.logs)
        ? (parsed.logs as UserState["logs"])
        : {},
      extras: isObject(parsed.extras)
        ? (parsed.extras as UserState["extras"])
        : {},
      savedFoodIds: Array.isArray(parsed.savedFoodIds)
        ? (parsed.savedFoodIds as string[])
        : [],
      completedMealIds: Array.isArray(parsed.completedMealIds)
        ? (parsed.completedMealIds as string[])
        : [],
    };
  } catch {
    return null;
  }
}

export function saveUserState(state: UserState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(USER_STATE_KEY, JSON.stringify(state));
  } catch {
    // Storage might be full or blocked (private mode) — failing silently is fine.
  }
}

export function clearUserState() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(USER_STATE_KEY);
  } catch {
    // noop
  }
}
