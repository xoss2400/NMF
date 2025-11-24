import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { fetchTopArtist, refreshAccessToken, type SpotifyToken } from "@/lib/spotify";

export async function GET(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let spotifyToken = token as SpotifyToken;

  if (spotifyToken.accessTokenExpires && Date.now() >= spotifyToken.accessTokenExpires) {
    spotifyToken = await refreshAccessToken(spotifyToken);
  }

  if (!spotifyToken.accessToken) {
    return NextResponse.json({ error: "Missing access token" }, { status: 400 });
  }

  const topArtist = await fetchTopArtist(spotifyToken.accessToken);

  if (!topArtist) {
    return NextResponse.json({ error: "Could not fetch top artist" }, { status: 502 });
  }

  return NextResponse.json({ topArtist });
}
