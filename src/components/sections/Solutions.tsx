"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  useReducedMotion,
  useInView,
} from "framer-motion";
import { EXPO_OUT } from "@/lib/animations";
import { useIsMobile } from "@/hooks/useIsMobile";

/* ── Rotating headline words ── */

const ROTATE_WORDS = ["real outcomes.", "real results.", "real impact.", "real growth."];

function RotatingHeadlineWord() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      /* Fade out, swap word, fade in */
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % ROTATE_WORDS.length);
        setVisible(true);
      }, 300);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <span
      className="gradient-text font-[800] transition-all duration-300 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        filter: visible ? "blur(0px)" : "blur(4px)",
      }}
    >
      {ROTATE_WORDS[index]}
    </span>
  );
}

/* ── Solution data ── */

interface Solution {
  id: string;
  number: string;
  tag: string;
  title: string;
  headline: string;
  description: string;
  capabilities: string[];
  accent: string;
}

const SOLUTIONS: Solution[] = [
  {
    id: "ai-agents",
    number: "01",
    tag: "AI Automation",
    title: "AI Agents",
    headline: "Intelligent agents for every workflow",
    description:
      "Custom agents for research, support, sales, operations, and internal workflows.",
    capabilities: ["Research Agents", "Support Bots", "Sales Automation", "Operations AI"],
    accent: "var(--color-accent-1)",
  },
  {
    id: "workflow-automation",
    number: "02",
    tag: "Process Optimization",
    title: "Workflow Automation",
    headline: "Less manual work, more output",
    description:
      "Automate repetitive tasks, reduce manual work, and improve execution speed.",
    capabilities: ["Task Automation", "Process Streamlining", "Speed Optimization", "Error Reduction"],
    accent: "var(--color-accent-2)",
  },
  {
    id: "custom-software",
    number: "03",
    tag: "Development",
    title: "Custom Software",
    headline: "Built around your business",
    description:
      "Web platforms, dashboards, internal tools, and business systems built around your needs.",
    capabilities: ["Web Platforms", "Dashboards", "Internal Tools", "Business Systems"],
    accent: "var(--color-accent-3)",
  },
  {
    id: "ai-product-dev",
    number: "04",
    tag: "Product Engineering",
    title: "AI Product Development",
    headline: "From idea to deployed product",
    description:
      "End-to-end development of AI-powered products from idea to deployment.",
    capabilities: ["Ideation", "Prototyping", "Development", "Deployment"],
    accent: "var(--color-accent-1)",
  },
  {
    id: "model-development",
    number: "05",
    tag: "Machine Learning",
    title: "Model Development",
    headline: "Custom models for your use case",
    description:
      "Fine-tuning, optimization, and custom model pipelines for specific use cases.",
    capabilities: ["Fine-Tuning", "Model Optimization", "Custom Pipelines", "Performance Tuning"],
    accent: "var(--color-accent-2)",
  },
  {
    id: "integrations-deployment",
    number: "06",
    tag: "Infrastructure",
    title: "Integrations and Deployment",
    headline: "Connect, launch, and go live",
    description:
      "Connect your systems, launch smoothly, and make the solution production-ready.",
    capabilities: ["System Integration", "CI/CD Pipelines", "Production Setup", "Monitoring"],
    accent: "var(--color-accent-1)",
  },
];

const SLIDE_COUNT = SOLUTIONS.length;
/** Time on each slide before auto-advancing (manual controls reset this timer). */
const CAROUSEL_AUTOPLAY_MS = 4000;
const EASE = EXPO_OUT as [number, number, number, number];

/* ── Per-card themed visuals ── */

/* 01 — Design Assist: layout grid blocks that assemble */
function VisualDesignAssist({ accent, isActive, reduced }: { accent: string; isActive: boolean; reduced: boolean }) {
  const blocks = [
    { x: 0, y: 0, w: 72, h: 44, delay: 0, fill: true },
    { x: 80, y: 0, w: 44, h: 44, delay: 0.08, fill: false },
    { x: 0, y: 52, w: 44, h: 68, delay: 0.14, fill: false },
    { x: 52, y: 52, w: 72, h: 32, delay: 0.2, fill: true },
    { x: 52, y: 92, w: 72, h: 28, delay: 0.26, fill: false },
    { x: 132, y: 0, w: 28, h: 120, delay: 0.12, fill: true },
  ];

  return (
    <div className="absolute" style={{ right: "3%", top: "50%", marginTop: "-75px", width: "195px", height: "150px" }}>
      {blocks.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-md"
          style={{
            left: b.x,
            top: b.y,
            width: b.w,
            height: b.h,
            border: `2px solid color-mix(in srgb, ${accent} 50%, transparent)`,
            background: b.fill
              ? `color-mix(in srgb, ${accent} 15%, transparent)`
              : `color-mix(in srgb, ${accent} 6%, transparent)`,
          }}
          animate={reduced ? {} : {
            opacity: isActive ? 1 : 0,
            scale: isActive ? 1 : 0.85,
            y: isActive ? 0 : 10,
          }}
          transition={{ duration: 0.5, ease: EXPO_OUT, delay: isActive ? b.delay + 0.35 : 0 }}
        />
      ))}
      {/* Color swatch row */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={`swatch-${i}`}
          className="absolute rounded"
          style={{
            bottom: -20,
            left: 6 + i * 24,
            width: 18,
            height: 18,
            background: i === 0 ? accent : `color-mix(in srgb, ${accent} ${60 - i * 18}%, var(--color-border))`,
          }}
          animate={reduced ? {} : {
            opacity: isActive ? (i === 0 ? 0.9 : 0.55) : 0,
            scale: isActive ? 1 : 0.5,
          }}
          transition={{ duration: 0.4, ease: EXPO_OUT, delay: isActive ? 0.55 + i * 0.06 : 0 }}
        />
      ))}
      {/* Brush stroke accent */}
      <motion.div
        className="absolute rounded-full"
        style={{
          bottom: -18,
          left: 82,
          width: 76,
          height: 5,
          background: `linear-gradient(90deg, ${accent}, transparent)`,
          transformOrigin: "left",
        }}
        animate={reduced ? {} : { scaleX: isActive ? 1 : 0, opacity: isActive ? 0.7 : 0 }}
        transition={{ duration: 0.6, ease: EXPO_OUT, delay: isActive ? 0.65 : 0 }}
      />
    </div>
  );
}

/* 02 — Storytelling AI: text paragraph typing in */
function VisualStorytellingAI({ accent, isActive, reduced }: { accent: string; isActive: boolean; reduced: boolean }) {
  const lines = [
    { width: "90%", delay: 0, isHeading: true },
    { width: "55%", delay: 0.06, isHeading: true },
    { width: "98%", delay: 0.14 },
    { width: "70%", delay: 0.2 },
    { width: "88%", delay: 0.26 },
    { width: "55%", delay: 0.32 },
    { width: "80%", delay: 0.38 },
  ];

  return (
    <div className="absolute flex flex-col gap-[7px]" style={{ right: "3%", top: "50%", marginTop: "-72px", width: "180px" }}>
      {lines.map((line, i) => (
        <motion.div
          key={i}
          className="rounded origin-left"
          style={{
            height: line.isHeading ? 10 : 6,
            width: line.width,
            background: line.isHeading
              ? accent
              : `color-mix(in srgb, ${accent} ${55 - i * 4}%, var(--color-border))`,
            marginBottom: i === 1 ? 6 : 0,
          }}
          animate={reduced ? {} : {
            scaleX: isActive ? 1 : 0,
            opacity: isActive ? (line.isHeading ? 0.9 : 0.7) : 0,
          }}
          transition={{ duration: 0.45, ease: EXPO_OUT, delay: isActive ? line.delay + 0.4 : 0 }}
        />
      ))}
      {/* Blinking cursor */}
      <motion.div
        className="absolute rounded-sm"
        style={{
          width: 3,
          height: 22,
          background: accent,
          top: -3,
          right: "10%",
        }}
        animate={reduced ? {} : {
          opacity: isActive ? [0.9, 0.1, 0.9] : 0,
        }}
        transition={isActive ? { duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.8 } : { duration: 0.2 }}
      />
    </div>
  );
}

/* 03 — Agentic Lead Gen: network nodes with connecting signal lines */
function VisualAgenticLeadGen({ accent, isActive, reduced }: { accent: string; isActive: boolean; reduced: boolean }) {
  const nodes = [
    { cx: 90, cy: 16, r: 10, delay: 0, isHub: false },
    { cx: 16, cy: 60, r: 9, delay: 0.1, isHub: false },
    { cx: 168, cy: 55, r: 9, delay: 0.15, isHub: false },
    { cx: 55, cy: 120, r: 8, delay: 0.2, isHub: false },
    { cx: 130, cy: 124, r: 8, delay: 0.25, isHub: false },
    { cx: 90, cy: 65, r: 14, delay: 0.05, isHub: true },
  ];

  const edges = [
    { x1: 90, y1: 65, x2: 90, y2: 16, delay: 0.15 },
    { x1: 90, y1: 65, x2: 16, y2: 60, delay: 0.2 },
    { x1: 90, y1: 65, x2: 168, y2: 55, delay: 0.25 },
    { x1: 90, y1: 65, x2: 55, y2: 120, delay: 0.3 },
    { x1: 90, y1: 65, x2: 130, y2: 124, delay: 0.35 },
  ];

  return (
    <svg
      className="absolute"
      style={{ right: "1%", top: "50%", marginTop: "-75px" }}
      width="195"
      height="150"
      viewBox="0 0 195 150"
      fill="none"
    >
      {/* Connection lines */}
      {edges.map((e, i) => (
        <motion.line
          key={`e-${i}`}
          x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
          style={{ stroke: accent }}
          strokeWidth={2.5}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={reduced ? {} : {
            pathLength: isActive ? 1 : 0,
            opacity: isActive ? 0.6 : 0,
          }}
          transition={{ duration: 0.5, ease: EXPO_OUT, delay: isActive ? e.delay + 0.35 : 0 }}
        />
      ))}

      {/* Signal pulse from center */}
      <motion.circle
        cx={90} cy={65} r={16}
        style={{ fill: "none", stroke: accent, transformOrigin: "90px 65px" }}
        strokeWidth={2}
        animate={reduced ? {} : {
          scale: isActive ? [0.5, 2.2] : 0.5,
          opacity: isActive ? [0.6, 0] : 0,
        }}
        transition={isActive ? { duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.8 } : { duration: 0.2 }}
      />

      {/* Nodes */}
      {nodes.map((n, i) => (
        <motion.circle
          key={`n-${i}`}
          cx={n.cx} cy={n.cy} r={n.r}
          style={{ fill: n.isHub ? accent : `color-mix(in srgb, ${accent} 80%, transparent)`, transformOrigin: `${n.cx}px ${n.cy}px` }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={reduced ? {} : {
            opacity: isActive ? (n.isHub ? 0.95 : 0.7) : 0,
            scale: isActive ? 1 : 0.5,
          }}
          transition={{ duration: 0.4, ease: EXPO_OUT, delay: isActive ? n.delay + 0.35 : 0 }}
        />
      ))}

      {/* Hub inner ring */}
      <motion.circle
        cx={90} cy={65} r={7}
        style={{ fill: "var(--color-bg-card)", transformOrigin: "90px 65px" }}
        initial={{ opacity: 0 }}
        animate={reduced ? {} : {
          opacity: isActive ? 1 : 0,
        }}
        transition={{ duration: 0.35, ease: EXPO_OUT, delay: isActive ? 0.15 : 0 }}
      />
    </svg>
  );
}

/* 04 — Smart RAG: document stack with search query pulse */
function VisualSmartRAG({ accent, isActive, reduced }: { accent: string; isActive: boolean; reduced: boolean }) {
  const docs = [
    { x: 0, y: 14, w: 100, h: 120, delay: 0, fill: 6 },
    { x: 18, y: 7, w: 100, h: 120, delay: 0.06, fill: 10 },
    { x: 36, y: 0, w: 100, h: 120, delay: 0.12, fill: 14 },
  ];

  const queryLines = [
    { y: 22, w: 58, delay: 0.3, isResult: true },
    { y: 38, w: 72, delay: 0.36, isResult: false },
    { y: 52, w: 50, delay: 0.42, isResult: false },
    { y: 66, w: 66, delay: 0.48, isResult: true },
    { y: 80, w: 44, delay: 0.52, isResult: false },
  ];

  return (
    <div className="absolute" style={{ right: "2%", top: "50%", marginTop: "-75px", width: "190px", height: "150px" }}>
      {/* Document stack */}
      {docs.map((d, i) => (
        <motion.div
          key={i}
          className="absolute rounded-md"
          style={{
            left: d.x,
            top: d.y,
            width: d.w,
            height: d.h,
            border: `2px solid color-mix(in srgb, ${accent} ${30 + i * 10}%, transparent)`,
            background: `color-mix(in srgb, ${accent} ${d.fill}%, var(--color-bg-card))`,
          }}
          animate={reduced ? {} : {
            opacity: isActive ? 1 : 0,
            x: isActive ? 0 : -12,
          }}
          transition={{ duration: 0.45, ease: EXPO_OUT, delay: isActive ? d.delay + 0.35 : 0 }}
        />
      ))}

      {/* Query result lines on front doc */}
      {queryLines.map((q, i) => (
        <motion.div
          key={`q-${i}`}
          className="absolute origin-left"
          style={{
            left: 48,
            top: q.y,
            width: q.w,
            height: q.isResult ? 6 : 4,
            borderRadius: 3,
            background: q.isResult
              ? accent
              : `color-mix(in srgb, ${accent} 30%, var(--color-border))`,
          }}
          animate={reduced ? {} : {
            scaleX: isActive ? 1 : 0,
            opacity: isActive ? (q.isResult ? 0.85 : 0.55) : 0,
          }}
          transition={{ duration: 0.4, ease: EXPO_OUT, delay: isActive ? q.delay + 0.35 : 0 }}
        />
      ))}

      {/* Search magnifier icon */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 36,
          height: 36,
          right: 10,
          bottom: 8,
          border: `2.5px solid ${accent}`,
        }}
        animate={reduced ? {} : {
          opacity: isActive ? 0.7 : 0,
          scale: isActive ? 1 : 0.6,
        }}
        transition={{ duration: 0.4, ease: EXPO_OUT, delay: isActive ? 0.55 : 0 }}
      />
      <motion.div
        className="absolute"
        style={{
          width: 14,
          height: 3,
          right: 2,
          bottom: 3,
          borderRadius: 2,
          background: accent,
          transformOrigin: "left center",
          transform: "rotate(45deg)",
        }}
        animate={reduced ? {} : {
          opacity: isActive ? 0.7 : 0,
          scaleX: isActive ? 1 : 0,
        }}
        transition={{ duration: 0.35, ease: EXPO_OUT, delay: isActive ? 0.6 : 0 }}
      />
      {/* Search pulse ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 36,
          height: 36,
          right: 10,
          bottom: 8,
          border: `2px solid ${accent}`,
        }}
        animate={reduced ? {} : {
          scale: isActive ? [1, 2] : 1,
          opacity: isActive ? [0.5, 0] : 0,
        }}
        transition={isActive ? { duration: 1.8, repeat: Infinity, ease: "easeOut", delay: 0.9 } : { duration: 0.2 }}
      />
    </div>
  );
}

/* 06 — Legal AI: document with scanning line and clause highlights */
function VisualLegalAI({ accent, isActive, reduced }: { accent: string; isActive: boolean; reduced: boolean }) {
  const textLines = [
    { w: 110, y: 18, highlight: false },
    { w: 95, y: 34, highlight: false },
    { w: 118, y: 50, highlight: true },
    { w: 80, y: 66, highlight: true },
    { w: 108, y: 82, highlight: false },
    { w: 90, y: 98, highlight: false },
    { w: 70, y: 114, highlight: true },
  ];

  return (
    <div className="absolute" style={{ right: "2%", top: "50%", marginTop: "-75px", width: "180px", height: "148px" }}>
      {/* Document frame */}
      <motion.div
        className="absolute inset-0 rounded-md"
        style={{
          border: `2px solid color-mix(in srgb, ${accent} 35%, transparent)`,
          background: `color-mix(in srgb, ${accent} 6%, var(--color-bg-card))`,
        }}
        animate={reduced ? {} : {
          opacity: isActive ? 1 : 0,
        }}
        transition={{ duration: 0.4, ease: EXPO_OUT, delay: isActive ? 0.3 : 0 }}
      />

      {/* Text lines with clause highlights */}
      {textLines.map((line, i) => (
        <motion.div
          key={i}
          className="absolute origin-left"
          style={{
            left: 14,
            top: line.y,
            width: line.w,
            height: line.highlight ? 8 : 5,
            borderRadius: 3,
            background: line.highlight
              ? accent
              : `color-mix(in srgb, ${accent} 25%, var(--color-border))`,
          }}
          animate={reduced ? {} : {
            scaleX: isActive ? 1 : 0,
            opacity: isActive ? (line.highlight ? 0.85 : 0.5) : 0,
          }}
          transition={{
            duration: 0.4,
            ease: EXPO_OUT,
            delay: isActive ? i * 0.06 + 0.4 : 0,
          }}
        />
      ))}

      {/* Scanning line */}
      <motion.div
        className="absolute left-0 w-full"
        style={{
          height: 2,
          background: `linear-gradient(90deg, transparent 5%, ${accent} 50%, transparent 95%)`,
        }}
        animate={reduced ? {} : {
          top: isActive ? ["0%", "100%"] : "0%",
          opacity: isActive ? [0.7, 0.35, 0] : 0,
        }}
        transition={isActive ? { duration: 2.2, ease: "easeInOut", delay: 0.5, repeat: Infinity, repeatDelay: 1.5 } : { duration: 0.2 }}
      />

      {/* Check mark badge */}
      <motion.div
        className="absolute flex items-center justify-center rounded-full"
        style={{
          width: 32,
          height: 32,
          right: -10,
          top: -10,
          background: `color-mix(in srgb, ${accent} 22%, var(--color-bg-card))`,
          border: `2px solid color-mix(in srgb, ${accent} 50%, transparent)`,
        }}
        animate={reduced ? {} : {
          opacity: isActive ? 1 : 0,
          scale: isActive ? 1 : 0.6,
        }}
        transition={{ duration: 0.4, ease: EXPO_OUT, delay: isActive ? 0.85 : 0 }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <motion.path
            d="M4 9.5L7 12.5L14 5"
            style={{ stroke: accent }}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={reduced ? {} : {
              pathLength: isActive ? 1 : 0,
              opacity: isActive ? 0.9 : 0,
            }}
            transition={{ duration: 0.4, ease: EXPO_OUT, delay: isActive ? 0.95 : 0 }}
          />
        </svg>
      </motion.div>
    </div>
  );
}

/* ── Visual selector — renders themed visual by solution id ── */

const VISUAL_MAP: Record<string, React.FC<{ accent: string; isActive: boolean; reduced: boolean }>> = {
  "ai-agents": VisualAgenticLeadGen,
  "workflow-automation": VisualDesignAssist,
  "custom-software": VisualSmartRAG,
  "ai-product-dev": VisualStorytellingAI,
  "model-development": VisualLegalAI,
  "integrations-deployment": VisualAgenticLeadGen,
};

/* ── Composite background visual per slide ── */

function SlideVisual({ id, index, accent, isActive }: { id: string; index: number; accent: string; isActive: boolean }) {
  const prefersReduced = useReducedMotion();
  const reduced = !!prefersReduced;
  const ThemedVisual = VISUAL_MAP[id];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Ambient glow — boosted for visibility */}
      <motion.div
        className="absolute -top-16 -right-16 w-80 h-80 rounded-full"
        style={{ background: `radial-gradient(circle, ${accent} 0%, transparent 70%)`, opacity: 0.08 }}
        animate={reduced ? {} : { scale: isActive ? [1, 1.15, 1] : 1, opacity: isActive ? [0.08, 0.14, 0.08] : 0.04 }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Mesh dot pattern */}
      <svg className="absolute right-0 top-0 h-full w-1/2 opacity-[0.05]" preserveAspectRatio="none">
        <defs>
          <pattern id={`dots-${index}`} width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" style={{ fill: accent }} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#dots-${index})`} />
      </svg>

      {/* Per-card themed visual */}
      {ThemedVisual && <ThemedVisual accent={accent} isActive={isActive} reduced={reduced} />}

      {/* Watermark number */}
      <span
        className="absolute -right-3 -bottom-4 font-display font-[800] text-text-primary opacity-[0.025] select-none leading-none"
        style={{ fontSize: "clamp(8rem, 18vw, 14rem)" }}
        aria-hidden="true"
      >
        {String(index + 1).padStart(2, "0")}
      </span>
    </div>
  );
}

/* ── Cinematic staggered reveal system for active card ── */

/* Soft ease for exits — snappy without jarring */
const EASE_SETTLE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const contentContainerVariants = {
  idle: {
    transition: { staggerChildren: 0.015, staggerDirection: -1 },
  },
  active: {
    transition: { staggerChildren: 0.08, delayChildren: 0.35 },
  },
};

/* Badge — subtle horizontal entrance */
const badgeReveal = {
  idle: {
    opacity: 0.45,
    x: 0,
    transition: { duration: 0.2, ease: EASE_SETTLE },
  },
  active: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: EXPO_OUT },
  },
};

/* Title — strong upward sweep, the hero of the sequence */
const titleReveal = {
  idle: {
    opacity: 0.45,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.2, ease: EASE_SETTLE },
  },
  active: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: EXPO_OUT },
  },
};

/* Headline — lighter follow-through after title */
const headlineReveal = {
  idle: {
    opacity: 0.35,
    y: 0,
    transition: { duration: 0.2, ease: EASE_SETTLE },
  },
  active: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EXPO_OUT },
  },
};

/* Accent line — draws from left */
const accentLineReveal = {
  idle: {
    scaleX: 0.6,
    opacity: 0.3,
    transition: { duration: 0.15, ease: EASE_SETTLE },
  },
  active: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.45, ease: EXPO_OUT },
  },
};

/* Description — clean fade-rise, no blur to stay readable */
const descriptionReveal = {
  idle: {
    opacity: 0.3,
    y: 0,
    transition: { duration: 0.2, ease: EASE_SETTLE },
  },
  active: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EXPO_OUT },
  },
};

/* Capability group — container that staggers its children */
const capabilityGroupReveal = {
  idle: {
    transition: { staggerChildren: 0.01, staggerDirection: -1 },
  },
  active: {
    transition: { staggerChildren: 0.05 },
  },
};

/* Capability pills — pop in with a gentle spring */
const capabilityPillReveal = {
  idle: {
    opacity: 0.3,
    y: 0,
    scale: 1,
    transition: { duration: 0.12, ease: EASE_SETTLE },
  },
  active: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, ease: [0.22, 1.2, 0.36, 1] as [number, number, number, number] },
  },
};

/* ── Solution card content ── */

function SolutionCard({
  solution,
  index,
  isActive,
  isPreview,
  prefersReduced,
}: {
  solution: Solution;
  index: number;
  isActive: boolean;
  isPreview: boolean;
  prefersReduced: boolean | null;
}) {
  const reduced = !!prefersReduced;
  const animateState = isActive ? "active" : "idle";

  return (
    <motion.div
      className="clip-corner-card relative overflow-hidden bg-bg-card"
      style={{
        border: isActive
          ? `1px solid color-mix(in srgb, ${solution.accent} 20%, var(--color-border))`
          : "1px solid var(--color-border)",
        boxShadow: isActive
          ? `0 12px 48px color-mix(in srgb, var(--color-text-primary) 10%, transparent), 0 4px 16px color-mix(in srgb, var(--color-text-primary) 6%, transparent), 0 0 0 1px color-mix(in srgb, ${solution.accent} 6%, transparent)`
          : isPreview
            ? "0 2px 8px color-mix(in srgb, var(--color-text-primary) 3%, transparent)"
            : "none",
      }}
      animate={{
        borderColor: isActive
          ? `color-mix(in srgb, ${solution.accent} 20%, var(--color-border))`
          : "var(--color-border)",
      }}
      transition={{ duration: 0.4 }}
    >
      {/* Active accent top edge — leads the content reveal */}
      {isActive && (
        <motion.div
          className="absolute top-0 left-0 right-0 h-[2px] z-20"
          style={{ background: `linear-gradient(90deg, transparent, ${solution.accent}, transparent)` }}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.5, ease: EXPO_OUT, delay: 0.2 }}
        />
      )}

      {/* Background visual */}
      <SlideVisual id={solution.id} index={index} accent={solution.accent} isActive={isActive} />

      {/* Content scrim */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(100deg, var(--color-bg-card) 0%, color-mix(in srgb, var(--color-bg-card) 97%, transparent) 50%, color-mix(in srgb, var(--color-bg-card) 80%, transparent) 100%)`,
        }}
      />

      {/* Preview card dimming overlay */}
      {isPreview && (
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{ background: "color-mix(in srgb, var(--color-bg-deep) 5%, transparent)" }}
        />
      )}

      {/* Content — cinematic staggered reveal when active */}
      <motion.div
        className="relative z-10 p-5 sm:p-7 lg:p-8"
        variants={reduced ? undefined : contentContainerVariants}
        initial="idle"
        animate={reduced ? undefined : animateState}
      >
        {/* Top meta row — badge slides in from left */}
        <motion.div
          className="flex items-center gap-3 mb-4"
          variants={reduced ? undefined : badgeReveal}
        >
          <span
            className="font-mono text-[0.72rem] uppercase tracking-[0.14em] px-2.5 py-1 rounded-sm border"
            style={{
              color: solution.accent,
              borderColor: `color-mix(in srgb, ${solution.accent} 18%, transparent)`,
              background: `color-mix(in srgb, ${solution.accent} 4%, var(--color-bg-card))`,
            }}
          >
            {solution.tag}
          </span>
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-text-muted ml-auto">
            {solution.number}<span className="mx-0.5 opacity-40">/</span>{String(SLIDE_COUNT).padStart(2, "0")}
          </span>
        </motion.div>

        {/* Title — dramatic upward sweep */}
        <motion.h3
          className="font-display font-[800] leading-[1.1] text-text-primary tracking-tight mb-1"
          style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)" }}
          variants={reduced ? undefined : titleReveal}
        >
          {solution.title}
        </motion.h3>

        {/* Headline — softer follow-through */}
        <motion.p
          className="font-body text-[1.05rem] leading-snug text-text-secondary mb-3"
          variants={reduced ? undefined : headlineReveal}
        >
          {solution.headline}
        </motion.p>

        {/* Accent line — draws from left */}
        <motion.div
          className="h-[2px] rounded-full mb-3 origin-left"
          style={{ background: solution.accent, width: "36px" }}
          variants={reduced ? undefined : accentLineReveal}
        />

        {/* Description — gentle fade rise */}
        <motion.p
          className="text-[1.05rem] leading-[1.65] text-text-secondary mb-5 max-w-lg"
          variants={reduced ? undefined : descriptionReveal}
        >
          {solution.description}
        </motion.p>

        {/* Capabilities — pills pop in with micro bounce */}
        <motion.div
          className="flex flex-wrap gap-1.5"
          variants={reduced ? undefined : capabilityGroupReveal}
        >
          {solution.capabilities.map((cap) => (
            <motion.span
              key={cap}
              className="inline-flex items-center gap-1.5 font-mono text-[0.72rem] text-text-muted tracking-wide px-3 py-1.5 rounded-sm border border-border bg-bg-deep/50"
              variants={reduced ? undefined : capabilityPillReveal}
            >
              <span className="w-1 h-1 rounded-full shrink-0" style={{ background: solution.accent }} />
              {cap}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ── Carousel position states ── */

interface CardPosition {
  x: string;
  scale: number;
  opacity: number;
  zIndex: number;
  blur: number;
  rotateY: number;
}

function getDesktopPosition(offset: number): CardPosition {
  switch (offset) {
    case 0:
      return { x: "0%", scale: 1, opacity: 1, zIndex: 10, blur: 0, rotateY: 0 };
    case 1:
      return { x: "52%", scale: 0.93, opacity: 0.9, zIndex: 5, blur: 0, rotateY: -1.5 };
    case -1:
      return { x: "-52%", scale: 0.93, opacity: 0.45, zIndex: 5, blur: 2, rotateY: 1.5 };
    default:
      return offset > 0
        ? { x: "120%", scale: 0.8, opacity: 0, zIndex: 0, blur: 0, rotateY: 0 }
        : { x: "-120%", scale: 0.8, opacity: 0, zIndex: 0, blur: 0, rotateY: 0 };
  }
}

function getMobilePosition(offset: number): CardPosition {
  switch (offset) {
    case 0:
      return { x: "0%", scale: 1, opacity: 1, zIndex: 10, blur: 0, rotateY: 0 };
    case 1:
      return { x: "50%", scale: 0.93, opacity: 0.85, zIndex: 5, blur: 0, rotateY: -1 };
    case -1:
      return { x: "-50%", scale: 0.93, opacity: 0.45, zIndex: 5, blur: 2, rotateY: 1 };
    default:
      return offset > 0
        ? { x: "120%", scale: 0.8, opacity: 0, zIndex: 0, blur: 0, rotateY: 0 }
        : { x: "-120%", scale: 0.8, opacity: 0, zIndex: 0, blur: 0, rotateY: 0 };
  }
}

/* ── Navigation arrow icon (removed — navigation via preview card click + swipe + keyboard) ── */

/* ── Progress indicator ── */

function SlideProgress({
  currentIndex,
  onDotClick,
}: {
  currentIndex: number;
  onDotClick: (index: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      {SOLUTIONS.map((sol, i) => (
        <button
          key={sol.id}
          onClick={() => onDotClick(i)}
          className="relative flex items-center justify-center p-0.5 group"
          aria-label={`Go to slide ${i + 1}: ${sol.title}`}
        >
          <motion.div
            className="rounded-full"
            animate={{
              width: i === currentIndex ? 22 : 6,
              height: 6,
              background: i === currentIndex ? sol.accent : "var(--color-border)",
            }}
            transition={{ duration: 0.4, ease: EXPO_OUT }}
          />
        </button>
      ))}
    </div>
  );
}

/* ── Main Section ── */

export default function Solutions() {
  const headerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.3 });
  const carouselInView = useInView(carouselRef, { amount: 0.25 });
  const prefersReduced = useReducedMotion();
  const isMobile = useIsMobile();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const carouselAutoplayRef = useRef({ index: 0, animating: false });

  useEffect(() => {
    carouselAutoplayRef.current = { index: currentIndex, animating: isAnimating };
  }, [currentIndex, isAnimating]);

  const goTo = useCallback(
    (target: number) => {
      if (isAnimating) return;
      const wrapped = ((target % SLIDE_COUNT) + SLIDE_COUNT) % SLIDE_COUNT;
      if (wrapped === currentIndex) return;
      setIsAnimating(true);
      setCurrentIndex(wrapped);
    },
    [currentIndex, isAnimating]
  );

  const next = useCallback(() => goTo(currentIndex + 1), [goTo, currentIndex]);
  const prev = useCallback(() => goTo(currentIndex - 1), [goTo, currentIndex]);

  /* Keyboard navigation */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [next, prev]);

  /* Touch swipe support */
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    let startX = 0;
    let startY = 0;

    const onTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
        if (dx < 0) next();
        else prev();
      }
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [next, prev]);

  /* Auto-advance like a marquee: every CAROUSEL_AUTOPLAY_MS, while in view. */
  useEffect(() => {
    if (prefersReduced || !carouselInView) return;

    const id = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      const { index, animating } = carouselAutoplayRef.current;
      if (animating) return;
      const nextIndex = (index + 1) % SLIDE_COUNT;
      setIsAnimating(true);
      setCurrentIndex(nextIndex);
    }, CAROUSEL_AUTOPLAY_MS);

    return () => window.clearInterval(id);
  }, [carouselInView, prefersReduced, currentIndex]);

  const getPosition = isMobile ? getMobilePosition : getDesktopPosition;

  return (
    <section
      id="solutions"
      className="relative bg-bg-deep overflow-hidden"
      style={{ padding: "clamp(2.5rem, 4vw, 3.5rem) 0" }}
    >
      <div className="max-w-[1400px] mx-auto w-full px-6 lg:px-10">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-12 sm:mb-16"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="block h-px w-[30px] bg-accent-1" />
            <span className="font-mono text-[0.75rem] font-medium uppercase tracking-[0.14em] text-accent-1">
              What We Do
            </span>
          </div>
          <h2
              className="font-display font-[800] leading-[1.15] text-text-primary"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.2rem)" }}
            >
              We build custom AI systems, software products, and intelligent automation for businesses that want{" "}
              <span className="italic">
                <RotatingHeadlineWord />
              </span>
            </h2>
        </motion.div>
      </div>

      {/* Layered carousel */}
      <div
        ref={carouselRef}
        className="relative max-w-[1400px] mx-auto px-6 lg:px-10 select-none"
        style={{
          height: isMobile ? "280px" : "300px",
          perspective: "1200px",
        }}
        role="region"
        aria-label="Solutions carousel. Advances automatically every 5 seconds while visible. Click side cards, dots, or use arrow keys to change slides."
        aria-roledescription="carousel"
      >
        {SOLUTIONS.map((solution, i) => {
          let offset = i - currentIndex;
          // Wrap offset for circular looping
          if (offset > SLIDE_COUNT / 2) offset -= SLIDE_COUNT;
          if (offset < -SLIDE_COUNT / 2) offset += SLIDE_COUNT;
          const pos = getPosition(offset);
          return (
            <motion.div
              key={solution.id}
              className="absolute top-0 left-1/2"
              style={{
                marginLeft: isMobile ? "-45%" : "-29%",
                width: isMobile ? "90%" : "58%",
                height: "100%",
                zIndex: pos.zIndex,
                pointerEvents: offset === 0 || offset === 1 || offset === -1 ? "auto" : "none",
                cursor: offset === 1 || offset === -1 ? "pointer" : "default",
                transformStyle: "preserve-3d",
              }}
              animate={
                prefersReduced
                  ? { opacity: offset === 0 ? 1 : 0 }
                  : {
                      x: pos.x,
                      scale: pos.scale,
                      opacity: pos.opacity,
                      rotateY: pos.rotateY,
                      filter: `blur(${pos.blur}px)`,
                    }
              }
              transition={{
                duration: 0.75,
                ease: EASE,
              }}
              onClick={() => {
                if (offset === 1) next();
                if (offset === -1) prev();
              }}
              onAnimationComplete={() => {
                if (offset === 0) setIsAnimating(false);
              }}
              aria-hidden={offset !== 0}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${i + 1} of ${SLIDE_COUNT}: ${solution.title}`}
            >
              <SolutionCard
                solution={solution}
                index={i}
                isActive={offset === 0}
                isPreview={offset === 1 || offset === -1}
                prefersReduced={prefersReduced}
              />
            </motion.div>
          );
        })}

        {/* Left edge fade for depth */}
        <div
          className="absolute top-0 left-0 w-10 h-full pointer-events-none z-20"
          style={{
            background: "linear-gradient(to right, var(--color-bg-deep), transparent)",
          }}
        />

        {/* Right edge fade for depth */}
        <div
          className="absolute top-0 right-0 w-10 h-full pointer-events-none z-20"
          style={{
            background: "linear-gradient(to left, var(--color-bg-deep), transparent)",
          }}
        />
      </div>

      {/* Bottom controls */}
      <div className="max-w-[1400px] mx-auto w-full px-6 lg:px-10 mt-5 sm:mt-6">
        {/* Progress bar */}
        <div className="h-[1.5px] bg-border rounded-full overflow-hidden mb-4">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, var(--color-accent-1), var(--color-accent-2), var(--color-accent-3))",
              backgroundSize: "200% 100%",
            }}
            animate={{ width: `${((currentIndex + 1) / SLIDE_COUNT) * 100}%` }}
            transition={{ duration: 0.5, ease: EASE }}
          />
        </div>

        <div className="flex items-center justify-between">
          <SlideProgress currentIndex={currentIndex} onDotClick={goTo} />

          {/* Counter */}
          <span className="font-mono text-[0.65rem] text-text-muted tabular-nums" aria-live="polite" aria-atomic="true">
            <span style={{ color: SOLUTIONS[currentIndex]?.accent }} className="font-medium">
              {String(currentIndex + 1).padStart(2, "0")}
            </span>
            <span className="mx-0.5 opacity-40">/</span>
            <span>{String(SLIDE_COUNT).padStart(2, "0")}</span>
          </span>
        </div>
      </div>
    </section>
  );
}
