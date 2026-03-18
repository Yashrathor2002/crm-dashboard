import { useState, useEffect, useCallback } from "react";
import { fetchTasks, createTask, updateTask, deleteTask } from "../api/tasks";
import { fetchLeads } from "../api/leads";
import TaskModal from "../components/TaskModal";
import useNotifications from "../hooks/useNotifications";
import toast from "react-hot-toast";

const PRIORITY_COLORS = {
  low: {
    bg: "var(--success-light)",
    text: "var(--success)",
    border: "var(--success)",
  },
  medium: {
    bg: "var(--warning-light)",
    text: "var(--warning)",
    border: "var(--warning)",
  },
  high: {
    bg: "var(--danger-light)",
    text: "var(--danger)",
    border: "var(--danger)",
  },
};

const STATUS_COLORS = {
  pending: { bg: "var(--bg-tertiary)", text: "var(--text-secondary)" },
  "in-progress": { bg: "var(--accent-light)", text: "var(--accent)" },
  completed: { bg: "var(--success-light)", text: "var(--success)" },
};

export default function Tasks() {
  useNotifications();

  const [tasks, setTasks] = useState([]);
  const [leads, setLeads] = useState([]);
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await fetchTasks({ status, priority });
      setTasks(data);
    } catch (err) {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [status, priority]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);
  useEffect(() => {
    fetchLeads({ limit: 100 }).then((r) => setLeads(r.data.leads));
  }, []);

  const handleSave = async (form) => {
    try {
      if (form._id) {
        await updateTask(form._id, form);
        toast.success("Task updated");
      } else {
        await createTask(form);
        toast.success("Task created");
      }
      setModal(null);
      loadTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await deleteTask(id);
      toast.success("Task deleted");
      loadTasks();
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  const isOverdue = (dueDate) => dueDate && new Date(dueDate) < new Date();

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">Tasks</h2>
          <p className="page-sub">{tasks.length} total tasks</p>
        </div>
        <button className="btn-primary" onClick={() => setModal({})}>
          + New Task
        </button>
      </div>

      <div className="filters-bar">
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          {["pending", "in-progress", "completed"].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="">All priorities</option>
          {["low", "medium", "high"].map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p style={{ color: "var(--text-muted)" }}>Loading...</p>
      ) : tasks.length === 0 ? (
        <p style={{ color: "var(--text-muted)" }}>No tasks found</p>
      ) : (
        tasks.map((task, i) => (
          <div
            key={task._id}
            className="task-card"
            style={{
              borderLeft: `4px solid ${PRIORITY_COLORS[task.priority]?.border}`,
              animationDelay: `${i * 0.05}s`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 6,
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      fontWeight: 600,
                      fontSize: 15,
                      color: "var(--text-primary)",
                    }}
                  >
                    {task.title}
                  </span>
                  <span
                    className="badge"
                    style={{
                      background: STATUS_COLORS[task.status]?.bg,
                      color: STATUS_COLORS[task.status]?.text,
                    }}
                  >
                    {task.status}
                  </span>
                  <span
                    className="badge"
                    style={{
                      background: PRIORITY_COLORS[task.priority]?.bg,
                      color: PRIORITY_COLORS[task.priority]?.text,
                    }}
                  >
                    {task.priority}
                  </span>
                </div>
                {task.description && (
                  <p
                    style={{
                      margin: "0 0 8px",
                      fontSize: 13,
                      color: "var(--text-secondary)",
                    }}
                  >
                    {task.description}
                  </p>
                )}
                <div
                  style={{
                    display: "flex",
                    gap: 16,
                    fontSize: 12,
                    color: "var(--text-muted)",
                    flexWrap: "wrap",
                  }}
                >
                  {task.lead && <span>Lead: {task.lead.name}</span>}
                  {task.dueDate && (
                    <span
                      style={{
                        color:
                          isOverdue(task.dueDate) && task.status !== "completed"
                            ? "var(--danger)"
                            : "var(--text-muted)",
                      }}
                    >
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                      {isOverdue(task.dueDate) &&
                        task.status !== "completed" &&
                        " — Overdue"}
                    </span>
                  )}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, marginLeft: 16 }}>
                <button
                  onClick={() => setModal(task)}
                  style={{ fontSize: 12, padding: "4px 10px" }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="btn-danger"
                  style={{ fontSize: 12, padding: "4px 10px" }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))
      )}

      {modal !== null && (
        <TaskModal
          task={modal}
          leads={leads}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </>
  );
}
