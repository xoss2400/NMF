'use client'
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Group {
  id: string;
  name: string;
  memberCount: number;
  createdAt: string;
}

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    // Mock data for now - in real app, fetch from API
    const mockGroups: Group[] = [
      { id: "1", name: "College Friends", memberCount: 4, createdAt: "2024-01-15" },
      { id: "2", name: "Work Crew", memberCount: 6, createdAt: "2024-02-01" },
    ];
    setGroups(mockGroups);
    setLoading(false);
  }, []);

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
            <span className="text-sm text-gray-400">
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
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Your Groups</h2>
          <Link
            href="/groups/new"
            className="px-6 py-3 bg-[#1DB954] hover:bg-[#1ed760] rounded-lg font-semibold transition-colors"
          >
            Create New Group
          </Link>
        </div>

        {/* Groups Grid */}
        {groups.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎵</div>
            <h3 className="text-xl font-semibold mb-2">No groups yet</h3>
            <p className="text-gray-400 mb-6">
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
                <p className="text-gray-400 text-sm mb-4">
                  {group.memberCount} member{group.memberCount !== 1 ? 's' : ''}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
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
