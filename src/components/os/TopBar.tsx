"use client";

import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";

type TopBarProps = {
  onOpenCommandPalette: () => void;
};

function getIstDateTimeLabel() {
  const now = new Date();
  const datePart = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
  }).format(now);
  const timePart = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(now);

  return `${datePart}, ${timePart} IST`;
}

export function TopBar({ onOpenCommandPalette }: TopBarProps) {
  const [shortcutLabel, setShortcutLabel] = useState("Ctrl+K");
  const [istDateTime, setIstDateTime] = useState(getIstDateTimeLabel);

  useEffect(() => {
    if (navigator.platform.toLowerCase().includes("mac")) {
      setShortcutLabel("⌘K");
    }
  }, []);

  useEffect(() => {
    setIstDateTime(getIstDateTimeLabel());
    const timer = window.setInterval(() => {
      setIstDateTime(getIstDateTimeLabel());
    }, 1000 * 30);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  return (
    <header className="h-[38px] border-b border-[rgba(255,255,255,0.08)] bg-[rgba(0,0,0,0.45)] backdrop-blur-[20px] backdrop-saturate-[180%]">
      <div className="flex h-full items-center justify-between px-4">
        <p className="text-ui text-[14px] font-semibold tracking-[-0.02em] text-[rgba(255,255,255,0.92)]">
          aditya.os
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenCommandPalette}
            aria-label="Open command palette"
            className="text-label rounded border border-[rgba(255,255,255,0.16)] px-2 py-0.5 text-[rgba(255,255,255,0.86)] transition-colors hover:bg-[rgba(255,255,255,0.1)]"
          >
            {shortcutLabel}
          </button>
          <p className="text-label text-[rgba(255,255,255,0.82)]">{istDateTime}</p>
          <ThemeToggle className="text-[rgba(255,255,255,0.9)] hover:bg-[rgba(255,255,255,0.08)]" />
        </div>
      </div>
    </header>
  );
}
