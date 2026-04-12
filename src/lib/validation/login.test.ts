import { describe, it, expect } from "vitest";
import { loginBodySchema } from "./login";

describe("loginBodySchema", () => {
  it("accepts valid credentials", () => {
    const result = loginBodySchema.safeParse({
      email: "user@example.com",
      password: "anypassword",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = loginBodySchema.safeParse({
      email: "not-email",
      password: "secret123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty password", () => {
    const result = loginBodySchema.safeParse({
      email: "user@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });

  it("normalizes email", () => {
    const result = loginBodySchema.safeParse({
      email: "  USER@EXAMPLE.COM  ",
      password: "x",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("user@example.com");
    }
  });
});
