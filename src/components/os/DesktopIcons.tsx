import type { WindowType } from "./types";
import { APP_DEFINITIONS } from "@/lib/apps";
import { APP_ICONS } from "@/lib/app-icons";

type DesktopIconsProps = {
  activeWindow: WindowType;
  onSelect: (window: WindowType) => void;
};

export function DesktopIcons({
  activeWindow,
  onSelect,
}: DesktopIconsProps) {
  return (
    <nav className="grid h-full grid-cols-2 content-start gap-x-3 gap-y-4">
      {APP_DEFINITIONS.map((app) => {
        const Icon = APP_ICONS[app.id];
        const isActive = activeWindow === app.id;

        return (
          <button
            key={app.id}
            type="button"
            onClick={() => onSelect(app.id)}
            className={`flex w-[64px] shrink-0 flex-col items-center gap-1.5 rounded-[10px] border p-2 text-center transition-colors duration-150 ${
              isActive
                ? "border-[rgba(255,255,255,0.18)] bg-[rgba(255,255,255,0.15)]"
                : "border-transparent hover:bg-[rgba(255,255,255,0.08)]"
            }`}
            aria-current={isActive ? "page" : undefined}
            aria-label={app.title}
          >
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md">
              <Icon
                size={15}
                strokeWidth={1.9}
                className={
                  isActive
                    ? "text-white"
                    : "text-[rgba(255,255,255,0.5)]"
                }
              />
            </span>
            <span className="text-label w-full text-center text-[10px] font-medium leading-tight break-normal whitespace-normal text-[rgba(255,255,255,0.6)]">
              {app.title}
            </span>
            {isActive ? (
              <span className="h-1 w-1 rounded-full bg-white" aria-hidden="true" />
            ) : (
              <span className="h-1 w-1 rounded-full opacity-0" aria-hidden="true" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
