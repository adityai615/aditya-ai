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
      className={`group flex h-full w-full min-h-0 flex-col bg-[var(--os-surface)] transition-shadow duration-200 max-md:rounded-none max-md:border-0 max-md:bg-[var(--os-background)] max-md:shadow-none md:border-[0.5px] md:backdrop-blur-2xl ${
        isMaximized ? "md:rounded-[8px]" : "md:rounded-[12px]"
      } ${
        isFocused
          ? "md:border-[var(--os-border-strong)] md:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.45),0_0_0_0.5px_rgba(255,255,255,0.06)_inset]"
          : "md:border-[var(--os-border)] md:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)] md:opacity-[0.97]"
      } overflow-hidden`}
      onMouseDown={onFocus}
      style={{ zIndex }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 hidden h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent md:block" />

      <header
        className="relative hidden h-10 shrink-0 cursor-move items-center border-b-[0.5px] border-[var(--os-border)] bg-[var(--os-titlebar)] px-4 md:flex"
        onMouseDown={onTitleBarMouseDown}
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            onMouseDown={(event) => event.stopPropagation()}
            className="group/dot relative h-3 w-3 rounded-full bg-gradient-to-b from-[#ff6b61] to-[#e0443e] ring-1 ring-black/10 transition-transform active:scale-90"
            aria-label="close window"
          >
            <span className="absolute inset-0 flex items-center justify-center text-[7px] font-bold text-[#7a0000] opacity-0 transition-opacity group-hover/dot:opacity-70">
              ×
            </span>
          </button>
          <button
            type="button"
            onClick={onMinimize}
            onMouseDown={(event) => event.stopPropagation()}
            className="group/dot relative h-3 w-3 rounded-full bg-gradient-to-b from-[#ffc02e] to-[#e0a106] ring-1 ring-black/10 transition-transform active:scale-90"
            aria-label="minimize window"
          >
            <span className="absolute inset-0 flex items-center justify-center text-[7px] font-bold text-[#7a5400] opacity-0 transition-opacity group-hover/dot:opacity-70">
              −
            </span>
          </button>
          <button
            type="button"
            onClick={onMaximize}
            onMouseDown={(event) => event.stopPropagation()}
            className="group/dot relative h-3 w-3 rounded-full bg-gradient-to-b from-[#34d058] to-[#1ca73e] ring-1 ring-black/10 transition-transform active:scale-90"
            aria-label={isMaximized ? "restore window size" : "maximize window"}
          >
            <span className="absolute inset-0 flex items-center justify-center text-[6px] font-bold text-[#0a4a16] opacity-0 transition-opacity group-hover/dot:opacity-70">
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
