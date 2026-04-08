"use client";

import Magnetic from "@/components/ui/Magnetic";
import PretextInteractiveText from "@/components/ui/PretextInteractiveText";
import WorkflowCanvas from "@/components/ui/WorkflowCanvas";
import { useIdleReady } from "@/hooks/useIdleReady";
import { useIsMobile } from "@/hooks/useIsMobile";
import { EXPO_OUT } from "@/lib/animations";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

const HERO_HEADLINE = "We Engineer Intelligence Into Systems That Run Work.";
const HERO_SUB =
  "Multi-agent architectures, workflow engines, and model-driven systems designed to execute, optimize, and scale real operations, not just to assist them.";

/* ------------------------------------------------------------------ */
/*  Gradient Orbs (simplified — 2 orbs)                                */
/* ------------------------------------------------------------------ */

function GradientOrbs() {
  return (
    <>
      <div
        className="absolute -top-[10%] -left-[5%] w-[500px] h-[500px] rounded-full opacity-[0.04] pointer-events-none will-change-transform"
        style={{
          background:
            "radial-gradient(circle, var(--color-accent-1), transparent 70%)",
          filter: "blur(120px)",
          animation: "float-gentle 16s ease-in-out infinite",
        }}
      />
      <div
        className="absolute -bottom-[15%] -right-[10%] w-[450px] h-[450px] rounded-full opacity-[0.03] pointer-events-none will-change-transform"
        style={{
          background:
            "radial-gradient(circle, var(--color-accent-3), transparent 70%)",
          filter: "blur(120px)",
          animation: "float-gentle 20s ease-in-out infinite reverse",
        }}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Hero Component                                                */
/* ------------------------------------------------------------------ */

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });
  const prefersReduced = useReducedMotion() ?? false;
  const isMobile = useIsMobile();
  const workflowReady = useIdleReady(380);

  /* Scroll-driven transforms */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  /* Entrance complete state — wait for entrance animations to finish */
  const [entranceComplete, setEntranceComplete] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setEntranceComplete(true), 4000);
    return () => clearTimeout(t);
  }, []);

  const canScroll = entranceComplete && !prefersReduced && !isMobile;

  /* Parallax transforms for text and orbs */
  const textY = useTransform(scrollYProgress, [0, 0.4], [0, -80]);
  const orbY = useTransform(scrollYProgress, [0, 0.3], [0, -30]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-[100dvh] flex-col overflow-x-hidden bg-bg-deep"
    >
      {/* Background orbs — out of flex flow so the hero can vertically center */}
      {!prefersReduced && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
          style={{ y: canScroll ? orbY : 0 }}
        >
          <GradientOrbs />
        </motion.div>
      )}

      {/* Main content: flex-1 + justify-center balances space above and below on tall screens */}
      <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-[1400px] flex-1 flex-col justify-center px-6 pb-16 pt-[6.5rem] md:px-10 md:pb-14 md:pt-32 lg:pb-16 lg:pt-36">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-11 md:gap-14 lg:gap-16 items-center">
          {/* ── Left: Text Content ── */}
          <motion.div style={{ y: canScroll ? textY : 0 }}>
            {/* Badge */}
            <motion.div
              initial={prefersReduced ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EXPO_OUT }}
              className="inline-flex items-center gap-2 px-[1.05rem] py-2 mb-6 md:mb-7 rounded-full border border-border-accent bg-accent-glow"
            >
              <span className="relative flex h-2.5 w-2.5">
                {!prefersReduced && (
                  <span className="absolute inset-0 rounded-full animate-ping opacity-75 bg-accent-1" />
                )}
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent-1" />
              </span>
              <span className="text-[0.8125rem] md:text-sm font-semibold tracking-[0.12em] uppercase font-mono text-accent-1">
                AI Systems Engineering
              </span>
            </motion.div>

            {/* Headline — Pretext layout + canvas pointer forces */}
            <motion.h1
              initial={prefersReduced ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="font-display font-[800] leading-[1.08] tracking-tight mb-7 md:mb-9 text-text-primary"
              style={
                prefersReduced
                  ? {
                      fontSize:
                        "clamp(2.65rem, 4.85vw + 0.45rem, 4.85rem)",
                    }
                  : undefined
              }
            >
              {prefersReduced ? (
                HERO_HEADLINE
              ) : (
                <PretextInteractiveText
                  tone="hero"
                  text={HERO_HEADLINE}
                  className="font-display font-[800] leading-[1.08] tracking-tight text-text-primary"
                  style={{
                    fontSize:
                      "clamp(2.65rem, 4.85vw + 0.45rem, 4.85rem)",
                  }}
                />
              )}
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0, ease: EXPO_OUT }}
              className="text-[1.125rem] md:text-2xl lg:text-[1.6875rem] leading-snug md:leading-[1.62] max-w-xl lg:max-w-2xl mb-7 md:mb-9 text-text-secondary font-body"
            >
              {prefersReduced ? (
                HERO_SUB
              ) : (
                <PretextInteractiveText
                  tone="body"
                  text={HERO_SUB}
                  className="block max-w-xl lg:max-w-2xl text-[1.125rem] md:text-2xl lg:text-[1.6875rem] leading-snug md:leading-[1.62] text-text-secondary font-body"
                />
              )}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={prefersReduced ? {} : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.3, ease: EXPO_OUT }}
              className="flex flex-col sm:flex-row gap-4 sm:gap-5"
            >
              <Magnetic strength={0.22} max={14}>
                <motion.a
                  href="#contact"
                  className="clip-corner-md relative overflow-hidden inline-flex items-center justify-center px-11 py-[1.05rem] md:py-[1.15rem] !text-white font-display font-bold text-base md:text-lg uppercase tracking-widest bg-accent-1"
                  whileHover={prefersReduced ? {} : { scale: 1.04 }}
                  whileTap={prefersReduced ? {} : { scale: 0.97 }}
                >
                  {!prefersReduced && (
                    <motion.span
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(105deg, transparent 40%, color-mix(in srgb, var(--color-bg-card) 15%, transparent) 50%, transparent 60%)",
                      }}
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6, ease: EXPO_OUT }}
                    />
                  )}
                  Build With Us
                </motion.a>
              </Magnetic>

              <Magnetic strength={0.18} max={11}>
                <motion.a
                  href="#projects"
                  className="inline-flex items-center justify-center gap-2 px-11 py-[1.05rem] md:py-[1.15rem] font-display font-semibold text-base md:text-lg uppercase tracking-widest rounded-sm transition-colors border border-border text-text-primary"
                  whileHover={
                    prefersReduced
                      ? {}
                      : {
                          scale: 1.03,
                          borderColor: "var(--color-accent-1)",
                          color: "var(--color-accent-1)",
                        }
                  }
                  whileTap={prefersReduced ? {} : { scale: 0.97 }}
                >
                  See Systems in Action
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="inline-block"
                  >
                    <path
                      d="M3 8h10M9 4l4 4-4 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.a>
              </Magnetic>
            </motion.div>
          </motion.div>

          {/* ── Right: AI Workflow Canvas ── */}
          <motion.div
            initial={prefersReduced ? {} : { opacity: 0, scale: 0.96 }}
            animate={inView ? { opacity: 1, scale: 1 } : undefined}
            transition={{ duration: 1.0, delay: 0.6, ease: EXPO_OUT }}
            className="relative flex flex-col items-center justify-center md:col-span-1 scale-[0.93] sm:scale-[0.97] md:scale-[0.86] lg:scale-[0.96] xl:scale-[1.02]"
          >
            {/* ── Top decorative elements ── */}
            <div className="w-full flex items-center justify-between px-4 mb-3">
              {/* Floating metric pills */}
              <motion.div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-bg-card/60 backdrop-blur-sm"
                initial={{ opacity: 0, y: 8 }}
                animate={inView ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.6, delay: 1.8, ease: EXPO_OUT }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-accent-2 animate-pulse" />
                <span className="text-[0.6rem] font-mono text-text-muted tracking-wide">
                  Sub-40ms latency
                </span>
              </motion.div>
              <motion.div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-bg-card/60 backdrop-blur-sm"
                initial={{ opacity: 0, y: 8 }}
                animate={inView ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.6, delay: 2.0, ease: EXPO_OUT }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-accent-1 animate-pulse" />
                <span className="text-[0.6rem] font-mono text-text-muted tracking-wide">
                  99.9% uptime
                </span>
              </motion.div>
            </div>

            {/* Main workflow canvas — mount after idle so first paint matches lower sections */}
            {workflowReady ? (
              <WorkflowCanvas
                inView={inView}
                reduced={prefersReduced}
                scrollProgress={canScroll ? scrollYProgress : undefined}
                mode={canScroll ? "scroll" : "entrance"}
              />
            ) : (
              <div
                className="w-full max-w-full min-h-[300px] mx-auto rounded-2xl bg-bg-card/30 border border-border/40"
                aria-hidden
              />
            )}

            {/* ── Bottom decorative elements ── */}
            <div className="w-full flex items-center justify-between px-4 mt-3">
              <motion.div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-bg-card/60 backdrop-blur-sm"
                initial={{ opacity: 0, y: -6 }}
                animate={inView ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.6, delay: 2.2, ease: EXPO_OUT }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-accent-3 animate-pulse" />
                <span className="text-[0.6rem] font-mono text-text-muted tracking-wide">
                  Multi-agent ready
                </span>
              </motion.div>
              <motion.div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-bg-card/60 backdrop-blur-sm"
                initial={{ opacity: 0, y: -6 }}
                animate={inView ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.6, delay: 2.4, ease: EXPO_OUT }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-accent-2 animate-pulse" />
                <span className="text-[0.6rem] font-mono text-text-muted tracking-wide">
                  Production-grade
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* ── Scroll indicator ── */}
        <motion.div
          initial={prefersReduced ? {} : { opacity: 0 }}
          animate={inView ? { opacity: 1 } : undefined}
          transition={{ duration: 0.8, delay: 3.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[0.6rem] tracking-[0.25em] uppercase font-mono text-text-muted">
            Scroll
          </span>
          <div
            className="w-px h-8"
            style={{
              background:
                "linear-gradient(to bottom, var(--color-accent-1), transparent)",
              animation: prefersReduced
                ? "none"
                : "hero-scroll-line-pulse 2s ease-in-out infinite",
            }}
          />
        </motion.div>

        <style>{`
          @keyframes hero-scroll-line-pulse {
            0%, 100% { opacity: 0.3; transform: scaleY(0.6); }
            50% { opacity: 1; transform: scaleY(1); }
          }
        `}</style>
      </div>
    </section>
  );
}
