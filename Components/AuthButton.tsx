/* Client component that signs in/out and shows top artist */
"use client";

import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

type TopArtistState = {
  value: string | null;
  error: string | null;
  loading: boolean;
};

export function AuthButton() {
  const { data: session, status } = useSession();
  const [artist, setArtist] = useState<TopArtistState>({
    value: null,
    error: null,
    loading: false,
  });

  useEffect(() => {
    if (status !== "authenticated") {
      setArtist({ value: null, error: null, loading: false });
      return;
    }

    setArtist((prev) => ({ ...prev, loading: true, error: null }));

    const load = async () => {
      try {
        const res = await fetch("/api/spotify/top-artist");
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Failed to fetch top artist");
        }
        const data = await res.json();
        setArtist({ value: data.topArtist ?? null, error: null, loading: false });
      } catch (err: any) {
        setArtist({ value: null, error: err?.message ?? "Unknown error", loading: false });
      }
    };

    void load();
  }, [status]);

  if (status === "loading") {
    return <button disabled className="btn">Loading...</button>;
  }

  if (!session) {
    return (
      <button className="btn" onClick={() => signIn("spotify", { callbackUrl: "/" })}>
        Sign in with Spotify
      </button>
    );
  }

  return (
    <div className="card">
      <p className="muted">Signed in as</p>
      <p className="name">{session.user?.name ?? session.user?.email ?? "Spotify user"}</p>

      <div className="top-artist">
        <p className="muted">Top artist</p>
        <p className="value">
          {artist.loading
            ? "Loading..."
            : artist.error
            ? `Error: ${artist.error}`
            : artist.value ?? "No data yet"}
        </p>
      </div>

      <div className="actions">
        <button className="btn outline" onClick={() => signOut({ callbackUrl: "/" })}>
          Sign out
        </button>
      </div>

      <style jsx>{`
        .card {
          background: #0f172a;
          color: #f8fafc;
          border: 1px solid #1e293b;
          padding: 1.5rem;
          border-radius: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          max-width: 360px;
        }
        .muted {
          color: #94a3b8;
          font-size: 0.85rem;
        }
        .name {
          font-size: 1.25rem;
          font-weight: 700;
        }
        .top-artist {
          padding: 1rem;
          border-radius: 0.75rem;
          background: #111827;
          border: 1px solid #1f2937;
        }
        .value {
          font-weight: 600;
          margin-top: 0.25rem;
        }
        .actions {
          display: flex;
          gap: 0.75rem;
          justify-content: flex-start;
        }
        .btn {
          background: #1db954;
          color: #0b1410;
          border: none;
          padding: 0.75rem 1.25rem;
          border-radius: 9999px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 120ms ease, opacity 120ms ease;
        }
        .btn:disabled {
          opacity: 0.6;
          cursor: default;
        }
        .btn:hover:not(:disabled) {
          transform: translateY(-1px);
        }
        .btn.outline {
          background: transparent;
          color: #f8fafc;
          border: 1px solid #334155;
        }
      `}</style>
    </div>
  );
}
