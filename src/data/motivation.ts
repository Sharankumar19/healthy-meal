export const DAILY_QUOTES = [
  {
    quote: "Small healthy choices create big changes.",
    note: "One plate, one glass of water, one walk at a time.",
  },
  {
    quote: "Progress is built on ordinary days.",
    note: "You don't need a perfect day. Just a repeatable one.",
  },
  {
    quote: "Nourish the body you live in.",
    note: "Food is information, not a reward or a punishment.",
  },
  {
    quote: "Strong is a habit, not a moment.",
    note: "Show up for yourself today — even a little counts.",
  },
  {
    quote: "Eat well. Move often. Rest deeply.",
    note: "The basics, done consistently, are the whole game.",
  },
  {
    quote: "A better week starts with a better meal.",
    note: "Keep it simple, keep it real, keep going.",
  },
  {
    quote: "Your pace is the right pace.",
    note: "Comparison is loud. Consistency is quieter — and stronger.",
  },
] as const;

export function quoteForDate(date: Date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date.getTime() - start.getTime()) / 86400000);
  return DAILY_QUOTES[dayOfYear % DAILY_QUOTES.length];
}
