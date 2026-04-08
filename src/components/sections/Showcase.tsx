"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { EXPO_OUT } from "@/lib/animations";
import ShowcaseOrchestratorGraph from "@/components/ui/ShowcaseOrchestratorGraph";
import ParallaxLayer from "@/components/ui/ParallaxLayer";

/* ── Rotating word (CSS transition — immune to parent motion context) ── */

const ROTATE_WORDS = ["mark", "impact", "legacy", "statement"];

function RotatingWord() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % ROTATE_WORDS.length);
        setVisible(true);
      }, 300);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <span
      className="gradient-text font-[800] transition-opacity duration-300 ease-out"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {ROTATE_WORDS[index]}
    </span>
  );
}

/* ── Stats data ── */

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
  { value: 12, suffix: "x", label: "Faster than manual", accent: "var(--color-accent-3)" },
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

/* ── Stat item with glow ── */

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
          fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
          color: stat.accent,
          letterSpacing: "-0.02em",
        }}
      >
        <motion.span
          animate={!prefersReduced && done ? { scale: [1, 1.06, 1] } : {}}
          transition={{ duration: 0.45, ease: "easeOut" }}
          style={{ display: "inline-block" }}
        >
          {count}
        </motion.span>
        <motion.span
          className="text-[0.6em] inline-block"
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
      <p className="font-mono text-[0.75rem] font-medium uppercase tracking-[0.1em] text-text-muted mt-1.5">
        {stat.label}
      </p>
    </div>
  );
}

/* ── Main section ── */

export default function Showcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const prefersReduced = useReducedMotion();

  return (
    <section
      ref={sectionRef}
      id="showcase"
      className="relative py-10 sm:py-12 lg:py-14 bg-bg-deep overflow-hidden"
    >
      <ParallaxLayer
        scrollTargetRef={sectionRef}
        range={44}
        invert
        className="pointer-events-none absolute -right-[12%] top-[8%] h-[min(70vw,480px)] w-[min(70vw,480px)] rounded-full opacity-[0.055]"
      >
        <div
          className="h-full w-full rounded-full"
          style={{
            background:
              "radial-gradient(circle, var(--color-accent-1), transparent 72%)",
          }}
        />
      </ParallaxLayer>
      <ParallaxLayer
        scrollTargetRef={sectionRef}
        range={36}
        className="pointer-events-none absolute -left-[18%] bottom-[5%] h-[min(65vw,420px)] w-[min(65vw,420px)] rounded-full opacity-[0.045]"
      >
        <div
          className="h-full w-full rounded-full"
          style={{
            background:
              "radial-gradient(circle, var(--color-accent-3), transparent 72%)",
          }}
        />
      </ParallaxLayer>

      <div className="relative z-[1] max-w-[1400px] mx-auto px-6 lg:px-10">
        {/* Two-column responsive grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Visual side — abstract constellation */}
          <motion.div
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, x: "-5vw" }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: EXPO_OUT }}
          >
            <ShowcaseOrchestratorGraph
              prefersReduced={prefersReduced}
              inView={isInView}
            />
          </motion.div>

          {/* Text side */}
          <motion.div
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, x: "5vw" }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: EXPO_OUT }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="block h-px w-[30px] bg-accent-1" />
              <span className="font-mono text-[0.75rem] font-medium uppercase tracking-[0.14em] text-accent-1">
                Showcase
              </span>
            </div>

            <h2
              className="font-display font-[800] leading-[1.15] text-text-primary mb-5"
              style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)" }}
            >
              Experiences that{" "}
              <span className="whitespace-nowrap">
                leave a{" "}
                <span className="italic">
                  <RotatingWord />
                </span>
              </span>
            </h2>

            <p className="text-lg lg:text-xl leading-[1.75] text-text-secondary mb-10 max-w-lg">
              We craft digital experiences that perform under pressure — sub-40ms
              responses, 99.9% uptime, and interfaces that feel alive. Every pixel,
              every prompt, every pipeline is built to ship and scale.
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {STATS.map((stat) => (
                <StatItem
                  key={stat.label}
                  stat={stat}
                  active={isInView}
                  prefersReduced={prefersReduced}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
