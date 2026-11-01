"use client";

import type { ReactNode } from "react";
import { ToastProvider } from "@/components/feedback/ToastProvider";
import { CursorGlow } from "@/components/motion/CursorGlow";
import { UserProvider } from "@/context/UserContext";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <UserProvider>
        <CursorGlow />
        {children}
      </UserProvider>
    </ToastProvider>
  );
}
