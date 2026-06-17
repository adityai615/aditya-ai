"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const HAS_LIKED_KEY = "aadios_has_liked";
const TOAST_DURATION_MS = 2400;
const STREAK_WINDOW_MS = 600;
const STREAK_THRESHOLD = 3;
const BURST_EMOJIS = ["✨", "💫", "⭐"] as const;

const monoStyle = { fontFamily: "var(--font-mono, 'SF Mono', monospace)" };

function readHasLikedFlag() {
  if (typeof window === "undefined") {
    return false;
  }
  return window.localStorage.getItem(HAS_LIKED_KEY) === "true";
}

type LikeWidgetProps = {
  className?: string;
};

export function LikeWidget({ className }: LikeWidgetProps) {
  const [count, setCount] = useState<number | null>(null);
  const [hasLiked, setHasLiked] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const heartRef = useRef<HTMLSpanElement>(null);
  const effectsRef = useRef<HTMLDivElement>(null);
  const toastTimerRef = useRef<number | null>(null);
  const clickTimestampsRef = useRef<number[]>([]);

  useEffect(() => {
    setHasLiked(readHasLikedFlag());

    const controller = new AbortController();

    void (async () => {
      try {
        const response = await fetch("/api/likes", { signal: controller.signal });
        if (!response.ok) {
          return;
        }

        const data = (await response.json()) as { count: number };
        setCount(data.count);
      } catch {
        if (!controller.signal.aborted) {
          setCount(0);
        }
      }
    })();

    return () => {
      controller.abort();
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
      toastTimerRef.current = null;
    }, TOAST_DURATION_MS);
  }, []);

  const triggerHeartBounce = useCallback(() => {
    const heart = heartRef.current;
    if (!heart) {
      return;
    }

    heart.classList.remove("like-heart-bounce");
    void heart.offsetWidth;
    heart.classList.add("like-heart-bounce");
  }, []);

  const spawnFloatingPlusOne = useCallback(() => {
    const effects = effectsRef.current;
    const button = buttonRef.current;
    if (!effects || !button) {
      return;
    }

    const jitter = (Math.random() - 0.5) * 30;
    const floater = document.createElement("span");
    floater.textContent = "+1";
    floater.className = "like-float-plus-one";
    floater.style.left = `calc(50% + ${jitter}px)`;
    floater.style.top = "0";
    effects.appendChild(floater);

    window.setTimeout(() => {
      floater.remove();
    }, 900);
  }, []);

  const spawnParticleBurst = useCallback(() => {
    const effects = effectsRef.current;
    if (!effects) {
      return;
    }

    for (let index = 0; index < 5; index += 1) {
      const angle =
        (index / 5) * Math.PI * 2 + (Math.random() - 0.5) * 0.45;
      const distance = 40 + Math.random() * 30;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;
      const emoji =
        BURST_EMOJIS[Math.floor(Math.random() * BURST_EMOJIS.length)];

      const particle = document.createElement("span");
      particle.textContent = emoji;
      particle.className = "like-particle";
      particle.style.setProperty("--tx", `${tx}px`);
      particle.style.setProperty("--ty", `${ty}px`);
      effects.appendChild(particle);

      window.setTimeout(() => {
        particle.remove();
      }, 700);
    }
  }, []);

  const recordTapStreak = useCallback(() => {
    const now = Date.now();
    clickTimestampsRef.current = clickTimestampsRef.current.filter(
      (timestamp) => now - timestamp < STREAK_WINDOW_MS,
    );
    clickTimestampsRef.current.push(now);

    if (clickTimestampsRef.current.length >= STREAK_THRESHOLD) {
      spawnParticleBurst();
    }
  }, [spawnParticleBurst]);

  const playLikeSuccessEffects = useCallback(() => {
    triggerHeartBounce();
    spawnFloatingPlusOne();
    recordTapStreak();
  }, [recordTapStreak, spawnFloatingPlusOne, triggerHeartBounce]);

  const handleLike = () => {
    setCount((previous) => (previous ?? 0) + 1);

    void fetch("/api/likes", { method: "POST" })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Like request failed");
        }

        return (await response.json()) as { count: number; rateLimited: boolean };
      })
      .then((data) => {
        if (data.rateLimited) {
          setCount(data.count);
          showToast("Slow down! Try again tomorrow.");
          return;
        }

        setCount(data.count);

        if (!readHasLikedFlag()) {
          window.localStorage.setItem(HAS_LIKED_KEY, "true");
          setHasLiked(true);
        }

        playLikeSuccessEffects();
      })
      .catch(() => {
        setCount((previous) => Math.max(0, (previous ?? 1) - 1));
      });
  };

  return (
    <div className={`relative ${className ?? ""}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleLike}
        aria-label="Like aditya.os"
        className="relative inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-full border-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)] px-[18px] text-[var(--os-text)] transition-colors hover:bg-[var(--os-hover)]"
      >
        <span
          ref={heartRef}
          className="inline-flex text-[15px] leading-none select-none"
          aria-hidden="true"
        >
          {hasLiked ? "❤️" : "🤍"}
        </span>
        {count === null ? (
          <span
            className="inline-block h-4 w-10 animate-pulse rounded bg-[var(--os-border)]"
            aria-hidden="true"
          />
        ) : (
          <span className="text-label min-w-[2ch] text-[13px] tabular-nums" style={monoStyle}>
            {count.toLocaleString()}
          </span>
        )}

        <div
          ref={effectsRef}
          className="pointer-events-none absolute inset-0 overflow-visible"
          aria-hidden="true"
        />
      </button>

      {toastMessage ? (
        <p
          role="status"
          className="text-label pointer-events-none absolute top-[calc(100%+6px)] right-0 z-50 whitespace-nowrap rounded-md border-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)] px-2.5 py-1 text-[11px] text-[var(--os-text)] shadow-lg"
        >
          {toastMessage}
        </p>
      ) : null}
    </div>
  );
}
