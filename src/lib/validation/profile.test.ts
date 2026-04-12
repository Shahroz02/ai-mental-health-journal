import { describe, it, expect } from "vitest";
import { profileUpdateSchema } from "./profile";

describe("profileUpdateSchema", () => {
  it("requires name", () => {
    const r = profileUpdateSchema.safeParse({ preferences: "Quiet evenings" });
    expect(r.success).toBe(false);
  });

  it("requires all editable profile fields in payload", () => {
    const r = profileUpdateSchema.safeParse({ name: "Alex Doe" });
    expect(r.success).toBe(false);
  });

  it("accepts name with profile fields", () => {
    const r = profileUpdateSchema.safeParse({
      name: "Alex",
      preferences: "Evenings",
      emotionalGoals: "Calm",
      bio: "Hi",
    });
    expect(r.success).toBe(true);
  });

  it("accepts empty profile strings so clearing persists", () => {
    const r = profileUpdateSchema.safeParse({
      name: "Alex",
      preferences: "",
      emotionalGoals: "",
      bio: "",
    });
    expect(r.success).toBe(true);
  });

  it("rejects empty name", () => {
    const r = profileUpdateSchema.safeParse({
      name: "   ",
      preferences: "x",
      emotionalGoals: "",
      bio: "",
    });
    expect(r.success).toBe(false);
  });

  it("rejects unknown keys (strict)", () => {
    const r = profileUpdateSchema.safeParse({
      name: "ok",
      email: "hack@x.com",
      preferences: "",
      emotionalGoals: "",
      bio: "",
    });
    expect(r.success).toBe(false);
  });

  it("enforces max length on name", () => {
    const r = profileUpdateSchema.safeParse({
      name: "x".repeat(121),
      preferences: "",
      emotionalGoals: "",
      bio: "",
    });
    expect(r.success).toBe(false);
  });

  it("enforces max length on preferences", () => {
    const r = profileUpdateSchema.safeParse({
      name: "User",
      preferences: "x".repeat(501),
      emotionalGoals: "",
      bio: "",
    });
    expect(r.success).toBe(false);
  });
});
