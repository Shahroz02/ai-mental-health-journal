import type { EmotionAnalysisResult } from "./types";
import { analyzeWithMockKeywords } from "./mockKeywordAnalyzer";

/**
 * Single entry point for emotion analysis.
 *
 * **Replace implementation:** import your real provider (OpenAI, HF, etc.), map its
 * output to `EmotionAnalysisResult`, and swap the body of this function.
 * Routes (`/api/emotion`, `/api/journal`) should keep importing from here only.
 */
export async function analyzeEmotion(text: string): Promise<EmotionAnalysisResult> {
  return analyzeWithMockKeywords(text);
}
