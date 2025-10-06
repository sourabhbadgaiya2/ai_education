import mongoose from "mongoose";

const notesSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  pdfUrl: String, // Cloudinary file link
  cloudinaryId: String,
  summary: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Notes", notesSchema);
