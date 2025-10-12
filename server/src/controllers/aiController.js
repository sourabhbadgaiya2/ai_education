import axios from "axios";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParseModule = require("pdf-parse");
const pdfParse = pdfParseModule.default || pdfParseModule;

import Notes from "../models/Notes.models.js";
import { aiSummarize } from "../helpers/aiHelper.js";
import ChatSession from "../models/ChatSession.js";
import Flashcard from "../models/Flashcard.js";

import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "../config/env.config.js";

const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);

export const summarizeNote = async (req, res) => {
  try {
    const { noteId } = req.body;
    const note = await Notes.findById(noteId);
    if (!note) return res.status(404).json({ error: "Note not found" });

    const fileBuffer = (
      await axios.get(note.pdfUrl, { responseType: "arraybuffer" })
    ).data;

    const { text } = await pdfParse(fileBuffer);

    const summary = await aiSummarize(text);

    note.summary = summary;
    await note.save();

    res.json({ summary });
  } catch (err) {
    res.status(500).json({
      error: "Summarization failed",
      details: err.message,
    });
  }
};

export const chatQnA = async (req, res) => {
  try {
    const { noteId, question, sessionId } = req.body;
    const userId = req.user.id;

    const note = await Notes.findById(noteId);
    if (!note) return res.status(404).json({ error: "Note not found" });

    let session;
    if (sessionId) {
      session = await ChatSession.findById(sessionId);
      if (!session)
        return res.status(404).json({ error: "Chat session not found" });
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

    res.json({ answer: aiReply, sessionId: session._id });
  } catch (err) {
    next(err);
  }
};

export const getChatHistory = async (req, res) => {
  try {
    const { noteId } = req.query;
    const userId = req.user.id;

    if (!noteId) {
      return res.status(400).json({ error: "noteId is required" });
    }

    // Find chat session for this user + note
    const session = await ChatSession.findOne({
      user: userId,
      note: noteId,
    });

    if (!session) {
      return res.json({
        sessionId: null,
        messages: [],
      });
    }

    res.json({
      sessionId: session._id,
      messages: session.messages,
    });
  } catch (err) {
    console.error("Error fetching chat history:", err);
    res.status(500).json({
      error: "Failed to fetch chat history",
      details: err.message,
    });
  }
};

export const generateFlashcardsMCQs = async (req, res) => {
  try {
    const { noteId } = req.body;
    const userId = req.user.id;

    const note = await Notes.findById(noteId);
    if (!note) return res.status(404).json({ error: "Note not found" });

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

    // console.log("Raw AI flashcards response:", aiResponseText);

    // Helper function to extract JSON substring
    function extractJSON(text) {
      const firstBrace = text.indexOf("{");
      const lastBrace = text.lastIndexOf("}");
      if (firstBrace === -1 || lastBrace === -1) return null;
      const jsonString = text.substring(firstBrace, lastBrace + 1);
      try {
        return JSON.parse(jsonString);
      } catch {
        return null;
      }
    }

    let parsed = extractJSON(aiResponseText);

    if (!parsed) {
      parsed = { flashcards: [], mcqs: [], raw: aiResponseText };
    }

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

    if (!noteId) {
      return res.status(400).json({ error: "noteId is required" });
    }

    // User aur note ke basis par flashcard dhoondhna
    const flashcardDoc = await Flashcard.findOne({
      user: userId,
      note: noteId,
    });

    if (!flashcardDoc) {
      return res
        .status(404)
        .json({ error: "No flashcards found for this note" });
    }

    res.json({
      flashcards: flashcardDoc.data.flashcards || [],
      mcqs: flashcardDoc.data.mcqs || [],
      raw: flashcardDoc.data.raw || null,
    });
  } catch (err) {
    console.error("Error fetching flashcards:", err);
    res.status(500).json({
      error: "Failed to fetch flashcards",
      details: err.message,
    });
  }
};
