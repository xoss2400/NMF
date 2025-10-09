import React from "react";

export default function UpcomingReleaseCard({ release, className = "w-56" }: any) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-600"}>
        ★
      </span>
    ));
  };

  return (
    <div className={`flex-shrink-0 ${className} snap-center`}>
      <div className="relative group">
        <div className="w-full aspect-square bg-gray-800 rounded-xl flex items-center justify-center overflow-hidden">
          {release.cover ? (
            <img
              src={release.cover}
              alt={release.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200 hover:shadow-lg"
            />
          ) : (
            <div className="text-center">
              <div className="text-6xl mb-2">🎵</div>
              <p className="text-sm text-gray-400">Cover TBA</p>
            </div>
          )}
        </div>
        <div className="absolute top-2 right-2 bg-black bg-opacity-75 px-2 py-1 rounded text-xs text-white">
          {release.type}
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-xl"></div>
      </div>
      <p className="mt-3 text-base font-bold truncate text-white">{release.name}</p>
      <p className="text-sm text-gray-300 truncate">{release.artist}</p>
      <p className="text-xs text-gray-500 mt-1">{new Date(release.releaseDate).toLocaleDateString()}</p>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-xs text-gray-400">Recommendation:</span>
        <div className="flex">{renderStars(release.recommendationRating)}</div>
      </div>
    </div>
  );
}
