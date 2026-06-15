import { readdir } from "node:fs/promises";
import path from "node:path";
import type { WallpaperMeta } from "@/components/os/types";

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

function isImageFile(fileName: string) {
  const extension = path.extname(fileName).toLowerCase();
  return IMAGE_EXTENSIONS.includes(extension);
}

function toDisplayName(fileName: string) {
  const withoutExtension = fileName.replace(/\.[^/.]+$/, "");
  return withoutExtension
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function toWallpaperMeta(fileName: string, publicSubPath: string): WallpaperMeta {
  return {
    id: fileName.toLowerCase(),
    name: toDisplayName(fileName),
    path: `${publicSubPath}/${fileName}`.replace(/\/+/g, "/"),
  };
}

export async function getWallpapers(): Promise<WallpaperMeta[]> {
  const wallpapersDirectory = path.join(process.cwd(), "public", "wallpapers");
  const publicDirectory = path.join(process.cwd(), "public");

  let wallpapers: WallpaperMeta[] = [];

  try {
    const files = await readdir(wallpapersDirectory);
    wallpapers = files
      .filter(isImageFile)
      .map((fileName) => toWallpaperMeta(fileName, "/wallpapers"));
  } catch {
    wallpapers = [];
  }

  if (wallpapers.length === 0) {
    const files = await readdir(publicDirectory);
    wallpapers = files
      .filter((fileName) => isImageFile(fileName) && /^wallpaper/i.test(fileName))
      .map((fileName) => toWallpaperMeta(fileName, ""));
  }

  return wallpapers.sort((first, second) => first.name.localeCompare(second.name));
}
