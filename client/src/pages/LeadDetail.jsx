import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import NoteTimeline from "../components/NoteTimeline";

const STATUS_COLORS = {
  new: { bg: "var(--accent-light)", text: "var(--accent)" },
  contacted: { bg: "var(--warning-light)", text: "var(--warning)" },
  qualified: { bg: "var(--purple-light)", text: "var(--purple)" },
  won: { bg: "var(--success-light)", text: "var(--success)" },
  lost: { bg: "var(--danger-light)", text: "var(--danger)" },
};

export default function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);

  useEffect(() => {
    api
      .get(`/leads/${id}`)
      .then((r) => setLead(r.data))
      .catch(() => navigate("/leads"));
  }, [id]);

  if (!lead) return <p style={{ color: "var(--text-muted)" }}>Loading...</p>;

  return (
    <>
      <button
        onClick={() => navigate("/leads")}
        style={{
          marginBottom: 20,
          fontSize: 13,
          color: "var(--text-secondary)",
        }}
      >
        ← Back to Leads
      </button>

      <div className="card" style={{ marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 16,
          }}
        >
          <div>
            <h2 style={{ margin: "0 0 4px", color: "var(--text-primary)" }}>
              {lead.name}
            </h2>
            <p
              style={{
                margin: 0,
                color: "var(--text-secondary)",
                fontSize: 14,
              }}
            >
              {lead.email}
            </p>
          </div>
          <span
            className="badge"
            style={{
              background: STATUS_COLORS[lead.status]?.bg,
              color: STATUS_COLORS[lead.status]?.text,
              fontSize: 13,
              padding: "5px 14px",
            }}
          >
            {lead.status}
          </span>
        </div>

        <div className="lead-detail-grid">
          {[
            ["Phone", lead.phone || "—"],
            ["Source", lead.source],
            ["Created", new Date(lead.createdAt).toLocaleDateString()],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="detail-field-label">{label}</p>
              <p className="detail-field-value">{value}</p>
            </div>
          ))}
        </div>

        {lead.notes && (
          <div
            style={{
              marginTop: 16,
              padding: "12px 14px",
              background: "var(--bg-tertiary)",
              borderRadius: "var(--radius-md)",
              fontSize: 14,
              color: "var(--text-secondary)",
            }}
          >
            {lead.notes}
          </div>
        )}
      </div>

      <div className="card">
        <NoteTimeline leadId={id} />
      </div>
    </>
  );
}
