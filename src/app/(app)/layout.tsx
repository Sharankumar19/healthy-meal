import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";

// Gated on client-only auth/profile state; cannot render before hydration.
export const instant = false;

export default function MainLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
