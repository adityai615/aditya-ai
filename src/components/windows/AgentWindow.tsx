"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const suggestions = [
  "How did Aditya build Luminare Voice Labs?",
  "What freelance projects has he delivered?",
  "Tell me about his tech stack.",
  "Can I hire Aditya?",
];

const quickStats = [
  { label: "Projects", value: "8+" },
  { label: "Clients", value: "5+" },
  { label: "Experience", value: "2+ yrs" },
  { label: "AI Apps", value: "10+" },
];

const ERROR_MESSAGE = "Something went wrong.\nPlease try again.";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <article
        className={`text-ui max-w-full rounded-lg border-[0.5px] px-4 py-3 sm:max-w-[90%] md:max-w-[78%] ${
          isUser
            ? "border-[var(--os-border)] bg-[var(--os-surface)] text-[var(--os-text)]"
            : "border-[var(--os-border)] bg-[var(--os-background)] text-[var(--os-text)]"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="mt-2 mb-2 text-[22px] leading-tight font-semibold">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="mt-2 mb-2 text-[18px] leading-tight font-semibold">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="mt-2 mb-2 text-[16px] leading-tight font-semibold">{children}</h3>
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
        )}
      </article>
    </div>
  );
}

export function AgentWindow() {
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);

  const canSend = draft.trim().length > 0 && !isLoading;

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async (messageText: string) => {
    const trimmed = messageText.trim();
    if (!trimmed || isLoading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      content: trimmed,
    };

    setHasStartedChat(true);
    setMessages((previous) => [...previous, userMessage]);
    setDraft("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      if (!response.ok) {
        throw new Error("Chat API request failed");
      }

      const payload = (await response.json()) as { response?: string };
      const assistantText = payload.response?.trim() || ERROR_MESSAGE;

      setMessages((previous) => [
        ...previous,
        {
          id: `${Date.now()}-assistant`,
          role: "assistant",
          content: assistantText,
        },
      ]);
    } catch {
      setMessages((previous) => [
        ...previous,
        {
          id: `${Date.now()}-assistant-error`,
          role: "assistant",
          content: ERROR_MESSAGE,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-[var(--os-background)]">
      <section className="border-b-[0.5px] border-[var(--os-border)] px-4 py-3 sm:px-6">
        <p className="text-label uppercase tracking-[0.06em] text-[var(--os-text-muted)]">
          Suggested Questions
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {suggestions.map((question) => (
            <button
              key={question}
              type="button"
              onClick={() => sendMessage(question)}
              disabled={isLoading}
              className="text-ui rounded-md border-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)] px-3 py-2 text-sm text-[var(--os-text)] transition-colors duration-150 hover:bg-[var(--os-hover)] disabled:cursor-not-allowed disabled:opacity-65"
            >
              {question}
            </button>
          ))}
        </div>
      </section>

      <section className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
        {!hasStartedChat ? (
          <div className="mx-auto flex h-full w-full max-w-[760px] flex-col items-center justify-center text-center">
            <h2 className="text-hero-title text-[var(--os-text)]">
              Ask anything about Aditya.
            </h2>

            <p className="text-hero-subtitle mt-6 max-w-[650px] text-[var(--os-text-muted)]">
              I know everything about Aditya&apos;s projects,
              <br />
              freelance work, architecture decisions,
              <br />
              and AI systems.
              <br />
              Feel free to ask anything.
            </p>

            <div className="mt-7 grid w-full max-w-[680px] grid-cols-2 gap-x-8 gap-y-4 sm:flex sm:items-center sm:justify-center sm:gap-10">
              {quickStats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-label text-[var(--os-text-muted)]">{stat.label}</p>
                  <p className="text-ui mt-1 text-base font-medium text-[var(--os-text)]">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-label mt-8 text-[12px] font-normal text-[var(--os-text-muted)]">
              Built with Next.js, AI, and too much curiosity.
            </p>
          </div>
        ) : (
          <div className="mx-auto w-full max-w-[860px] space-y-4">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            {isLoading ? (
              <div className="flex justify-start">
                <div className="text-ui rounded-lg border-[0.5px] border-[var(--os-border)] bg-[var(--os-background)] px-4 py-3 text-[var(--os-text-muted)]">
                  Thinking...
                </div>
              </div>
            ) : null}
            <div ref={scrollAnchorRef} />
          </div>
        )}
      </section>

      <section className="sticky bottom-0 border-t-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)] px-4 py-3 sm:px-6">
        <div className="mx-auto w-full max-w-[860px]">
          <div className="rounded-lg border-[0.5px] border-[var(--os-border)] bg-[var(--os-background)] p-2">
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void sendMessage(draft);
                }
              }}
              placeholder="Ask anything about Aditya..."
              rows={2}
              className="text-ui max-h-40 min-h-10 w-full resize-y bg-transparent px-2 py-1 text-[var(--os-text)] outline-none placeholder:text-[var(--os-text-muted)]"
            />
            <div className="mt-2 flex items-center justify-between px-2 pb-1">
              <p className="text-label text-[var(--os-text-muted)]">Enter to send, Shift + Enter for new line</p>
              <button
                type="button"
                onClick={() => void sendMessage(draft)}
                disabled={!canSend}
                className="text-ui rounded-md border-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)] px-3 py-1.5 text-sm text-[var(--os-text)] transition-colors duration-150 hover:bg-[var(--os-hover)] disabled:cursor-not-allowed disabled:opacity-65"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
