"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  motion,
  useReducedMotion,
} from "framer-motion";
import { useReplay, containerVariants, fadeUpVariants, EXPO_OUT } from "@/lib/animations";

/* ── Data ── */

interface Stat {
  value: number;
  suffix: string;
  label: string;
  accent: string;
}

const STATS: Stat[] = [
  { value: 150, suffix: "+", label: "AI models deployed", accent: "var(--color-accent-1)" },
  { value: 40, suffix: "ms", label: "Avg. response latency", accent: "var(--color-accent-2)" },
  { value: 99.9, suffix: "%", label: "Uptime guarantee", accent: "var(--color-accent-1)" },
  { value: 12, suffix: "x", label: "Faster than manual workflows", accent: "var(--color-accent-3)" },
];

/* ── Count-up hook ── */

function useCountUp(target: number, active: boolean, duration = 1600) {
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState(false);
  const isFloat = target % 1 !== 0;

  const animate = useCallback(() => {
    setDone(false);
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      setCurrent(
        isFloat
          ? parseFloat((eased * target).toFixed(1))
          : Math.round(eased * target)
      );
      if (elapsed < 1) {
        requestAnimationFrame(step);
      } else {
        setDone(true);
      }
    };
    requestAnimationFrame(step);
  }, [target, duration, isFloat]);

  useEffect(() => {
    if (active) animate();
  }, [active, animate]);

  return { current, done };
}

/* ── Single stat ── */

function StatItem({
  stat,
  active,
  prefersReduced,
}: {
  stat: Stat;
  active: boolean;
  prefersReduced: boolean | null;
}) {
  const { current: count, done } = useCountUp(stat.value, active);

  return (
    <div className="relative flex flex-col items-center text-center">
      <p
        className="font-display font-[800] leading-none relative whitespace-nowrap"
        style={{
          fontSize: "clamp(2.8rem, 6.5vw, 4rem)",
          color: stat.accent,
          letterSpacing: "-0.02em",
        }}
      >
        {/* Number — brief scale pop on completion instead of textShadow */}
        <motion.span
          animate={!prefersReduced && done ? { scale: [1, 1.06, 1] } : {}}
          transition={{ duration: 0.45, ease: "easeOut" }}
          style={{ display: "inline-block" }}
        >
          {count}
        </motion.span>

        {/* Suffix bounces in */}
        <motion.span
          className="text-[0.6em] inline-block align-middle"
          animate={
            prefersReduced
              ? { opacity: 1, scale: 1 }
              : {
                  scale: done ? [0, 1.3, 1] : 0,
                  opacity: done ? 1 : 0,
                }
          }
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {stat.suffix}
        </motion.span>
      </p>
      <p className="font-mono text-[0.8rem] font-medium uppercase tracking-[0.12em] text-text-muted mt-3">
        {stat.label}
      </p>
    </div>
  );
}

/* ── Section ── */

export default function Stats() {
  const ref = useRef<HTMLElement>(null);
  const [isInView, replayKey] = useReplay(ref, { margin: "-60px" });
  const prefersReduced = useReducedMotion();

  return (
    <section
      ref={ref}
      className="relative py-8 sm:py-10 lg:py-12 bg-bg-deep"
    >
      {/* Top / bottom divider lines — static, no infinite loop */}
      <span
        className="absolute inset-x-0 top-0 mx-auto block h-px max-w-[1400px] opacity-40"
        style={{
          background:
            "linear-gradient(to right, transparent, var(--color-border), transparent)",
        }}
        aria-hidden="true"
      />
      <span
        className="absolute inset-x-0 bottom-0 mx-auto block h-px max-w-[1400px] opacity-40"
        style={{
          background:
            "linear-gradient(to right, transparent, var(--color-border), transparent)",
        }}
        aria-hidden="true"
      />

      <motion.div
        key={replayKey}
        className="mx-auto max-w-[1400px] px-6 lg:px-10"
        variants={prefersReduced ? undefined : containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <div className="grid grid-cols-2 gap-10 sm:gap-12 lg:grid-cols-4 lg:gap-8">
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={prefersReduced ? undefined : fadeUpVariants}
            >
              <StatItem
                stat={stat}
                active={isInView}
                prefersReduced={prefersReduced}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
