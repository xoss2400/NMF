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

  const { q, type = 'track', limit = 20 } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(q as string)}&type=${type}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to search Spotify');
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error searching Spotify:', error);
    res.status(500).json({ error: 'Failed to search Spotify' });
  }
}
