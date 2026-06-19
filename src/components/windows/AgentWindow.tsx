"use client";

import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent } from "react";
import { Briefcase, ChevronDown, Code2, Layers, UserCheck } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { publishAgentSession } from "@/lib/agent-session";
import {
  CHAT_MODEL_LABELS,
  CHAT_MODEL_PROVIDERS,
  CHAT_MODEL_STORAGE_KEY,
  parseChatModelProvider,
  type ChatModelProvider,
} from "@/lib/ai/models";
import { detectVisitorClient, type VisitorClientInfo } from "@/lib/visitor-client";

const suggestions = [
  {
    label: "What is Aditya OS?",
    icon: Code2,
  },
  {
    label: "What freelance work has he delivered?",
    icon: Briefcase,
  },
  {
    label: "What's his tech stack?",
    icon: Layers,
  },
  {
    label: "Can I hire him?",
    icon: UserCheck,
  },
] as const;

const MAX_INPUT_LENGTH = 2000;
const COUNTER_THRESHOLD = Math.floor(MAX_INPUT_LENGTH * 0.8);
const REQUEST_TIMEOUT_MS = 20_000;

const ERROR_MESSAGE = "Connection hiccup on my end. Try again in a moment?";
const TIMEOUT_MESSAGE = "That took longer than expected — mind trying again?";
const RATE_LIMIT_MESSAGE = "You're sending messages a bit fast — try again in a few minutes.";

function keepComposerFocus(event: PointerEvent) {
  event.preventDefault();
}

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

function Avatar({ size = "sm" }: { size?: "sm" | "lg" }) {
  const sizeClasses =
    size === "lg"
      ? "h-10 w-10 rounded-xl text-[15px] md:h-12 md:w-12 md:text-[16px]"
      : "h-7 w-7 rounded-lg text-[13px]";

  return (
    <div
      className={`agent-avatar flex shrink-0 items-center justify-center font-medium text-[var(--os-text)] ${sizeClasses}`}
    >
      A
    </div>
  );
}

function ThinkingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <Avatar />
      <div className="flex h-7 items-center gap-1">
        <span className="thinking-dot h-1.5 w-1.5 rounded-full bg-[var(--os-text-muted)]" />
        <span className="thinking-dot h-1.5 w-1.5 rounded-full bg-[var(--os-text-muted)]" />
        <span className="thinking-dot h-1.5 w-1.5 rounded-full bg-[var(--os-text-muted)]" />
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="message-enter flex justify-end">
        <div className="text-ui max-w-full rounded-2xl bg-[var(--os-surface)] px-4 py-2.5 text-[var(--os-text)] sm:max-w-[85%] md:max-w-[72%]">
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="message-enter flex items-start gap-3">
      <Avatar />
      <article className="text-ui max-w-full flex-1 pt-0.5 text-[var(--os-text)] sm:max-w-[85%] md:max-w-[72%]">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="mt-2 mb-2 text-[22px] leading-tight font-medium">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="mt-2 mb-2 text-[18px] leading-tight font-medium">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="mt-2 mb-2 text-[16px] leading-tight font-medium">{children}</h3>
            ),
            p: ({ children }) => (
              <p className="mb-2 whitespace-pre-wrap last:mb-0">{children}</p>
            ),
            ul: ({ children }) => (
              <ul className="mb-2 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="mb-2 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>
            ),
            code: ({ className, children }) => {
              const isBlock = Boolean(className);
              if (isBlock) {
                return (
                  <code className="block overflow-x-auto rounded-md border-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)] px-3 py-2 font-mono text-[12px]">
                    {children}
                  </code>
                );
              }

              return (
                <code className="rounded border-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)] px-1.5 py-0.5 font-mono text-[12px]">
                  {children}
                </code>
              );
            },
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:opacity-80"
              >
                {children}
              </a>
            ),
          }}
        >
          {message.content}
        </ReactMarkdown>
      </article>
    </div>
  );
}

function ModelProviderSelect({
  value,
  onChange,
  disabled,
}: {
  value: ChatModelProvider;
  onChange: (provider: ChatModelProvider) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={rootRef} className="relative shrink-0 self-end">
      <button
        type="button"
        onPointerDown={keepComposerFocus}
        onClick={() => setOpen((previous) => !previous)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select AI model provider"
        className="agent-model-select text-ui flex h-7 min-w-[4.75rem] items-center justify-between gap-1 rounded-full px-2.5 text-[11px] text-[var(--os-text-muted)] transition-colors duration-150 hover:text-[var(--os-text)] disabled:cursor-not-allowed disabled:opacity-65 md:h-8 md:min-w-[5.25rem] md:px-3 md:text-[12px]"
      >
        <span className="truncate">{CHAT_MODEL_LABELS[value]}</span>
        <ChevronDown
          size={12}
          strokeWidth={2}
          aria-hidden="true"
          className={`shrink-0 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open ? (
        <ul
          role="listbox"
          aria-label="AI model providers"
          className="agent-model-menu absolute right-0 bottom-[calc(100%+6px)] z-50 min-w-[7.5rem] overflow-hidden rounded-xl bg-[var(--os-surface)] py-1"
        >
          {CHAT_MODEL_PROVIDERS.map((provider) => {
            const isSelected = provider === value;
            return (
              <li key={provider} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onPointerDown={keepComposerFocus}
                  onClick={() => {
                    onChange(provider);
                    setOpen(false);
                  }}
                  className={`text-ui w-full px-3 py-2 text-left text-[12px] transition-colors duration-150 ${
                    isSelected
                      ? "bg-[var(--os-hover)] text-[var(--os-text)]"
                      : "text-[var(--os-text-muted)] hover:bg-[var(--os-hover)] hover:text-[var(--os-text)]"
                  }`}
                >
                  {CHAT_MODEL_LABELS[provider]}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

export function AgentWindow() {
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [hasRoasted, setHasRoasted] = useState(false);
  const [chatProvider, setChatProvider] = useState<ChatModelProvider>("gemini");
  const visitorInfoRef = useRef<VisitorClientInfo | null>(null);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const composerRef = useRef<HTMLElement>(null);

  const canSend =
    draft.trim().length > 0 && draft.length <= MAX_INPUT_LENGTH && !isLoading;
  const showCharCounter = draft.length >= COUNTER_THRESHOLD;
  const isAtCharLimit = draft.length >= MAX_INPUT_LENGTH;

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const info = await detectVisitorClient();
        if (!cancelled) {
          visitorInfoRef.current = info;
        }
      } catch {
        if (!cancelled) {
          visitorInfoRef.current = {
            browser: "Other",
            os: "Other",
            screenWidth: typeof window !== "undefined" ? window.screen?.width ?? 0 : 0,
          };
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CHAT_MODEL_STORAGE_KEY);
      if (stored) {
        setChatProvider(parseChatModelProvider(stored));
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const handleProviderChange = (provider: ChatModelProvider) => {
    setChatProvider(provider);
    try {
      localStorage.setItem(CHAT_MODEL_STORAGE_KEY, provider);
    } catch {
      // ignore storage errors
    }
  };

  useLayoutEffect(() => {
    publishAgentSession({
      hasStartedChat,
      hasDraft: draft.trim().length > 0,
    });
  }, [hasStartedChat, draft]);

  useEffect(() => {
    return () => {
      publishAgentSession({ hasDraft: false, isComposerFocused: false });
    };
  }, []);

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  }, [draft]);

  const ensureVisitorInfo = async (): Promise<VisitorClientInfo> => {
    if (!visitorInfoRef.current) {
      visitorInfoRef.current = await detectVisitorClient();
    }
    return visitorInfoRef.current;
  };

  const sendMessage = async (messageText: string) => {
    if (isLoading) {
      return;
    }

    const trimmed = messageText.trim();
    if (!trimmed || trimmed.length > MAX_INPUT_LENGTH) {
      return;
    }

    const isFirstUserMessage = messages.length === 0;
    const isFirstMessageInConversation = isFirstUserMessage && !hasRoasted;

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      content: trimmed,
    };

    setHasStartedChat(true);
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setDraft("");
    setIsLoading(true);
    requestAnimationFrame(() => {
      dismissComposerFocus();
    });

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const visitor = await ensureVisitorInfo();

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content }) => ({ role, content })),
          provider: chatProvider,
          visitor: {
            browser: visitor.browser,
            os: visitor.os,
            screenWidth: visitor.screenWidth,
          },
          isFirstMessageInConversation,
        }),
        signal: controller.signal,
      });

      if (response.status === 429) {
        throw new Error("rate_limited");
      }

      if (!response.ok) {
        throw new Error("Chat API request failed");
      }

      const payload = (await response.json()) as {
        response?: string;
        consumeFirstMessageRoast?: boolean;
      };
      const assistantText = payload.response?.trim() || ERROR_MESSAGE;

      setMessages((previous) => [
        ...previous,
        {
          id: `${Date.now()}-assistant`,
          role: "assistant",
          content: assistantText,
        },
      ]);

      if (payload.consumeFirstMessageRoast) {
        setHasRoasted(true);
      }
    } catch (error) {
      const isTimeout =
        error instanceof DOMException && error.name === "AbortError";
      const isRateLimited =
        error instanceof Error && error.message === "rate_limited";

      setMessages((previous) => [
        ...previous,
        {
          id: `${Date.now()}-assistant-error`,
          role: "assistant",
          content: isRateLimited
            ? RATE_LIMIT_MESSAGE
            : isTimeout
              ? TIMEOUT_MESSAGE
              : ERROR_MESSAGE,
        },
      ]);
    } finally {
      window.clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    void sendMessage(draft);
  };

  const dismissComposerFocus = () => {
    textareaRef.current?.blur();
    publishAgentSession({ isComposerFocused: false });
  };

  const handleComposerBlur = () => {
    window.setTimeout(() => {
      const active = document.activeElement;
      if (composerRef.current?.contains(active)) {
        return;
      }
      publishAgentSession({ isComposerFocused: false });
    }, 0);
  };

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col bg-[var(--os-background)]">
      <style jsx global>{`
        @keyframes thinking-pulse {
          0%,
          80%,
          100% {
            opacity: 0.25;
            transform: scale(0.85);
          }
          40% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .thinking-dot {
          animation: thinking-pulse 1.1s ease-in-out infinite;
        }
        .thinking-dot:nth-child(2) {
          animation-delay: 0.15s;
        }
        .thinking-dot:nth-child(3) {
          animation-delay: 0.3s;
        }
        @keyframes message-fade-up {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .message-enter {
          animation: message-fade-up 200ms ease-out;
        }
        .agent-avatar {
          background: linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05)),
            var(--os-surface);
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.06), 0 1px 2px rgba(0, 0, 0, 0.2);
          transition: box-shadow 150ms ease;
        }
        .agent-composer-pill {
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08), 0 1px 3px rgba(0, 0, 0, 0.15);
        }
        .agent-composer-fade {
          position: absolute;
          top: -24px;
          right: 0;
          left: 0;
          height: 24px;
          background: linear-gradient(to bottom, transparent, var(--os-background));
          pointer-events: none;
        }
        .agent-composer-input {
          overflow-y: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .agent-composer-input::-webkit-scrollbar {
          display: none;
        }
        .agent-suggestion-chip {
          background: linear-gradient(rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.06)),
            var(--os-surface);
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.07), 0 1px 2px rgba(0, 0, 0, 0.12);
          transition:
            background 150ms ease,
            box-shadow 150ms ease,
            transform 150ms ease;
        }
        .agent-suggestion-chip:hover:not(:disabled) {
          background: linear-gradient(rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.09)),
            var(--os-hover);
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1), 0 2px 8px rgba(0, 0, 0, 0.18);
          transform: translateY(-1px);
        }
        .agent-suggestion-chip:active:not(:disabled) {
          transform: translateY(0);
        }
        .agent-model-select {
          background: linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05)),
            var(--os-background);
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.07);
        }
        .agent-model-menu {
          box-shadow:
            inset 0 0 0 1px rgba(255, 255, 255, 0.08),
            0 4px 16px rgba(0, 0, 0, 0.22);
        }
        @media (max-width: 767px) {
          .agent-scroll {
            padding-bottom: 0.75rem;
          }
          .agent-composer-fade {
            display: none;
          }
        }
      `}</style>

      <section className="agent-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3 sm:px-6 sm:py-5">
        {!hasStartedChat ? (
          <div className="mx-auto flex w-full max-w-[760px] flex-col items-center px-1 text-center max-md:gap-3 max-md:pt-2 md:h-full md:justify-center md:gap-6">
            <Avatar size="lg" />
            <div>
              <p className="text-ui text-[14px] font-medium text-[var(--os-text)] md:text-[15px]">
                Hey! I&apos;m Aditya&apos;s Assistant.
              </p>
              <p className="text-ui mx-auto mt-1.5 max-w-[380px] text-[12px] leading-[1.55] text-[var(--os-text-muted)] md:mt-3 md:text-[13px]">
                Ask me about his projects, freelance work, tech stack,
                <br />
                or whether he&apos;s available to hire - I know it all.
              </p>
            </div>
            <div className="flex w-full max-w-[620px] flex-col gap-2 max-md:items-stretch md:mt-1 md:flex-row md:flex-wrap md:justify-center md:gap-2.5">
              {suggestions.map((suggestion) => {
                const Icon = suggestion.icon;
                return (
                  <button
                    key={suggestion.label}
                    type="button"
                    onPointerDown={keepComposerFocus}
                    onClick={() => sendMessage(suggestion.label)}
                    disabled={isLoading}
                    className="agent-suggestion-chip text-ui group flex min-h-11 items-center gap-2.5 rounded-2xl px-4 py-2.5 text-left text-[12.5px] text-[var(--os-text)] disabled:cursor-not-allowed disabled:opacity-65 md:justify-center md:rounded-full md:px-5 md:text-center md:text-[13px]"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--os-background)]/60 text-[var(--os-text-muted)] transition-colors duration-150 group-hover:text-[var(--os-text)] md:h-6 md:w-6">
                      <Icon size={14} strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <span className="leading-snug">{suggestion.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="mx-auto w-full max-w-[860px] space-y-6">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            {isLoading ? <ThinkingIndicator /> : null}
            <div ref={scrollAnchorRef} />
          </div>
        )}
      </section>

      <section
        ref={composerRef}
        className="agent-composer relative z-10 shrink-0 border-t-[0.5px] border-[var(--os-border)] bg-[var(--os-background)] px-3 py-2 sm:px-6 sm:py-3 md:py-3.5"
      >
        <div className="agent-composer-fade" aria-hidden="true" />
        <div className="mx-auto w-full max-w-[860px]">
          <div className="agent-composer-pill flex items-end gap-1.5 rounded-2xl bg-[var(--os-surface)] px-3 py-2 sm:rounded-3xl sm:gap-2 sm:px-3.5 sm:py-2 md:px-4 md:py-2.5">
            <textarea
              ref={textareaRef}
              value={draft}
              maxLength={MAX_INPUT_LENGTH}
              onChange={(event) => setDraft(event.target.value.slice(0, MAX_INPUT_LENGTH))}
              onFocus={() => {
                publishAgentSession({ isComposerFocused: true });
              }}
              onBlur={handleComposerBlur}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  if (!isLoading) {
                    handleSubmit();
                  }
                }
              }}
              placeholder="Ask about Aditya"
              rows={1}
              className="agent-composer-input text-ui min-h-5 max-h-32 w-full flex-1 resize-none bg-transparent py-1 text-base leading-5 text-[var(--os-text)] outline-none placeholder:text-[var(--os-text-muted)] max-md:text-[16px] sm:max-h-40 md:min-h-6 md:py-1.5 md:text-[14px] md:leading-[1.45]"
            />
            <ModelProviderSelect
              value={chatProvider}
              onChange={handleProviderChange}
              disabled={isLoading}
            />
            <button
              type="button"
              onPointerDown={keepComposerFocus}
              onClick={handleSubmit}
              disabled={!canSend}
              aria-label="Send message"
              className={`flex h-7 w-7 min-h-7 min-w-7 shrink-0 items-center justify-center rounded-full transition-colors duration-150 md:h-8 md:w-8 md:min-h-8 md:min-w-8 ${
                canSend
                  ? "bg-[var(--os-text)] text-[var(--os-background)]"
                  : "bg-[var(--os-border)] text-[var(--os-text-muted)]"
              }`}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="md:h-[14px] md:w-[14px]"
              >
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
            </button>
          </div>
          {showCharCounter ? (
            <p
              className={`text-label mt-1.5 text-right text-[11px] ${
                isAtCharLimit ? "text-[#c62828] dark:text-[#ef5350]" : "text-[var(--os-text-muted)]"
              }`}
            >
              {draft.length} / {MAX_INPUT_LENGTH}
            </p>
          ) : null}
          <p className="text-label mt-1.5 hidden text-center text-[var(--os-text-muted)] md:block">
            Enter to send, Shift + Enter for new line
          </p>
        </div>
      </section>
    </div>
  );
}