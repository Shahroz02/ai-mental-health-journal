import { z } from "zod";

export const registerBodySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(120, "Name cannot exceed 120 characters"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

export type RegisterBody = z.infer<typeof registerBodySchema>;
