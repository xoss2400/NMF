'use client'

import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Progress } from '../components/ui/progress'
import { ScrollArea } from '../components/ui/scroll-area'
import type { GroupProfile } from '../lib/groupProfile'

function MoodBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm text-gray-300">
        <span>{label}</span>
        <span>{Math.round(value * 100)}%</span>
      </div>
      <Progress value={Math.min(value * 100, 100)} className="h-2 bg-gray-700" />
    </div>
  )
}

export default function GroupTasteDashboard({ profile, groupName = 'Group' }: { profile: GroupProfile, groupName?: string }) {
  const mood = profile.moodCluster

  return (
    <ScrollArea className="w-full h-screen p-6 bg-gradient-to-b from-[#1f1f1f] to-[#0f0f0f] text-white font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold tracking-tight text-center">
          {groupName}&apos;s Taste
        </h1>

        {/* Dominant Genres */}
        <Card className="bg-[#2a2a2a] border-none">
          <CardHeader>
            <CardTitle className="text-xl">Dominant Genres</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {profile.dominantGenres.map((genre) => (
              <Badge key={genre} className="bg-teal-600 text-white">
                {genre}
              </Badge>
            ))}
          </CardContent>
        </Card>

        {/* Mood Cluster */}
        <Card className="bg-[#2a2a2a] border-none">
          <CardHeader>
            <CardTitle className="text-xl">Group Mood</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <MoodBar label="Danceability" value={mood.avgDanceability} />
            <MoodBar label="Energy" value={mood.avgEnergy} />
            <MoodBar label="Valence" value={mood.avgValence} />
            <MoodBar label="Tempo" value={mood.avgTempo / 200} />
          </CardContent>
        </Card>

        {/* Top Artists by Affinity */}
        <Card className="bg-[#2a2a2a] border-none">
          <CardHeader>
            <CardTitle className="text-xl">Shared Artists</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.topArtistsByAffinity.map((artist) => (
              <div
                key={artist.id}
                className="p-4 border border-[#3a3a3a] rounded-lg hover:bg-[#3a3a3a] transition"
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium text-lg">{artist.name}</div>
                  <div className="text-sm text-teal-500">
                    Affinity Score: {artist.affinityScore}
                  </div>
                </div>
                <p className="text-sm text-gray-300 mt-1">{artist.reason}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  )
}