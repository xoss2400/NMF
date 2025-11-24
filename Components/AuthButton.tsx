// components/AuthButton.tsx
"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export function AuthButton() {
  const { data: session, status } = useSession();

  console.log("session status", status, session); // TEMP for debugging

  if (status === "loading") {
    return <p>Loading session...</p>;
  }

  if (!session) {
    return (
      <button onClick={() => signIn("spotify")}>
        Sign in with Spotify
      </button>
    );
  }

  return (
    <button onClick={() => signOut()}>
      Sign out ({session.user?.name ?? "Spotify user"})
    </button>
  );
}
