import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-card border border-white/80 bg-white shadow-card",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

type PillTone = "lime" | "forest" | "white" | "outline" | "fresh" | "sand" | "rose";

const pillTones: Record<PillTone, string> = {
  lime: "bg-lime/90 text-forest-deep",
  forest: "bg-forest text-cream",
  white: "bg-white/90 text-forest",
  outline: "border border-line bg-transparent text-muted",
  fresh: "bg-fresh-soft text-forest",
  sand: "bg-sand/70 text-charcoal",
  rose: "bg-[#FBEAE6] text-tomato",
};

export function Pill({
  children,
  tone = "fresh",
  className,
  icon: Icon,
}: {
  children: ReactNode;
  tone?: PillTone;
  className?: string;
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em]",
        pillTones[tone],
        className,
      )}
    >
      {Icon ? <Icon className="size-3" strokeWidth={2.2} /> : null}
      {children}
    </span>
  );
}

export function Avatar({
  name,
  size = "md",
  className,
}: {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-forest font-semibold text-lime ring-2 ring-white/80",
        size === "sm" && "size-9 text-[0.7rem]",
        size === "md" && "size-11 text-sm",
        size === "lg" && "size-14 text-base",
        className,
      )}
      aria-hidden="true"
    >
      {initials || "HM"}
    </span>
  );
}

export function DietMark({
  diet,
  className,
}: {
  diet: "veg" | "egg" | "non-veg";
  className?: string;
}) {
  const tone = diet === "non-veg" ? "#B4432F" : "#2B7A4B";
  return (
    <span
      className={cn(
        "inline-flex size-[15px] shrink-0 items-center justify-center rounded-[3px] border-[1.5px] bg-white",
        className,
      )}
      style={{ borderColor: tone }}
      title={
        diet === "non-veg"
          ? "Non-vegetarian"
          : diet === "egg"
            ? "Contains egg"
            : "Vegetarian"
      }
      aria-label={
        diet === "non-veg"
          ? "Non-vegetarian"
          : diet === "egg"
            ? "Contains egg"
            : "Vegetarian"
      }
    >
      <span
        className="size-[6px] rounded-full"
        style={{ backgroundColor: tone }}
      />
    </span>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("skeleton rounded-xl bg-cream-deep/70", className)}
      aria-hidden="true"
    />
  );
}

export function SectionHeading({
  eyebrow,
  title,
  action,
  className,
}: {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-end justify-between gap-4", className)}>
      <div>
        {eyebrow ? (
          <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="font-display text-[1.15rem] font-bold tracking-[-0.03em] text-charcoal sm:text-[1.3rem]">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}
