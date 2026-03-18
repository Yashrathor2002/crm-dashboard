import Note from "../models/Note.js";

export const getNotes = async (req, res) => {
  try {
    const { lead } = req.query;
    const filter = lead ? { lead } : {};
    const notes = await Note.find(filter)
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createNote = async (req, res) => {
  try {
    const note = new Note({ ...req.body, createdBy: req.user._id });
    await note.save();
    await note.populate("createdBy", "name");
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
