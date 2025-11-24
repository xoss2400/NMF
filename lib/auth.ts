// lib/auth.ts
import type { NextAuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import { refreshAccessToken, type SpotifyToken } from "./spotify";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any, // small cast to quiet TS
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization:
        "https://accounts.spotify.com/authorize?scope=user-top-read,user-read-email,user-read-private",
    }),
  ],
  session: {
    // we'll use JWT-based sessions; adapter still handles User/Account in DB
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      // Runs on sign-in and subsequent JWT refreshes
      if (account && user) {
        const expiresInMs = Number(account.expires_in ?? 0) * 1000;
        token.user = user;
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token ?? token.refreshToken;
        token.accessTokenExpires = account.expires_at
          ? account.expires_at * 1000
          : Date.now() + expiresInMs;
        return token;
      }

      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token;
      }

      return refreshAccessToken(token as SpotifyToken);
    },
    async session({ session, token }) {
      // Expose useful fields to the client and server
      if (token && session.user) {
        (session as any).accessToken = token.accessToken;
        (session as any).refreshToken = token.refreshToken;
        (session as any).accessTokenExpires = token.accessTokenExpires;
        (session as any).error = token.error;
        session.user = token.user as typeof session.user;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
