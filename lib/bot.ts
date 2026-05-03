/**
 * AutoTaxBot - Chat SDK Bot Configuration
 * Slack bot for calculating Sri Lankan vehicle import taxes
 */

import { Chat } from "chat";
import { createSlackAdapter } from "@chat-adapter/slack";
import { createRedisState } from "@chat-adapter/state-redis";
import { streamText } from "ai";
import { taxBotTools } from "./tools";
import { SYSTEM_PROMPT, INTRO_MESSAGE } from "./prompts";

// Model to use (via Vercel AI Gateway)
const MODEL = "anthropic/claude-sonnet-4-20250514";

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
  },
  // Redis state from Upstash (REDIS_URL auto-detected)
  state: createRedisState(),
});

/**
 * Handle new @mentions - first contact with the bot
 */
bot.onNewMention(async (thread) => {
  // Subscribe to this thread for future messages
  await thread.subscribe();

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
  if (messages.length > 0 && messages[0].content.trim().length > 10) {
    // Stream AI response
    const result = streamText({
      model: MODEL,
      system: SYSTEM_PROMPT,
      messages,
      tools: taxBotTools,
      maxSteps: 5,
    });

    await thread.post(result.textStream);
  } else {
    // Just a mention without a question - send intro
    await thread.post(INTRO_MESSAGE);
  }
});

/**
 * Handle messages in subscribed threads
 */
bot.onSubscribedMessage(async (thread, message) => {
  // Skip messages from the bot itself
  if (message.author.isMe) return;

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
    system: SYSTEM_PROMPT,
    messages: history,
    tools: taxBotTools,
    maxSteps: 5, // Allow multiple tool calls per turn
  });

  // Post streaming response to Slack
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
