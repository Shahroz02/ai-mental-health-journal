import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { emotionRequestSchema } from "@/lib/validation/emotionRequest";
import { analyzeEmotion } from "@/lib/services/emotion/analyzeEmotion";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Standalone emotion analysis endpoint (same core logic as post-save journal flow).
 * Replace `analyzeEmotion` implementation when wiring a real model.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getAuthenticatedUser();
    if (!session?.sub) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    let json: unknown;
    try {
      json = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const parsed = emotionRequestSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed.",
          fieldErrors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const result = await analyzeEmotion(parsed.data.content);

    return NextResponse.json({
      emotion: result.emotion,
      confidence: result.confidence,
      message: result.message,
    });
  } catch (err: unknown) {
    console.error("[api/emotion POST]", err);
    return NextResponse.json(
      { error: "Emotion analysis failed." },
      { status: 500 },
    );
  }
}
