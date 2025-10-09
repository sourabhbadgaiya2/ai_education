export interface Note {
  _id: string;
  title: string;
  uploadedAt: string; // ISO
  createdAt: string; // ISO
  lastActivityAt: string; // ISO
  summary?: string;
  flashcards?: { front: string; back: string }[];
  mcqs?: { question: string; options: string[]; correct_answer: string }[];
}
