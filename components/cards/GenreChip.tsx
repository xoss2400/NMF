import React from "react";

export default function GenreChip({ genre, index }: { genre: any; index?: number }) {
  const label = typeof genre === 'string' ? genre : genre?.name;
  return (
    <div className="px-4 py-2 bg-gray-700 rounded-full text-sm font-medium">
      {index !== undefined ? `#${index + 1} ` : ''}{label}
    </div>
  );
}
