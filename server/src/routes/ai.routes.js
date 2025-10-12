import express from "express";
import {
  chatQnA,
  generateFlashcardsMCQs,
  getChatHistory,
  getFlashcards,
  summarizeNote,
} from "../controllers/aiController.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/summary", authenticate, summarizeNote);

router.post("/chat", authenticate, chatQnA);

router.get("/chat/history", authenticate, getChatHistory);

router.post("/flashcards", authenticate, generateFlashcardsMCQs);

router.get("/flashcards", authenticate, getFlashcards);

export default router;
