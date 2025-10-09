'use client'
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function NewGroupPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    setLoading(true);
    
    // Mock API call - in real app, create group via API
    setTimeout(() => {
      const newGroupId = Math.random().toString(36).substr(2, 9);
      router.push(`/groups/${newGroupId}`);
    }, 1000);
  };

  if (status === "loading") {
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
              className="text-gray-400 hover:text-white transition-colors"
            >
              ← Back to Home
            </Link>
            <h1 className="text-2xl font-bold text-yellow-300">Create New Group</h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="groupName" className="block text-sm font-medium mb-2">
              Group Name *
            </label>
            <input
              type="text"
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#1DB954] focus:border-transparent"
              placeholder="e.g., College Friends, Work Crew, Family"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#1DB954] focus:border-transparent"
              placeholder="Tell your friends what this group is about..."
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPrivate"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="w-4 h-4 text-[#1DB954] bg-gray-900 border-gray-700 rounded focus:ring-[#1DB954]"
            />
            <label htmlFor="isPrivate" className="ml-2 text-sm">
              Private group (invite only)
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading || !groupName.trim()}
              className="flex-1 px-6 py-3 bg-[#1DB954] hover:bg-[#1ed760] disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
            >
              {loading ? "Creating..." : "Create Group"}
            </button>
            <Link
              href="/home"
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>

        {/* Info Section */}
        <div className="mt-12 p-6 bg-gray-900 rounded-lg border border-gray-800">
          <h3 className="text-lg font-semibold mb-3">What happens next?</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• You'll be added as the group admin</li>
            <li>• Share the group code with friends to invite them</li>
            <li>• Start discovering music together with group features</li>
            <li>• Get personalized recommendations based on everyone's taste</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
