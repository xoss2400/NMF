'use client'

export const dynamic = 'force-dynamic'


import Link from 'next/link'

export default function Home() {
  return (
    <div className="p-10 flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-6">NMF</h1>
      <Link href="/dashboard">
        <button className="bg-green-500 text-black px-6 py-3 rounded-xl text-lg font-semibold">
          Go to Dashboard
        </button>
      </Link>
    </div>
  )
}
