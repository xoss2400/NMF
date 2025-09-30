import type { FullArtistProfile } from './spotify';

export type GroupProfile = {
  dominantGenres: string[];
  moodCluster: {
    avgDanceability: number;
    avgEnergy: number;
    avgValence: number;
    avgTempo: number;
  };
  topArtistsByAffinity: {
    id: string;
    name: string;
    affinityScore: number;
    reason: string;
  }[];
};

export function buildGroupProfile(users: { userId: string; topArtists: FullArtistProfile[] }[]): GroupProfile {
  const genreCounts: Record<string, number> = {};
  const audioSums = {
    danceability: 0,
    energy: 0,
    valence: 0,
    tempo: 0,
  };
  let trackCount = 0;

  const artistAffinityMap: Map<string, { id: string; name: string; score: number; reason: string[] }> = new Map();

  for (const user of users) {
    for (const artist of user.topArtists) {
      // 1. Genres
      for (const genre of artist.genres) {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      }

      // 2. Top Tracks' audio features
      for (const track of artist.topTracks) {
        const a = track.audioFeatures;
        if (!a) continue;
        if (typeof a.danceability === 'number') audioSums.danceability += a.danceability;
        if (typeof a.energy === 'number') audioSums.energy += a.energy;
        if (typeof a.valence === 'number') audioSums.valence += a.valence;
        if (typeof a.tempo === 'number') audioSums.tempo += a.tempo;
        trackCount++;
      }

      // 3. Affinity scoring
      const boost = 1.0;
      const key = artist.id;
      if (!artistAffinityMap.has(key)) {
        artistAffinityMap.set(key, {
          id: artist.id,
          name: artist.name,
          score: boost,
          reason: [`Liked by ${user.userId}`],
        });
      } else {
        const existing = artistAffinityMap.get(key)!;
        existing.score += boost;
        existing.reason.push(`Also liked by ${user.userId}`);
      }

      // 4. Related artist scoring
      for (const related of artist.relatedArtists) {
        if (!artistAffinityMap.has(related.id)) {
          artistAffinityMap.set(related.id, {
            id: related.id,
            name: related.name,
            score: 0.5,
            reason: [`Related to ${artist.name}`],
          });
        } else {
          const r = artistAffinityMap.get(related.id)!;
          r.score += 0.5;
          r.reason.push(`Related to ${artist.name}`);
        }
      }
    }
  }

  const dominantGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([genre]) => genre);

  const moodCluster = {
    avgDanceability: trackCount ? audioSums.danceability / trackCount : 0,
    avgEnergy: trackCount ? audioSums.energy / trackCount : 0,
    avgValence: trackCount ? audioSums.valence / trackCount : 0,
    avgTempo: trackCount ? audioSums.tempo / trackCount : 0,
  };

  const topArtistsByAffinity = Array.from(artistAffinityMap.values())
    .filter(a => a.score >= 1.5)
    .sort((a, b) => b.score - a.score)
    .map(a => ({
      id: a.id,
      name: a.name,
      affinityScore: parseFloat(a.score.toFixed(2)),
      reason: a.reason.join(', ')
    }));

  return {
    dominantGenres,
    moodCluster,
    topArtistsByAffinity,
  };
}
