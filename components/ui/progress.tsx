import React from 'react';

export function Progress({ value, className = '' }: { value: number; className?: string }) {
  return (
    <div className={`relative w-full ${className}`} style={{ minWidth: 40 }}>
      <div className="absolute top-0 left-0 h-full bg-green-500 rounded" style={{ width: `${value}%` }} />
      <div className="h-full bg-gray-700 rounded" style={{ width: '100%' }} />
    </div>
  );
}
