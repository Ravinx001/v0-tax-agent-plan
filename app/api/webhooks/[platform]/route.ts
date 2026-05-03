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
  const url = new URL(request.url);

  // WhatsApp webhook verification
  // Meta sends: hub.mode, hub.verify_token, hub.challenge
  if (platform === "whatsapp") {
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");

    // Verify the token matches our configured verify token
    if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
      console.log("[TaxBot] WhatsApp webhook verified successfully");
      return new Response(challenge, {
        status: 200,
        headers: { "Content-Type": "text/plain" },
      });
    } else {
      console.log("[TaxBot] WhatsApp webhook verification failed");
      return new Response("Forbidden", { status: 403 });
    }
  }

  // Slack URL verification challenge
  if (platform === "slack") {
    const challenge = url.searchParams.get("challenge");
    if (challenge) {
      return new Response(challenge, {
        headers: { "Content-Type": "text/plain" },
      });
    }
  }

  return new Response(`Webhook endpoint for ${platform}`, { status: 200 });
}
