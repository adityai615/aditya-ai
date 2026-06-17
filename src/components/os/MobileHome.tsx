"use client";

import { APP_ICONS } from "@/lib/app-icons";
import { APP_DEFINITIONS } from "@/lib/apps";
import type { WindowType } from "./types";

type MobileHomeProps = {
  onOpenApp: (appId: WindowType) => void;
};

export function MobileHome({ onOpenApp }: MobileHomeProps) {
  return (
    <div className="flex h-full min-h-0 flex-col items-center justify-center px-6 pb-4 text-center">
      <p className="text-ui text-[22px] font-semibold tracking-[-0.03em] text-white drop-shadow-sm">
        aditya.os
      </p>
      <p className="text-ui mt-2 max-w-[260px] text-[13px] leading-relaxed text-white/75 drop-shadow-sm">
        Tap an app below to get started, or pick one from the dock.
      </p>

      <div className="mt-8 grid w-full max-w-[320px] grid-cols-4 gap-3">
        {APP_DEFINITIONS.slice(0, 8).map((app) => {
          const Icon = APP_ICONS[app.id];
          return (
            <button
              key={app.id}
              type="button"
              onClick={() => onOpenApp(app.id)}
              className="flex min-h-[72px] flex-col items-center justify-center gap-1.5 rounded-xl border border-[rgba(255,255,255,0.12)] bg-[rgba(0,0,0,0.35)] p-2 backdrop-blur-md transition-colors active:bg-[rgba(255,255,255,0.12)]"
              aria-label={`Open ${app.title}`}
            >
              <Icon size={18} strokeWidth={1.9} className="text-white/90" />
              <span className="text-label text-[9px] font-medium leading-tight text-white/70">
                {app.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
