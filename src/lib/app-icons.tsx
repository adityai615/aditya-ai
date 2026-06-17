import {
  Activity,
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
import type { WindowType } from "@/components/os/types";

export type AppIconComponent = ComponentType<{
  className?: string;
  size?: number;
  strokeWidth?: number;
}>;

export function GitHubIcon({
  className,
  size = 15,
  strokeWidth = 1.9,
}: {
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

export function MusicIcon({
  className,
  size = 15,
  strokeWidth = 1.9,
}: {
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
        d="M9 18V5l12-2v13"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth={strokeWidth} />
      <circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth={strokeWidth} />
    </svg>
  );
}

export const APP_ICONS: Record<WindowType, AppIconComponent> = {
  agent: Bot,
  "activity-monitor": BarChart3,
  projects: FolderKanban,
  terminal: Terminal,
  about: User,
  resume: FileText,
  calculator: Calculator,
  settings: Settings,
  github: GitHubIcon,
  uptime: Activity,
  "top-songs": MusicIcon,
};

export const MOBILE_PRIMARY_TAB_APPS = [
  "agent",
  "projects",
  "terminal",
  "about",
] as const satisfies readonly WindowType[];
