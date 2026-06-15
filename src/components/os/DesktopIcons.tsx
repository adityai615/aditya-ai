import { useEffect, useRef, useState } from "react";
import {
  Bot,
  Calculator,
  FileText,
  FolderKanban,
  Settings,
  Terminal,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { WindowType } from "./types";

type DesktopIconsProps = {
  activeWindow: WindowType;
  onSelect: (window: WindowType) => void;
};

const desktopApps: Array<{ id: WindowType; label: string; icon: LucideIcon }> = [
  { id: "agent", label: "AI Agent", icon: Bot },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "terminal", label: "Terminal", icon: Terminal },
  { id: "about", label: "About", icon: User },
  { id: "resume", label: "Resume", icon: FileText },
  { id: "calculator", label: "Calculator", icon: Calculator },
  { id: "settings", label: "Settings", icon: Settings },
];

export function DesktopIcons({
  activeWindow,
  onSelect,
}: DesktopIconsProps) {
  const [selectedIcon, setSelectedIcon] = useState<WindowType>(activeWindow);
  const lastTapRef = useRef<{ appId: WindowType; time: number } | null>(null);

  useEffect(() => {
    setSelectedIcon(activeWindow);
  }, [activeWindow]);

  const handleIconPress = (appId: WindowType) => {
    const now = Date.now();
    const lastTap = lastTapRef.current;
    const isDoubleTap = Boolean(
      lastTap && lastTap.appId === appId && now - lastTap.time <= 320,
    );

    setSelectedIcon(appId);

    if (isDoubleTap) {
      onSelect(appId);
      lastTapRef.current = null;
      return;
    }

    lastTapRef.current = { appId, time: now };
  };

  return (
    <nav className="flex gap-2 overflow-x-auto pb-1 md:grid md:h-full md:auto-cols-[64px] md:grid-flow-col md:grid-rows-4 md:content-start md:gap-x-3 md:gap-y-4 md:overflow-visible md:pb-0">
      {desktopApps.map((app) => {
        const Icon = app.icon;
        const isActive = selectedIcon === app.id;

        return (
          <button
            key={app.id}
            type="button"
            onClick={() => handleIconPress(app.id)}
            className={`flex w-[64px] shrink-0 flex-col items-center gap-1.5 rounded-[10px] border p-2 text-center transition-colors duration-150 ${
              isActive
                ? "border-[rgba(255,255,255,0.18)] bg-[rgba(255,255,255,0.15)]"
                : "border-transparent hover:bg-[rgba(255,255,255,0.08)]"
            }`}
            aria-current={isActive ? "page" : undefined}
            aria-label={app.label}
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
            <span className="text-label text-[10px] font-medium leading-tight text-[rgba(255,255,255,0.6)]">
              {app.label}
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
