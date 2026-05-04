/**
 * AutoTaxBot - Chat SDK Bot Configuration
 * Slack and WhatsApp bot for calculating Sri Lankan vehicle import taxes
 * 
 * NOTE: Bot initialization is lazy to avoid build-time errors when
 * environment variables are not available.
 */

import { Chat } from "chat";
import { createSlackAdapter } from "@chat-adapter/slack";
import { createWhatsAppAdapter } from "@chat-adapter/whatsapp";
import { createRedisState } from "@chat-adapter/state-redis";
import { streamText, stepCountIs } from "ai";
import { taxBotTools } from "./tools";
import { SYSTEM_PROMPT, WHATSAPP_SYSTEM_PROMPT, INTRO_MESSAGE, WHATSAPP_INTRO_MESSAGE } from "./prompts";
import { getGeminiApiKey, getTaxBotGeminiModel } from "./gemini";
import { createChatMemoryState } from "./chat-memory-state";

/**
 * Helper to detect if current adapter is WhatsApp
 */
const isWhatsApp = (thread: { adapter: { name: string } }) =>
  thread.adapter.name === "whatsapp";

/**
 * Singleton bot instance - lazily initialized at runtime only
 */
let _bot: Chat | null = null;

/**
 * Get or create the Chat SDK bot instance
 * This is lazy to avoid build-time initialization when env vars aren't available
 */
export function getBot(): Chat {
  if (_bot) return _bot;

  // Check if we have the required environment variables
  const hasSlack = process.env.SLACK_BOT_TOKEN && process.env.SLACK_SIGNING_SECRET;
  const hasWhatsApp = process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_APP_SECRET;
  const hasRedis = process.env.REDIS_URL || (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

  if (!hasSlack && !hasWhatsApp) {
    throw new Error(
      "No chat adapters configured. Set SLACK_BOT_TOKEN + SLACK_SIGNING_SECRET or WhatsApp credentials."
    );
  }

  // Build adapters object dynamically based on available env vars
  const adapters: Record<string, ReturnType<typeof createSlackAdapter> | ReturnType<typeof createWhatsAppAdapter>> = {};

  if (hasSlack) {
    adapters.slack = createSlackAdapter({
      botToken: process.env.SLACK_BOT_TOKEN!,
      signingSecret: process.env.SLACK_SIGNING_SECRET!,
    });
  }

  if (hasWhatsApp) {
    adapters.whatsapp = createWhatsAppAdapter({
      accessToken: process.env.WHATSAPP_ACCESS_TOKEN!,
      appSecret: process.env.WHATSAPP_APP_SECRET!,
      phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID!,
      verifyToken: process.env.WHATSAPP_VERIFY_TOKEN!,
    });
  }

  // Create bot instance
  _bot = new Chat({
    userName: "taxbot",
    adapters,
    state: hasRedis ? createRedisState() : createChatMemoryState(),
  });

  // Register event handlers
  setupEventHandlers(_bot);

  return _bot;
}

/**
 * Set up all event handlers on the bot instance
 */
function setupEventHandlers(bot: Chat) {
  /**
   * Handle new @mentions - first contact with the bot
   * Works for both Slack (@mentions) and WhatsApp (any new message)
   */
  bot.onNewMention(async (thread) => {
    // Subscribe to this thread for future messages
    await thread.subscribe();

    // Select appropriate prompt based on platform
    const systemPrompt = isWhatsApp(thread) ? WHATSAPP_SYSTEM_PROMPT : SYSTEM_PROMPT;
    const introMessage = isWhatsApp(thread) ? WHATSAPP_INTRO_MESSAGE : INTRO_MESSAGE;

    // Get the initial message that mentioned us
    const messages: { role: "user" | "assistant"; content: string }[] = [];

    for await (const msg of thread.allMessages) {
      if (!msg.author.isMe) {
        messages.push({
          role: "user",
          content: msg.text,
        });
      }
    }

    // If there's actual content beyond just the mention, process it
    if (messages.length > 0 && messages[0].content.trim().length > 5) {
      if (!getGeminiApiKey()) {
        await thread.post(
          "TaxBot is not configured: set GOOGLE_GENERATIVE_AI_API_KEY (or GEMINI_API_KEY) on the server."
        );
        return;
      }
      const result = streamText({
        model: getTaxBotGeminiModel(),
        system: systemPrompt,
        messages,
        tools: taxBotTools,
        stopWhen: stepCountIs(5),
      });

      await thread.post(result.textStream);
    } else {
      // Just a mention without a question - send intro
      await thread.post(introMessage);
    }
  });

  /**
   * Handle messages in subscribed threads
   * Continues conversation with context from previous messages
   */
  bot.onSubscribedMessage(async (thread, message) => {
    // Skip messages from the bot itself
    if (message.author.isMe) return;

    // Select appropriate prompt based on platform
    const systemPrompt = isWhatsApp(thread) ? WHATSAPP_SYSTEM_PROMPT : SYSTEM_PROMPT;

    // Build conversation history from thread
    const history: { role: "user" | "assistant"; content: string }[] = [];

    for await (const msg of thread.allMessages) {
      history.push({
        role: msg.author.isMe ? "assistant" : "user",
        content: msg.text,
      });
    }

    if (!getGeminiApiKey()) {
      await thread.post(
        "TaxBot is not configured: set GOOGLE_GENERATIVE_AI_API_KEY (or GEMINI_API_KEY) on the server."
      );
      return;
    }

    const result = streamText({
      model: getTaxBotGeminiModel(),
      system: systemPrompt,
      messages: history,
      tools: taxBotTools,
      stopWhen: stepCountIs(5),
    });

    await thread.post(result.textStream);
  });

  /**
   * Handle reactions (optional - for feedback collection)
   */
  bot.onReaction(["thumbsup", "thumbsdown", "+1", "-1"], async (event) => {
    console.log(
      `[TaxBot] Received ${event.rawEmoji} reaction from ${event.user.fullName}`
    );
  });
}

// For backwards compatibility, export bot as a getter
// This will throw at runtime if env vars are missing, but won't fail at build time
export const bot = new Proxy({} as InstanceType<typeof Chat>, {
  get(_, prop) {
    return (getBot() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export default bot;
