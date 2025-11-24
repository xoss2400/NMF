// app/layout.tsx
import "../styles/globals.css";
import type { ReactNode } from "react";
import { getServerSession } from "next-auth/next";
import { Providers } from "./providers";
import { authOptions } from "@/lib/auth";

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Fetch the session on the server so the client starts hydrated (no infinite loading state)
  const session = await getServerSession(authOptions as any);

  return (
    <html lang="en">
      <body>
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
