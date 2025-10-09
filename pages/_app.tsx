import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <div className="min-h-screen bg-[#191414] text-white font-sans">
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
}
