import api from "./axiosInstance";

export const fetchNotes = (leadId) =>
  api.get("/notes", { params: { lead: leadId } });
export const createNote = (data) => api.post("/notes", data);
export const deleteNote = (id) => api.delete(`/notes/${id}`);
