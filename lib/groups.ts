import type { Group } from '../pages/api/groups';

// Shared in-memory storage for groups
// This will be replaced with database calls when integrating with Prisma/MongoDB
let groups: Group[] = [];

// Data access layer - abstracted for easy database migration
export const groupService = {
  async createGroup(groupData: Omit<Group, 'id' | 'createdAt' | 'createdBy'>): Promise<Group> {
    const newGroup: Group = {
      ...groupData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      createdBy: '', // Will be set by the handler
    };
    groups.push(newGroup);
    return newGroup;
  },

  async getGroupById(id: string): Promise<Group | null> {
    return groups.find(group => group.id === id) || null;
  },

  async getUserGroups(userSpotifyId: string): Promise<Group[]> {
    return groups.filter(group => 
      group.members.some(member => member.spotifyId === userSpotifyId)
    );
  },

  async getAllGroups(): Promise<Group[]> {
    return groups;
  },

  async addMemberToGroup(groupId: string, member: Group['members'][0]): Promise<Group | null> {
    const group = groups.find(g => g.id === groupId);
    if (!group) return null;
    
    group.members.push(member);
    return group;
  },

  async isUserMember(groupId: string, userSpotifyId: string): Promise<boolean> {
    const group = groups.find(g => g.id === groupId);
    if (!group) return false;
    
    return group.members.some(member => member.spotifyId === userSpotifyId);
  },

  async updateGroup(groupId: string, updates: Partial<Group>): Promise<Group | null> {
    const groupIndex = groups.findIndex(g => g.id === groupId);
    if (groupIndex === -1) return null;
    
    groups[groupIndex] = { ...groups[groupIndex], ...updates };
    return groups[groupIndex];
  },

  async deleteGroup(groupId: string): Promise<boolean> {
    const groupIndex = groups.findIndex(g => g.id === groupId);
    if (groupIndex === -1) return false;
    
    groups.splice(groupIndex, 1);
    return true;
  }
};

// For debugging - expose groups array in development
if (process.env.NODE_ENV === 'development') {
  (global as any).__groups = groups;
}
