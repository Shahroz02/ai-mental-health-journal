import { describe, it, expect } from "vitest";
import { analyzeWithMockKeywords } from "./mockKeywordAnalyzer";

describe("analyzeWithMockKeywords (mock)", () => {
  it("detects joyful tone from keywords", async () => {
    const r = await analyzeWithMockKeywords(
      "I feel happy and grateful today!",
    );
    expect(r.emotion).toBe("Joyful");
    expect(r.confidence).toBeGreaterThan(0.4);
    expect(r.message.length).toBeGreaterThan(0);
  });

  it("detects anxious tone", async () => {
    const r = await analyzeWithMockKeywords(
      "I am anxious and stressed about everything.",
    );
    expect(r.emotion).toBe("Anxious");
  });

  it("returns reflective neutral without strong signals", async () => {
    const r = await analyzeWithMockKeywords("Lorem ipsum dolor sit amet.");
    expect(r.emotion).toBe("Reflective");
  });
});
