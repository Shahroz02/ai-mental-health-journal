import { z } from "zod";

export const journalCreateSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Journal entry cannot be empty.")
    .max(50_000, "Journal entry cannot exceed 50,000 characters."),
});

export type JournalCreateBody = z.infer<typeof journalCreateSchema>;
