"use client";

import { AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { BootLoader } from "@/components/layout/BootLoader";
import { BottomNav } from "@/components/layout/BottomNav";
import { useUser } from "@/context/UserContext";

export function AppShell({ children }: { children: ReactNode }) {
  const { hydrated, profile, state } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [booting, setBooting] = useState(true);

  const ready = hydrated && Boolean(profile) && Boolean(state.phone);

  useEffect(() => {
    if (!hydrated) return;
    if (!state.phone) {
      router.replace("/");
      return;
    }
    if (!profile) {
      router.replace("/onboarding");
    }
  }, [hydrated, state.phone, profile, router]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  if (!ready) {
    return <BootLoader onComplete={() => undefined} />;
  }

  return (
    <>
      <AnimatePresence>
        {booting ? <BootLoader onComplete={() => setBooting(false)} /> : null}
      </AnimatePresence>
      <div className="relative min-h-dvh">
        <AppHeader />
        <main className="mx-auto w-full max-w-[1240px] px-4 pb-36 pt-4 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8">
          {children}
        </main>
        <BottomNav />
      </div>
    </>
  );
}
