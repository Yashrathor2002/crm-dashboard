import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetchLeads, createLead, updateLead, deleteLead } from "../api/leads";
import LeadModal from "../components/LeadModal";
import toast from "react-hot-toast";

const STATUS_COLORS = {
  new: { bg: "var(--accent-light)", text: "var(--accent)" },
  contacted: { bg: "var(--warning-light)", text: "var(--warning)" },
  qualified: { bg: "var(--purple-light)", text: "var(--purple)" },
  won: { bg: "var(--success-light)", text: "var(--success)" },
  lost: { bg: "var(--danger-light)", text: "var(--danger)" },
};

export default function Leads() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [source, setSource] = useState("");
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await fetchLeads({
        page,
        limit: 10,
        search,
        status,
        source,
      });
      setLeads(data.leads);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) {
      toast.error("Failed to load leads");
    } finally {
      setLoading(false);
    }
  }, [page, search, status, source]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async (form) => {
    try {
      if (form._id) {
        await updateLead(form._id, form);
        toast.success("Lead updated");
      } else {
        await createLead(form);
        toast.success("Lead created");
      }
      setModal(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this lead?")) return;
    try {
      await deleteLead(id);
      toast.success("Lead deleted");
      load();
    } catch (err) {
      toast.error("Failed to delete lead");
    }
  };

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">Leads</h2>
          <p className="page-sub">{total} total leads</p>
        </div>
        <button className="btn-primary" onClick={() => setModal({})}>
          + New Lead
        </button>
      </div>

      <div className="filters-bar">
        <input
          placeholder="Search name, email, phone..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All statuses</option>
          {["new", "contacted", "qualified", "won", "lost"].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={source}
          onChange={(e) => {
            setSource(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All sources</option>
          {["website", "referral", "social", "email", "other"].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {[
                "Name",
                "Email",
                "Phone",
                "Status",
                "Source",
                "Created",
                "Actions",
              ].map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    textAlign: "center",
                    padding: 40,
                    color: "var(--text-muted)",
                  }}
                >
                  Loading...
                </td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    textAlign: "center",
                    padding: 40,
                    color: "var(--text-muted)",
                  }}
                >
                  No leads found
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead._id}>
                  <td>
                    <span
                      onClick={() => navigate(`/leads/${lead._id}`)}
                      style={{
                        fontWeight: 600,
                        cursor: "pointer",
                        color: "var(--accent)",
                      }}
                    >
                      {lead.name}
                    </span>
                  </td>
                  <td style={{ color: "var(--text-secondary)" }}>
                    {lead.email}
                  </td>
                  <td style={{ color: "var(--text-secondary)" }}>
                    {lead.phone || "—"}
                  </td>
                  <td>
                    <span
                      className="badge"
                      style={{
                        background: STATUS_COLORS[lead.status]?.bg,
                        color: STATUS_COLORS[lead.status]?.text,
                      }}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td style={{ color: "var(--text-secondary)" }}>
                    {lead.source}
                  </td>
                  <td style={{ color: "var(--text-secondary)" }}>
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => setModal(lead)}
                        style={{ fontSize: 12, padding: "4px 10px" }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(lead._id)}
                        className="btn-danger"
                        style={{ fontSize: 12, padding: "4px 10px" }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <span className="pagination-info">
          Page {page} of {pages}
        </span>
        <div className="pagination-btns">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            ← Previous
          </button>
          <button
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            disabled={page === pages}
          >
            Next →
          </button>
        </div>
      </div>

      {modal !== null && (
        <LeadModal
          lead={modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}
    </>
  );
}
