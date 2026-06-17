export const APP_DEFINITIONS = [
  {
    id: "agent",
    title: "Agent",
    paletteIcon: "🤖",
    aliases: ["ai", "assistant", "agent", "adityaai", "chat"],
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
    title: "Monitor",
    paletteIcon: "📊",
    aliases: ["activity", "monitor", "activity monitor", "stats", "performance"],
  },
  {
    id: "uptime",
    title: "Uptime",
    paletteIcon: "⏱️",
    aliases: ["uptime", "boot", "running", "since"],
  },
  {
    id: "resume",
    title: "Resume",
    paletteIcon: "📄",
    aliases: ["resume", "cv"],
  },
  {
    id: "calculator",
    title: "Calc",
    paletteIcon: "🧮",
    aliases: ["calculator", "calc"],
  },
  {
    id: "settings",
    title: "Settings",
    paletteIcon: "⚙️",
    aliases: ["settings", "preferences", "theme"],
  },
  {
    id: "top-songs",
    title: "Spotify",
    paletteIcon: "🎵",
    aliases: ["top songs", "spotify", "music", "chart", "top 50", "india"],
  },

] as const;

export type AppId = (typeof APP_DEFINITIONS)[number]["id"];

