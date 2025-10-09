'use client'
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface GroupMember {
  id: string;
  name: string;
  spotifyId: string;
  joinedAt: string;
  topTracks?: any[];
  topArtists?: any[];
  genres?: string[];
}

interface Group {
  id: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  members: GroupMember[];
  createdAt: string;
  createdBy: string;
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
  
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [topGenres, setTopGenres] = useState<string[]>([]);
  const [songsOfTheDay, setSongsOfTheDay] = useState<SongOfTheDay[]>([]);
  const [recentReleases, setRecentReleases] = useState<RecentRelease[]>([]);
  const [upcomingReleases, setUpcomingReleases] = useState<UpcomingRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSongSearch, setShowSongSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    if (id && status === "authenticated") {
      fetchGroupData();
    }
  }, [id, status]);

  const fetchGroupData = async () => {
    try {
      // Fetch group info
      const groupResponse = await fetch(`/api/groups/${id}`);
      if (groupResponse.ok) {
        const groupData = await groupResponse.json();
        setGroup(groupData);
        setMembers(groupData.members);
        
        // Fetch member data and aggregate genres
        await fetchMemberData(groupData.members);
        
        // Fetch other data
        await Promise.all([
          fetchRecentReleases(),
          fetchUpcomingReleases(),
          fetchSongsOfTheDay()
        ]);
      }
    } catch (error) {
      console.error('Error fetching group data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMemberData = async (members: GroupMember[]) => {
    // For now, we'll use the current user's data as a placeholder
    // In a real app, you'd fetch each member's Spotify data
    try {
      const profileResponse = await fetch('/api/user/profile');
      if (profileResponse.ok) {
        const profile = await profileResponse.json();
        
        // Aggregate genres from all members (using current user's data as example)
        const allGenres = profile.genres;
        setTopGenres(allGenres.slice(0, 5));
        
        // Update members with their data
        const updatedMembers = members.map(member => ({
          ...member,
          topTracks: member.spotifyId === session?.user?.email ? profile.tracks.slice(0, 3) : [],
          topArtists: member.spotifyId === session?.user?.email ? profile.artists.slice(0, 3) : [],
          genres: member.spotifyId === session?.user?.email ? profile.genres : []
        }));
        setMembers(updatedMembers);
      }
    } catch (error) {
      console.error('Error fetching member data:', error);
    }
  };

  const fetchRecentReleases = async () => {
    try {
      const response = await fetch('/api/spotify/new-releases');
      if (response.ok) {
        const data = await response.json();
        const releases = data.albums.items.slice(0, 5).map((album: any) => ({
          id: album.id,
          name: album.name,
          artist: album.artists[0]?.name || 'Unknown Artist',
          albumCover: album.images[0]?.url || '',
          releaseDate: album.release_date,
          type: album.album_type as 'album' | 'single'
        }));
        setRecentReleases(releases);
      }
    } catch (error) {
      console.error('Error fetching recent releases:', error);
    }
  };

  const fetchUpcomingReleases = async () => {
    // For now, we'll use a curated list of known upcoming releases
    // In a real app, you'd integrate with a service like MusicBrainz or Last.fm
    // that tracks upcoming album releases
    const upcomingReleases: UpcomingRelease[] = [
      { 
        id: "1", 
        name: "The Tortured Poets Department", 
        artist: "Taylor Swift", 
        releaseDate: "2024-04-19", 
        recommendationRating: 5, 
        type: "album",
        cover: "https://i.scdn.co/image/ab67616d0000b273f7b7174bef6f3fbfda3a0bb7"
      },
      { 
        id: "2", 
        name: "Radical Optimism", 
        artist: "Dua Lipa", 
        releaseDate: "2024-05-03", 
        recommendationRating: 4, 
        type: "album",
        cover: "https://i.scdn.co/image/ab67616d0000b273f7b7174bef6f3fbfda3a0bb7"
      },
      { 
        id: "3", 
        name: "New Single", 
        artist: "Harry Styles", 
        releaseDate: "2024-03-15", 
        recommendationRating: 3, 
        type: "single",
        cover: "https://i.scdn.co/image/ab67616d0000b273f7b7174bef6f3fbfda3a0bb7"
      },
    ];
    setUpcomingReleases(upcomingReleases);
  };

  const fetchSongsOfTheDay = async () => {
    try {
      const response = await fetch(`/api/groups/${id}/song-of-day`);
      if (response.ok) {
        const songs = await response.json();
        setSongsOfTheDay(songs);
      }
    } catch (error) {
      console.error('Error fetching songs of the day:', error);
    }
  };

  const searchSongs = async (query: string) => {
    if (!query.trim()) return;
    
    setSearching(true);
    try {
      const response = await fetch(`/api/spotify/search?q=${encodeURIComponent(query)}&type=track&limit=10`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.tracks.items);
      }
    } catch (error) {
      console.error('Error searching songs:', error);
    } finally {
      setSearching(false);
    }
  };

  const submitSongOfTheDay = async (track: any) => {
    try {
      const response = await fetch(`/api/groups/${id}/song-of-day`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          track: {
            id: track.id,
            name: track.name,
            artist: track.artists[0]?.name,
            albumCover: track.album.images[0]?.url,
            spotifyUrl: track.external_urls.spotify
          }
        }),
      });

      if (response.ok) {
        await fetchSongsOfTheDay();
        setShowSongSearch(false);
        setSearchQuery("");
        setSearchResults([]);
      } else {
        const error = await response.json();
        alert(`Error submitting song: ${error.error}`);
      }
    } catch (error) {
      console.error('Error submitting song:', error);
      alert('Failed to submit song. Please try again.');
    }
  };

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
            <h1 className="text-2xl font-bold text-yellow-300">{group?.name || 'Loading...'}</h1>
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
                  {member.topTracks && member.topTracks.length > 0 ? (
                    member.topTracks.map((track) => (
                      <div key={track.id} className="flex-shrink-0 w-48">
                        <div className="relative">
                          <Image
                            src={track.album.images[0]?.url || '/placeholder-album.png'}
                            alt={`${track.name} album cover`}
                            width={192}
                            height={192}
                            className="rounded-lg"
                          />
                        </div>
                        <div className="mt-2">
                          <p className="font-medium truncate">{track.name}</p>
                          <p className="text-sm text-gray-300 truncate">{track.artists[0]?.name}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400 text-sm">No tracks available</div>
                  )}
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
            <button 
              onClick={() => setShowSongSearch(!showSongSearch)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              {showSongSearch ? 'Cancel' : 'Submit Song'}
            </button>
          </div>

          {/* Song Search Modal */}
          {showSongSearch && (
            <div className="mb-6 p-6 bg-gray-900 rounded-lg border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Search and Submit a Song</h3>
              <div className="flex gap-4 mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchSongs(searchQuery)}
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#1DB954] focus:border-transparent"
                  placeholder="Search for a song..."
                />
                <button
                  onClick={() => searchSongs(searchQuery)}
                  disabled={searching || !searchQuery.trim()}
                  className="px-6 py-2 bg-[#1DB954] hover:bg-[#1ed760] disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
                >
                  {searching ? 'Searching...' : 'Search'}
                </button>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {searchResults.map((track) => (
                    <div
                      key={track.id}
                      className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer"
                      onClick={() => submitSongOfTheDay(track)}
                    >
                      <Image
                        src={track.album.images[0]?.url || '/placeholder-album.png'}
                        alt={`${track.name} album cover`}
                        width={40}
                        height={40}
                        className="rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{track.name}</p>
                        <p className="text-sm text-gray-400 truncate">{track.artists[0]?.name}</p>
                      </div>
                      <div className="text-[#1DB954]">+</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Songs of the Day Display */}
          <div className="flex gap-4 overflow-x-auto pb-4">
            {songsOfTheDay.length > 0 ? (
              songsOfTheDay.map((song) => (
                <div key={song.id} className="flex-shrink-0 w-48">
                  <div className="relative">
                    <Image
                      src={song.track.albumCover || '/placeholder-album.png'}
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
              ))
            ) : (
              <div className="text-gray-400 text-sm">No songs submitted yet</div>
            )}
          </div>
        </section>

        {/* 4. Recently Released */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Recently Released</h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {recentReleases.length > 0 ? (
              recentReleases.map((release) => (
                <div key={release.id} className="flex-shrink-0 w-48">
                  <div className="relative">
                    <Image
                      src={release.albumCover || '/placeholder-album.png'}
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
              ))
            ) : (
              <div className="text-gray-400 text-sm">Loading recent releases...</div>
            )}
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
