import type { WindowType } from "./types";
import { APP_DEFINITIONS, type AppId } from "@/lib/apps";
import { APP_ICONS } from "@/lib/app-icons";

type DesktopIconsProps = {
  activeWindow: WindowType;
  onSelect: (window: WindowType) => void;
};

// Groups apps by logical category so the sidebar reads as sections,
// not one flat list. Typed against AppId so a typo or renamed id in
// lib/apps.ts fails the build here instead of silently falling
// through to the "ungrouped" bucket below.
// Or better: add a `group` field to APP_DEFINITIONS and replace this
// with a `groupBy(app => app.group)` once that's available.
const ICON_GROUPS: AppId[][] = [
  ["agent", "github"],
  ["projects", "terminal"],
  ["about", "activity-monitor"],
  ["uptime", "resume"],
  ["calculator", "top-songs"],
  ["settings"],
];

export function DesktopIcons({ activeWindow, onSelect }: DesktopIconsProps) {
  const appById = new Map(APP_DEFINITIONS.map((app) => [app.id, app]));

  // Fallback: if a new app gets added to APP_DEFINITIONS but ICON_GROUPS
  // isn't updated, it still renders (in a trailing group) instead of
  // silently disappearing from the sidebar.
  const allGroupedIds = new Set(ICON_GROUPS.flat());
  const ungroupedApps = APP_DEFINITIONS.filter((app) => !allGroupedIds.has(app.id));
  const groups = ungroupedApps.length
    ? [...ICON_GROUPS, ungroupedApps.map((app) => app.id)]
    : ICON_GROUPS;

  return (
    // No scroll: all 11 apps must fit within the sidebar's height.
    // Spacing/icon size use clamp() so they shrink slightly on short
    // viewports instead of overflowing — a fluid safety net rather
    // than a hard cutoff or a scrollbar.
    <nav className="os-sidebar-nav flex h-full flex-col justify-between py-1">
      {groups.map((groupIds, groupIndex) => {
        const apps = groupIds.map((id) => appById.get(id)).filter(Boolean);
        if (!apps.length) return null;

        return (
          <div key={groupIndex} className="flex flex-col" style={{ gap: "clamp(1px, 0.4vh, 4px)" }}>
            {groupIndex > 0 ? (
              <div
                className="mx-2 bg-[rgba(255,255,255,0.08)]"
                style={{ height: "1px", margin: "clamp(2px, 0.6vh, 6px) 8px" }}
                aria-hidden="true"
              />
            ) : null}

            {apps.map((app) => {
              if (!app) return null;
              const Icon = APP_ICONS[app.id];
              const isActive = activeWindow === app.id;

              return (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => onSelect(app.id)}
                  className={`group relative flex w-[72px] shrink-0 flex-col items-center rounded-[10px] px-2 text-center transition-colors duration-150 ${
                    isActive
                      ? "bg-[rgba(255,255,255,0.12)]"
                      : "hover:bg-[rgba(255,255,255,0.06)]"
                  }`}
                  style={{
                    paddingTop: "clamp(5px, 1vh, 10px)",
                    paddingBottom: "clamp(5px, 1vh, 10px)",
                    gap: "clamp(1px, 0.4vh, 6px)",
                  }}
                  aria-current={isActive ? "page" : undefined}
                  aria-label={app.title}
                >
                  {/* left accent bar replaces the boxed border for active state */}
                  <span
                    className={`absolute left-0 top-1/2 h-[16px] w-[3px] -translate-y-1/2 rounded-full bg-white transition-opacity duration-150 ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                    aria-hidden="true"
                  />

                  <Icon
                    size={17}
                    strokeWidth={1.8}
                    className={
                      isActive
                        ? "text-white"
                        : "text-[rgba(255,255,255,0.5)] transition-colors duration-150 group-hover:text-[rgba(255,255,255,0.75)]"
                    }
                  />

                  <span
                    className={`text-[9.5px] font-medium leading-tight ${
                      isActive
                        ? "text-white"
                        : "text-[rgba(255,255,255,0.55)] transition-colors duration-150 group-hover:text-[rgba(255,255,255,0.8)]"
                    }`}
                  >
                    {app.title}
                  </span>
                </button>
              );
            })}
          </div>
        );
      })}
    </nav>
  );
}