"use client";

import {
  CalendarRange,
  Droplets,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/feedback/ToastProvider";
import { useUser } from "@/context/UserContext";

export function QuickActions() {
  const { addWater } = useUser();
  const { toast } = useToast();

  const items = [
    { href: "/menu", label: "Menu", icon: UtensilsCrossed },
    { href: "/plan", label: "My plan", icon: CalendarRange },
    { href: "/chat", label: "Ask AI", icon: Sparkles },
  ];

  return (
    <div className="no-scrollbar -mx-4 flex items-center gap-2 overflow-x-auto px-4 pb-0.5 sm:mx-0 sm:flex-wrap sm:px-0 lg:justify-end">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className="group inline-flex h-11 shrink-0 items-center gap-2 rounded-full border border-white/90 bg-white/80 pl-1.5 pr-4 text-[0.7rem] font-semibold text-charcoal shadow-[0_2px_10px_rgba(23,77,54,0.05)] backdrop-blur transition hover:-translate-y-0.5 hover:shadow-card"
          >
            <span className="flex size-8 items-center justify-center rounded-full bg-forest-soft text-forest transition group-hover:bg-forest group-hover:text-lime">
              <Icon className="size-[15px]" />
            </span>
            {item.label}
          </Link>
        );
      })}
      <button
        type="button"
        onClick={() => {
          addWater(250);
          toast({ title: "+250 ml logged", description: "Keep it going." });
        }}
        className="group inline-flex h-11 shrink-0 items-center gap-2 rounded-full border border-white/90 bg-white/80 pl-1.5 pr-4 text-[0.7rem] font-semibold text-charcoal shadow-[0_2px_10px_rgba(23,77,54,0.05)] backdrop-blur transition hover:-translate-y-0.5 hover:shadow-card"
      >
        <span className="flex size-8 items-center justify-center rounded-full bg-lime/60 text-forest transition group-hover:bg-forest group-hover:text-lime">
          <Droplets className="size-[15px]" />
        </span>
        Add water
      </button>
    </div>
  );
}
