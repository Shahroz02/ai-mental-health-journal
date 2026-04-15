import type { EmotionContextForChat } from "@/lib/services/chat/types";

export type ChatApiResponse = {
  reply: string;
  emotionContext?: string;
};

export type PostChatPayload = {
  message: string;
  emotionContext?: Partial<EmotionContextForChat>;
};

export async function postChatMessage(
  payload: PostChatPayload,
): Promise<
  | { ok: true; data: ChatApiResponse }
  | { ok: false; status: number; error: string }
> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify({
      message: payload.message,
      ...(payload.emotionContext ? { emotionContext: payload.emotionContext } : {}),
    }),
  });

  const data = (await res.json()) as {
    error?: string;
    reply?: string;
    emotionContext?: string;
    fieldErrors?: { message?: string[] };
  };

  if (!res.ok) {
    const fe = data.fieldErrors?.message?.[0];
    return {
      ok: false,
      status: res.status,
      error: fe ?? data.error ?? "Could not get a reply.",
    };
  }

  if (typeof data.reply !== "string") {
    return {
      ok: false,
      status: res.status,
      error: "Invalid response from server.",
    };
  }

  return {
    ok: true,
    data: {
      reply: data.reply,
      ...(data.emotionContext ? { emotionContext: data.emotionContext } : {}),
    },
  };
}
