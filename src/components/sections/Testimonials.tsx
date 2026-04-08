"use client";

import React, { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  useReplay,
  containerVariants,
  fadeUpVariants,
  fadeUpBlurVariants,
  scaleLineVariants,
} from "@/lib/animations";
import ParallaxLayer from "@/components/ui/ParallaxLayer";

/* ── Data ── */

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  accent: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Bizzzup cut our content production timeline from weeks to days. The AI-generated brand assets are indistinguishable from our in-house work.",
    name: "Priya Menon",
    role: "Head of Marketing",
    company: "Nexora",
    accent: "var(--color-accent-1)",
  },
  {
    quote:
      "Their RAG platform replaced three internal tools. Search accuracy jumped 40% and our support team handles twice the volume now.",
    name: "Daniel Okoro",
    role: "VP of Engineering",
    company: "Tessera Health",
    accent: "var(--color-accent-2)",
  },
  {
    quote:
      "The agentic lead-gen system books more qualified meetings than our SDR team did manually. ROI was clear within the first month.",
    name: "Sarah Lin",
    role: "Revenue Operations",
    company: "Arcline",
    accent: "var(--color-accent-3)",
  },
];

/* ── Card ── */

function TestimonialCard({
  t,
  prefersReduced,
}: {
  t: Testimonial;
  prefersReduced: boolean | null;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.blockquote
      variants={prefersReduced ? undefined : fadeUpBlurVariants}
      className="clip-corner-card relative flex flex-col justify-between p-7 sm:p-9 bg-bg-card border border-border"
      whileHover={
        prefersReduced
          ? undefined
          : {
              y: -6,
              borderColor: "var(--color-border-hover)",
              boxShadow: "0 12px 40px var(--color-accent-glow)",
            }
      }
      transition={
        prefersReduced
          ? undefined
          : { type: "spring", stiffness: 300, damping: 20 }
      }
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      {/* Accent bar with animated height */}
      <motion.span
        className="absolute left-0 top-6 w-[3px] rounded-r-full"
        style={{ background: t.accent, opacity: 0.5 }}
        animate={{ height: hovered && !prefersReduced ? 60 : 40 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        aria-hidden="true"
      />

      {/* Decorative quote mark */}
      <span
        className="absolute top-3 right-5 font-display text-[5rem] leading-none text-text-primary opacity-[0.06] pointer-events-none select-none"
        aria-hidden="true"
      >
        &ldquo;
      </span>

      {/* Quote */}
      <p className="mb-8 text-[1.05rem] leading-[1.8] text-text-secondary">
        &ldquo;{t.quote}&rdquo;
      </p>

      {/* Attribution */}
      <footer className="mt-auto flex items-center gap-3">
        {/* Avatar with rotating ring */}
        <motion.div
          className="shrink-0"
          style={{
            width: 41,
            height: 41,
            borderRadius: "50%",
            padding: 2,
            background: `conic-gradient(${t.accent}, var(--color-accent-glow), ${t.accent})`,
          }}
          animate={prefersReduced ? undefined : { rotate: 360 }}
          transition={
            prefersReduced
              ? undefined
              : { duration: 8, repeat: Infinity, ease: "linear" }
          }
        >
          <span
            className="flex h-full w-full items-center justify-center rounded-full text-xs font-bold bg-bg-card font-display"
            style={{ color: t.accent }}
            aria-hidden="true"
          >
            {t.name.charAt(0)}
          </span>
        </motion.div>
        <div>
          <p className="font-display text-[0.95rem] font-bold leading-tight text-text-primary">
            {t.name}
          </p>
          <p className="font-mono text-[0.78rem] text-text-muted tracking-[0.04em]">
            {t.role}, {t.company}
          </p>
        </div>
      </footer>
    </motion.blockquote>
  );
}

/* ── Section ── */

export default function Testimonials() {
  const ref = useRef<HTMLElement>(null);
  const [isInView, replayKey] = useReplay(ref, { margin: "-80px" });
  const prefersReduced = useReducedMotion();

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-10 sm:py-12 lg:py-14 bg-bg-surface"
    >
      <ParallaxLayer
        scrollTargetRef={ref}
        range={32}
        invert
        className="pointer-events-none absolute -left-[10%] top-1/4 h-[min(60vw,380px)] w-[min(60vw,380px)] rounded-full opacity-[0.06]"
      >
        <div
          className="h-full w-full rounded-full"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--color-accent-1) 35%, transparent), transparent 70%)",
          }}
        />
      </ParallaxLayer>
      <ParallaxLayer
        scrollTargetRef={ref}
        range={42}
        className="pointer-events-none absolute -right-[8%] bottom-[10%] h-[min(55vw,340px)] w-[min(55vw,340px)] rounded-full opacity-[0.05]"
      >
        <div
          className="h-full w-full rounded-full"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--color-accent-2) 40%, transparent), transparent 70%)",
          }}
        />
      </ParallaxLayer>

      <motion.div
        key={replayKey}
        className="relative z-[1] mx-auto max-w-[1400px] px-6 lg:px-10"
        variants={prefersReduced ? undefined : containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* Section heading */}
        <motion.div
          variants={prefersReduced ? undefined : fadeUpVariants}
          className="mb-10 sm:mb-12 lg:mb-14 max-w-2xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <motion.span
              variants={prefersReduced ? undefined : scaleLineVariants}
              className="block h-px w-[30px] bg-accent-1"
            />
            <span className="font-mono text-[0.75rem] font-medium uppercase tracking-[0.14em] text-accent-1">
              Testimonials
            </span>
          </div>

          <h2
            className="font-display font-[800] leading-[1.15] text-text-primary mb-5"
            style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)" }}
          >
            Trusted by teams building the{" "}
            <span className="gradient-text shimmer italic">future</span>
          </h2>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={
            prefersReduced
              ? undefined
              : {
                  hidden: {},
                  visible: {
                    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
                  },
                }
          }
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6"
        >
          {TESTIMONIALS.map((t) => (
            <TestimonialCard
              key={t.name}
              t={t}
              prefersReduced={prefersReduced}
            />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
