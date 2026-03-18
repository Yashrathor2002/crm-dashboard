import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        gap: 24,
        padding: "12px 32px",
        borderBottom: "1px solid #e5e7eb",
        background: "#fff",
      }}
    >
      <span style={{ fontWeight: 600, fontSize: 16 }}>CRM</span>
      <Link
        to="/dashboard"
        style={{ fontSize: 14, textDecoration: "none", color: "#374151" }}
      >
        Dashboard
      </Link>
      <Link
        to="/leads"
        style={{ fontSize: 14, textDecoration: "none", color: "#374151" }}
      >
        Leads
      </Link>
      <Link
        to="/tasks"
        style={{ fontSize: 14, textDecoration: "none", color: "#374151" }}
      >
        Tasks
      </Link>
      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <span style={{ fontSize: 13, color: "#6b7280" }}>
          {user?.name} · {user?.role}
        </span>
        <button onClick={handleLogout} style={{ fontSize: 13 }}>
          Logout
        </button>
      </div>
    </nav>
  );
}
