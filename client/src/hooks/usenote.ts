export interface Note {
  _id: string;
  title: string;
  uploadedAt: string; // ISO
  createdAt: string; // ISO
  lastActivityAt: string; // ISO
  summary?: string;
  flashcards?: { question: string; answer: string }[];
  mcqs?: { question: string; options: string[]; correct_answer: string }[];
  pdfUrl?: string; // URL to the PDF file
}
