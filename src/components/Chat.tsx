"use client";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";

export default function Chat({ note }: { note: { title: string } }) {
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; content: string }[]
  >([
    {
      role: "ai",
      content: "Hi! Ask me anything about your note and I will help.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const ask = async () => {
    const q = input.trim();
    if (!q) return;
    setMessages((m) => [...m, { role: "user", content: q }]);
    setInput("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const answer =
      `Based on ${note.title}, here's a helpful explanation: ` +
      "Focus on the definitions, then review the worked examples. Practice by summarizing each section in your own words.";

    let i = 0;
    const interval = setInterval(() => {
      setMessages((m) => {
        const last = m[m.length - 1];
        if (last?.role === "ai" && last.content.endsWith("…")) {
          return [
            ...m.slice(0, -1),
            { role: "ai", content: last.content + answer[i++] },
          ];
        }
        return [...m, { role: "ai", content: "…" }];
      });
      if (i >= answer.length) {
        clearInterval(interval);
        setLoading(false);
      }
    }, 16);
  };

  return (
    <div className='flex flex-col gap-3'>
      <div className='max-h-80 overflow-auto rounded-md border bg-muted/20 p-3'>
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={m.role === "user" ? "text-right" : "text-left"}
          >
            <span
              className={
                m.role === "user"
                  ? "inline-block rounded-md bg-blue-600 text-white px-3 py-2"
                  : "inline-block rounded-md bg-secondary px-3 py-2"
              }
            >
              {m.content}
            </span>
          </div>
        ))}
        {loading && (
          <div className='mt-2 flex items-center gap-1'>
            <span className='size-2 animate-pulse rounded-full bg-blue-600' />
            <span className='size-2 animate-pulse rounded-full bg-blue-600 [animation-delay:120ms]' />
            <span className='size-2 animate-pulse rounded-full bg-blue-600 [animation-delay:240ms]' />
          </div>
        )}
      </div>
      <div className='flex items-center gap-2'>
        <Input
          placeholder='Ask a question about your note…'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && ask()}
        />
        <Button onClick={ask} disabled={loading || input.trim().length === 0}>
          Ask
        </Button>
      </div>
    </div>
  );
}
