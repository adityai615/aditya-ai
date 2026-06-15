import { ThemeToggle } from "./ThemeToggle";

export function TopBar() {
  return (
    <header className="h-[38px] border-b border-[rgba(255,255,255,0.08)] bg-[rgba(0,0,0,0.45)] backdrop-blur-[20px] backdrop-saturate-[180%]">
      <div className="flex h-full items-center justify-between px-4">
        <p className="text-ui text-[14px] font-semibold tracking-[-0.02em] text-[rgba(255,255,255,0.92)]">
          aadi.os
        </p>

        <div className="flex items-center gap-2">
          <p className="text-label text-[rgba(255,255,255,0.82)]">10:42</p>
          <ThemeToggle className="text-[rgba(255,255,255,0.9)] hover:bg-[rgba(255,255,255,0.08)]" />
        </div>
      </div>
    </header>
  );
}
