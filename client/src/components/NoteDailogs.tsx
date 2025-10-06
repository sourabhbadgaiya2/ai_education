import { Note } from "@/hooks/usenote";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export default function NoteDialogs({
  note,
  onOpen,
  activeNote,
}: {
  note: Note;
  onOpen: (n: Note) => void;
  activeNote: Note | null;
}) {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant='outline' disabled={!note.flashcards}>
            Flashcards
          </Button>
        </DialogTrigger>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Flashcards • {note.title}</DialogTitle>
          </DialogHeader>
          {/* <FlashcardsGrid cards={note.flashcards || []} /> */}
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant='outline' disabled={!note.mcqs}>
            MCQs
          </Button>
        </DialogTrigger>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>MCQs • {note.title}</DialogTitle>
          </DialogHeader>
          {/* <MCQList items={note.mcqs || []} /> */}
        </DialogContent>
      </Dialog>
    </>
  );
}
