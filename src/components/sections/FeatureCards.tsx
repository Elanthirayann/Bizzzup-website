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

/* ── Card data ── */

interface FeatureCard {
  icon: string;
  tag: string;
  title: string;
  description: string;
}

const CARDS: FeatureCard[] = [
  {
    icon: "\u26A1",
    tag: "Design Intelligence",
    title: "Design Assist",
    description:
      "AI-powered design intelligence that transforms briefs into production-ready brand assets in minutes.",
  },
  {
    icon: "\u2726",
    tag: "Generative Media",
    title: "Storytelling AI",
    description:
      "Generative media engine that turns concepts into compelling narratives across text, image, and video.",
  },
  {
    icon: "\u25C8",
    tag: "Multi-Agent Systems",
    title: "Agentic Lead Gen",
    description:
      "Multi-agent orchestration that researches, qualifies, and engages prospects autonomously.",
  },
  {
    icon: "\u2B21",
    tag: "Document Intelligence",
    title: "Smart RAG Platform",
    description:
      "Enterprise-grade retrieval-augmented generation that makes your documents searchable and actionable.",
  },
];

/* ── Single card ── */

function Card({
  card,
  prefersReduced,
}: {
  card: FeatureCard;
  prefersReduced: boolean | null;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      variants={prefersReduced ? undefined : fadeUpBlurVariants}
      className="group clip-corner-card relative flex flex-col gap-4 p-6 sm:p-8 lg:p-10 bg-bg-card border border-border"
      whileHover={
        !prefersReduced
          ? {
              y: -3,
              borderColor: "var(--color-border-hover)",
              boxShadow: "0 4px 24px color-mix(in srgb, var(--color-text-primary) 6%, transparent)",
              transition: { type: "spring", stiffness: 300, damping: 20 },
            }
          : undefined
      }
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      {/* Top-edge glow line on hover */}
      <motion.span
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, var(--color-accent-1), transparent)",
          transformOrigin: "left",
        }}
        animate={
          !prefersReduced
            ? { scaleX: hovered ? 1 : 0, opacity: hovered ? 0.6 : 0 }
            : {}
        }
        transition={{ duration: 0.4, ease: "easeOut" }}
        aria-hidden="true"
      />

      {/* Icon with hover wiggle */}
      <motion.span
        className="flex h-9 w-9 items-center justify-center text-base rounded-md bg-accent-glow text-accent-1"
        animate={
          !prefersReduced && hovered
            ? { rotate: [0, -10, 10, 0], scale: [1, 1.15, 1] }
            : { rotate: 0, scale: 1 }
        }
        transition={{ duration: 0.5, ease: "easeOut" }}
        aria-hidden="true"
      >
        {card.icon}
      </motion.span>

      {/* Tag */}
      <span className="mt-1 font-mono text-[0.65rem] font-medium uppercase tracking-[0.12em] text-accent-2">
        {card.tag}
      </span>

      {/* Title */}
      <h3
        className="font-display font-[800] leading-[1.25] text-text-primary -mt-0.5 tracking-[-0.01em]"
        style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.6rem)" }}
      >
        {card.title}
      </h3>

      {/* Description */}
      <p className="mt-auto text-[1rem] leading-[1.7] text-text-secondary">
        {card.description}
      </p>
    </motion.div>
  );
}

/* ── Section ── */

export default function FeatureCards() {
  const ref = useRef<HTMLElement>(null);
  const [isInView, replayKey] = useReplay(ref, { margin: "-80px" });
  const prefersReduced = useReducedMotion();

  return (
    <section
      ref={ref}
      id="solutions"
      className="relative py-10 sm:py-12 lg:py-14 bg-bg-surface"
    >
      <motion.div
        key={replayKey}
        className="mx-auto max-w-[1400px] px-6 lg:px-10"
        variants={prefersReduced ? undefined : containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* Section heading */}
        <div className="mb-10 sm:mb-12 lg:mb-16 max-w-2xl">
          {/* Label */}
          <motion.div
            variants={prefersReduced ? undefined : fadeUpVariants}
            className="flex items-center gap-3 mb-6"
          >
            <motion.span
              variants={prefersReduced ? undefined : scaleLineVariants}
              className="block h-px w-[30px] bg-accent-1"
            />
            <span className="font-mono text-[0.75rem] font-medium uppercase tracking-[0.14em] text-accent-1">
              Capabilities
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            variants={prefersReduced ? undefined : fadeUpVariants}
            className="font-display font-[800] leading-[1.15] text-text-primary mb-5"
            style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)" }}
          >
            Built for teams that ship{" "}
            <span className="gradient-text italic">faster</span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            variants={prefersReduced ? undefined : fadeUpVariants}
            className="text-[1.1rem] leading-[1.75] text-text-secondary max-w-[540px]"
          >
            Production-grade AI products, each designed to solve a real
            business problem — not a demo.
          </motion.p>
        </div>

        {/* Card grid */}
        <motion.div
          variants={
            prefersReduced
              ? undefined
              : {
                  hidden: {},
                  visible: {
                    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
                  },
                }
          }
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6"
        >
          {CARDS.map((card) => (
            <Card
              key={card.title}
              card={card}
              prefersReduced={prefersReduced}
            />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
