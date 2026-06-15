"use client";

import { useEffect, useState } from "react";
import { Desktop } from "../components/os/Desktop";
import { Dock } from "../components/os/Dock";
import { TopBar } from "../components/os/TopBar";
import type { WallpaperMeta, WindowType } from "../components/os/types";

const windowTitles: Record<WindowType, string> = {
  agent: "Aditya's AI Assistant",
  projects: "projects",
  terminal: "terminal",
  about: "about",
  resume: "Resume",
  calculator: "calculator",
  settings: "settings",
};

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
    isOpen: true,
    isMinimized: false,
    isMaximized: false,
  },
  projects: {
    x: 260,
    y: 120,
    zIndex: 11,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
  },
  terminal: {
    x: 180,
    y: 80,
    zIndex: 12,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
  },
  about: {
    x: 300,
    y: 140,
    zIndex: 13,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
  },
  resume: {
    x: 340,
    y: 160,
    zIndex: 14,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
  },
  calculator: {
    x: 220,
    y: 100,
    zIndex: 15,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
  },
  settings: {
    x: 380,
    y: 180,
    zIndex: 16,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
  },
};

export default function Home() {
  const [activeWindow, setActiveWindow] = useState<WindowType>("agent");
  const [wallpapers, setWallpapers] = useState<WallpaperMeta[]>([]);
  const [wallpaper, setWallpaper] = useState<string>("");
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
    setWindows((previous) => ({
      ...previous,
      [window]: {
        ...previous[window],
        x: position.x,
        y: position.y,
      },
    }));
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

  const closeWindow = (window: WindowType) => {
    setWindows((previous) => ({
      ...previous,
      [window]: {
        ...previous[window],
        isOpen: false,
        isMinimized: false,
        isMaximized: false,
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

  return (
    <main className="flex h-screen overflow-hidden flex-col text-[var(--os-text)]">
      <TopBar />

      <div className="flex flex-1 min-h-0">
        <Desktop
          wallpaper={wallpaper}
          activeWindow={activeWindow}
          windowTitles={windowTitles}
          windows={windows}
          wallpapers={wallpapers}
          selectedWallpaper={wallpaper}
          onSelectWallpaper={setWallpaper}
          onSelectWindow={openWindow}
          onBringToFront={bringToFront}
          onMoveWindow={moveWindow}
          onMinimizeWindow={minimizeWindow}
          onMaximizeWindow={maximizeWindow}
          onCloseWindow={closeWindow}
        />
      </div>

      <Dock />
    </main>
  );
}
