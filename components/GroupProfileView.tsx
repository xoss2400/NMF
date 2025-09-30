"use client";

import React from "react";
import type { GroupProfile } from "../lib/groupProfile";

export default function GroupProfileView({ profile }: { profile: GroupProfile }) {
  return (
    <div className="mt-10 p-6 bg-gray-900 rounded-xl">
      <h2 className="text-xl font-bold mb-4">Group Taste Profile</h2>
      {/* Dominant Genres */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Dominant Genres</h3>
        <div className="flex flex-wrap gap-2">
          {profile.dominantGenres.map((genre) => (
            <span key={genre} className="bg-green-700 text-white px-3 py-1 rounded-full text-sm">
              {genre}
            </span>
          ))}
        </div>
      </div>
      {/* Mood Cluster */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Mood Cluster</h3>
        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <span className="text-xs">Danceability</span>
            <div className="w-16 h-3 bg-gray-700 rounded">
              <div
                className="h-3 bg-blue-400 rounded"
                style={{ width: `${Math.round(profile.moodCluster.avgDanceability * 100)}%` }}
              />
            </div>
            <span className="text-xs">{profile.moodCluster.avgDanceability.toFixed(2)}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs">Energy</span>
            <div className="w-16 h-3 bg-gray-700 rounded">
              <div
                className="h-3 bg-yellow-400 rounded"
                style={{ width: `${Math.round(profile.moodCluster.avgEnergy * 100)}%` }}
              />
            </div>
            <span className="text-xs">{profile.moodCluster.avgEnergy.toFixed(2)}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs">Valence</span>
            <div className="w-16 h-3 bg-gray-700 rounded">
              <div
                className="h-3 bg-pink-400 rounded"
                style={{ width: `${Math.round(profile.moodCluster.avgValence * 100)}%` }}
              />
            </div>
            <span className="text-xs">{profile.moodCluster.avgValence.toFixed(2)}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs">Tempo</span>
            <div className="w-16 h-3 bg-gray-700 rounded">
              <div
                className="h-3 bg-purple-400 rounded"
                style={{ width: `${Math.round((profile.moodCluster.avgTempo / 200) * 100)}%` }}
              />
            </div>
            <span className="text-xs">{profile.moodCluster.avgTempo.toFixed(0)} BPM</span>
          </div>
        </div>
      </div>
      {/* Top Artists By Affinity */}
      <div>
        <h3 className="font-semibold mb-2">Top Artists By Affinity</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profile.topArtistsByAffinity.map((artist) => (
            <div key={artist.id} className="bg-gray-800 p-4 rounded-xl flex flex-col gap-2">
              <span className="font-bold text-lg">{artist.name}</span>
              <span className="text-sm text-green-400">Affinity Score: {artist.affinityScore}</span>
              <span className="text-xs text-gray-300">{artist.reason}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
