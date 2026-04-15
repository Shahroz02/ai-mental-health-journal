"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ChatComposer } from "@/components/chat/ChatComposer";
import {
  ChatMessageList,
  type ChatMessage,
} from "@/components/chat/ChatMessageList";
import { postChatMessage } from "@/lib/chat/postChatMessage";
import type { EmotionContextForChat } from "@/lib/services/chat/types";

type JournalEntryResponse = {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  emotion: string | null;
  confidence: number | null;
  emotionMessage: string | null;
};

function buildEmotionPayload(
  latest: JournalEntryResponse | null,
): Partial<EmotionContextForChat> | undefined {
  if (!latest) return undefined;
  if (
    latest.emotion == null &&
    latest.confidence == null &&
    latest.emotionMessage == null
  ) {
    return undefined;
  }
  return {
    emotion: latest.emotion,
    confidence: latest.confidence,
    emotionMessage: latest.emotionMessage,
    journalEntryCreatedAt: latest.createdAt,
  };
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [journalState, setJournalState] = useState<
    "loading" | "ready" | "error"
  >("loading");
  const [journalError, setJournalError] = useState<string | null>(null);
  const [latestEntry, setLatestEntry] = useState<JournalEntryResponse | null>(
    null,
  );
  const [chatError, setChatError] = useState<string | null>(null);

  const loadJournal = useCallback(async () => {
    setJournalState("loading");
    setJournalError(null);
    try {
      const res = await fetch("/api/journal", { credentials: "same-origin" });
      const data = (await res.json()) as {
        error?: string;
        entries?: JournalEntryResponse[];
      };
      if (!res.ok) {
        setJournalState("error");
        setJournalError(data.error ?? "Could not load journal context.");
        setLatestEntry(null);
        return;
      }
      const list = data.entries ?? [];
      setLatestEntry(list[0] ?? null);
      setJournalState("ready");
    } catch {
      setJournalState("error");
      setJournalError("Network error loading journal.");
      setLatestEntry(null);
    }
  }, []);

  useEffect(() => {
    void loadJournal();
  }, [loadJournal]);

  const emotionPayload = useMemo(
    () => buildEmotionPayload(latestEntry),
    [latestEntry],
  );

  async function handleSend() {
    const text = input.trim();
    if (!text || sending) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setChatError(null);
    setSending(true);

    const result = await postChatMessage({
      message: text,
      emotionContext: emotionPayload,
    });

    setSending(false);

    if (!result.ok) {
      setChatError(result.error);
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content: result.data.reply,
      },
    ]);
  }

  const journalBanner =
    journalState === "loading" ? (
      <p className="text-xs text-[#1e2a1c]/55">Loading your journal mood…</p>
    ) : journalState === "error" ? (
      <p className="text-xs text-amber-900/90">
        {journalError ?? "Journal context unavailable."}{" "}
        <button
          type="button"
          onClick={() => void loadJournal()}
          className="font-medium underline underline-offset-2"
        >
          Retry
        </button>
      </p>
    ) : latestEntry?.emotion ? (
      <p className="text-xs text-[#1e2a1c]/70">
        Latest journal mood:{" "}
        <span className="font-medium text-[#1e2a1c]">
          {latestEntry.emotion}
        </span>
        {typeof latestEntry.confidence === "number" && (
          <span className="text-[#1e2a1c]/55">
            {" "}
            · {(latestEntry.confidence * 100).toFixed(0)}% confidence
          </span>
        )}
      </p>
    ) : (
      <p className="text-xs text-[#1e2a1c]/55">
        No journal mood yet—chat still works; add a{" "}
        <Link href="/journal" className="font-medium underline-offset-2 hover:underline">
          journal entry
        </Link>{" "}
        for richer context.
      </p>
    );

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f4ef] text-[#1e2a1c]">
      <header className="border-b border-[#1e2a1c]/10 bg-white/90 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3">
          <div>
            <Link href="/" className="font-serif text-lg text-[#2d3a2a]">
              serenemind
            </Link>
            <h1 className="mt-1 font-serif text-xl text-[#1e2a1c]">
              Support chat
            </h1>
          </div>
          <nav className="flex flex-wrap gap-4 text-sm">
            <Link
              href="/dashboard"
              className="text-[#1e2a1c]/80 hover:text-[#1e2a1c]"
            >
              Dashboard
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
          </nav>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 pb-0 pt-6">
        <div className="mb-4 rounded-2xl border border-[#1e2a1c]/10 bg-white/80 px-4 py-3 shadow-sm">
          <p className="text-sm text-[#1e2a1c]/80">
            Chat with your SereneMind companion. Replies use your recent journal
            mood when available.
          </p>
          <div className="mt-2">{journalBanner}</div>
        </div>

        {chatError && (
          <div
            role="alert"
            className="mb-3 rounded-xl border border-red-700/25 bg-red-50 px-4 py-3 text-sm text-red-900"
          >
            {chatError}
          </div>
        )}

        <ChatMessageList messages={messages} streaming={sending} />
      </div>

      <ChatComposer
        value={input}
        onChange={setInput}
        onSubmit={() => void handleSend()}
        sending={sending}
      />
    </div>
  );
}
