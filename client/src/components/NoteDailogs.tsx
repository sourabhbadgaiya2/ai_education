// "use client";

// import { useState } from "react";

// import { Note } from "@/hooks/usenote";
// import { Button } from "./ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "./ui/dialog";
// import FlashcardsGrid from "./FlashcardsGrid";
// import MCQList from "./MCQList";

// export default function NoteDialogs({
//   note,
//   onOpen,
//   activeNote,
// }: {
//   note: Note;
//   onOpen: (n: Note) => void;
//   activeNote: Note | null;
// }) {
//   const [loading, setLoading] = useState(false);

//   async function handleGenerate(type: "flashcards" | "mcqs") {
//     try {
//       setLoading(true);
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/notes/flashcards`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//           body: JSON.stringify({ noteId: note._id }),
//         }
//       );
//     } catch (err) {
//       console.error("Flashcard generation failed:", err);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <>
//       <Dialog>
//         <DialogTrigger asChild>
//           <Button variant='outline' disabled={!(note.flashcards ?? []).length}>
//             Flashcards
//           </Button>
//         </DialogTrigger>
//         <DialogContent className='max-w-2xl'>
//           <DialogHeader>
//             <DialogTitle>Flashcards • {note.title}</DialogTitle>
//           </DialogHeader>
//           <FlashcardsGrid cards={note.flashcards || []} />
//         </DialogContent>
//       </Dialog>
//       <Dialog>
//         <DialogTrigger asChild>
//           <Button variant='outline' disabled={!note.mcqs}>
//             MCQs
//           </Button>
//         </DialogTrigger>
//         <DialogContent className='max-w-2xl'>
//           <DialogHeader>
//             <DialogTitle>MCQs • {note.title}</DialogTitle>
//           </DialogHeader>
//           <MCQList items={note.mcqs || []} />
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }

"use client";

import { useState, useEffect } from "react";

import { Note } from "@/hooks/usenote";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import FlashcardsGrid from "./FlashcardsGrid";
import MCQList from "./MCQList";
import {
  generateFlashcards,
  getFlashcards,
} from "@/app/api-services/flashcardService";

export default function NoteDialogs({
  note,
  onOpen,
  activeNote,
}: {
  note: Note;
  onOpen: (n: Note) => void;
  activeNote: Note | null;
}) {
  const [loading, setLoading] = useState(false);
  const [flashcards, setFlashcards] = useState(note.flashcards || []);
  const [mcqs, setMcqs] = useState(note.mcqs || []);

  // ✅ Auto-fetch flashcards if not already present
  useEffect(() => {
    if ((!flashcards || flashcards.length === 0) && note._id) {
      fetchFlashcards();
    }
  }, [note._id]);

  async function fetchFlashcards() {
    try {
      setLoading(true);

      const res = await getFlashcards(note._id);

      if (res.status === 404 || res.status === 500) {
        await handleGenerate();
      } else if (res.ok) {
        const data = await res.json();
        console.log("NoteDialogs render:", data);

        setFlashcards(data.flashcards || []);
        setMcqs(data.mcqs || []);
      }
    } catch (err) {
      console.error("Failed to fetch flashcards:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerate() {
    try {
      setLoading(true);
      const res = await generateFlashcards(note._id);

      if (res.ok) {
        const data = await res.json();
        setFlashcards(data.flashcards || []);
        setMcqs(data.mcqs || []);
      }
    } catch (err) {
      console.error("Flashcard generation failed:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant='outline'
            disabled={loading || (flashcards?.length ?? 0) === 0}
          >
            {loading ? "Loading..." : "Flashcards"}
          </Button>
        </DialogTrigger>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Flashcards • {note.title}</DialogTitle>
          </DialogHeader>
          <FlashcardsGrid cards={flashcards} />
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant='outline'
            disabled={loading || (mcqs?.length ?? 0) === 0}
          >
            {loading ? "Loading..." : "MCQs"}
          </Button>
        </DialogTrigger>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>MCQs • {note.title}</DialogTitle>
          </DialogHeader>
          <MCQList items={mcqs} />
        </DialogContent>
      </Dialog>
    </>
  );
}
