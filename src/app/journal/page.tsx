"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type JournalEntryResponse = {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  emotion: string | null;
  confidence: number | null;
  emotionMessage: string | null;
};

type EmotionInsight = {
  emotion: string;
  confidence: number;
  message: string;
};

function formatEntryDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export default function JournalPage() {
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [clientError, setClientError] = useState<string | null>(null);
  const [insight, setInsight] = useState<EmotionInsight | null>(null);

  const [entries, setEntries] = useState<JournalEntryResponse[]>([]);
  const [listStatus, setListStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [listError, setListError] = useState<string | null>(null);

  const loadEntries = useCallback(async (opts?: { silent?: boolean }) => {
    if (!opts?.silent) {
      setListStatus("loading");
    }
    setListError(null);
    try {
      const res = await fetch("/api/journal", { credentials: "same-origin" });
      const data = (await res.json()) as {
        error?: string;
        entries?: JournalEntryResponse[];
      };
      if (!res.ok) {
        setListStatus("error");
        setListError(data.error ?? "Could not load entries.");
        return;
      }
      setEntries(data.entries ?? []);
      setListStatus("ready");
    } catch {
      setListStatus("error");
      setListError("Network error. Please try again.");
    }
  }, []);

  useEffect(() => {
    void loadEntries();
  }, [loadEntries]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setClientError(null);

    const trimmed = content.trim();
    if (!trimmed) {
      setClientError("Please write something before submitting.");
      return;
    }

    setStatus("saving");
    setInsight(null);
    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ content: trimmed }),
      });

      const data = (await res.json()) as {
        error?: string;
        message?: string;
        fieldErrors?: { content?: string[] };
        entry?: JournalEntryResponse;
      };

      if (!res.ok) {
        setStatus("error");
        const fe = data.fieldErrors?.content?.[0];
        setMessage(fe ?? data.error ?? "Could not save your entry.");
        return;
      }

      setStatus("success");
      setMessage(data.message ?? "Journal entry saved.");
      setContent("");

      const e = data.entry;
      if (
        e?.emotion &&
        typeof e.confidence === "number" &&
        e.emotionMessage
      ) {
        setInsight({
          emotion: e.emotion,
          confidence: e.confidence,
          message: e.emotionMessage,
        });
      }

      void loadEntries({ silent: true });
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
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
            <Link
              href="/chat"
              className="text-[#1e2a1c]/80 hover:text-[#1e2a1c]"
            >
              Chat
            </Link>
            <Link
              href="/profile"
              className="text-[#1e2a1c]/80 hover:text-[#1e2a1c]"
            >
              Profile
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="font-serif text-3xl text-[#1e2a1c]">Journal</h1>
        <p className="mt-2 text-sm text-[#1e2a1c]/75">
          A quiet space to note how you feel. Your entries are saved to your
          account only.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-4 rounded-2xl border border-[#1e2a1c]/10 bg-white p-6 shadow-sm"
        >
          {(message || clientError) && (
            <div
              role="alert"
              className={`rounded-xl border px-4 py-3 text-sm ${
                status === "success" && !clientError
                  ? "border-emerald-700/30 bg-emerald-50 text-emerald-900"
                  : "border-red-700/25 bg-red-50 text-red-900"
              }`}
            >
              {clientError ?? message}
            </div>
          )}

          <div>
            <label
              htmlFor="journal-content"
              className="mb-2 block text-sm font-medium text-[#1e2a1c]"
            >
              How are you feeling today?
            </label>
            <textarea
              id="journal-content"
              name="content"
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write freely about your thoughts and emotions…"
              maxLength={50_000}
              className="w-full resize-y rounded-xl border border-[#1e2a1c]/20 bg-[#fdfcfa] px-4 py-3 text-sm leading-relaxed text-[#1e2a1c] shadow-inner outline-none placeholder:text-[#1e2a1c]/40 focus:border-[#2d3a2a] whitespace-pre-wrap break-words"
            />
            <p className="mt-1 text-right text-xs text-[#1e2a1c]/50">
              {content.length.toLocaleString()} / 50,000
            </p>
          </div>

          <button
            type="submit"
            disabled={status === "saving"}
            className="rounded-full bg-[#2d3a2a] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#1e2a1c] disabled:opacity-60"
          >
            {status === "saving" ? "Saving & analyzing…" : "Save entry"}
          </button>
        </form>

        {insight && (
          <aside
            className="mt-6 rounded-2xl border border-[#2d3a2a]/15 bg-gradient-to-br from-[#e8efe8] to-[#f7f4ef] p-6 shadow-sm"
            aria-live="polite"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2d3a2a]/70">
              SereneMind insight
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="inline-flex rounded-full bg-[#2d3a2a] px-3 py-1 text-sm font-medium text-white">
                {insight.emotion}
              </span>
              <span className="text-xs text-[#1e2a1c]/65">
                Confidence:{" "}
                <span className="font-medium text-[#1e2a1c]">
                  {(insight.confidence * 100).toFixed(0)}%
                </span>
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[#1e2a1c]/85">
              {insight.message}
            </p>
            <p className="mt-3 text-[11px] text-[#1e2a1c]/45">
              This reflection is generated to help you notice patterns in your
              writing. It isn&apos;t a clinical assessment.
            </p>
          </aside>
        )}

        <section className="mt-10" aria-labelledby="journal-history-heading">
          <h2
            id="journal-history-heading"
            className="font-serif text-xl text-[#1e2a1c]"
          >
            Your entries
          </h2>
          <p className="mt-1 text-sm text-[#1e2a1c]/65">
            Newest first. Only you can see these.
          </p>

          {listStatus === "loading" && (
            <p className="mt-6 text-sm text-[#1e2a1c]/60">Loading entries…</p>
          )}

          {listStatus === "error" && listError && (
            <div
              role="alert"
              className="mt-6 rounded-xl border border-red-700/25 bg-red-50 px-4 py-3 text-sm text-red-900"
            >
              {listError}
            </div>
          )}

          {listStatus === "ready" && entries.length === 0 && (
            <p className="mt-6 text-sm text-[#1e2a1c]/55">
              No saved entries yet. When you save above, they will appear here.
            </p>
          )}

          {listStatus === "ready" && entries.length > 0 && (
            <ul className="mt-6 space-y-4">
              {entries.map((entry) => (
                <li
                  key={entry.id}
                  className="rounded-2xl border border-[#1e2a1c]/10 bg-white p-5 shadow-sm"
                >
                  <time
                    dateTime={entry.createdAt}
                    className="text-xs text-[#1e2a1c]/55"
                  >
                    {formatEntryDate(entry.createdAt)}
                  </time>
                  <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-relaxed text-[#1e2a1c]/90">
                    {entry.content}
                  </p>
                  <div className="mt-4 border-t border-[#1e2a1c]/08 pt-4 text-sm">
                    <p className="text-[#1e2a1c]/55">
                      <span className="font-medium text-[#1e2a1c]/70">
                        Detected emotion:{" "}
                      </span>
                      {entry.emotion ?? "—"}
                    </p>
                    <p className="mt-2 text-[#1e2a1c]/80 leading-relaxed">
                      <span className="font-medium text-[#1e2a1c]/70">
                        Emotion message:{" "}
                      </span>
                      {entry.emotionMessage ?? "—"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
