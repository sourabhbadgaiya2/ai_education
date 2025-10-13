import {
  summarizeNoteService,
  chatQnAService,
  getChatHistoryService,
  generateFlashcardsMCQsService,
  getFlashcardsService,
} from "../services/notes.services.js";

export const summarizeNote = async (req, res) => {
  try {
    const { noteId } = req.body;
    const summary = await summarizeNoteService(noteId);
    res.json({ summary });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Summarization failed", details: err.message });
  }
};

export const chatQnA = async (req, res, next) => {
  try {
    const { noteId, question, sessionId } = req.body;
    const userId = req.user.id;
    const result = await chatQnAService(userId, noteId, question, sessionId);
    res.json({ answer: result.aiReply, sessionId: result.sessionId });
  } catch (err) {
    next(err);
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const { noteId } = req.query;
    const userId = req.user.id;
    const history = await getChatHistoryService(userId, noteId);
    res.json(history);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch chat history", details: err.message });
  }
};

export const generateFlashcardsMCQs = async (req, res) => {
  try {
    const { noteId } = req.body;
    const userId = req.user.id;
    const parsed = await generateFlashcardsMCQsService(userId, noteId);
    res.json({
      flashcards: parsed.flashcards || [],
      mcqs: parsed.mcqs || [],
      raw: parsed.raw || null,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Flashcard generation failed", details: err.message });
  }
};

export const getFlashcards = async (req, res) => {
  try {
    const { noteId } = req.query;
    const userId = req.user.id;
    const data = await getFlashcardsService(userId, noteId);
    res.json({
      flashcards: data.flashcards || [],
      mcqs: data.mcqs || [],
      raw: data.raw || null,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch flashcards", details: err.message });
  }
};
