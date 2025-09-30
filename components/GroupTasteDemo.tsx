"use client";

import { useState } from "react";
import { generateGroupTaste, UserTaste, Artist } from "../lib/groupTaste";

// Simulated users and their top artists (replace with real fetches later)
const demoUsers = [
  {
    userId: "john",
    topArtists: [
      { id: "1", name: "Kendrick Lamar" },
      { id: "2", name: "Phoebe Bridgers" },
      { id: "3", name: "Frank Ocean" },
    ],
  },
  {
    userId: "sarah",
    topArtists: [
      { id: "2", name: "Phoebe Bridgers" },
      { id: "4", name: "Tyler, The Creator" },
      { id: "1", name: "Kendrick Lamar" },
    ],
  },
  {
    userId: "alex",
    topArtists: [
      { id: "5", name: "SZA" },
      { id: "1", name: "Kendrick Lamar" },
      { id: "3", name: "Frank Ocean" },
    ],
  },
];

export default function GroupTasteDemo() {
  const [userTastes, setUserTastes] = useState<UserTaste[]>([]);

  const addUser = () => {
    if (userTastes.length < demoUsers.length) {
      setUserTastes((prev) => [...prev, demoUsers[prev.length]]);
    }
  };

  const groupTaste = generateGroupTaste(userTastes);

  return (
    <div className="mt-10 p-6 bg-gray-900 rounded-xl">
      <h2 className="text-xl font-bold mb-4">Group Taste Demo</h2>
      <button
        onClick={addUser}
        disabled={userTastes.length >= demoUsers.length}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 disabled:opacity-50"
      >
        Add User
      </button>
      <div className="mb-4">
        <strong>Users in group:</strong>
        <ul className="list-disc ml-6">
          {userTastes.map((u) => (
            <li key={u.userId}>{u.userId}</li>
          ))}
        </ul>
      </div>
      <div>
        <strong>Group Taste:</strong>
        <ul className="list-disc ml-6">
          {groupTaste.map((artist) => (
            <li key={artist.id}>
              {artist.name} (liked by {artist.frequency}): {artist.users.join(", ")}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
