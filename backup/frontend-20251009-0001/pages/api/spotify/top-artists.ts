import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = req.headers.authorization;
  if (!auth) {
    return res.status(401).json({ error: 'No access token provided' });
  }
  const accessToken = auth.replace('Bearer ', '');
  try {
    const response = await fetch('https://api.spotify.com/v1/me/top/artists?limit=10', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch top artists' });
  }
}
