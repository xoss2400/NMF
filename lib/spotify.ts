import querystring from "querystring";


// UserTaste type for group profile
export type UserTaste = {
  userId: string;
  topArtists: FullArtistProfile[];
};

// Fetch a user's top artists and build a UserTaste object
export async function fetchUserTaste(accessToken: string, userId: string): Promise<UserTaste> {
  // 1. Fetch user's top artists
  const topArtistsRes = await fetch('https://api.spotify.com/v1/me/top/artists?limit=10', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const topArtistsData = await topArtistsRes.json();
  const topArtistIds = (topArtistsData.items || []).map((artist: any) => artist.id);
  if (!topArtistIds.length) {
    return { userId, topArtists: [] };
  }
  // 2. Fetch full artist profiles in batch
  const artistProfiles = await fetchFullArtistProfiles(topArtistIds, accessToken);
  return {
    userId,
    topArtists: artistProfiles,
  };
}

export const getAccessToken = async (refreshToken: string) => {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(
          process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET
        ).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: querystring.stringify({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  return response.json();
};

// Types for richer artist profile
export type FullArtistProfile = {
  id: string;
  name: string;
  genres: string[];
  relatedArtists: { id: string; name: string }[];
  topTracks: {
    id: string;
    name: string;
    audioFeatures: {
      danceability: number;
      energy: number;
      valence: number;
      acousticness: number;
      tempo: number;
    };
  }[];
};

// Batch fetch full artist profiles for an array of artist IDs
export async function fetchFullArtistProfiles(artistIds: string[], accessToken: string): Promise<FullArtistProfile[]> {
  // 1. Fetch all artist objects (for genres, names)
  const artistsRes = await fetch(`https://api.spotify.com/v1/artists?ids=${artistIds.join(",")}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const artistsData = await artistsRes.json();
  const artists: any[] = artistsData.artists;

  // 2. For each artist, fetch related artists and top tracks
  const profiles = await Promise.all(
    artists.map(async (artist) => {
      // Related artists
      const relatedRes = await fetch(`https://api.spotify.com/v1/artists/${artist.id}/related-artists`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const relatedData = await relatedRes.json();
      const relatedArtists = (relatedData.artists || []).map((ra: any) => ({ id: ra.id, name: ra.name }));

      // Top tracks
      const topTracksRes = await fetch(`https://api.spotify.com/v1/artists/${artist.id}/top-tracks?market=US`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const topTracksData = await topTracksRes.json();
      const topTracks = topTracksData.tracks.slice(0, 5) || [];
      const trackIds = topTracks.map((t: any) => t.id);

      // Audio features (batch)
      let audioFeatures: Record<string, any> = {};
      if (trackIds.length > 0) {
        const featuresRes = await fetch(`https://api.spotify.com/v1/audio-features?ids=${trackIds.join(",")}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const featuresData = await featuresRes.json();
        (featuresData.audio_features || []).forEach((af: any) => {
          if (af) audioFeatures[af.id] = af;
        });
      }

      return {
        id: artist.id,
        name: artist.name,
        genres: artist.genres,
        relatedArtists,
        topTracks: topTracks.map((t: any) => ({
          id: t.id,
          name: t.name,
          audioFeatures: audioFeatures[t.id]
            ? {
                danceability: audioFeatures[t.id].danceability,
                energy: audioFeatures[t.id].energy,
                valence: audioFeatures[t.id].valence,
                acousticness: audioFeatures[t.id].acousticness,
                tempo: audioFeatures[t.id].tempo,
              }
            : {},
        })),
      };
    })
  );
  return profiles;
}

export const fetchTopTracks = async (accessToken: string) => {
  const res = await fetch(`https://api.spotify.com/v1/me/top/tracks?limit=10`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return res.json();
};