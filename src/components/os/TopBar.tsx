"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { SOCIAL_LINKS } from "@/lib/social-links";
import { LikeWidget } from "./LikeWidget";
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
    <header className="h-11 shrink-0 border-b border-[rgba(255,255,255,0.08)] bg-[rgba(0,0,0,0.45)] backdrop-blur-[20px] backdrop-saturate-[180%] md:h-[38px]">
      <div className="flex h-full items-center justify-between px-3 md:grid md:grid-cols-[1fr_auto_1fr] md:px-4">
        <p className="text-ui text-[14px] font-semibold tracking-[-0.02em] text-[rgba(255,255,255,0.92)]">
          aditya.os
        </p>

        <nav className="hidden items-center gap-0.5 md:flex" aria-label="Social links">
          {SOCIAL_LINKS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.label}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[rgba(255,255,255,0.72)] transition-colors hover:bg-[rgba(255,255,255,0.1)] hover:text-[rgba(255,255,255,0.95)]"
            >
              {item.icon}
            </a>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-1.5 md:gap-2">
          <div className="hidden md:block">
            <LikeWidget />
          </div>
          <button
            type="button"
            onClick={onOpenCommandPalette}
            aria-label="Open command palette"
            className="text-label hidden rounded border border-[rgba(255,255,255,0.16)] px-2 py-0.5 text-[rgba(255,255,255,0.86)] transition-colors hover:bg-[rgba(255,255,255,0.1)] md:inline-flex"
          >
            {shortcutLabel}
          </button>
          <button
            type="button"
            onClick={onOpenCommandPalette}
            aria-label="Search apps"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-[rgba(255,255,255,0.9)] transition-colors hover:bg-[rgba(255,255,255,0.1)] md:hidden"
          >
            <Search size={18} strokeWidth={1.75} />
          </button>
          <p className="text-label hidden text-[11px] text-[rgba(255,255,255,0.82)] sm:block md:text-[length:inherit]">
            {istDateTime}
          </p>
          <p className="text-label text-[11px] text-[rgba(255,255,255,0.82)] sm:hidden">
            {istDateTime.split(", ").pop()}
          </p>
          <ThemeToggle className="h-11 w-11 text-[rgba(255,255,255,0.9)] hover:bg-[rgba(255,255,255,0.08)] md:h-7 md:w-7" />
        </div>
      </div>
    </header>
  );
}
