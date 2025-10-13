import axios from "axios";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParseModule = require("pdf-parse");
const pdfParse = pdfParseModule.default || pdfParseModule;

import Notes from "../models/Notes.models.js";
import ChatSession from "../models/ChatSession.js";
import Flashcard from "../models/Flashcard.js";
import { aiSummarize } from "../helpers/aiHelper.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "../config/env.config.js";

const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);

export const summarizeNoteService = async (noteId) => {
  const note = await Notes.findById(noteId);
  if (!note) throw new Error("Note not found");

  const fileBuffer = (
    await axios.get(note.pdfUrl, { responseType: "arraybuffer" })
  ).data;
  const { text } = await pdfParse(fileBuffer);
  const summary = await aiSummarize(text);

  note.summary = summary;
  await note.save();

  return summary;
};

export const chatQnAService = async (userId, noteId, question, sessionId) => {
  const note = await Notes.findById(noteId);
  if (!note) throw new Error("Note not found");

  let session;
  if (sessionId) {
    session = await ChatSession.findById(sessionId);
    if (!session) throw new Error("Chat session not found");
  } else {
    session = await ChatSession.findOne({ user: userId, note: noteId });
    if (!session)
      session = new ChatSession({ user: userId, note: noteId, messages: [] });
  }

  session.messages.push({ role: "user", content: question });

  const chatHistoryText = session.messages
    .map((msg) => `${msg.role === "user" ? "User" : "AI"}: ${msg.content}`)
    .join("\n");

  const prompt = `
You are a helpful study assistant. Use the following notes summary and previous conversation to answer the question concisely.

Notes Summary:
${note.summary}

Conversation so far:
${chatHistoryText}

User question:
${question}

Answer:
`;

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const aiReply = await response.text();

  session.messages.push({ role: "ai", content: aiReply });
  await session.save();

  return { aiReply, sessionId: session._id };
};

export const getChatHistoryService = async (userId, noteId) => {
  if (!noteId) throw new Error("noteId is required");

  const session = await ChatSession.findOne({ user: userId, note: noteId });
  if (!session) return { sessionId: null, messages: [] };

  return { sessionId: session._id, messages: session.messages };
};

export const generateFlashcardsMCQsService = async (userId, noteId) => {
  const note = await Notes.findById(noteId);
  if (!note) throw new Error("Note not found");

  const prompt = `
Please respond ONLY with a single valid JSON object matching this format:

{
  "flashcards": [{ "question": "...", "answer": "..." }, ...],
  "mcqs": [{ "question": "...", "options": ["...", "..."], "correct_answer": "..." }, ...]
}

No additional text, comments, or explanation.
Notes content:
${note.summary}
`;

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const aiResponseText = await response.text();

  function extractJSON(text) {
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    if (firstBrace === -1 || lastBrace === -1) return null;
    try {
      return JSON.parse(text.substring(firstBrace, lastBrace + 1));
    } catch {
      return null;
    }
  }

  let parsed = extractJSON(aiResponseText) || {
    flashcards: [],
    mcqs: [],
    raw: aiResponseText,
  };

  let flashcardDoc = await Flashcard.findOne({ user: userId, note: noteId });
  if (!flashcardDoc) {
    flashcardDoc = new Flashcard({
      user: userId,
      note: noteId,
      type: "flashcard",
      data: parsed,
    });
  } else {
    flashcardDoc.data = parsed;
  }
  await flashcardDoc.save();

  return parsed;
};

export const getFlashcardsService = async (userId, noteId) => {
  if (!noteId) throw new Error("noteId is required");

  const flashcardDoc = await Flashcard.findOne({ user: userId, note: noteId });
  if (!flashcardDoc) throw new Error("No flashcards found for this note");

  return flashcardDoc.data;
};


