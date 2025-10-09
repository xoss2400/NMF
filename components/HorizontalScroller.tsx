import React, { useRef } from 'react';

interface HorizontalScrollerProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function HorizontalScroller({ title, children, className = "" }: HorizontalScrollerProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const scrollBy = (offset: number) => {
    if (!scrollerRef.current) return;
    scrollerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  return (
    <section className={`mb-8 relative ${className}`}>
      {title && <h2 className="text-2xl font-bold mb-4 text-white">{title}</h2>}
      <div className="max-w-7xl mx-auto relative">
        <button
          aria-label="Scroll left"
          onClick={() => scrollBy(-320)}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70"
        >
          ‹
        </button>

        <button
          aria-label="Scroll right"
          onClick={() => scrollBy(320)}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70"
        >
          ›
        </button>

        <div ref={scrollerRef} className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory px-2">
          {children}
        </div>
      </div>
    </section>
  );
}

// Re-export card components from their new files so imports from the legacy
// path keep working. This keeps backward compatibility while card code lives
// in `components/cards/`.
export { default as TrackCard } from './cards/TrackCard';
export { default as ArtistCard } from './cards/ArtistCard';
export { default as GenreChip } from './cards/GenreChip';
export { default as SongOfDayCard } from './cards/SongOfDayCard';
export { default as ReleaseCard } from './cards/ReleaseCard';
export { default as UpcomingReleaseCard } from './cards/UpcomingReleaseCard';

