export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{
    id: string;
    name: string;
  }>;
  album: {
    id: string;
    name: string;
    images: Array<{
      url: string;
      height: number;
      width: number;
    }>;
  };
  duration_ms: number;
  popularity: number;
  preview_url: string | null;
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyArtist {
  id: string;
  name: string;
  genres: string[];
  images: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  popularity: number;
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyTopTracksResponse {
  items: SpotifyTrack[];
  total: number;
  limit: number;
  offset: number;
  href: string;
  next: string | null;
  previous: string | null;
}

export interface SpotifyTopArtistsResponse {
  items: SpotifyArtist[];
  total: number;
  limit: number;
  offset: number;
  href: string;
  next: string | null;
  previous: string | null;
}

/**
 * Fetch user's top tracks from Spotify API
 */
export async function fetchTopTracks(
  accessToken: string,
  timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term',
  limit: number = 20
): Promise<SpotifyTopTracksResponse> {
  const response = await fetch(
    `https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch top tracks: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch user's top artists from Spotify API
 */
export async function fetchTopArtists(
  accessToken: string,
  timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term',
  limit: number = 20
): Promise<SpotifyTopArtistsResponse> {
  const response = await fetch(
    `https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch top artists: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get user's profile information
 */
export async function fetchUserProfile(accessToken: string) {
  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user profile: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Search for tracks on Spotify
 */
export async function searchTracks(
  accessToken: string,
  query: string,
  limit: number = 20
) {
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to search tracks: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get track recommendations based on seed artists/tracks
 */
export async function getRecommendations(
  accessToken: string,
  seedArtists?: string[],
  seedTracks?: string[],
  seedGenres?: string[],
  limit: number = 20
) {
  const params = new URLSearchParams();
  
  if (seedArtists?.length) {
    params.append('seed_artists', seedArtists.join(','));
  }
  if (seedTracks?.length) {
    params.append('seed_tracks', seedTracks.join(','));
  }
  if (seedGenres?.length) {
    params.append('seed_genres', seedGenres.join(','));
  }
  
  params.append('limit', limit.toString());

  const response = await fetch(
    `https://api.spotify.com/v1/recommendations?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to get recommendations: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Get new releases from Spotify
 */
export async function getNewReleases(
  accessToken: string,
  country: string = 'US',
  limit: number = 20
) {
  const response = await fetch(
    `https://api.spotify.com/v1/browse/new-releases?country=${country}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to get new releases: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Format duration from milliseconds to MM:SS
 */
export function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Get the best quality image from an array of Spotify images
 */
export function getBestImage(images: Array<{ url: string; height: number; width: number }>): string | null {
  if (!images || images.length === 0) return null;
  
  // Sort by size (largest first) and return the first one
  return images.sort((a, b) => (b.height * b.width) - (a.height * a.width))[0]?.url || null;
}
