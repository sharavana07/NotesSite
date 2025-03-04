const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = 9400;

// Middleware
app.use(cors());
app.use(express.json()); // Use built-in JSON parser
app.use(express.static("public"));

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/notesDB")
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

// Define a Note schema
const noteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true }
});

const Note = mongoose.model("Note", noteSchema);

// Get all notes
app.get("/notes", async (req, res) => {
    try {
        const notes = await Note.find();
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving notes", error });
    }
});

// Add a new note
app.post("/notes", async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ message: "Title and content are required" });
        }

        const newNote = new Note({ title, content });
        await newNote.save();
        res.status(201).json(newNote);
    } catch (error) {
        res.status(500).json({ message: "Error adding note", error });
    }
});

// Update a note
app.put("/notes/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid note ID" });
        }

        const updatedNote = await Note.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedNote) {
            return res.status(404).json({ message: "Note not found" });
        }
        res.json(updatedNote);
    } catch (error) {
        res.status(500).json({ message: "Error updating note", error });
    }
});

// Delete a note
app.delete("/notes/:id", async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid note ID" });
        }

        const deletedNote = await Note.findByIdAndDelete(id);
        if (!deletedNote) {
            return res.status(404).json({ message: "Note not found" });
        }

        res.json({ message: "Note deleted!", deletedNote });
    } catch (error) {
        res.status(500).json({ message: "Error deleting note", error });
    }
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
