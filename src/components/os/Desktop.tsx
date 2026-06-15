import { useEffect, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { DesktopIcons } from "./DesktopIcons";
import type { WindowType } from "./types";
import { WindowRenderer } from "../windows/WindowRenderer";
import type { WallpaperMeta } from "./types";
import { Window } from "./Window";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

type DesktopProps = {
  wallpaper: string;
  activeWindow: WindowType;
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

  const getWindowSize = (
    windowType: WindowType,
    containerWidth: number,
    containerHeight: number,
  ) => {
    const maxWidth = Math.max(320, containerWidth - 24);
    const maxHeight = Math.max(300, containerHeight - 24);

    if (windowType === "calculator") {
      return {
        width: Math.min(460, maxWidth),
        height: Math.min(760, maxHeight),
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
          <aside
            className={`relative shrink-0 rounded-xl border border-[rgba(255,255,255,0.07)] bg-[rgba(0,0,0,0.35)] p-2 backdrop-blur-[20px] backdrop-saturate-[180%] transition-all duration-200 md:h-full md:border-y-0 md:border-l-0 md:border-r md:rounded-none md:bg-[rgba(0,0,0,0.35)] ${
              isSidebarCollapsed ? "md:w-[48px]" : "md:w-auto"
            }`}
          >
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed((previous) => !previous)}
              className="absolute top-1/2 right-0 z-10 hidden -translate-y-1/2 translate-x-1/2 rounded-md border border-[rgba(255,255,255,0.12)] bg-[rgba(0,0,0,0.4)] p-1 text-[rgba(255,255,255,0.82)] transition-colors hover:bg-[rgba(255,255,255,0.1)] md:inline-flex"
              aria-label={isSidebarCollapsed ? "Show desktop sidebar" : "Hide desktop sidebar"}
              title={isSidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
            >
              {isSidebarCollapsed ? <ChevronsRight size={14} /> : <ChevronsLeft size={14} />}
            </button>

            <div className={isSidebarCollapsed ? "md:hidden" : ""}>
              <DesktopIcons activeWindow={activeWindow} onSelect={onSelectWindow} />
            </div>
          </aside>

          <div ref={windowAreaRef} className="relative min-h-0 flex-1 overflow-hidden">
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

                  const isCompact = windowType === "calculator";
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

                  return (
                    <div
                      key={windowType}
                      className={wrapperClassName}
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
                        title={windowTitles[windowType]}
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
    </section>
  );
}
