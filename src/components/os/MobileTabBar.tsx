"use client";

import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { APP_ICONS, MOBILE_PRIMARY_TAB_APPS } from "@/lib/app-icons";
import { APP_DEFINITIONS } from "@/lib/apps";
import type { WindowType } from "./types";
import { MobileMoreSheet } from "./MobileMoreSheet";

type MobileTabBarProps = {
  activeWindow: WindowType | null;
  onSelect: (window: WindowType) => void;
};

const primaryApps = MOBILE_PRIMARY_TAB_APPS.map(
  (id) => APP_DEFINITIONS.find((app) => app.id === id)!,
);

const overflowAppIds = APP_DEFINITIONS.filter(
  (app) => !MOBILE_PRIMARY_TAB_APPS.includes(app.id as (typeof MOBILE_PRIMARY_TAB_APPS)[number]),
).map((app) => app.id);

export function MobileTabBar({ activeWindow, onSelect }: MobileTabBarProps) {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const isOverflowActive =
    activeWindow !== null && overflowAppIds.includes(activeWindow);

  const handleSelect = (appId: WindowType) => {
    onSelect(appId);
    setIsMoreOpen(false);
  };

  return (
    <>
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)] pb-[env(safe-area-inset-bottom)] md:hidden"
        aria-label="App navigation"
      >
        <div
          className="flex items-center justify-around px-0.5"
          style={{ height: "var(--mobile-tab-bar-height)" }}
        >
          {primaryApps.map((app) => {
            const Icon = APP_ICONS[app.id];
            const isActive = activeWindow === app.id;

            return (
              <button
                key={app.id}
                type="button"
                onClick={() => handleSelect(app.id)}
                className={`flex min-h-[44px] min-w-[44px] flex-1 flex-col items-center justify-center gap-0.5 rounded-lg px-0.5 py-1 transition-colors duration-150 ${
                  isActive
                    ? "text-[var(--os-text)]"
                    : "text-[var(--os-text-muted)]"
                }`}
                aria-current={isActive ? "page" : undefined}
                aria-label={app.title}
              >
                <span
                  className={`inline-flex h-7 w-7 items-center justify-center rounded-lg border transition-colors duration-150 ${
                    isActive
                      ? "border-[rgba(255,255,255,0.18)] bg-[rgba(255,255,255,0.15)]"
                      : "border-transparent"
                  }`}
                >
                  <Icon
                    size={16}
                    strokeWidth={1.9}
                    className={isActive ? "text-white" : "text-[rgba(255,255,255,0.55)]"}
                  />
                </span>
                <span className="text-label max-w-full truncate text-[9px] font-medium leading-none">
                  {app.title}
                </span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setIsMoreOpen(true)}
            className={`flex min-h-[44px] min-w-[44px] flex-1 flex-col items-center justify-center gap-0.5 rounded-lg px-0.5 py-1 transition-colors duration-150 ${
              isOverflowActive ? "text-[var(--os-text)]" : "text-[var(--os-text-muted)]"
            }`}
            aria-expanded={isMoreOpen}
            aria-haspopup="dialog"
            aria-label="More apps"
          >
            <span
              className={`inline-flex h-7 w-7 items-center justify-center rounded-lg border transition-colors duration-150 ${
                isOverflowActive
                  ? "border-[rgba(255,255,255,0.18)] bg-[rgba(255,255,255,0.15)]"
                  : "border-transparent"
              }`}
            >
              <MoreHorizontal
                size={16}
                strokeWidth={1.9}
                className={isOverflowActive ? "text-white" : "text-[rgba(255,255,255,0.55)]"}
              />
            </span>
            <span className="text-label text-[9px] font-medium leading-none">More</span>
          </button>
        </div>
      </nav>

      <MobileMoreSheet
        isOpen={isMoreOpen}
        onClose={() => setIsMoreOpen(false)}
        activeWindow={activeWindow}
        onSelectApp={handleSelect}
      />
    </>
  );
}
