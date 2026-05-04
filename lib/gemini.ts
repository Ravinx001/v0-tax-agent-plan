import { createGoogleGenerativeAI } from "@ai-sdk/google";

/** Default Gemini model for TaxBot (tools + general chat). */
export const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";

/**
 * Google AI Studio / Gemini API key.
 * @see https://ai.google.dev/gemini-api/docs/api-key
 */
export function getGeminiApiKey(): string | undefined {
  const key =
    process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim() ||
    process.env.GEMINI_API_KEY?.trim();
  return key || undefined;
}

export function getGeminiModelId(): string {
  return (
    process.env.GOOGLE_GENERATIVE_AI_MODEL?.trim() || DEFAULT_GEMINI_MODEL
  );
}

export function getTaxBotGeminiModel() {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error(
      "Missing GOOGLE_GENERATIVE_AI_API_KEY or GEMINI_API_KEY for Gemini."
    );
  }
  const google = createGoogleGenerativeAI({ apiKey });
  return google(getGeminiModelId());
}
