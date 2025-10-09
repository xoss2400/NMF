import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';

interface SongOfTheDay {
  id: string;
  track: {
    id: string;
    name: string;
    artist: string;
    albumCover: string;
    spotifyUrl: string;
  };
  submittedBy: string;
  submittedAt: string;
}

// In-memory storage for song of the day submissions
let songSubmissions: Record<string, SongOfTheDay[]> = {};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;

  switch (req.method) {
    case 'GET':
      // Get song of the day submissions for the group
      const submissions = songSubmissions[id as string] || [];
      res.status(200).json(submissions);
      break;

    case 'POST':
      // Submit a song of the day
      const { track } = req.body;
      
      if (!track || !track.id || !track.name || !track.artist) {
        return res.status(400).json({ error: 'Invalid track data' });
      }

      const newSubmission: SongOfTheDay = {
        id: Math.random().toString(36).substr(2, 9),
        track: {
          id: track.id,
          name: track.name,
          artist: track.artist,
          albumCover: track.albumCover || '',
          spotifyUrl: track.spotifyUrl || ''
        },
        submittedBy: session.user?.name || 'Unknown User',
        submittedAt: new Date().toISOString()
      };

      if (!songSubmissions[id as string]) {
        songSubmissions[id as string] = [];
      }

      // Remove any existing submission by this user for today
      const today = new Date().toDateString();
      songSubmissions[id as string] = songSubmissions[id as string].filter(
        submission => !(submission.submittedBy === newSubmission.submittedBy && 
                       new Date(submission.submittedAt).toDateString() === today)
      );

      songSubmissions[id as string].push(newSubmission);
      
      res.status(201).json(newSubmission);
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
