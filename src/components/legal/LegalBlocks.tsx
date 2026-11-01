import type { ReactNode } from "react";

export function LegalHeader({
  eyebrow,
  title,
  updated,
  intro,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  intro: string;
}) {
  return (
    <header>
      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-fresh">
        {eyebrow}
      </p>
      <h1 className="mt-2 font-display text-[2rem] font-extrabold leading-[1.05] tracking-[-0.05em] text-charcoal sm:text-[2.5rem]">
        {title}
      </h1>
      <p className="mt-2 text-[0.62rem] font-medium uppercase tracking-[0.1em] text-muted/70">
        {updated}
      </p>
      <p className="mt-5 text-[0.88rem] leading-relaxed text-muted">{intro}</p>
    </header>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-8 border-t border-line/70 pt-6">
      <h2 className="font-display text-[1.05rem] font-bold tracking-[-0.025em] text-charcoal">
        {title}
      </h2>
      <div className="mt-2.5 space-y-3 text-[0.82rem] leading-relaxed text-muted">
        {children}
      </div>
    </section>
  );
}

export function LegalList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5">
          <span className="mt-[0.45rem] size-1.5 shrink-0 rounded-full bg-fresh" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
