import type { MouseEvent as ReactMouseEvent, ReactNode } from "react";

type WindowProps = {
  title: string;
  isCompact?: boolean;
  isMaximized: boolean;
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
  isCompact = false,
  isMaximized,
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
      className={`flex w-full flex-col border-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)] backdrop-blur-lg ${
        isCompact ? "h-full min-h-0" : "h-full min-h-0"
      } ${isMaximized ? "rounded-[6px]" : "rounded-[10px]"}`}
      onMouseDown={onFocus}
      style={{ zIndex }}
    >
      <header
        className="relative flex h-10 cursor-move items-center border-b-[0.5px] border-[var(--os-border)] px-4"
        onMouseDown={onTitleBarMouseDown}
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            onMouseDown={(event) => event.stopPropagation()}
            className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]"
            aria-label="close window"
          />
          <button
            type="button"
            onClick={onMinimize}
            onMouseDown={(event) => event.stopPropagation()}
            className="h-2.5 w-2.5 rounded-full bg-[#febc2e]"
            aria-label="minimize window"
          />
          <button
            type="button"
            onClick={onMaximize}
            onMouseDown={(event) => event.stopPropagation()}
            className="h-2.5 w-2.5 rounded-full bg-[#28c840]"
            aria-label={isMaximized ? "restore window size" : "maximize window"}
          />
        </div>

        <p className="text-window-title absolute left-1/2 -translate-x-1/2 text-[var(--os-text)]">
          {title}
        </p>
      </header>

      <div className={isCompact ? "flex-1 min-h-0 overflow-auto" : "flex-1 overflow-auto"}>
        {children}
      </div>
    </section>
  );
}
