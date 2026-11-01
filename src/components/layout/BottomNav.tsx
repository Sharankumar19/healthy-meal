"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CalendarRange, House, Sparkles, UtensilsCrossed } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/home", label: "Home", icon: House },
  { href: "/menu", label: "Menu", icon: UtensilsCrossed },
  { href: "/plan", label: "Plan", icon: CalendarRange },
  { href: "/chat", label: "AI Chat", icon: Sparkles },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  return (
    <nav
      aria-label="Primary"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
    >
      <div className="pointer-events-auto mx-auto w-full max-w-[480px] rounded-[28px] border border-white/90 bg-white/85 p-1.5 shadow-[0_24px_60px_-20px_rgba(23,77,54,0.42)] backdrop-blur-2xl">
        <div className="flex items-stretch gap-1">
          {ITEMS.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group relative flex h-[58px] flex-1 flex-col items-center justify-center gap-1 rounded-[22px] transition-colors duration-200",
                  active ? "text-cream" : "text-muted hover:text-forest",
                )}
              >
                {active ? (
                  <motion.span
                    layoutId="bottom-nav-active"
                    className="absolute inset-0 rounded-[22px] bg-forest shadow-[0_10px_24px_-12px_rgba(23,77,54,0.9)]"
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 380, damping: 32 }
                    }
                  />
                ) : null}
                <span className="relative z-10 flex flex-col items-center gap-1">
                  <Icon
                    className={cn(
                      "size-[19px] transition-transform duration-300 group-hover:-translate-y-0.5",
                      active && "text-lime",
                    )}
                    strokeWidth={active ? 2.3 : 1.9}
                  />
                  <span
                    className={cn(
                      "text-[0.63rem] font-semibold tracking-[0.01em]",
                      active ? "text-cream" : "text-muted",
                    )}
                  >
                    {item.label}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
