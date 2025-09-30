export type Artist = {
  id: string
  name: string
}

export type UserTaste = {
  userId: string
  topArtists: Artist[]
}

export type GroupArtist = {
  id: string
  name: string
  frequency: number
  users: string[]
}

export function generateGroupTaste(users: UserTaste[]): GroupArtist[] {
  const artistMap = new Map<string, GroupArtist>()

  for (const user of users) {
    for (const artist of user.topArtists) {
      const existing = artistMap.get(artist.id)

      if (existing) {
        existing.frequency += 1
        existing.users.push(user.userId)
      } else {
        artistMap.set(artist.id, {
          id: artist.id,
          name: artist.name,
          frequency: 1,
          users: [user.userId],
        })
      }
    }
  }

  // Sort artists by frequency (descending)
  return [...artistMap.values()].sort((a, b) => b.frequency - a.frequency)
}

// Example usage:
/*
const groupTaste = generateGroupTaste([
  {
    userId: 'john',
    topArtists: [
      { id: '1', name: 'Kendrick Lamar' },
      { id: '2', name: 'Phoebe Bridgers' },
      { id: '3', name: 'Frank Ocean' },
    ],
  },
  {
    userId: 'sarah',
    topArtists: [
      { id: '2', name: 'Phoebe Bridgers' },
      { id: '4', name: 'Tyler, The Creator' },
      { id: '1', name: 'Kendrick Lamar' },
    ],
  },
])
console.log(groupTaste)
*/
