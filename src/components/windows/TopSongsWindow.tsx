"use client";

import { RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type TopSongTrack = {
  name: string;
  artist: string;
  albumArt: string | undefined;
  spotifyUrl: string;
  durationMs: number;
};

const monoStyle = { fontFamily: "var(--font-mono)" };

function formatDuration(durationMs: number) {
  const totalSeconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function formatRank(index: number) {
  return (index + 1).toString().padStart(2, "0");
}

function SkeletonRows() {
  return (
    <div className="space-y-1">
      {Array.from({ length: 7 }, (_, index) => (
        <div
          key={index}
          className="flex animate-pulse items-center gap-3 rounded-lg px-2 py-2.5"
        >
          <div className="h-4 w-5 rounded bg-[var(--os-border)]" />
          <div className="h-9 w-9 shrink-0 rounded-md bg-[var(--os-border)]" />
          <div className="min-w-0 flex-1 space-y-1.5">
            <div className="h-3.5 w-3/4 rounded bg-[var(--os-border)]" />
            <div className="h-3 w-1/2 rounded bg-[var(--os-border)]" />
          </div>
          <div className="h-3 w-8 rounded bg-[var(--os-border)]" />
        </div>
      ))}
    </div>
  );
}

export function TopSongsWindow() {
  const [tracks, setTracks] = useState<TopSongTrack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadTracks = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setHasError(false);

    try {
      const url = isManualRefresh
        ? "/api/spotify/top-songs?refresh=true"
        : "/api/spotify/top-songs";
      const response = await fetch(url);
      const data = (await response.json()) as {
        tracks?: TopSongTrack[];
        error?: boolean;
      };

      if (!response.ok || data.error || !data.tracks) {
        setTracks([]);
        setHasError(true);
        return;
      }

      setTracks(data.tracks);
    } catch {
      setTracks([]);
      setHasError(true);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadTracks();
  }, [loadTracks]);

  return (
    <div className="flex h-full min-h-0 flex-col bg-[var(--os-background)]">
      <div className="flex shrink-0 items-center justify-between border-b-[0.5px] border-[var(--os-border)] px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#4ade80]" aria-hidden="true" />
          <p className="text-label text-[12px] text-[var(--os-text-muted)]">Live from Spotify</p>
        </div>
        <button
          type="button"
          onClick={() => void loadTracks(true)}
          disabled={isLoading || isRefreshing}
          aria-label="Refresh chart"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--os-text-muted)] transition-colors hover:bg-[var(--os-hover)] hover:text-[var(--os-text)] disabled:opacity-50"
        >
          <RefreshCw
            size={14}
            strokeWidth={2}
            className={isRefreshing ? "animate-spin" : undefined}
          />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 py-2 sm:px-3">
        {isLoading ? (
          <SkeletonRows />
        ) : hasError ? (
          <p className="text-ui px-2 py-8 text-center text-[var(--os-text-muted)]">
            Couldn&apos;t load the chart right now.
          </p>
        ) : (
          <ul className="space-y-0.5">
            {tracks.map((track, index) => (
              <li key={`${track.spotifyUrl}-${index}`}>
                <a
                  href={track.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-[var(--os-hover)]"
                >
                  <span
                    className="w-5 shrink-0 text-center text-[12px] tabular-nums text-[var(--os-text-muted)]"
                    style={monoStyle}
                  >
                    {formatRank(index)}
                  </span>

                  <div className="h-9 w-9 shrink-0 overflow-hidden rounded-md border-[0.5px] border-[var(--os-border)] bg-[var(--os-surface)]">
                    {track.albumArt ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={track.albumArt}
                        alt=""
                        width={36}
                        height={36}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] text-[var(--os-text-muted)]">
                        ♪
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-ui truncate text-[13px] font-medium text-[var(--os-text)]">
                      {track.name}
                    </p>
                    <p className="text-label truncate text-[11px] text-[var(--os-text-muted)]">
                      {track.artist}
                    </p>
                  </div>

                  <span
                    className="shrink-0 text-[11px] tabular-nums text-[var(--os-text-muted)]"
                    style={monoStyle}
                  >
                    {formatDuration(track.durationMs)}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
