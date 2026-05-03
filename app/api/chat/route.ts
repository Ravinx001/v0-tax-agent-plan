import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, DAILY_MESSAGE_LIMIT } from "@/lib/rate-limit";
import { taxBotTools } from "@/lib/tools";
import { SYSTEM_PROMPT } from "@/lib/prompts";

// AI model for web chat - using standard Claude model available via AI Gateway
const MODEL = "anthropic/claude-3-5-sonnet-20241022";

export async function POST(req: Request) {
  try {
    // Get authenticated user
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return new Response(
        JSON.stringify({
          error: "Unauthorized",
          message: "Please log in to use the chat",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check rate limit
    const rateLimit = await checkRateLimit(user.id);

    if (!rateLimit.allowed) {
      const hoursUntilReset = Math.ceil(rateLimit.resetInSeconds / 3600);
      return new Response(
        JSON.stringify({
          error: "RateLimitExceeded",
          message: `You've reached your daily limit of ${DAILY_MESSAGE_LIMIT} messages. Your limit resets in ${hoursUntilReset} hour${hoursUntilReset !== 1 ? "s" : ""}.`,
          remaining: 0,
          limit: DAILY_MESSAGE_LIMIT,
          resetInSeconds: rateLimit.resetInSeconds,
        }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const { messages }: { messages: UIMessage[] } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({
          error: "BadRequest",
          message: "Messages array is required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Stream AI response with tool support
    const result = streamText({
      model: MODEL,
      system: SYSTEM_PROMPT,
      messages: await convertToModelMessages(messages),
      tools: taxBotTools,
      maxSteps: 5, // Allow multiple tool calls per turn
    });

    // Return streaming response with rate limit headers
    const response = result.toUIMessageStreamResponse();

    // Add custom headers for rate limit info
    const headers = new Headers(response.headers);
    headers.set("X-RateLimit-Remaining", rateLimit.remaining.toString());
    headers.set("X-RateLimit-Limit", rateLimit.limit.toString());
    headers.set("X-RateLimit-Reset", rateLimit.resetInSeconds.toString());

    return new Response(response.body, {
      status: response.status,
      headers,
    });
  } catch (error) {
    console.error("[TaxBot] Chat API error:", error);
    return new Response(
      JSON.stringify({
        error: "InternalError",
        message: "An unexpected error occurred. Please try again.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

/**
 * GET endpoint to check remaining messages
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const rateLimit = await checkRateLimit(user.id);
    // Don't increment - just return current state by subtracting what we just added
    const remaining = rateLimit.allowed ? rateLimit.remaining + 1 : 0;

    return new Response(
      JSON.stringify({
        remaining,
        limit: DAILY_MESSAGE_LIMIT,
        resetInSeconds: rateLimit.resetInSeconds,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[TaxBot] Rate limit check error:", error);
    return new Response(
      JSON.stringify({ error: "InternalError" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
