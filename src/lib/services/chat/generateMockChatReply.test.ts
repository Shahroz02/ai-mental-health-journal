import { describe, expect, it } from "vitest";
import { generateMockChatReply } from "./generateMockChatReply";

describe("generateMockChatReply", () => {
  it("uses calming tone when journal emotion suggests anxiety", () => {
    const out = generateMockChatReply({
      userMessage: "I feel overwhelmed",
      emotionContext: {
        emotion: "anxious",
        confidence: 0.9,
        emotionMessage: "Signs of worry.",
        journalEntryCreatedAt: null,
      },
    });
    expect(out.reply.toLowerCase()).toMatch(/intense|slow|together|overwhelm/);
    expect(out.emotionContext).toMatch(/journal mood/i);
  });

  it("falls back when no emotion context exists", () => {
    const out = generateMockChatReply({
      userMessage: "Hello",
      emotionContext: {
        emotion: null,
        confidence: null,
        emotionMessage: null,
        journalEntryCreatedAt: null,
      },
    });
    expect(out.reply.length).toBeGreaterThan(10);
    expect(out.emotionContext).toMatch(/no recent journal mood/i);
  });
});
