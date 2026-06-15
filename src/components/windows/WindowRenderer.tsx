import { ActivityMonitorWindow } from "./ActivityMonitorWindow";
import { AboutWindow } from "./AboutWindow";
import { AgentWindow } from "./AgentWindow";
import { CalculatorWindow } from "./CalculatorWindow";
import { GithubWindow } from "./GithubWindow";
import { ProjectsWindow } from "./ProjectsWindow";
import { ResumeWindow } from "./ResumeWindow";
import { SettingsWindow } from "./SettingsWindow";
import { TerminalWindow } from "./TerminalWindow";
import type { WallpaperMeta, WindowType } from "../os/types";

type WindowRendererProps = {
  windowType: WindowType;
  wallpapers: WallpaperMeta[];
  selectedWallpaper: string;
  onSelectWallpaper: (wallpaperPath: string) => void;
};

export function WindowRenderer({
  windowType,
  wallpapers,
  selectedWallpaper,
  onSelectWallpaper,
}: WindowRendererProps) {
  const renderers: Record<WindowType, JSX.Element> = {
    agent: <AgentWindow />,
    "activity-monitor": <ActivityMonitorWindow />,
    projects: <ProjectsWindow />,
    terminal: <TerminalWindow />,
    about: <AboutWindow />,
    resume: <ResumeWindow />,
    calculator: <CalculatorWindow />,
    settings: (
      <SettingsWindow
        wallpapers={wallpapers}
        selectedWallpaper={selectedWallpaper}
        onSelectWallpaper={onSelectWallpaper}
      />
    ),
    github: <GithubWindow />,
  };

  return renderers[windowType] ?? <AgentWindow />;
}
