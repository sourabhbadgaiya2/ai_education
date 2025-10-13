"use client";

import { Button } from "@/components/ui/button";
import { Note } from "@/hooks/usenote";
import {
  ArrowUpDown,
  Grid2X2,
  List,
  Loader2,
  Search,
  Sparkles,
  Upload,
} from "lucide-react";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import NoteCard from "@/components/NoteCard";
import NoteDialogs from "@/components/NoteDailogs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  fetchNotesService,
  generateSummaryService,
  uploadNoteService,
} from "../api-services/noteService";
import { Badge } from "@/components/ui/badge";

const DashboardPage: React.FC = () => {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"last" | "upload" | "title">("upload");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);

  // -------------------- API CALLS --------------------

  interface NotesResponse {
    success?: boolean;
    notes: Note[];
  }

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);

      const data = await fetchNotesService();
      setNotes(data.notes);
    } catch (err) {
      console.error("Error fetching notes:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const upload = useCallback(
    async (file: File) => {
      try {
        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);

        await uploadNoteService(file);
        await fetchNotes();
      } catch (err) {
        console.error("Error uploading file:", err);
      } finally {
        setLoading(false);
      }
    },
    [fetchNotes]
  );

  const generateSummary = useCallback(
    async (id: string) => {
      try {
        setLoading(true);

        await generateSummaryService(id);

        await fetchNotes();
      } catch (err) {
        console.error("Error generating summary:", err);
      } finally {
        setLoading(false);
      }
    },
    [fetchNotes]
  );

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const filtered = notes
    .filter((n) => n.title.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "upload")
        return (
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        );
      return (
        new Date(b.lastActivityAt).getTime() -
        new Date(a.lastActivityAt).getTime()
      );
    });

  // -------------------- RENDER --------------------
  return (
    <div className='p-6'>
      {/* Header */}
      <section className='flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
        <div>
          <h1 className='text-2xl md:text-3xl font-semibold'>Dashboard</h1>
          <p className='text-muted-foreground'>
            Your notes, summaries, QnA, flashcards, and MCQs—all in one place
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <input
            ref={fileRef}
            type='file'
            accept='application/pdf'
            className='hidden'
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (f) await upload(f);
              if (fileRef.current) fileRef.current.value = "";
            }}
          />
          <Button
            className={"bg-blue-600 hover:bg-blue-500"}
            onClick={() => fileRef.current?.click()}
            disabled={loading}
          >
            <Upload className='mr-2 h-4 w-4' /> Upload PDF
          </Button>
        </div>
      </section>

      {/* Toolbar */}
      <div className='mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
        <div className='relative w-full md:max-w-md'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Search notes or summaries'
            className='pl-9'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className='flex items-center gap-2'>
          <Select
            value={sortBy}
            onValueChange={(v: "upload" | "title") => setSortBy(v)}
          >
            <SelectTrigger className='w-40'>
              <ArrowUpDown className='mr-2 h-4 w-4 opacity-60' />
              <SelectValue placeholder='Sort by' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='upload'>Upload date</SelectItem>
              <SelectItem value='title'>Title</SelectItem>
            </SelectContent>
          </Select>
          <div className='ml-2 inline-flex rounded-md border bg-white p-1'>
            <Button
              variant={view === "grid" ? "secondary" : "ghost"}
              size='sm'
              onClick={() => setView("grid")}
            >
              <Grid2X2 className='mr-1 h-4 w-4' /> Grid
            </Button>
            <Button
              variant={view === "list" ? "secondary" : "ghost"}
              size='sm'
              onClick={() => setView("list")}
            >
              <List className='mr-1 h-4 w-4' /> List
            </Button>
          </div>
        </div>
      </div>

      {/* Notes */}
      {view === "grid" ? (
        <div className='relative  mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {loading && (
            <div className='absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-sm'>
              <Loader2 className='h-10 w-10 animate-spin text-gray-700' />
            </div>
          )}
          {filtered.map((note: any) => (
            <NoteCard
              key={note._id}
              note={note}
              onGenerate={() => generateSummary(note._id)}
              onOpen={(n) => setActiveNote(n)}
            />
          ))}
        </div>
      ) : (
        <div className='mt-6 overflow-hidden rounded-lg border'>
          <div className='hidden md:grid grid-cols-[1fr_220px_160px_280px] items-center gap-4 border-b bg-muted/40 px-4 py-2 text-xs font-medium text-muted-foreground'>
            <div>Title</div>
            <div>Uploaded</div>

            <div>Actions</div>
          </div>
          {filtered.map((note: any) => (
            <div
              key={note._id}
              className='grid grid-cols-1 md:grid-cols-[1fr_220px_160px_280px] items-center gap-4 px-4 py-3 border-b last:border-0'
            >
              <div className='min-w-0'>
                <div className='flex items-center gap-2'>
                  <p className='truncate font-medium'>{note.title}</p>
                  {note.summary ? (
                    <Badge variant='secondary' className='whitespace-nowrap'>
                      Summarized
                    </Badge>
                  ) : (
                    <Badge variant='outline' className='whitespace-nowrap'>
                      New
                    </Badge>
                  )}
                </div>
                {note.summary && (
                  <p className='mt-1 line-clamp-1 text-sm text-muted-foreground'>
                    {note.summary}
                  </p>
                )}

                {note.pdfUrl && (
                  <a
                    href={note.pdfUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='mt-1 block truncate text-xs text-blue-600 hover:underline'
                  >
                    {note.pdfUrl}
                  </a>
                )}
              </div>
              <div className='text-sm text-muted-foreground'>
                {new Date(note.createdAt).toLocaleString()}
              </div>

              <div className='flex  items-center gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  disabled={loading}
                  onClick={() => generateSummary(note._id)}
                >
                  {loading ? <Loader2 className='mr-2 animate-spin' /> : null}
                  Generate
                </Button>
                <NoteDialogs
                  note={note}
                  onOpen={setActiveNote}
                  activeNote={activeNote}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {filtered.length === 0 && !loading && (
        <Card className='mt-6'>
          <CardHeader>
            <CardTitle>No results</CardTitle>
            <CardDescription>
              Try a different search or upload a new PDF.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
};
export default DashboardPage;
