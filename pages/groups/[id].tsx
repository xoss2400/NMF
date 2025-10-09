'use client'
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface GroupMember {
  id: string;
  name: string;
  avatar?: string;
  topTracks: Array<{
    id: string;
    name: string;
    artist: string;
    albumCover: string;
  }>;
}

interface SongOfTheDay {
  id: string;
  track: {
    id: string;
    name: string;
    artist: string;
    albumCover: string;
  };
  submittedBy: string;
  submittedAt: string;
}

interface RecentRelease {
  id: string;
  name: string;
  artist: string;
  albumCover: string;
  releaseDate: string;
  type: 'album' | 'single';
}

interface UpcomingRelease {
  id: string;
  name: string;
  artist: string;
  cover?: string;
  releaseDate: string;
  recommendationRating: number; // 1-5 stars
  type: 'album' | 'single';
}

export default function GroupPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = router.query;
  
  const [groupName, setGroupName] = useState("College Friends");
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [topGenres, setTopGenres] = useState<string[]>([]);
  const [songsOfTheDay, setSongsOfTheDay] = useState<SongOfTheDay[]>([]);
  const [recentReleases, setRecentReleases] = useState<RecentRelease[]>([]);
  const [upcomingReleases, setUpcomingReleases] = useState<UpcomingRelease[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    if (id) {
      // Mock data - in real app, fetch from API
      const mockMembers: GroupMember[] = [
        {
          id: "1",
          name: "Alex",
          topTracks: [
            { id: "1", name: "Blinding Lights", artist: "The Weeknd", albumCover: "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36" },
            { id: "2", name: "Watermelon Sugar", artist: "Harry Styles", albumCover: "https://i.scdn.co/image/ab67616d0000b273f7b7174bef6f3fbfda3a0bb7" },
            { id: "3", name: "Levitating", artist: "Dua Lipa", albumCover: "https://i.scdn.co/image/ab67616d0000b273f7b7174bef6f3fbfda3a0bb7" },
          ]
        },
        {
          id: "2", 
          name: "Sam",
          topTracks: [
            { id: "4", name: "Good 4 U", artist: "Olivia Rodrigo", albumCover: "https://i.scdn.co/image/ab67616d0000b273f7b7174bef6f3fbfda3a0bb7" },
            { id: "5", name: "Industry Baby", artist: "Lil Nas X", albumCover: "https://i.scdn.co/image/ab67616d0000b273f7b7174bef6f3fbfda3a0bb7" },
            { id: "6", name: "Stay", artist: "The Kid LAROI", albumCover: "https://i.scdn.co/image/ab67616d0000b273f7b7174bef6f3fbfda3a0bb7" },
          ]
        }
      ];

      const mockSongsOfTheDay: SongOfTheDay[] = [
        {
          id: "1",
          track: { id: "1", name: "Anti-Hero", artist: "Taylor Swift", albumCover: "https://i.scdn.co/image/ab67616d0000b273f7b7174bef6f3fbfda3a0bb7" },
          submittedBy: "Alex",
          submittedAt: "2024-01-15"
        },
        {
          id: "2", 
          track: { id: "2", name: "As It Was", artist: "Harry Styles", albumCover: "https://i.scdn.co/image/ab67616d0000b273f7b7174bef6f3fbfda3a0bb7" },
          submittedBy: "Sam",
          submittedAt: "2024-01-15"
        }
      ];

      const mockRecentReleases: RecentRelease[] = [
        { id: "1", name: "Midnights", artist: "Taylor Swift", albumCover: "https://i.scdn.co/image/ab67616d0000b273f7b7174bef6f3fbfda3a0bb7", releaseDate: "2024-01-10", type: "album" },
        { id: "2", name: "Harry's House", artist: "Harry Styles", albumCover: "https://i.scdn.co/image/ab67616d0000b273f7b7174bef6f3fbfda3a0bb7", releaseDate: "2024-01-08", type: "album" },
        { id: "3", name: "Future Nostalgia", artist: "Dua Lipa", albumCover: "https://i.scdn.co/image/ab67616d0000b273f7b7174bef6f3fbfda3a0bb7", releaseDate: "2024-01-05", type: "album" },
      ];

      const mockUpcomingReleases: UpcomingRelease[] = [
        { id: "1", name: "The Tortured Poets Department", artist: "Taylor Swift", releaseDate: "2024-04-19", recommendationRating: 5, type: "album" },
        { id: "2", name: "Radical Optimism", artist: "Dua Lipa", releaseDate: "2024-05-03", recommendationRating: 4, type: "album" },
        { id: "3", name: "New Single", artist: "Harry Styles", releaseDate: "2024-03-15", recommendationRating: 3, type: "single" },
      ];

      setMembers(mockMembers);
      setTopGenres(["Pop", "Indie", "Alternative", "Electronic", "Hip-Hop"]);
      setSongsOfTheDay(mockSongsOfTheDay);
      setRecentReleases(mockRecentReleases);
      setUpcomingReleases(mockUpcomingReleases);
      setLoading(false);
    }
  }, [id]);

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#191414]">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-600"}>
        ★
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-[#191414] text-white">
      {/* Header */}
      <div className="border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/home"
              className="text-white hover:text-yellow-300 transition-colors"
            >
              ← Back to Groups
            </Link>
            <h1 className="text-2xl font-bold text-yellow-300">{groupName}</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-white">
              {members.length} member{members.length !== 1 ? 's' : ''}
            </span>
            <button className="px-4 py-2 bg-[#1DB954] hover:bg-[#1ed760] rounded-lg transition-colors">
              Invite Friends
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-8 space-y-12">
        {/* 1. Top Songs This Week */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Top Songs This Week</h2>
          <div className="space-y-6">
            {members.map((member) => (
              <div key={member.id}>
                <h3 className="text-lg font-semibold mb-3 text-white">{member.name}'s Top Tracks</h3>
                <div className="flex gap-4 overflow-x-auto pb-4">
                  {member.topTracks.map((track) => (
                    <div key={track.id} className="flex-shrink-0 w-48">
                      <div className="relative">
                        <Image
                          src={track.albumCover}
                          alt={`${track.name} album cover`}
                          width={192}
                          height={192}
                          className="rounded-lg"
                        />
                      </div>
                      <div className="mt-2">
                        <p className="font-medium truncate">{track.name}</p>
                        <p className="text-sm text-gray-300 truncate">{track.artist}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Top Genres */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Group's Top Genres</h2>
          <div className="flex flex-wrap gap-3">
            {topGenres.map((genre, index) => (
              <span
                key={genre}
                className="px-4 py-2 bg-[#1DB954] text-black font-semibold rounded-full"
              >
                #{index + 1} {genre}
              </span>
            ))}
          </div>
        </section>

        {/* 3. Song of the Day */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Song of the Day</h2>
            <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
              Submit Song
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {songsOfTheDay.map((song) => (
              <div key={song.id} className="flex-shrink-0 w-48">
                <div className="relative">
                  <Image
                    src={song.track.albumCover}
                    alt={`${song.track.name} album cover`}
                    width={192}
                    height={192}
                    className="rounded-lg"
                  />
                </div>
                <div className="mt-2">
                  <p className="font-medium truncate">{song.track.name}</p>
                  <p className="text-sm text-gray-300 truncate">{song.track.artist}</p>
                  <p className="text-xs text-[#1DB954] mt-1">by {song.submittedBy}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Recently Released */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Recently Released</h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {recentReleases.map((release) => (
              <div key={release.id} className="flex-shrink-0 w-48">
                <div className="relative">
                  <Image
                    src={release.albumCover}
                    alt={`${release.name} album cover`}
                    width={192}
                    height={192}
                    className="rounded-lg"
                  />
                  <div className="absolute top-2 right-2 bg-black bg-opacity-75 px-2 py-1 rounded text-xs">
                    {release.type}
                  </div>
                </div>
                <div className="mt-2">
                  <p className="font-medium truncate">{release.name}</p>
                  <p className="text-sm text-gray-300 truncate">{release.artist}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(release.releaseDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Upcoming Releases (Most Important Feature) */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Upcoming Releases</h2>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {upcomingReleases.map((release) => (
              <div key={release.id} className="flex-shrink-0 w-96">
                <div className="relative">
                  <div className="w-96 h-96 bg-gray-800 rounded-lg flex items-center justify-center">
                    {release.cover ? (
                      <Image
                        src={release.cover}
                        alt={`${release.name} cover`}
                        width={384}
                        height={384}
                        className="rounded-lg"
                      />
                    ) : (
                      <div className="text-center">
                        <div className="text-6xl mb-2">🎵</div>
                        <p className="text-sm text-gray-400">Cover TBA</p>
                      </div>
                    )}
                  </div>
                  <div className="absolute top-4 right-4 bg-black bg-opacity-75 px-3 py-1 rounded text-sm">
                    {release.type}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="font-bold text-lg truncate">{release.name}</p>
                  <p className="text-gray-300 truncate">{release.artist}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(release.releaseDate).toLocaleDateString()}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm">Recommendation:</span>
                    <div className="flex">
                      {renderStars(release.recommendationRating)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
