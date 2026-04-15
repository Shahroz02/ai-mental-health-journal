import { generateMockChatReply } from "./generateMockChatReply";
import type { ChatGenerationInput, ChatGenerationResult } from "./types";

/**
 * Single entry point for chat generation used by the `/api/chat` route handler.
 * Replace the body of this function with an LLM call; keep `ChatGenerationInput`
 * and `ChatGenerationResult` stable for the route and tests.
 */
export function orchestrateChatReply(
  input: ChatGenerationInput,
): ChatGenerationResult {
  return generateMockChatReply(input);
}
