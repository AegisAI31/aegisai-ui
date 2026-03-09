"use client";

import { useState, useEffect, useCallback } from "react";

type AuditRecord = {
  id: string;
  action_type: string;
  entity_type: string | null;
  entity_id: string | null;
  metadata: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
};

type PageData = { total: number; page: number; limit: number; records: AuditRecord[] };

const ACTION_TYPES = ["create_report", "delete_report", "trust_evaluation", "create_api_key", "revoke_api_key", "login", "logout"];

function fmt(ts: string) {
  return new Date(ts).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function AuditTrailsPage() {
  const [data, setData] = useState<PageData | null>(null);
  const [page, setPage] = useState(1);
  const [actionType, setActionType] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<AuditRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (actionType) params.set("action_type", actionType);
    if (search) params.set("search", search);
    try {
      const res = await fetch(`/api/audit-trails?${params}`);
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || "Failed to load");
      setData(payload);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load audit trails");
    } finally {
      setLoading(false);
    }
  }, [page, actionType, search]);

  useEffect(() => { load(); }, [load]);

  async function exportCSV() {
    const params = new URLSearchParams({ export: "1" });
    if (actionType) params.set("action_type", actionType);
    const res = await fetch(`/api/audit-trails?${params}`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-trails-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const totalPages = data ? Math.ceil(data.total / data.limit) : 1;

  return (
    <>
      <div className="dash-page-header">
        <div className="dash-page-header-left">
          <h1 className="dash-page-title">Audit Trails</h1>
          <p className="dash-page-desc">Complete action history for your account</p>
        </div>
        <button className="dash-btn dash-btn-primary" onClick={exportCSV}>Export CSV</button>
      </div>

      <div className="dash-filter-bar">
        <div className="dash-search-input">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            type="text"
            placeholder="Search action type..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="dash-filter-item">
          <label>Action</label>
          <select value={actionType} onChange={(e) => { setActionType(e.target.value); setPage(1); }}>
            <option value="">All</option>
            {ACTION_TYPES.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      </div>

      {error && <div className="dash-error">{error}</div>}

      <div className="dash-card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="dash-table dash-table-clickable">
            <thead>
              <tr>
                <th>Action</th>
                <th>Entity Type</th>
                <th>Entity ID</th>
                <th>IP</th>
                <th>Timestamp</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: "2rem", color: "var(--d-text-muted)" }}>Loading...</td></tr>
              ) : !data || data.records.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: "2rem", color: "var(--d-text-muted)" }}>
                  No audit records yet. Actions like creating reports and API keys will appear here.
                </td></tr>
              ) : (
                data.records.map((r) => (
                  <tr key={r.id} onClick={() => setSelected(r)}>
                    <td><span className="dash-badge dash-badge-accent">{r.action_type}</span></td>
                    <td style={{ fontSize: "0.82rem" }}>{r.entity_type || "—"}</td>
                    <td><code style={{ fontSize: "0.78rem", color: "var(--d-text-muted)" }}>{r.entity_id ? r.entity_id.slice(0, 8) + "…" : "—"}</code></td>
                    <td style={{ fontSize: "0.82rem", color: "var(--d-text-muted)" }}>{r.ip_address || "—"}</td>
                    <td style={{ fontSize: "0.82rem", whiteSpace: "nowrap" }}>{fmt(r.created_at)}</td>
                    <td><button className="dash-btn dash-btn-ghost dash-btn-sm" onClick={(e) => { e.stopPropagation(); setSelected(r); }}>View</button></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {data && data.total > 0 && (
          <div className="dash-pagination" style={{ padding: "0.85rem 1rem" }}>
            <span className="dash-pagination-info">
              {(page - 1) * data.limit + 1}–{Math.min(page * data.limit, data.total)} of {data.total}
            </span>
            <div className="dash-pagination-controls">
              <button className="dash-pagination-btn" disabled={page <= 1} onClick={() => setPage(page - 1)}>‹</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} className={`dash-pagination-btn ${p === page ? "active" : ""}`} onClick={() => setPage(p)}>{p}</button>
              ))}
              <button className="dash-pagination-btn" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>›</button>
            </div>
          </div>
        )}
      </div>

      {selected && (
        <>
          <div className="dash-drawer-overlay" onClick={() => setSelected(null)} />
          <div className="dash-drawer">
            <div className="dash-drawer-header">
              <div>
                <h3 className="dash-modal-title">Audit Detail</h3>
                <p style={{ fontSize: "0.82rem", color: "var(--d-text-muted)", marginTop: "0.2rem" }}>{selected.id}</p>
              </div>
              <button className="dash-modal-close" onClick={() => setSelected(null)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="dash-drawer-body">
              <div className="dash-card">
                <div className="dash-detail-row"><span className="dash-detail-key">Action</span><span className="dash-badge dash-badge-accent">{selected.action_type}</span></div>
                <div className="dash-detail-row"><span className="dash-detail-key">Entity Type</span><span className="dash-detail-value">{selected.entity_type || "—"}</span></div>
                <div className="dash-detail-row"><span className="dash-detail-key">Entity ID</span><span className="dash-detail-value" style={{ fontFamily: "monospace", fontSize: "0.8rem" }}>{selected.entity_id || "—"}</span></div>
                <div className="dash-detail-row"><span className="dash-detail-key">IP Address</span><span className="dash-detail-value">{selected.ip_address || "—"}</span></div>
                <div className="dash-detail-row"><span className="dash-detail-key">Timestamp</span><span className="dash-detail-value">{new Date(selected.created_at).toLocaleString()}</span></div>
              </div>
              {selected.metadata && Object.keys(selected.metadata).length > 0 && (
                <div className="dash-card" style={{ marginTop: "1rem" }}>
                  <h4 style={{ fontSize: "0.85rem", fontWeight: 650, marginBottom: "0.75rem" }}>Metadata</h4>
                  <pre style={{ fontSize: "0.8rem", color: "var(--d-text-secondary)", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
                    {JSON.stringify(selected.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
