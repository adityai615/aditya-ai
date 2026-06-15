import { AboutWindow } from "./AboutWindow";
import { AgentWindow } from "./AgentWindow";
import { CalculatorWindow } from "./CalculatorWindow";
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
  switch (windowType) {
    case "projects":
      return <ProjectsWindow />;
    case "terminal":
      return <TerminalWindow />;
    case "about":
      return <AboutWindow />;
    case "resume":
      return <ResumeWindow />;
    case "calculator":
      return <CalculatorWindow />;
    case "settings":
      return (
        <SettingsWindow
          wallpapers={wallpapers}
          selectedWallpaper={selectedWallpaper}
          onSelectWallpaper={onSelectWallpaper}
        />
      );
    case "agent":
    default:
      return <AgentWindow />;
  }
}
