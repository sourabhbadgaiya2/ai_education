"use client";

import { MessageCircle } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import Chat from "./Chat";
import { Note } from "@/hooks/usenote";
import { useState } from "react";
import NoteDialogs from "./NoteDailogs";

export default function NoteCard({
  note,
  onGenerate,
  onOpen,
}: {
  note: Note;
  onGenerate: () => void;
  onOpen: (n: Note) => void;
}) {
  const [activeNote, setActive] = useState<Note | null>(null);
  return (
    <Card className='flex flex-col transition-shadow hover:shadow-md'>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between gap-3'>
          <CardTitle className='truncate'>{note.title}</CardTitle>
          {note.summary ? (
            <Badge variant='secondary'>Summarized</Badge>
          ) : (
            <Badge variant='outline'>New</Badge>
          )}
        </div>
        <CardDescription>
          Uploaded {new Date(note.createdAt).toLocaleString()} • Last activity{" "}
          {new Date(note.lastActivityAt).toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {note.summary ? (
          <p className='text-sm text-muted-foreground line-clamp-4'>
            {note.summary}
          </p>
        ) : (
          <p className='text-sm text-muted-foreground'>
            No summary yet. Generate one to get a concise overview.
          </p>
        )}
      </CardContent>
      <CardFooter className='mt-auto flex flex-wrap items-center justify-between gap-2'>
        <Button variant='outline' onClick={onGenerate}>
          Generate Summary
        </Button>
        <div className='ml-auto flex items-center gap-2'>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant='secondary'
                onClick={() => {
                  setActive(note);
                  onOpen(note);
                }}
              >
                <MessageCircle className='mr-2' /> QnA
              </Button>
            </DialogTrigger>
            <DialogContent className='max-w-2xl'>
              <DialogHeader>
                <DialogTitle>
                  Ask AI about: {activeNote?.title || note.title}
                </DialogTitle>
              </DialogHeader>
              <Chat note={activeNote ?? note} />
            </DialogContent>
          </Dialog>
          <NoteDialogs note={note} onOpen={onOpen} activeNote={activeNote} />
        </div>
      </CardFooter>
    </Card>
  );
}
