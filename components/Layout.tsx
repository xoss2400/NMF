import React from "react";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-gray-800 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">NMF</Link>
          <nav className="flex gap-4">
            <Link href="/groups">Groups</Link>
            <Link href="/dashboard">Dashboard</Link>
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
      <footer className="border-t border-gray-900 py-6 mt-12 text-center text-sm text-gray-500">© NMF</footer>
    </div>
  );
}
