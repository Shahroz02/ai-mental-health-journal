import type { EmotionContextForChat } from "./types";

type PartialClient = Partial<EmotionContextForChat>;

/**
 * Server journal snapshot wins for missing fields; explicit client fields override.
 */
export function mergeEmotionContext(
  server: EmotionContextForChat | null,
  client: PartialClient | undefined,
): EmotionContextForChat {
  const base: EmotionContextForChat = server ?? {
    emotion: null,
    confidence: null,
    emotionMessage: null,
    journalEntryCreatedAt: null,
  };
  if (!client) return base;

  return {
    emotion:
      client.emotion !== undefined ? client.emotion : base.emotion,
    confidence:
      client.confidence !== undefined ? client.confidence : base.confidence,
    emotionMessage:
      client.emotionMessage !== undefined
        ? client.emotionMessage
        : base.emotionMessage,
    journalEntryCreatedAt:
      client.journalEntryCreatedAt !== undefined
        ? client.journalEntryCreatedAt
        : base.journalEntryCreatedAt,
  };
}
