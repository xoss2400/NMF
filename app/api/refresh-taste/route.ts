// app/api/refresh-taste/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session: any = await getServerSession(authOptions as any);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Find the user in our DB
  const user = await prisma.user.findUnique({
    where: { email: session.user.email as string },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Get their Spotify account / access token
  const account = await prisma.account.findFirst({
    where: {
      userId: user.id,
      provider: "spotify",
    },
  });

  if (!account?.access_token) {
    return NextResponse.json(
      { error: "No Spotify access token stored" },
      { status: 400 }
    );
  }

  const accessToken = account.access_token;

  // Fetch top tracks
  const tracksRes = await fetch(
    "https://api.spotify.com/v1/me/top/tracks?limit=10",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  // Fetch top artists
  const artistsRes = await fetch(
    "https://api.spotify.com/v1/me/top/artists?limit=10",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!tracksRes.ok || !artistsRes.ok) {
    const tracksText = await tracksRes.text();
    const artistsText = await artistsRes.text();
    return NextResponse.json(
      {
        error: "Spotify API error",
        tracksError: tracksText,
        artistsError: artistsText,
      },
      { status: 500 }
    );
  }

  const topTracks = await tracksRes.json();
  const topArtists = await artistsRes.json();

  const profileData = {
    fetchedAt: new Date().toISOString(),
    topTracks,
    topArtists,
  };

  const profile = await prisma.tasteProfile.create({
    data: {
      userId: user.id,
      dataJson: JSON.stringify(profileData),
    },
  });

  return NextResponse.json({ ok: true, profileId: profile.id });
}
