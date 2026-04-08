"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import Image from "next/image";
import {
  containerVariants,
  fadeUpVariants,
  scaleLineVariants,
  EXPO_OUT,
} from "@/lib/animations";
import ProjectDetailModal, { type ProjectDetails } from "@/components/ui/ProjectDetailModal";

/* ── Project data ── */

const PROJECTS: ProjectDetails[] = [
  {
    name: "MERIDIAN",
    slug: "meridian",
    tagline: "Global E-Commerce Platform",
    image: "/projects/meridian.jpeg",
    imageLabel: "Storefront",
    image2: "/projects/meridian-2.jpeg",
    image2Label: "Admin Console",
    tags: ["NestJS", "Next.js", "PostgreSQL", "OpenSearch", "BullMQ", "Redis", "TypeScript", "Docker", "Turborepo", "Nginx"],
    category: "E-Commerce",
    liveUrl: "https://ecommerce-api-895210689446.europe-west2.run.app",
    fullDetails: {
      overview:
        "MERIDIAN is a global e-commerce affiliate and marketplace platform built for vendors to sell physical products or redirect buyers to external merchants. Launched in Saudi Arabia with a multi-country schema from day one — built as a monorepo with 8 workspace packages, 4 applications, 12 domain modules, and ~111 API endpoints.",
      highlights: [
        { label: "API Endpoints", value: "~111" },
        { label: "DB Entities", value: "30" },
        { label: "State Machines", value: "9" },
        { label: "Unit Tests", value: "~400" },
      ],
      techStack: [
        { layer: "Backend", tech: "NestJS 10, TypeORM, SQLite (dev) / PostgreSQL (prod)" },
        { layer: "Frontend", tech: "Next.js 14 — Storefront, Vendor Portal, Admin Panel" },
        { layer: "Search", tech: "OpenSearch 2.13 (derived read model, per-country index)" },
        { layer: "Queue", tech: "BullMQ + Redis 7 — 9 queues (search-index, email, order, etc.)" },
        { layer: "Storage", tech: "S3-compatible (MinIO for dev)" },
        { layer: "Auth", tech: "JWT + Refresh Tokens (Passport.js), bcrypt, 7 RBAC roles" },
        { layer: "Monorepo", tech: "pnpm workspaces + Turborepo" },
        { layer: "Infra", tech: "Docker, Nginx reverse proxy (4 upstreams)" },
      ],
      sections: [
        {
          heading: "Modular Backend Architecture",
          body: "Single NestJS application with 12 bounded-context modules communicating via domain events (EventEmitter2). Port/Adapter pattern isolates payment and shipping integrations — designed for Stripe/HyperPay and Aramex/DHL without coupling business logic to vendor APIs. Idempotency keys prevent duplicate orders, payments, and refunds.",
        },
        {
          heading: "Three-App Frontend + Shared UI Kit",
          body: "Customer storefront (15 routes), vendor portal (17 routes), and admin panel (16 routes) — all sharing a 25+ component UI kit with SWR data fetching, 5 hooks, and 3 providers. Each app has its own design system: the storefront uses Cormorant Garamond and gold accents; the vendor portal uses dark sidebar with indigo accents.",
        },
        {
          heading: "Commerce & Inventory Logic",
          body: "9 explicit state machines control every status transition — products, offers, orders, payments, shipments, reviews, and eligibility. Stock is reserved on order creation and released on cancellation. Cart items are re-validated at checkout. Prices are snapshotted at order time. Reviews are gated to verified purchases within a 90-day window.",
        },
      ],
    },
  },
  {
    name: "Doctor AI",
    slug: "doctor-ai",
    tagline: "AI Healthcare Platform",
    image: "/projects/doctor-ai.jpeg",
    imageLabel: "Mobile App",
    image2: "/projects/doctor-ai-2.jpeg",
    image2Label: "Call Automation",
    tags: ["VAPI", "Deepgram", "CrewAI", "Google Gemini", "MongoDB", "Socket.IO", "Microsoft Graph", "Twilio", "React", "Flask"],
    category: "Healthcare",
    fullDetails: {
      overview:
        "Doctor AI is a comprehensive healthcare platform that bridges patients and providers through AI-powered voice consultations, intelligent appointment scheduling, automated prescription management, and real-time messaging. It serves as an end-to-end digital healthcare ecosystem combining traditional practice management with cutting-edge AI.",
      highlights: [
        { label: "Feature Modules", value: "10" },
        { label: "AI Voice", value: "VAPI" },
        { label: "Auth Roles", value: "2" },
        { label: "Deployment", value: "Docker" },
      ],
      techStack: [
        { layer: "Voice AI", tech: "VAPI (voice calling + routing), Deepgram (real-time STT)" },
        { layer: "AI / LLM", tech: "Google Generative AI, CrewAI multi-agent workflows" },
        { layer: "Frontend", tech: "React + Material UI, responsive, role-based UI" },
        { layer: "Backend", tech: "Microservices with API Gateway, Socket.IO for real-time" },
        { layer: "Database", tech: "MongoDB (primary) + optional Firestore, GridFS for docs" },
        { layer: "Auth", tech: "Microsoft OAuth 2.0 (patient + doctor roles), JWT sessions" },
        { layer: "Comms", tech: "Twilio (SMS/voice), Microsoft Graph (Outlook calendar sync)" },
        { layer: "Infra", tech: "Docker containerization, horizontally scalable" },
      ],
      sections: [
        {
          heading: "AI Voice Consultations",
          body: "VAPI-integrated voice calling routes patients to available doctors using AI-driven logic. Deepgram provides live transcription during calls. Automated follow-up scheduling and natural language commands for booking make the experience feel conversational rather than clinical.",
        },
        {
          heading: "Scheduling & Prescriptions",
          body: "Real-time availability engine checks doctor schedules across time zones, syncing with Microsoft Outlook via Graph API. Appointment booking, rescheduling, and cancellation trigger background calendar sync. Digital prescriptions flow through a multi-step lifecycle — request, doctor review, approval, PDF generation, and SMS/email delivery.",
        },
        {
          heading: "Multi-Agent & Document Workflows",
          body: "CrewAI orchestrates multi-agent workflows for complex medical tasks — data extraction from conversations, patient record organization, and intelligent task routing. GridFS handles secure document storage with version control. Real-time messaging via Socket.IO connects doctors and patients directly in-app.",
        },
      ],
    },
  },
  {
    name: "Saloon",
    slug: "saloon",
    tagline: "Salon Management System",
    image: "/projects/saloon.jpeg",
    imageLabel: "Staff Dashboard",
    image2: "/projects/saloon-2.jpeg",
    image2Label: "Growth Analytics",
    tags: ["React 18", "Vite", "Ant Design", "Zustand", "Flask", "MongoDB Atlas", "Redis", "Google Cloud Run", "Docker"],
    category: "SaaS",
    liveUrl: "https://saloon-management-system-895210689446.europe-west2.run.app",
    fullDetails: {
      overview:
        "Saloon is a production multi-branch salon and spa management system — POS billing, inventory, CRM, staff management, appointment scheduling, and business analytics in one app. Live on Google Cloud Run with 7 branches, 600+ customers, and 1,000+ transaction records.",
      highlights: [
        { label: "Branches", value: "7" },
        { label: "Customers", value: "600+" },
        { label: "DB Collections", value: "30+" },
        { label: "Version", value: "v20" },
      ],
      techStack: [
        { layer: "Frontend", tech: "React 18 + Vite, Ant Design 6, Zustand, TanStack Query" },
        { layer: "Charts", tech: "Recharts, React Hook Form, Framer Motion, Day.js" },
        { layer: "Backend", tech: "Flask 3, MongoEngine ODM, PyJWT + bcrypt auth" },
        { layer: "Database", tech: "MongoDB Atlas (cloud), 30+ collections" },
        { layer: "Cache", tech: "Redis 5 (optional, in-memory fallback)" },
        { layer: "PDF", tech: "ReportLab — GST invoice generation" },
        { layer: "Deploy", tech: "Google Cloud Run (europe-west2), Docker multi-stage build" },
        { layer: "Auth", tech: "JWT — Owner, Manager, Staff roles with branch isolation" },
      ],
      sections: [
        {
          heading: "Point of Sale & Inventory",
          body: "Multi-item billing supports services, packages, products, memberships, and prepaid balances in a single checkout. Stock validates in real time — products disable when out of stock, low-stock alerts fire at ≤5 units, and quantities reduce automatically on sale. Discount requests require manager approval via a coded approval workflow. PDF invoices include GST breakdown.",
        },
        {
          heading: "Staff & Customer Management",
          body: "Staff profiles track attendance (check-in/out), leave requests, temporary cross-branch assignments, and commission earnings per sale. Customer records accumulate visit history, total spend, and loyalty data. Leads and missed enquiries feed into a follow-up pipeline. Service recovery tracks complaints through resolution.",
        },
        {
          heading: "Analytics & Reporting",
          body: "Dashboard surfacing KPI cards, revenue trends, service sales analysis, staff performance leaderboards, customer lifecycle segmentation, and client value metrics. All reports support custom date ranges and can be filtered per branch. Expense tracking categorizes operational costs alongside revenue for profit analysis.",
        },
      ],
    },
  },
  {
    name: "Lawyer AI",
    slug: "lawyer-ai",
    tagline: "Legal Document Intelligence",
    image: "/projects/lawyer-ai.png",
    imageLabel: "OCR & Translation",
    image2: "/projects/lawyer-ai-2.png",
    image2Label: "Welcome Portal",
    tags: ["React 19", "Vite", "Flask", "CrewAI", "LangChain", "Google Gemini", "Perplexity", "Mistral", "SQLite", "Google OAuth"],
    category: "Legal Tech",
    liveUrl: "https://legal-assistant-frontend-895210689446.us-central1.run.app",
    fullDetails: {
      overview:
        "Lawyer AI is an AI-powered legal platform for document analysis, research, and case discovery. Multi-agent CrewAI workflows handle specialized tasks — document comparison, content extraction, OCR/translation, and case law search — backed by Gemini, Perplexity, and Mistral as LLM providers.",
      highlights: [
        { label: "AI Crews", value: "4+" },
        { label: "LLM Providers", value: "3" },
        { label: "Input Types", value: "PDF + Image" },
        { label: "Case Database", value: "Indian Kanoon" },
      ],
      techStack: [
        { layer: "Frontend", tech: "React 19, Vite, MUI + React Bootstrap, Axios" },
        { layer: "Backend", tech: "Python 3.10+, Flask, Flask-Session, Flask-Limiter" },
        { layer: "AI Agents", tech: "CrewAI (4 crews: compare, list, suggestion, PDF)" },
        { layer: "LLMs", tech: "Google Gemini (primary), Perplexity (research), Mistral (OCR)" },
        { layer: "Orchestration", tech: "LangChain — agent coordination and chain management" },
        { layer: "Database", tech: "SQLAlchemy — SQLite (dev) / PostgreSQL (prod)" },
        { layer: "Auth", tech: "Google OAuth, JWT, Flask sessions" },
        { layer: "Case Law", tech: "Indian Kanoon API integration" },
      ],
      sections: [
        {
          heading: "Document Analysis & Chat",
          body: "Users upload legal documents and interact via chat to extract clauses, summaries, risks, and obligations. OCR handles scanned PDFs and images via Mistral. The comparison module diffs two documents side-by-side, highlighting additions, deletions, and structural changes. Translation supports multilingual legal text.",
        },
        {
          heading: "Multi-Agent CrewAI Workflows",
          body: "Four specialized CrewAI crews handle distinct tasks: document comparison, content listing, suggestion generation, and PDF analysis. Each crew runs as an autonomous multi-agent system with Gemini as the backbone LLM and Perplexity providing real-time research depth for case law and legal precedent.",
        },
        {
          heading: "Case Law Discovery",
          body: "Indian Kanoon API integration lets lawyers search relevant case law by topic or citation directly within the platform. Perplexity deepens research by surfacing additional context and analysis. Results are presented alongside the active document for side-by-side legal research without switching tools.",
        },
      ],
    },
  },
  {
    name: "Caption CC",
    slug: "caption-cc",
    tagline: "Code-Switching Subtitle Generator",
    image: "/projects/caption-cc.png",
    imageLabel: "Speech-to-Text",
    image2: "/projects/caption-cc-2.png",
    image2Label: "Subtitle Editor",
    tags: ["React 18", "TypeScript", "Vite", "Node.js", "Express", "MongoDB", "Groq Whisper", "Google Gemini", "ElevenLabs", "FFmpeg", "yt-dlp"],
    category: "AI / Media",
    fullDetails: {
      overview:
        "Caption CC generates accurate English subtitles from Tamil-English code-switched video, with optional AI dubbing. A 5-stage caption pipeline and 7-stage dubbing pipeline handle everything from download to export — supporting YouTube URLs and direct file uploads up to 500 MB.",
      highlights: [
        { label: "Caption Stages", value: "5" },
        { label: "Dubbing Stages", value: "7" },
        { label: "Max Duration", value: "10 min" },
        { label: "Export Formats", value: "SRT, VTT, MP4" },
      ],
      techStack: [
        { layer: "Frontend", tech: "React 18, TypeScript, Vite, Tailwind CSS" },
        { layer: "Backend", tech: "Node.js 18+, Express, TypeScript" },
        { layer: "Database", tech: "MongoDB — jobs, segments, usage, user_access" },
        { layer: "STT", tech: "Groq Whisper (whisper-large-v3-turbo), ElevenLabs Scribe" },
        { layer: "LLM", tech: "Google Gemini 2.5 Flash — correction + translation" },
        { layer: "TTS / Dub", tech: "ElevenLabs eleven_multilingual_v2" },
        { layer: "Media", tech: "FFmpeg (audio extraction, video merge), yt-dlp (YouTube)" },
        { layer: "Auth", tech: "Google OAuth 2.0 via Passport.js" },
      ],
      sections: [
        {
          heading: "Caption Pipeline",
          body: "Five-stage pipeline: download or upload → FFmpeg extracts WAV (16kHz mono) → Groq Whisper transcribes → Gemini corrects code-switching and translates to English → subtitle generation as SRT, VTT, or burned-in MP4. Subtitle segments are editable in-app before export. Real-time progress via Server-Sent Events.",
        },
        {
          heading: "AI Dubbing Pipeline",
          body: "Seven-stage dubbing flow adds TTS and audio assembly on top of captioning: after translation, ElevenLabs synthesizes each segment, FFmpeg assembles the full audio track, and the dubbed audio is merged back into the video. The final dubbed MP4 is available for one-click download. Timing is best-effort matched to original segment boundaries.",
        },
        {
          heading: "Architecture & Limits",
          body: "Full-stack TypeScript monorepo with npm workspaces (client + server). MongoDB tracks job state, subtitle segments, and usage per user. LLM temperature set to 0.3 with 3 retries and backoff. Supports MP4, MP3, WAV, M4A, MOV, WEBM. Max file size 500 MB, max duration 10 minutes.",
        },
      ],
    },
  },
  {
    name: "DesignT",
    slug: "designt",
    tagline: "AI T-Shirt Design Studio",
    image: "/projects/designt.png",
    imageLabel: "Design Studio",
    image2: "/projects/designt-2.png",
    image2Label: "Product Landing",
    tags: ["Next.js 15", "App Router", "Tailwind CSS", "Zustand", "TypeScript", "Gemini Vision", "Supabase", "Cloudinary", "Razorpay", "Vercel"],
    category: "AI / E-Commerce",
    liveUrl: "https://www.designt.in",
    fullDetails: {
      overview:
        "DesignT is a conversational AI t-shirt design studio powered by Google Gemini Pro Vision. Users describe their idea in natural language, optionally upload reference images, and get instant t-shirt mockups rendered in real time. Designs flow into a complete 4-step e-commerce checkout with Razorpay payment.",
      highlights: [
        { label: "AI Engine", value: "Gemini" },
        { label: "T-Shirt Colors", value: "5" },
        { label: "Size Range", value: "XS–3XL" },
        { label: "Checkout Steps", value: "4" },
      ],
      techStack: [
        { layer: "Frontend", tech: "Next.js 15 App Router, Tailwind CSS, TypeScript" },
        { layer: "State", tech: "Zustand with localStorage persistence" },
        { layer: "AI", tech: "Google Gemini Pro Vision — natural language + image input" },
        { layer: "Database", tech: "Supabase (PostgreSQL) — orders, users, design history" },
        { layer: "Media", tech: "Cloudinary — design image storage with optimization" },
        { layer: "Payments", tech: "Razorpay — prepaid (discounted) or Cash on Delivery" },
        { layer: "Hosting", tech: "Vercel with edge functions" },
        { layer: "Tooling", tech: "ESLint + Prettier, conventional commits, CI/CD via Vercel" },
      ],
      sections: [
        {
          heading: "Conversational Design Engine",
          body: "Users describe their design in plain English and Gemini Pro Vision generates it instantly. Up to 3 reference images can be uploaded per conversation for style transfer and visual grounding. Full design history persists across sessions via Zustand + localStorage, and designs can be refined iteratively through natural dialogue — no design tools required.",
        },
        {
          heading: "Product Customization & Preview",
          body: "Five curated t-shirt colors with live preview that updates instantly across all variants. Complete size range from XS to 3XL with detailed fit guides. Precision positioning controls let users adjust design placement and scale on the mockup before committing. Changes render live without page reloads.",
        },
        {
          heading: "E-Commerce Checkout",
          body: "Streamlined 4-step flow: Design → Customize → Details → Payment. Razorpay handles secure payment processing with multiple payment methods. Prepaid orders receive an automatic discount; COD is available for convenience. Orders are tracked in Supabase with status updates. Cloudinary stores and optimizes all design assets.",
        },
      ],
    },
  },
];

/* ── Staggered content variants for active card ── */

const contentStagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.15 },
  },
};

const contentFadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EXPO_OUT },
  },
};

const pillStagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04, delayChildren: 0.35 },
  },
};

const pillFade: Variants = {
  hidden: { opacity: 0, x: -6 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: EXPO_OUT },
  },
};

/* ── Card interior with staggered animations ── */

function CardContent({
  project,
  priority,
  isActive,
  prefersReduced,
  onViewDetails,
}: {
  project: ProjectDetails;
  priority?: boolean;
  isActive: boolean;
  prefersReduced: boolean | null;
  onViewDetails: () => void;
}) {
  return (
    <>
      {/* Primary screenshot with subtle zoom pulse */}
      <div className="relative h-[200px] sm:h-[280px] lg:h-[320px] overflow-hidden bg-bg-surface">
        <motion.div
          className="absolute inset-0"
          animate={{
            scale: prefersReduced ? 1 : isActive ? 1.02 : 1.08,
          }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 30,
            duration: 0.8,
          }}
        >
          <Image
            src={project.image}
            alt={`${project.name} — ${project.imageLabel}`}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 90vw, 65vw"
            priority={priority}
          />
        </motion.div>

        {/* Floating image label */}
        <motion.div
          className="absolute bottom-2.5 left-3"
          initial={false}
          animate={{
            opacity: isActive ? 1 : 0,
            y: isActive ? 0 : 8,
          }}
          transition={{ duration: 0.4, ease: EXPO_OUT }}
        >
          <span className="inline-block px-2 py-0.5 rounded-md bg-bg-card/85 backdrop-blur-sm border border-border text-[0.65rem] font-mono font-medium uppercase tracking-[0.1em] text-text-muted">
            {project.imageLabel}
          </span>
        </motion.div>

        {/* Subtle gradient overlay on active card */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to top, var(--color-bg-card) 0%, transparent 40%)",
          }}
          animate={{ opacity: isActive ? 0.6 : 0 }}
          transition={{ duration: 0.5, ease: EXPO_OUT }}
        />
      </div>

      {/* Info panel with staggered content reveals */}
      <div className="flex-1 min-h-0 flex flex-col justify-between px-5 pt-4 pb-5 bg-bg-card overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={isActive ? `${project.slug}-active` : `${project.slug}-inactive`}
            variants={prefersReduced ? undefined : contentStagger}
            initial={prefersReduced ? undefined : "hidden"}
            animate={prefersReduced ? undefined : "visible"}
          >
            {/* Category label */}
            <motion.span
              variants={prefersReduced ? undefined : contentFadeUp}
              className="block font-mono text-[0.7rem] uppercase tracking-[0.14em] text-accent-1 font-medium mb-2"
            >
              {project.category}
            </motion.span>

            {/* Title */}
            <motion.h3
              variants={prefersReduced ? undefined : contentFadeUp}
              className="font-display font-[800] text-text-primary leading-[1.1] mb-1"
              style={{ fontSize: "clamp(1.35rem, 2vw, 1.7rem)" }}
            >
              {project.name}
            </motion.h3>

            {/* Tagline */}
            <motion.p
              variants={prefersReduced ? undefined : contentFadeUp}
              className="text-accent-2 text-[0.9rem] leading-snug font-medium"
            >
              {project.tagline}
            </motion.p>

            {/* Overview */}
            <motion.p
              variants={prefersReduced ? undefined : contentFadeUp}
              className="mt-2 text-[0.83rem] leading-relaxed text-text-secondary line-clamp-2"
            >
              {project.fullDetails.overview}
            </motion.p>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between gap-2 mt-3">
          {/* Tech pills with stagger */}
          <motion.div
            className="flex flex-wrap gap-1 min-w-0"
            variants={prefersReduced ? undefined : pillStagger}
            initial={prefersReduced ? undefined : "hidden"}
            animate={prefersReduced ? undefined : "visible"}
            key={`pills-${project.slug}-${isActive}`}
          >
            {project.tags.slice(0, 4).map((tag) => (
              <motion.span
                key={tag}
                variants={prefersReduced ? undefined : pillFade}
                className="px-2 py-0.5 rounded-full text-[0.63rem] font-mono font-medium tracking-wide bg-bg-surface text-text-muted border border-border"
              >
                {tag}
              </motion.span>
            ))}
            {project.tags.length > 4 && (
              <motion.span
                variants={prefersReduced ? undefined : pillFade}
                className="px-2 py-0.5 rounded-full text-[0.55rem] font-mono font-medium tracking-wide bg-bg-surface text-text-muted border border-border"
              >
                +{project.tags.length - 4}
              </motion.span>
            )}
          </motion.div>

          {/* CTA button with entrance */}
          <AnimatePresence>
            {isActive && (
              <motion.button
                initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.85, x: 10 }}
                animate={prefersReduced ? { opacity: 1 } : { opacity: 1, scale: 1, x: 0 }}
                exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.85, x: 10 }}
                transition={{ duration: 0.4, ease: EXPO_OUT, delay: 0.3 }}
                onClick={(e) => { e.stopPropagation(); onViewDetails(); }}
                className="shrink-0 font-mono text-[0.7rem] uppercase tracking-[0.1em] text-accent-1 border border-accent-1/30 rounded-full px-4 py-1.5 hover:bg-accent-1/10 hover:border-accent-1/60 transition-colors duration-200 whitespace-nowrap"
              >
                View Details
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

/* ── Auto-advance config ── */

const AUTO_ADVANCE_MS = 2000;

/* ── Slide transition spring config ── */

const SLIDE_SPRING = {
  type: "tween" as const,
  duration: 0.6,
  ease: [0.25, 0.1, 0.25, 1] as const,
};

/* ── Main section ── */

export default function Projects() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedProject, setSelectedProject] = useState<ProjectDetails | null>(null);

  const viewportRef = useRef<HTMLDivElement>(null);
  const [containerW, setContainerW] = useState(0);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    setContainerW(el.offsetWidth);
    const ro = new ResizeObserver(() => setContainerW(el.offsetWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* Responsive card sizing */
  const isMobile = containerW < 500;
  const isTablet = containerW >= 500 && containerW < 900;

  const activeRatio = isMobile ? 0.88 : isTablet ? 0.62 : 0.56;
  const peekRatio = isMobile ? 0.15 : isTablet ? 0.17 : 0.19;

  const activeW = containerW * activeRatio;
  const peekW = containerW * peekRatio;
  const gap = isMobile ? 10 : 16;

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.3 });
  const carouselInView = useInView(carouselRef, { once: true, amount: 0.2 });
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const headerY = useTransform(
    scrollYProgress, [0, 1],
    prefersReduced ? [0, 0] : [20, -12]
  );

  const navigate = useCallback((dir: number) => {
    setActiveIndex((i) => {
      const next = i + dir;
      return Math.max(0, Math.min(PROJECTS.length - 1, next));
    });
  }, []);

  const prev = useCallback(() => navigate(-1), [navigate]);
  const next = useCallback(() => navigate(1), [navigate]);

  /* Keyboard navigation */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next]);

  /* Touch/swipe support */
  const touchStart = useRef<number | null>(null);
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  }, []);
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
    touchStart.current = null;
  }, [next, prev]);

  /* ── Auto-advance (right-to-left, pause on hover) ── */
  const [isPaused, setIsPaused] = useState(false);

  const autoAdvance = useCallback(() => {
    setActiveIndex((i) => (i + 1) % PROJECTS.length);
  }, []);

  useEffect(() => {
    if (prefersReduced || isPaused) return;
    const timer = setTimeout(autoAdvance, AUTO_ADVANCE_MS);
    return () => clearTimeout(timer);
  }, [activeIndex, isPaused, prefersReduced, autoAdvance]);

  /* Pause/resume handlers for the carousel viewport */
  const handleMouseEnter = useCallback(() => setIsPaused(true), []);
  const handleMouseLeave = useCallback(() => setIsPaused(false), []);

  const sectionReveal: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EXPO_OUT } },
  };
  const reducedFade: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };

  /* Circular offset: wraps so project 1 is always +1 after project 6 */
  function circularOffset(index: number) {
    const n = PROJECTS.length;
    let off = index - activeIndex;
    if (off > n / 2) off -= n;
    if (off < -n / 2) off += n;
    return off;
  }

  /* Compute position for each card in the layered layout */
  function getCardTransform(index: number) {
    const offset = circularOffset(index);

    if (offset === 0) {
      return {
        x: (containerW - activeW) / 2,
        scale: 1,
        opacity: 1,
        zIndex: 3,
        rotateY: 0,
        filter: "blur(0px)",
      };
    }

    if (offset === -1) {
      return {
        x: isMobile ? -peekW * 0.3 : (containerW - activeW) / 2 - peekW - gap,
        scale: isMobile ? 0.82 : 0.88,
        opacity: isMobile ? 0.35 : 0.5,
        zIndex: 2,
        rotateY: isMobile ? 0 : 3,
        filter: isMobile ? "blur(1px)" : "blur(1.5px)",
      };
    }

    if (offset === 1) {
      return {
        x: isMobile
          ? containerW - peekW * 0.7
          : (containerW - activeW) / 2 + activeW + gap,
        scale: isMobile ? 0.82 : 0.88,
        opacity: isMobile ? 0.35 : 0.5,
        zIndex: 2,
        rotateY: isMobile ? 0 : -3,
        filter: isMobile ? "blur(1px)" : "blur(1.5px)",
      };
    }

    // Far offscreen cards — always exit/enter from the correct side
    return {
      x: offset < 0 ? -activeW * 1.2 : containerW + activeW * 0.2,
      scale: 0.75,
      opacity: 0,
      zIndex: 1,
      rotateY: 0,
      filter: "blur(3px)",
    };
  }

  return (
    <>
      <section
        ref={sectionRef}
        id="projects"
        className="relative bg-bg-surface overflow-hidden"
        style={{ padding: "clamp(2.5rem, 4vw, 3.5rem) 0" }}
      >
        {/* Background mesh */}
        {!prefersReduced && (
          <div
            className="absolute inset-0 pointer-events-none opacity-50"
            style={{ background: "var(--gradient-mesh)" }}
          />
        )}

        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10">

          {/* ── Section header ── */}
          <motion.div
            ref={headerRef}
            style={{ y: headerY }}
            initial="hidden"
            animate={headerInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="mb-12 max-w-2xl"
          >
            <motion.div variants={fadeUpVariants} className="flex items-center gap-3 mb-5">
              <motion.span variants={scaleLineVariants} className="block h-px w-[30px] bg-accent-1" />
              <span className="font-mono text-[0.75rem] font-medium uppercase tracking-[0.14em] text-accent-1">
                Product Portfolio
              </span>
            </motion.div>

            <motion.h2
              variants={fadeUpVariants}
              className="font-display font-[800] leading-[1.15] text-text-primary mb-4"
              style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}
            >
              Products we&apos;ve{" "}
              <span className="gradient-text italic">built</span>
            </motion.h2>

            <motion.p
              variants={fadeUpVariants}
              className="text-base lg:text-lg leading-relaxed text-text-secondary"
            >
              From multi-agent systems to production-grade platforms, we build AI products that actually run businesses.
            </motion.p>
          </motion.div>

          {/* ── Layered Slider ── */}
          <motion.div
            ref={carouselRef}
            initial="hidden"
            animate={carouselInView ? "visible" : "hidden"}
            variants={prefersReduced ? reducedFade : sectionReveal}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="relative">

              {/* Viewport */}
              <div
                ref={viewportRef}
                className="overflow-hidden"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                style={{ perspective: "1200px" }}
              >
                <div
                  className={`relative h-[420px] sm:h-[530px] lg:h-[590px] transition-opacity duration-150 ${
                    containerW === 0 ? "opacity-0" : "opacity-100"
                  }`}
                >
                  {PROJECTS.map((project, i) => {
                    const transform = getCardTransform(i);
                    const isActive = i === activeIndex;
                    return (
                      <motion.article
                        key={project.slug}
                        className={`absolute top-0 bottom-0 flex flex-col rounded-2xl overflow-hidden border bg-bg-card ${
                          isActive
                            ? "border-border-hover shadow-xl cursor-pointer"
                            : "border-border shadow-none"
                        }`}
                        style={{
                          width: isActive ? activeW : peekW > activeW * 0.5 ? activeW * 0.85 : activeW,
                          transformStyle: "preserve-3d",
                        }}
                        animate={
                          prefersReduced
                            ? {
                                x: transform.x,
                                opacity: transform.opacity,
                                zIndex: transform.zIndex,
                              }
                            : {
                                x: transform.x,
                                scale: transform.scale,
                                opacity: transform.opacity,
                                zIndex: transform.zIndex,
                                rotateY: transform.rotateY,
                                filter: transform.filter,
                              }
                        }
                        transition={
                          prefersReduced
                            ? { duration: 0 }
                            : SLIDE_SPRING
                        }
                        whileHover={
                          isActive && !prefersReduced
                            ? {
                                y: -6,
                                boxShadow: "0 24px 60px var(--color-accent-glow)",
                              }
                            : {}
                        }
                        aria-hidden={!isActive}
                        onClick={
                          isActive
                            ? () => setSelectedProject(project)
                            : circularOffset(i) === -1
                              ? prev
                              : circularOffset(i) === 1
                                ? next
                                : undefined
                        }
                        tabIndex={isActive ? 0 : -1}
                      >
                        <CardContent
                          project={project}
                          priority={i === 0}
                          isActive={isActive}
                          prefersReduced={prefersReduced}
                          onViewDetails={() => setSelectedProject(project)}
                        />
                      </motion.article>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* ── Dot indicators ── */}
            <div
              className="flex items-center justify-center gap-2 mt-8"
              role="group"
              aria-label="Choose project"
            >
              {PROJECTS.map((project, i) => (
                <motion.button
                  key={project.slug}
                  type="button"
                  layout={!prefersReduced}
                  onClick={() => setActiveIndex(i)}
                  aria-current={i === activeIndex ? "true" : undefined}
                  aria-label={`Go to ${project.name}`}
                  transition={{ duration: 0.3, ease: EXPO_OUT }}
                  className={`rounded-full h-2 transition-colors duration-300 ${
                    i === activeIndex
                      ? "w-7 bg-accent-1"
                      : "w-2 bg-border-hover hover:bg-text-muted"
                  }`}
                />
              ))}
            </div>

          </motion.div>
        </div>
      </section>

      {/* ── Project detail modal ── */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
}
