"use client";

import { useEffect, useRef } from "react";
import { APP_ICONS, MOBILE_PRIMARY_TAB_APPS } from "@/lib/app-icons";
import { APP_DEFINITIONS } from "@/lib/apps";
import { SOCIAL_LINKS } from "@/lib/social-links";
import type { WindowType } from "./types";
import { LikeWidget } from "./LikeWidget";

type MobileMoreSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  activeWindow: WindowType | null;
  onSelectApp: (window: WindowType) => void;
};

const overflowApps = APP_DEFINITIONS.filter(
  (app) => !MOBILE_PRIMARY_TAB_APPS.includes(app.id as (typeof MOBILE_PRIMARY_TAB_APPS)[number]),
);

export function MobileMoreSheet({
  isOpen,
  onClose,
  activeWindow,
  onSelectApp,
}: MobileMoreSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="More apps and links"
      className="fixed inset-0 z-50 flex items-end bg-[rgba(0,0,0,0.35)] md:hidden"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={sheetRef}
        className="w-full rounded-t-xl border-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)] pb-[env(safe-area-inset-bottom)]"
      >
        <div className="flex justify-center py-2">
          <span className="h-1 w-10 rounded-full bg-[var(--os-border)]" aria-hidden="true" />
        </div>

        <div className="max-h-[70dvh] overflow-y-auto px-3 pb-4">
          <p className="text-label mb-2 px-1 text-[var(--os-text-muted)]">Apps</p>
          <div className="grid grid-cols-4 gap-2">
            {overflowApps.map((app) => {
              const Icon = APP_ICONS[app.id];
              const isActive = activeWindow === app.id;

              return (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => onSelectApp(app.id)}
                  className={`flex min-h-[72px] flex-col items-center justify-center gap-1.5 rounded-[10px] border p-2 transition-colors duration-150 ${
                    isActive
                      ? "border-[rgba(255,255,255,0.18)] bg-[rgba(255,255,255,0.15)]"
                      : "border-transparent hover:bg-[rgba(255,255,255,0.08)]"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon
                    size={18}
                    strokeWidth={1.9}
                    className={isActive ? "text-white" : "text-[rgba(255,255,255,0.55)]"}
                  />
                  <span className="text-label text-center text-[10px] font-medium leading-tight">
                    {app.title}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="text-label mb-2 mt-4 px-1 text-[var(--os-text-muted)]">Connect</p>
          <div className="flex items-center gap-1 px-1">
            {SOCIAL_LINKS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-[var(--os-text)] transition-colors hover:bg-[var(--os-hover)]"
              >
                {item.icon}
              </a>
            ))}
          </div>

          <div className="mt-4 flex justify-center px-1">
            <LikeWidget />
          </div>
        </div>
      </div>
    </div>
  );
}
