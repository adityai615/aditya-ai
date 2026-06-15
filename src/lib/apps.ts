export const APP_DEFINITIONS = [
  {
    id: "agent",
    title: "AdityaAI",
    paletteIcon: "🤖",
    aliases: ["ai", "assistant", "agent"],
  },
  {
    id: "projects",
    title: "Projects",
    paletteIcon: "📁",
    aliases: ["projects", "work", "portfolio"],
  },
  {
    id: "terminal",
    title: "Terminal",
    paletteIcon: ">_",
    aliases: ["term", "terminal", "shell", "cli"],
  },
  {
    id: "about",
    title: "About",
    paletteIcon: "👤",
    aliases: ["about", "bio", "profile"],
  },
  {
    id: "github",
    title: "GitHub",
    paletteIcon: "🐙",
    aliases: ["github", "gh", "repos", "repositories"],
  },
  {
    id: "activity-monitor",
    title: "Activity Monitor",
    paletteIcon: "📊",
    aliases: ["activity", "monitor", "activity monitor", "stats", "performance"],
  },
  {
    id: "resume",
    title: "Resume",
    paletteIcon: "📄",
    aliases: ["resume", "cv"],
  },
  {
    id: "calculator",
    title: "Calculator",
    paletteIcon: "🧮",
    aliases: ["calculator", "calc"],
  },
  {
    id: "settings",
    title: "Settings",
    paletteIcon: "⚙️",
    aliases: ["settings", "preferences", "theme"],
  },

] as const;

export type AppId = (typeof APP_DEFINITIONS)[number]["id"];

