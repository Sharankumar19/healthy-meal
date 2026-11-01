import { HomeScreen } from "@/components/home/HomeScreen";

export const metadata = {
  title: "Your dashboard",
};

// Gated on client-only auth state; cannot render before hydration.
export const instant = false;

export default function HomePage() {
  return <HomeScreen />;
}
