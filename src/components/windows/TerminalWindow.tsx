"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type OutputTone = "default" | "success" | "error" | "cyan";

/** String line uses entry tone; object can override and add link. */
type OutputLine =
  | string
  | { text: string; tone?: OutputTone; href?: string };

type TerminalEntry =
  | { id: number; type: "command"; text: string }
  | { id: number; type: "output"; lines: OutputLine[]; tone: OutputTone };

type CommandResult =
  | { type: "clear" }
  | { type: "output"; lines: OutputLine[]; tone?: OutputTone };

type CommandHandler = (args: string[], rawInput: string) => CommandResult;

const PROMPT = "aditya@os:~$";
const BOOT_LINE_1 = "Aditya OS Terminal v1.0";
const BOOT_LINE_2 = "Type 'help' to see available commands.";

const HIRE_AADI_EMAIL = "aditya@example.com";
const HIRE_AADI_LINKEDIN = "https://linkedin.com/in/aditya-jain";
const HIRE_AADI_ASCII: string[] = [
  "  _    _ _____ _____  ______ _____  _",
  " | |  | |_   _|  __ \\|  ____|  __ \\| |",
  " | |__| | | | | |__) | |__  | |  | | |",
  " |  __  | | | |  _  /|  __| | |  | | |",
  " | |  | |_| |_| | \\ \\| |____| |__| |_|",
  " |_|  |_|_____|_|  \\_\\______|_____/(_)",
];

const commandList = [
  "help",
  "help projects",
  "whoami",
  "about",
  "skills",
  "experience",
  "projects",
  "project luminare",
  "project kalakrati",
  "project varta",
  "project configurator",
  "contact",
  "resume",
  "date",
  "echo [text]",
  "clear",
  "ls projects/",
  "cat varta-ai",
];

const RESUME_LINES: OutputLine[] = [
  "Experience summary: Freelance developer delivering production-ready AI and web systems.",
  "Skills summary: Full stack engineering, AI pipelines, voice and automation tooling.",
  "Projects summary: Voice CRM, Ecommerce Platform, Varta AI, 3D Configurator.",
  "Download Resume → /resume.pdf",
];

const commands: Record<string, CommandHandler> = {
  help: () => ({
    type: "output",
    tone: "success",
    lines: [
      "Available commands:",
      ...commandList.map((item) => `- ${item}`),
      { text: "- 🔒 ???", tone: "default" },
    ],
  }),
  "help projects": () => ({
    type: "output",
    lines: [
      "Project-related commands:",
      "- projects",
      "- project luminare",
      "- project kalakrati",
      "- project varta",
      "- project configurator",
      "- ls projects/",
      "- cat varta-ai",
    ],
  }),
  whoami: () => ({
    type: "output",
    lines: [
      "Aditya Jain",
      "Full Stack & AI Developer",
      "JECRC Foundation",
      "Freelance Developer",
    ],
  }),
  about: () => ({
    type: "output",
    lines: [
      "I build production-grade web applications, AI systems, and automation tools",
      "for real clients with a focus on practical business outcomes.",
    ],
  }),
  skills: () => ({
    type: "output",
    lines: [
      "Frontend: Next.js, React, TypeScript, Tailwind CSS",
      "Backend: FastAPI, Node.js, PostgreSQL, MongoDB",
      "AI: LangChain, LlamaIndex, Groq, Sarvam AI, Vector Databases",
      "Tools: Git, Vercel, LiveKit, Twilio, WebSockets",
    ],
  }),
  experience: () => ({
    type: "output",
    lines: [
      "Freelance experience:",
      "Built and deployed AI + fullstack systems for client workflows,",
      "including voice systems, ecommerce infrastructure, and automation tools.",
    ],
  }),
  projects: () => ({
    type: "output",
    lines: [
      "* Luminare Voice Labs",
      "* Kalakrati Ecommerce",
      "* Varta AI",
      "* 3D Product Configurator",
    ],
  }),
  "project luminare": () => ({
    type: "output",
    lines: [
      "Luminare Voice Labs",
      "Category: AI Voice CRM",
      "Tech: FastAPI, LiveKit, Twilio, Sarvam AI, React, WebSockets",
      "Features:",
      "* Real outbound calling",
      "* STT → LLM → TTS",
      "* Voice CRM dashboard",
      "* Call analytics",
    ],
  }),
  "project kalakrati": () => ({
    type: "output",
    lines: [
      "Kalakrati Ecommerce",
      "Production ecommerce platform.",
      "Includes:",
      "* Payments",
      "* Shipping",
      "* Admin dashboard",
      "* SEO",
      "* Email automation",
    ],
  }),
  "project varta": () => ({
    type: "output",
    lines: [
      "Varta AI",
      "WhatsApp AI Agent Platform",
      "Includes:",
      "* RAG",
      "* LangChain",
      "* FAISS",
      "* Groq",
      "* Twilio",
    ],
  }),
  "project configurator": () => ({
    type: "output",
    lines: [
      "3D Product Configurator",
      "Interactive 3D commerce system.",
      "Includes:",
      "* React Three Fiber",
      "* Tripo3D",
      "* Gemini AI",
      "* AWS",
    ],
  }),
  "ls projects/": () => ({
    type: "output",
    lines: ["varta-ai  luminare-voice  kalakrati  beacon-crm"],
  }),
  "cat varta-ai": () => ({
    type: "output",
    lines: [
      "Varta AI is a production-ready WhatsApp AI assistant platform with RAG-driven",
      "responses, business workflow automation, and multi-tenant conversation handling.",
    ],
  }),
  contact: () => ({
    type: "output",
    tone: "cyan",
    lines: [
      "Email: aditya@example.com",
      "GitHub: https://github.com/aditya-jain",
      "LinkedIn: https://linkedin.com/in/aditya-jain",
    ],
  }),
  resume: () => ({
    type: "output",
    lines: RESUME_LINES,
  }),
  "cat resume": () => ({
    type: "output",
    lines: RESUME_LINES,
  }),
  date: () => ({
    type: "output",
    lines: [new Date().toString()],
  }),
  echo: (args, rawInput) => {
    const echoed =
      rawInput.length > 4 ? rawInput.slice(5).trimStart() : args.join(" ");
    return { type: "output", lines: [echoed] };
  },
  clear: () => ({ type: "clear" }),
};

function parseCommand(input: string) {
  const normalized = input.trim().replace(/\s+/g, " ");
  const lower = normalized.toLowerCase();

  if (commands[lower]) {
    const argCount = lower.split(" ").length;
    return { key: lower, args: normalized.split(" ").slice(argCount) };
  }

  const [first, ...rest] = lower.split(" ");
  if (commands[first]) {
    return { key: first, args: rest };
  }

  return null;
}

function toneClass(tone: OutputTone) {
  if (tone === "success") return "text-[#4ade80]";
  if (tone === "error") return "text-[#f87171]";
  if (tone === "cyan") return "text-[#22d3ee]";
  return "text-[var(--os-text-muted)]";
}

function renderOutputLine(
  line: OutputLine,
  entryTone: OutputTone,
): { className: string; node: ReactNode } {
  if (typeof line === "string") {
    return { className: toneClass(entryTone), node: line };
  }
  const tone = line.tone ?? entryTone;
  const className = toneClass(tone);
  if (line.href) {
    const isHttp = /^https?:\/\//i.test(line.href);
    return {
      className,
      node: (
        <a
          href={line.href}
          {...(isHttp ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="underline decoration-white/30 underline-offset-2 hover:opacity-90"
        >
          {line.text}
        </a>
      ),
    };
  }
  return { className, node: line.text };
}

export function TerminalWindow() {
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [bootComplete, setBootComplete] = useState(false);
  const [entries, setEntries] = useState<TerminalEntry[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const nextIdRef = useRef(1);
  const sudoTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const queueSudoTimeout = (fn: () => void, ms: number) => {
    const id = setTimeout(() => {
      sudoTimeoutsRef.current = sudoTimeoutsRef.current.filter((t) => t !== id);
      fn();
    }, ms);
    sudoTimeoutsRef.current.push(id);
  };

  useEffect(() => {
    return () => {
      for (const t of sudoTimeoutsRef.current) {
        clearTimeout(t);
      }
      sudoTimeoutsRef.current = [];
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    let i = 0;
    let j = 0;

    const typeFirst = () => {
      if (cancelled) return;
      if (i <= BOOT_LINE_1.length) {
        setLine1(BOOT_LINE_1.slice(0, i));
        i += 1;
        setTimeout(typeFirst, 40);
        return;
      }
      setTimeout(typeSecond, 120);
    };

    const typeSecond = () => {
      if (cancelled) return;
      if (j <= BOOT_LINE_2.length) {
        setLine2(BOOT_LINE_2.slice(0, j));
        j += 1;
        setTimeout(typeSecond, 40);
        return;
      }
      setBootComplete(true);
    };

    typeFirst();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (bootComplete) {
      inputRef.current?.focus();
    }
  }, [bootComplete]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [entries, line1, line2, bootComplete]);

  const executeCommand = () => {
    const rawInput = inputValue.trim();
    if (!rawInput) return;

    const commandEntry: TerminalEntry = {
      id: nextIdRef.current++,
      type: "command",
      text: rawInput,
    };

    const normalized = rawInput.replace(/\s+/g, " ").trim();
    const lower = normalized.toLowerCase();

    const finishInput = () => {
      setHistory((prev) => [...prev, rawInput]);
      setHistoryIndex(null);
      setInputValue("");
    };

    if (lower === "sudo hire-aadi") {
      finishInput();

      const passwordOutput: TerminalEntry = {
        id: nextIdRef.current++,
        type: "output",
        lines: ["[sudo] password for visitor: ********"],
        tone: "default",
      };

      setEntries((prev) => [...prev, commandEntry, passwordOutput]);

      const postAsciiChunks: { lines: OutputLine[]; tone: OutputTone }[] = [
        { lines: ["Permission granted."], tone: "success" },
        { lines: ["Aditya has been added to your hiring pipeline."], tone: "success" },
        { lines: ["Initiating contact protocol..."], tone: "success" },
        { lines: [""], tone: "success" },
        {
          lines: [
            {
              text: `→ Email: ${HIRE_AADI_EMAIL}`,
              tone: "cyan",
              href: `mailto:${HIRE_AADI_EMAIL}`,
            },
          ],
          tone: "cyan",
        },
        {
          lines: [
            {
              text: `→ LinkedIn: ${HIRE_AADI_LINKEDIN}`,
              tone: "cyan",
              href: HIRE_AADI_LINKEDIN,
            },
          ],
          tone: "cyan",
        },
        {
          lines: ["→ Resume: type 'cat resume' to view"],
          tone: "default",
        },
      ];

      queueSudoTimeout(() => {
        setEntries((prev) => [
          ...prev,
          {
            id: nextIdRef.current++,
            type: "output",
            lines: HIRE_AADI_ASCII,
            tone: "success",
          },
        ]);

        postAsciiChunks.forEach((chunk, i) => {
          queueSudoTimeout(() => {
            setEntries((prev) => [
              ...prev,
              {
                id: nextIdRef.current++,
                type: "output",
                lines: chunk.lines,
                tone: chunk.tone,
              },
            ]);
          }, 300 * (i + 1));
        });
      }, 600);

      return;
    }

    if (lower.startsWith("sudo")) {
      finishInput();

      const outputEntry: TerminalEntry = {
        id: nextIdRef.current++,
        type: "output",
        lines: ["sudo: command not found. Did you mean 'sudo hire-aadi'?"],
        tone: "default",
      };

      setEntries((prev) => [...prev, commandEntry, outputEntry]);
      return;
    }

    const parsed = parseCommand(rawInput);
    const handler = parsed ? commands[parsed.key] : undefined;
    const result = handler
      ? handler(parsed?.args ?? [], rawInput)
      : {
          type: "output" as const,
          tone: "error" as const,
          lines: ['Command not found.', 'Type "help" to see available commands.'],
        };

    finishInput();

    if (result.type === "clear") {
      for (const t of sudoTimeoutsRef.current) {
        clearTimeout(t);
      }
      sudoTimeoutsRef.current = [];
      setEntries([]);
      return;
    }

    const outputEntry: TerminalEntry = {
      id: nextIdRef.current++,
      type: "output",
      lines: result.lines,
      tone: result.tone ?? "default",
    };

    setEntries((prev) => [...prev, commandEntry, outputEntry]);
  };

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      executeCommand();
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (history.length === 0) return;
      setHistoryIndex((prev) => {
        const next = prev === null ? history.length - 1 : Math.max(prev - 1, 0);
        setInputValue(history[next]);
        return next;
      });
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (history.length === 0) return;
      setHistoryIndex((prev) => {
        if (prev === null) return null;
        const next = prev + 1;
        if (next >= history.length) {
          setInputValue("");
          return null;
        }
        setInputValue(history[next]);
        return next;
      });
    }
  };

  return (
    <div
      className="font-mono-ui flex h-full min-h-0 flex-col overflow-auto p-4 text-[13px] leading-[1.7] text-[var(--os-text)] md:p-6 md:text-[14px]"
      onClick={() => inputRef.current?.focus()}
    >
        <p className="text-[var(--os-text-muted)]">{line1}</p>
        <p className="text-[var(--os-text-muted)]">{line2}</p>
        <p className="h-[1.7em]" />

        {entries.map((entry) => {
          if (entry.type === "command") {
            return (
              <p key={entry.id} className="mb-2">
                <span className="text-[#4ade80]">{PROMPT}</span>{" "}
                <span className="text-[var(--os-text)]">{entry.text}</span>
              </p>
            );
          }

          return (
            <div key={entry.id} className="mb-4">
              {entry.lines.map((line, index) => {
                const { className, node } = renderOutputLine(line, entry.tone);
                return (
                  <p key={`${entry.id}-${index}`} className={className}>
                    {node}
                  </p>
                );
              })}
            </div>
          );
        })}

        {bootComplete ? (
          <div className="flex items-center gap-2">
            <span className="text-[#4ade80]">{PROMPT}</span>
            <input
              ref={inputRef}
              autoFocus
              value={inputValue}
              onChange={(event) => {
                setInputValue(event.target.value);
                setHistoryIndex(null);
              }}
              onKeyDown={onInputKeyDown}
              className="min-w-0 flex-1 bg-transparent text-[var(--os-text)] outline-none"
              spellCheck={false}
            />
            <span className="h-4 w-[1px] animate-pulse bg-[var(--os-text)]/80" aria-hidden="true" />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-[#4ade80]">{PROMPT}</span>
            <span className="h-4 w-[1px] animate-pulse bg-[var(--os-text)]/80" aria-hidden="true" />
          </div>
        )}

        <div ref={bottomRef} className="h-1" />
        <p className="sr-only">
          History index: {historyIndex === null ? "none" : historyIndex}
        </p>
    </div>
  );
}
