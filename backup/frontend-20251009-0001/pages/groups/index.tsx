'use client'
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Group {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
  createdAt: string;
  isPrivate: boolean;
}

export default function GroupsPage() {
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
    if (status === "authenticated") {
      fetchUserGroups();
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
          description: group.description,
          memberCount: group.members.length,
          createdAt: group.createdAt,
          isPrivate: group.isPrivate
        })));
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
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
          <div className="flex items-center gap-4">
            <Link
              href="/home"
              className="text-white hover:text-yellow-300 transition-colors"
            >
              ← Back to Home
            </Link>
            <h1 className="text-2xl font-bold text-yellow-300">Your Groups</h1>
          </div>
          <Link
            href="/groups/new"
            className="px-6 py-3 bg-[#1DB954] hover:bg-[#1ed760] rounded-lg font-semibold transition-colors"
          >
            Create New Group
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-8">
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
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold">{group.name}</h3>
                  {group.isPrivate && (
                    <span className="px-2 py-1 bg-gray-700 text-xs rounded-full">
                      Private
                    </span>
                  )}
                </div>
                {group.description && (
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                    {group.description}
                  </p>
                )}
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
      </div>
    </div>
  );
}
