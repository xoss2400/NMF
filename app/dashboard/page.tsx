'use client'

export const dynamic = "force-dynamic";

import { useEffect, useState } from 'react'

import { useSession } from 'next-auth/react'
import Recommendations from '../../components/Recommendations'

export default function Dashboard() {
  const { data: session } = useSession()
  const [tracks, setTracks] = useState([])

  useEffect(() => {
    if (session && (session as any).accessToken) {
      fetch('/api/spotify/top-tracks', {
        headers: {
          Authorization: `Bearer ${(session as any).accessToken}`,
        },
      })
        .then(res => res.json())
        .then(data => setTracks(data.items))
    }
  }, [session])

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Your Top Tracks</h1>
      <ul className="grid grid-cols-2 gap-4">
        {tracks.map((track: any) => (
          <li key={track.id} className="bg-gray-800 p-4 rounded-xl">
            {track.name} — {track.artists[0].name}
          </li>
        ))}
      </ul>

      <Recommendations userTracks={tracks} />
    </div>
  )
}
