import type { EmotionAnalysisResult } from "./types";

/** Keyword buckets for mock classification only. Replace with model output later. */
const EMOTION_LEXICON: { label: string; keywords: string[]; hint: string }[] = [
  {
    label: "Joyful",
    keywords: [
      "happy",
      "joy",
      "grateful",
      "excited",
      "wonderful",
      "great day",
      "blessed",
      "celebrate",
      "smile",
      "love",
      "proud",
    ],
    hint: "You sound like you’re carrying some warmth and positive energy right now.",
  },
  {
    label: "Calm",
    keywords: [
      "calm",
      "peace",
      "quiet",
      "rest",
      "relaxed",
      "steady",
      "balanced",
      "okay",
      "fine",
      "settled",
    ],
    hint: "It reads like you’re in a steadier, more grounded place.",
  },
  {
    label: "Hopeful",
    keywords: [
      "hope",
      "better",
      "tomorrow",
      "trying",
      "progress",
      "forward",
      "growth",
      "healing",
      "small step",
    ],
    hint: "There’s a sense of looking forward, even if things aren’t perfect.",
  },
  {
    label: "Anxious",
    keywords: [
      "anxious",
      "worry",
      "nervous",
      "stress",
      "overwhelm",
      "panic",
      "tense",
      "restless",
      "what if",
      "scared",
    ],
    hint: "A lot of tension and uncertainty seems to be present in what you wrote.",
  },
  {
    label: "Sad",
    keywords: [
      "sad",
      "lonely",
      "cry",
      "tears",
      "grief",
      "miss",
      "hurt",
      "empty",
      "depressed",
      "down",
    ],
    hint: "Your words carry heaviness or sorrow—that’s valid and worth honoring.",
  },
  {
    label: "Frustrated",
    keywords: [
      "angry",
      "mad",
      "frustrated",
      "annoyed",
      "unfair",
      "fed up",
      "irritated",
      "rage",
    ],
    hint: "There’s real frustration or edge in this entry.",
  },
];

const NEUTRAL: EmotionAnalysisResult = {
  emotion: "Reflective",
  confidence: 0.42,
  message:
    "This entry reads thoughtful and open-ended—we’re not picking up one strong emotion signal, and that’s completely normal.",
};

function scoreContent(normalized: string): { label: string; score: number; hint: string } {
  let best = { label: NEUTRAL.emotion, score: 0, hint: NEUTRAL.message };

  for (const bucket of EMOTION_LEXICON) {
    let hits = 0;
    for (const kw of bucket.keywords) {
      if (normalized.includes(kw)) hits += 1;
    }
    if (hits > best.score) {
      best = { label: bucket.label, score: hits, hint: bucket.hint };
    }
  }

  return best;
}

function confidenceFromScore(score: number, length: number): number {
  if (score <= 0) {
    const lenBoost = Math.min(0.18, length / 8000);
    return Math.min(0.55, 0.38 + lenBoost);
  }
  const base = 0.55 + Math.min(0.35, score * 0.12);
  const lengthPenalty = length < 20 ? -0.06 : 0;
  return Math.min(0.96, Math.max(0.45, base + lengthPenalty));
}

/**
 * Temporary implementation: keyword + light heuristics.
 * Swap for a real model call without changing callers.
 */
export async function analyzeWithMockKeywords(
  rawText: string,
): Promise<EmotionAnalysisResult> {
  const text = rawText.trim();
  if (!text) {
    return NEUTRAL;
  }

  const normalized = text.toLowerCase();
  const { label, score, hint } = scoreContent(normalized);
  const confidence = confidenceFromScore(score, text.length);

  if (score === 0) {
    return NEUTRAL;
  }

  return {
    emotion: label,
    confidence: Math.round(confidence * 1000) / 1000,
    message: hint,
  };
}
