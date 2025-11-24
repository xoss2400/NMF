"use client";
// app/page.tsx
import { AuthButton } from "@/components/AuthButton";

export default function HomePage() {
  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">New Music Friday · Spotify OAuth demo</p>
        <h1>Connect to Spotify and view your top artist</h1>
        <p className="lede">
          Click the button below to sign in with Spotify. After authorizing, we’ll fetch your
          current top artist and show it here.
        </p>
      </section>

      <AuthButton />

      <style jsx>{`
        .page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          padding: 2rem;
          background: radial-gradient(circle at 20% 20%, #1e293b 0, transparent 30%),
            radial-gradient(circle at 80% 30%, #0ea5e9 0, transparent 25%),
            linear-gradient(135deg, #0b1021, #0f172a 45%, #0b1021);
        }
        .hero {
          max-width: 640px;
          text-align: center;
          color: #e2e8f0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        h1 {
          font-size: clamp(2rem, 3vw, 2.75rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #f8fafc;
        }
        .eyebrow {
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-size: 0.8rem;
          color: #22d3ee;
          font-weight: 700;
        }
        .lede {
          color: #cbd5e1;
          font-size: 1.05rem;
          line-height: 1.6;
        }
      `}</style>
    </main>
  );
}
