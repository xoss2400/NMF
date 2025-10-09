import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { groupService } from '../../../lib/groups';
import type { Group } from './index';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;
  const userSpotifyId = session.user?.email || '';
  const userName = session.user?.name || 'Unknown User';
  const userImage = session.user?.image;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid group ID' });
  }

  switch (req.method) {
    case 'GET':
      try {
        // Get specific group
        const group = await groupService.getGroupById(id);
        if (!group) {
          return res.status(404).json({ error: 'Group not found' });
        }

        // Check if user is a member
        const isMember = await groupService.isUserMember(id, userSpotifyId);
        if (!isMember) {
          return res.status(403).json({ error: 'Access denied. You must be a member to view this group.' });
        }

        res.status(200).json(group);
      } catch (error) {
        console.error('Error fetching group:', error);
        res.status(500).json({ error: 'Failed to fetch group' });
      }
      break;

    case 'POST':
      try {
        // Join group
        const groupToJoin = await groupService.getGroupById(id);
        if (!groupToJoin) {
          return res.status(404).json({ error: 'Group not found' });
        }

        // Check if user is already a member
        const alreadyMember = await groupService.isUserMember(id, userSpotifyId);
        if (alreadyMember) {
          return res.status(400).json({ error: 'Already a member of this group' });
        }

        // Add user to group
        const newMember = {
          id: crypto.randomUUID(),
          name: userName,
          spotifyId: userSpotifyId,
          image: userImage,
          joinedAt: new Date().toISOString()
        };

        const updatedGroup = await groupService.addMemberToGroup(id, newMember);
        if (!updatedGroup) {
          return res.status(500).json({ error: 'Failed to join group' });
        }
        
        res.status(200).json(updatedGroup);
      } catch (error) {
        console.error('Error joining group:', error);
        res.status(500).json({ error: 'Failed to join group' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
