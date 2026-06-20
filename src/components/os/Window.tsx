import type { MouseEvent as ReactMouseEvent, ReactNode } from "react";
import { X } from "lucide-react";

type WindowProps = {
  title: ReactNode;
  isCompact?: boolean;
  isMaximized: boolean;
  isFocused?: boolean;
  zIndex: number;
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
  onFocus: () => void;
  onTitleBarMouseDown: (event: ReactMouseEvent<HTMLElement>) => void;
  children?: ReactNode;
};

export function Window({
  title,
  isMaximized,
  isFocused = true,
  zIndex,
  onMinimize,
  onMaximize,
  onClose,
  onFocus,
  onTitleBarMouseDown,
  children,
}: WindowProps) {
  return (
    <section
      className={`group os-window-enter flex h-full w-full min-h-0 flex-col bg-[var(--os-surface)] transition-shadow duration-200 max-md:rounded-none max-md:border-0 max-md:bg-[var(--os-background)] max-md:shadow-none md:border-[0.5px] md:backdrop-blur-2xl ${
        isMaximized ? "md:rounded-[10px]" : "md:rounded-[14px]"
      } ${
        isFocused
          ? "md:border-[var(--os-border-strong)] md:shadow-[0_24px_70px_-12px_rgba(0,0,0,0.55),0_8px_24px_-8px_rgba(0,0,0,0.4),0_0_0_0.5px_rgba(255,255,255,0.08)_inset]"
          : "md:border-[var(--os-border)] md:shadow-[0_12px_36px_-10px_rgba(0,0,0,0.35)] md:opacity-[0.96]"
      } overflow-hidden`}
      onMouseDown={onFocus}
      style={{ zIndex }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 hidden h-px bg-gradient-to-r from-transparent via-white/20 to-transparent md:block" />

      <header
        className="relative hidden h-10 shrink-0 cursor-move items-center border-b-[0.5px] border-[var(--os-border)] bg-[var(--os-titlebar)] px-4 md:flex"
        onMouseDown={onTitleBarMouseDown}
      >
        <div className="flex items-center gap-[9px]">
          <button
            type="button"
            onClick={onClose}
            onMouseDown={(event) => event.stopPropagation()}
            className="group/dot relative h-[13px] w-[13px] rounded-full bg-gradient-to-b from-[#ff7a6e] to-[#dd3b34] ring-[0.5px] ring-inset ring-black/15 transition-transform duration-100 active:scale-90"
            style={{ boxShadow: "0 1px 1px rgba(0,0,0,0.15), inset 0 0.5px 0 rgba(255,255,255,0.35)" }}
            aria-label="close window"
          >
            <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold leading-none text-[#7a0000] opacity-0 transition-opacity group-hover/dot:opacity-80">
              ×
            </span>
          </button>
          <button
            type="button"
            onClick={onMinimize}
            onMouseDown={(event) => event.stopPropagation()}
            className="group/dot relative h-[13px] w-[13px] rounded-full bg-gradient-to-b from-[#ffcc4d] to-[#dd9c08] ring-[0.5px] ring-inset ring-black/15 transition-transform duration-100 active:scale-90"
            style={{ boxShadow: "0 1px 1px rgba(0,0,0,0.15), inset 0 0.5px 0 rgba(255,255,255,0.35)" }}
            aria-label="minimize window"
          >
            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold leading-none text-[#7a5400] opacity-0 transition-opacity group-hover/dot:opacity-80">
              −
            </span>
          </button>
          <button
            type="button"
            onClick={onMaximize}
            onMouseDown={(event) => event.stopPropagation()}
            className="group/dot relative h-[13px] w-[13px] rounded-full bg-gradient-to-b from-[#3ce06a] to-[#16a83b] ring-[0.5px] ring-inset ring-black/15 transition-transform duration-100 active:scale-90"
            style={{ boxShadow: "0 1px 1px rgba(0,0,0,0.15), inset 0 0.5px 0 rgba(255,255,255,0.35)" }}
            aria-label={isMaximized ? "restore window size" : "maximize window"}
          >
            <span className="absolute inset-0 flex items-center justify-center text-[7px] font-bold leading-none text-[#0a4a16] opacity-0 transition-opacity group-hover/dot:opacity-80">
              ⤢
            </span>
          </button>
        </div>

        <p
          className={`absolute left-1/2 flex -translate-x-1/2 items-center gap-2 text-[12.5px] font-medium tracking-[-0.01em] transition-colors ${
            isFocused ? "text-[var(--os-text)]" : "text-[var(--os-text-muted)]"
          }`}
        >
          {title}
        </p>
      </header>

      <header className="relative flex h-11 shrink-0 items-center border-b-[0.5px] border-[var(--os-border)] bg-[var(--os-titlebar)] px-1 md:hidden">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[var(--os-text)] transition-colors hover:bg-[var(--os-hover)] active:bg-[var(--os-hover)]"
          aria-label="Close and go home"
        >
          <X size={18} strokeWidth={2} />
        </button>
        <p className="text-ui pointer-events-none absolute left-1/2 max-w-[calc(100%-5rem)] -translate-x-1/2 truncate text-center text-[13px] font-medium tracking-[-0.01em] text-[var(--os-text)]">
          {title}
        </p>
      </header>

      <div className="min-h-0 flex-1 overflow-auto bg-[var(--os-background)] max-md:flex max-md:flex-col max-md:overflow-hidden">
        {children}
      </div>
    </section>
  );
}