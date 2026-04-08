"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type TouchEvent,
} from "react";
import { motion, type MotionValue, useTransform } from "framer-motion";
import { EXPO_OUT } from "@/lib/animations";

/* ------------------------------------------------------------------ */
/*  Workflow Step Data                                                  */
/* ------------------------------------------------------------------ */

interface WorkflowStep {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sublabel: string;
  icon: string; // SVG path data
  accent: 1 | 2 | 3;
  delay: number;
  /** Shown in the HTML inspector panel */
  detail: string;
  metrics: readonly [string, string];
}

const STEPS: WorkflowStep[] = [
  {
    id: "trigger",
    x: 20,
    y: 170,
    w: 120,
    h: 72,
    label: "Trigger",
    sublabel: "Webhook / Schedule",
    icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
    accent: 1,
    delay: 0,
    detail: "Ingress events from schedulers or signed HTTP hooks with idempotency keys.",
    metrics: ["p50 4ms", "Queue 0"],
  },
  {
    id: "enrich",
    x: 190,
    y: 100,
    w: 120,
    h: 72,
    label: "Enrich Data",
    sublabel: "RAG + Context",
    icon: "M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7M9 12h6M12 9v6M1 4h22",
    accent: 2,
    delay: 0.12,
    detail: "Retrieval augments the working set before scoring so agents see grounded facts.",
    metrics: ["Chunks 12", "Recall 0.94"],
  },
  {
    id: "analyze",
    x: 190,
    y: 240,
    w: 120,
    h: 72,
    label: "AI Analysis",
    sublabel: "Multi-Model",
    icon: "M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 10l2 2 4-4",
    accent: 3,
    delay: 0.18,
    detail: "Parallel model calls with consensus scoring and calibrated confidence bands.",
    metrics: ["Models 3", "Votes 5"],
  },
  {
    id: "decide",
    x: 360,
    y: 170,
    w: 120,
    h: 72,
    label: "Decision",
    sublabel: "Agent Router",
    icon: "M12 3v18M3 12h18M7.5 7.5l9 9M16.5 7.5l-9 9",
    accent: 1,
    delay: 0.28,
    detail: "Policy graph picks the next action branch using rules plus learned priors.",
    metrics: ["Branches 2", "Rules 18"],
  },
  {
    id: "execute",
    x: 530,
    y: 110,
    w: 120,
    h: 72,
    label: "Execute",
    sublabel: "API / Workflow",
    icon: "M13 2L3 14h9l-1 10 10-12h-9l1-10z",
    accent: 2,
    delay: 0.38,
    detail: "Durable execution with retries, backoff, and circuit breaking on downstream APIs.",
    metrics: ["Retries 2", "SLA 99.2%"],
  },
  {
    id: "store",
    x: 530,
    y: 230,
    w: 120,
    h: 72,
    label: "Store",
    sublabel: "Vector DB",
    icon: "M12 2C6.5 2 2 4.5 2 7v10c0 2.5 4.5 5 10 5s10-2.5 10-5V7c0-2.5-4.5-5-10-5zM2 12c0 2.5 4.5 5 10 5s10-2.5 10-5",
    accent: 3,
    delay: 0.42,
    detail: "Embeddings and metadata land in a versioned index with hot read replicas.",
    metrics: ["Dim 1536", "Shards 4"],
  },
];

/* Connector paths between steps */
interface Connector {
  path: string;
  delay: number;
  fromId: string;
  toId: string;
}

const CONNECTORS: Connector[] = [
  // Trigger → splits to Enrich & Analyze
  {
    path: "M140 206 Q165 206 165 168 Q165 136 190 136",
    delay: 0.5,
    fromId: "trigger",
    toId: "enrich",
  },
  {
    path: "M140 206 Q165 206 165 244 Q165 276 190 276",
    delay: 0.55,
    fromId: "trigger",
    toId: "analyze",
  },
  // Enrich → Decision
  {
    path: "M310 136 Q335 136 335 174 Q335 206 360 206",
    delay: 0.7,
    fromId: "enrich",
    toId: "decide",
  },
  // Analyze → Decision
  {
    path: "M310 276 Q335 276 335 238 Q335 206 360 206",
    delay: 0.75,
    fromId: "analyze",
    toId: "decide",
  },
  // Decision → splits to Execute & Store
  {
    path: "M480 206 Q505 206 505 178 Q505 146 530 146",
    delay: 0.9,
    fromId: "decide",
    toId: "execute",
  },
  {
    path: "M480 206 Q505 206 505 234 Q505 266 530 266",
    delay: 0.95,
    fromId: "decide",
    toId: "store",
  },
];

function connectorTouchesStep(c: Connector, stepId: string | null): boolean {
  if (!stepId) return false;
  return c.fromId === stepId || c.toId === stepId;
}

const STEP_ORDER_IDS = STEPS.map((s) => s.id);

/** Keep in sync with `<svg viewBox>` so inspector `foreignObject` is not clipped. */
const SVG_VIEW_Y = 60;
const SVG_VIEW_H = 348;

/* ------------------------------------------------------------------ */
/*  HTML inspector (foreignObject)                                      */
/* ------------------------------------------------------------------ */

function StepInspectorPanel({
  step,
  open,
  onPrev,
  onNext,
}: {
  step: WorkflowStep | null;
  open: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  if (!step || !open) return null;

  const pad = 8;
  const foW = 216;
  const foH = 158;
  let fx = step.x + step.w / 2 - foW / 2;
  fx = Math.max(4, Math.min(fx, 680 - foW - 4));
  const placeBelow = step.y < 195;
  const minY = SVG_VIEW_Y + 4;
  const maxY = SVG_VIEW_Y + SVG_VIEW_H - foH - 4;
  let fy = placeBelow ? step.y + step.h + pad : step.y - foH - pad;
  if (fy > maxY) fy = step.y - foH - pad;
  if (fy < minY) fy = step.y + step.h + pad;
  fy = Math.min(Math.max(fy, minY), maxY);

  return (
    <foreignObject
      x={fx}
      y={fy}
      width={foW}
      height={foH}
      className="overflow-visible pointer-events-auto"
    >
      <div
        className="rounded-xl border border-border bg-bg-card/95 p-3 shadow-[0_12px_40px_rgba(0,0,0,0.08)] backdrop-blur-md touch-manipulation"
        style={{
          fontFamily: "var(--font-body)",
          borderColor: "var(--color-border)",
        }}
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <p className="text-[0.65rem] font-mono uppercase tracking-wider text-accent-1 mb-1.5">
          Node inspector
        </p>
        <p className="text-[0.72rem] leading-snug text-text-secondary mb-2">{step.detail}</p>
        <div className="flex gap-2 flex-wrap">
          <span className="text-[0.62rem] font-mono px-2 py-0.5 rounded-md bg-bg-surface border border-border text-text-primary">
            {step.metrics[0]}
          </span>
          <span className="text-[0.62rem] font-mono px-2 py-0.5 rounded-md bg-bg-surface border border-border text-text-primary">
            {step.metrics[1]}
          </span>
        </div>
        <div className="mt-3 flex gap-2 justify-between">
          <button
            type="button"
            className="flex-1 min-h-[40px] rounded-lg border border-border bg-bg-surface text-[0.7rem] font-semibold uppercase tracking-wide text-text-primary active:bg-bg-card-hover"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
          >
            Prev
          </button>
          <button
            type="button"
            className="flex-1 min-h-[40px] rounded-lg border border-border bg-bg-surface text-[0.7rem] font-semibold uppercase tracking-wide text-text-primary active:bg-bg-card-hover"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
          >
            Next
          </button>
        </div>
      </div>
    </foreignObject>
  );
}

/* ------------------------------------------------------------------ */
/*  Animated data particle along a path                                */
/* ------------------------------------------------------------------ */

function DataParticle({
  path,
  delay,
  variant,
  reduced,
  inView,
}: {
  path: string;
  delay: number;
  /** Stagger particle speed without randomness (keeps render pure). */
  variant: number;
  reduced: boolean;
  inView: boolean;
}) {
  if (reduced || !inView) return null;

  const dur = 2.75 + (variant % 6) * 0.12;
  const begin = 3.5 + delay * 2;

  return (
    <g style={{ pointerEvents: "none" }}>
      {/* Main particle */}
      <circle r={3} opacity={0} style={{ fill: "var(--color-accent-1)" }}>
        <animate
          attributeName="opacity"
          values="0;0.7;0.7;0"
          dur={`${dur}s`}
          begin={`${begin}s`}
          repeatCount="indefinite"
        />
        <animateMotion
          dur={`${dur}s`}
          begin={`${begin}s`}
          repeatCount="indefinite"
          path={path}
        />
      </circle>
      {/* Trail particle */}
      <circle r={2} opacity={0} style={{ fill: "var(--color-accent-2)" }}>
        <animate
          attributeName="opacity"
          values="0;0.4;0.4;0"
          dur={`${dur}s`}
          begin={`${begin + 0.15}s`}
          repeatCount="indefinite"
        />
        <animateMotion
          dur={`${dur}s`}
          begin={`${begin + 0.15}s`}
          repeatCount="indefinite"
          path={path}
        />
      </circle>
    </g>
  );
}

/* ------------------------------------------------------------------ */
/*  Step Card                                                          */
/* ------------------------------------------------------------------ */

function StepCard({
  step,
  inView,
  reduced,
  isHovered,
  isSelected,
  isDimmed,
  onHoverChange,
  onSelect,
}: {
  step: WorkflowStep;
  inView: boolean;
  reduced: boolean;
  isHovered: boolean;
  isSelected: boolean;
  isDimmed: boolean;
  onHoverChange: (id: string | null) => void;
  onSelect: (id: string) => void;
}) {
  const accentVar = `var(--color-accent-${step.accent})`;
  const baseDelay = 1.2 + step.delay;
  const cx = step.x + step.w / 2;
  const cy = step.y + step.h / 2;
  const lift = (isHovered || isSelected) && !reduced;

  return (
    <motion.g
      initial={reduced ? {} : { opacity: 0, y: 15 }}
      animate={
        inView
          ? {
              opacity: isDimmed ? 0.34 : 1,
              y: 0,
            }
          : undefined
      }
      transition={{ duration: 0.55, delay: baseDelay, ease: EXPO_OUT }}
    >
      <motion.g
        animate={{ scale: lift ? 1.04 : 1 }}
        transition={{ type: "spring", stiffness: 420, damping: 32 }}
        style={{
          transformOrigin: `${cx}px ${cy}px`,
          transformBox: "fill-box" as const,
        }}
      >
        <title>
          {`${step.label}: ${step.sublabel}. Click to pin. Use arrow keys when pinned. Escape clears.`}
        </title>
      {/* Card shadow */}
      <rect
        x={step.x + 1}
        y={step.y + 2}
        width={step.w}
        height={step.h}
        rx={10}
        style={{ fill: "var(--color-border)" }}
        opacity={lift ? 0.45 : 0.3}
      />

      {/* Card background */}
      <motion.rect
        x={step.x}
        y={step.y}
        width={step.w}
        height={step.h}
        rx={10}
        animate={{
          strokeWidth: isSelected ? 2.1 : lift ? 1.75 : 1,
        }}
        transition={{ duration: 0.2 }}
        style={{
          fill: "var(--color-bg-card)",
          stroke: isSelected ? accentVar : lift ? accentVar : "var(--color-border)",
        }}
      />

      {isSelected && (
        <rect
          x={step.x - 1.5}
          y={step.y - 1.5}
          width={step.w + 3}
          height={step.h + 3}
          rx={11}
          fill="none"
          stroke={accentVar}
          strokeWidth={0.75}
          opacity={0.45}
          style={{ pointerEvents: "none" }}
        />
      )}

      {/* Top accent bar */}
      <rect
        x={step.x}
        y={step.y}
        width={step.w}
        height={3}
        rx={1.5}
        style={{ fill: accentVar }}
        opacity={lift ? 1 : 0.6}
      />

      {/* Icon chip — full-opacity fill; path stroke via style (reliable in SVG) */}
      <rect
        x={step.x + 7}
        y={step.y + 19}
        width={22}
        height={22}
        rx={6}
        style={{ fill: accentVar }}
      />

      {/* Icon */}
      <g transform={`translate(${step.x + 8}, ${step.y + 20}) scale(0.8)`}>
        <path
          d={step.icon}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            stroke: "#ffffff",
            strokeWidth: 1.75,
          }}
        />
      </g>

      {/* Label */}
      <text
        x={step.x + 35}
        y={step.y + 27}
        style={{
          fill: "var(--color-text-primary)",
          fontFamily: "var(--font-display)",
          fontSize: 10.5,
          fontWeight: 700,
        }}
      >
        {step.label}
      </text>

      {/* Sublabel */}
      <text
        x={step.x + 35}
        y={step.y + 40}
        style={{
          fill: "var(--color-text-muted)",
          fontFamily: "var(--font-mono)",
          fontSize: 7,
          letterSpacing: "0.02em",
        }}
      >
        {step.sublabel}
      </text>

      {/* Status indicator */}
      <motion.g
        initial={reduced ? {} : { opacity: 0 }}
        animate={inView ? { opacity: 1 } : undefined}
        transition={{ duration: 0.4, delay: baseDelay + 0.6 }}
      >
        <circle
          cx={step.x + step.w - 14}
          cy={step.y + 58}
          r={3}
          style={{ fill: accentVar }}
          opacity={0.2}
        />
        {!reduced && (
          <circle
            cx={step.x + step.w - 14}
            cy={step.y + 58}
            r={3}
            style={{ fill: accentVar }}
            opacity={0}
          >
            <animate
              attributeName="r"
              values="3;6;3"
              dur="3s"
              begin={`${3.5 + step.delay}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.2;0;0.2"
              dur="3s"
              begin={`${3.5 + step.delay}s`}
              repeatCount="indefinite"
            />
          </circle>
        )}
        <text
          x={step.x + step.w - 24}
          y={step.y + 61}
          textAnchor="end"
          style={{
            fill: lift ? "var(--color-text-secondary)" : "var(--color-text-muted)",
            fontFamily: "var(--font-mono)",
            fontSize: 6.5,
            fontWeight: lift ? 600 : 400,
          }}
        >
          {isSelected ? "Pinned" : "Active"}
        </text>
      </motion.g>

        {/* Hit area — fill none so nothing paints over the icon; still captures events */}
        <rect
          x={step.x}
          y={step.y}
          width={step.w}
          height={step.h}
          rx={10}
          fill="none"
          pointerEvents="all"
          style={{ cursor: "pointer" }}
          role="button"
          aria-label={`${step.label}, ${step.sublabel}. ${isSelected ? "Pinned." : ""} Click to toggle pin.`}
          onPointerEnter={() => onHoverChange(step.id)}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(step.id);
          }}
        />
      </motion.g>
    </motion.g>
  );
}

/* ------------------------------------------------------------------ */
/*  Connector Line                                                     */
/* ------------------------------------------------------------------ */

function ConnectorLine({
  connector,
  inView,
  reduced,
  highlighted,
  muted,
}: {
  connector: Connector;
  inView: boolean;
  reduced: boolean;
  highlighted: boolean;
  /** Focus mode: edge not in the active subgraph */
  muted: boolean;
}) {
  const baseStroke = "var(--color-border-hover)";
  const hiStroke = "var(--color-accent-1)";
  const baseOpacity = muted ? 0.09 : 0.5;
  const hiOpacity = highlighted ? 0.95 : baseOpacity;

  return (
    <g style={{ pointerEvents: "none" }}>
      {/* Glow underlay when highlighted */}
      {highlighted && (
        <path
          d={connector.path}
          stroke={hiStroke}
          strokeWidth={4}
          fill="none"
          opacity={0.12}
          strokeLinecap="round"
        />
      )}
      <motion.path
        d={connector.path}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={200}
        initial={
          reduced
            ? { strokeDashoffset: 0, opacity: 0.5, stroke: baseStroke, strokeWidth: 1.5 }
            : { strokeDashoffset: 200, opacity: 0, stroke: baseStroke, strokeWidth: 1.5 }
        }
        animate={
          inView
            ? {
                strokeDashoffset: 0,
                opacity: hiOpacity,
                stroke: highlighted ? hiStroke : baseStroke,
                strokeWidth: highlighted ? 2.25 : 1.5,
              }
            : undefined
        }
        transition={{ duration: 0.8, delay: 1.6 + connector.delay, ease: EXPO_OUT }}
      />
      {/* Flow pulse along highlighted edge */}
      {highlighted && inView && !reduced && (
        <path
          d={connector.path}
          fill="none"
          stroke="var(--color-accent-2)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeDasharray="6 14"
          opacity={0.85}
        >
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="-40"
            dur="1.1s"
            repeatCount="indefinite"
          />
        </path>
      )}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/*  Branch diamond (split point visual)                                */
/* ------------------------------------------------------------------ */

function BranchDiamond({
  cx,
  cy,
  delay,
  inView,
  reduced,
  active,
  dimmed,
}: {
  cx: number;
  cy: number;
  delay: number;
  inView: boolean;
  reduced: boolean;
  active: boolean;
  dimmed: boolean;
}) {
  return (
    <motion.g
      initial={reduced ? {} : { opacity: 0, scale: 0.5 }}
      animate={
        inView
          ? {
              opacity: dimmed ? 0.28 : 1,
              scale: active && !reduced ? 1.12 : 1,
            }
          : undefined
      }
      transition={{ duration: 0.4, delay: 1.8 + delay, ease: EXPO_OUT }}
      style={{
        pointerEvents: "none",
        transformOrigin: `${cx}px ${cy}px`,
        transformBox: "fill-box",
      }}
    >
      <rect
        x={cx - 6}
        y={cy - 6}
        width={12}
        height={12}
        rx={2}
        transform={`rotate(45 ${cx} ${cy})`}
        style={{
          fill: "var(--color-bg-card)",
          stroke: "var(--color-accent-1)",
        }}
        strokeWidth={active ? 2 : 1}
        opacity={active ? 1 : 0.85}
      />
      <circle
        cx={cx}
        cy={cy}
        r={active ? 3 : 2}
        style={{ fill: "var(--color-accent-1)" }}
        opacity={active ? 0.85 : 0.5}
      />
      {active && !reduced && (
        <circle cx={cx} cy={cy} r={6} fill="none" stroke="var(--color-accent-2)" strokeWidth={0.75} opacity={0.4}>
          <animate attributeName="r" values="4;10;4" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0;0.5" dur="1.8s" repeatCount="indefinite" />
        </circle>
      )}
    </motion.g>
  );
}

/* ------------------------------------------------------------------ */
/*  Scroll-aware wrapper                                               */
/* ------------------------------------------------------------------ */

function ScrollFade({
  children,
  scrollProgress,
}: {
  children: React.ReactNode;
  scrollProgress: MotionValue<number>;
}) {
  /* Never fade to 0: at 0.5 progress the diagram was fully invisible while the
   hero was still on screen. Keep a readable floor through the full hero exit. */
  const opacity = useTransform(scrollProgress, [0, 0.45, 1], [1, 0.92, 0.84]);
  const scale = useTransform(scrollProgress, [0, 1], [1, 0.96]);
  const y = useTransform(scrollProgress, [0, 1], [0, -12]);

  return (
    <motion.g style={{ opacity, scale, y, transformOrigin: "340px 206px" }}>
      {children}
    </motion.g>
  );
}

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */

interface WorkflowCanvasProps {
  mode: "entrance" | "scroll";
  inView: boolean;
  reduced: boolean;
  scrollProgress?: MotionValue<number>;
}

/* ------------------------------------------------------------------ */
/*  Main WorkflowCanvas                                                */
/* ------------------------------------------------------------------ */

export default function WorkflowCanvas({
  mode,
  inView,
  reduced,
  scrollProgress,
}: WorkflowCanvasProps) {
  const isScroll = mode === "scroll" && scrollProgress && !reduced;
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  /** Touch / coarse devices: graph focus from hover is unreliable; only pin drives focus. */
  const [hoverGraph, setHoverGraph] = useState(false);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const swipeIgnore = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const apply = () => setHoverGraph(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const focusId = selectedId ?? (hoverGraph ? hoveredId : null);

  const onSelectStep = useCallback((id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  const goNext = useCallback(() => {
    setSelectedId((prevSel) => {
      const current =
        prevSel ?? (hoverGraph ? hoveredId : null);
      if (!current) return prevSel;
      const idx = STEP_ORDER_IDS.indexOf(current);
      if (idx < 0) return prevSel;
      return STEPS[(idx + 1) % STEPS.length].id;
    });
  }, [hoverGraph, hoveredId]);

  const goPrev = useCallback(() => {
    setSelectedId((prevSel) => {
      const current =
        prevSel ?? (hoverGraph ? hoveredId : null);
      if (!current) return prevSel;
      const idx = STEP_ORDER_IDS.indexOf(current);
      if (idx < 0) return prevSel;
      return STEPS[(idx - 1 + STEPS.length) % STEPS.length].id;
    });
  }, [hoverGraph, hoveredId]);

  const navFocusId = selectedId ?? (hoverGraph ? hoveredId : null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedId(null);
        setHoveredId(null);
        return;
      }
      if (!navFocusId) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navFocusId, goNext, goPrev]);

  const diamondActive = [
    focusId && ["trigger", "enrich", "analyze"].includes(focusId),
    focusId && ["enrich", "analyze", "decide"].includes(focusId),
    focusId && ["decide", "execute", "store"].includes(focusId),
  ] as const;

  const focusStep = focusId ? STEPS.find((s) => s.id === focusId) ?? null : null;

  const content = (
    <>
      {/* Subtle grid background */}
      <defs>
        <pattern
          id="wf-grid"
          width={24}
          height={24}
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M24 0H0v24"
            fill="none"
            style={{ stroke: "var(--color-border)" }}
            strokeWidth={0.3}
            opacity={0.5}
          />
        </pattern>
      </defs>
      <motion.rect
        pointerEvents="none"
        x={0}
        y={60}
        width={680}
        height={300}
        rx={16}
        fill="url(#wf-grid)"
        initial={reduced ? {} : { opacity: 0 }}
        animate={inView ? { opacity: 1 } : undefined}
        transition={{ duration: 1, delay: 0.8 }}
      />

      {/* Click canvas (behind nodes) to clear focus */}
      <rect
        x={0}
        y={60}
        width={680}
        height={300}
        rx={16}
        fill="transparent"
        onClick={() => {
          setSelectedId(null);
          setHoveredId(null);
        }}
        style={{ cursor: "default" }}
      />

      {/* Canvas border (workspace feel) */}
      <motion.rect
        pointerEvents="none"
        x={4}
        y={64}
        width={672}
        height={292}
        rx={14}
        fill="none"
        style={{ stroke: "var(--color-border)" }}
        strokeWidth={0.5}
        strokeDasharray="4 4"
        initial={reduced ? {} : { opacity: 0 }}
        animate={inView ? { opacity: 0.4 } : undefined}
        transition={{ duration: 0.8, delay: 0.9 }}
      />

      {/* Connector lines */}
      {CONNECTORS.map((c, i) => {
        const hi = connectorTouchesStep(c, focusId);
        return (
          <ConnectorLine
            key={`conn-${i}`}
            connector={c}
            inView={inView}
            reduced={reduced}
            highlighted={hi}
            muted={!!focusId && !hi}
          />
        );
      })}

      {/* Branch point diamonds */}
      <BranchDiamond
        cx={155}
        cy={206}
        delay={0}
        inView={inView}
        reduced={reduced}
        active={!!diamondActive[0]}
        dimmed={!!focusId && !diamondActive[0]}
      />
      <BranchDiamond
        cx={345}
        cy={206}
        delay={0.25}
        inView={inView}
        reduced={reduced}
        active={!!diamondActive[1]}
        dimmed={!!focusId && !diamondActive[1]}
      />
      <BranchDiamond
        cx={515}
        cy={206}
        delay={0.45}
        inView={inView}
        reduced={reduced}
        active={!!diamondActive[2]}
        dimmed={!!focusId && !diamondActive[2]}
      />

      {/* Data flow particles */}
      {CONNECTORS.map((c, i) => (
        <DataParticle
          key={`particle-${i}`}
          path={c.path}
          delay={c.delay}
          variant={i}
          reduced={reduced}
          inView={inView}
        />
      ))}

      {/* Step cards */}
      {STEPS.map((step) => (
        <StepCard
          key={step.id}
          step={step}
          inView={inView}
          reduced={reduced}
          isHovered={hoveredId === step.id}
          isSelected={selectedId === step.id}
          isDimmed={!!focusId && focusId !== step.id}
          onHoverChange={setHoveredId}
          onSelect={onSelectStep}
        />
      ))}

      <StepInspectorPanel
        step={focusStep}
        open={!!focusId && inView}
        onPrev={goPrev}
        onNext={goNext}
      />

      {/* "Live" badge top-left */}
      <motion.g
        style={{ pointerEvents: "none" }}
        initial={reduced ? {} : { opacity: 0 }}
        animate={inView ? { opacity: 1 } : undefined}
        transition={{ duration: 0.5, delay: 3.0 }}
      >
        <rect
          x={16}
          y={76}
          width={60}
          height={20}
          rx={10}
          style={{ fill: "var(--color-accent-2)" }}
          opacity={0.1}
        />
        {!reduced && (
          <circle cx={30} cy={86} r={3} style={{ fill: "var(--color-accent-2)" }}>
            <animate
              attributeName="opacity"
              values="0.3;1;0.3"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        )}
        {reduced && (
          <circle cx={30} cy={86} r={3} style={{ fill: "var(--color-accent-2)" }} opacity={0.6} />
        )}
        <text
          x={40}
          y={90}
          style={{
            fill: "var(--color-accent-2)",
            fontFamily: "var(--font-mono)",
            fontSize: 8,
            fontWeight: 500,
            letterSpacing: "0.06em",
          }}
        >
          LIVE
        </text>
      </motion.g>

      {/* Step counter top-right */}
      <motion.g
        style={{ pointerEvents: "none" }}
        initial={reduced ? {} : { opacity: 0 }}
        animate={inView ? { opacity: 1 } : undefined}
        transition={{ duration: 0.5, delay: 3.2 }}
      >
        <text
          x={660}
          y={90}
          textAnchor="end"
          style={{
            fill: "var(--color-text-muted)",
            fontFamily: "var(--font-mono)",
            fontSize: 8,
            letterSpacing: "0.04em",
          }}
        >
          {hoverGraph
            ? "6 steps · hover or pin · keys"
            : "6 steps · tap pin · swipe · prev/next"}
        </text>
      </motion.g>
    </>
  );

  const onSwipeTouchStart = (e: TouchEvent) => {
    if (!selectedId || !inView) return;
    const el = e.target as HTMLElement | null;
    swipeIgnore.current = !!(el?.closest?.("button"));
    if (swipeIgnore.current) return;
    const t = e.touches[0];
    swipeStart.current = { x: t.clientX, y: t.clientY };
  };

  const onSwipeTouchEnd = (e: TouchEvent) => {
    if (swipeIgnore.current) {
      swipeIgnore.current = false;
      return;
    }
    const swipeFocus = selectedId ?? (hoverGraph ? hoveredId : null);
    if (!swipeFocus || !swipeStart.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - swipeStart.current.x;
    const dy = t.clientY - swipeStart.current.y;
    swipeStart.current = null;
    if (Math.abs(dx) < 56 || Math.abs(dx) <= Math.abs(dy)) return;
    if (dx < 0) goNext();
    else goPrev();
  };

  return (
    <svg
      viewBox={`-10 ${SVG_VIEW_Y} 700 ${SVG_VIEW_H}`}
      fill="none"
      role="img"
      aria-label={
        hoverGraph
          ? "Interactive workflow diagram. Hover or pin a node to inspect. Use Prev and Next, arrow keys when a node is focused, or swipe horizontally when pinned. Escape clears."
          : "Interactive workflow diagram. Tap a node to pin and inspect. Use Prev and Next or swipe horizontally on the diagram when pinned. Tap empty area to clear."
      }
      className="w-full max-w-full mx-auto select-none touch-manipulation"
      onPointerLeave={() => hoverGraph && setHoveredId(null)}
      onTouchStartCapture={onSwipeTouchStart}
      onTouchEndCapture={onSwipeTouchEnd}
    >
      {isScroll ? (
        <ScrollFade scrollProgress={scrollProgress}>{content}</ScrollFade>
      ) : (
        content
      )}
    </svg>
  );
}
