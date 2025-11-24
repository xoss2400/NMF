import type { NextApiRequest, NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { fetchTopArtist, refreshAccessToken, type SpotifyToken } from "../../../lib/spotify";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  let spotifyToken = token as SpotifyToken;

  if (spotifyToken.accessTokenExpires && Date.now() >= spotifyToken.accessTokenExpires) {
    spotifyToken = await refreshAccessToken(spotifyToken);
  }

  if (!spotifyToken.accessToken) {
    return res.status(400).json({ error: "Missing access token" });
  }

  const topArtist = await fetchTopArtist(spotifyToken.accessToken);

  if (!topArtist) {
    return res.status(502).json({ error: "Could not fetch top artist" });
  }

  return res.status(200).json({ topArtist });
}
