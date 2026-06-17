import { NextResponse } from "next/server";

const PLAYLIST_ID = "37i9dQZEVXbLZ52XmnySJg";
const TRACKS_CACHE_TTL_MS = 30 * 60 * 1000;
const TOKEN_CACHE_TTL_MS = 50 * 60 * 1000;

export type TopSongTrack = {
  name: string;
  artist: string;
  albumArt: string | undefined;
  spotifyUrl: string;
  durationMs: number;
};

type SpotifyPlaylistResponse = {
  items?: Array<{
    track?: {
      name?: string;
      artists?: Array<{ name?: string }>;
      album?: { images?: Array<{ url?: string }> };
      external_urls?: { spotify?: string };
      duration_ms?: number;
    } | null;
  }>;
};

type EmbedPlaylistData = {
  props?: {
    pageProps?: {
      state?: {
        data?: {
          entity?: {
            coverArt?: { sources?: Array<{ url?: string }> };
            trackList?: Array<{
              uri?: string;
              title?: string;
              subtitle?: string;
              duration?: number;
            }>;
          };
        };
      };
    };
  };
};

let tokenCache: { accessToken: string; expiresAt: number } | null = null;
let tracksCache: { tracks: TopSongTrack[]; fetchedAt: number } | null = null;

function trimEnv(value: string | undefined) {
  return value?.trim() ?? "";
}

async function getAccessToken(): Promise<string | null> {
  const clientId = trimEnv(process.env.SPOTIFY_CLIENT_ID);
  const clientSecret = trimEnv(process.env.SPOTIFY_CLIENT_SECRET);

  if (!clientId || !clientSecret) {
    return null;
  }

  const now = Date.now();
  if (tokenCache && tokenCache.expiresAt > now) {
    return tokenCache.accessToken;
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${credentials}`,
      },
      body: "grant_type=client_credentials",
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as {
      access_token?: string;
      expires_in?: number;
    };

    if (!data.access_token) {
      return null;
    }

    const expiresInMs = (data.expires_in ?? 3600) * 1000;
    const safeTtlMs = Math.min(expiresInMs - 60_000, TOKEN_CACHE_TTL_MS);

    tokenCache = {
      accessToken: data.access_token,
      expiresAt: now + Math.max(safeTtlMs, 60_000),
    };

    return tokenCache.accessToken;
  } catch {
    return null;
  }
}

function transformPlaylistItems(data: SpotifyPlaylistResponse): TopSongTrack[] {
  return (data.items ?? [])
    .map((item) => item.track)
    .filter((track): track is NonNullable<typeof track> => Boolean(track?.name))
    .map((track) => ({
      name: track.name ?? "Unknown track",
      artist: (track.artists ?? [])
        .map((artist) => artist.name)
        .filter(Boolean)
        .join(", "),
      albumArt: track.album?.images?.[0]?.url,
      spotifyUrl: track.external_urls?.spotify ?? "",
      durationMs: track.duration_ms ?? 0,
    }))
    .filter((track) => track.spotifyUrl.length > 0);
}

async function fetchTopSongsFromWebApi(): Promise<TopSongTrack[] | null> {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return null;
  }

  const url = new URL(`https://api.spotify.com/v1/playlists/${PLAYLIST_ID}/items`);
  url.searchParams.set("limit", "20");
  url.searchParams.set("market", "IN");
  url.searchParams.set(
    "fields",
    "items(track(name,artists(name),album(images),external_urls,duration_ms))",
  );

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as SpotifyPlaylistResponse;
    const tracks = transformPlaylistItems(data);
    return tracks.length > 0 ? tracks : null;
  } catch {
    return null;
  }
}

function normalizeArtistList(value: string) {
  return value.replace(/\u00a0/g, " ").replace(/\s*,\s*/g, ", ").trim();
}

async function fetchTopSongsFromEmbed(): Promise<TopSongTrack[] | null> {
  try {
    const response = await fetch(
      `https://open.spotify.com/embed/playlist/${PLAYLIST_ID}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; AdityaOS/1.0)",
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return null;
    }

    const html = await response.text();
    const match = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
    if (!match?.[1]) {
      return null;
    }

    const data = JSON.parse(match[1]) as EmbedPlaylistData;
    const entity = data.props?.pageProps?.state?.data?.entity;
    const trackList = entity?.trackList ?? [];
    const playlistCover = entity?.coverArt?.sources?.[0]?.url;

    const tracks = trackList
      .slice(0, 20)
      .map((track) => {
        const trackId = track.uri?.replace("spotify:track:", "") ?? "";
        if (!trackId || !track.title) {
          return null;
        }

        return {
          name: track.title,
          artist: normalizeArtistList(track.subtitle ?? ""),
          albumArt: playlistCover,
          spotifyUrl: `https://open.spotify.com/track/${trackId}`,
          durationMs: track.duration ?? 0,
        };
      })
      .filter((track): track is TopSongTrack => track !== null);

    return tracks.length > 0 ? tracks : null;
  } catch {
    return null;
  }
}

async function fetchTopSongs(): Promise<TopSongTrack[] | null> {
  const fromWebApi = await fetchTopSongsFromWebApi();
  if (fromWebApi) {
    return fromWebApi;
  }

  return fetchTopSongsFromEmbed();
}

export async function GET(request: Request) {
  const now = Date.now();
  const forceRefresh = new URL(request.url).searchParams.get("refresh") === "true";

  if (!forceRefresh && tracksCache && now - tracksCache.fetchedAt < TRACKS_CACHE_TTL_MS) {
    return NextResponse.json({ tracks: tracksCache.tracks });
  }

  const tracks = await fetchTopSongs();

  if (!tracks) {
    return NextResponse.json({ tracks: [], error: true }, { status: 502 });
  }

  tracksCache = { tracks, fetchedAt: now };
  return NextResponse.json({ tracks });
}
