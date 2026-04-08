"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  useReplay,
  containerVariants,
  fadeUpVariants,
  scaleLineVariants,
  EXPO_OUT,
} from "@/lib/animations";
import ParallaxLayer from "@/components/ui/ParallaxLayer";

const rotatingWords = ["real", "bold", "next", "great"];

const OFFICE_ADDRESS =
  "105, ECR Road, Panaiyur, Chennai 600119, Tamil Nadu, India";

/* CSS-transition rotating word (immune to parent motion context) */
function RotatingContactWord({ words, index }: { words: string[]; index: number }) {
  const [visible, setVisible] = useState(true);
  const [displayIndex, setDisplayIndex] = useState(index);

  useEffect(() => {
    if (index === displayIndex) return;
    setVisible(false);
    const timer = setTimeout(() => {
      setDisplayIndex(index);
      setVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [index, displayIndex]);

  return (
    <span
      className="font-[800] gradient-text transition-opacity duration-300 ease-out"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {words[displayIndex]}
    </span>
  );
}

const contactItems = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
    label: "Email",
    value: "hello@bizzzup.com",
    href: "mailto:hello@bizzzup.com",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    label: "Phone",
    value: "+91 9003 020 030",
    href: "tel:+919003020030",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    label: "Office",
    value: OFFICE_ADDRESS,
    href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(OFFICE_ADDRESS)}`,
  },
] as const;

const formFieldVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EXPO_OUT },
  },
};

type FormStatus = "idle" | "loading" | "success" | "error";

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const [isInView, replayKey] = useReplay(ref, { margin: "-80px" });
  const [wordIndex, setWordIndex] = useState(0);
  const prefersReduced = useReducedMotion();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg("Please fill in your name, email, and message.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to send message.");
      }
      setStatus("success");
      setName(""); setEmail(""); setSubject(""); setMessage("");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  useEffect(() => {
    if (prefersReduced) return;
    const timer = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2200);
    return () => clearInterval(timer);
  }, [prefersReduced]);

  return (
    <section
      ref={ref}
      id="contact"
      className="relative py-10 sm:py-12 lg:py-14 bg-bg-deep overflow-hidden"
    >
      {/* Background radial accents — parallax drift */}
      <ParallaxLayer
        scrollTargetRef={ref}
        range={22}
        invert
        className="pointer-events-none absolute inset-0"
      >
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 20% 50%, var(--color-accent-glow) 0%, transparent 60%),
                       radial-gradient(ellipse at 80% 50%, var(--color-accent-glow) 0%, transparent 60%)`,
          }}
        />
      </ParallaxLayer>

      <ParallaxLayer
        scrollTargetRef={ref}
        range={38}
        className="pointer-events-none absolute -top-[5%] -left-[5%] w-[500px] h-[500px] rounded-full opacity-[0.04]"
      >
        <div
          className="h-full w-full rounded-full"
          style={{
            background: "radial-gradient(circle, var(--color-accent-1), transparent 70%)",
          }}
        />
      </ParallaxLayer>
      <ParallaxLayer
        scrollTargetRef={ref}
        range={48}
        invert
        className="pointer-events-none absolute -bottom-[5%] -right-[8%] w-[600px] h-[600px] rounded-full opacity-[0.04]"
      >
        <div
          className="h-full w-full rounded-full"
          style={{
            background: "radial-gradient(circle, var(--color-accent-3), transparent 70%)",
          }}
        />
      </ParallaxLayer>

      <motion.div
        key={replayKey}
        className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-10"
        variants={prefersReduced ? undefined : containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* Two-column grid — responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left — Heading + Contact Info */}
          <motion.div
            variants={
              prefersReduced
                ? undefined
                : {
                    hidden: {},
                    visible: {
                      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
                    },
                  }
            }
            className="flex flex-col gap-8"
          >
            {/* Section heading — inside left column */}
            <div className="mb-2">
              <motion.div
                variants={prefersReduced ? undefined : fadeUpVariants}
                className="flex items-center gap-3 mb-6"
              >
                <motion.span
                  variants={prefersReduced ? undefined : scaleLineVariants}
                  className="block h-px w-[30px] bg-accent-1"
                />
                <span className="font-mono text-[0.75rem] font-medium uppercase tracking-[0.14em] text-accent-1">
                  Get in Touch
                </span>
              </motion.div>

              <motion.h2
                variants={prefersReduced ? undefined : fadeUpVariants}
                className="font-display font-[800] leading-[1.15] text-text-primary"
                style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)" }}
              >
                Let&apos;s build{" "}
                <span className="whitespace-nowrap">
                  <span className="gradient-text italic">something</span>{" "}
                  <RotatingContactWord words={rotatingWords} index={wordIndex} />
                </span>
              </motion.h2>
            </div>

            {contactItems.map((item, i) => {
              const external = item.href.startsWith("http");
              const aria =
                item.label === "Email"
                  ? `Send email to ${item.value}`
                  : item.label === "Phone"
                    ? `Call ${item.value}`
                    : `Open ${item.label} in Google Maps: ${item.value}`;
              return (
                <motion.div
                  key={i}
                  variants={prefersReduced ? undefined : fadeUpVariants}
                >
                  <a
                    href={item.href}
                    {...(external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    aria-label={aria}
                    className="group -mx-2 flex items-start gap-5 rounded-xl border border-transparent p-2 transition-all duration-300 hover:border-border hover:bg-bg-card/55 hover:shadow-[0_4px_24px_color-mix(in_srgb,var(--color-text-primary)_4%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-1/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-deep"
                  >
                    <div className="clip-corner-sm flex h-12 w-12 shrink-0 items-center justify-center border border-border-accent bg-bg-surface text-accent-1 transition-colors duration-300 group-hover:border-accent-1/45 group-hover:bg-accent-glow">
                      {item.icon}
                    </div>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <span className="font-mono text-[0.75rem] uppercase tracking-[0.12em] text-text-muted block mb-1">
                        {item.label}
                      </span>
                      <span className="text-text-primary text-[1rem] leading-relaxed transition-colors duration-300 group-hover:text-accent-1 underline-offset-[0.2em] decoration-accent-1/30 group-hover:underline">
                        {item.value}
                      </span>
                    </div>
                  </a>
                </motion.div>
              );
            })}

            {/* Additional trust signal */}
            <motion.div
              variants={prefersReduced ? undefined : fadeUpVariants}
              className="mt-4 flex items-center gap-3 border-t border-border pt-6"
            >
              <span className="flex h-2 w-2">
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-2" />
              </span>
              <span className="font-mono text-[0.72rem] text-text-muted">
                Typically respond within 24 hours
              </span>
            </motion.div>
          </motion.div>

          {/* Right — Contact Form */}
          <motion.form
            variants={
              prefersReduced
                ? undefined
                : {
                    hidden: {},
                    visible: {
                      transition: { staggerChildren: 0.08, delayChildren: 0.15 },
                    },
                  }
            }
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            {/* Name + Email row */}
            <motion.div
              variants={prefersReduced ? undefined : formFieldVariants}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <label className="sr-only" htmlFor="contact-name">Name</label>
              <input
                id="contact-name"
                type="text"
                placeholder="Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={status === "loading" || status === "success"}
                className="contact-input w-full clip-corner-md px-4 py-4 bg-bg-card border border-border text-text-primary text-[1rem] outline-none transition-all duration-300 focus:border-border-accent focus:shadow-[0_0_0_3px_var(--color-accent-glow)] disabled:opacity-60"
              />
              <label className="sr-only" htmlFor="contact-email">Email</label>
              <input
                id="contact-email"
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "loading" || status === "success"}
                className="contact-input w-full clip-corner-md px-4 py-4 bg-bg-card border border-border text-text-primary text-[1rem] outline-none transition-all duration-300 focus:border-border-accent focus:shadow-[0_0_0_3px_var(--color-accent-glow)] disabled:opacity-60"
              />
            </motion.div>

            {/* Subject */}
            <motion.div variants={prefersReduced ? undefined : formFieldVariants}>
              <label className="sr-only" htmlFor="contact-subject">Subject</label>
              <input
                id="contact-subject"
                type="text"
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={status === "loading" || status === "success"}
                className="contact-input w-full clip-corner-md px-4 py-4 bg-bg-card border border-border text-text-primary text-[1rem] outline-none transition-all duration-300 focus:border-border-accent focus:shadow-[0_0_0_3px_var(--color-accent-glow)] disabled:opacity-60"
              />
            </motion.div>

            {/* Textarea */}
            <motion.div variants={prefersReduced ? undefined : formFieldVariants}>
              <label className="sr-only" htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                placeholder="Tell us about your project..."
                rows={6}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={status === "loading" || status === "success"}
                className="contact-input w-full clip-corner-md px-4 py-3.5 bg-bg-card border border-border text-text-primary text-[1rem] outline-none transition-all duration-300 resize-y min-h-[140px] focus:border-border-accent focus:shadow-[0_0_0_3px_var(--color-accent-glow)] disabled:opacity-60"
              />
            </motion.div>

            {/* Success message */}
            {status === "success" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 px-4 py-3 bg-accent-glow border border-border-accent clip-corner-md"
              >
                <span className="flex h-2 w-2 shrink-0">
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-2" />
                </span>
                <span className="font-mono text-[0.8rem] text-text-primary">
                  Message sent! We&apos;ll get back to you within 24 hours.
                </span>
              </motion.div>
            )}

            {/* Error message */}
            {status === "error" && errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 py-3 border border-border clip-corner-md"
              >
                <span className="font-mono text-[0.8rem] text-text-secondary">
                  {errorMsg}
                </span>
              </motion.div>
            )}

            {/* Submit — no animation wrapper so it's always visible */}
            <div>
              <motion.button
                type="submit"
                disabled={status === "loading" || status === "success"}
                whileHover={prefersReduced || status !== "idle" ? {} : { scale: 1.015 }}
                whileTap={prefersReduced || status !== "idle" ? {} : { scale: 0.985 }}
                className="clip-corner-md relative w-full overflow-hidden flex items-center justify-center gap-3 px-8 py-4 !bg-accent-1 !text-white font-display text-[1rem] font-bold uppercase tracking-[0.06em] transition-all duration-300 hover:shadow-[0_10px_40px_var(--color-accent-glow)] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {/* Spinner when loading */}
                {status === "loading" && (
                  <svg className="animate-spin h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                )}
                {/* Checkmark when sent */}
                {status === "success" && (
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
                {/* Arrow icon when idle */}
                {status === "idle" && (
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                )}
                <span>
                  {status === "loading" ? "Sending…" : status === "success" ? "Message Sent!" : "Send Message"}
                </span>
                {/* Shimmer overlay */}
                {!prefersReduced && (
                  <span
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(110deg, transparent 30%, color-mix(in srgb, var(--color-bg-card) 20%, transparent) 50%, transparent 70%)",
                      transform: "translateX(-100%)",
                      transition: "transform 0.6s ease",
                    }}
                  />
                )}
              </motion.button>
            </div>
          </motion.form>
        </div>
      </motion.div>

      {/* Shimmer on hover */}
      <style>{`
        .clip-corner-md:hover + .absolute,
        button:hover > span[class*="absolute"] {
          transform: translateX(100%) !important;
        }
        @media (max-width: 640px) {
          .contact-input {
            font-size: 16px !important;
          }
        }
      `}</style>
    </section>
  );
}
