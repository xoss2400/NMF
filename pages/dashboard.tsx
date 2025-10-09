'use client'
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else if (status === "authenticated") {
      router.push("/home");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] bg-[#191414]">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return null;
}
// Redirects to /home if authenticated, otherwise to /