import Flashcard from '../models/Flashcard.js';
import Notes from '../models/Notes.models.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateFlashcardsMCQs = async (req, res) => {
  try {
    const { noteId } = req.body;
    const userId = req.user.id;

    const note = await Notes.findById(noteId);
    if (!note) return res.status(404).json({ error: 'Note not found' });

    const prompt = `
Create 10 flashcards (Q&A) and 10 MCQs with options and correct answers based on the following notes content:
${note.text}

Return the response in JSON format with two keys: flashcards and mcqs.
    `;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiResponseText = await response.text();

    let parsed;
    try {
      parsed = JSON.parse(aiResponseText);
    } catch (err) {
      parsed = { flashcards: [], mcqs: [], raw: aiResponseText }; // fallback
    }

    let flashcardDoc = await Flashcard.findOne({ user: userId, note: noteId });

    if (!flashcardDoc) {
      flashcardDoc = new Flashcard({
        user: userId,
        note: noteId,
        type: 'flashcard',
        data: parsed,
      });
    } else {
      flashcardDoc.data = parsed;
    }

    await flashcardDoc.save();

    res.json({ flashcards: parsed.flashcards, mcqs: parsed.mcqs });
  } catch (err) {
    res.status(500).json({ error: 'Flashcard generation failed', details: err.message });
  }
};
