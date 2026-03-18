import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const NAV = [
  { to: "/dashboard", icon: "▦", label: "Dashboard" },
  { to: "/leads", icon: "◎", label: "Leads" },
  { to: "/tasks", icon: "✓", label: "Tasks" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">C</div>
          <span className="sidebar-logo-text">CRM Pro</span>
        </div>
        <button
          className="sidebar-toggle"
          onClick={() => setCollapsed((c) => !c)}
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Main</div>
        {NAV.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <span className="nav-icon">{icon}</span>
            <span className="nav-label">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-card">
          <div className="user-avatar">{initials}</div>
          <div className="user-info">
            <div className="user-name">{user?.name}</div>
            <div className="user-role">{user?.role}</div>
          </div>
        </div>

        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "light" ? "🌙 Dark mode" : "☀️ Light mode"}
        </button>

        <button
          onClick={handleLogout}
          className="nav-item"
          style={{ color: "#f87171", marginTop: 4 }}
        >
          <span className="nav-icon">⎋</span>
          <span className="nav-label">Logout</span>
        </button>
      </div>
    </aside>
  );
}
