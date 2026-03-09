"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

type Report = {
  id: string;
  title: string | null;
  description: string | null;
  report_type: string;
  status: string;
  storage_path: string | null;
  version: number;
  created_at: string;
  updated_at: string;
};

function statusBadge(status: string) {
  const cls = status === "completed" ? "dash-badge-success" : status === "failed" ? "dash-badge-error" : "dash-badge-warning";
  return <span className={`dash-badge ${cls}`}>{status}</span>;
}

function fmt(ts: string) {
  return new Date(ts).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/reports");
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || "Failed to load reports");
      setReports(Array.isArray(payload) ? payload : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load reports");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function deleteReport(id: string) {
    if (!confirm("Delete this report? This cannot be undone.")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/reports/${id}`, { method: "DELETE" });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || "Delete failed");
      setReports((prev) => prev.filter((r) => r.id !== id));
      showToast("Report deleted");
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setDeleting(null);
    }
  }

  async function downloadReport(id: string) {
    try {
      const res = await fetch(`/api/reports/${id}?download=1`);
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || "Download failed");
      if (payload.signed_url) {
        window.open(payload.signed_url, "_blank");
      }
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Download failed");
    }
  }

  return (
    <>
      <div className="dash-page-header">
        <div className="dash-page-header-left">
          <h1 className="dash-page-title">Trust Reports</h1>
          <p className="dash-page-desc">Generated trust evaluation reports stored in your account</p>
        </div>
        <Link href="/dashboard/evaluate" className="dash-btn dash-btn-primary">
          + New Evaluation
        </Link>
      </div>

      {error && <div className="dash-error">{error}</div>}

      <div className="dash-card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="dash-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Status</th>
                <th>Version</th>
                <th>Created</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: "2rem", color: "var(--d-text-muted)" }}>Loading...</td></tr>
              ) : reports.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: "center", padding: "3rem", color: "var(--d-text-muted)" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    <p>No reports yet. Run a trust evaluation to generate your first report.</p>
                    <Link href="/dashboard/evaluate" className="dash-btn dash-btn-primary">Run Evaluation</Link>
                  </div>
                </td></tr>
              ) : (
                reports.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 500 }}>{r.title || <span style={{ color: "var(--d-text-muted)" }}>Untitled</span>}</td>
                    <td><span className="dash-badge dash-badge-accent">{r.report_type}</span></td>
                    <td>{statusBadge(r.status)}</td>
                    <td style={{ color: "var(--d-text-muted)", fontSize: "0.82rem" }}>v{r.version}</td>
                    <td style={{ fontSize: "0.82rem", whiteSpace: "nowrap" }}>{fmt(r.created_at)}</td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "0.4rem", justifyContent: "flex-end" }}>
                        {r.status === "completed" && r.storage_path && (
                          <button className="dash-btn dash-btn-ghost dash-btn-sm" onClick={() => downloadReport(r.id)}>
                            Download
                          </button>
                        )}
                        <button
                          className="dash-btn dash-btn-danger dash-btn-sm"
                          disabled={deleting === r.id}
                          onClick={() => deleteReport(r.id)}
                        >
                          {deleting === r.id ? "…" : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {toast && (
        <div className="dash-toast-container">
          <div className="dash-toast success">{toast}</div>
        </div>
      )}
    </>
  );
}
