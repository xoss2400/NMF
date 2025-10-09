import React from "react";

export default function ReleaseCard({ release, className = '' }: { release: any; className?: string }) {
  return (
    <div className={`${className} rounded-md overflow-hidden bg-gray-800 p-2`}> 
      <img src={release.image} alt={release.title} className="w-full h-36 object-cover rounded-md" />
      <div className="mt-2">
        <div className="font-semibold text-sm truncate">{release.title}</div>
        <div className="text-xs text-gray-400 truncate">{release.artist}</div>
      </div>
    </div>
  );
}
