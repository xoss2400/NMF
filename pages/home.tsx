"use client"
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import HorizontalScroller from "../components/shared/HorizontalScroller";
import TrackCard from "../components/cards/TrackCard";
import ArtistCard from "../components/cards/ArtistCard";
import GenreChip from "../components/cards/GenreChip";
import ReleaseCard from "../components/cards/ReleaseCard";
import SongOfDayCard from "../components/cards/SongOfDayCard";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [profile, setProfile] = useState<any | null>(null);
  const [recentReleases, setRecentReleases] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      (async () => {
        setLoading(true);
        try {
          // 1) fetch user profile (top tracks/artists/genres)
          const p = await fetch('/api/user/profile');
          if (p.ok) {
            const profileJson = await p.json();
            setProfile(profileJson);
          }

          // 2) fetch recent releases
          const r = await fetch('/api/spotify/new-releases');
          if (r.ok) {
            const releasesJson = await r.json();
            const items = releasesJson.albums?.items || [];
            const mapped = items.slice(0, 12).map((album: any) => ({
              id: album.id,
              title: album.name,
              artist: album.artists?.[0]?.name,
              image: album.images?.[0]?.url,
            }));
            setRecentReleases(mapped);
          }

          // 3) fetch user groups
          const g = await fetch('/api/groups');
          if (g.ok) {
            const groupsJson = await g.json();
            setGroups(groupsJson);
          }
        } catch (err) {
          console.error('Error fetching home data', err);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [status]);

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (status === 'unauthenticated') return null;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#191414] text-white">
      {/* Top Tracks */}
      <HorizontalScroller title="Your Top Tracks">
        {profile?.tracks?.slice(0, 12)?.length > 0 ? (
          profile.tracks.slice(0, 12).map((t: any) => <TrackCard key={t.id} track={t} />)
        ) : (
          <div className="flex-shrink-0 w-40 text-gray-400">No tracks available</div>
        )}
      </HorizontalScroller>

      {/* Top Artists */}
      <HorizontalScroller title="Your Top Artists">
        {profile?.artists?.slice(0, 12)?.length > 0 ? (
          profile.artists.slice(0, 12).map((a: any) => <ArtistCard key={a.id} artist={a} />)
        ) : (
          <div className="flex-shrink-0 w-40 text-gray-400">No artists available</div>
        )}
      </HorizontalScroller>

      {/* Top Genres */}
      <HorizontalScroller title="Your Top Genres">
        {profile?.genres?.length > 0 ? (
          profile.genres.slice(0, 20).map((g: any, i: number) => <GenreChip key={g} genre={g} index={i} />)
        ) : (
          <div className="flex-shrink-0 px-4 py-2 text-gray-400">No genres available</div>
        )}
      </HorizontalScroller>

      {/* Song of the Day (placeholder: shows first group's SOD if any) */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Song of the Day</h2>
        {groups?.length > 0 ? (
          // try to fetch first group's song-of-day via API
          <SongOfDayCard sod={groups[0]?.songsOfTheDay?.[0] || null} />
        ) : (
          <div className="text-gray-400">No Song of the Day available</div>
        )}
      </section>

      {/* Recently Released */}
      <HorizontalScroller title="Recently Released">
        {recentReleases.length > 0 ? (
          recentReleases.map((r) => <ReleaseCard key={r.id} release={r} className="w-44" />)
        ) : (
          <div className="flex-shrink-0 w-40 text-gray-400">No recent releases</div>
        )}
      </HorizontalScroller>
    </div>
  );
}
