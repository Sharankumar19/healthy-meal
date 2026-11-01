import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AppProviders } from "./providers";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://healthymeal.app"),
  title: {
    default: "Healthy Meal — Nutrition made personal",
    template: "%s · Healthy Meal",
  },
  description:
    "Personalized meals, macro tracking and an AI nutrition assistant designed around your body, goals and lifestyle.",
  applicationName: "Healthy Meal",
  keywords: [
    "healthy meal",
    "nutrition",
    "meal plan",
    "macros",
    "Indian healthy food",
  ],
  openGraph: {
    title: "Healthy Meal — Your healthier lifestyle starts here",
    description:
      "Personalized meals designed around your body, goals and lifestyle.",
    type: "website",
  },
  formatDetection: { telephone: false },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Healthy Meal",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#F7F8F2",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-IN"
      className={`${jakarta.variable} ${instrument.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
