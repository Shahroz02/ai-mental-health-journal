import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Journal } from "@/models/Journal";
import { getAuthenticatedUser } from "@/lib/auth/session";
import { chatRequestSchema } from "@/lib/validation/chat";
import { mapInfrastructureFailure } from "@/lib/server/mapInfrastructureFailure";
import { orchestrateChatReply } from "@/lib/services/chat/orchestrateChatReply";
import { mergeEmotionContext } from "@/lib/services/chat/mergeEmotionContext";
import type { EmotionContextForChat } from "@/lib/services/chat/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function loadLatestEmotionContext(
  userId: string,
): Promise<EmotionContextForChat | null> {
  const doc = await Journal.findOne({ userId })
    .sort({ createdAt: -1 })
    .select({ emotion: 1, confidence: 1, emotionMessage: 1, createdAt: 1 })
    .lean();

  if (!doc) return null;

  return {
    emotion: doc.emotion ?? null,
    confidence: doc.confidence ?? null,
    emotionMessage: doc.emotionMessage ?? null,
    journalEntryCreatedAt: doc.createdAt
      ? new Date(doc.createdAt).toISOString()
      : null,
  };
}

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

    const parsed = chatRequestSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed.",
          fieldErrors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    await connectDB();

    const serverCtx = await loadLatestEmotionContext(session.sub);
    const merged = mergeEmotionContext(serverCtx, parsed.data.emotionContext);

    const generation = orchestrateChatReply({
      userMessage: parsed.data.message,
      emotionContext: merged,
    });

    return NextResponse.json({
      reply: generation.reply,
      ...(generation.emotionContext
        ? { emotionContext: generation.emotionContext }
        : {}),
    });
  } catch (err: unknown) {
    const infra = mapInfrastructureFailure(err);
    if (infra) return NextResponse.json(infra.body, { status: infra.status });
    console.error("[api/chat POST]", err);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}
