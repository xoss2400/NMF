import React from "react";

export default function TrackCard({ track }: { track: any }) {
  return (
    <div className="rounded-lg overflow-hidden bg-gray-800 p-2">
      <img src={track.image} alt={track.name} className="w-full h-36 object-cover rounded-md" />
      <div className="mt-2">
        <div className="font-semibold text-sm truncate">{track.name}</div>
        <div className="text-xs text-gray-400 truncate">{track.artist}</div>
      </div>
    </div>
  );
}
