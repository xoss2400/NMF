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

  const { limit = 20, country = 'US' } = req.query;

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/browse/new-releases?country=${country}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch new releases');
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching new releases:', error);
    res.status(500).json({ error: 'Failed to fetch new releases' });
  }
}
