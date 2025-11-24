// components/AuthButton.tsx
"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading session…</p>;

  if (!session) {
    return <button onClick={() => signIn("spotify")}>Sign in with Spotify</button>;
  }

  return (
    <div>
      <p>Signed in as {session.user?.name}</p>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}
