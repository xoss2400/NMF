import React from "react";

export default function ArtistCard({ artist }: { artist: any }) {
  return (
    <div className="rounded-lg overflow-hidden bg-gray-800 p-3 flex flex-col items-center">
      <img src={artist.image} alt={artist.name} className="w-24 h-24 object-cover rounded-full" />
      <div className="mt-3 text-sm font-semibold">{artist.name}</div>
    </div>
  );
}
