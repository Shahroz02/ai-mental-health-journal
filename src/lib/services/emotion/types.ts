/**
 * Canonical shape for emotion analysis results (API + persistence).
 * When integrating a real model, map provider output into this structure.
 */
export type EmotionAnalysisResult = {
  emotion: string;
  /** 0–1 confidence score from the analyzer */
  confidence: number;
  /** User-facing reflection (maps to `emotionMessage` on Journal) */
  message: string;
};
