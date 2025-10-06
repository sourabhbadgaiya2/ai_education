import express from 'express';
import { chatQnA, generateFlashcardsMCQs, summarizeNote } from '../controllers/aiController.js';
import {authenticate} from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/summary', authenticate, summarizeNote);

router.post('/chat', authenticate, chatQnA);

router.post('/flashcards', authenticate, generateFlashcardsMCQs);

export default router;
