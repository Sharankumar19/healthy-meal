"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUp,
  ArrowUpRight,
  Droplets,
  Flame,
  Leaf,
  Loader2,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { PageTransition } from "@/components/motion/PageTransition";
import { Pill } from "@/components/ui/Card";
import { useUser } from "@/context/UserContext";
import { getAssistantReply, SUGGESTED_PROMPTS } from "@/lib/ai";
import { formatWater } from "@/lib/nutrition";
import type { ChatMessage } from "@/lib/types";
import { cn, initialsOf } from "@/lib/utils";

function welcomeMessage(name: string): ChatMessage {
  const firstName = name.trim().split(/\s+/)[0] || "there";
  return {
    id: "welcome",
    role: "assistant",
    content: `Hi ${firstName}! I'm your Healthy Meal assistant.

This is a local demo: my replies come from simple built-in rules, not a real AI model, and nothing leaves your device.

Ask me about protein, meal ideas, hydration, post-workout food or your calorie target — I'll keep answers aligned with your plan.`,
    createdAt: 0,
  };
}

function AssistantAvatar() {
  return (
    <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-forest text-lime shadow-sm">
      <Sparkles className="size-3.5" />
    </span>
  );
}

function TypingDots() {
  const reduceMotion = useReducedMotion();
  return (
    <span
      className="flex h-5 items-center gap-1.5"
      aria-label="Assistant is typing"
    >
      {[0, 1, 2].map((index) => (
        <motion.span
          key={index}
          className="size-1.5 rounded-full bg-muted/70"
          animate={
            reduceMotion
              ? { opacity: 0.6 }
              : { y: [0, -3, 0], opacity: [0.35, 1, 0.35] }
          }
          transition={{
            duration: 0.9,
            repeat: reduceMotion ? 0 : Infinity,
            delay: index * 0.14,
            ease: "easeInOut",
          }}
        />
      ))}
    </span>
  );
}

export function ChatScreen() {
  const { profile, nutrition } = useUser();
  const reduceMotion = useReducedMotion();
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    welcomeMessage(profile?.name ?? "there"),
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const counter = useRef(1);
  const busyRef = useRef(false);
  const sessionRef = useRef(0);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    list.scrollTo({
      top: list.scrollHeight,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [messages, thinking, reduceMotion]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  }, [input]);

  if (!profile || !nutrition) return null;

  const firstName = profile.name.split(" ")[0];

  async function sendMessage(raw: string) {
    const text = raw.trim();
    if (!text || busyRef.current || !profile || !nutrition) return;

    const session = sessionRef.current;
    busyRef.current = true;
    setThinking(true);
    setInput("");
    setMessages((current) => [
      ...current,
      {
        id: `user-${counter.current++}`,
        role: "user",
        content: text,
        createdAt: Date.now(),
      },
    ]);

    try {
      const reply = await getAssistantReply(text, { profile, nutrition });
      if (session !== sessionRef.current) return;
      setMessages((current) => [
        ...current,
        {
          id: `assistant-${counter.current++}`,
          role: "assistant",
          content: reply.content,
          createdAt: Date.now(),
        },
      ]);
    } catch {
      if (session !== sessionRef.current) return;
      setMessages((current) => [
        ...current,
        {
          id: `assistant-${counter.current++}`,
          role: "assistant",
          content:
            "Something went wrong while building that answer locally. Please try again.",
          createdAt: Date.now(),
        },
      ]);
    } finally {
      if (session === sessionRef.current) {
        busyRef.current = false;
        setThinking(false);
      }
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage(input);
    }
  }

  function clearChat() {
    sessionRef.current += 1;
    busyRef.current = false;
    setThinking(false);
    setInput("");
    setMessages([welcomeMessage(profile?.name ?? "there")]);
  }

  const contextStats = [
    {
      label: "Daily target",
      value: `${nutrition.calorieTarget.toLocaleString("en-IN")} kcal`,
      icon: Flame,
    },
    {
      label: "Protein",
      value: `${nutrition.protein}g`,
      icon: Leaf,
    },
    {
      label: "Water",
      value: formatWater(nutrition.waterMl),
      icon: Droplets,
    },
    {
      label: "Rhythm",
      value: `${profile.mealsPerDay} meals / day`,
      icon: UtensilsCrossed,
    },
  ];

  return (
    <PageTransition className="space-y-5">
      <header className="pt-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-fresh">
            Meal assistant
          </span>
          <Pill tone="lime" icon={Sparkles} className="normal-case tracking-[0.04em]">
            Demo · local replies
          </Pill>
        </div>

        <div className="mt-1.5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-[1.95rem] font-extrabold leading-[1.05] tracking-[-0.05em] text-charcoal sm:text-[2.35rem]">
              Ask your plate{" "}
              <span className="relative inline-block text-forest">
                anything
                <svg
                  viewBox="0 0 120 10"
                  className="absolute -bottom-0.5 left-0 h-2 w-full text-lime"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 8C30 3 70 2 118 5"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </span>
              .
            </h1>
            <p className="mt-2.5 max-w-[520px] text-[0.86rem] leading-relaxed text-muted">
              A built-in, rule-based assistant that answers from your profile
              and plan. No external model, no diagnosis — just practical nudges.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Pill tone="outline" icon={ShieldCheck}>
              Not medical advice
            </Pill>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2 lg:hidden">
          {contextStats.slice(0, 3).map((stat) => {
            const Icon = stat.icon;
            return (
              <span
                key={stat.label}
                className="inline-flex items-center gap-1.5 rounded-full border border-line/80 bg-white/70 px-2.5 py-1.5 text-[0.6rem] font-semibold text-muted"
              >
                <Icon className="size-3 text-fresh" />
                {stat.value}
              </span>
            );
          })}
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-12">
        <section className="lg:col-span-8">
          <div
            className="flex min-h-[480px] flex-col overflow-hidden rounded-[28px] border border-white/80 bg-white shadow-card"
            style={{ height: "min(660px, calc(100dvh - 16rem))" }}
          >
            <div className="flex items-center gap-3 border-b border-line/70 px-4 py-3">
              <span className="relative flex size-9 items-center justify-center rounded-full bg-forest text-lime">
                <Sparkles className="size-4" />
                <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-white bg-fresh" />
              </span>
              <div className="min-w-0">
                <p className="text-[0.8rem] font-bold tracking-[-0.02em] text-charcoal">
                  Meal Assistant
                </p>
                <p className="flex items-center gap-1.5 text-[0.56rem] font-medium text-muted">
                  <span className="size-1.5 rounded-full bg-fresh" />
                  Demo assistant · local rules
                </p>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="hidden items-center gap-1.5 rounded-full bg-cream px-2.5 py-1 text-[0.54rem] font-semibold text-muted sm:inline-flex">
                  <ShieldCheck className="size-3 text-fresh" />
                  Private
                </span>
                <button
                  type="button"
                  onClick={clearChat}
                  className="flex size-8 items-center justify-center rounded-full border border-line text-muted transition hover:border-fresh/50 hover:text-forest"
                  aria-label="Clear conversation"
                  title="Clear conversation"
                >
                  <RotateCcw className="size-3.5" />
                </button>
              </div>
            </div>

            <div
              ref={listRef}
              role="log"
              aria-live="polite"
              aria-label="Conversation with the demo meal assistant"
              className="min-h-0 flex-1 overflow-y-auto bg-gradient-to-b from-cream/50 to-white px-4 py-5 sm:px-5"
            >
              <div className="mx-auto flex max-w-[640px] flex-col gap-5">
                <p className="text-center text-[0.5rem] font-semibold uppercase tracking-[0.14em] text-muted/45">
                  Today · demo conversation
                </p>

                {messages.map((message) =>
                  message.role === "user" ? (
                    <div key={message.id} className="flex justify-end gap-2.5">
                      <div className="max-w-[86%] rounded-[18px] rounded-br-md bg-forest px-3.5 py-2.5 text-[0.78rem] leading-relaxed text-cream shadow-[0_10px_24px_-18px_rgba(23,77,54,0.9)] sm:text-[0.82rem]">
                        <p className="whitespace-pre-line">{message.content}</p>
                      </div>
                      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-charcoal text-[0.52rem] font-bold text-cream">
                        {initialsOf(profile.name)}
                      </span>
                    </div>
                  ) : (
                    <div key={message.id} className="flex gap-2.5">
                      <AssistantAvatar />
                      <div className="max-w-[86%] rounded-[18px] rounded-tl-md border border-line/80 bg-white px-3.5 py-3 text-[0.78rem] leading-relaxed text-charcoal shadow-[0_10px_24px_-22px_rgba(23,77,54,0.5)] sm:text-[0.82rem]">
                        <p className="whitespace-pre-line">{message.content}</p>
                        <p className="mt-2 text-[0.48rem] font-semibold uppercase tracking-[0.1em] text-muted/45">
                          Local demo reply
                        </p>
                      </div>
                    </div>
                  ),
                )}

                {messages.length === 1 ? (
                  <div className="flex flex-wrap gap-2 pl-9">
                    {SUGGESTED_PROMPTS.slice(1, 4).map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => void sendMessage(prompt)}
                        className="rounded-full border border-line bg-white px-3 py-1.5 text-[0.62rem] font-semibold text-forest transition hover:border-fresh/60 hover:bg-fresh-soft/60"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                ) : null}

                {thinking ? (
                  <div className="flex gap-2.5">
                    <AssistantAvatar />
                    <div className="rounded-[18px] rounded-tl-md border border-line/80 bg-white px-3.5 py-3 shadow-[0_10px_24px_-22px_rgba(23,77,54,0.5)]">
                      <TypingDots />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="border-t border-line/70 bg-white/90 p-3 backdrop-blur"
            >
              <div className="flex items-end gap-2 rounded-[20px] border border-line bg-cream/60 p-1.5 transition-colors focus-within:border-fresh focus-within:bg-white">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  maxLength={600}
                  placeholder={`Ask ${firstName} anything about food…`}
                  aria-label="Message the demo meal assistant"
                  className="max-h-[120px] min-h-[38px] flex-1 resize-none bg-transparent px-2.5 py-2 text-[0.8rem] font-medium leading-relaxed text-charcoal outline-none placeholder:font-normal placeholder:text-muted/55"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || thinking}
                  aria-label="Send message"
                  className="flex size-10 shrink-0 items-center justify-center rounded-full bg-forest text-lime shadow-[0_10px_22px_-14px_rgba(23,77,54,0.9)] transition hover:bg-forest-deep disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {thinking ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <ArrowUp className="size-4" strokeWidth={2.6} />
                  )}
                </button>
              </div>
              <div className="mt-2 flex items-center justify-between gap-3 px-1">
                <p className="text-[0.52rem] leading-snug text-muted/60">
                  Rule-based demo · no external AI model · not medical advice
                </p>
                <span
                  className={cn(
                    "shrink-0 text-[0.5rem] tabular-nums",
                    input.length > 520 ? "text-tomato/80" : "text-muted/40",
                  )}
                >
                  {input.length}/600
                </span>
              </div>
            </form>
          </div>
        </section>

        <aside className="space-y-4 lg:col-span-4">
          <section className="relative overflow-hidden rounded-[28px] bg-forest p-5 text-cream shadow-float">
            <div className="pointer-events-none absolute -right-16 -top-20 size-52 rounded-full bg-lime/20 blur-[60px]" />
            <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.05]" />

            <div className="relative flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[0.54rem] font-semibold uppercase tracking-[0.16em] text-lime">
                <Sparkles className="size-3" />
                Your context
              </span>
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-[0.5rem] font-semibold uppercase tracking-[0.1em] text-cream/50">
                Live
              </span>
            </div>

            <h2 className="relative mt-3.5 font-display text-[1.12rem] font-bold leading-tight tracking-[-0.03em]">
              The numbers behind the advice
            </h2>

            <dl className="relative mt-4 grid grid-cols-2 gap-2.5">
              {contextStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-white/10 bg-white/[0.06] p-3"
                  >
                    <Icon className="size-3.5 text-lime" />
                    <dd className="mt-2 text-[0.76rem] font-bold leading-none tracking-[-0.02em] text-cream">
                      {stat.value}
                    </dd>
                    <dt className="mt-1 text-[0.5rem] font-semibold uppercase tracking-[0.1em] text-cream/40">
                      {stat.label}
                    </dt>
                  </div>
                );
              })}
            </dl>

            <p className="relative mt-3 text-[0.56rem] leading-relaxed text-cream/40">
              Pulled from your profile and daily target. Update your details in
              onboarding to refresh them.
            </p>
          </section>

          <section className="rounded-[26px] border border-white/80 bg-white p-5 shadow-card">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-full bg-fresh-soft text-forest">
                <Sparkles className="size-3.5" />
              </span>
              <h2 className="font-display text-[0.95rem] font-bold tracking-[-0.025em] text-charcoal">
                Try asking
              </h2>
            </div>

            <div className="mt-3 space-y-1.5">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  disabled={thinking}
                  onClick={() => void sendMessage(prompt)}
                  className="group flex w-full items-center justify-between gap-2 rounded-xl px-2.5 py-2 text-left text-[0.7rem] font-medium text-charcoal transition hover:bg-cream disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span>{prompt}</span>
                  <ArrowUpRight className="size-3 shrink-0 text-muted/40 transition group-hover:text-forest" />
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-line bg-white/60 p-4">
            <div className="flex items-center gap-2 text-forest">
              <ShieldCheck className="size-3.5" />
              <p className="text-[0.64rem] font-bold uppercase tracking-[0.1em]">
                About this assistant
              </p>
            </div>
            <p className="mt-2 text-[0.64rem] leading-relaxed text-muted">
              Replies are generated by simple rules inside the app — not by a
              real AI model. Messages stay in this browser tab and are not sent
              anywhere.
            </p>
            <Link
              href="/legal/privacy"
              className="mt-2 inline-flex items-center gap-1 text-[0.62rem] font-semibold text-forest transition hover:text-fresh"
            >
              How data works
              <ArrowUpRight className="size-3" />
            </Link>
          </section>
        </aside>
      </div>
    </PageTransition>
  );
}
