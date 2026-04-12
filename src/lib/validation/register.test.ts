import { describe, it, expect } from "vitest";
import { registerBodySchema } from "./register";

describe("registerBodySchema", () => {
  it("accepts valid input", () => {
    const result = registerBodySchema.safeParse({
      name: "Alex Doe",
      email: "alex@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("alex@example.com");
    }
  });

  it("rejects empty name", () => {
    const result = registerBodySchema.safeParse({
      name: "   ",
      email: "alex@example.com",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = registerBodySchema.safeParse({
      name: "Alex",
      email: "not-an-email",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects short password", () => {
    const result = registerBodySchema.safeParse({
      name: "Alex",
      email: "alex@example.com",
      password: "short",
    });
    expect(result.success).toBe(false);
  });

  it("trims name and email", () => {
    const result = registerBodySchema.safeParse({
      name: "  Alex  ",
      email: "  ALEX@EXAMPLE.COM  ",
      password: "password123",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Alex");
      expect(result.data.email).toBe("alex@example.com");
    }
  });
});
