import NextAuth, { type NextAuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { refreshAccessToken, type SpotifyToken } from "../../../lib/spotify";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    accessTokenExpires?: number;
    error?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    accessTokenExpires?: number;
    refreshToken?: string;
    error?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID ?? "",
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          scope: "user-read-email user-top-read user-read-private",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        const now = Date.now();
        const expiresInMs = Number(account.expires_in ?? 0) * 1000;

        return {
          ...token,
          user,
          accessToken: account.access_token,
          accessTokenExpires: account.expires_at
            ? account.expires_at * 1000
            : now + expiresInMs,
          refreshToken: account.refresh_token,
        };
      }

      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token;
      }

      return refreshAccessToken(token as SpotifyToken);
    },
    async session({ session, token }) {
      session.user = token.user as typeof session.user;
      session.accessToken = token.accessToken;
      session.accessTokenExpires = token.accessTokenExpires;
      session.error = token.error;
      return session;
    },
  },
};

export default NextAuth(authOptions);
