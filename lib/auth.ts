// lib/auth.ts
import SpotifyProvider from "next-auth/providers/spotify";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import { refreshAccessToken, type SpotifyToken } from "./spotify";

export const authOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization:
        "https://accounts.spotify.com/authorize?scope=user-top-read,user-read-email,user-read-private",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // Explicit : any to avoid implicit-any error
    async jwt({ token, account, user }: any) {
      // Initial sign-in
      if (account && user) {
        const expiresInMs = Number(account.expires_in ?? 0) * 1000;

        const anyToken = token as any;
        anyToken.user = user;
        anyToken.accessToken = account.access_token;
        anyToken.refreshToken = account.refresh_token ?? anyToken.refreshToken;
        anyToken.accessTokenExpires = account.expires_at
          ? account.expires_at * 1000
          : Date.now() + expiresInMs;

        return anyToken;
      }

      const anyToken = token as any;

      // If still valid, reuse
      if (
        typeof anyToken.accessTokenExpires === "number" &&
        Date.now() < anyToken.accessTokenExpires
      ) {
        return anyToken;
      }

      // Otherwise refresh
      return refreshAccessToken(anyToken as SpotifyToken);
    },

    async session({ session, token }: any) {
      const anyToken = token as any;

      if (session.user) {
        (session as any).accessToken = anyToken.accessToken;
        (session as any).refreshToken = anyToken.refreshToken;
        (session as any).accessTokenExpires = anyToken.accessTokenExpires;
        (session as any).error = anyToken.error;
        session.user = anyToken.user as typeof session.user;
      }

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
