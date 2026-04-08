"use client";

import React, { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { containerVariants, fadeUpVariants, EXPO_OUT } from "@/lib/animations";

const links = [
  { label: "Solutions", href: "#solutions" },
  { label: "Showcase", href: "#showcase" },
  { label: "Projects", href: "#projects" },
  { label: "Team", href: "#team" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

const socials = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/edwinswanith/",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "X / Twitter",
    href: "https://x.com/bizzzup",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4l11.733 16H20L8.267 4z" />
        <path d="M4 20l6.768-6.768M15.232 10.232L20 4" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "https://github.com/Edwinswanith?tab=repositories",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
    ),
  },
];

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const prefersReduced = useReducedMotion();

  return (
    <motion.footer
      ref={ref}
      variants={prefersReduced ? undefined : containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="relative bg-bg-surface"
    >
      {/* Animated top divider */}
      <motion.div
        className="absolute top-0 inset-x-0 h-px bg-border origin-center"
        initial={prefersReduced ? undefined : { scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : prefersReduced ? undefined : { scaleX: 0 }}
        transition={{ duration: 0.7, ease: EXPO_OUT }}
      />

      {/* Main footer content */}
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          {/* Brand column */}
          <motion.div
            variants={prefersReduced ? undefined : fadeUpVariants}
            className="md:col-span-4"
          >
            <a href="#" className="inline-flex items-center gap-2.5 font-display text-lg font-bold tracking-tight text-text-primary mb-4">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-1 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent-1" />
              </span>
              Bizzzup AI Labs
            </a>
            <p className="text-[1rem] leading-[1.7] text-text-secondary max-w-xs mt-3">
              We engineer intelligence into systems that run work. Multi-agent architectures, from Chennai to the world.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3 mt-6">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-11 w-11 items-center justify-center rounded-md bg-bg-card border border-border text-text-muted transition-all duration-300 hover:border-border-hover hover:text-accent-1 hover:shadow-[0_2px_12px_var(--color-accent-glow)]"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Navigation columns */}
          <motion.div
            variants={prefersReduced ? undefined : fadeUpVariants}
            className="md:col-span-3"
          >
            <h4 className="font-mono text-[0.65rem] font-medium uppercase tracking-[0.14em] text-accent-1 mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5">
              {links.slice(0, 4).map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[0.92rem] text-text-secondary transition-colors duration-300 hover:text-text-primary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            variants={prefersReduced ? undefined : fadeUpVariants}
            className="md:col-span-2"
          >
            <h4 className="font-mono text-[0.65rem] font-medium uppercase tracking-[0.14em] text-accent-1 mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              {links.slice(4).map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[0.92rem] text-text-secondary transition-colors duration-300 hover:text-text-primary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* CTA column */}
          <motion.div
            variants={prefersReduced ? undefined : fadeUpVariants}
            className="md:col-span-3"
          >
            <h4 className="font-mono text-[0.65rem] font-medium uppercase tracking-[0.14em] text-accent-1 mb-4">
              Let&apos;s Talk
            </h4>
            <p className="text-[1rem] text-text-secondary mb-4 leading-relaxed">
              Ready to build something remarkable?
            </p>
            <a
              href="#contact"
              className="clip-corner-md inline-flex items-center justify-center bg-accent-1 px-6 py-3.5 text-[0.8rem] font-bold uppercase tracking-[0.1em] !text-white transition-opacity duration-300 hover:opacity-90"
            >
              Start a Project
            </a>
          </motion.div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <motion.span
            variants={prefersReduced ? undefined : fadeUpVariants}
            className="font-mono text-[0.75rem] text-text-muted"
          >
            &copy; 2024 &ndash; 2026 Bizzzup AI Labs. All rights reserved.
          </motion.span>
          <motion.span
            variants={prefersReduced ? undefined : fadeUpVariants}
            className="font-mono text-[0.75rem] text-text-muted"
          >
            Chennai, India
          </motion.span>
        </div>
      </div>
    </motion.footer>
  );
}
