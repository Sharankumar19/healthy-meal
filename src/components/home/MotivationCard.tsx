"use client";

import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { DAILY_QUOTES, quoteForDate } from "@/data/motivation";

export function MotivationCard({ className }: { className?: string }) {
  const [daily, setDaily] = useState<(typeof DAILY_QUOTES)[number]>(
    DAILY_QUOTES[0],
  );

  useEffect(() => {
    setDaily(quoteForDate());
  }, []);

  const { quote, note } = daily;

  return (
    <section className={`relative flex flex-col overflow-hidden rounded-[30px] bg-lime p-5 text-forest-deep shadow-[0_20px_40px_-28px_rgba(122,166,46,0.9)] ${className ?? ""}`}>
      <div className="pointer-events-none absolute -right-8 -top-10 size-36 rounded-full border border-forest/10" />
      <div className="pointer-events-none absolute -right-2 -top-4 size-24 rounded-full border border-forest/10" />
      <div className="pointer-events-none absolute -bottom-16 -left-10 size-40 rounded-full bg-white/25 blur-2xl" />

      <div className="relative flex items-start justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-2.5 py-1 text-[0.54rem] font-bold uppercase tracking-[0.14em] text-forest">
          <Sparkles className="size-3" />
          Daily motivation
        </span>
        <span className="font-serif text-[1.9rem] italic leading-none text-forest/25">
          “
        </span>
      </div>

      <p className="relative mt-3 font-serif text-[1.5rem] italic leading-[1.15] text-forest-deep">
        {quote}
      </p>
      <p className="relative mt-2.5 text-[0.68rem] font-medium leading-relaxed text-forest/65">
        {note}
      </p>
      <div className="relative mt-auto flex items-center gap-2 pt-4 text-[0.58rem] font-bold uppercase tracking-[0.16em] text-forest/50">
        <span className="h-px w-6 bg-forest/25" />
        The Healthy Meal team
      </div>
    </section>
  );
}
