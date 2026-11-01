"use client";

import { motion } from "framer-motion";
import { Ruler, Weight } from "lucide-react";
import { useState } from "react";
import { Segmented } from "@/components/ui/Segmented";
import type { HeightUnit, WeightUnit } from "@/lib/types";
import {
  cmToFeetInches,
  cn,
  feetInchesToCm,
  kgToLb,
  lbToKg,
} from "@/lib/utils";

function LabelRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-2 flex items-center justify-between gap-3">
      <span className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-muted">
        {label}
      </span>
      {children}
    </div>
  );
}

const inputBoxClass =
  "h-[60px] w-full rounded-2xl border border-line bg-white/85 px-4 font-display text-[1.35rem] font-bold tracking-[-0.02em] text-charcoal outline-none transition-all duration-200 placeholder:text-muted/35 focus:border-fresh focus:bg-white focus:shadow-[0_0_0_4px_rgba(104,185,132,0.12)]";

export function HeightField({
  value,
  onChange,
  error,
}: {
  value: number;
  onChange: (cm: number) => void;
  error?: string;
}) {
  const [unit, setUnit] = useState<HeightUnit>("cm");
  const [cmText, setCmText] = useState(value ? String(Math.round(value)) : "");
  const initialImperial = cmToFeetInches(value || 0);
  const [feetText, setFeetText] = useState(
    value ? String(initialImperial.feet) : "",
  );
  const [inchesText, setInchesText] = useState(
    value ? String(initialImperial.inches) : "",
  );

  function switchUnit(next: HeightUnit) {
    setUnit(next);
    if (next === "ft") {
      const imperial = cmToFeetInches(value || 0);
      setFeetText(value ? String(imperial.feet) : "");
      setInchesText(value ? String(imperial.inches) : "");
    } else {
      setCmText(value ? String(Math.round(value)) : "");
    }
  }

  function updateCm(raw: string) {
    setCmText(raw);
    const parsed = Number(raw);
    onChange(Number.isFinite(parsed) && parsed > 0 ? parsed : 0);
  }

  function updateImperial(nextFeet: string, nextInches: string) {
    setFeetText(nextFeet);
    setInchesText(nextInches);
    const feet = Number(nextFeet);
    const inches = Number(nextInches);
    if (!nextFeet && !nextInches) {
      onChange(0);
      return;
    }
    onChange(
      feetInchesToCm(
        Number.isFinite(feet) ? feet : 0,
        Number.isFinite(inches) ? inches : 0,
      ),
    );
  }

  const preview =
    unit === "cm"
      ? value
        ? `${cmToFeetInches(value).feet}′ ${cmToFeetInches(value).inches}″`
        : "Add your height"
      : value
        ? `${Math.round(value)} cm`
        : "Add your height";

  return (
    <div>
      <LabelRow label="Height">
        <Segmented
          ariaLabel="Height unit"
          size="sm"
          value={unit}
          onChange={switchUnit}
          options={[
            { value: "cm", label: "CM" },
            { value: "ft", label: "FT / IN" },
          ]}
        />
      </LabelRow>
      <div className={cn(unit === "ft" ? "grid grid-cols-2 gap-2.5" : "")}>
        {unit === "cm" ? (
          <div className="relative">
            <Ruler className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-fresh" />
            <input
              type="number"
              inputMode="numeric"
              aria-label="Height in centimetres"
              aria-invalid={Boolean(error)}
              placeholder="175"
              value={cmText}
              onChange={(event) => updateCm(event.target.value)}
              className={cn(inputBoxClass, "pl-11 pr-14")}
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[0.72rem] font-semibold text-muted">
              cm
            </span>
          </div>
        ) : (
          <>
            <div className="relative">
              <input
                type="number"
                inputMode="numeric"
                aria-label="Height in feet"
                aria-invalid={Boolean(error)}
                placeholder="5"
                value={feetText}
                onChange={(event) => updateImperial(event.target.value, inchesText)}
                className={cn(inputBoxClass, "pr-10")}
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[0.72rem] font-semibold text-muted">
                ft
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                inputMode="numeric"
                aria-label="Height in inches"
                aria-invalid={Boolean(error)}
                placeholder="9"
                value={inchesText}
                onChange={(event) => updateImperial(feetText, event.target.value)}
                className={cn(inputBoxClass, "pr-10")}
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[0.72rem] font-semibold text-muted">
                in
              </span>
            </div>
          </>
        )}
      </div>
      <div className="mt-1.5 flex items-center justify-between gap-2 pl-1">
        <p className="text-[0.7rem] text-muted">{preview}</p>
        {error ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[0.7rem] font-medium text-tomato"
            role="alert"
          >
            {error}
          </motion.p>
        ) : null}
      </div>
    </div>
  );
}

export function WeightField({
  value,
  onChange,
  error,
}: {
  value: number;
  onChange: (kg: number) => void;
  error?: string;
}) {
  const [unit, setUnit] = useState<WeightUnit>("kg");
  const [kgText, setKgText] = useState(value ? String(Math.round(value)) : "");
  const [lbText, setLbText] = useState(value ? String(Math.round(kgToLb(value))) : "");

  function switchUnit(next: WeightUnit) {
    setUnit(next);
    if (next === "lb") {
      setLbText(value ? String(Math.round(kgToLb(value))) : "");
    } else {
      setKgText(value ? String(Math.round(value)) : "");
    }
  }

  function updateKg(raw: string) {
    setKgText(raw);
    const parsed = Number(raw);
    onChange(Number.isFinite(parsed) && parsed > 0 ? parsed : 0);
  }

  function updateLb(raw: string) {
    setLbText(raw);
    const parsed = Number(raw);
    onChange(Number.isFinite(parsed) && parsed > 0 ? lbToKg(parsed) : 0);
  }

  return (
    <div>
      <LabelRow label="Weight">
        <Segmented
          ariaLabel="Weight unit"
          size="sm"
          value={unit}
          onChange={switchUnit}
          options={[
            { value: "kg", label: "KG" },
            { value: "lb", label: "LB" },
          ]}
        />
      </LabelRow>
      <div className="relative">
        <Weight className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-fresh" />
        <input
          type="number"
          inputMode="decimal"
          aria-label={`Weight in ${unit === "kg" ? "kilograms" : "pounds"}`}
          aria-invalid={Boolean(error)}
          placeholder={unit === "kg" ? "68" : "150"}
          value={unit === "kg" ? kgText : lbText}
          onChange={(event) =>
            unit === "kg" ? updateKg(event.target.value) : updateLb(event.target.value)
          }
          className={cn(inputBoxClass, "pl-11 pr-14")}
        />
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[0.72rem] font-semibold text-muted">
          {unit}
        </span>
      </div>
      <div className="mt-1.5 flex items-center justify-between gap-2 pl-1">
        <p className="text-[0.7rem] text-muted">
          {value
            ? unit === "kg"
              ? `≈ ${Math.round(kgToLb(value))} lb`
              : `≈ ${Math.round(value)} kg`
            : "Add your current weight"}
        </p>
        {error ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[0.7rem] font-medium text-tomato"
            role="alert"
          >
            {error}
          </motion.p>
        ) : null}
      </div>
    </div>
  );
}
