"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { APP_DEFINITIONS } from "@/lib/apps";
import type { WindowType } from "./types";

type CommandPaletteProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSelectApp: (windowType: WindowType) => void;
};

function matchesQuery(query: string, title: string, aliases: readonly string[]) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return true;
  }

  if (title.toLowerCase().includes(normalizedQuery)) {
    return true;
  }

  return aliases.some((alias) => alias.toLowerCase().includes(normalizedQuery));
}

export function CommandPalette({ isOpen, onOpenChange, onSelectApp }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const paletteRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredApps = useMemo(
    () =>
      APP_DEFINITIONS.filter((app) =>
        matchesQuery(query, app.title, app.aliases),
      ),
    [query],
  );

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen]);

  useEffect(() => {
    const handleGlobalShortcut = (event: KeyboardEvent) => {
      const isOpenShortcut =
        (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k";

      if (!isOpenShortcut) return;
      event.preventDefault();
      onOpenChange(!isOpen);
    };

    window.addEventListener("keydown", handleGlobalShortcut);
    return () => {
      window.removeEventListener("keydown", handleGlobalShortcut);
    };
  }, [isOpen, onOpenChange]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onOpenChange(false);
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        if (filteredApps.length === 0) return;
        setActiveIndex((previous) => (previous + 1) % filteredApps.length);
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        if (filteredApps.length === 0) return;
        setActiveIndex(
          (previous) => (previous - 1 + filteredApps.length) % filteredApps.length,
        );
        return;
      }

      if (event.key === "Enter") {
        const selected = filteredApps[activeIndex];
        if (!selected) return;
        event.preventDefault();
        onSelectApp(selected.id);
        onOpenChange(false);
        return;
      }

      if (event.key === "Tab") {
        const container = paletteRef.current;
        if (!container) return;

        const focusable = container.querySelectorAll<HTMLElement>(
          'input, button, [href], [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        } else if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, filteredApps, isOpen, onOpenChange, onSelectApp]);

  useEffect(() => {
    if (activeIndex < filteredApps.length) return;
    setActiveIndex(0);
  }, [activeIndex, filteredApps.length]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onOpenChange(false);
        }
      }}
      className="fixed inset-0 z-[60] flex items-end justify-center bg-[rgba(0,0,0,0.08)] p-0 pt-0 dark:bg-[rgba(0,0,0,0.35)] sm:items-start sm:p-4 sm:pt-[10vh]"
    >
      <div
        ref={paletteRef}
        className="w-full rounded-t-xl border-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)] sm:w-[700px] sm:max-w-[90vw] sm:rounded-xl"
      >
        <div className="border-b-[0.5px] border-[var(--os-border)] p-3 sm:p-4">
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search apps..."
            aria-label="Search applications"
            className="text-ui w-full bg-transparent text-[15px] text-[var(--os-text)] outline-none placeholder:text-[var(--os-text-muted)]"
          />
        </div>

        <div className="max-h-[56vh] overflow-y-auto p-2">
          {filteredApps.length === 0 ? (
            <p className="text-ui rounded-md px-3 py-3 text-[var(--os-text-muted)]">
              No matching applications found.
            </p>
          ) : (
            filteredApps.map((app, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={app.id}
                  type="button"
                  onMouseMove={() => setActiveIndex(index)}
                  onClick={() => {
                    onSelectApp(app.id);
                    onOpenChange(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-md border px-3 py-2 text-left transition-colors ${
                    isActive
                      ? "border-[var(--os-border)] bg-[var(--os-hover)]"
                      : "border-transparent hover:bg-[var(--os-hover)]"
                  }`}
                >
                  <span className="text-ui flex items-center gap-3 text-[var(--os-text)]">
                    <span aria-hidden="true">{app.paletteIcon}</span>
                    <span>{app.title}</span>
                  </span>
                </button>
              );
            })
          )}
        </div>

        <footer className="hidden border-t-[0.5px] border-[var(--os-border)] px-3 py-2 sm:block">
          <p className="text-label text-[var(--os-text-muted)]">↑↓ navigate · enter open · esc close</p>
        </footer>
      </div>
    </div>
  );
}

