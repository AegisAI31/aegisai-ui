"use client";

import { useState, useMemo } from "react";
import { auditRecords } from "../../../mock/audit-trails";
import type { AuditRecord } from "../../../mock/types";

const ITEMS_PER_PAGE = 10;

const endpoints = Array.from(new Set(auditRecords.map((r) => r.endpoint)));
const policyNames = Array.from(new Set(auditRecords.map((r) => r.policy)));
const statuses: AuditRecord["status"][] = ["Approved", "Blocked", "Escalated"];

function getRiskLevel(score: number) {
  if (score <= 30) return "low";
  if (score <= 70) return "medium";
  return "high";
}

function formatTimestamp(ts: string) {
  const d = new Date(ts);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function statusBadgeClass(status: AuditRecord["status"]) {
  switch (status) {
    case "Approved":
      return "dash-badge dash-badge-success";
    case "Blocked":
      return "dash-badge dash-badge-error";
    case "Escalated":
      return "dash-badge dash-badge-warning";
  }
}

function severityColor(severity: string) {
  switch (severity) {
    case "critical":
      return "var(--d-error)";
    case "high":
      return "#dc2626";
    case "medium":
      return "var(--d-warning)";
    case "low":
      return "var(--d-success)";
    default:
      return "var(--d-text-muted)";
  }
}

function exportCSV(records: AuditRecord[]) {
  const headers = [
    "Request ID",
    "Timestamp",
    "API Key",
    "Endpoint",
    "Status",
    "Risk Score",
    "Policy",
    "Report ID",
    "Model",
    "Provider",
    "Latency (ms)",
    "Input Tokens",
    "Output Tokens",
    "Enforcement Action",
    "Violations",
  ];
  const rows = records.map((r) => [
    r.requestId,
    r.timestamp,
    r.apiKey,
    r.endpoint,
    r.status,
    r.riskScore,
    r.policy,
    r.reportId,
    r.model,
    r.provider,
    r.latencyMs,
    r.inputTokens,
    r.outputTokens,
    r.enforcementAction,
    r.violations.map((v) => `${v.category}: ${v.description}`).join("; "),
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `audit-trails-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function AuditTrailsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [endpointFilter, setEndpointFilter] = useState("");
  const [policyFilter, setPolicyFilter] = useState("");
  const [page, setPage] = useState(1);
  const [selectedRecord, setSelectedRecord] = useState<AuditRecord | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let results = auditRecords;
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        (r) =>
          r.requestId.toLowerCase().includes(q) ||
          r.reportId.toLowerCase().includes(q) ||
          r.endpoint.toLowerCase().includes(q) ||
          r.policy.toLowerCase().includes(q) ||
          r.model.toLowerCase().includes(q)
      );
    }
    if (statusFilter) {
      results = results.filter((r) => r.status === statusFilter);
    }
    if (endpointFilter) {
      results = results.filter((r) => r.endpoint === endpointFilter);
    }
    if (policyFilter) {
      results = results.filter((r) => r.policy === policyFilter);
    }
    return results;
  }, [search, statusFilter, endpointFilter, policyFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const summaryApproved = auditRecords.filter((r) => r.status === "Approved").length;
  const summaryBlocked = auditRecords.filter((r) => r.status === "Blocked").length;
  const summaryEscalated = auditRecords.filter((r) => r.status === "Escalated").length;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleExport = () => {
    exportCSV(filtered);
    showToast("CSV exported successfully");
  };

  const handlePageChange = (newPage: number) => {
    setPage(Math.max(1, Math.min(totalPages, newPage)));
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setEndpointFilter("");
    setPolicyFilter("");
    setPage(1);
  };

  return (
    <>
      <div className="dash-page-header">
        <div className="dash-page-header-left">
          <h1 className="dash-page-title">Audit Trails</h1>
          <p className="dash-page-desc">
            Complete request history with enforcement decisions and risk analysis
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button className="dash-btn dash-btn-ghost" onClick={clearFilters}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M7 12h10"/><path d="M10 18h4"/></svg>
            Clear Filters
          </button>
          <button className="dash-btn dash-btn-primary" onClick={handleExport}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export CSV
          </button>
        </div>
      </div>

      <div className="dash-summary-bar">
        <div className="dash-summary-item">
          <div className="dash-summary-icon accent">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          </div>
          <div className="dash-summary-text">
            <span className="dash-summary-value">{auditRecords.length}</span>
            <span className="dash-summary-label">Total Requests</span>
          </div>
        </div>
        <div className="dash-summary-item">
          <div className="dash-summary-icon success">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <div className="dash-summary-text">
            <span className="dash-summary-value">{summaryApproved}</span>
            <span className="dash-summary-label">Approved</span>
          </div>
        </div>
        <div className="dash-summary-item">
          <div className="dash-summary-icon error">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          </div>
          <div className="dash-summary-text">
            <span className="dash-summary-value">{summaryBlocked}</span>
            <span className="dash-summary-label">Blocked</span>
          </div>
        </div>
        <div className="dash-summary-item">
          <div className="dash-summary-icon warning">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <div className="dash-summary-text">
            <span className="dash-summary-value">{summaryEscalated}</span>
            <span className="dash-summary-label">Escalated</span>
          </div>
        </div>
      </div>

      <div className="dash-filter-bar">
        <div className="dash-search-input">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            type="text"
            placeholder="Search by request ID, report ID, endpoint, policy..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <div className="dash-filter-item">
          <label>Status</label>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="">All</option>
            {statuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="dash-filter-item">
          <label>Endpoint</label>
          <select value={endpointFilter} onChange={(e) => { setEndpointFilter(e.target.value); setPage(1); }}>
            <option value="">All</option>
            {endpoints.map((ep) => (
              <option key={ep} value={ep}>{ep}</option>
            ))}
          </select>
        </div>
        <div className="dash-filter-item">
          <label>Policy</label>
          <select value={policyFilter} onChange={(e) => { setPolicyFilter(e.target.value); setPage(1); }}>
            <option value="">All</option>
            {policyNames.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="dash-card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table className="dash-table dash-table-clickable">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Timestamp</th>
                <th>API Key</th>
                <th>Endpoint</th>
                <th>Status</th>
                <th>Risk Score</th>
                <th>Policy</th>
                <th>Report ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", padding: "2rem", color: "var(--d-text-muted)" }}>
                    No records match your filters
                  </td>
                </tr>
              ) : (
                paginated.map((record) => (
                  <tr key={record.requestId} onClick={() => setSelectedRecord(record)}>
                    <td>
                      <code style={{ fontSize: "0.8rem", background: "var(--d-bg)", padding: "0.15rem 0.4rem", borderRadius: "4px", border: "1px solid var(--d-border)" }}>
                        {record.requestId}
                      </code>
                    </td>
                    <td style={{ whiteSpace: "nowrap", fontSize: "0.82rem", color: "var(--d-text-secondary)" }}>
                      {formatTimestamp(record.timestamp)}
                    </td>
                    <td>
                      <code style={{ fontSize: "0.78rem", color: "var(--d-text-muted)" }}>{record.apiKey}</code>
                    </td>
                    <td style={{ fontSize: "0.82rem" }}>{record.endpoint}</td>
                    <td>
                      <span className={statusBadgeClass(record.status)}>{record.status}</span>
                    </td>
                    <td>
                      <div className="dash-risk-bar">
                        <div className="dash-risk-bar-track">
                          <div
                            className={`dash-risk-bar-fill ${getRiskLevel(record.riskScore)}`}
                            style={{ width: `${record.riskScore}%` }}
                          />
                        </div>
                        <span className="dash-risk-score" style={{ color: record.riskScore > 70 ? "var(--d-error)" : record.riskScore > 30 ? "var(--d-warning)" : "var(--d-success)" }}>
                          {record.riskScore}
                        </span>
                      </div>
                    </td>
                    <td style={{ fontSize: "0.82rem" }}>{record.policy}</td>
                    <td>
                      <code style={{ fontSize: "0.78rem", color: "var(--d-text-muted)" }}>{record.reportId}</code>
                    </td>
                    <td>
                      <button
                        className="dash-btn dash-btn-ghost dash-btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRecord(record);
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="dash-pagination" style={{ padding: "0.85rem 1rem" }}>
          <span className="dash-pagination-info">
            Showing {filtered.length === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} records
          </span>
          <div className="dash-pagination-controls">
            <button
              className="dash-pagination-btn"
              disabled={page <= 1}
              onClick={() => handlePageChange(page - 1)}
            >
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`dash-pagination-btn ${p === page ? "active" : ""}`}
                onClick={() => handlePageChange(p)}
              >
                {p}
              </button>
            ))}
            <button
              className="dash-pagination-btn"
              disabled={page >= totalPages}
              onClick={() => handlePageChange(page + 1)}
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {selectedRecord && (
        <>
          <div className="dash-drawer-overlay" onClick={() => setSelectedRecord(null)} />
          <div className="dash-drawer">
            <div className="dash-drawer-header">
              <div>
                <h3 className="dash-modal-title">Request Details</h3>
                <p style={{ fontSize: "0.82rem", color: "var(--d-text-muted)", marginTop: "0.2rem" }}>
                  {selectedRecord.requestId}
                </p>
              </div>
              <button className="dash-modal-close" onClick={() => setSelectedRecord(null)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="dash-drawer-body">
              <div style={{ marginBottom: "1.25rem" }}>
                <span className={statusBadgeClass(selectedRecord.status)} style={{ fontSize: "0.85rem", padding: "0.3rem 0.85rem" }}>
                  {selectedRecord.status}
                </span>
                <span style={{ marginLeft: "0.75rem", fontSize: "0.85rem", color: "var(--d-text-secondary)" }}>
                  Risk Score: <strong style={{ color: selectedRecord.riskScore > 70 ? "var(--d-error)" : selectedRecord.riskScore > 30 ? "var(--d-warning)" : "var(--d-success)" }}>{selectedRecord.riskScore}/100</strong>
                </span>
              </div>

              <div className="dash-card" style={{ marginBottom: "1rem" }}>
                <h4 style={{ fontSize: "0.85rem", fontWeight: 650, marginBottom: "0.75rem", color: "var(--d-text)" }}>Request Info</h4>
                <div className="dash-detail-row">
                  <span className="dash-detail-key">Timestamp</span>
                  <span className="dash-detail-value">{new Date(selectedRecord.timestamp).toLocaleString()}</span>
                </div>
                <div className="dash-detail-row">
                  <span className="dash-detail-key">API Key</span>
                  <span className="dash-detail-value">{selectedRecord.apiKey}</span>
                </div>
                <div className="dash-detail-row">
                  <span className="dash-detail-key">Endpoint</span>
                  <span className="dash-detail-value">{selectedRecord.endpoint}</span>
                </div>
                <div className="dash-detail-row">
                  <span className="dash-detail-key">Report ID</span>
                  <span className="dash-detail-value">{selectedRecord.reportId}</span>
                </div>
              </div>

              <div className="dash-card" style={{ marginBottom: "1rem" }}>
                <h4 style={{ fontSize: "0.85rem", fontWeight: 650, marginBottom: "0.75rem", color: "var(--d-text)" }}>Model &amp; Provider</h4>
                <div className="dash-detail-row">
                  <span className="dash-detail-key">Model</span>
                  <span className="dash-detail-value">{selectedRecord.model}</span>
                </div>
                <div className="dash-detail-row">
                  <span className="dash-detail-key">Provider</span>
                  <span className="dash-detail-value">{selectedRecord.provider}</span>
                </div>
                <div className="dash-detail-row">
                  <span className="dash-detail-key">Input Tokens</span>
                  <span className="dash-detail-value">{selectedRecord.inputTokens.toLocaleString()}</span>
                </div>
                <div className="dash-detail-row">
                  <span className="dash-detail-key">Output Tokens</span>
                  <span className="dash-detail-value">{selectedRecord.outputTokens.toLocaleString()}</span>
                </div>
              </div>

              <div className="dash-card" style={{ marginBottom: "1rem" }}>
                <h4 style={{ fontSize: "0.85rem", fontWeight: 650, marginBottom: "0.75rem", color: "var(--d-text)" }}>Risk Metrics</h4>
                <div style={{ marginBottom: "0.75rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                    <span style={{ fontSize: "0.82rem", color: "var(--d-text-muted)" }}>Risk Score</span>
                    <span style={{ fontSize: "0.82rem", fontWeight: 600, color: selectedRecord.riskScore > 70 ? "var(--d-error)" : selectedRecord.riskScore > 30 ? "var(--d-warning)" : "var(--d-success)" }}>{selectedRecord.riskScore}/100</span>
                  </div>
                  <div className="dash-risk-bar">
                    <div className="dash-risk-bar-track" style={{ flex: 1 }}>
                      <div
                        className={`dash-risk-bar-fill ${getRiskLevel(selectedRecord.riskScore)}`}
                        style={{ width: `${selectedRecord.riskScore}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="dash-detail-row">
                  <span className="dash-detail-key">Policy</span>
                  <span className="dash-detail-value">{selectedRecord.policy}</span>
                </div>
                <div className="dash-detail-row">
                  <span className="dash-detail-key">Policy ID</span>
                  <span className="dash-detail-value">{selectedRecord.policyId}</span>
                </div>
                <div className="dash-detail-row">
                  <span className="dash-detail-key">Enforcement</span>
                  <span className="dash-detail-value">{selectedRecord.enforcementAction}</span>
                </div>
              </div>

              {selectedRecord.violations.length > 0 && (
                <div className="dash-card" style={{ marginBottom: "1rem" }}>
                  <h4 style={{ fontSize: "0.85rem", fontWeight: 650, marginBottom: "0.75rem", color: "var(--d-text)" }}>Violations ({selectedRecord.violations.length})</h4>
                  {selectedRecord.violations.map((v, i) => (
                    <div key={i} style={{ padding: "0.65rem 0", borderBottom: i < selectedRecord.violations.length - 1 ? "1px solid var(--d-border-light)" : "none" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
                        <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--d-text)" }}>{v.category}</span>
                        <span className="dash-badge" style={{ background: `${severityColor(v.severity)}15`, color: severityColor(v.severity), fontSize: "0.7rem", textTransform: "uppercase" }}>
                          {v.severity}
                        </span>
                      </div>
                      <p style={{ fontSize: "0.82rem", color: "var(--d-text-secondary)", margin: 0 }}>{v.description}</p>
                      <p style={{ fontSize: "0.75rem", color: "var(--d-text-muted)", margin: "0.25rem 0 0 0" }}>Confidence: {(v.confidence * 100).toFixed(0)}%</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="dash-card" style={{ marginBottom: "1rem" }}>
                <h4 style={{ fontSize: "0.85rem", fontWeight: 650, marginBottom: "0.75rem", color: "var(--d-text)" }}>Latency Breakdown</h4>
                <div className="dash-detail-row">
                  <span className="dash-detail-key">Total Latency</span>
                  <span className="dash-detail-value">{selectedRecord.latencyMs}ms</span>
                </div>
                <div className="dash-detail-row">
                  <span className="dash-detail-key">Policy Evaluation</span>
                  <span className="dash-detail-value">{Math.round(selectedRecord.latencyMs * 0.3)}ms</span>
                </div>
                <div className="dash-detail-row">
                  <span className="dash-detail-key">Risk Scoring</span>
                  <span className="dash-detail-value">{Math.round(selectedRecord.latencyMs * 0.2)}ms</span>
                </div>
                <div className="dash-detail-row">
                  <span className="dash-detail-key">Content Analysis</span>
                  <span className="dash-detail-value">{Math.round(selectedRecord.latencyMs * 0.4)}ms</span>
                </div>
                <div className="dash-detail-row">
                  <span className="dash-detail-key">Overhead</span>
                  <span className="dash-detail-value">{Math.round(selectedRecord.latencyMs * 0.1)}ms</span>
                </div>
              </div>

              <div className="dash-card" style={{ marginBottom: "1rem" }}>
                <h4 style={{ fontSize: "0.85rem", fontWeight: 650, marginBottom: "0.75rem", color: "var(--d-text)" }}>Input (Redacted)</h4>
                <div style={{ background: "var(--d-bg)", borderRadius: "8px", padding: "0.85rem", fontSize: "0.82rem", color: "var(--d-text-secondary)", lineHeight: 1.5, border: "1px solid var(--d-border)" }}>
                  {selectedRecord.inputPayload}
                </div>
              </div>

              {selectedRecord.outputPayload && (
                <div className="dash-card" style={{ marginBottom: "1rem" }}>
                  <h4 style={{ fontSize: "0.85rem", fontWeight: 650, marginBottom: "0.75rem", color: "var(--d-text)" }}>Output (Redacted)</h4>
                  <div style={{ background: "var(--d-bg)", borderRadius: "8px", padding: "0.85rem", fontSize: "0.82rem", color: "var(--d-text-secondary)", lineHeight: 1.5, border: "1px solid var(--d-border)" }}>
                    {selectedRecord.outputPayload}
                  </div>
                </div>
              )}

              <div className="dash-card">
                <h4 style={{ fontSize: "0.85rem", fontWeight: 650, marginBottom: "0.75rem", color: "var(--d-text)" }}>Audit Metadata</h4>
                {Object.entries(selectedRecord.metadata).map(([key, value]) => (
                  <div className="dash-detail-row" key={key}>
                    <span className="dash-detail-key">{key}</span>
                    <span className="dash-detail-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {toast && (
        <div className="dash-toast-container">
          <div className="dash-toast success">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            {toast}
          </div>
        </div>
      )}
    </>
  );
}