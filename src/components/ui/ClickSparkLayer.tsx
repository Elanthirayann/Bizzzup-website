"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EXPO_OUT } from "@/lib/animations";

export type ClickSparkLayerProps = {
  sparkColor?: string;
  /** Dash length along each ray (user units ≈ px) */
  sparkSize?: number;
  /** How far each ray travels outward */
  sparkRadius?: number;
  innerGap?: number;
  sparkCount?: number;
  /** Seconds — tween duration, same family as hero / Pretext polish */
  duration?: number;
  extraScale?: number;
  strokeWidth?: number;
  /** Ms stagger between rays for a softer burst */
  staggerMs?: number;
};

type Burst = { id: number; x: number; y: number };

let burstId = 0;

/**
 * Click spark: 8 radial dashes with center gap, motion-tweened with EXPO_OUT + light stagger
 * so it feels closer to the smooth hero / Pretext motion than raw CSS keyframes.
 */
export default function ClickSparkLayer({
  sparkColor = "var(--color-text-primary)",
  sparkSize = 9,
  sparkRadius = 17,
  innerGap = 6,
  sparkCount = 8,
  duration = 0.48,
  extraScale = 1,
  strokeWidth = 2.5,
  staggerMs = 14,
}: ClickSparkLayerProps) {
  const reduced = useReducedMotion() ?? false;
  const [bursts, setBursts] = useState<Burst[]>([]);

  const inner = innerGap * extraScale;
  const dashLen = sparkSize * extraScale;
  const travel = sparkRadius * extraScale;
  const half = Math.ceil(inner + dashLen + travel + 8);

  useEffect(() => {
    if (reduced) return;

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      const el = e.target as HTMLElement;
      if (el.closest("[data-no-click-spark]")) return;
      if (el.closest("input, textarea, select, [contenteditable=true]")) return;

      const id = ++burstId;
      setBursts((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);
      const settleMs =
        duration * 1000 + (sparkCount - 1) * staggerMs + 120;
      window.setTimeout(() => {
        setBursts((prev) => prev.filter((b) => b.id !== id));
      }, settleMs);
    };

    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [reduced, duration, sparkCount, staggerMs]);

  if (reduced) return null;

  const vb = half * 2;

  return (
    <>
      {bursts.map((b) => (
        <svg
          key={b.id}
          className="pointer-events-none fixed z-[600] overflow-visible"
          width={vb}
          height={vb}
          viewBox={`${-half} ${-half} ${vb} ${vb}`}
          style={{
            left: b.x - half,
            top: b.y - half,
          }}
          aria-hidden
        >
          {Array.from({ length: sparkCount }, (_, i) => {
            const a = (i / sparkCount) * Math.PI * 2;
            const c = Math.cos(a);
            const s = Math.sin(a);
            const x1 = c * inner;
            const y1 = s * inner;
            const x2 = c * (inner + dashLen);
            const y2 = s * (inner + dashLen);
            const dx = c * travel;
            const dy = s * travel;
            return (
              <motion.g
                key={i}
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{ x: dx, y: dy, opacity: 0 }}
                transition={{
                  duration,
                  ease: EXPO_OUT,
                  delay: (i * staggerMs) / 1000,
                }}
              >
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={sparkColor}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                />
              </motion.g>
            );
          })}
        </svg>
      ))}
    </>
  );
}
