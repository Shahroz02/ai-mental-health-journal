import { z } from "zod";

/** Same bounds as journal content for consistency. */
export const emotionRequestSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Content is required.")
    .max(50_000, "Content cannot exceed 50,000 characters."),
});

export type EmotionRequestBody = z.infer<typeof emotionRequestSchema>;
