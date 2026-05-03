"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Send,
  Car,
  Calculator,
  MessageSquare,
  AlertCircle,
  LogOut,
  RefreshCw,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Rate limit info
const DAILY_LIMIT = 20;

/**
 * Extract text content from UIMessage parts
 */
function getMessageText(message: UIMessage): string {
  if (!message.parts || !Array.isArray(message.parts)) return "";
  return message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");
}

/**
 * Check if message has tool calls
 */
function hasToolCalls(message: UIMessage): boolean {
  if (!message.parts || !Array.isArray(message.parts)) return false;
  return message.parts.some((p) => p.type === "tool-invocation");
}

export default function ChatPage() {
  const [remaining, setRemaining] = useState<number>(DAILY_LIMIT);
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
    onFinish: () => {
      // Update remaining count after message
      setRemaining((prev) => Math.max(0, prev - 1));
    },
    onError: (err) => {
      // Check if it's a rate limit error
      if (err.message.includes("429") || err.message.includes("RateLimitExceeded")) {
        setRateLimitError(
          "You've reached your daily message limit. Please try again tomorrow."
        );
      }
    },
  });

  const isStreaming = status === "streaming" || status === "submitted";

  // Fetch initial remaining count
  useEffect(() => {
    async function fetchRemaining() {
      try {
        const res = await fetch("/api/chat");
        if (res.ok) {
          const data = await res.json();
          setRemaining(data.remaining);
        }
      } catch {
        // Ignore errors, use default
      }
    }
    fetchRemaining();
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming || remaining <= 0) return;

    const messageText = input.trim();
    setInput("");
    setRateLimitError(null);

    await sendMessage({ text: messageText });
  };

  // Handle keyboard shortcut
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card px-4 py-3">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Car className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">TaxBot LK</span>
          </Link>

          <div className="flex items-center gap-4">
            {/* Remaining messages badge */}
            <Badge
              variant={remaining <= 5 ? "destructive" : "secondary"}
              className="gap-1"
            >
              <MessageSquare className="h-3 w-3" />
              {remaining} / {DAILY_LIMIT}
            </Badge>

            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Chat area */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-4 py-6">
          {/* Empty state */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <Calculator className="h-8 w-8 text-primary" />
              </div>
              <h2 className="mb-2 text-xl font-semibold text-foreground">
                Calculate Vehicle Import Taxes
              </h2>
              <p className="mb-8 max-w-md text-muted-foreground">
                Tell me about the vehicle you want to import and I will calculate
                the customs duty, excise duty, VAT, and total landed cost.
              </p>

              {/* Quick prompts */}
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  "Calculate tax for a 2022 Toyota Prius",
                  "Compare petrol vs hybrid taxes",
                  "What are the current tax rates?",
                ].map((prompt) => (
                  <Button
                    key={prompt}
                    variant="outline"
                    size="sm"
                    onClick={() => setInput(prompt)}
                    disabled={isStreaming}
                    className="text-sm"
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <Card
                  className={`max-w-[85%] ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card"
                  }`}
                >
                  <CardContent className="p-3">
                    {/* Tool invocation indicator */}
                    {hasToolCalls(message) && (
                      <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                        <Calculator className="h-3 w-3" />
                        <span>Calculating taxes...</span>
                      </div>
                    )}

                    {/* Message text */}
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {getMessageText(message)}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}

            {/* Streaming indicator */}
            {isStreaming && (
              <div className="flex justify-start">
                <Card className="bg-card">
                  <CardContent className="flex items-center gap-2 p-3">
                    <Spinner className="h-4 w-4" />
                    <span className="text-sm text-muted-foreground">
                      Thinking...
                    </span>
                  </CardContent>
                </Card>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </main>

      {/* Rate limit warning */}
      {(remaining <= 5 || rateLimitError) && (
        <div className="border-t border-border bg-card/50 px-4 py-2">
          <div className="mx-auto max-w-4xl">
            <Alert variant={rateLimitError ? "destructive" : "default"}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {rateLimitError ||
                  `You have ${remaining} message${remaining !== 1 ? "s" : ""} remaining today.`}
              </AlertDescription>
            </Alert>
          </div>
        </div>
      )}

      {/* Error display */}
      {error && !rateLimitError && (
        <div className="border-t border-border bg-card/50 px-4 py-2">
          <div className="mx-auto max-w-4xl">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>Something went wrong. Please try again.</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      )}

      {/* Input area */}
      <footer className="sticky bottom-0 border-t border-border bg-card px-4 py-4">
        <div className="mx-auto max-w-4xl">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                remaining <= 0
                  ? "Daily limit reached..."
                  : "Ask about vehicle import taxes..."
              }
              disabled={isStreaming || remaining <= 0}
              className="min-h-[44px] max-h-32 resize-none"
              rows={1}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isStreaming || remaining <= 0}
              className="h-11 w-11 shrink-0"
            >
              {isStreaming ? (
                <Spinner className="h-4 w-4" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span className="sr-only">Send message</span>
            </Button>
          </form>

          <p className="mt-2 text-center text-xs text-muted-foreground">
            Estimates based on 2025 gazette rates. Consult a customs agent for
            final calculations.
          </p>
        </div>
      </footer>
    </div>
  );
}
