"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type ToastTone = "success" | "error" | "info";

interface ToastInput {
  title: string;
  description?: string;
  tone?: ToastTone;
}

interface ToastItem extends ToastInput {
  id: number;
}

const ToastContext = createContext<{ toast: (input: ToastInput) => void } | null>(
  null,
);

const icons = {
  success: CheckCircle2,
  error: TriangleAlert,
  info: Info,
} as const;

const tones: Record<ToastTone, string> = {
  success: "bg-forest text-cream",
  error: "bg-[#7A2E22] text-cream",
  info: "bg-charcoal text-cream",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback(
    (input: ToastInput) => {
      const id = nextId.current++;
      setItems((current) => [...current.slice(-2), { ...input, id }]);
      window.setTimeout(() => dismiss(id), 3800);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-28 z-[90] flex flex-col items-center gap-2 px-4 md:bottom-32"
        aria-live="polite"
      >
        <AnimatePresence initial={false}>
          {items.map((item) => {
            const Icon = icons[item.tone ?? "success"];
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl px-4 py-3.5 shadow-float",
                  tones[item.tone ?? "success"],
                )}
              >
                <Icon className="mt-0.5 size-4 shrink-0 text-lime" strokeWidth={2.2} />
                <div className="min-w-0 flex-1">
                  <p className="text-[0.82rem] font-semibold leading-tight">
                    {item.title}
                  </p>
                  {item.description ? (
                    <p className="mt-1 text-[0.72rem] leading-snug text-cream/70">
                      {item.description}
                    </p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(item.id)}
                  className="rounded-full p-1 text-cream/50 transition hover:bg-white/10 hover:text-cream"
                  aria-label="Dismiss notification"
                >
                  <X className="size-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
}
