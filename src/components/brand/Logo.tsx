import { cn } from "@/lib/utils";

export function LogoMark({
  size = 40,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <rect width="48" height="48" rx="15" fill="#174D36" />
      <path
        d="M35 12.5c-10.6.2-18.6 6.1-18.6 14.9 0 3.2 1.2 5.7 2.7 7.4 1-8 6.6-13.8 15-16.2-7.7 3.9-12.5 9.4-13.4 17.3 9.6.8 15.6-4.9 15.6-13.2 0-4.1-1.3-7.4-1.3-10.2Z"
        fill="#C5ED79"
      />
      <circle cx="33.5" cy="34.5" r="2.4" fill="#F7F8F2" />
    </svg>
  );
}

export function Logo({
  size = 38,
  theme = "dark",
  showWordmark = true,
  className,
  wordmarkClassName,
}: {
  size?: number;
  theme?: "dark" | "light";
  showWordmark?: boolean;
  className?: string;
  wordmarkClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <LogoMark size={size} />
      {showWordmark ? (
        <span
          className={cn(
            "font-display text-[1.28rem] font-extrabold leading-none tracking-[-0.045em]",
            theme === "dark" ? "text-forest" : "text-cream",
            wordmarkClassName,
          )}
        >
          healthy<span className="text-fresh">meal</span>
          <span className="text-[#A8D64C]">.</span>
        </span>
      ) : null}
    </span>
  );
}
