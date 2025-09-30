'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';

import Recommendations from '../../components/Recommendations';
import GroupTasteLive from '../../components/GroupTasteLive';
import { generateGroupTaste } from '../../lib/groupTaste';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    if (session && (session as any).accessToken) {
      fetch('/api/spotify/top-tracks', {
        headers: {
          Authorization: `Bearer ${(session as any).accessToken}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setTracks(data.items));
    }
  }, [session]);

  if (status === 'loading') {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white text-xl">
        Loading session...
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white">
        <h1 className="text-4xl font-bold mb-6">Welcome to Group Taste</h1>
        <button
          onClick={() => signIn('spotify')}
          className="bg-green-500 hover:bg-green-400 text-black px-8 py-4 rounded-xl text-xl font-semibold shadow-md transition-all"
        >
          Connect Spotify
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white p-6 sm:p-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Your Dashboard</h1>
        <div className="flex gap-4">
          <Link href="/">
            <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md transition">Home</button>
          </Link>
          <button
            onClick={() => signOut()}
            className="bg-red-500 hover:bg-red-400 px-4 py-2 rounded-md transition"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Top Tracks */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Your Top Tracks</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tracks.map((track: any) => (
            <div
              key={track.id}
              className="bg-zinc-800 hover:bg-zinc-700 p-5 rounded-xl transition shadow-md"
            >
              <h3 className="text-lg font-medium">{track.name}</h3>
              <p className="text-sm text-gray-400">{track.artists[0].name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="mb-16">
        {/* <Recommendations userTracks={tracks} /> */}
      </div>

      {/* Group Taste Section */}
      <div className="pb-20">
        <h2 className="text-2xl font-semibold mb-4">Your Group Taste</h2>
        {/* <GroupTasteLive /> */}
      </div>
    </div>
  );
}
