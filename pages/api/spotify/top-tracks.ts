import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchTopTracks } from '../../../lib/spotify';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = req.headers.authorization;
  if (!auth) {
    return res.status(401).json({ error: 'No access token provided' });
  }
  const accessToken = auth.replace('Bearer ', '');
  try {
    const data = await fetchTopTracks(accessToken);
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch top tracks' });
  }
}
