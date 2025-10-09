import express from "express";
import multer from "multer";
import { storage } from "../config/cloudinary.js";
import Notes from "../models/Notes.models.js";
import {authenticate} from "../middlewares/auth.middleware.js";
import { getUserNotes } from "../controllers/notesController.js";

const upload = multer({ storage });
const router = express.Router();

router.post(
  "/upload",
  authenticate,
  upload.single("file"),
  async (req, res) => {
    
    try {
      const { originalname, path, filename } = req.file;
      const note = await Notes.create({
        user: req.user.id,
        title: originalname,
        pdfUrl: path,
        cloudinaryId: filename,
      });
      res.json({ note });
    } catch (err) {
      res
        .status(500)
        .json({ error: "File upload failed", details: err.message });
    }
  }
);


router.get('/', authenticate, getUserNotes);

export default router;
