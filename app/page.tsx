'use client'

import { signIn } from 'next-auth/react'

export default function Home() {
  return (
    <div className="flex h-screen items-center justify-center bg-black text-white">
      <button
        onClick={() => signIn('spotify')}
        className="bg-green-500 text-black px-6 py-3 rounded-xl text-lg font-semibold"
      >
        Connect Spotify
      </button>
    </div>
  )
}
