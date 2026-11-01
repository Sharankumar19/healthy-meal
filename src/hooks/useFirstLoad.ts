"use client";

import { useEffect, useState } from "react";

/**
 * Shows skeletons on the first visit of a screen in a session, so repeat
 * navigation feels instant while the initial load still gets a premium
 * skeleton state.
 */
export function useFirstLoad(key: string, delayMs = 520) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storageKey = `healthy-meal:seen:${key}`;
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(storageKey) === "1";
    } catch {
      seen = false;
    }

    if (seen) {
      setLoading(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setLoading(false);
      try {
        window.sessionStorage.setItem(storageKey, "1");
      } catch {
        // noop
      }
    }, delayMs);

    return () => window.clearTimeout(timer);
  }, [key, delayMs]);

  return loading;
}
