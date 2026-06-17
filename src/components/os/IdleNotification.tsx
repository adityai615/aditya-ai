"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import { getAgentSessionSnapshot } from "@/lib/agent-session";
import {
  detectVisitorClient,
  type DetectedBrowser,
  type DetectedOS,
  type VisitorClientInfo,
} from "@/lib/visitor-client";
import type { WindowType } from "./types";

const SESSION_KEY = "hasShownIdleNotification";
const AUTO_DISMISS_MS = 11000;
const IDLE_MS = 5000;
const IDLE_CHECK_MS = 500;
const MOUSE_MOVE_THRESHOLD_PX = 24;

const FALLBACK_VISITOR: VisitorClientInfo = {
  browser: "Other",
  os: "Other",
  screenWidth: 0,
};

type WindowSnapshot = {
  isOpen: boolean;
  isMinimized: boolean;
};

type IdleNotificationProps = {
  activeWindow: WindowType;
  windows: Record<WindowType, WindowSnapshot>;
  onOpenAgent: () => void;
};

type NotificationPhase = "hidden" | "visible" | "exiting";

function hasShownIdleNotification(): boolean {
  if (typeof window === "undefined") return true;
  return window.sessionStorage.getItem(SESSION_KEY) === "true";
}

function markIdleNotificationShown(): void {
  window.sessionStorage.setItem(SESSION_KEY, "true");
}

function formatClientLabel(browser: DetectedBrowser, os: DetectedOS): string {
  const osLabel =
    os === "macOS" ? "Mac" : os === "Windows" ? "Windows" : os === "Linux" ? "Linux" : os;
  return `${browser}/${osLabel}`;
}

function getOpenWindows(windows: Record<WindowType, WindowSnapshot>): WindowType[] {
  return (Object.keys(windows) as WindowType[]).filter((windowType) => {
    const state = windows[windowType];
    return state?.isOpen && !state.isMinimized;
  });
}

function buildNotificationMessage(
  openWindows: WindowType[],
  client: VisitorClientInfo,
): string {
  const clientLabel = formatClientLabel(client.browser, client.os);
  const has = (windowType: WindowType) => openWindows.includes(windowType);

  if (has("terminal")) {
    return "Exploring the terminal, nice. Type 'help' if you're stuck.";
  }

  if (has("projects")) {
    return `Browsing my projects on ${client.browser}? Ask the AI agent which one fits what you're looking for.`;
  }

  if (has("agent")) {
    return `Still here? I see you're on ${clientLabel} — try asking me something.`;
  }

  if (has("about")) {
    return `Reading up on ${clientLabel}? The AI agent knows even more — ask away.`;
  }

  if (has("resume")) {
    return `Checking the resume on ${clientLabel}? I can answer questions about experience and skills too.`;
  }

  if (openWindows.length === 0) {
    return `Looking around on ${clientLabel}? Click the AI Agent icon — I can answer almost anything.`;
  }

  return `Still browsing on ${clientLabel}? The AI agent can help with anything you're curious about.`;
}

function NotificationAvatar() {
  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--os-surface)] text-[13px] font-medium text-[var(--os-text)]">
      A
    </div>
  );
}

function isAgentWindowActive(
  activeWindow: WindowType,
  windows: Record<WindowType, WindowSnapshot>,
): boolean {
  const agent = windows.agent;
  return activeWindow === "agent" && Boolean(agent?.isOpen && !agent.isMinimized);
}

function shouldSkipForAgentSession(
  activeWindow: WindowType,
  windows: Record<WindowType, WindowSnapshot>,
): boolean {
  const { hasStartedChat, hasDraft } = getAgentSessionSnapshot();

  if (hasDraft) {
    return true;
  }

  if (hasStartedChat && isAgentWindowActive(activeWindow, windows)) {
    return true;
  }

  return false;
}

export function IdleNotification({
  activeWindow,
  windows,
  onOpenAgent,
}: IdleNotificationProps) {
  const [phase, setPhase] = useState<NotificationPhase>("hidden");
  const [message, setMessage] = useState("");
  const [mounted, setMounted] = useState(false);

  const dismissTimerRef = useRef<number | null>(null);
  const visitorInfoRef = useRef<VisitorClientInfo>(FALLBACK_VISITOR);
  const windowsRef = useRef(windows);
  const activeWindowRef = useRef(activeWindow);
  const phaseRef = useRef<NotificationPhase>("hidden");
  const lastActivityRef = useRef(0);
  const lastMousePositionRef = useRef({ x: 0, y: 0 });
  const isShowingRef = useRef(false);
  const onOpenAgentRef = useRef(onOpenAgent);

  windowsRef.current = windows;
  activeWindowRef.current = activeWindow;
  phaseRef.current = phase;
  onOpenAgentRef.current = onOpenAgent;

  const clearDismissTimer = () => {
    if (dismissTimerRef.current !== null) {
      window.clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
  };

  const dismiss = useCallback((markShown = true) => {
    clearDismissTimer();
    if (markShown) {
      markIdleNotificationShown();
    }
    isShowingRef.current = false;
    setPhase("hidden");
  }, []);

  const showNotification = useCallback(
    (body: string) => {
      if (isShowingRef.current || hasShownIdleNotification()) return;

      isShowingRef.current = true;
      markIdleNotificationShown();
      setMessage(body);
      setPhase("visible");

      clearDismissTimer();
      dismissTimerRef.current = window.setTimeout(() => {
        dismiss(false);
      }, AUTO_DISMISS_MS);
    },
    [dismiss],
  );

  useEffect(() => {
    setMounted(true);
    visitorInfoRef.current = {
      ...FALLBACK_VISITOR,
      screenWidth: window.screen?.width ?? 0,
    };

    void detectVisitorClient()
      .then((info) => {
        visitorInfoRef.current = info;
      })
      .catch(() => {
        /* keep fallback */
      });
  }, []);

  useEffect(() => {
    lastActivityRef.current = Date.now();
    lastMousePositionRef.current = { x: -1, y: -1 };

    const markActivity = () => {
      lastActivityRef.current = Date.now();
    };

    const handleMouseMove = (event: globalThis.MouseEvent) => {
      const { x, y } = lastMousePositionRef.current;
      if (x < 0 || y < 0) {
        lastMousePositionRef.current = { x: event.clientX, y: event.clientY };
        return;
      }

      const deltaX = event.clientX - x;
      const deltaY = event.clientY - y;
      const distance = Math.hypot(deltaX, deltaY);

      if (distance < MOUSE_MOVE_THRESHOLD_PX) {
        return;
      }

      lastMousePositionRef.current = { x: event.clientX, y: event.clientY };
      markActivity();
    };

    const tryShow = () => {
      if (hasShownIdleNotification() || phaseRef.current !== "hidden" || isShowingRef.current) {
        return;
      }

      if (
        shouldSkipForAgentSession(activeWindowRef.current, windowsRef.current)
      ) {
        return;
      }

      const openWindows = getOpenWindows(windowsRef.current);
      const body = buildNotificationMessage(openWindows, visitorInfoRef.current);
      showNotification(body);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keydown", markActivity);
    window.addEventListener("click", markActivity);
    window.addEventListener("scroll", markActivity, true);

    const intervalId = window.setInterval(() => {
      if (hasShownIdleNotification()) return;
      if (phaseRef.current !== "hidden" || isShowingRef.current) return;

      const idleForMs = Date.now() - lastActivityRef.current;
      if (idleForMs < IDLE_MS) return;

      tryShow();
    }, IDLE_CHECK_MS);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keydown", markActivity);
      window.removeEventListener("click", markActivity);
      window.removeEventListener("scroll", markActivity, true);
      clearDismissTimer();
    };
  }, [showNotification]);

  const handleBodyClick = () => {
    dismiss(true);
    onOpenAgentRef.current();
  };

  const handleCloseClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    dismiss(true);
  };

  if (!mounted) {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {phase === "visible" ? (
        <motion.div
          key="idle-notification"
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, x: 48 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 48 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="pointer-events-auto fixed right-4 z-[9999] flex max-w-[min(360px,calc(100vw-2rem))] cursor-pointer gap-3 rounded-xl border-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)] p-3 pr-9 shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-[20px]"
          style={{ top: "46px" }}
          onClick={handleBodyClick}
        >
          <NotificationAvatar />
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="text-label text-[11px] font-medium text-[var(--os-text-muted)]">
              Aditya OS
            </p>
            <p className="text-ui mt-0.5 text-[13px] leading-snug text-[var(--os-text)]">
              {message}
            </p>
          </div>
          <button
            type="button"
            onClick={handleCloseClick}
            aria-label="Dismiss notification"
            className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-md text-[var(--os-text-muted)] transition-colors hover:bg-[var(--os-hover)] hover:text-[var(--os-text)]"
          >
            <X size={14} strokeWidth={2} />
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
