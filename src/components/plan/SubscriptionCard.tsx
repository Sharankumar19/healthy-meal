"use client";

import { ArrowUpRight, Check, Sparkles } from "lucide-react";
import { useToast } from "@/components/feedback/ToastProvider";
import { formatInr } from "@/lib/utils";

export function SubscriptionCard({
  perDay,
  perWeek,
  mealCount,
}: {
  perDay: number;
  perWeek: number;
  mealCount: number;
}) {
  const { toast } = useToast();

  return (
    <section className="relative overflow-hidden rounded-[28px] bg-forest-deep p-5 text-cream shadow-float sm:p-6">
      <div className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-lime/20 blur-[64px]" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 size-56 rounded-full bg-fresh/20 blur-[64px]" />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.06]" />

      <div className="relative flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[0.54rem] font-semibold uppercase tracking-[0.16em] text-lime">
          <Sparkles className="size-3" />
          Weekly table
        </span>
        <span className="rounded-full bg-white/10 px-2.5 py-1 text-[0.52rem] font-bold uppercase tracking-[0.12em] text-cream/60">
          Demo
        </span>
      </div>

      <h2 className="relative mt-4 font-display text-[1.28rem] font-bold leading-[1.15] tracking-[-0.035em]">
        Every meal in your plan, one subscription.
      </h2>
      <p className="relative mt-1.5 text-[0.72rem] leading-relaxed text-cream/60">
        {mealCount} chef-prepared meals across the week, matched to your goal and
        preferences.
      </p>

      <div className="relative mt-4 flex items-end gap-2">
        <span className="font-display text-[2.15rem] font-extrabold leading-none tracking-[-0.05em] text-lime">
          {formatInr(perDay)}
        </span>
        <span className="pb-1 text-[0.68rem] font-medium text-cream/50">
          / day
        </span>
        <span className="ml-auto pb-1 text-[0.6rem] text-cream/40">
          ≈ {formatInr(perWeek)} / week
        </span>
      </div>

      <ul className="relative mt-4 space-y-2 border-t border-white/10 pt-4">
        {[
          "Swap any dish whenever you like",
          "Macros and totals update instantly",
          "Pause or skip a day, no questions",
        ].map((item) => (
          <li
            key={item}
            className="flex items-center gap-2 text-[0.68rem] font-medium text-cream/75"
          >
            <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-lime/15 text-lime">
              <Check className="size-2.5" strokeWidth={3.2} />
            </span>
            {item}
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() =>
          toast({
            title: "This is a demo membership",
            description:
              "No payment is collected and no meals are delivered in this build.",
            tone: "info",
          })
        }
        className="relative mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-lime text-[0.8rem] font-bold text-forest-deep transition hover:bg-[#d2f28a]"
      >
        Membership details
        <ArrowUpRight className="size-3.5" strokeWidth={2.6} />
      </button>

      <p className="relative mt-2.5 text-center text-[0.5rem] leading-relaxed text-cream/35">
        Illustrative pricing for this demo. No payment is collected.
      </p>
    </section>
  );
}
