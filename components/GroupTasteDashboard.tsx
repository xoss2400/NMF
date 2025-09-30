'use client'

import React from 'react'
import type { GroupProfile } from '../lib/groupProfile'

type Props = {
  profile: GroupProfile
}

export default function GroupTasteDashboard({ profile }: Props) {
  const mood = profile.moodCluster

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-center">🎧 Group Taste Summary</h1>
        <p className="text-center text-gray-600">What your group is vibing with right now</p>
      </div>

      {/* Genres */}
      <section className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="text-xl font-semibold">Dominant Genres</h2>
        <div className="flex flex-wrap gap-2">
          {profile.dominantGenres.map((genre) => (
            <span key={genre} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {genre}
            </span>
          ))}
        </div>
      </section>

      {/* Mood Cluster */}
      <section className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="text-xl font-semibold">Group Mood Cluster</h2>
        <div className="space-y-3">
          {[
            { label: 'Danceability', value: mood.avgDanceability },
            { label: 'Energy', value: mood.avgEnergy },
            { label: 'Valence (Positivity)', value: mood.avgValence },
            { label: 'Tempo', value: mood.avgTempo / 200 }, // Normalize tempo a bit
          ].map(({ label, value }) => (
            <div key={label}>
              <div className="flex justify-between text-sm font-medium">
                <span>{label}</span>
                <span>{(value * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded">
                <div
                  className="h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded"
                  style={{ width: `${value * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Top Artists */}
      <section className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="text-xl font-semibold">Top Artists by Affinity</h2>
        <div className="space-y-4">
          {profile.topArtistsByAffinity.map((artist) => (
            <div
              key={artist.id}
              className="p-4 border border-gray-200 rounded-lg hover:shadow transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">{artist.name}</h3>
                  <p className="text-sm text-gray-500">{artist.reason}</p>
                </div>
                <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">
                  {artist.affinityScore.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
