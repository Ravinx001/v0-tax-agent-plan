import type { UIMessage } from "ai";

export function getMessageText(message: UIMessage): string {
  if (!message.parts || !Array.isArray(message.parts)) return "";
  return message.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");
}

/** True while a tool is still running (not yet output-available / terminal error). */
export function hasPendingToolWork(message: UIMessage): boolean {
  if (!message.parts || !Array.isArray(message.parts)) return false;
  return message.parts.some((p) => {
    if (typeof p.type !== "string" || !p.type.startsWith("tool-")) return false;
    const state = (p as { state?: string }).state;
    return (
      state === "input-streaming" ||
      state === "input-available" ||
      state === "approval-requested" ||
      state === "approval-responded"
    );
  });
}
