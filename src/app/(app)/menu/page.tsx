import { MenuScreen } from "@/components/menu/MenuScreen";

export const metadata = {
  title: "Explore the menu",
};

// Gated on client-only auth state; cannot render before hydration.
export const instant = false;

export default function MenuPage() {
  return <MenuScreen />;
}
