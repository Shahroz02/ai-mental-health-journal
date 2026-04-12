import { z } from "zod";

/** Name is required on every update; profile text fields accept empty strings. */
export const profileUpdateSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required.")
      .max(120, "Name cannot exceed 120 characters"),
    preferences: z
      .string()
      .trim()
      .max(500, "Preferences must be at most 500 characters"),
    emotionalGoals: z
      .string()
      .trim()
      .max(1000, "Emotional goals must be at most 1000 characters"),
    bio: z.string().trim().max(2000, "Bio must be at most 2000 characters"),
  })
  .strict();

export type ProfileUpdateBody = z.infer<typeof profileUpdateSchema>;
