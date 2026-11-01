"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { Logo, LogoMark } from "@/components/brand/Logo";

export function BootLoader({ onComplete }: { onComplete: () => void }) {
  const reduceMotion = useReducedMotion();
  const [progress, setProgress] = useState(8);

  useEffect(() => {
    if (reduceMotion) {
      setProgress(100);
      const instant = window.setTimeout(onComplete, 200);
      return () => window.clearTimeout(instant);
    }

    const start = window.setTimeout(() => setProgress(72), 120);
    const finish = window.setTimeout(() => setProgress(100), 850);
    const done = window.setTimeout(onComplete, 1350);
    return () => {
      window.clearTimeout(start);
      window.clearTimeout(finish);
      window.clearTimeout(done);
    };
  }, [onComplete, reduceMotion]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col overflow-hidden bg-forest text-cream"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
    >
      <div className="pointer-events-none absolute -left-32 -top-32 size-[520px] rounded-full bg-lime/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 size-[560px] rounded-full bg-fresh/15 blur-[130px]" />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.07]" />

      <div className="relative flex flex-1 flex-col items-center justify-center px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center"
        >
          <div className="relative">
            <span className="absolute inset-0 animate-pulse-ring rounded-[30px] border border-lime/40" />
            <div className="relative rounded-[30px] bg-cream p-2.5 shadow-float">
              <LogoMark size={74} className="rounded-[22px]" />
            </div>
          </div>
          <Logo
            theme="light"
            showWordmark={false}
            className="mt-7 h-0 overflow-hidden"
          />
          <p className="mt-6 font-display text-[1.6rem] font-extrabold tracking-[-0.045em]">
            healthy<span className="text-fresh">meal</span>
            <span className="text-lime">.</span>
          </p>
          <p className="mt-2 text-[0.72rem] font-medium uppercase tracking-[0.34em] text-cream/50">
            eat well · live well
          </p>
        </motion.div>

        <div className="mt-14 w-full max-w-[280px]">
          <div className="h-[3px] overflow-hidden rounded-full bg-white/15">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-fresh to-lime"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <div className="mt-5 flex items-center justify-center gap-2 text-[0.82rem] text-cream/70">
            <span className="size-1.5 animate-pulse rounded-full bg-lime" />
            Preparing your nutrition journey…
          </div>
        </div>
      </div>

      <div className="relative flex items-center justify-center gap-2 pb-10 text-[0.6rem] font-semibold uppercase tracking-[0.24em] text-cream/35">
        <span>Balanced macros</span>
        <span className="size-1 rounded-full bg-lime/50" />
        <span>Chef crafted</span>
        <span className="size-1 rounded-full bg-lime/50" />
        <span>Made for you</span>
      </div>
    </motion.div>
  );
}
