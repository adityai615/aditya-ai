import { useEffect, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent, ReactNode } from "react";
import { getAgentSessionSnapshot, subscribeAgentSession } from "@/lib/agent-session";
import { DesktopIcons } from "./DesktopIcons";
import { MobileHome } from "./MobileHome";
import { MobileTabBar } from "./MobileTabBar";
import type { WindowType } from "./types";
import { WindowRenderer } from "../windows/WindowRenderer";
import type { WallpaperMeta } from "./types";
import { Window } from "./Window";
import { ChevronLeft, ChevronRight } from "lucide-react";

type DesktopProps = {
  wallpaper: string;
  activeWindow: WindowType;
  mobileHomeActive: boolean;
  windowTitles: Record<WindowType, string>;
  windows: Record<
    WindowType,
    {
      x: number;
      y: number;
      zIndex: number;
      isOpen: boolean;
      isMinimized: boolean;
      isMaximized: boolean;
    }
  >;
  wallpapers: WallpaperMeta[];
  selectedWallpaper: string;
  onSelectWallpaper: (wallpaperPath: string) => void;
  onSelectWindow: (window: WindowType) => void;
  onBringToFront: (window: WindowType) => void;
  onMoveWindow: (window: WindowType, position: { x: number; y: number }) => void;
  onMinimizeWindow: (window: WindowType) => void;
  onMaximizeWindow: (window: WindowType) => void;
  onCloseWindow: (window: WindowType) => void;
};

export function Desktop({
  wallpaper,
  activeWindow,
  mobileHomeActive,
  windowTitles,
  windows,
  wallpapers,
  selectedWallpaper,
  onSelectWallpaper,
  onSelectWindow,
  onBringToFront,
  onMoveWindow,
  onMinimizeWindow,
  onMaximizeWindow,
  onCloseWindow,
}: DesktopProps) {
  const [draggingWindow, setDraggingWindow] = useState<WindowType | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [windowAreaSize, setWindowAreaSize] = useState({ width: 0, height: 0 });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const windowAreaRef = useRef<HTMLDivElement>(null);
  const windowWrapperRefs = useRef<Partial<Record<WindowType, HTMLDivElement | null>>>(
    {},
  );
  const [isAgentComposerFocused, setIsAgentComposerFocused] = useState(
    () => getAgentSessionSnapshot().isComposerFocused,
  );

  const hideMobileTabBar =
    !mobileHomeActive && activeWindow === "agent" && isAgentComposerFocused;

  const getMobileWindowBottomClass = (windowType: WindowType) =>
    windowType === "agent" && isAgentComposerFocused
      ? "max-md:!bottom-0"
      : "max-md:!bottom-[calc(var(--mobile-tab-bar-height)+env(safe-area-inset-bottom))]";

  const getWindowSize = (
    windowType: WindowType,
    containerWidth: number,
    containerHeight: number,
  ) => {
    const maxWidth = Math.max(320, containerWidth - 24);
    const maxHeight = Math.max(300, containerHeight - 24);

    if (windowType === "calculator") {
      return {
        width: Math.min(360, maxWidth),
        height: Math.min(540, maxHeight),
      };
    }

    if (windowType === "uptime") {
      return {
        width: Math.min(380, maxWidth),
        height: Math.min(300, maxHeight),
      };
    }

    if (windowType === "resume") {
      return {
        width: Math.min(1140, maxWidth),
        height: Math.min(Math.round(containerHeight * 0.9), maxHeight),
      };
    }

    return {
      width: Math.min(1280, maxWidth),
      height: Math.min(Math.round(containerHeight * 0.92), maxHeight),
    };
  };

  const getWindowBounds = (windowType: WindowType) => {
    const container = windowAreaRef.current;
    if (!container) return null;

    const containerRect = container.getBoundingClientRect();
    const fallbackSize = getWindowSize(
      windowType,
      containerRect.width,
      containerRect.height,
    );
    const wrapper = windowWrapperRefs.current[windowType];
    const width = wrapper?.offsetWidth ?? fallbackSize.width;
    const height = wrapper?.offsetHeight ?? fallbackSize.height;

    return {
      maxX: Math.max(0, Math.round(containerRect.width - width)),
      maxY: Math.max(0, Math.round(containerRect.height - height)),
      containerLeft: containerRect.left,
      containerTop: containerRect.top,
    };
  };

  const clampPosition = (windowType: WindowType, x: number, y: number) => {
    const bounds = getWindowBounds(windowType);
    if (!bounds) {
      return { x, y };
    }

    return {
      x: Math.min(bounds.maxX, Math.max(0, Math.round(x))),
      y: Math.min(bounds.maxY, Math.max(0, Math.round(y))),
    };
  };

  useEffect(() => {
    const container = windowAreaRef.current;
    if (!container) return;

    const updateWindowAreaSize = () => {
      setWindowAreaSize({
        width: container.clientWidth,
        height: container.clientHeight,
      });
    };

    updateWindowAreaSize();

    const resizeObserver = new ResizeObserver(() => {
      updateWindowAreaSize();
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    return subscribeAgentSession(() => {
      setIsAgentComposerFocused(getAgentSessionSnapshot().isComposerFocused);
      requestAnimationFrame(() => {
        const container = windowAreaRef.current;
        if (!container) return;
        setWindowAreaSize({
          width: container.clientWidth,
          height: container.clientHeight,
        });
      });
    });
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!draggingWindow) return;
      const activeWindowState = windows?.[draggingWindow];
      if (!activeWindowState) return;
      const bounds = getWindowBounds(draggingWindow);
      if (!bounds) return;

      const nextX = event.clientX - bounds.containerLeft - dragOffset.x;
      const nextY = event.clientY - bounds.containerTop - dragOffset.y;
      const clampedPosition = clampPosition(draggingWindow, nextX, nextY);
      onMoveWindow(draggingWindow, clampedPosition);
    };

    const handleMouseUp = () => {
      setDraggingWindow(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragOffset.x, dragOffset.y, draggingWindow, onMoveWindow, windows]);

  useEffect(() => {
    if (!windows) return;

    (Object.keys(windows) as WindowType[]).forEach((windowType) => {
      const windowState = windows[windowType];
      if (!windowState || windowState.isMaximized || !windowState.isOpen) return;

      const clampedPosition = clampPosition(windowType, windowState.x, windowState.y);
      if (clampedPosition.x !== windowState.x || clampedPosition.y !== windowState.y) {
        onMoveWindow(windowType, clampedPosition);
      }
    });
  }, [onMoveWindow, windowAreaSize.height, windowAreaSize.width, windows]);

  const startDrag =
    (windowType: WindowType) => (event: ReactMouseEvent<HTMLElement>) => {
      if (event.button !== 0) return;
      if ((event.target as HTMLElement).closest("button")) return;
      const windowState = windows?.[windowType];
      if (!windowState || windowState.isMaximized) return;
      const bounds = getWindowBounds(windowType);
      if (!bounds) return;
      const renderedPosition = clampPosition(windowType, windowState.x, windowState.y);
      setDragOffset({
        x: event.clientX - bounds.containerLeft - renderedPosition.x,
        y: event.clientY - bounds.containerTop - renderedPosition.y,
      });
      setDraggingWindow(windowType);
      onBringToFront(windowType);
    };

  return (
    <section
      className="flex min-h-0 flex-1"
      style={{
        backgroundColor: "var(--os-background)",
        backgroundImage: wallpaper ? `url('${wallpaper}')` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="mx-auto h-full min-h-0 w-full">
        <div className="flex h-full min-h-0 flex-col md:flex-row">
          <div
            className={`relative z-30 hidden shrink-0 transition-[width] duration-300 ease-out md:block md:h-full ${
              isSidebarCollapsed ? "md:w-[48px]" : "md:w-auto"
            }`}
          >
            <aside
              className={`h-full rounded-xl border border-[rgba(255,255,255,0.07)] bg-[rgba(0,0,0,0.35)] p-2 backdrop-blur-[20px] backdrop-saturate-[180%] transition-all duration-300 ease-out md:border-y-0 md:border-l-0 md:border-r md:border-r-[rgba(255,255,255,0.06)] md:rounded-none md:bg-[rgba(0,0,0,0.35)] ${
                isSidebarCollapsed ? "md:px-1" : "md:pr-4"
              }`}
            >
              <div className={isSidebarCollapsed ? "md:hidden" : ""}>
                <DesktopIcons activeWindow={activeWindow} onSelect={onSelectWindow} />
              </div>
            </aside>

            <button
              type="button"
              onClick={() => setIsSidebarCollapsed((previous) => !previous)}
              className="group/toggle absolute top-1/2 right-0 z-50 hidden h-11 w-[22px] -translate-y-1/2 translate-x-1/2 cursor-pointer select-none flex-col items-center justify-center gap-0.5 rounded-full border border-[rgba(255,255,255,0.14)] bg-[linear-gradient(180deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.04)_100%)] text-[rgba(255,255,255,0.72)] shadow-[0_4px_20px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-xl transition-all duration-200 ease-out hover:w-[24px] hover:border-[rgba(255,255,255,0.28)] hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0.08)_100%)] hover:text-white hover:shadow-[0_6px_24px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.22)] active:scale-[0.97] md:flex"
              aria-label={isSidebarCollapsed ? "Show desktop sidebar" : "Hide desktop sidebar"}
              title={isSidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
            >
              <span
                className="pointer-events-none h-px w-2 rounded-full bg-white/25 transition-colors group-hover/toggle:bg-white/40"
                aria-hidden="true"
              />
              {isSidebarCollapsed ? (
                <ChevronRight
                  size={13}
                  strokeWidth={2.25}
                  className="pointer-events-none transition-transform duration-200 group-hover/toggle:translate-x-px"
                />
              ) : (
                <ChevronLeft
                  size={13}
                  strokeWidth={2.25}
                  className="pointer-events-none transition-transform duration-200 group-hover/toggle:-translate-x-px"
                />
              )}
              <span
                className="pointer-events-none h-px w-2 rounded-full bg-white/25 transition-colors group-hover/toggle:bg-white/40"
                aria-hidden="true"
              />
            </button>
          </div>

          <div
            ref={windowAreaRef}
            className="relative min-h-0 flex-1 overflow-hidden"
          >
            {mobileHomeActive ? (
              <div className="absolute inset-x-0 top-0 bottom-[calc(var(--mobile-tab-bar-height)+env(safe-area-inset-bottom))] max-md:mobile-app-fade-in md:hidden">
                <MobileHome onOpenApp={onSelectWindow} />
              </div>
            ) : null}

            {(() => {
              return (Object.keys(windows ?? {}) as WindowType[])
                .filter((windowType) => {
                  const windowState = windows?.[windowType];
                  return Boolean(windowState?.isOpen && !windowState.isMinimized);
                })
                .map((windowType) => {
                  const windowState = windows?.[windowType];
                  if (!windowState) {
                    return null;
                  }

                  const isMobileActive = !mobileHomeActive && windowType === activeWindow;
                  const isCompact = windowType === "calculator" || windowType === "uptime";
                  const dimensions =
                    windowAreaSize.width > 0 && windowAreaSize.height > 0
                      ? getWindowSize(windowType, windowAreaSize.width, windowAreaSize.height)
                      : null;
                  const wrapperClassName = windowState.isMaximized
                    ? "absolute inset-0"
                    : "absolute min-h-0";
                  const clampedPosition = clampPosition(
                    windowType,
                    windowState.x,
                    windowState.y,
                  );

                  const windowTitle: ReactNode =
                    windowType === "agent" ? (
                      <span className="inline-flex items-center gap-1.5">
                        <span>{windowTitles[windowType]}</span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#4ade80]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#4ade80]" />
                          live
                        </span>
                      </span>
                    ) : (
                      windowTitles[windowType]
                    );

                  return (
                    <div
                      key={windowType}
                      className={`${wrapperClassName} ${
                        isMobileActive ? "max-md:mobile-app-fade-in z-10" : "max-md:hidden"
                      } max-md:!inset-x-0 max-md:!top-0 max-md:!left-0 max-md:!h-auto max-md:!w-full ${getMobileWindowBottomClass(windowType)}`}
                      ref={(node) => {
                        windowWrapperRefs.current[windowType] = node;
                      }}
                      style={
                        windowState.isMaximized
                          ? { zIndex: windowState.zIndex }
                          : {
                              left: clampedPosition.x,
                              top: clampedPosition.y,
                              width: dimensions?.width,
                              height: dimensions?.height,
                              zIndex: windowState.zIndex,
                            }
                      }
                    >
                      <Window
                        title={windowTitle}
                        isCompact={isCompact && !windowState.isMaximized}
                        isMaximized={windowState.isMaximized}
                        zIndex={windowState.zIndex}
                        onFocus={() => onBringToFront(windowType)}
                        onTitleBarMouseDown={startDrag(windowType)}
                        onMinimize={() => onMinimizeWindow(windowType)}
                        onMaximize={() => onMaximizeWindow(windowType)}
                        onClose={() => onCloseWindow(windowType)}
                      >
                        <WindowRenderer
                          windowType={windowType}
                          wallpapers={wallpapers}
                          selectedWallpaper={selectedWallpaper}
                          onSelectWallpaper={onSelectWallpaper}
                        />
                      </Window>
                    </div>
                  );
                });
            })()}
          </div>
        </div>
      </div>

      <MobileTabBar
        activeWindow={mobileHomeActive ? null : activeWindow}
        onSelect={onSelectWindow}
        hidden={hideMobileTabBar}
      />
    </section>
  );
}
