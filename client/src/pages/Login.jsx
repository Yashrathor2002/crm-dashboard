import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Login() {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        position: "relative",
      }}
    >
      <div style={{ position: "absolute", top: 20, right: 24 }}>
        <button
          onClick={toggleTheme}
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border)",
            borderRadius: 99,
            padding: "7px 14px",
            fontSize: 13,
            color: "var(--text-secondary)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>

      <div
        style={{ width: "100%", maxWidth: 420, animation: "slideUp 0.3s ease" }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              width: 52,
              height: 52,
              background: "var(--accent)",
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 700,
              color: "white",
              margin: "0 auto 16px",
              boxShadow: "0 8px 24px rgba(59,130,246,0.35)",
            }}
          >
            C
          </div>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: 6,
            }}
          >
            Welcome back
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
            Sign in to your CRM Pro account
          </p>
        </div>

        <div className="card" style={{ padding: 32 }}>
          {error && (
            <div
              style={{
                background: "var(--danger-light)",
                border: "1px solid var(--danger)",
                borderRadius: "var(--radius-md)",
                padding: "10px 14px",
                marginBottom: 20,
                fontSize: 13,
                color: "var(--danger)",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                required
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                placeholder="Your password"
                value={form.password}
                required
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{
                width: "100%",
                padding: "11px",
                marginTop: 8,
                fontSize: 15,
                justifyContent: "center",
              }}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: 20,
            fontSize: 14,
            color: "var(--text-secondary)",
          }}
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{
              color: "var(--accent)",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
