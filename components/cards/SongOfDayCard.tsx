import React from "react";

export default function SongOfDayCard({ sod, song }: { sod?: any; song?: any }) {
  const data = sod || song;
  if (!data) return null;
  const title = data.title || data.track?.name;
  const artist = data.artist || data.track?.artist;
  const image = data.image || data.track?.albumCover;

  return (
    <div className="rounded-lg overflow-hidden bg-gradient-to-br from-purple-700 to-pink-600 p-4 text-white">
      <div className="flex items-center gap-4">
        <img src={image} alt={title} className="w-20 h-20 object-cover rounded-md" />
        <div>
          <div className="font-bold">{title}</div>
          <div className="text-sm text-gray-200">{artist}</div>
        </div>
      </div>
      {data.description && <p className="mt-3 text-sm text-purple-100">{data.description}</p>}
    </div>
  );
}
