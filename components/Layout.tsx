import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";

function IconMusic() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden>
      <path d="M9 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm8-5V5l-7 2v7a3 3 0 1 0 2 0V8l5-1v5a3 3 0 1 0 0 0z" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden>
      <path d="M16 11c1.657 0 3-1.567 3-3.5S17.657 4 16 4s-3 1.567-3 3.5S14.343 11 16 11zM8 11c1.657 0 3-1.567 3-3.5S9.657 4 8 4 5 5.567 5 7.5 6.343 11 8 11zM8 13c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.06 1.16.84 1.97 1.97 1.97 3.44V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
    </svg>
  );
}

function IconHome() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden>
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V9.5z" />
    </svg>
  );
}

function IconLogout() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden>
      <path d="M16 13v-2H7V8l-5 4 5 4v-3zM20 3h-8v2h8v14h-8v2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z" />
    </svg>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session } = useSession();

  const isActive = (path: string) => router.pathname === path;

  return (
    <div className="min-h-screen bg-[#191414] text-white">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .spotify-green { color: #1DB954; }
        .bg-spotify-green { background-color: #1DB954; }
        .hover-scale { transition: transform 0.2s ease-in-out; }
        .hover-scale:hover { transform: scale(1.05); }
      `}</style>

      {/* Global Navigation */}
      <nav className="sticky top-0 z-50 bg-[#191414]/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-spotify-green rounded-full flex items-center justify-center">
                <span className="text-[#191414]"><IconMusic /></span>
              </div>
              <span className="text-xl font-bold hidden sm:block">New Music Friday</span>
              <span className="text-xl font-bold sm:hidden">NMF</span>
            </Link>

            {/* Nav Links */}
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/home" className="flex items-center">
                <button className={`flex items-center gap-2 px-3 py-2 rounded ${isActive('/home') ? 'spotify-green' : 'text-white hover:text-[#1DB954]'}`}>
                  <IconHome />
                  <span className="hidden sm:inline">Home</span>
                </button>
              </Link>

              <Link href="/groups" className="flex items-center">
                <button className={`flex items-center gap-2 px-3 py-2 rounded ${isActive('/groups') ? 'spotify-green' : 'text-white hover:text-[#1DB954]'}`}>
                  <IconUsers />
                  <span className="hidden sm:inline">Groups</span>
                </button>
              </Link>

              {session?.user && (
                <div className="flex items-center gap-3 ml-2 pl-2 border-l border-gray-700">
                  <div className="hidden sm:flex items-center gap-2">
                    {session.user.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={session.user.image} alt={session.user.name || ''} className="w-8 h-8 rounded-full" />
                    ) : (
                      <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">{((session.user.name || session.user.email || '')[0]) || 'U'}</span>
                      </div>
                    )}
                    <span className="text-sm font-medium">{session.user.name || session.user.email}</span>
                  </div>

                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="text-gray-400 hover:text-white px-2 py-2 rounded"
                    aria-label="Sign out"
                  >
                    <IconLogout />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-4rem)]">{children}</main>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-gray-400 text-sm">
          <p>New Music Friday - Demo Version</p>
          <p className="mt-1">Using sample Spotify data for demonstration</p>
        </div>
      </footer>
    </div>
  );
}
