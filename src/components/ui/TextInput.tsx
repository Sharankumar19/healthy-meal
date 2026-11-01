"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  containerClassName?: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput(
    {
      label,
      hint,
      error,
      leading,
      trailing,
      className,
      containerClassName,
      id,
      ...props
    },
    ref,
  ) {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className={cn("w-full", containerClassName)}>
        {label ? (
          <label
            htmlFor={inputId}
            className="mb-2 block text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted"
          >
            {label}
          </label>
        ) : null}
        <div
          className={cn(
            "group flex h-[58px] items-center gap-3 rounded-2xl border bg-white/85 px-4 transition-all duration-200 focus-within:border-fresh focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(104,185,132,0.12)]",
            error ? "border-tomato/50" : "border-line",
            containerClassName,
          )}
        >
          {leading ? (
            <span className="shrink-0 text-muted">{leading}</span>
          ) : null}
          <input
            id={inputId}
            ref={ref}
            aria-invalid={Boolean(error)}
            aria-describedby={
              error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
            }
            className={cn(
              "h-full w-full min-w-0 bg-transparent text-[1.02rem] font-medium text-charcoal outline-none placeholder:font-normal placeholder:text-muted/60",
              className,
            )}
            {...props}
          />
          {trailing ? <span className="shrink-0">{trailing}</span> : null}
        </div>
        <AnimatePresence initial={false}>
          {error ? (
            <motion.p
              id={`${inputId}-error`}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="mt-1.5 pl-1 text-xs font-medium text-tomato"
              role="alert"
            >
              {error}
            </motion.p>
          ) : hint ? (
            <p id={`${inputId}-hint`} className="mt-1.5 pl-1 text-xs text-muted">
              {hint}
            </p>
          ) : null}
        </AnimatePresence>
      </div>
    );
  },
);
