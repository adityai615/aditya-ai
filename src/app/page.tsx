"use client";

import { useEffect, useState } from "react";
import { APP_DEFINITIONS } from "@/lib/apps";
import { CommandPalette } from "../components/os/CommandPalette";
import { Desktop } from "../components/os/Desktop";
import { IdleNotification } from "../components/os/IdleNotification";
import { TopBar } from "../components/os/TopBar";
import type { WallpaperMeta, WindowType } from "../components/os/types";

const windowTitles: Record<WindowType, string> = {
  agent: "Aditya's AI Assistant",
  uptime: "uptime.sys",
  "top-songs": "Top 50 — India",
  ...Object.fromEntries(
    APP_DEFINITIONS.filter(
      (app) => app.id !== "agent" && app.id !== "uptime" && app.id !== "top-songs",
    ).map((app) => [app.id, app.title]),
  ),
} as Record<WindowType, string>;

const STORAGE_KEY = "aditya-os-wallpaper";

type WindowFrameState = {
  x: number;
  y: number;
  zIndex: number;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
};

const initialWindowFrames: Record<WindowType, WindowFrameState> = {
  agent: {
    x: 140,
    y: 60,
    zIndex: 10,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
  },
  github: {
    x: 220,
    y: 90,
    zIndex: 11,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
  },
  "activity-monitor": {
    x: 250,
    y: 110,
    zIndex: 12,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
  },
  projects: {
    x: 260,
    y: 120,
    zIndex: 13,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
  },
  terminal: {
    x: 180,
    y: 80,
    zIndex: 14,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
  },
  about: {
    x: 300,
    y: 140,
    zIndex: 15,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
  },
  resume: {
    x: 340,
    y: 160,
    zIndex: 16,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
  },
  calculator: {
    x: 220,
    y: 100,
    zIndex: 17,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
  },
  settings: {
    x: 380,
    y: 180,
    zIndex: 18,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
  },
  uptime: {
    x: 280,
    y: 130,
    zIndex: 19,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
  },
  "top-songs": {
    x: 300,
    y: 100,
    zIndex: 20,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
  },
};

export default function Home() {
  const [activeWindow, setActiveWindow] = useState<WindowType>("agent");
  const [wallpapers, setWallpapers] = useState<WallpaperMeta[]>([]);
  const [wallpaper, setWallpaper] = useState<string>("");
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [mobileHomeActive, setMobileHomeActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [windows, setWindows] =
    useState<Record<WindowType, WindowFrameState>>(initialWindowFrames);

  const openWindow = (window: WindowType) => {
    setWindows((previous) => {
      const highestZ = Math.max(...Object.values(previous).map((item) => item.zIndex));
      return {
        ...previous,
        [window]: {
          ...previous[window],
          isOpen: true,
          isMinimized: false,
          zIndex: highestZ + 1,
        },
      };
    });
    setActiveWindow(window);
  };

  const openWindowForShell = (window: WindowType) => {
    openWindow(window);
    if (isMobile) {
      setMobileHomeActive(false);
    }
  };

  const closeWindowForShell = (window: WindowType) => {
    setWindows((previous) => ({
      ...previous,
      [window]: {
        ...previous[window],
        isOpen: false,
        isMinimized: false,
        isMaximized: false,
      },
    }));
    if (isMobile) {
      setMobileHomeActive(true);
    }
  };

  const bringToFront = (window: WindowType) => {
    setWindows((previous) => {
      const highestZ = Math.max(...Object.values(previous).map((item) => item.zIndex));
      if (previous[window].zIndex === highestZ) {
        return previous;
      }

      return {
        ...previous,
        [window]: {
          ...previous[window],
          zIndex: highestZ + 1,
        },
      };
    });
    setActiveWindow(window);
  };

  const moveWindow = (window: WindowType, position: { x: number; y: number }) => {
    setWindows((previous) => {
      const current = previous[window];
      if (current.x === position.x && current.y === position.y) {
        return previous;
      }

      return {
        ...previous,
        [window]: {
          ...current,
          x: position.x,
          y: position.y,
        },
      };
    });
  };

  const minimizeWindow = (window: WindowType) => {
    setWindows((previous) => ({
      ...previous,
      [window]: {
        ...previous[window],
        isMinimized: true,
      },
    }));
  };

  const maximizeWindow = (window: WindowType) => {
    bringToFront(window);
    setWindows((previous) => ({
      ...previous,
      [window]: {
        ...previous[window],
        isMaximized: !previous[window].isMaximized,
      },
    }));
  };

  useEffect(() => {
    let cancelled = false;

    const loadWallpapers = async () => {
      const response = await fetch("/api/wallpapers");
      const data = (await response.json()) as { wallpapers: WallpaperMeta[] };
      if (!cancelled) {
        setWallpapers(data.wallpapers);
        const savedWallpaper = window.localStorage.getItem(STORAGE_KEY);
        const savedIsValid = data.wallpapers.some(
          (item) => item.path === savedWallpaper,
        );
        const initialWallpaper = savedIsValid
          ? savedWallpaper ?? data.wallpapers[0]?.path ?? ""
          : data.wallpapers[0]?.path ?? "";
        setWallpaper(initialWallpaper);
      }
    };

    loadWallpapers();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!wallpaper) return;
    window.localStorage.setItem(STORAGE_KEY, wallpaper);
  }, [wallpaper]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const syncMobileLayout = () => {
      const mobile = mediaQuery.matches;
      setIsMobile(mobile);
      if (mobile) {
        setMobileHomeActive(true);
        setWindows((previous) => ({
          ...previous,
          agent: {
            ...previous.agent,
            isOpen: false,
          },
        }));
      } else {
        setMobileHomeActive(false);
      }
    };

    syncMobileLayout();
    mediaQuery.addEventListener("change", syncMobileLayout);
    return () => mediaQuery.removeEventListener("change", syncMobileLayout);
  }, []);

  return (
    <main className="flex h-dvh overflow-hidden flex-col text-[var(--os-text)] md:h-screen">
      <TopBar onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />
      <IdleNotification
        activeWindow={activeWindow}
        windows={windows}
        onOpenAgent={() => openWindowForShell("agent")}
      />

      <div className="flex flex-1 min-h-0">
        <Desktop
          wallpaper={wallpaper}
          activeWindow={activeWindow}
          mobileHomeActive={mobileHomeActive}
          windowTitles={windowTitles}
          windows={windows}
          wallpapers={wallpapers}
          selectedWallpaper={wallpaper}
          onSelectWallpaper={setWallpaper}
          onSelectWindow={openWindowForShell}
          onBringToFront={bringToFront}
          onMoveWindow={moveWindow}
          onMinimizeWindow={minimizeWindow}
          onMaximizeWindow={maximizeWindow}
          onCloseWindow={closeWindowForShell}
        />
      </div>

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onOpenChange={setIsCommandPaletteOpen}
        onSelectApp={openWindowForShell}
      />
    </main>
  );
}
