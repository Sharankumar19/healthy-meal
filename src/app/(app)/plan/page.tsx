import { PlanScreen } from "@/components/plan/PlanScreen";

export const metadata = {
  title: "Weekly plan",
};

// This screen is gated on client-only auth/profile state, so it cannot render
// before hydration. Opt out of instant-navigation validation.
export const instant = false;

export default function PlanPage() {
  return <PlanScreen />;
}
