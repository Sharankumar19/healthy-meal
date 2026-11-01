"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  ChevronRight,
  Flame,
  LogOut,
  RotateCcw,
  Sparkles,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { Avatar } from "@/components/ui/Card";
import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";

export function AppHeader() {
  const { profile, nutrition, state, resetAll } = useUser();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const dateLabel = new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date());

  function signOut() {
    setOpen(false);
    resetAll();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-cream/80 backdrop-blur-xl">
      <div className="mx-auto flex h-[66px] max-w-[1240px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/home" aria-label="Healthy Meal home" className="shrink-0">
          <Logo size={34} wordmarkClassName="text-[1.12rem]" />
        </Link>

        <div className="hidden items-center gap-2 lg:flex">
          <span className="inline-flex items-center gap-2 rounded-full border border-line/80 bg-white/70 px-3.5 py-2 text-[0.7rem] font-medium text-muted">
            <CalendarDays className="size-3.5 text-fresh" />
            {dateLabel}
          </span>
          {nutrition ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-line/80 bg-white/70 px-3.5 py-2 text-[0.7rem] font-medium text-muted">
              <Flame className="size-3.5 text-[#D9973F]" />
              {nutrition.calorieTarget.toLocaleString("en-IN")} kcal daily target
            </span>
          ) : null}
        </div>

        <div className="relative flex items-center gap-2">
          <span className="hidden items-center gap-1.5 rounded-full bg-lime/60 px-3 py-1.5 text-[0.63rem] font-semibold uppercase tracking-[0.13em] text-forest sm:inline-flex">
            <Sparkles className="size-3" />
            Plan ready
          </span>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-haspopup="menu"
            aria-expanded={open}
            aria-label="Open profile menu"
            className={cn(
              "rounded-full transition-transform duration-200 hover:scale-105",
              open && "scale-105",
            )}
          >
            <Avatar name={profile?.name ?? "Healthy Meal"} />
          </button>

          <AnimatePresence>
            {open ? (
              <>
                <button
                  type="button"
                  aria-label="Close profile menu"
                  className="fixed inset-0 z-40 cursor-default bg-charcoal/10 backdrop-blur-[2px]"
                  onClick={() => setOpen(false)}
                />
                <motion.div
                  role="menu"
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute right-0 top-[54px] z-50 w-[276px] overflow-hidden rounded-[22px] border border-line bg-white p-2 shadow-float"
                >
                  <div className="flex items-center gap-3 rounded-2xl bg-cream px-3 py-3">
                    <Avatar name={profile?.name ?? "Healthy Meal"} size="sm" />
                    <div className="min-w-0">
                      <p className="truncate text-[0.84rem] font-bold tracking-[-0.02em] text-charcoal">
                        {profile?.name ?? "Your profile"}
                      </p>
                      <p className="truncate text-[0.68rem] text-muted">
                        {state.phone ? `+91 ${state.phone}` : "Healthy Meal member"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-1.5 space-y-0.5">
                    <MenuLink
                      href="/results"
                      icon={UserRound}
                      label="My nutrition profile"
                      onClick={() => setOpen(false)}
                    />
                    <MenuLink
                      href="/onboarding"
                      icon={RotateCcw}
                      label="Update my details"
                      onClick={() => setOpen(false)}
                    />
                    <MenuLink
                      href="/chat"
                      icon={Sparkles}
                      label="Ask the assistant"
                      onClick={() => setOpen(false)}
                    />
                    <button
                      type="button"
                      role="menuitem"
                      onClick={signOut}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[0.78rem] font-medium text-tomato transition hover:bg-[#FBEAE6]"
                    >
                      <LogOut className="size-4" />
                      Sign out &amp; reset demo
                    </button>
                  </div>
                </motion.div>
              </>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

function MenuLink({
  href,
  icon: Icon,
  label,
  onClick,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      role="menuitem"
      onClick={onClick}
      className="group flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[0.78rem] font-medium text-charcoal transition hover:bg-forest-soft/70"
    >
      <Icon className="size-4 text-forest" />
      <span className="flex-1">{label}</span>
      <ChevronRight className="size-3.5 text-muted/50 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
