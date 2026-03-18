import { useState, useEffect } from "react";

const empty = {
  title: "",
  description: "",
  dueDate: "",
  priority: "medium",
  status: "pending",
  lead: "",
};

export default function TaskModal({ task, leads, onClose, onSave }) {
  const [form, setForm] = useState(empty);

  useEffect(() => {
    if (task?._id) {
      setForm({
        ...task,
        lead: task.lead?._id || task.lead || "",
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : "",
      });
    } else {
      setForm(empty);
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3 className="modal-title">{task?._id ? "Edit Task" : "New Task"}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              value={form.title}
              required
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Task title"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Optional details..."
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Due date</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                {["low", "medium", "high"].map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                {["pending", "in-progress", "completed"].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Linked lead</label>
              <select
                value={form.lead}
                onChange={(e) => setForm({ ...form, lead: e.target.value })}
              >
                <option value="">None</option>
                {leads.map((l) => (
                  <option key={l._id} value={l._id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {task?._id ? "Update Task" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
