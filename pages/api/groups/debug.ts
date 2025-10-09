import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { groupService } from '../../../lib/groups';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return res.status(404).json({ error: 'Not found' });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const allGroups = await groupService.getAllGroups();
    res.status(200).json({
      totalGroups: allGroups.length,
      groups: allGroups
    });
  } catch (error) {
    console.error('Error fetching all groups:', error);
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
}
