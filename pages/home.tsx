'use client'
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface JoinGroupModalProps {
  onJoin: () => void;
}

function JoinGroupModal({ onJoin }: JoinGroupModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [groupId, setGroupId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupId.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/groups/${groupId}`, {
        method: 'POST',
      });

      if (response.ok) {
        onJoin();
        setIsOpen(false);
        setGroupId("");
      } else {
        const error = await response.json();
        alert(`Error joining group: ${error.error}`);
      }
    } catch (error) {
      console.error('Error joining group:', error);
      alert('Failed to join group. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
      >
        Join Group
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Join a Group</h3>
            <form onSubmit={handleJoin}>
              <div className="mb-4">
                <label htmlFor="groupId" className="block text-sm font-medium mb-2">
                  Group ID
                </label>
                <input
                  type="text"
                  id="groupId"
                  value={groupId}
                  onChange={(e) => setGroupId(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#1DB954] focus:border-transparent"
                  placeholder="Enter group ID"
                  required
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading || !groupId.trim()}
                  className="flex-1 px-4 py-2 bg-[#1DB954] hover:bg-[#1ed760] disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
                >
                  {loading ? "Joining..." : "Join Group"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

interface Group {
  id: string;
  name: string;
  memberCount: number;
  createdAt: string;
}

interface UserProfile {
  tracks: any[];
  artists: any[];
  genres: string[];
  user: {
    name: string;
    email: string;
    image?: string;
  };
}

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchUserGroups();
      fetchUserProfile();
    }
  }, [status]);

  const fetchUserGroups = async () => {
    try {
      const response = await fetch('/api/groups');
      if (response.ok) {
        const userGroups = await response.json();
        setGroups(userGroups.map((group: any) => ({
          id: group.id,
          name: group.name,
          memberCount: group.members.length,
          createdAt: group.createdAt
        })));
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const profile = await response.json();
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setProfileLoading(false);
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

  return (
    <div className="min-h-screen bg-[#191414] text-white">
      {/* Header */}
      <div className="border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-yellow-300">New Music Friday</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-white">
              Welcome, {session?.user?.name || session?.user?.email}
            </span>
            <button
              onClick={() => router.push("/api/auth/signout")}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8">
        {/* User's Music Profile */}
        {profileLoading ? (
          <div className="mb-8 p-6 bg-gray-900 rounded-lg">
            <div className="text-white">Loading your music profile...</div>
          </div>
        ) : userProfile && (
          <div className="mb-8 p-6 bg-gray-900 rounded-lg border border-gray-800">
            <h2 className="text-2xl font-bold mb-4">Your Music Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Top Tracks</h3>
                <div className="space-y-2">
                  {userProfile.tracks.slice(0, 3).map((track: any) => (
                    <div key={track.id} className="flex items-center gap-3">
                      <Image
                        src={track.album.images[0]?.url || '/placeholder-album.png'}
                        alt={`${track.name} album cover`}
                        width={40}
                        height={40}
                        className="rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{track.name}</p>
                        <p className="text-xs text-gray-400 truncate">{track.artists[0]?.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Top Artists</h3>
                <div className="space-y-2">
                  {userProfile.artists.slice(0, 3).map((artist: any) => (
                    <div key={artist.id} className="flex items-center gap-3">
                      <Image
                        src={artist.images[0]?.url || '/placeholder-artist.png'}
                        alt={`${artist.name} profile`}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{artist.name}</p>
                        <p className="text-xs text-gray-400 truncate">{artist.genres[0]}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Top Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {userProfile.genres.slice(0, 5).map((genre: string) => (
                    <span
                      key={genre}
                      className="px-2 py-1 bg-[#1DB954] text-black text-xs font-medium rounded-full"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Your Groups</h2>
          <div className="flex gap-4">
            <JoinGroupModal onJoin={fetchUserGroups} />
            <Link
              href="/groups"
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
            >
              View All Groups
            </Link>
            <Link
              href="/groups/new"
              className="px-6 py-3 bg-[#1DB954] hover:bg-[#1ed760] rounded-lg font-semibold transition-colors"
            >
              Create New Group
            </Link>
          </div>
        </div>

        {/* Groups Grid */}
        {groups.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎵</div>
            <h3 className="text-xl font-semibold mb-2">No groups yet</h3>
            <p className="text-white mb-6">
              Create your first group to start discovering music with friends!
            </p>
            <Link
              href="/groups/new"
              className="px-6 py-3 bg-[#1DB954] hover:bg-[#1ed760] rounded-lg font-semibold transition-colors"
            >
              Create Your First Group
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <Link
                key={group.id}
                href={`/groups/${group.id}`}
                className="block p-6 bg-gray-900 hover:bg-gray-800 rounded-lg border border-gray-800 transition-colors"
              >
                <h3 className="text-xl font-semibold mb-2">{group.name}</h3>
                <p className="text-white text-sm mb-4">
                  {group.memberCount} member{group.memberCount !== 1 ? 's' : ''}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-300">
                    Created {new Date(group.createdAt).toLocaleDateString()}
                  </span>
                  <div className="text-[#1DB954]">→</div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-gray-900 rounded-lg border border-gray-800">
            <h3 className="text-lg font-semibold mb-2">Total Groups</h3>
            <p className="text-3xl font-bold text-[#1DB954]">{groups.length}</p>
          </div>
          <div className="p-6 bg-gray-900 rounded-lg border border-gray-800">
            <h3 className="text-lg font-semibold mb-2">Total Members</h3>
            <p className="text-3xl font-bold text-[#1DB954]">
              {groups.reduce((sum, group) => sum + group.memberCount, 0)}
            </p>
          </div>
          <div className="p-6 bg-gray-900 rounded-lg border border-gray-800">
            <h3 className="text-lg font-semibold mb-2">Songs Discovered</h3>
            <p className="text-3xl font-bold text-[#1DB954]">0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
