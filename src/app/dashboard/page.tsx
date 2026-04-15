"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type MeResponse =
  | { user: { id: string; email: string; name: string } }
  | { error: string };

export default function DashboardPage() {
  const [state, setState] = useState<
    "loading" | "authed" | "unauthorized"
  >("loading");
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/me", { credentials: "same-origin" });
        const data = (await res.json()) as MeResponse;
        if (cancelled) return;
        if (!res.ok || !("user" in data)) {
          setState("unauthorized");
          return;
        }
        setUser(data.user);
        setState("authed");
      } catch {
        if (!cancelled) setState("unauthorized");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (state === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f4ef] text-[#1e2a1c]">
        <p className="text-sm text-[#1e2a1c]/70">Loading…</p>
      </div>
    );
  }

  if (state === "unauthorized") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#9cb09d] px-6 text-center text-[#1e2a1c]">
        <h1 className="font-serif text-2xl">Sign in required</h1>
        <p className="mt-2 max-w-md text-sm text-[#1e2a1c]/80">
          You need to be signed in to view the dashboard.
        </p>
        <Link
          href="/login"
          className="mt-6 rounded-full bg-[#2d3a2a] px-6 py-2 text-sm text-white"
        >
          Go to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f4ef] text-[#1e2a1c]">
      <header className="border-b border-[#1e2a1c]/10 bg-white/80 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
          <Link href="/" className="font-serif text-lg text-[#2d3a2a]">
            serenemind
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link
              href="/chat"
              className="text-[#1e2a1c]/80 hover:text-[#1e2a1c]"
            >
              Chat
            </Link>
            <Link
              href="/journal"
              className="text-[#1e2a1c]/80 hover:text-[#1e2a1c]"
            >
              Journal
            </Link>
            <Link
              href="/profile"
              className="text-[#1e2a1c]/80 hover:text-[#1e2a1c]"
            >
              Profile
            </Link>
            <Link
              href="/"
              className="text-[#1e2a1c]/80 hover:text-[#1e2a1c]"
            >
              Home
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="font-serif text-3xl text-[#1e2a1c]">Dashboard</h1>
        <p className="mt-2 text-[#1e2a1c]/80">
          Signed in as{" "}
          <span className="font-medium text-[#1e2a1c]">{user?.name}</span> (
          {user?.email})
        </p>
        <p className="mt-6 text-sm text-[#1e2a1c]/70">
          <Link href="/journal" className="font-medium underline-offset-2 hover:underline">
            Write a journal entry
          </Link>{" "}
          to record how you feel. More features (avatar, analytics) are coming
          next.
        </p>
      </main>
    </div>
  );
}
