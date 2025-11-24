import type { JWT } from "next-auth/jwt";

export interface SpotifyToken extends JWT {
  accessToken?: string;
  accessTokenExpires?: number;
  refreshToken?: string;
  error?: string;
}

export async function refreshAccessToken(token: SpotifyToken): Promise<SpotifyToken> {
  try {
    const basicAuth = Buffer.from(
      `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
    ).toString("base64");

    const params = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: token.refreshToken ?? "",
    });

    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    const refreshed = await response.json();

    if (!response.ok) {
      throw refreshed;
    }

    return {
      ...token,
      accessToken: refreshed.access_token,
      accessTokenExpires: Date.now() + refreshed.expires_in * 1000,
      refreshToken: refreshed.refresh_token ?? token.refreshToken,
      error: undefined,
    };
  } catch (error) {
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

export async function fetchTopArtist(accessToken: string): Promise<string | null> {
  const response = await fetch("https://api.spotify.com/v1/me/top/artists?limit=1", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  const artist = data?.items?.[0];
  return artist?.name ?? null;
}
