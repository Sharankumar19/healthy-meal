"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function CursorGlow() {
  const reduceMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(-500);
  const y = useMotionValue(-500);
  const springX = useSpring(x, { stiffness: 60, damping: 18, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 60, damping: 18, mass: 0.6 });

  useEffect(() => {
    if (reduceMotion) return;
    const finePointer = window.matchMedia("(pointer: fine)");
    if (!finePointer.matches) return;
    setEnabled(true);

    function onMove(event: PointerEvent) {
      x.set(event.clientX - 260);
      y.set(event.clientY - 260);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduceMotion, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[60] hidden size-[520px] rounded-full opacity-[0.22] mix-blend-multiply blur-[80px] lg:block"
      style={{
        x: springX,
        y: springY,
        background:
          "radial-gradient(circle at center, rgba(197,237,121,0.9) 0%, rgba(104,185,132,0.35) 45%, transparent 70%)",
      }}
    />
  );
}
