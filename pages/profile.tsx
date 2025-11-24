import Head from "next/head";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import type { GetServerSideProps } from "next";
import { authOptions } from "./api/auth/[...nextauth]";
import { fetchTopArtist } from "../lib/spotify";

type ProfileProps = {
  userName: string;
  topArtist: string | null;
  error: string | null;
};

export default function Profile({ userName, topArtist, error }: ProfileProps) {
  return (
    <>
      <Head>
        <title>Your Spotify Profile</title>
      </Head>
      <main className="flex flex-col items-center justify-center min-h-screen gap-8 px-6 bg-[#0b1021] text-white">
        <div className="text-center space-y-2">
          <p className="text-sm text-slate-400">Connection status</p>
          <h1 className="text-4xl font-bold">Welcome, {userName}</h1>
        </div>

        <div className="rounded-2xl bg-slate-900/60 p-6 shadow-xl min-w-[320px] space-y-3">
          <p className="text-slate-300">
            {error
              ? "We could not read your data from Spotify."
              : "We fetched this from your Spotify profile:"}
          </p>
          <div className="rounded-xl border border-slate-700 bg-slate-800/70 p-4">
            <p className="text-sm text-slate-400">Top artist</p>
            <p className="text-2xl font-semibold">
              {error ? "N/A" : topArtist ?? "No top artist available yet"}
            </p>
          </div>
          {error && <p className="text-sm text-amber-400">Error: {error}</p>}
        </div>

        <div className="flex gap-4">
          <Link
            href="/"
            className="rounded-full border border-slate-600 px-5 py-3 text-slate-200 transition hover:bg-slate-800/60"
          >
            Back home
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="rounded-full bg-[#1DB954] px-5 py-3 font-semibold text-black shadow-lg transition hover:scale-105"
          >
            Sign out
          </button>
        </div>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<ProfileProps> = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  let topArtist: string | null = null;
  let error: string | null = session.error ?? null;

  if (!session.accessToken) {
    error = "Missing access token";
  } else if (!error) {
    topArtist = await fetchTopArtist(session.accessToken);
    if (!topArtist) {
      error = "Spotify did not return a top artist.";
    }
  }

  return {
    props: {
      userName: session.user?.name ?? "Spotify listener",
      topArtist,
      error,
    },
  };
};
