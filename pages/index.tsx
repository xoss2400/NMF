import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  const isLoading = status === "loading";

  return (
    <>
      <Head>
        <title>Spotify Connect Starter</title>
      </Head>
      <main className="flex flex-col items-center justify-center min-h-screen gap-6 px-6 bg-gradient-to-br from-[#0f172a] via-[#0b1021] to-[#0a0f1e]">
        <div className="text-center space-y-2">
          <p className="text-sm text-slate-400">Learning demo</p>
          <h1 className="text-4xl font-bold text-white">Connect with Spotify</h1>
          <p className="text-slate-300 max-w-xl">
            Click the button below to sign in with your Spotify account. After authorization,
            we will show your profile name and your current top artist.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            disabled={isLoading}
            onClick={() => signIn("spotify", { callbackUrl: "/profile" })}
            className="rounded-full bg-[#1DB954] px-6 py-3 font-semibold text-black shadow-lg transition hover:scale-105 disabled:opacity-60"
          >
            {session ? "Re-connect Spotify" : "Sign in with Spotify"}
          </button>
          {session && (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="rounded-full border border-slate-500 px-5 py-3 text-slate-200 transition hover:bg-slate-800/40"
            >
              Sign out
            </button>
          )}
        </div>

        {session && (
          <div className="text-slate-200 text-center space-y-2">
            <p>Signed in as <span className="font-semibold">{session.user?.email ?? session.user?.name}</span></p>
            <Link href="/profile" className="text-[#1DB954] underline underline-offset-4">
              Go to your profile overview
            </Link>
          </div>
        )}
      </main>
    </>
  );
}
