import { useEffect, useRef, useState } from "react";
import {
  BarChart3,
  Bot,
  Calculator,
  FileText,
  FolderKanban,
  Settings,
  Terminal,
  User,
} from "lucide-react";
import type { ComponentType } from "react";
import type { WindowType } from "./types";
import { APP_DEFINITIONS } from "@/lib/apps";

type DesktopIconsProps = {
  activeWindow: WindowType;
  onSelect: (window: WindowType) => void;
};

type DesktopIconComponent = ComponentType<{
  className?: string;
  size?: number;
  strokeWidth?: number;
}>;

function GitHubIcon({ className, size = 15, strokeWidth = 1.9 }: {
  className?: string;
  size?: number;
  strokeWidth?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M9 19C4 20.5 4 16.5 2 16M16 22V18.13C16.0375 17.6532 15.9731 17.1739 15.811 16.7238C15.6489 16.2738 15.3929 15.8634 15.06 15.52C18.2 15.17 21.5 13.98 21.5 8.52C21.4997 7.12383 20.9627 5.7812 20 4.77C20.4559 3.54851 20.4236 2.19784 19.91 1C19.91 1 18.73 0.65 16 2.48C13.708 1.85982 11.292 1.85982 9 2.48C6.27 0.65 5.09 1 5.09 1C4.57638 2.19784 4.54414 3.54851 5 4.77C4.03013 5.7887 3.49252 7.14146 3.5 8.55C3.5 13.97 6.8 15.16 9.94 15.55C9.611 15.8909 9.35726 16.2974 9.19531 16.7438C9.03335 17.1902 8.96679 17.6658 9 18.14V22"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const appIcons: Record<WindowType, DesktopIconComponent> = {
  agent: Bot,
  "activity-monitor": BarChart3,
  projects: FolderKanban,
  terminal: Terminal,
  about: User,
  resume: FileText,
  calculator: Calculator,
  settings: Settings,
  github: GitHubIcon,
};

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
    <nav className="flex gap-2 overflow-x-auto pb-1 md:grid md:h-full md:grid-cols-2 md:content-start md:gap-x-3 md:gap-y-4 md:overflow-visible md:pb-0">
      {APP_DEFINITIONS.map((app) => {
        const Icon = appIcons[app.id];
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
            <span className="text-label text-[10px] font-medium leading-tight text-[rgba(255,255,255,0.6)]">
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
