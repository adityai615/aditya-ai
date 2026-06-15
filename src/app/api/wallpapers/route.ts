import { NextResponse } from "next/server";
import { getWallpapers } from "@/lib/wallpapers";

export async function GET() {
  const wallpapers = await getWallpapers();
  return NextResponse.json({ wallpapers });
}
