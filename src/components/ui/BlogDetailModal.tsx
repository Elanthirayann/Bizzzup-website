"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { EXPO_OUT } from "@/lib/animations";

export interface BlogPost {
  title: string;
  description: string;
  date: string;
  author: string;
  readTime: string;
  projectSlug?: string;
  fullContent: {
    intro: string;
    sections: { heading: string; body: string }[];
    takeaway: string;
  };
}

const EASE: [number, number, number, number] = EXPO_OUT;

/* ── Stagger container for inner content ── */
const contentStagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE },
  },
};

const fadeUpBlur = {
  hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: EASE },
  },
};

const scaleLine = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.6, ease: EASE },
  },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: EASE },
  },
};

export default function BlogDetailModal({
  post,
  onClose,
}: {
  post: BlogPost | null;
  onClose: () => void;
}) {
  const prefersReduced = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);

  /* Lock body scroll */
  useEffect(() => {
    if (post) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [post]);

  /* Escape key */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (post) {
      window.addEventListener("keydown", handler);
      return () => window.removeEventListener("keydown", handler);
    }
  }, [post, onClose]);

  /* Scroll content to top on open */
  useEffect(() => {
    if (post && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [post]);

  const noMotion = !!prefersReduced;

  return (
    <AnimatePresence>
      {post && (
        <motion.div
          key="blog-modal-overlay"
          className="fixed inset-0 z-[2000] flex items-start justify-center overflow-y-auto"
          ref={scrollRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-bg-deep/80 backdrop-blur-xl"
            aria-hidden="true"
            initial={{ backdropFilter: "blur(0px)" }}
            animate={{ backdropFilter: "blur(20px)" }}
            transition={{ duration: 0.5 }}
          />

          {/* Modal panel */}
          <motion.div
            className="relative z-10 w-full max-w-[880px] mx-4 my-12 sm:my-16"
            initial={noMotion ? { opacity: 0 } : { opacity: 0, y: 48, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={noMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.45, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="clip-corner-case overflow-hidden border border-border bg-bg-card">
              {/* ── Header band ── */}
              <motion.div
                className="relative px-8 pt-10 pb-8 sm:px-12 sm:pt-12 sm:pb-10 border-b border-border"
                variants={noMotion ? undefined : contentStagger}
                initial="hidden"
                animate="visible"
              >
                {/* Decorative top-edge gradient line */}
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
                  className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center border border-border bg-bg-deep/50 text-text-muted transition-colors duration-200 hover:text-text-primary hover:border-border-hover"
                  aria-label="Close"
                  variants={noMotion ? undefined : fadeUp}
                  whileHover={noMotion ? undefined : { scale: 1.1, rotate: 90 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M3 3l8 8M11 3l-8 8"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </motion.button>

                {/* Meta row */}
                <motion.div
                  className="flex items-center gap-3 flex-wrap mb-5"
                  variants={noMotion ? undefined : fadeUp}
                >
                  <span className="font-mono text-[0.7rem] tracking-wide text-text-muted">
                    {post.date}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-text-muted/60 shrink-0" />
                  <span className="font-mono text-[0.7rem] tracking-wide text-accent-1">
                    {post.readTime}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-text-muted/60 shrink-0" />
                  <span className="font-mono text-[0.7rem] tracking-wide text-text-muted">
                    {post.author}
                  </span>
                </motion.div>

                {/* Title */}
                <motion.h2
                  className="font-display font-[800] text-[clamp(1.75rem,3.5vw,2.5rem)] leading-[1.15] text-text-primary tracking-tight pr-10"
                  variants={noMotion ? undefined : fadeUpBlur}
                >
                  {post.title}
                </motion.h2>
              </motion.div>

              {/* ── Body content ── */}
              <motion.div
                className="px-8 py-10 sm:px-12 sm:py-14 space-y-10 sm:space-y-12"
                variants={noMotion ? undefined : contentStagger}
                initial="hidden"
                animate="visible"
              >
                {/* Intro — lead paragraph */}
                <motion.p
                  className="text-[1.08rem] leading-[1.82] text-text-secondary font-[400]"
                  variants={noMotion ? undefined : fadeUp}
                >
                  {post.fullContent.intro}
                </motion.p>

                {/* Sections */}
                {post.fullContent.sections.map((section, i) => (
                  <motion.div
                    key={i}
                    className={i > 0 ? "pt-1" : ""}
                    variants={noMotion ? undefined : fadeUp}
                  >
                    {/* Section divider line */}
                    {i > 0 && (
                      <motion.div
                        className="h-px mb-9 sm:mb-10"
                        style={{
                          background:
                            "linear-gradient(to right, var(--color-border), var(--color-border-hover), transparent)",
                          transformOrigin: "left",
                        }}
                        variants={noMotion ? undefined : scaleLine}
                      />
                    )}

                    {/* Section number + heading */}
                    <div className="flex items-start gap-3.5 mb-4">
                      <span className="font-mono text-[0.65rem] font-medium text-accent-1/60 mt-1.5 shrink-0 tracking-wider">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <motion.h3
                        className="font-display font-[700] text-text-primary text-[1.28rem] leading-[1.32]"
                        variants={noMotion ? undefined : slideInLeft}
                      >
                        {section.heading}
                      </motion.h3>
                    </div>

                    <motion.p
                      className="text-[1rem] leading-[1.8] text-text-secondary pl-[calc(0.65rem+0.875rem+0.875rem)]"
                      variants={noMotion ? undefined : fadeUp}
                    >
                      {section.body}
                    </motion.p>
                  </motion.div>
                ))}

                {/* Takeaway */}
                <motion.div
                  className="relative border-l-2 border-accent-1 bg-accent-1/[0.04] pl-6 pr-5 py-5 rounded-r-lg overflow-hidden"
                  variants={noMotion ? undefined : fadeUpBlur}
                >
                  {/* Subtle gradient overlay inside takeaway */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-30"
                    aria-hidden="true"
                    style={{
                      background:
                        "radial-gradient(ellipse at 0% 50%, var(--color-accent-glow) 0%, transparent 70%)",
                    }}
                  />
                  <p className="relative font-mono text-[0.68rem] uppercase tracking-[0.14em] text-accent-1 mb-2.5">
                    Key Takeaway
                  </p>
                  <p className="relative text-[1.05rem] leading-[1.76] text-text-primary font-[500]">
                    {post.fullContent.takeaway}
                  </p>
                </motion.div>

                {/* Back to articles link */}
                <motion.div
                  className="pt-2"
                  variants={noMotion ? undefined : fadeUp}
                >
                  <button
                    onClick={onClose}
                    className="group font-mono text-[0.78rem] text-text-muted inline-flex items-center gap-2 transition-colors duration-200 hover:text-accent-1"
                  >
                    <span className="inline-block transition-transform duration-200 group-hover:-translate-x-1">
                      &larr;
                    </span>
                    Back to articles
                  </button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
