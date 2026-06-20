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

// Shared divider used between cluster items — kept as a constant so
// the spacing/opacity stays in sync if you tweak it later.
function ClusterDivider() {
  return (
    <span
      className="h-[14px] w-px shrink-0 bg-[rgba(255,255,255,0.1)]"
      aria-hidden="true"
    />
  );
}

export function TopBar({ onOpenCommandPalette }: TopBarProps) {
  const [shortcutLabel, setShortcutLabel] = useState("Ctrl+K");
  const [istDateTime, setIstDateTime] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.platform.toLowerCase().includes("mac")) {
      setShortcutLabel("⌘K");
    }
  }, []);

  useEffect(() => {
    const updateDateTime = () => {
      setIstDateTime(getIstDateTimeLabel());
    };

    updateDateTime();
    const timer = window.setInterval(updateDateTime, 1000 * 30);

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

        <div className="flex items-center justify-end gap-1.5 md:gap-0">
          {/* Mobile-only search trigger stays standalone since the
              unified cluster below is desktop-only (md:flex) */}
          <button
            type="button"
            onClick={onOpenCommandPalette}
            aria-label="Search apps"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-[rgba(255,255,255,0.9)] transition-colors hover:bg-[rgba(255,255,255,0.1)] md:hidden"
          >
            <Search size={18} strokeWidth={1.75} />
          </button>
          <p className="text-label text-[11px] text-[rgba(255,255,255,0.82)] sm:hidden">
            {istDateTime?.split(", ").pop() ?? "\u00a0"}
          </p>
          <ThemeToggle className="inline-flex h-11 w-11 rounded-md text-[rgba(255,255,255,0.9)] hover:bg-[rgba(255,255,255,0.08)] md:hidden" />

          {/* Unified desktop cluster: like count, shortcut hint, clock,
              theme toggle — one container, shared hairline dividers,
              instead of four independently bordered elements. */}
          <div className="hidden h-7 items-center overflow-hidden rounded-[7px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.05)] md:flex">
            <LikeWidget variant="bare" className="h-full" />

            <ClusterDivider />

            <button
              type="button"
              onClick={onOpenCommandPalette}
              aria-label="Open command palette"
              className="text-label flex h-full items-center px-2.5 text-[rgba(255,255,255,0.7)] transition-colors hover:bg-[rgba(255,255,255,0.08)] hover:text-[rgba(255,255,255,0.92)]"
            >
              {shortcutLabel}
            </button>

            <ClusterDivider />

            <p className="text-label whitespace-nowrap px-2.5 text-[11px] text-[rgba(255,255,255,0.7)]">
              {istDateTime ?? "\u00a0"}
            </p>

            <ClusterDivider />

            <ThemeToggle className="inline-flex h-7 w-9 items-center justify-center rounded-r-[6px] text-[rgba(255,255,255,0.85)] transition-colors hover:bg-[rgba(255,255,255,0.08)]" />
          </div>
        </div>
      </div>
    </header>
  );
}