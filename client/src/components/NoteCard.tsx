"use client";

import { ExternalLink, FileText, MessageCircle } from "lucide-react";
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
  const [expanded, setExpanded] = useState(false);
  const hasLongSummary = (note.summary?.length ?? 0) > 160;

  return (
    <Card className='flex flex-col transition-shadow hover:shadow-md'>
      <CardHeader className='pb-3'>
        <div className='flex flex-wrap items-start gap-3'>
          {/* Title */}
          <CardTitle className='truncate flex-auto min-w-0'>
            {note.title}
          </CardTitle>

          {/* Badge + Link */}
          <div className='flex items-center gap-2 ml-auto shrink-0'>
            {note.summary ? (
              <Badge variant='secondary' className='whitespace-nowrap'>
                Summarized
              </Badge>
            ) : (
              <Badge variant='outline' className='whitespace-nowrap'>
                New
              </Badge>
            )}
            <a
              href={note.pdfUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='shrink-0'
            >
              <ExternalLink className='h-4 w-4 text-blue-600 hover:text-blue-800' />
            </a>
          </div>
        </div>

        <CardDescription>
          Uploaded {new Date(note.createdAt).toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {note.summary ? (
          <>
            <p
              className={
                "text-sm text-muted-foreground " +
                (expanded ? "" : "line-clamp-4")
              }
            >
              {note.summary}
            </p>
            {hasLongSummary && (
              <Button
                variant='link'
                size='sm'
                className='px-0 text-xs text-blue-600 hover:underline cursor-pointer'
                onClick={() => setExpanded((v) => !v)}
              >
                {expanded ? "Show less" : "Read more"}
              </Button>
            )}
          </>
        ) : (
          <p className='text-sm text-muted-foreground'>
            No summary yet. Generate one to get a concise overview.
          </p>
        )}
      </CardContent>
      <CardFooter className='mt-auto flex flex-wrap items-center justify-between gap-2'>
        <Button
          className='cursor-pointer'
          variant='outline'
          onClick={onGenerate}
        >
          Generate Summary
        </Button>
        <div className='ml-auto flex items-center gap-2'>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                className='cursor-pointer'
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
