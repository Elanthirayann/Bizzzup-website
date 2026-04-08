"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { EXPO_OUT } from "@/lib/animations";

export interface ProjectDetails {
  name: string;
  slug: string;
  tagline: string;
  category: string;
  image: string;
  imageLabel: string;
  image2: string;
  image2Label: string;
  tags: string[];
  liveUrl?: string;
  fullDetails: {
    overview: string;
    highlights: { label: string; value: string }[];
    techStack: { layer: string; tech: string }[];
    sections: { heading: string; body: string }[];
  };
}

/* ─── Easing ─────────────────────────────────────────────────── */
const EASE: [number, number, number, number] = EXPO_OUT;

/* ─── Spring presets ─────────────────────────────────────────── */
const SPRING_PANEL  = { type: "spring", stiffness: 340, damping: 30 } as const;
const SPRING_CARD   = { type: "spring", stiffness: 420, damping: 28 } as const;
const SPRING_ROW    = { type: "spring", stiffness: 520, damping: 36 } as const;
const SPRING_TAG    = { type: "spring", stiffness: 480, damping: 32 } as const;
const SPRING_CLOSE  = { type: "spring", stiffness: 400, damping: 20 } as const;

/* ─── Header variants (stagger children) ─────────────────────── */
const headerStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.18 } },
};

const scaleLine = {
  hidden: { scaleX: 0, originX: "center" },
  visible: { scaleX: 1, transition: { duration: 0.7, ease: EASE } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.48, ease: EASE } },
};

const fadeUpBlur = {
  hidden: { opacity: 0, y: 20, filter: "blur(5px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.54, ease: EASE } },
};

const slideLeft = {
  hidden: { opacity: 0, x: -14 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.44, ease: EASE } },
};

/* ─── Screenshot pair ────────────────────────────────────────── */
const imgGridStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.28 } },
};

const imgReveal = {
  hidden: { opacity: 0, scale: 1.05 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: EASE } },
};

/* ─── Body stagger (delayed so panel lands first) ────────────── */
const bodyStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.38 } },
};

/* ─── Highlight cards ────────────────────────────────────────── */
const highlightGrid = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0 } },
};

const highlightCard = {
  hidden: { opacity: 0, y: 16, scale: 0.92 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.44, ease: EASE } },
};

/* ─── Section divider ────────────────────────────────────────── */
const dividerReveal = {
  hidden: { scaleX: 0, originX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.55, ease: EASE } },
};

/* ─── Tech stack rows ────────────────────────────────────────── */
const stackGrid = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055, delayChildren: 0 } },
};

const stackRow = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.42, ease: EASE } },
};

/* ─── Tags ───────────────────────────────────────────────────── */
const tagGrid = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.03, delayChildren: 0 } },
};

const tagItem = {
  hidden: { opacity: 0, scale: 0.78 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.32, ease: EASE } },
};

/* ─── Component ──────────────────────────────────────────────── */

export default function ProjectDetailModal({
  project,
  onClose,
}: {
  project: ProjectDetails | null;
  onClose: () => void;
}) {
  const prefersReduced = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const noMotion = !!prefersReduced;

  /* Lock body scroll */
  useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [project]);

  /* Escape key */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (project) {
      window.addEventListener("keydown", handler);
      return () => window.removeEventListener("keydown", handler);
    }
  }, [project, onClose]);

  /* Scroll to top on open */
  useEffect(() => {
    if (project && scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [project]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          key="project-modal-overlay"
          ref={scrollRef}
          className="fixed inset-0 z-[2000] flex items-start justify-center overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          {/* ── Backdrop ── */}
          <motion.div
            className="fixed inset-0 bg-bg-deep/85 backdrop-blur-xl"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />

          {/* ── Panel ── */}
          <motion.div
            className="relative z-10 w-full max-w-[960px] mx-4 my-12 sm:my-16"
            initial={noMotion
              ? { opacity: 0 }
              : { opacity: 0, y: 56, scale: 0.94 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={noMotion
              ? { opacity: 0 }
              : { opacity: 0, y: 18, scale: 0.98, transition: { duration: 0.22, ease: EASE } }
            }
            transition={noMotion
              ? { duration: 0.2 }
              : { ...SPRING_PANEL, opacity: { duration: 0.28, ease: "easeOut" } }
            }
            onClick={(e) => e.stopPropagation()}
          >
            <div className="clip-corner-case overflow-hidden border border-border bg-bg-card shadow-lg">

              {/* ── Header ── */}
              <motion.div
                className="relative px-8 pt-10 pb-9 sm:px-12 sm:pt-12 sm:pb-11 border-b border-border"
                variants={noMotion ? undefined : headerStagger}
                initial="hidden"
                animate="visible"
              >
                {/* Accent gradient line — scales from center */}
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-px"
                  style={{
                    background:
                      "linear-gradient(to right, transparent, var(--color-accent-1), var(--color-accent-2), transparent)",
                    transformOrigin: "center",
                  }}
                  variants={noMotion ? undefined : scaleLine}
                />

                {/* Close button */}
                <motion.button
                  onClick={onClose}
                  className="absolute top-5 right-5 sm:top-6 sm:right-6 w-9 h-9 rounded-full flex items-center justify-center border border-border bg-bg-surface/80 text-text-muted transition-colors duration-200 hover:text-text-primary hover:border-border-hover hover:bg-bg-card"
                  aria-label="Close"
                  variants={noMotion ? undefined : fadeUp}
                  whileHover={noMotion ? undefined : { scale: 1.12, rotate: 90 }}
                  transition={SPRING_CLOSE}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </motion.button>

                {/* Category eyebrow */}
                <motion.div variants={noMotion ? undefined : fadeUp} className="mb-3">
                  <span className="inline-flex items-center gap-1.5 font-mono text-[0.72rem] uppercase tracking-[0.18em] text-accent-1 font-semibold">
                    <span className="block w-4 h-px bg-accent-1/50" />
                    {project.category}
                  </span>
                </motion.div>

                {/* Title */}
                <motion.h2
                  className="font-display font-[800] text-[clamp(2rem,4vw,2.8rem)] leading-[1.1] text-text-primary tracking-tight pr-12 mb-3"
                  variants={noMotion ? undefined : fadeUpBlur}
                >
                  {project.name}
                </motion.h2>

                {/* Tagline */}
                <motion.p
                  className="text-accent-2 text-[1.05rem] font-medium leading-snug"
                  variants={noMotion ? undefined : fadeUp}
                >
                  {project.tagline}
                </motion.p>
              </motion.div>

              {/* ── Screenshots — staggered scale-in ── */}
              <motion.div
                className="grid grid-cols-2 gap-px border-b border-border bg-border"
                variants={noMotion ? undefined : imgGridStagger}
                initial="hidden"
                animate="visible"
              >
                {[
                  { src: project.image,  label: project.imageLabel },
                  { src: project.image2, label: project.image2Label },
                ].map(({ src, label }) => (
                  <motion.div
                    key={label}
                    className="relative h-60 sm:h-80 bg-bg-surface overflow-hidden"
                    variants={noMotion ? undefined : imgReveal}
                  >
                    <Image
                      src={src}
                      alt={`${project.name} — ${label}`}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 50vw, 380px"
                    />
                    {/* Image label chip */}
                    <div className="absolute bottom-2 left-2.5">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-bg-card/85 backdrop-blur-sm border border-border text-[0.63rem] font-mono font-medium uppercase tracking-[0.1em] text-text-muted">
                        {label}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* ── Body ── */}
              <motion.div
                className="px-8 py-12 sm:px-12 sm:py-14 space-y-12"
                variants={noMotion ? undefined : bodyStagger}
                initial="hidden"
                animate="visible"
              >

                {/* Overview */}
                <motion.p
                  className="text-[1.06rem] leading-[1.8] text-text-secondary"
                  variants={noMotion ? undefined : fadeUp}
                >
                  {project.fullDetails.overview}
                </motion.p>

                {/* ── Highlight cards — individually staggered ── */}
                {project.fullDetails.highlights.length > 0 && (
                  <motion.div
                    className="grid grid-cols-2 sm:grid-cols-4 gap-3"
                    variants={noMotion ? undefined : highlightGrid}
                  >
                    {project.fullDetails.highlights.map(({ label, value }) => (
                      <motion.div
                        key={label}
                        className="rounded-xl border border-border bg-bg-surface px-4 py-4 text-center cursor-default"
                        variants={noMotion ? undefined : highlightCard}
                        whileHover={noMotion ? undefined : { y: -3, scale: 1.03 }}
                        transition={SPRING_CARD}
                      >
                        <p className="font-display font-[800] text-[1.85rem] text-text-primary leading-none mb-2">
                          {value}
                        </p>
                        <p className="font-mono text-[0.68rem] uppercase tracking-[0.13em] text-text-muted">
                          {label}
                        </p>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* ── Detail sections ── */}
                {project.fullDetails.sections.map((section, i) => (
                  <motion.div
                    key={i}
                    variants={noMotion ? undefined : fadeUp}
                  >
                    {/* Divider — scaleX from left */}
                    {i > 0 && (
                      <motion.div
                        className="h-px mb-10"
                        style={{
                          background:
                            "linear-gradient(to right, var(--color-border), var(--color-border-hover), transparent)",
                          transformOrigin: "left",
                        }}
                        variants={noMotion ? undefined : dividerReveal}
                      />
                    )}

                    <div className="flex items-start gap-4 mb-3.5">
                      <span className="font-mono text-[0.7rem] font-semibold text-accent-1/50 mt-[0.35rem] shrink-0 tracking-widest">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <motion.h3
                        className="font-display font-[700] text-text-primary text-[1.28rem] leading-[1.32]"
                        variants={noMotion ? undefined : slideLeft}
                      >
                        {section.heading}
                      </motion.h3>
                    </div>

                    <p className="text-[1rem] leading-[1.8] text-text-secondary pl-8">
                      {section.body}
                    </p>
                  </motion.div>
                ))}

                {/* ── Tech stack — rows stagger in from left ── */}
                {project.fullDetails.techStack.length > 0 && (
                  <motion.div variants={noMotion ? undefined : fadeUp}>
                    <p className="font-mono text-[0.72rem] uppercase tracking-[0.15em] text-text-muted mb-4">
                      Tech Stack
                    </p>
                    <motion.div
                      className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                      variants={noMotion ? undefined : stackGrid}
                    >
                      {project.fullDetails.techStack.map(({ layer, tech }) => (
                        <motion.div
                          key={layer}
                          className="flex items-start gap-3 rounded-lg border border-border bg-bg-surface px-4 py-3"
                          variants={noMotion ? undefined : stackRow}
                          whileHover={noMotion ? undefined : { x: 3 }}
                          transition={SPRING_ROW}
                        >
                          <span className="font-mono text-[0.7rem] text-accent-1 uppercase tracking-wider shrink-0 w-28 pt-px leading-snug">
                            {layer}
                          </span>
                          <span className="text-[0.9rem] text-text-secondary leading-snug">
                            {tech}
                          </span>
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>
                )}

                {/* ── Tags — staggered scale-pop ── */}
                <motion.div variants={noMotion ? undefined : fadeUp}>
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-text-muted mb-3.5">
                    Full Stack
                  </p>
                  <motion.div
                    className="flex flex-wrap gap-2"
                    variants={noMotion ? undefined : tagGrid}
                  >
                    {project.tags.map((tag) => (
                      <motion.span
                        key={tag}
                        className="px-3 py-1 rounded-full text-[0.72rem] font-mono font-medium tracking-wide bg-bg-surface text-text-secondary border border-border cursor-default"
                        variants={noMotion ? undefined : tagItem}
                        whileHover={noMotion ? undefined : { scale: 1.08, y: -1 }}
                        transition={SPRING_TAG}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </motion.div>
                </motion.div>

                {/* ── Footer: back link + live demo ── */}
                <motion.div
                  className="pt-2 border-t border-border flex items-center justify-between gap-4 flex-wrap"
                  variants={noMotion ? undefined : fadeUp}
                >
                  <button
                    onClick={onClose}
                    className="group font-mono text-[0.85rem] text-text-muted inline-flex items-center gap-2 pt-6 transition-colors duration-200 hover:text-accent-1"
                  >
                    <span className="inline-block transition-transform duration-200 group-hover:-translate-x-1">
                      &larr;
                    </span>
                    Back to projects
                  </button>

                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex items-center gap-2 font-mono text-[0.78rem] uppercase tracking-[0.12em] text-accent-1 border border-accent-1/30 rounded-full px-5 py-2 hover:bg-accent-1/10 hover:border-accent-1/60 transition-colors duration-200 clip-corner-sm"
                    >
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 2H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V8" />
                        <path d="M8 1h4v4" />
                        <path d="M12 1L5.5 7.5" />
                      </svg>
                      View Live
                    </a>
                  )}
                </motion.div>

              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
