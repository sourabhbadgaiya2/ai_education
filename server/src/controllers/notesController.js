import Notes from "../models/Notes.models.js";

export const getUserNotes = async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json({ notes });
  } catch (err) {
    next(err);
  }
};
