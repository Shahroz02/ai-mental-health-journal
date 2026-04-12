import { describe, it, expect } from "vitest";
import { journalCreateSchema } from "./journal";

describe("journalCreateSchema", () => {
  it("accepts non-empty content", () => {
    const r = journalCreateSchema.safeParse({ content: " Feeling better today. " });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.content).toBe("Feeling better today.");
  });

  it("rejects empty content", () => {
    const r = journalCreateSchema.safeParse({ content: "" });
    expect(r.success).toBe(false);
  });

  it("rejects whitespace-only content", () => {
    const r = journalCreateSchema.safeParse({ content: "   \n\t  " });
    expect(r.success).toBe(false);
  });

  it("rejects too long content", () => {
    const r = journalCreateSchema.safeParse({ content: "x".repeat(50_001) });
    expect(r.success).toBe(false);
  });
});
