'use client'

export const dynamic = "force-dynamic";

import { useEffect, useState } from 'react'


import { useSession, signIn } from 'next-auth/react'
import Recommendations from '../../components/Recommendations'

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

  return (
    <div className="p-10">
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
        </>
      )}
    </div>
  );
}
