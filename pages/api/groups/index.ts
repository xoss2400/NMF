import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { groupService } from '../../../lib/groups';

export interface Group {
  id: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  members: {
    id: string;
    name: string;
    spotifyId: string;
    image?: string;
    joinedAt: string;
  }[];
  songsOfTheDay?: {
    userId: string;
    songName: string;
    albumCover: string;
    submittedAt: string;
  }[];
  createdAt: string;
  createdBy: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userSpotifyId = session.user?.email || '';
  const userName = session.user?.name || 'Unknown User';
  const userImage = session.user?.image;

  switch (req.method) {
    case 'GET':
      try {
        // Get user's groups
        const userGroups = await groupService.getUserGroups(userSpotifyId);
        res.status(200).json(userGroups);
      } catch (error) {
        console.error('Error fetching user groups:', error);
        res.status(500).json({ error: 'Failed to fetch groups' });
      }
      break;

    case 'POST':
      try {
        // Create new group
        const { name, description, isPrivate } = req.body;
        
        if (!name || !name.trim()) {
          return res.status(400).json({ error: 'Group name is required' });
        }

        const newGroup = await groupService.createGroup({
          name: name.trim(),
          description: description?.trim(),
          isPrivate: isPrivate || false,
          members: [{
            id: crypto.randomUUID(),
            name: userName,
            spotifyId: userSpotifyId,
            image: userImage,
            joinedAt: new Date().toISOString()
          }],
          songsOfTheDay: []
        });

        // Set the creator
        newGroup.createdBy = userSpotifyId;

        res.status(201).json(newGroup);
      } catch (error) {
        console.error('Error creating group:', error);
        res.status(500).json({ error: 'Failed to create group' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
