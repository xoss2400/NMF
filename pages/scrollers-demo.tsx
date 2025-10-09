"use client"
import React from 'react'
import HorizontalScroller from '../components/shared/HorizontalScroller'
import TrackCard from '../components/cards/TrackCard'
import ArtistCard from '../components/cards/ArtistCard'
import GenreChip from '../components/cards/GenreChip'
import SongOfDayCard from '../components/cards/SongOfDayCard'
import ReleaseCard from '../components/cards/ReleaseCard'
import UpcomingReleaseCard from '../components/cards/UpcomingReleaseCard'
import Link from 'next/link'

const mockTracks = Array.from({ length: 8 }).map((_, i) => ({
  id: `t-${i}`,
  name: `Track ${i + 1}`,
  artists: [{ name: `Artist ${i + 1}` }],
  album: { images: [{ url: `https://picsum.photos/seed/track${i}/400/400` }] },
}))

const mockGenres = ['indie', 'pop', 'electronic', 'hip-hop', 'rock', 'jazz', 'ambient', 'soul']

const mockSongOfDay = [
  {
    id: 'sod-1',
    track: { name: 'Song of the Day', artist: 'Featured Artist', albumCover: 'https://picsum.photos/seed/sod/400/400' },
    submittedBy: 'Alice',
  },
]

const mockReleases = Array.from({ length: 6 }).map((_, i) => ({
  id: `r-${i}`,
  name: `Release ${i + 1}`,
  artist: `Artist ${i + 1}`,
  albumCover: `https://picsum.photos/seed/release${i}/400/400`,
  releaseDate: new Date(2024, i % 12, 1).toISOString(),
  type: (i % 2 === 0 ? 'album' : 'single') as 'album' | 'single',
}))

const mockUpcoming = Array.from({ length: 5 }).map((_, i) => ({
  id: `u-${i}`,
  name: `Upcoming ${i + 1}`,
  artist: `Artist ${i + 1}`,
  cover: `https://picsum.photos/seed/up${i}/400/400`,
  releaseDate: new Date(2025, (i + 1) % 12, 10 + i).toISOString(),
  recommendationRating: (i % 5) + 1,
  type: 'album' as 'album' | 'single',
}))

export default function ScrollersDemoPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#191414] text-white px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Scroller Demo</h1>
          <Link href="/home" className="px-4 py-2 bg-gray-800 rounded text-sm">Back</Link>
        </div>

        <HorizontalScroller title="Top Songs This Week">
          {mockTracks.map((t) => (
            <TrackCard key={t.id} track={t} />
          ))}
        </HorizontalScroller>

        <HorizontalScroller title="Top Genres">
          {mockGenres.map((g, idx) => (
            <GenreChip key={g} genre={g} index={idx} />
          ))}
        </HorizontalScroller>

        <HorizontalScroller title="Song of the Day">
          {mockSongOfDay.map((s) => (
            <SongOfDayCard key={s.id} song={s} />
          ))}
        </HorizontalScroller>

        <HorizontalScroller title="Recently Released">
          {mockReleases.map((r) => (
            <ReleaseCard key={r.id} release={r} />
          ))}
        </HorizontalScroller>

        <HorizontalScroller title="Upcoming Releases">
          {mockUpcoming.map((u) => (
            <UpcomingReleaseCard key={u.id} release={u} className="w-56" />
          ))}
        </HorizontalScroller>
      </div>
    </div>
  )
}
