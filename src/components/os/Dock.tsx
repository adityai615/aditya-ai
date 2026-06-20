"use client";

import type { WindowType } from "./types";
import { APP_DEFINITIONS, type AppId } from "@/lib/apps";
import { APP_ICONS } from "@/lib/app-icons";

type DockProps = {
  activeWindow: WindowType;
  onSelect: (window: WindowType) => void;
  isHidden?: boolean;
};

// Groups apps with a divider between each group, same logical grouping
// as the old sidebar — just laid out horizontally now.
const DOCK_GROUPS: AppId[][] = [
  ["agent", "github"],
  ["projects", "terminal"],
  ["about", "activity-monitor"],
  ["uptime", "resume"],
  ["calculator", "top-songs"],
  ["settings"],
];

const ICON_SIZE = 46;

export function Dock({ activeWindow, onSelect, isHidden = false }: DockProps) {
  const appById = new Map(APP_DEFINITIONS.map((app) => [app.id, app]));
  const allGroupedIds = new Set(DOCK_GROUPS.flat());
  const ungroupedApps = APP_DEFINITIONS.filter((app) => !allGroupedIds.has(app.id));
  const groups = ungroupedApps.length
    ? [...DOCK_GROUPS, ungroupedApps.map((app) => app.id)]
    : DOCK_GROUPS;

  return (
    <div
      className={`pointer-events-none absolute inset-x-0 bottom-0 z-40 hidden justify-center pb-5 transition-[opacity,transform] duration-300 ease-out md:flex ${
        isHidden ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"
      }`}
      // Fully remove from the tab/click order while hidden, even though
      // it stays mounted (mounted = no re-animate-in flicker on restore).
      aria-hidden={isHidden}
      inert={isHidden ? true : undefined}
    >
      {/* Soft ambient shadow puddle beneath the dock — sells the "floating
          glass object catching light" feel rather than a flat bar pasted on. */}
      <div
        className="pointer-events-none absolute bottom-1 h-6 w-[78%] max-w-[640px] rounded-full opacity-60 blur-2xl"
        style={{ background: "radial-gradient(ellipse, rgba(0,0,0,0.55) 0%, transparent 75%)" }}
        aria-hidden="true"
      />

      <div
        className="pointer-events-auto relative flex items-end gap-2 rounded-[24px] px-4 pb-3 pt-3"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%), rgba(20,28,34,0.32)",
          border: "1px solid rgba(255,255,255,0.14)",
          boxShadow:
            "0 20px 50px rgba(0,0,0,0.45), 0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.16), inset 0 0 0 1px rgba(0,0,0,0.1)",
          backdropFilter: "blur(20px) saturate(220%)",
          WebkitBackdropFilter: "blur(20px) saturate(220%)",
        }}
      >
        {groups.map((groupIds, groupIndex) => {
          const apps = groupIds.map((id) => appById.get(id)).filter(Boolean);
          if (!apps.length) return null;

          return (
            <div key={groupIndex} className="flex items-end gap-2">
              {groupIndex > 0 ? (
                <span
                  className="mx-1.5 mb-2.5 h-9 w-px self-end"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent, rgba(255,255,255,0.16) 30%, rgba(255,255,255,0.16) 70%, transparent)",
                  }}
                  aria-hidden="true"
                />
              ) : null}

              {apps.map((app) => {
                if (!app) return null;
                const Icon = APP_ICONS[app.id];
                const isActive = activeWindow === app.id;

                return (
                  <div key={app.id} className="group/icon relative flex flex-col items-center">
                    {/* tooltip — fixed gap above the icon's resting position,
                        independent of any hover transform so it never jitters
                        or drifts as the icon lifts. */}
                    <span
                      className="pointer-events-none absolute bottom-[calc(100%+16px)] left-1/2 z-10 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-[7px] px-2.5 py-[5px] text-[11.5px] font-medium text-white opacity-0 shadow-[0_8px_20px_rgba(0,0,0,0.45)] transition-[opacity,transform] duration-150 ease-out delay-100 group-hover/icon:translate-y-0 group-hover/icon:opacity-100"
                      style={{
                        background: "rgba(28,30,36,0.96)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        backdropFilter: "blur(12px)",
                      }}
                    >
                      {app.title}
                      <span
                        className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45"
                        style={{
                          background: "rgba(28,30,36,0.96)",
                          borderRight: "1px solid rgba(255,255,255,0.12)",
                          borderBottom: "1px solid rgba(255,255,255,0.12)",
                        }}
                        aria-hidden="true"
                      />
                    </span>

                    <button
                      type="button"
                      onClick={() => onSelect(app.id)}
                      aria-label={app.title}
                      aria-current={isActive ? "page" : undefined}
                      className="relative flex items-center justify-center rounded-[15px] transition-transform duration-200 ease-out will-change-transform hover:-translate-y-1.5 hover:scale-[1.08] active:scale-[1.02]"
                      style={{
                        width: ICON_SIZE,
                        height: ICON_SIZE,
                        background: isActive
                          ? "linear-gradient(180deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.10) 100%)"
                          : "linear-gradient(180deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.02) 100%)",
                        boxShadow: isActive
                          ? "0 6px 16px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.3), inset 0 0 0 1px rgba(255,255,255,0.08)"
                          : "0 4px 10px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.14)",
                      }}
                    >
                      <Icon
                        size={20}
                        strokeWidth={1.7}
                        className={isActive ? "text-white" : "text-[rgba(255,255,255,0.88)]"}
                      />
                    </button>

                    {/* running indicator dot */}
                    <span
                      className="mt-1.5 h-[4px] w-[4px] rounded-full transition-all duration-200"
                      style={{
                        background: isActive ? "#ffffff" : "transparent",
                        boxShadow: isActive ? "0 0 6px rgba(255,255,255,0.7)" : "none",
                      }}
                      aria-hidden="true"
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}