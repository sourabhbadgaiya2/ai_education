// "use client";

// import { Button } from "./ui/button";
// import { Input } from "./ui/input";
// import { useState } from "react";
// import { Loader2 } from "lucide-react";

// export default function Chat({
//   note,
// }: {
//   note: { title: string; _id: string };
// }) {
//   const [messages, setMessages] = useState<
//     { role: "user" | "ai"; content: string }[]
//   >([
//     {
//       role: "ai",
//       content: "Hi! Ask me anything about your note and I will help.",
//     },
//   ]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [sessionId, setSessionId] = useState<string | null>(null);

//   const ask = async () => {
//     const q = input.trim();
//     if (!q) return;

//     // Show the user’s message instantly
//     setMessages((m) => [...m, { role: "user", content: q }]);
//     setInput("");
//     setLoading(true);

//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/v1/ai/chat`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify({
//             noteId: note._id,
//             question: q,
//             sessionId: sessionId || undefined, // only send if exists
//           }),
//         }
//       );

//       if (!res.ok) throw new Error("Failed to get response");
//       const data = await res.json();

//       // ✅ Store session ID (for continuing the same chat later)
//       if (data.sessionId && !sessionId) setSessionId(data.sessionId);

//       // ✅ Append AI response
//       setMessages((m) => [...m, { role: "ai", content: data.answer }]);
//     } catch (err) {
//       console.error("Chat error:", err);
//       setMessages((m) => [
//         ...m,
//         { role: "ai", content: "Sorry, I couldn’t get that answer." },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className='flex flex-col gap-3'>
//       <div className='relative max-h-80 overflow-auto rounded-md border bg-muted/20 p-3'>
//         {/* Messages */}
//         {messages.map((m, idx) => (
//           <div
//             key={idx}
//             className={m.role === "user" ? "text-right" : "text-left"}
//           >
//             <span
//               className={
//                 m.role === "user"
//                   ? "inline-block rounded-md bg-blue-600 text-white px-3 py-2"
//                   : "inline-block rounded-md bg-secondary px-3 py-2"
//               }
//             >
//               {m.content}
//             </span>
//           </div>
//         ))}

//         {/* Lucide Loader Overlay */}
//         {loading && (
//           <div className='absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm'>
//             <Loader2 className='h-6 w-6 animate-spin text-blue-600' />
//           </div>
//         )}
//       </div>

//       <div className='flex items-center gap-2'>
//         <Input
//           placeholder='Ask a question about your note…'
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && ask()}
//           disabled={loading}
//         />
//         <Button onClick={ask} disabled={loading || input.trim().length === 0}>
//           {loading ? <Loader2 className='h-4 w-4 animate-spin mr-2' /> : null}
//           Ask
//         </Button>
//       </div>
//     </div>
//   );
// }

"use client";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function Chat({
  note,
}: {
  note: { title: string; _id: string };
}) {
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; content: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  // ✅ Fetch old chat messages on load
  useEffect(() => {
    const fetchOldMessages = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/ai/chat/history?noteId=${note._id}`,
          {
            credentials: "include",
          }
        );

        if (!res.ok) throw new Error("Failed to fetch old messages");
        const data = await res.json();

        // data example:
        // { sessionId: "...", messages: [{ role: "user", content: "..." }, { role: "ai", content: "..." }] }

        if (data.sessionId) setSessionId(data.sessionId);
        if (data.messages?.length > 0) {
          setMessages(data.messages);
        } else {
          setMessages([
            {
              role: "ai",
              content: "Hi! Ask me anything about your note and I will help.",
            },
          ]);
        }
      } catch (err) {
        console.error("Error fetching old messages:", err);
        setMessages([
          {
            role: "ai",
            content: "Hi! Ask me anything about your note and I will help.",
          },
        ]);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchOldMessages();
  }, [note._id]);

  const ask = async () => {
    const q = input.trim();
    if (!q) return;

    // Show the user’s message instantly
    setMessages((m) => [...m, { role: "user", content: q }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/ai/chat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            noteId: note._id,
            question: q,
            sessionId: sessionId || undefined, // only send if exists
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to get response");
      const data = await res.json();

      // ✅ Store session ID (for continuing the same chat later)
      if (data.sessionId && !sessionId) setSessionId(data.sessionId);

      // ✅ Append AI response
      setMessages((m) => [...m, { role: "ai", content: data.answer }]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((m) => [
        ...m,
        { role: "ai", content: "Sorry, I couldn’t get that answer." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className='flex h-40 items-center justify-center'>
        <Loader2 className='h-6 w-6 animate-spin text-blue-600' />
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-3'>
      <div className='relative max-h-80 overflow-auto rounded-md border bg-muted/20 p-3'>
        {/* Messages */}
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

        {/* Lucide Loader Overlay */}
        {loading && (
          <div className='absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm'>
            <Loader2 className='h-6 w-6 animate-spin text-blue-600' />
          </div>
        )}
      </div>

      <div className='flex items-center gap-2'>
        <Input
          placeholder='Ask a question about your note…'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && ask()}
          disabled={loading}
        />
        <Button onClick={ask} disabled={loading || input.trim().length === 0}>
          {loading ? <Loader2 className='h-4 w-4 animate-spin mr-2' /> : null}
          Ask
        </Button>
      </div>
    </div>
  );
}
