/**
 * AutoTaxBot - Chat SDK Bot Configuration
 * Slack bot for calculating Sri Lankan vehicle import taxes
 */

import { Chat } from "chat";
import { createSlackAdapter } from "@chat-adapter/slack";
import { createWhatsAppAdapter } from "@chat-adapter/whatsapp";
import { createRedisState } from "@chat-adapter/state-redis";
import { streamText } from "ai";
import { taxBotTools } from "./tools";
import { SYSTEM_PROMPT, WHATSAPP_SYSTEM_PROMPT, INTRO_MESSAGE, WHATSAPP_INTRO_MESSAGE } from "./prompts";

// Model to use (via Vercel AI Gateway)
const MODEL = "anthropic/claude-sonnet-4-20250514";

/**
 * Create the Chat SDK bot instance
 */
/**
 * Helper to detect if current adapter is WhatsApp
 */
const isWhatsApp = (thread: { adapter: { name: string } }) =>
  thread.adapter.name === "whatsapp";

/**
 * Create the Chat SDK bot instance
 */
export const bot = new Chat({
  userName: "taxbot",
  adapters: {
    slack: createSlackAdapter({
      botToken: process.env.SLACK_BOT_TOKEN!,
      signingSecret: process.env.SLACK_SIGNING_SECRET!,
    }),
    whatsapp: createWhatsAppAdapter({
      accessToken: process.env.WHATSAPP_ACCESS_TOKEN!,
      appSecret: process.env.WHATSAPP_APP_SECRET!,
      phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID!,
      verifyToken: process.env.WHATSAPP_VERIFY_TOKEN!,
    }),
  },
  // Redis state from Upstash (REDIS_URL auto-detected)
  state: createRedisState(),
});

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
    // Stream AI response
    const result = streamText({
      model: MODEL,
      system: systemPrompt,
      messages,
      tools: taxBotTools,
      maxSteps: 5,
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

  // Stream AI response with tool support
  const result = streamText({
    model: MODEL,
    system: systemPrompt,
    messages: history,
    tools: taxBotTools,
    maxSteps: 5, // Allow multiple tool calls per turn
  });

  // Post streaming response (buffered for WhatsApp, real-time for Slack)
  await thread.post(result.textStream);
});

/**
 * Handle reactions (optional - for feedback collection)
 */
bot.onReaction(["thumbsup", "thumbsdown", "+1", "-1"], async (event) => {
  // Could log feedback here for improvement
  console.log(
    `[TaxBot] Received ${event.reaction} reaction from ${event.user.fullName}`
  );
});

export default bot;
