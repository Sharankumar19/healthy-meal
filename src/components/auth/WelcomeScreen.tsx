"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Flame, Leaf, Sparkles, Target, Timer } from "lucide-react";
import Image from "next/image";
import { AuthPanel } from "@/components/auth/AuthPanel";
import { Logo } from "@/components/brand/Logo";
import { Avatar } from "@/components/ui/Card";

const valueProps = [
  { icon: Target, label: "Built around your goals" },
  { icon: Leaf, label: "Real, fresh Indian food" },
  { icon: Timer, label: "Set up in 5 minutes" },
];

export function WelcomeScreen() {
  const reduceMotion = useReducedMotion();
  const fade = (delay: number) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <main className="relative min-h-dvh overflow-x-hidden pb-0 lg:p-5">
      <div className="pointer-events-none absolute -left-40 top-1/4 size-[460px] rounded-full bg-lime/25 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 size-[420px] rounded-full bg-fresh/20 blur-[130px]" />

      <div className="relative mx-auto flex min-h-dvh w-full max-w-[1280px] flex-col lg:min-h-[calc(100dvh-2.5rem)] lg:grid lg:grid-cols-[1.04fr_0.96fr] lg:gap-5">
        {/* Mobile visual */}
        <section className="relative lg:hidden">
          <div className="relative h-[258px] overflow-hidden bg-forest sm:h-[320px]">
            <Image
              src="/food/bowl-rainbow.jpg"
              alt="A colorful bowl of fresh vegetables, quinoa and avocado"
              fill
              priority
              sizes="100vw"
              className="object-cover object-[center_58%]"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-forest-deep/75 via-forest-deep/10 to-forest-deep/95" />
            <div className="absolute inset-0 bg-gradient-to-r from-forest-deep/40 via-transparent to-transparent" />

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-x-0 top-0 flex items-center justify-between px-5 pt-5"
            >
              <Logo
                theme="light"
                size={35}
                wordmarkClassName="text-[1.14rem] drop-shadow-sm"
              />
              <span className="glass-dark inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-cream">
                <Sparkles className="size-3 text-lime" />
                Nutrition reimagined
              </span>
            </motion.div>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="glass absolute bottom-12 left-4 flex items-center gap-2.5 rounded-2xl px-3 py-2.5 shadow-card"
            >
              <span className="flex size-9 items-center justify-center rounded-xl bg-forest text-lime">
                <Flame className="size-4" />
              </span>
              <div className="pr-1">
                <p className="text-[0.72rem] font-bold leading-tight text-forest">
                  480 kcal
                </p>
                <p className="text-[0.58rem] font-medium text-muted">
                  Rainbow bowl · 19g protein
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="glass-dark absolute right-4 top-[92px] rounded-2xl px-3 py-2 text-right"
            >
              <p className="text-[0.55rem] font-semibold uppercase tracking-[0.16em] text-lime/80">
                Made for you
              </p>
              <p className="mt-0.5 font-serif text-[1.05rem] italic leading-none text-cream">
                body, goals, life.
              </p>
            </motion.div>

            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-cream via-cream/40 to-transparent" />
          </div>
        </section>

        {/* Form column */}
        <section className="relative z-10 -mt-8 flex flex-col rounded-t-[34px] bg-cream px-5 pb-10 pt-8 sm:px-8 lg:mt-0 lg:justify-between lg:rounded-none lg:bg-transparent lg:px-10 lg:pb-8 lg:pt-8 xl:px-14">
          <motion.div {...fade(0)} className="hidden lg:block">
            <Logo size={40} />
          </motion.div>

          <div className="lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:py-10">
            <AuthPanel />
          </div>

          <motion.div
            {...fade(0.5)}
            className="mt-8 border-t border-line/80 pt-5 lg:mt-0"
          >
            <div className="hidden flex-wrap items-center gap-x-5 gap-y-2 lg:flex">
              {valueProps.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 text-[0.68rem] font-medium text-muted"
                >
                  <Icon className="size-3.5 text-fresh" />
                  {label}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between gap-4 lg:mt-4">
              <div className="flex items-center gap-2.5">
                <div className="flex -space-x-2">
                  <Avatar name="Ananya Rao" size="sm" className="ring-cream" />
                  <Avatar name="Rahul Mehta" size="sm" className="bg-fresh text-forest ring-cream" />
                  <Avatar name="Kabir Singh" size="sm" className="bg-lime text-forest ring-cream" />
                </div>
                <div>
                  <div className="flex gap-0.5 text-[#E0A33E]" aria-hidden="true">
                    {"★★★★★".split("").map((star, index) => (
                      <span key={index} className="text-[0.62rem]">
                        {star}
                      </span>
                    ))}
                  </div>
                  <p className="text-[0.62rem] text-muted">
                    Loved by people building better habits
                  </p>
                </div>
              </div>
              <span className="hidden text-[0.6rem] font-medium uppercase tracking-[0.18em] text-muted/60 sm:block">
                Eat well · live well
              </span>
            </div>
          </motion.div>
        </section>

        {/* Desktop visual */}
        <motion.aside
          initial={reduceMotion ? false : { opacity: 0, scale: 0.985, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative m-2 hidden overflow-hidden rounded-[34px] bg-forest lg:block"
        >
          <Image
            src="/food/bowl-rainbow.jpg"
            alt="Rainbow Buddha Bowl with quinoa, chickpeas and avocado"
            fill
            priority
            sizes="(min-width: 1024px) 46vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-forest-deep/65 via-transparent to-forest-deep/90" />
          <div className="absolute inset-0 bg-gradient-to-tr from-forest-deep/35 via-transparent to-transparent" />

          <div className="relative flex h-full flex-col justify-between p-7 xl:p-9">
            <div className="flex items-start justify-between gap-4">
              <span className="glass-dark inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.17em] text-cream">
                <span className="size-1.5 animate-pulse rounded-full bg-lime" />
                Fresh, chef-crafted meals
              </span>
              <motion.div
                animate={
                  reduceMotion ? undefined : { y: [0, -8, 0] }
                }
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="glass rounded-[20px] p-3 shadow-card"
              >
                <div className="flex items-center gap-3">
                  <div className="relative flex size-11 items-center justify-center">
                    <svg viewBox="0 0 44 44" className="absolute inset-0 -rotate-90">
                      <circle
                        cx="22"
                        cy="22"
                        r="18"
                        fill="none"
                        stroke="rgba(23,77,54,0.12)"
                        strokeWidth="4"
                      />
                      <circle
                        cx="22"
                        cy="22"
                        r="18"
                        fill="none"
                        stroke="#174D36"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray="113"
                        strokeDashoffset="36"
                      />
                    </svg>
                    <Flame className="size-4 text-forest" />
                  </div>
                  <div>
                    <p className="text-[0.58rem] font-semibold uppercase tracking-[0.13em] text-muted">
                      Daily target
                    </p>
                    <p className="text-[0.9rem] font-bold leading-tight text-forest">
                      2,180 kcal
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="space-y-4">
              <motion.div
                animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.4,
                }}
                className="glass ml-auto flex w-fit items-center gap-3 rounded-[22px] p-2.5 pr-4 shadow-card"
              >
                <div className="relative size-14 overflow-hidden rounded-[15px]">
                  <Image
                    src="/food/yogurt-parfait.jpg"
                    alt="Berry yogurt parfait"
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-[0.55rem] font-semibold uppercase tracking-[0.14em] text-muted">
                    Today&apos;s pick
                  </p>
                  <p className="text-[0.8rem] font-bold leading-tight text-charcoal">
                    Berry Yogurt Parfait
                  </p>
                  <p className="mt-0.5 text-[0.62rem] font-medium text-fresh">
                    16g protein · 280 kcal
                  </p>
                </div>
              </motion.div>

              <div className="max-w-[360px] pb-1">
                <p className="mb-2 text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-lime/90">
                  The Healthy Meal promise
                </p>
                <p className="font-serif text-[1.85rem] italic leading-[1.14] text-cream xl:text-[2.15rem]">
                  “Good food should feel like a ritual, not a rule.”
                </p>
                <div className="mt-4 flex items-center gap-2 text-[0.66rem] font-medium text-cream/60">
                  <Leaf className="size-3.5 text-lime" />
                  Balanced macros · Real ingredients · Zero guesswork
                </div>
              </div>
            </div>
          </div>
        </motion.aside>
      </div>
    </main>
  );
}
