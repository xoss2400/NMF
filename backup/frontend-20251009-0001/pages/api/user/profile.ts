import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!session.accessToken) {
    return res.status(400).json({ error: 'No access token available' });
  }

  try {
    // Fetch user's top tracks
    const tracksResponse = await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=20', {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    // Fetch user's top artists
    const artistsResponse = await fetch('https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=20', {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!tracksResponse.ok || !artistsResponse.ok) {
      throw new Error('Failed to fetch Spotify data');
    }

    const [tracksData, artistsData] = await Promise.all([
      tracksResponse.json(),
      artistsResponse.json()
    ]);

    // Extract genres from artists
    const genres = artistsData.items
      .flatMap((artist: any) => artist.genres)
      .reduce((acc: Record<string, number>, genre: string) => {
        acc[genre] = (acc[genre] || 0) + 1;
        return acc;
      }, {});

    const topGenres = Object.entries(genres)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 10)
      .map(([genre]) => genre);

    res.status(200).json({
      tracks: tracksData.items,
      artists: artistsData.items,
      genres: topGenres,
      user: {
        name: session.user?.name,
        email: session.user?.email,
        image: session.user?.image
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
}
