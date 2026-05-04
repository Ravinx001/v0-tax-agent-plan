"use client";

import type { UIMessage } from "ai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { getMessageText } from "@/lib/chat-message-utils";
import { TaxResultCards } from "./TaxResultCards";

const mdComponents: Partial<Components> = {
  h1: (props) => (
    <h1
      className="mt-3 text-lg font-semibold text-foreground first:mt-0"
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="mt-3 text-base font-semibold text-foreground first:mt-0"
      {...props}
    />
  ),
  h3: (props) => (
    <h3 className="mt-2 text-sm font-semibold text-foreground" {...props} />
  ),
  p: (props) => (
    <p className="mt-2 text-sm leading-relaxed first:mt-0" {...props} />
  ),
  ul: (props) => (
    <ul className="mt-2 list-inside list-disc space-y-1 text-sm" {...props} />
  ),
  ol: (props) => (
    <ol className="mt-2 list-inside list-decimal space-y-1 text-sm" {...props} />
  ),
  li: (props) => <li className="leading-relaxed" {...props} />,
  a: (props) => (
    <a
      className="font-medium text-primary underline-offset-4 hover:underline"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  strong: (props) => (
    <strong className="font-semibold text-foreground" {...props} />
  ),
  code: (props) => (
    <code
      className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em]"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="my-2 overflow-x-auto rounded-md bg-muted p-3 font-mono text-xs"
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote
      className="mt-2 border-l-2 border-primary/50 pl-3 text-sm text-muted-foreground italic"
      {...props}
    />
  ),
  table: (props) => (
    <div className="my-2 overflow-x-auto">
      <table
        className="w-full min-w-[240px] border-collapse border border-border text-sm"
        {...props}
      />
    </div>
  ),
  thead: (props) => <thead className="bg-muted/60" {...props} />,
  th: (props) => (
    <th
      className="border border-border px-2 py-1 text-left font-semibold text-foreground"
      {...props}
    />
  ),
  td: (props) => (
    <td className="border border-border px-2 py-1 text-foreground" {...props} />
  ),
  hr: () => <hr className="my-3 border-border" />,
};

export function AssistantMessageBody({ message }: { message: UIMessage }) {
  const text = getMessageText(message).trim();

  return (
    <div className="space-y-1">
      {text ? (
        <div className="chat-markdown">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
            {text}
          </ReactMarkdown>
        </div>
      ) : null}
      <TaxResultCards message={message} />
    </div>
  );
}
