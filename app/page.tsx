// app/page.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AuthButton } from "@/Components/AuthButton";
import { RefreshTasteButton } from "@/Components/RefreshTasteButton";

export default async function HomePage() {
  const session: any = await getServerSession(authOptions as any);

  let latestProfile: any = null;

  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
      include: {
        tasteProfiles: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (user && user.tasteProfiles.length > 0) {
      latestProfile = JSON.parse(user.tasteProfiles[0].dataJson);
    }
  }

  return (
    <main style={{ padding: "2rem", maxWidth: 800, margin: "0 auto" }}>
      <h1>NMF App</h1>
      <AuthButton />

      {!session && (
        <p style={{ marginTop: "1rem" }}>
          Sign in with Spotify to generate your taste profile.
        </p>
      )}

      {session && (
        <>
          <RefreshTasteButton />

          {latestProfile ? (
            <section style={{ marginTop: "2rem" }}>
              <h2>Your latest taste profile</h2>
              <p>Fetched at: {latestProfile.fetchedAt}</p>

              <h3 style={{ marginTop: "1rem" }}>Top Tracks</h3>
              <ol>
                {latestProfile.topTracks.items.map((track: any) => (
                  <li key={track.id}>
                    {track.name} –{" "}
                    {track.artists.map((a: any) => a.name).join(", ")}
                  </li>
                ))}
              </ol>

              <h3 style={{ marginTop: "1rem" }}>Top Artists</h3>
              <ol>
                {latestProfile.topArtists.items.map((artist: any) => (
                  <li key={artist.id}>{artist.name}</li>
                ))}
              </ol>
            </section>
          ) : (
            <p style={{ marginTop: "1.5rem" }}>
              No taste profile yet. Click &ldquo;Refresh taste profile&rdquo; to
              fetch your data from Spotify.
            </p>
          )}
        </>
      )}
    </main>
  );
}
