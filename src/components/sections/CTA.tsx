"use client";

import React, { useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  useReplay,
  containerVariants,
  fadeUpVariants,
  scaleLineVariants,
} from "@/lib/animations";
import ParallaxLayer from "@/components/ui/ParallaxLayer";

export default function CTA() {
  const ref = useRef<HTMLElement>(null);
  const [isInView, replayKey] = useReplay(ref, { margin: "-60px" });
  const prefersReduced = useReducedMotion();

  /* Hover state */
  const [primaryHovered, setPrimaryHovered] = useState(false);

  return (
    <section
      ref={ref}
      className="relative py-10 sm:py-12 lg:py-14 bg-bg-surface overflow-hidden"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2"
        aria-hidden
      >
        <ParallaxLayer
          scrollTargetRef={ref}
          range={26}
          invert
          className="h-full w-full"
        >
          <span
            className="block h-full w-full rounded-full"
            style={{
              background:
                "radial-gradient(circle, var(--color-accent-glow) 0%, transparent 70%)",
            }}
          />
        </ParallaxLayer>
      </div>

      <motion.div
        key={replayKey}
        className="relative z-[1] mx-auto max-w-[720px] px-6 text-center"
        variants={prefersReduced ? undefined : containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* Label */}
        <motion.div
          variants={prefersReduced ? undefined : fadeUpVariants}
          className="mb-6 flex items-center justify-center gap-3"
        >
          <motion.span
            variants={prefersReduced ? undefined : scaleLineVariants}
            className="block h-px w-[30px] bg-accent-1"
          />
          <span className="font-mono text-[0.75rem] font-medium uppercase tracking-[0.14em] text-accent-1">
            Get Started
          </span>
          <motion.span
            variants={prefersReduced ? undefined : scaleLineVariants}
            className="block h-px w-[30px] bg-accent-1"
          />
        </motion.div>

        {/* Heading */}
        <motion.h2
          variants={prefersReduced ? undefined : fadeUpVariants}
          className="font-display font-[800] leading-[1.15] text-text-primary mb-5"
          style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)" }}
        >
          Ready to build something{" "}
          <span className="gradient-text shimmer italic">remarkable</span>?
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          variants={prefersReduced ? undefined : fadeUpVariants}
          className="mx-auto mb-10 max-w-[480px] text-[1.1rem] leading-[1.75] text-text-secondary"
        >
          Tell us about your project and we&apos;ll show you what AI can do for
          your team — no pitch deck required.
        </motion.p>

        {/* Button */}
        <motion.div
          variants={prefersReduced ? undefined : fadeUpVariants}
          className="flex justify-center"
        >
          <motion.a
            href="#contact"
            className="clip-corner-md relative overflow-hidden inline-flex items-center justify-center px-10 py-4 text-base font-semibold font-display bg-accent-1 !text-white tracking-[0.02em] transition-shadow duration-300 hover:shadow-[0_0_32px_var(--color-border-accent)]"
            whileHover={prefersReduced ? undefined : { scale: 1.04 }}
            whileTap={prefersReduced ? undefined : { scale: 0.97 }}
            onHoverStart={() => setPrimaryHovered(true)}
            onHoverEnd={() => setPrimaryHovered(false)}
          >
            Get in Touch
            {/* Shimmer overlay */}
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(105deg, transparent 40%, color-mix(in srgb, var(--color-bg-card) 15%, transparent) 50%, transparent 60%)",
              }}
              initial={{ x: "-100%" }}
              animate={{
                x: primaryHovered && !prefersReduced ? "100%" : "-100%",
              }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
}
