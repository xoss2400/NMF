"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { fetchUserTaste } from "../lib/spotify";
import { buildGroupProfile } from "../lib/groupProfile";
import GroupProfileView from "./GroupProfileView";

export default function GroupTasteLive() {
  const { data: session, status } = useSession();
  const [groupProfile, setGroupProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
  if (!session || !session.accessToken || !session.user) return;
      setLoading(true);
      setError(null);
      try {
        // For now, just use the current user as the group
  // Use email or name as userId fallback
  const userId = session.user.email || session.user.name || 'unknown';
  const userTaste = await fetchUserTaste(session.accessToken, userId);
        const groupProfile = buildGroupProfile([userTaste]);
        setGroupProfile(groupProfile);
      } catch (e: any) {
        setError(e.message || "Failed to load group profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [session]);

  if (loading) return <div className="p-4">Loading group profile...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!groupProfile) return null;
  return <GroupProfileView profile={groupProfile} />;
}