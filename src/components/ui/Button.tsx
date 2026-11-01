"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Loader2, type LucideIcon } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "lime" | "white" | "ghost" | "dark";
type Size = "sm" | "md" | "lg";

export interface ButtonProps
  extends Omit<
    ComponentPropsWithoutRef<"button">,
    | "onDrag"
    | "onDragStart"
    | "onDragEnd"
    | "onAnimationStart"
    | "onAnimationEnd"
    | "onAnimationIteration"
  > {
  variant?: Variant;
  size?: Size;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  loading?: boolean;
  fullWidth?: boolean;
  rounded?: "full" | "card";
}

const variants: Record<Variant, string> = {
  primary:
    "bg-forest text-cream shadow-[0_18px_36px_-22px_rgba(23,77,54,0.95)] hover:bg-forest-deep",
  lime: "bg-lime text-forest-deep shadow-[0_18px_36px_-20px_rgba(150,199,74,0.9)] hover:bg-[#d2f28a]",
  white:
    "bg-white text-forest border border-line hover:border-fresh/60 hover:bg-white shadow-card",
  ghost: "text-forest hover:bg-forest-soft/80",
  dark: "bg-forest-deep text-cream hover:bg-[#0a2a1c]",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-[0.8rem] gap-2",
  md: "h-12 px-5 text-[0.88rem] gap-2.5",
  lg: "h-14 px-7 text-[0.95rem] gap-3",
};

export function Button({
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "right",
  loading = false,
  fullWidth = false,
  rounded = "full",
  className,
  children,
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.button
      type={type}
      whileTap={reduceMotion ? undefined : { scale: 0.975 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      disabled={disabled || loading}
      className={cn(
        "group relative inline-flex select-none items-center justify-center overflow-hidden font-semibold tracking-[-0.01em] transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-55",
        rounded === "full" ? "rounded-full" : "rounded-2xl",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
        <span className="absolute -left-1/3 top-0 h-full w-1/3 -translate-x-[220%] bg-white/20 blur-lg transition-transform duration-700 ease-out group-hover:translate-x-[460%]" />
      </span>
      {loading ? (
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      ) : Icon && iconPosition === "left" ? (
        <Icon className="size-[1.05em] shrink-0" strokeWidth={2.1} />
      ) : null}
      <span className="relative">{children}</span>
      {!loading && Icon && iconPosition === "right" ? (
        <Icon
          className="size-[1.05em] shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
          strokeWidth={2.1}
        />
      ) : null}
    </motion.button>
  );
}
