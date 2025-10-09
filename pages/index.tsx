'use client'

import Image from "next/image";
import { signIn } from "next-auth/react";

export default function LandingPage() {
  return (
    <div className="relative flex items-center justify-center min-h-[calc(100vh-4rem)] bg-[#191414] text-white font-sans text-center">

      {/* Neon Title */}
      <h1 className="absolute top-12 text-6xl font-extrabold text-yellow-300 tracking-tight 
        animate-pulse drop-shadow-[0_0_10px_#facc15]">
        New Music Friday
      </h1>

      {/* Buttons Row */}
      <div className="absolute inset-x-0 bottom-[33%] flex justify-center gap-36">

        {/* Spotify Login */}
        <button
          onClick={() => signIn("spotify", { callbackUrl: "/dashboard" })}
          className="p-6 rounded-full bg-[#1DB954] hover:scale-105 transition-all shadow-lg"
        >
          <Image
            src="https://developer-assets.spotifycdn.com/images/guidelines/design/full-logo-framed.svg"
            alt="Spotify Logo"
            width={90}
            height={40}
          />
        </button>

        {/* Apple Music (placeholder) */}
        <button className="px-8 py-4 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-all shadow">
          Apple Music
        </button>

        {/* Learn More (placeholder) */}
        <button className="px-8 py-4 rounded-full bg-white text-black hover:bg-gray-200 transition-all shadow">
          Learn More
        </button>
        
      </div>
    </div>
  );
}
