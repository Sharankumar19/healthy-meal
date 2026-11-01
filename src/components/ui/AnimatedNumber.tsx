"use client";

import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export function AnimatedNumber({
  value,
  decimals = 0,
  duration = 1.25,
  prefix = "",
  suffix = "",
  className,
  startOnView = true,
}: {
  value: number;
  decimals?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  startOnView?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-24px" });
  const reduceMotion = useReducedMotion();
  const motionValue = useMotionValue(reduceMotion ? value : 0);

  const formatter = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  const formatted = useTransform(motionValue, (latest) =>
    formatter.format(latest),
  );
  const finalLabel = `${prefix}${formatter.format(value)}${suffix}`;

  useEffect(() => {
    if (!inView && startOnView) return;
    if (reduceMotion) {
      motionValue.set(value);
      return;
    }
    const controls = animate(motionValue, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [value, inView, startOnView, reduceMotion, motionValue, duration]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)} aria-label={finalLabel}>
      <span aria-hidden="true">
        {prefix}
        <motion.span>{formatted}</motion.span>
        {suffix}
      </span>
    </span>
  );
}
