"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useId, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ProgressRing({
  value,
  size = 168,
  stroke = 12,
  className,
  trackClassName,
  from = "#68B984",
  to = "#C5ED79",
  children,
  delay = 0.25,
}: {
  /** 0 – 100 */
  value: number;
  size?: number;
  stroke?: number;
  className?: string;
  trackClassName?: string;
  from?: string;
  to?: string;
  children?: ReactNode;
  delay?: number;
}) {
  const reactId = useId();
  const gradientId = `ring-${reactId.replace(/:/g, "")}`;
  const reduceMotion = useReducedMotion();
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const safeValue = Math.min(100, Math.max(0, value));
  const offset = circumference * (1 - safeValue / 100);

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(23,77,54,0.08)"
          strokeWidth={stroke}
          className={trackClassName}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: reduceMotion ? offset : circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{
            duration: reduceMotion ? 0 : 1.4,
            ease: [0.22, 1, 0.36, 1],
            delay: reduceMotion ? 0 : delay,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  );
}

export function ProgressBar({
  value,
  className,
  barClassName,
  delay = 0.15,
}: {
  value: number;
  className?: string;
  barClassName?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();
  const safe = Math.min(100, Math.max(0, value));
  return (
    <div
      className={cn("h-2 overflow-hidden rounded-full bg-forest/8", className)}
      role="progressbar"
      aria-valuenow={Math.round(safe)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className={cn("h-full rounded-full bg-fresh", barClassName)}
        initial={{ width: reduceMotion ? `${safe}%` : 0 }}
        animate={{ width: `${safe}%` }}
        transition={{
          duration: reduceMotion ? 0 : 1,
          ease: [0.22, 1, 0.36, 1],
          delay: reduceMotion ? 0 : delay,
        }}
      />
    </div>
  );
}
