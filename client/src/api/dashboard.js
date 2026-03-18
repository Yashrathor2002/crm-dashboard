import api from "./axiosInstance";

export const fetchStats = () => api.get("/dashboard/stats");
