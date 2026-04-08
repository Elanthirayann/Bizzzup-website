"use client";

import type { ReactNode } from "react";
import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useIsMobile } from "@/hooks/useIsMobile";
import { QUICK_REPLIES } from "@/data/chatContext";
import { EXPO_OUT } from "@/lib/animations";

/* ─── types ─── */
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

/* ═══════════════════════════════════════════════════
   ANIMATION VARIANTS
   ═══════════════════════════════════════════════════ */

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const panelVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: EXPO_OUT,
      staggerChildren: 0.05,
      delayChildren: 0.08,
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.97,
    filter: "blur(4px)",
    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] as const },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: -6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EXPO_OUT },
  },
};

const contentVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, delay: 0.1 } },
};

const inputVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EXPO_OUT, delay: 0.12 },
  },
};

const messageFadeUp = {
  hidden: { opacity: 0, y: 14, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, ease: EXPO_OUT },
  },
};

const welcomeVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      delay: 0.2,
      staggerChildren: 0.06,
      delayChildren: 0.25,
    },
  },
};

const welcomeChildVariant = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EXPO_OUT },
  },
};

const chipContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.45 } },
};

const chipVariant = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: EXPO_OUT },
  },
};

const bubbleVariants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 20,
      delay: 0.8,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.6,
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const },
  },
};

/* ═══════════════════════════════════════
   LIGHTWEIGHT MARKDOWN RENDERER
   ═══════════════════════════════════════ */

function renderMarkdown(text: string) {
  const lines = text.split("\n");
  const elements: ReactNode[] = [];
  let listItems: string[] = [];
  let listKey = 0;

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${listKey++}`} className="pl-4 my-1.5 space-y-1">
          {listItems.map((item, i) => (
            <li key={i} className="list-disc text-text-secondary text-[13px]">
              <span dangerouslySetInnerHTML={{ __html: inlineFormat(item) }} />
            </li>
          ))}
        </ul>,
      );
      listItems = [];
    }
  };

  const inlineFormat = (str: string) =>
    str
      .replace(
        /`([^`]+)`/g,
        '<code class="font-mono text-[0.85em] bg-bg-surface px-1 py-0.5 rounded">$1</code>',
      )
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-text-primary font-medium">$1</strong>')
      .replace(/\*([^*]+)\*/g, "<em>$1</em>");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const bulletMatch = line.match(/^[-•*]\s+(.+)/);

    if (bulletMatch) {
      listItems.push(bulletMatch[1]);
    } else {
      flushList();
      if (line.trim() === "") {
        elements.push(<br key={`br-${i}`} />);
      } else {
        elements.push(
          <p
            key={`p-${i}`}
            className="my-0.5"
            dangerouslySetInnerHTML={{ __html: inlineFormat(line) }}
          />,
        );
      }
    }
  }
  flushList();
  return <>{elements}</>;
}

/* ═══════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════ */

/* ─── typing indicator ─── */
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-3 py-2.5">
      <span className="font-mono text-[10px] text-text-muted uppercase tracking-wider mr-1">
        Processing
      </span>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="block w-1.5 h-1.5 rounded-full bg-accent-1 opacity-60"
          style={{
            animation: "typing-dot 1.4s ease-in-out infinite",
            animationDelay: `${i * 0.18}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ─── system node icon (for header + avatar) ─── */
function SystemNodeIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="text-accent-1">
      {/* central node */}
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      {/* orbital connections */}
      <circle cx="12" cy="4" r="1.5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="4" cy="16" r="1.5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="20" cy="16" r="1.5" stroke="currentColor" strokeWidth="1.2" />
      {/* connection lines */}
      <line x1="12" y1="9" x2="12" y2="5.5" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="9.5" y1="13.5" x2="5.5" y2="15" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="14.5" y1="13.5" x2="18.5" y2="15" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

/* ─── system avatar with pulse ─── */
function SystemAvatar({ size = "md" }: { size?: "sm" | "md" }) {
  const dim = size === "sm" ? "w-7 h-7" : "w-9 h-9";
  const iconSize = size === "sm" ? 14 : 18;
  return (
    <div className={`${dim} rounded-lg flex items-center justify-center relative flex-shrink-0 bg-accent-glow`}
    >
      {/* subtle pulse ring */}
      <div
        className="absolute inset-0 rounded-lg bg-accent-1 opacity-[0.08]"
        style={{
          animation: "pulse-ring 3s ease-out infinite",
        }}
      />
      <SystemNodeIcon size={iconSize} />
    </div>
  );
}

/* ─── SVG icons ─── */
function BubbleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      {/* central node */}
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
      {/* orbital dots */}
      <circle cx="12" cy="5" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="5.5" cy="16" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="18.5" cy="16" r="1.5" fill="currentColor" stroke="none" />
      {/* connection lines */}
      <line x1="12" y1="8.5" x2="12" y2="6.5" opacity="0.6" />
      <line x1="9" y1="14" x2="7" y2="15" opacity="0.6" />
      <line x1="15" y1="14" x2="17" y2="15" opacity="0.6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  );
}

/* ═══════════════════════════════════════
   MAIN CHATBOT COMPONENT
   ═══════════════════════════════════════ */

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const prefersReduced = useReducedMotion();
  const isMobile = useIsMobile();

  const noMotion = prefersReduced ?? false;

  /* ─── auto-scroll ─── */
  const scrollToBottom = useCallback(() => {
    const list = messageListRef.current;
    if (!list) return;
    const isNearBottom =
      list.scrollHeight - list.scrollTop - list.clientHeight < 100;
    if (isNearBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 450);
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen]);

  /* ─── send message + stream response ─── */
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      const userMsg: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: content.trim(),
        timestamp: Date.now(),
      };

      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);
      setInput("");
      setIsLoading(true);

      const assistantId = `assistant-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "", timestamp: Date.now() },
      ]);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: updatedMessages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(
            (errData as { error?: string }).error || "Failed to get response",
          );
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No response stream");

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data: ")) continue;

            const data = trimmed.slice(6);
            if (data === "[DONE]") break;

            try {
              const parsed = JSON.parse(data) as {
                text?: string;
                error?: string;
              };
              if (parsed.error) throw new Error(parsed.error);
              if (parsed.text) {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId
                      ? { ...m, content: m.content + parsed.text }
                      : m,
                  ),
                );
              }
            } catch {
              /* skip malformed chunks */
            }
          }
        }
      } catch (err) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content:
                    err instanceof Error
                      ? `Something went wrong: ${err.message}`
                      : "System error. Please try again.",
                }
              : m,
          ),
        );
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading],
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div data-no-click-spark className="contents">
      {/* ═══════════════════════════════════
          FLOATING BUBBLE — system node
          ═══════════════════════════════════ */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="chat-bubble"
            variants={noMotion ? undefined : bubbleVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => setIsOpen(true)}
            className="fixed z-[1050] flex h-14 w-14 min-h-14 min-w-14 items-center justify-center rounded-2xl cursor-pointer bg-accent-1 chat-bubble-shadow bottom-[max(1.5rem,env(safe-area-inset-bottom,0px))] right-[max(1.5rem,env(safe-area-inset-right,0px))]"
            whileHover={noMotion ? {} : { scale: 1.08, y: -2 }}
            whileTap={noMotion ? {} : { scale: 0.94 }}
            aria-label="Open AI system assistant"
          >
            {/* pulse ring */}
            <span
              className="absolute -inset-1 rounded-2xl bg-accent-1 opacity-20"
              style={{
                animation: noMotion ? "none" : "pulse-ring 3s ease-out infinite",
              }}
            />
            <span className="relative z-10 text-white">
              <BubbleIcon />
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════
          BACKGROUND DIM — system presence
          ═══════════════════════════════════ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-overlay"
            variants={noMotion ? undefined : overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[1049] bg-text-primary/[0.12]"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════
          CHAT PANEL — system interface
          ═══════════════════════════════════ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-panel"
            variants={noMotion ? undefined : panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`fixed z-[1050] ${
              isMobile
                ? "left-[max(0.75rem,env(safe-area-inset-left,0px))] right-[max(0.75rem,env(safe-area-inset-right,0px))] top-[max(0.75rem,env(safe-area-inset-top,0px))] bottom-[max(0.75rem,env(safe-area-inset-bottom,0px))]"
                : "bottom-[max(1.5rem,env(safe-area-inset-bottom,0px))] right-[max(1.5rem,env(safe-area-inset-right,0px))] h-[580px] w-[420px]"
            }`}
          >
            <div
              className="flex flex-col h-full rounded-2xl overflow-hidden bg-bg-card border border-border chat-panel-shadow"
            >
              {/* ─── HEADER ─── */}
              <motion.div
                variants={noMotion ? undefined : headerVariants}
                className="relative px-4 py-2.5 border-b border-border"
              >
                {/* top accent line */}
                <div
                  className="absolute top-0 left-4 right-4 h-[1px]"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, var(--color-accent-1), transparent)",
                    opacity: 0.3,
                  }}
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <SystemAvatar />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-bold text-[13px] text-text-primary tracking-tight">
                          AI System
                        </h3>
                        <span
                          className="px-1.5 py-0.5 rounded font-mono text-[9px] uppercase tracking-widest bg-accent-glow text-accent-1"
                        >
                          Live
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-text-muted tracking-wide">
                        {isLoading ? "Processing query..." : "Bizzzup Decision Engine"}
                      </span>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => setIsOpen(false)}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-text-muted hover:text-text-primary transition-colors cursor-pointer bg-bg-surface"
                    whileHover={noMotion ? {} : { scale: 1.05 }}
                    whileTap={noMotion ? {} : { scale: 0.95 }}
                    aria-label="Close"
                  >
                    <CloseIcon />
                  </motion.button>
                </div>
              </motion.div>

              {/* ─── MESSAGES ─── */}
              <motion.div
                variants={noMotion ? undefined : contentVariants}
                ref={messageListRef}
                className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-bg-deep"
                role="log"
                aria-live="polite"
                aria-label="System messages"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "var(--color-border) transparent",
                }}
              >
                {/* ─── welcome: system boot ─── */}
                {messages.length === 0 && (
                  <motion.div
                    variants={noMotion ? undefined : welcomeVariants}
                    initial="hidden"
                    animate="visible"
                    className="py-4"
                  >
                    {/* system identity */}
                    <motion.div variants={welcomeChildVariant} className="flex items-center gap-2 mb-5">
                      <SystemAvatar />
                      <div>
                        <span className="font-display font-bold text-sm text-text-primary tracking-tight">
                          AI System
                        </span>
                        <span className="block font-mono text-[10px] text-text-muted tracking-wide">
                          Bizzzup Decision Engine v1.0
                        </span>
                      </div>
                    </motion.div>

                    {/* system intro message */}
                    <motion.div
                      variants={welcomeChildVariant}
                      className="rounded-xl px-4 py-3.5 text-[13px] leading-relaxed font-body text-text-secondary bg-bg-card border border-border"
                    >
                      <p className="text-text-primary font-medium mb-2.5">
                        You&apos;re now interacting with Bizzzup&apos;s AI system.
                      </p>
                      <p className="mb-1.5">I can:</p>
                      <ul className="space-y-1 pl-0.5">
                        <li className="flex items-start gap-2">
                          <span className="w-1 h-1 rounded-full mt-[7px] flex-shrink-0 bg-accent-1" />
                          <span>Break down how our systems work</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1 h-1 rounded-full mt-[7px] flex-shrink-0 bg-accent-2" />
                          <span>Recommend solutions for your use case</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1 h-1 rounded-full mt-[7px] flex-shrink-0 bg-accent-3" />
                          <span>Simulate workflows for your business</span>
                        </li>
                      </ul>
                      <p className="mt-3 text-text-muted text-xs">
                        What would you like to explore?
                      </p>
                    </motion.div>
                  </motion.div>
                )}

                {/* ─── message bubbles ─── */}
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    variants={noMotion ? undefined : messageFadeUp}
                    initial="hidden"
                    animate="visible"
                    className={`flex gap-2.5 ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.role === "assistant" && (
                      <div className="mt-0.5">
                        <SystemAvatar size="sm" />
                      </div>
                    )}
                    <div className="flex flex-col max-w-[80%]">
                      {/* role label */}
                      <span className={`font-mono text-[9px] text-text-muted uppercase tracking-widest mb-1 ${
                        msg.role === "user" ? "text-right" : "text-left"
                      }`}>
                        {msg.role === "user" ? "You" : "System"}
                      </span>
                      <div
                        className={`px-3.5 py-2.5 text-[13px] leading-relaxed font-body ${
                          msg.role === "user"
                            ? "rounded-xl rounded-br-sm text-white bg-accent-1"
                            : "rounded-xl rounded-bl-sm text-text-primary bg-bg-card border border-border"
                        }`}
                      >
                        {msg.role === "assistant"
                          ? renderMarkdown(msg.content || "...")
                          : msg.content}
                      </div>
                      <span
                        className={`font-mono text-[9px] text-text-muted mt-1 px-0.5 ${
                          msg.role === "user" ? "text-right" : "text-left"
                        }`}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </motion.div>
                ))}

                {/* ─── typing indicator ─── */}
                <AnimatePresence>
                  {isLoading &&
                    messages[messages.length - 1]?.content === "" && (
                      <motion.div
                        key="typing"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex gap-2.5 justify-start"
                      >
                        <div className="mt-0.5">
                          <SystemAvatar size="sm" />
                        </div>
                        <div
                          className="rounded-xl rounded-bl-sm bg-bg-card border border-border"
                        >
                          <TypingIndicator />
                        </div>
                      </motion.div>
                    )}
                </AnimatePresence>

                <div ref={messagesEndRef} />
              </motion.div>

              {/* ─── QUICK REPLIES ─── */}
              {messages.length === 0 && (
                <motion.div
                  variants={noMotion ? undefined : chipContainerVariants}
                  initial="hidden"
                  animate="visible"
                  className="px-4 py-2.5 bg-bg-deep border-t border-border"
                >
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_REPLIES.map((reply) => (
                      <motion.button
                        key={reply}
                        variants={noMotion ? undefined : chipVariant}
                        onClick={() => sendMessage(reply)}
                        className="px-2.5 py-1.5 rounded-lg font-mono text-[10px] text-text-secondary transition-all cursor-pointer bg-bg-card border border-border"
                        whileHover={noMotion ? {} : { y: -1 }}
                        whileTap={noMotion ? {} : { scale: 0.97 }}
                      >
                        {reply}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ─── INPUT AREA ─── */}
              <motion.form
                variants={noMotion ? undefined : inputVariants}
                onSubmit={handleSubmit}
                className="flex items-end gap-2 px-4 py-2.5 bg-bg-card border-t border-border"
              >
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about systems, workflows, or use cases..."
                  rows={1}
                  className="flex-1 resize-none rounded-lg px-3 py-2 text-[16px] font-body text-text-primary placeholder:text-text-muted focus:outline-none transition-colors bg-bg-deep border border-border"
                  style={{
                    maxHeight: "100px",
                    minHeight: "38px",
                  }}
                  aria-label="Type your query"
                  disabled={isLoading}
                />
                <motion.button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="flex items-center justify-center w-[38px] h-[38px] rounded-lg text-white disabled:opacity-25 transition-opacity cursor-pointer disabled:cursor-not-allowed bg-accent-1"
                  whileHover={noMotion ? {} : { scale: 1.06 }}
                  whileTap={noMotion ? {} : { scale: 0.94 }}
                  aria-label="Send query"
                >
                  <SendIcon />
                </motion.button>
              </motion.form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
