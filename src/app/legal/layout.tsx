import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh">
      <header className="border-b border-line/70 bg-cream/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] max-w-[900px] items-center justify-between gap-4 px-5 sm:px-8">
          <Link href="/" aria-label="Healthy Meal home">
            <Logo size={34} wordmarkClassName="text-[1.12rem]" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white/70 px-3.5 py-2 text-[0.68rem] font-semibold text-forest transition hover:border-fresh/60 hover:bg-white"
          >
            <ArrowLeft className="size-3.5" />
            Back to app
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[760px] px-5 pb-20 pt-10 sm:px-8 sm:pt-14">
        {children}
      </main>

      <footer className="border-t border-line/70 py-6">
        <div className="mx-auto flex max-w-[760px] flex-wrap items-center justify-between gap-2 px-5 text-[0.6rem] text-muted/70 sm:px-8">
          <p>Healthy Meal is a demo product. Nutrition estimates are not medical advice.</p>
          <div className="flex items-center gap-4">
            <Link href="/legal/terms" className="transition hover:text-forest">
              Terms
            </Link>
            <Link href="/legal/privacy" className="transition hover:text-forest">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
