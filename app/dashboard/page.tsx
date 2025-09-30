'use client'

export const dynamic = "force-dynamic";

import { useEffect, useState } from 'react'


import { useSession, signIn, signOut } from 'next-auth/react'
import Recommendations from '../../components/Recommendations'
import GroupProfileView from '../../components/GroupProfileView'
import { useEffect, useState } from 'react';
import { fetchUserTaste } from '../../lib/spotify';
import { buildGroupProfile } from '../../lib/groupProfile';
import Link from 'next/link'
import { generateGroupTaste } from '../../lib/groupTaste'

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
        .then(res => res.json())
        .then(data => setTracks(data.items));
    }
  }, [session]);

  if (status === "loading") {
    return <div className="p-10">Loading...</div>;
  }

  // Demo group taste data
  const groupTasteDemo = generateGroupTaste([
    {
      userId: 'john',
      topArtists: [
        { id: '1', name: 'Kendrick Lamar' },
        { id: '2', name: 'Phoebe Bridgers' },
        { id: '3', name: 'Frank Ocean' },
      ],
    },
    {
      userId: 'sarah',
      topArtists: [
        { id: '2', name: 'Phoebe Bridgers' },
        { id: '4', name: 'Tyler, The Creator' },
        { id: '1', name: 'Kendrick Lamar' },
      ],
    },
  ]);

  return (
    <div className="p-10">
      <div className="flex justify-between mb-6">
        <Link href="/">
          <button className="bg-gray-700 text-white px-4 py-2 rounded">Home</button>
        </Link>
        {status === "authenticated" && (
          <button onClick={() => signOut()} className="bg-red-500 text-white px-4 py-2 rounded">Sign Out</button>
        )}
      </div>
      {status === "unauthenticated" ? (
        <div className="flex flex-col items-center justify-center h-full">
          <button
            onClick={() => signIn('spotify')}
            className="bg-green-500 text-black px-6 py-3 rounded-xl text-lg font-semibold mb-4"
          >
            Connect Spotify
          </button>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4">Your Top Tracks</h1>
          <ul className="grid grid-cols-2 gap-4">
            {tracks.map((track: any) => (
              <li key={track.id} className="bg-gray-800 p-4 rounded-xl">
                {track.name} — {track.artists[0].name}
              </li>
            ))}
          </ul>
          <Recommendations userTracks={tracks} />
          {/* Real group profile for current user (or group) */}
          <GroupTasteLive />
        </>
      )}
    </div>
  );
}
