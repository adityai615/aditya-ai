export const APP_DEFINITIONS = [
  {
    id: "agent",
    title: "Agent",
    paletteIcon: "🤖",
    aliases: ["ai", "assistant", "agent", "adityaai", "chat"],
  },
  {
    id: "github",
    title: "GitHub",
    paletteIcon: "🐙",
    aliases: ["github", "gh", "repos", "repositories"],
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
    id: "top-songs",
    title: "Spotify",
    paletteIcon: "🎵",
    aliases: ["top songs", "spotify", "music", "chart", "top 50", "india"],
  },  
  {
    id: "settings",
    title: "Settings",
    paletteIcon: "⚙️",
    aliases: ["settings", "preferences", "theme"],
  },

] as const;

export type AppId = (typeof APP_DEFINITIONS)[number]["id"];

