import { useState, useEffect } from "react";
import { fetchStats } from "../api/dashboard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#3b82f6", "#f59e0b", "#8b5cf6", "#10b981", "#ef4444"];

const StatCard = ({ label, value, color = "#3b82f6" }) => (
  <div className="stat-card">
    <p className="stat-label">{label}</p>
    <p className="stat-value" style={{ color }}>
      {value}
    </p>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats()
      .then((r) => setStats(r.data))
      .catch(console.error);
  }, []);

  if (!stats) return <p style={{ color: "var(--text-muted)" }}>Loading...</p>;

  const statusData = stats.leadsByStatus.map((s) => ({
    name: s._id,
    value: s.count,
  }));
  const sourceData = stats.leadsBySource.map((s) => ({
    name: s._id,
    count: s.count,
  }));
  const timeData = stats.leadsOverTime.map((s) => ({
    name: `${s._id.month}/${s._id.year}`,
    count: s.count,
  }));

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">Dashboard</h2>
          <p className="page-sub">Welcome back — here's what's happening</p>
        </div>
      </div>

      <div
        style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 28 }}
      >
        <StatCard
          label="Total leads"
          value={stats.totalLeads}
          color="var(--accent)"
        />
        <StatCard label="New" value={stats.newLeads} color="var(--accent)" />
        <StatCard label="Won" value={stats.wonLeads} color="var(--success)" />
        <StatCard label="Lost" value={stats.lostLeads} color="var(--danger)" />
        <StatCard
          label="Team members"
          value={stats.totalUsers}
          color="var(--purple)"
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          marginBottom: 20,
        }}
      >
        <div className="card">
          <h4 style={{ marginBottom: 16, color: "var(--text-primary)" }}>
            Leads by status
          </h4>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {statusData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h4 style={{ marginBottom: 16, color: "var(--text-primary)" }}>
            Leads by source
          </h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={sourceData}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: "var(--text-secondary)" }}
              />
              <YAxis tick={{ fontSize: 12, fill: "var(--text-secondary)" }} />
              <Tooltip />
              <Bar dataKey="count" fill="var(--accent)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h4 style={{ marginBottom: 16, color: "var(--text-primary)" }}>
          Leads over time
        </h4>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={timeData}>
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: "var(--text-secondary)" }}
            />
            <YAxis tick={{ fontSize: 12, fill: "var(--text-secondary)" }} />
            <Tooltip />
            <Bar dataKey="count" fill="var(--purple)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
