"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type ProfileUser = {
  id: string;
  name: string;
  email: string;
  preferences: string;
  emotionalGoals: string;
  bio: string;
};

export default function ProfilePage() {
  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [loadError, setLoadError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [preferences, setPreferences] = useState("");
  const [emotionalGoals, setEmotionalGoals] = useState("");
  const [bio, setBio] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "success" | "error">(
    "idle",
  );
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoadState("loading");
    setLoadError(null);
    try {
      const res = await fetch("/api/profile", { credentials: "same-origin" });
      const data = (await res.json()) as { user?: ProfileUser; error?: string };
      if (!res.ok || !data.user) {
        setLoadState("error");
        setLoadError(data.error ?? "Could not load profile.");
        return;
      }
      const u = data.user;
      setName(u.name);
      setEmail(u.email);
      setPreferences(u.preferences);
      setEmotionalGoals(u.emotionalGoals);
      setBio(u.bio);
      setLoadState("ready");
    } catch {
      setLoadState("error");
      setLoadError("Network error. Please try again.");
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaveMessage(null);
    if (!name.trim()) {
      setSaveState("error");
      setSaveMessage("Name is required.");
      return;
    }
    setSaveState("saving");
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          name: name.trim(),
          preferences: preferences.trim(),
          emotionalGoals: emotionalGoals.trim(),
          bio: bio.trim(),
        }),
      });

      const data = (await res.json()) as {
        error?: string;
        message?: string;
        fieldErrors?: Record<string, string[] | undefined>;
        formErrors?: string[];
        user?: ProfileUser;
      };

      if (!res.ok) {
        setSaveState("error");
        const parts: string[] = [];
        if (data.fieldErrors) {
          Object.values(data.fieldErrors).forEach((msgs) => {
            msgs?.forEach((m) => parts.push(m));
          });
        }
        if (data.formErrors?.length) parts.push(...data.formErrors);
        setSaveMessage(
          parts.length > 0 ? parts.join(" ") : data.error ?? "Update failed.",
        );
        return;
      }

      setSaveState("success");
      setSaveMessage(data.message ?? "Profile updated.");
      if (data.user) {
        setName(data.user.name);
        setPreferences(data.user.preferences);
        setEmotionalGoals(data.user.emotionalGoals);
        setBio(data.user.bio);
      }
    } catch {
      setSaveState("error");
      setSaveMessage("Network error. Please try again.");
    }
  }

  if (loadState === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f4ef] text-[#1e2a1c]">
        <p className="text-sm text-[#1e2a1c]/70">Loading profile…</p>
      </div>
    );
  }

  if (loadState === "error") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#9cb09d] px-6 text-center text-[#1e2a1c]">
        <p className="text-sm">{loadError}</p>
        <Link
          href="/login"
          className="mt-4 rounded-full bg-[#2d3a2a] px-6 py-2 text-sm text-white"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f4ef] text-[#1e2a1c]">
      <header className="border-b border-[#1e2a1c]/10 bg-white/90 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link href="/" className="font-serif text-lg text-[#2d3a2a]">
            serenemind
          </Link>
          <div className="flex gap-4 text-sm">
            <Link
              href="/dashboard"
              className="text-[#1e2a1c]/80 hover:text-[#1e2a1c]"
            >
              Dashboard
            </Link>
            <Link href="/" className="text-[#1e2a1c]/80 hover:text-[#1e2a1c]">
              Home
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="font-serif text-3xl text-[#1e2a1c]">Your profile</h1>
        <p className="mt-2 text-sm text-[#1e2a1c]/75">
          Tell SereneMind about your preferences and goals so responses can feel
          more personal. Passwords are never shown here.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 rounded-2xl border border-[#1e2a1c]/10 bg-white p-6 shadow-sm"
        >
          {saveMessage && (
            <div
              role="alert"
              className={`rounded-xl border px-4 py-3 text-sm ${
                saveState === "success"
                  ? "border-emerald-700/30 bg-emerald-50 text-emerald-900"
                  : "border-red-700/25 bg-red-50 text-red-900"
              }`}
            >
              {saveMessage}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="profile-name"
                className="mb-1 block text-xs font-medium uppercase tracking-wide text-[#1e2a1c]/60"
              >
                Name
              </label>
              <input
                id="profile-name"
                name="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={120}
                className="w-full rounded-lg border border-[#1e2a1c]/20 bg-white px-3 py-2 text-sm text-[#1e2a1c] outline-none focus:border-[#2d3a2a]"
              />
              <p className="mt-1 text-right text-xs text-[#1e2a1c]/50">
                {name.length}/120
              </p>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-[#1e2a1c]/60">
                Email
              </label>
              <input
                type="email"
                value={email}
                readOnly
                className="w-full cursor-not-allowed rounded-lg border border-[#1e2a1c]/15 bg-[#f7f4ef] px-3 py-2 text-sm text-[#1e2a1c]/80"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="preferences"
              className="mb-1 block text-sm font-medium text-[#1e2a1c]"
            >
              Preferences
            </label>
            <p className="mb-2 text-xs text-[#1e2a1c]/60">
              Topics, tone, or habits you want the experience to respect (max
              500 characters).
            </p>
            <textarea
              id="preferences"
              name="preferences"
              rows={3}
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              maxLength={500}
              className="w-full rounded-lg border border-[#1e2a1c]/20 px-3 py-2 text-sm text-[#1e2a1c] outline-none focus:border-[#2d3a2a]"
            />
            <p className="mt-1 text-right text-xs text-[#1e2a1c]/50">
              {preferences.length}/500
            </p>
          </div>

          <div>
            <label
              htmlFor="emotionalGoals"
              className="mb-1 block text-sm font-medium text-[#1e2a1c]"
            >
              Emotional goals
            </label>
            <p className="mb-2 text-xs text-[#1e2a1c]/60">
              What you are working toward emotionally (max 1000 characters).
            </p>
            <textarea
              id="emotionalGoals"
              name="emotionalGoals"
              rows={4}
              value={emotionalGoals}
              onChange={(e) => setEmotionalGoals(e.target.value)}
              maxLength={1000}
              className="w-full rounded-lg border border-[#1e2a1c]/20 px-3 py-2 text-sm text-[#1e2a1c] outline-none focus:border-[#2d3a2a]"
            />
            <p className="mt-1 text-right text-xs text-[#1e2a1c]/50">
              {emotionalGoals.length}/1000
            </p>
          </div>

          <div>
            <label
              htmlFor="bio"
              className="mb-1 block text-sm font-medium text-[#1e2a1c]"
            >
              Bio <span className="font-normal text-[#1e2a1c]/50">(optional)</span>
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={2000}
              className="w-full rounded-lg border border-[#1e2a1c]/20 px-3 py-2 text-sm text-[#1e2a1c] outline-none focus:border-[#2d3a2a]"
            />
            <p className="mt-1 text-right text-xs text-[#1e2a1c]/50">
              {bio.length}/2000
            </p>
          </div>

          <button
            type="submit"
            disabled={saveState === "saving"}
            className="rounded-full bg-[#2d3a2a] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#1e2a1c] disabled:opacity-60"
          >
            {saveState === "saving" ? "Saving…" : "Save profile"}
          </button>
        </form>
      </main>
    </div>
  );
}
