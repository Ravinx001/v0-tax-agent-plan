/**
 * Dynamic webhook route for Chat SDK platforms
 * Handles incoming events from Slack (and other platforms if added)
 */

import { after } from "next/server";
import { bot } from "@/lib/bot";

// Type for route context with platform param
type RouteContext = {
  params: Promise<{ platform: string }>;
};

// Type for platform keys
type Platform = keyof typeof bot.webhooks;

/**
 * POST handler for incoming webhook events
 */
export async function POST(request: Request, context: RouteContext) {
  const { platform } = await context.params;

  // Get the handler for this platform
  const handler = bot.webhooks[platform as Platform];

  if (!handler) {
    return new Response(`Unknown platform: ${platform}`, { status: 404 });
  }

  // Handle the webhook with waitUntil for serverless environments
  return handler(request, {
    waitUntil: (task) => after(() => task),
  });
}

/**
 * GET handler for webhook URL verification (some platforms need this)
 */
export async function GET(request: Request, context: RouteContext) {
  const { platform } = await context.params;

  // Slack URL verification challenge
  if (platform === "slack") {
    const url = new URL(request.url);
    const challenge = url.searchParams.get("challenge");
    if (challenge) {
      return new Response(challenge, {
        headers: { "Content-Type": "text/plain" },
      });
    }
  }

  return new Response(`Webhook endpoint for ${platform}`, { status: 200 });
}
