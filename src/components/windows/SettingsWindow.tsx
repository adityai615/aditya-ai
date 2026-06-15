"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import type { WallpaperMeta } from "../os/types";

type SettingsWindowProps = {
  wallpapers: WallpaperMeta[];
  selectedWallpaper: string;
  onSelectWallpaper: (wallpaperPath: string) => void;
};

export function SettingsWindow({
  wallpapers,
  selectedWallpaper,
  onSelectWallpaper,
}: SettingsWindowProps) {
  return (
    <div className="h-full overflow-auto px-6 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto w-full max-w-[1040px]">
        <header>
          <p className="text-ui text-sm font-semibold text-[var(--os-text)]">
            appearance
          </p>
          <p className="text-ui mt-2 text-[var(--os-text-muted)]">
            Customize the look and feel of Aadi OS.
          </p>
        </header>

        <section className="mt-8">
          <h2 className="text-label uppercase tracking-[0.08em] text-[var(--os-text-muted)]">
            wallpapers
          </h2>

          {wallpapers.length === 0 ? (
            <p className="text-ui mt-4 text-[var(--os-text-muted)]">
              No wallpapers found in /public/wallpapers.
            </p>
          ) : (
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {wallpapers.map((wallpaper) => {
                const isActive = wallpaper.path === selectedWallpaper;

                return (
                  <button
                    key={wallpaper.id}
                    type="button"
                    onClick={() => onSelectWallpaper(wallpaper.path)}
                    className={`rounded-md border-[0.5px] p-2 text-left transition-colors duration-150 hover:bg-[var(--os-hover)] ${
                      isActive
                        ? "border-[var(--os-text)] bg-[var(--os-hover)]"
                        : "border-[var(--os-border)] bg-[var(--os-surface)]"
                    }`}
                    aria-pressed={isActive}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden rounded-lg border-[0.5px] border-[var(--os-border)]">
                      <Image
                        src={wallpaper.path}
                        alt={wallpaper.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      {isActive ? (
                        <span className="absolute right-2 bottom-2 inline-flex h-5 w-5 items-center justify-center rounded border-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)] text-[var(--os-text)]">
                          <Check size={12} strokeWidth={2} />
                        </span>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
