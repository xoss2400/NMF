# Groups API Documentation

## Overview

The Groups API provides endpoints for creating, joining, and managing music groups. It uses in-memory storage for development and is designed to be easily migrated to a database (Prisma/MongoDB) later.

## Data Model

```typescript
interface Group {
  id: string; // UUID generated with crypto.randomUUID()
  name: string; // Group name (required)
  description?: string; // Optional group description
  isPrivate: boolean; // Whether group is private
  members: {
    id: string; // Member UUID
    name: string; // Display name from Spotify
    spotifyId: string; // Spotify user ID (email)
    image?: string; // Profile image from Spotify
    joinedAt: string; // ISO timestamp
  }[];
  songsOfTheDay?: {
    // Future feature
    userId: string;
    songName: string;
    albumCover: string;
    submittedAt: string;
  }[];
  createdAt: string; // ISO timestamp
  createdBy: string; // Spotify ID of creator
}
```

## API Endpoints

### 1. Create Group

**POST** `/api/groups`

**Request Body:**

```json
{
  "name": "My Music Group",
  "description": "Optional description",
  "isPrivate": false
}
```

**Response:**

```json
{
  "id": "uuid-here",
  "name": "My Music Group",
  "description": "Optional description",
  "isPrivate": false,
  "members": [
    {
      "id": "member-uuid",
      "name": "John Doe",
      "spotifyId": "john@example.com",
      "image": "https://...",
      "joinedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "songsOfTheDay": [],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "createdBy": "john@example.com"
}
```

### 2. Get User's Groups

**GET** `/api/groups`

**Response:**

```json
[
  {
    "id": "uuid-here",
    "name": "My Music Group"
    // ... full group object
  }
]
```

### 3. Get Specific Group

**GET** `/api/groups/[id]`

**Response:**

```json
{
  "id": "uuid-here",
  "name": "My Music Group"
  // ... full group object
}
```

**Errors:**

- `404` - Group not found
- `403` - Access denied (not a member)

### 4. Join Group

**POST** `/api/groups/[id]`

**Response:**

```json
{
  "id": "uuid-here",
  "name": "My Music Group",
  "members": [
    // ... existing members plus new member
  ]
  // ... rest of group object
}
```

**Errors:**

- `404` - Group not found
- `400` - Already a member

### 5. Debug Endpoint (Development Only)

**GET** `/api/groups/debug`

Returns all groups in the system. Only available in development mode.

## Authentication

All endpoints require authentication via NextAuth with Spotify. The user's Spotify ID (email) is used as the unique identifier.

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `405` - Method Not Allowed
- `500` - Internal Server Error

## Frontend Integration

### Creating a Group

```typescript
const response = await fetch("/api/groups", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "My Group",
    description: "Optional description",
    isPrivate: false,
  }),
});

if (response.ok) {
  const group = await response.json();
  router.push(`/groups/${group.id}`);
}
```

### Joining a Group

```typescript
const response = await fetch(`/api/groups/${groupId}`, {
  method: "POST",
});

if (response.ok) {
  const group = await response.json();
  router.push(`/groups/${group.id}`);
}
```

## Database Migration Path

The current implementation uses in-memory storage in `lib/groups.ts`. To migrate to a database:

1. Replace the `groups` array with database calls
2. Update the `groupService` methods to use your ORM/database client
3. The API endpoints remain unchanged

Example with Prisma:

```typescript
// lib/groups.ts
import { prisma } from "./prisma";

export const groupService = {
  async createGroup(groupData) {
    return await prisma.group.create({
      data: groupData,
      include: { members: true },
    });
  },
  // ... other methods
};
```

## Testing

1. Start the development server: `npm run dev`
2. Visit `http://localhost:3002/api/groups/debug` to see all groups
3. Use the frontend to create and join groups
4. Verify data persistence during the session
