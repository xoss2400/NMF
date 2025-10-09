import React from 'react';

interface HorizontalScrollerProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function HorizontalScroller({ title, children, className = "" }: HorizontalScrollerProps) {
  return (
    <section className={`mb-8 ${className}`}>
      {title && <h2 className="text-2xl font-bold mb-4 text-white">{title}</h2>}
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory px-2">
          {children}
        </div>
      </div>
    </section>
  );
}

// Track Card Component
interface TrackCardProps {
  track: {
    id: string;
    name: string;
    artists: Array<{ name: string }>;
    album: {
      images: Array<{ url: string }>;
    };
  };
  className?: string;
}

export function TrackCard({ track, className = "w-40" }: TrackCardProps) {
  return (
    <div className={`flex-shrink-0 ${className} snap-center`}>
      <div className="relative group">
        <img
          src={track.album.images[0]?.url || '/placeholder-album.png'}
          alt={track.name}
          className="w-full aspect-square rounded-xl object-cover hover:scale-105 transition-transform duration-200 hover:shadow-lg"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-xl"></div>
      </div>
      <p className="mt-2 text-sm font-medium truncate text-white">{track.name}</p>
      <p className="text-xs text-gray-400 truncate">{track.artists[0]?.name}</p>
    </div>
  );
}

// Artist Card Component
interface ArtistCardProps {
  artist: {
    id: string;
    name: string;
    images: Array<{ url: string }>;
  };
  className?: string;
}

export function ArtistCard({ artist, className = "w-40" }: ArtistCardProps) {
  return (
    <div className={`flex-shrink-0 ${className} snap-center`}>
      <div className="relative group">
        <img
          src={artist.images[0]?.url || '/placeholder-artist.png'}
          alt={artist.name}
          className="w-full aspect-square rounded-full object-cover hover:scale-105 transition-transform duration-200 hover:shadow-lg"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-full"></div>
      </div>
      <p className="mt-2 text-sm font-medium truncate text-white">{artist.name}</p>
    </div>
  );
}

// Genre Chip Component
interface GenreChipProps {
  genre: string;
  index?: number;
}

export function GenreChip({ genre, index }: GenreChipProps) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#1DB954] text-black flex-shrink-0 snap-center">
      {index !== undefined && `#${index + 1} `}{genre}
    </span>
  );
}

// Song of the Day Card Component
interface SongOfDayCardProps {
  song: {
    id: string;
    track: {
      name: string;
      artist: string;
      albumCover: string;
    };
    submittedBy: string;
  };
  className?: string;
}

export function SongOfDayCard({ song, className = "w-40" }: SongOfDayCardProps) {
  return (
    <div className={`flex-shrink-0 ${className} snap-center`}>
      <div className="relative group">
        <img
          src={song.track.albumCover || '/placeholder-album.png'}
          alt={song.track.name}
          className="w-full aspect-square rounded-xl object-cover hover:scale-105 transition-transform duration-200 hover:shadow-lg"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-xl"></div>
      </div>
      <p className="mt-2 text-sm font-medium truncate text-white">{song.track.name}</p>
      <p className="text-xs text-gray-400 truncate">{song.track.artist}</p>
      <p className="text-xs text-[#1DB954] truncate">by {song.submittedBy}</p>
    </div>
  );
}

// Release Card Component
interface ReleaseCardProps {
  release: {
    id: string;
    name: string;
    artist: string;
    albumCover: string;
    releaseDate: string;
    type: 'album' | 'single';
  };
  className?: string;
}

export function ReleaseCard({ release, className = "w-40" }: ReleaseCardProps) {
  return (
    <div className={`flex-shrink-0 ${className} snap-center`}>
      <div className="relative group">
        <img
          src={release.albumCover || '/placeholder-album.png'}
          alt={release.name}
          className="w-full aspect-square rounded-xl object-cover hover:scale-105 transition-transform duration-200 hover:shadow-lg"
        />
        <div className="absolute top-2 right-2 bg-black bg-opacity-75 px-2 py-1 rounded text-xs text-white">
          {release.type}
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-xl"></div>
      </div>
      <p className="mt-2 text-sm font-medium truncate text-white">{release.name}</p>
      <p className="text-xs text-gray-400 truncate">{release.artist}</p>
      <p className="text-xs text-gray-500 mt-1">
        {new Date(release.releaseDate).toLocaleDateString()}
      </p>
    </div>
  );
}

// Upcoming Release Card Component (larger)
interface UpcomingReleaseCardProps {
  release: {
    id: string;
    name: string;
    artist: string;
    cover?: string;
    releaseDate: string;
    recommendationRating: number;
    type: 'album' | 'single';
  };
  className?: string;
}

export function UpcomingReleaseCard({ release, className = "w-56" }: UpcomingReleaseCardProps) {
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
      <p className="text-xs text-gray-500 mt-1">
        {new Date(release.releaseDate).toLocaleDateString()}
      </p>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-xs text-gray-400">Recommendation:</span>
        <div className="flex">
          {renderStars(release.recommendationRating)}
        </div>
      </div>
    </div>
  );
}
