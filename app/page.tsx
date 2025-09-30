'use client'

export const dynamic = 'force-dynamic'


import Link from 'next/link'

export default function Home() {
  return (
    <div className="p-10 flex flex-col items-center justify-center min-h-screen bg-blue-600">
      <h1 className="text-3xl font-bold mb-6 text-white drop-shadow">NMF</h1>
      <Link href="/dashboard">
        <button className="bg-white text-blue-700 px-6 py-3 rounded-xl text-lg font-semibold shadow-md hover:bg-blue-100 transition">
          Go to Dashboard
        </button>
      </Link>
    </div>
  )
}
