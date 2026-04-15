"use client";

import { useEffect, useRef } from "react";
import { ChatAvatar } from "./ChatAvatar";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type ChatMessageListProps = {
  messages: ChatMessage[];
  streaming?: boolean;
};

export function ChatMessageList({ messages, streaming }: ChatMessageListProps) {
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, streaming]);

  return (
    <div
      className="flex flex-1 flex-col gap-4 overflow-y-auto px-1 py-2"
      role="log"
      aria-live="polite"
      aria-relevant="additions"
    >
      {messages.length === 0 && (
        <p className="rounded-2xl border border-dashed border-[#1e2a1c]/15 bg-white/50 px-4 py-8 text-center text-sm text-[#1e2a1c]/60">
          Say hello, or share what&apos;s on your mind. I&apos;m here to listen
          and respond with care.
        </p>
      )}

      {messages.map((m) => (
        <div
          key={m.id}
          className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
        >
          <ChatAvatar variant={m.role === "user" ? "user" : "assistant"} />
          <div
            className={`max-w-[min(100%,28rem)] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
              m.role === "user"
                ? "rounded-tr-sm bg-[#2d3a2a] text-white"
                : "rounded-tl-sm border border-[#1e2a1c]/10 bg-white text-[#1e2a1c]/90"
            }`}
          >
            <p className="whitespace-pre-wrap break-words">{m.content}</p>
          </div>
        </div>
      ))}

      {streaming && (
        <div className="flex gap-3">
          <ChatAvatar variant="assistant" />
          <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm border border-[#1e2a1c]/10 bg-white px-4 py-3 text-sm text-[#1e2a1c]/55 shadow-sm">
            <span
              className="inline-flex h-2 w-2 animate-pulse rounded-full bg-[#2d3a2a]/50"
              aria-hidden
            />
            Thinking…
          </div>
        </div>
      )}

      <div ref={endRef} />
    </div>
  );
}
