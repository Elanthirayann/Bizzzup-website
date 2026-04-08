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
import BlogDetailModal from "@/components/ui/BlogDetailModal";
import type { BlogPost } from "@/components/ui/BlogDetailModal";

const posts: BlogPost[] = [
  {
    title: "Building a Fast Agent Platform with Google ADK + Notion MCP",
    description:
      "How we architected a blazing-fast agent orchestration layer using Google's Agent Development Kit paired with Notion as a Model Context Protocol server for enterprise knowledge retrieval.",
    date: "Nov 30, 2024",
    author: "Bizzzup AI Labs",
    readTime: "6 min read",
    projectSlug: "intelligent-agent-platform",
    fullContent: {
      intro:
        "When we set out to build an intelligent agent platform, we needed something that could orchestrate multiple AI agents while keeping costs absurdly low. The combination of Google's Agent Development Kit (ADK) and Notion as a Model Context Protocol (MCP) server turned out to be the perfect pairing — giving us enterprise-grade orchestration at a fraction of the typical cost.",
      sections: [
        {
          heading: "Why Google ADK + Notion MCP?",
          body: "Google ADK provides a flexible framework for building, deploying, and managing AI agents. Paired with Notion as an MCP server, we get a structured knowledge base that agents can query in real-time. The MCP layer acts as a bridge between the agent's reasoning and the organization's institutional knowledge — documents, databases, and workflows all become queryable context.",
        },
        {
          heading: "Architecture That Scales",
          body: "Our local MCP server acts as a flexible database layer. It integrates seamlessly with online MCP tools, unlocking additional automation features. Each request costs just ₹10–₹15 (approximately $0.12–$0.18 USD) using the Gemini API for intelligent processing. For less than $0.20 per operation, you get a complete agent-powered backend automation system.",
        },
        {
          heading: "Key Capabilities",
          body: "The platform supports CRUD operations with live sync, multi-agent coordination across enterprise tools, and natural language interfaces for non-technical users. Agents can research, qualify data, trigger workflows, and hand off results — all autonomously. We built it to handle everything from simple record management to complex cross-tool orchestration.",
        },
      ],
      takeaway:
        "You don't need expensive infrastructure to build intelligent agent systems. With the right architecture, you can deliver enterprise-grade AI orchestration at consumer-grade pricing.",
    },
  },
  {
    title: "Introducing Our Smart RAG Platform for Every Department",
    description:
      "A retrieval-augmented generation system designed to serve marketing, engineering, legal, and finance teams equally well — with department-aware context windows and guardrails.",
    date: "May 8, 2024",
    author: "Bizzzup AI Labs",
    readTime: "5 min read",
    projectSlug: "enterprise-rag-platform",
    fullContent: {
      intro:
        "Most RAG systems are built for a single use case. Ours had to serve marketing teams drafting campaigns, engineers debugging production issues, legal reviewing contracts, and finance teams querying compliance data — all from the same platform, with department-aware context windows and strict guardrails.",
      sections: [
        {
          heading: "Department-Aware Context Windows",
          body: "Each department gets a tuned context window that prioritizes relevant document types, terminology, and data sources. When marketing queries the system, it surfaces brand guidelines, campaign metrics, and audience data. When legal queries, it prioritizes contract clauses, compliance frameworks, and precedents. Same platform, completely different context behavior.",
        },
        {
          heading: "Sub-40ms Response Times",
          body: "We engineered the retrieval pipeline for speed. Semantic search across the knowledge base returns precise, cited answers in under 40 milliseconds. Real-time indexing means new documents are queryable within seconds of upload. Source citations are attached to every response so teams can verify and trace back to the original material.",
        },
        {
          heading: "Built-In Guardrails",
          body: "Access control is baked into the architecture. Finance can't accidentally surface HR data, and engineering queries won't leak customer PII. Each department's retrieval scope is bounded by configurable policies, and all queries are logged for audit trails. It's compliance-first design, not an afterthought.",
        },
      ],
      takeaway:
        "A single RAG platform can serve an entire organization — but only if it's designed with department-aware context, strict access controls, and real-time indexing from day one.",
    },
  },
  {
    title: "Voice-Driven Calendar: Organize Your Life with Just Your Voice",
    description:
      "Our latest experiment turns natural speech into structured calendar events, recurring reminders, and smart scheduling suggestions powered by multimodal LLMs.",
    date: "Sep 23, 2024",
    author: "Bizzzup AI Labs",
    readTime: "4 min read",
    projectSlug: "voice-driven-calendar",
    fullContent: {
      intro:
        "We asked a simple question: what if managing your calendar was as easy as talking to a friend? No tapping through date pickers, no typing event titles, no manually resolving conflicts. Just speak naturally, and the system handles the rest — creating events, setting smart reminders, and coordinating across time zones.",
      sections: [
        {
          heading: "Natural Language Understanding",
          body: "The system parses conversational input into structured calendar actions. Say \"Move my 3pm with Sarah to Thursday and add a 15-minute prep block before it\" and it handles the reschedule, conflict check, and prep block creation in one pass. It understands relative dates, recurring patterns, and contextual references to existing events.",
        },
        {
          heading: "Smart Conflict Resolution",
          body: "When conflicts arise, the system doesn't just flag them — it suggests resolutions. It considers your typical meeting patterns, priority levels, and buffer preferences to propose optimal rescheduling options. You approve with a simple \"yes\" or refine with another voice command.",
        },
        {
          heading: "Multi-Timezone Coordination",
          body: "For distributed teams, the calendar agent automatically converts times, suggests windows that work across zones, and respects each participant's working hours. It even accounts for daylight saving transitions and regional holidays when proposing meeting times.",
        },
      ],
      takeaway:
        "Voice interfaces for productivity tools aren't just convenient — they fundamentally change how people interact with their schedules, reducing friction from minutes to seconds.",
    },
  },
];

/* ── Single card ── */

function BlogCard({
  post,
  prefersReduced,
  onOpen,
}: {
  post: BlogPost;
  prefersReduced: boolean | null;
  onOpen: (post: BlogPost) => void;
}) {
  const [hovered, setHovered] = useState(false);

  const handleClick = () => {
    onOpen(post);
  };

  return (
    <motion.article
      onClick={handleClick}
      variants={prefersReduced ? undefined : fadeUpBlurVariants}
      className="clip-corner-card group relative flex flex-col gap-4 p-7 sm:p-9 cursor-pointer bg-bg-card border border-border overflow-hidden transition-shadow duration-300"
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
      {/* Persistent gradient stripe at top */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[3px]"
        style={{
          background:
            "linear-gradient(to right, var(--color-accent-1), var(--color-accent-2))",
        }}
      />

      {/* Hover glow line (overlays the stripe) */}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[3px]"
        style={{
          background:
            "linear-gradient(to right, var(--color-accent-1), var(--color-accent-3))",
          transformOrigin: "left",
        }}
        animate={
          !prefersReduced
            ? { scaleX: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }
            : {}
        }
        transition={{ duration: 0.35, ease: "easeOut" }}
      />

      {/* Meta row with accent dot */}
      <div className="flex items-center gap-2.5 flex-wrap">
        <span className="w-1.5 h-1.5 rounded-full bg-accent-1 shrink-0" />
        <span className="font-mono text-[0.78rem] text-text-muted">
          {post.date}
        </span>
        <span className="h-1 w-1 rounded-full bg-text-muted shrink-0" />
        <span className="font-mono text-[0.78rem] text-accent-1">
          {post.readTime}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-display text-xl sm:text-2xl font-bold leading-tight text-text-primary">
        {post.title}
      </h3>

      {/* Description — 3-line clamp */}
      <p className="text-[1rem] leading-[1.7] text-text-secondary line-clamp-3 flex-1">
        {post.description}
      </p>

      {/* Read more */}
      <span className="font-mono text-[0.85rem] text-accent-1 inline-flex items-center gap-1.5 mt-auto">
        Read more
        <motion.span
          aria-hidden="true"
          className="inline-block"
          animate={{ x: hovered && !prefersReduced ? 6 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          &rarr;
        </motion.span>
      </span>
    </motion.article>
  );
}

/* ── Section ── */

export default function Blog() {
  const ref = useRef<HTMLElement>(null);
  const [isInView, replayKey] = useReplay(ref, { margin: "-80px" });
  const prefersReduced = useReducedMotion();
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  return (
    <section
      ref={ref}
      id="blog"
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
        <div className="mb-10 sm:mb-12 lg:mb-14 max-w-2xl">
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
              From the Lab
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            variants={prefersReduced ? undefined : fadeUpVariants}
            className="font-display font-[800] leading-[1.15] text-text-primary mb-5"
            style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)" }}
          >
            Thinking in{" "}
            <span className="gradient-text shimmer italic">public</span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            variants={prefersReduced ? undefined : fadeUpVariants}
            className="text-[1.1rem] leading-[1.75] text-text-secondary max-w-[540px]"
          >
            Deep dives into the systems we build, the decisions we make, and
            the lessons we learn along the way.
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
                    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
                  },
                }
          }
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6"
        >
          {posts.map((post) => (
            <BlogCard
              key={post.title}
              post={post}
              prefersReduced={prefersReduced}
              onOpen={setSelectedPost}
            />
          ))}
        </motion.div>
      </motion.div>

      <BlogDetailModal
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
      />
    </section>
  );
}
