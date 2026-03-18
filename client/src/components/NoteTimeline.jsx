import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { fetchNotes, createNote, deleteNote } from "../api/notes";

export default function NoteTimeline({ leadId }) {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const { data } = await fetchNotes(leadId);
    setNotes(data);
  };

  useEffect(() => {
    load();
  }, [leadId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    try {
      await createNote({ content: text, lead: leadId });
      setText("");
      toast.success("Note added");
      load();
    } catch (err) {
      toast.error("Failed to add note");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNote(id);
      toast.success("Note deleted");
      load();
    } catch (err) {
      toast.error("Failed to delete note");
    }
  };

  return (
    <div>
      <h4 style={{ margin: "0 0 12px", fontSize: 15 }}>Notes</h4>
      <form
        onSubmit={handleAdd}
        style={{ display: "flex", gap: 8, marginBottom: 20 }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a note..."
          style={{ flex: 1 }}
        />
        <button type="submit" disabled={loading}>
          Add
        </button>
      </form>

      {notes.length === 0 ? (
        <p style={{ color: "#9ca3af", fontSize: 14 }}>No notes yet</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {notes.map((note) => (
            <div
              key={note._id}
              style={{
                background: "#f9fafb",
                borderRadius: 8,
                padding: "12px 14px",
                borderLeft: "3px solid #3b82f6",
              }}
            >
              <p style={{ margin: "0 0 6px", fontSize: 14 }}>{note.content}</p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 12, color: "#9ca3af" }}>
                  {note.createdBy?.name} ·{" "}
                  {new Date(note.createdAt).toLocaleDateString()}
                </span>
                <button
                  onClick={() => handleDelete(note._id)}
                  style={{ fontSize: 11, color: "#ef4444", padding: "2px 8px" }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
