"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  LockKeyhole,
  MessageSquareText,
  Pencil,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/feedback/ToastProvider";
import { useUser } from "@/context/UserContext";
import { authService, OTP_LENGTH } from "@/lib/auth";
import {
  cn,
  formatPhoneDisplay,
  isValidIndianPhone,
} from "@/lib/utils";

type Step = "phone" | "otp";

export function AuthPanel() {
  const router = useRouter();
  const { toast } = useToast();
  const { profile, state, setVerifiedPhone } = useUser();
  const reduceMotion = useReducedMotion();

  const [step, setStep] = useState<Step>("phone");
  const [digits, setDigits] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [phoneError, setPhoneError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoCode, setDemoCode] = useState("");
  const [resendIn, setResendIn] = useState(0);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  const phoneValid = isValidIndianPhone(digits);

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = window.setInterval(
      () => setResendIn((seconds) => Math.max(0, seconds - 1)),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [resendIn]);

  async function sendCode() {
    if (!phoneValid) {
      setPhoneError("Enter a valid 10-digit mobile number starting with 6–9.");
      return;
    }
    setPhoneError("");
    setLoading(true);
    try {
      const result = await authService.requestOtp(digits);
      setDemoCode(result.demoCode ?? "");
      setResendIn(result.resendAfterSeconds);
      setOtp(Array(OTP_LENGTH).fill(""));
      setOtpError("");
      setStep("otp");
      window.setTimeout(() => otpRefs.current[0]?.focus(), 320);
    } catch (error) {
      setPhoneError(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode() {
    const code = otp.join("");
    if (code.length !== OTP_LENGTH) {
      setOtpError("Enter the 4-digit code.");
      return;
    }
    setOtpError("");
    setLoading(true);
    try {
      const result = await authService.verifyOtp(digits, code);
      if (!result.success) {
        setOtpError(result.error ?? "Could not verify that code.");
        return;
      }
      setVerifiedPhone(digits);
      toast({
        title: profile ? `Welcome back, ${profile.name.split(" ")[0]}!` : "Phone verified",
        description: profile
          ? "Taking you to your dashboard."
          : "Let's build your nutrition profile.",
      });
      router.push(profile ? "/home" : "/onboarding");
    } finally {
      setLoading(false);
    }
  }

  async function resend() {
    if (resendIn > 0) return;
    setLoading(true);
    try {
      const result = await authService.requestOtp(digits);
      setDemoCode(result.demoCode ?? "");
      setResendIn(result.resendAfterSeconds);
      setOtp(Array(OTP_LENGTH).fill(""));
      setOtpError("");
      toast({ title: "A fresh code is on its way", tone: "info" });
      window.setTimeout(() => otpRefs.current[0]?.focus(), 80);
    } finally {
      setLoading(false);
    }
  }

  function handleOtpChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setOtpError("");
    if (digit && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
    if (next.every(Boolean)) {
      window.setTimeout(() => {
        const button = document.getElementById("verify-otp-button");
        button?.focus();
      }, 80);
    }
  }

  function handleOtpKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    if (event.key === "ArrowLeft" && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpPaste(event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH)
      .fill("")
      .map((_, index) => pasted[index] ?? "");
    setOtp(next);
    setOtpError("");
    otpRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  }

  function autofillOtp() {
    const next = demoCode.split("").slice(0, OTP_LENGTH);
    setOtp(
      Array(OTP_LENGTH)
        .fill("")
        .map((_, index) => next[index] ?? ""),
    );
    setOtpError("");
    otpRefs.current[OTP_LENGTH - 1]?.focus();
  }

  const firstName = profile?.name.split(" ")[0];

  return (
    <div className="mx-auto w-full max-w-[440px]">
      {profile && state.phone ? (
        <Link
          href="/home"
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-white/70 px-3 py-1.5 text-[0.68rem] font-semibold text-forest transition hover:border-fresh/60 hover:bg-white"
        >
          <span className="size-1.5 rounded-full bg-fresh" />
          Continue as {firstName}
          <ArrowRight className="size-3" />
        </Link>
      ) : (
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-line/80 bg-white/60 px-3 py-1.5 text-[0.63rem] font-semibold uppercase tracking-[0.16em] text-muted">
          <Sparkles className="size-3 text-fresh" />
          Personalized nutrition, made simple
        </div>
      )}

      <h1 className="font-display text-[2.15rem] font-extrabold leading-[1.06] tracking-[-0.05em] text-charcoal sm:text-[2.7rem]">
        {step === "phone" ? (
          <>
            Your healthier
            <br />
            lifestyle starts{" "}
            <span className="relative inline-block text-forest">
              here
              <svg
                viewBox="0 0 120 12"
                className="absolute -bottom-1 left-0 h-2.5 w-full text-lime"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M2 9.5C25 4 60 2 118 4.5"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </span>
            .
          </>
        ) : (
          <>
            One quick check
            <br />
            and we&apos;re <span className="text-forest">in</span>.
          </>
        )}
      </h1>

      <p className="mt-3 max-w-[380px] text-[0.92rem] leading-relaxed text-muted">
        {step === "phone"
          ? "Personalized meals designed around your body, goals and lifestyle."
          : `We sent a ${OTP_LENGTH}-digit code to +91 ${formatPhoneDisplay(digits)}.`}
      </p>

      <div className="mt-7">
        <AnimatePresence mode="wait" initial={false}>
          {step === "phone" ? (
            <motion.form
              key="phone-step"
              onSubmit={(event) => {
                event.preventDefault();
                void sendCode();
              }}
              initial={reduceMotion ? false : { opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? {} : { opacity: 0, x: -12 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4"
              noValidate
            >
              <div>
                <label
                  htmlFor="phone-input"
                  className="mb-2 block text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted"
                >
                  Mobile number
                </label>
                <div
                  className={cn(
                    "group flex h-[60px] items-center rounded-2xl border bg-white/90 px-2 transition-all duration-200 focus-within:border-fresh focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(104,185,132,0.12)]",
                    phoneError ? "border-tomato/60" : "border-line",
                  )}
                >
                  <span className="flex h-full items-center gap-2 border-r border-line px-3 text-[0.95rem] font-semibold text-charcoal">
                    <span className="text-base" aria-hidden="true">
                      🇮🇳
                    </span>
                    +91
                  </span>
                  <input
                    id="phone-input"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    aria-label="Indian mobile number"
                    aria-invalid={Boolean(phoneError)}
                    placeholder="98765 43210"
                    value={formatPhoneDisplay(digits)}
                    onChange={(event) => {
                      setDigits(event.target.value.replace(/\D/g, "").slice(0, 10));
                      setPhoneError("");
                    }}
                    className="h-full w-full bg-transparent px-4 text-[1.08rem] font-semibold tracking-[0.02em] text-charcoal outline-none placeholder:font-normal placeholder:tracking-normal placeholder:text-muted/50"
                  />
                  <span className="pr-2">
                    {phoneValid ? (
                      <motion.span
                        initial={{ scale: 0.4, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex size-8 items-center justify-center rounded-full bg-forest text-lime"
                      >
                        <Check className="size-4" strokeWidth={3} />
                      </motion.span>
                    ) : (
                      <Smartphone className="size-4 text-muted/40" />
                    )}
                  </span>
                </div>
                <AnimatePresence initial={false}>
                  {phoneError ? (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-2 pl-1 text-xs font-medium text-tomato"
                      role="alert"
                    >
                      {phoneError}
                    </motion.p>
                  ) : (
                    <p className="mt-2 pl-1 text-[0.72rem] text-muted">
                      We&apos;ll text you a one-time verification code.
                    </p>
                  )}
                </AnimatePresence>
              </div>

              <Button
                type="submit"
                size="lg"
                fullWidth
                loading={loading}
                disabled={!digits}
                icon={ArrowRight}
                className="mt-1"
              >
                Continue
              </Button>

              <div className="flex items-center justify-center gap-4 pt-1 text-[0.66rem] font-medium text-muted/80">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5 text-fresh" />
                  Private by design
                </span>
                <span className="size-1 rounded-full bg-line" />
                <span className="inline-flex items-center gap-1.5">
                  <LockKeyhole className="size-3.5 text-fresh" />
                  OTP secured
                </span>
              </div>
            </motion.form>
          ) : (
            <motion.form
              key="otp-step"
              onSubmit={(event) => {
                event.preventDefault();
                void verifyCode();
              }}
              initial={reduceMotion ? false : { opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduceMotion ? {} : { opacity: 0, x: 14 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4"
              noValidate
            >
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted">
                    Verification code
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setStep("phone");
                      setOtpError("");
                    }}
                    className="inline-flex items-center gap-1 text-[0.7rem] font-semibold text-forest transition hover:text-fresh"
                  >
                    <Pencil className="size-3" />
                    Edit number
                  </button>
                </div>
                <div className="flex items-center gap-2.5" onPaste={handleOtpPaste}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(element) => {
                        otpRefs.current[index] = element;
                      }}
                      value={digit}
                      onChange={(event) => handleOtpChange(index, event.target.value)}
                      onKeyDown={(event) => handleOtpKeyDown(index, event)}
                      inputMode="numeric"
                      autoComplete={index === 0 ? "one-time-code" : "off"}
                      maxLength={1}
                      aria-label={`Verification digit ${index + 1}`}
                      className={cn(
                        "h-16 w-0 min-w-0 flex-1 rounded-2xl border bg-white text-center font-display text-[1.55rem] font-bold text-charcoal outline-none transition-all duration-200 focus:border-fresh focus:shadow-[0_0_0_4px_rgba(104,185,132,0.14)]",
                        otpError ? "border-tomato/60" : "border-line",
                        digit && "border-forest/40 bg-forest-soft/40",
                      )}
                    />
                  ))}
                </div>
                <AnimatePresence initial={false}>
                  {otpError ? (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-2 pl-1 text-xs font-medium text-tomato"
                      role="alert"
                    >
                      {otpError}
                    </motion.p>
                  ) : null}
                </AnimatePresence>
              </div>

              {demoCode ? (
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-dashed border-fresh/40 bg-fresh-soft/70 px-3.5 py-2.5">
                  <div className="flex items-center gap-2 text-[0.7rem] leading-tight text-forest">
                    <MessageSquareText className="size-4 shrink-0 text-fresh" />
                    <span>
                      Demo mode — use code{" "}
                      <strong className="font-bold tracking-[0.14em]">
                        {demoCode}
                      </strong>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={autofillOtp}
                    className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[0.63rem] font-bold uppercase tracking-[0.08em] text-forest shadow-sm transition hover:bg-lime"
                  >
                    Fill
                  </button>
                </div>
              ) : null}

              <Button
                id="verify-otp-button"
                type="submit"
                size="lg"
                fullWidth
                loading={loading}
                icon={ArrowRight}
              >
                Verify &amp; continue
              </Button>

              <div className="flex items-center justify-between px-1 text-[0.72rem]">
                <button
                  type="button"
                  onClick={() => setStep("phone")}
                  className="inline-flex items-center gap-1.5 font-medium text-muted transition hover:text-forest"
                >
                  <ArrowLeft className="size-3.5" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => void resend()}
                  disabled={resendIn > 0 || loading}
                  className="font-semibold text-forest transition hover:text-fresh disabled:cursor-not-allowed disabled:text-muted/60"
                >
                  {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend code"}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-6 max-w-[400px] text-[0.68rem] leading-relaxed text-muted/80">
        By continuing you agree to our{" "}
        <Link
          href="/legal/terms"
          className="font-semibold text-forest underline decoration-line underline-offset-2 transition hover:decoration-forest"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/legal/privacy"
          className="font-semibold text-forest underline decoration-line underline-offset-2 transition hover:decoration-forest"
        >
          Privacy Policy
        </Link>
        . Healthy Meal provides general nutrition guidance, not medical advice.
      </p>
    </div>
  );
}
