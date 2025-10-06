import mongoose from 'mongoose';

const flashcardSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  note: { type: mongoose.Schema.Types.ObjectId, ref: 'Notes', required: true },
  type: { type: String, enum: ['flashcard', 'mcq'], required: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true }, // flashcard Q&A or MCQs array
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Flashcard', flashcardSchema);
