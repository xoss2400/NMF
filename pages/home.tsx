import React from "react";
import HorizontalScroller from "../components/shared/HorizontalScroller";
import TrackCard from "../components/cards/TrackCard";
import ArtistCard from "../components/cards/ArtistCard";
import GenreChip from "../components/cards/GenreChip";
import ReleaseCard from "../components/cards/ReleaseCard";
import SongOfDayCard from "../components/cards/SongOfDayCard";

const mockTracks = Array.from({ length: 10 }).map((_, i) => ({ id: i, name: `Track ${i + 1}`, artist: `Artist ${i + 1}`, image: `/images/placeholder-${(i % 5) + 1}.jpg` }));
const mockArtists = Array.from({ length: 8 }).map((_, i) => ({ id: i, name: `Artist ${i + 1}`, image: `/images/artist-${(i % 4) + 1}.jpg` }));
const mockGenres = Array.from({ length: 12 }).map((_, i) => ({ id: i, name: `Genre ${i + 1}` }));
const mockReleases = Array.from({ length: 8 }).map((_, i) => ({ id: i, title: `Release ${i + 1}`, artist: `Artist ${i + 1}`, image: `/images/release-${(i % 4) + 1}.jpg` }));
const mockSOD = { id: 1, title: "Song of the Day", artist: "Featured Artist", image: "/images/placeholder-1.jpg", description: "A curated pick for today." };

export default function Home() {
  return (
    <div>
      <HorizontalScroller title="Top Tracks" items={mockTracks} renderItem={(t: any) => <TrackCard track={t} />} itemWidth="w-44" />

      <HorizontalScroller title="Top Artists" items={mockArtists} renderItem={(a: any) => <ArtistCard artist={a} />} itemWidth="w-40" />

      <HorizontalScroller title="Top Genres" items={mockGenres} renderItem={(g: any) => <GenreChip genre={g} />} itemWidth="w-36" gap="gap-4" />

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Song of the Day</h2>
        <SongOfDayCard sod={mockSOD} />
      </section>

      <HorizontalScroller title="Recently Released" items={mockReleases} renderItem={(r: any) => <ReleaseCard release={r} />} itemWidth="w-44" />
    </div>
  );
}
