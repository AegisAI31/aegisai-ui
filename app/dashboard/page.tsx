"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { kpis, timeSeries7d, timeSeries14d, timeSeries30d, enforcementOutcomes, violationCategories, systemHealth } from "../../mock/stats";
import { auditRecords } from "../../mock/audit-trails";
import type { AuditRecord } from "../../mock/types";

type TimeRange = "7d" | "14d" | "30d";
type Environment = "Production" | "Staging" | "Development";

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  const [environment, setEnvironment] = useState<Environment>("Production");
  const [selectedRecord, setSelectedRecord] = useState<AuditRecord | null>(null);

  const timeSeriesData = useMemo(() => {
    switch (timeRange) {
      case "7d": return timeSeries7d;
      case "14d": return timeSeries14d;
      case "30d": return timeSeries30d;
      default: return timeSeries7d;
    }
  }, [timeRange]);

  const recentActivity = auditRecords.slice(0, 20);

  function getRiskLevel(score: number): string {
    if (score <= 30) return "low";
    if (score <= 70) return "medium";
    return "high";
  }

  function getStatusBadgeClass(status: string): string {
    switch (status) {
      case "Approved": return "dash-badge dash-badge-success";
      case "Blocked": return "dash-badge dash-badge-error";
      case "Escalated": return "dash-badge dash-badge-warning";
      default: return "dash-badge";
    }
  }

  function formatTimestamp(ts: string): string {
    const d = new Date(ts);
    return d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div>
      <div className="dash-page-header">
        <div className="dash-page-header-left">
          <h1 className="dash-page-title">AegisAI Control Plane</h1>
          <p className="dash-page-desc" style={{ marginBottom: 0 }}>Real-time AI governance monitoring and enforcement</p>
        </div>
        <div className="dash-env-selector">
          <label>ENV</label>
          <select value={environment} onChange={(e) => setEnvironment(e.target.value as Environment)}>
            <option>Production</option>
            <option>Staging</option>
            <option>Development</option>
          </select>
        </div>
      </div>

      <div className="dash-kpi-grid">
        {kpis.map((kpi) => (
          <div className="dash-kpi-tile" key={kpi.label}>
            <span className="dash-kpi-label">{kpi.label}</span>
            <span className="dash-kpi-value">{kpi.value}</span>
            <span className={`dash-kpi-sub ${kpi.change > 0 ? "up" : kpi.change < 0 ? "down" : ""}`}>
              {kpi.change > 0 ? "+" : ""}{kpi.change} {kpi.changeLabel}
            </span>
          </div>
        ))}
      </div>

      <div className="dash-two-panel-wide-left">
        <div>
          <div className="dash-chart-container">
            <div className="dash-chart-header">
              <span className="dash-chart-title">Requests Over Time</span>
              <div className="dash-time-toggle">
                {(["7d", "14d", "30d"] as TimeRange[]).map((r) => (
                  <button key={r} className={timeRange === r ? "active" : ""} onClick={() => setTimeRange(r)}>
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div className="dash-chart-body">
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="requests" stroke="#6366f1" strokeWidth={2} dot={false} name="Total" />
                  <Line type="monotone" dataKey="approved" stroke="#10b981" strokeWidth={1.5} dot={false} name="Approved" />
                  <Line type="monotone" dataKey="blocked" stroke="#ef4444" strokeWidth={1.5} dot={false} name="Blocked" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="dash-charts-row">
            <div className="dash-chart-container" style={{ marginBottom: 0 }}>
              <div className="dash-chart-header">
                <span className="dash-chart-title">Enforcement Outcomes</span>
              </div>
              <div className="dash-chart-body">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={enforcementOutcomes}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                    <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="allow" stackId="a" fill="#10b981" name="Allow" />
                    <Bar dataKey="block" stackId="a" fill="#ef4444" name="Block" />
                    <Bar dataKey="rewrite" stackId="a" fill="#f59e0b" name="Rewrite" />
                    <Bar dataKey="escalate" stackId="a" fill="#8b5cf6" name="Escalate" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="dash-chart-container" style={{ marginBottom: 0 }}>
              <div className="dash-chart-header">
                <span className="dash-chart-title">Top Violation Categories</span>
              </div>
              <div className="dash-chart-body" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={violationCategories}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={90}
                      dataKey="value"
                      nameKey="name"
                      paddingAngle={2}
                    >
                      {violationCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ fontSize: "0.75rem" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="dash-sidebar-health">
            <h4>System Health</h4>
            <div className="dash-health-row">
              <span className="dash-health-label">Uptime</span>
              <span className="dash-health-value good">{systemHealth.uptime}</span>
            </div>
            <div className="dash-health-row">
              <span className="dash-health-label">P95 Latency</span>
              <span className="dash-health-value">{systemHealth.p95Latency}</span>
            </div>
            <div className="dash-health-row">
              <span className="dash-health-label">Error Rate</span>
              <span className="dash-health-value good">{systemHealth.errorRate}</span>
            </div>
          </div>

          <div className="dash-sidebar-health">
            <h4>Versions</h4>
            <div className="dash-health-row">
              <span className="dash-health-label">Trust Engine</span>
              <span className="dash-health-value">{systemHealth.trustEngineVersion}</span>
            </div>
            <div className="dash-health-row">
              <span className="dash-health-label">Policy</span>
              <span className="dash-health-value">{systemHealth.policyVersion}</span>
            </div>
          </div>

          <div className="dash-sidebar-health">
            <h4>Quick Actions</h4>
            <div className="dash-quick-actions">
              <Link href="/dashboard/prompt-generator" className="dash-quick-action-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                Generate Prompt
              </Link>
              <Link href="/dashboard/sdk" className="dash-quick-action-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download SDK
              </Link>
              <Link href="/dashboard/audit-trails" className="dash-quick-action-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                View Audit Trails
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="dash-card" style={{ marginTop: "1.25rem" }}>
        <div className="dash-card-header">
          <div>
            <div className="dash-card-title">Recent Activity</div>
            <div className="dash-card-subtitle">Last 20 requests processed by the trust engine</div>
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="dash-table dash-table-clickable">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Timestamp</th>
                <th>Endpoint</th>
                <th>Policy</th>
                <th>Status</th>
                <th>Risk Score</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map((record) => (
                <tr key={record.requestId} onClick={() => setSelectedRecord(record)}>
                  <td style={{ fontFamily: "'SF Mono', 'Fira Code', monospace", fontSize: "0.8rem" }}>{record.requestId}</td>
                  <td>{formatTimestamp(record.timestamp)}</td>
                  <td style={{ fontSize: "0.82rem" }}>{record.endpoint}</td>
                  <td>{record.policy}</td>
                  <td><span className={getStatusBadgeClass(record.status)}>{record.status}</span></td>
                  <td>
                    <div className="dash-risk-bar">
                      <div className="dash-risk-bar-track">
                        <div className={`dash-risk-bar-fill ${getRiskLevel(record.riskScore)}`} style={{ width: `${record.riskScore}%` }} />
                      </div>
                      <span className="dash-risk-score">{record.riskScore}</span>
                    </div>
                  </td>
                  <td>
                    <button className="dash-btn dash-btn-ghost dash-btn-sm" onClick={(e) => { e.stopPropagation(); setSelectedRecord(record); }}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedRecord && (
        <div className="dash-modal-overlay" onClick={() => setSelectedRecord(null)}>
          <div className="dash-modal dash-modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="dash-modal-header">
              <span className="dash-modal-title">Request Details — {selectedRecord.requestId}</span>
              <button className="dash-modal-close" onClick={() => setSelectedRecord(null)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="dash-modal-body">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
                <div>
                  <div className="dash-detail-row">
                    <span className="dash-detail-key">Status</span>
                    <span className={getStatusBadgeClass(selectedRecord.status)}>{selectedRecord.status}</span>
                  </div>
                  <div className="dash-detail-row">
                    <span className="dash-detail-key">Risk Score</span>
                    <span className="dash-detail-value">{selectedRecord.riskScore}/100</span>
                  </div>
                  <div className="dash-detail-row">
                    <span className="dash-detail-key">Policy</span>
                    <span className="dash-detail-value">{selectedRecord.policy}</span>
                  </div>
                  <div className="dash-detail-row">
                    <span className="dash-detail-key">Enforcement</span>
                    <span className="dash-detail-value">{selectedRecord.enforcementAction}</span>
                  </div>
                </div>
                <div>
                  <div className="dash-detail-row">
                    <span className="dash-detail-key">Model</span>
                    <span className="dash-detail-value">{selectedRecord.model}</span>
                  </div>
                  <div className="dash-detail-row">
                    <span className="dash-detail-key">Provider</span>
                    <span className="dash-detail-value">{selectedRecord.provider}</span>
                  </div>
                  <div className="dash-detail-row">
                    <span className="dash-detail-key">Latency</span>
                    <span className="dash-detail-value">{selectedRecord.latencyMs}ms</span>
                  </div>
                  <div className="dash-detail-row">
                    <span className="dash-detail-key">Report ID</span>
                    <span className="dash-detail-value" style={{ fontFamily: "'SF Mono', monospace", fontSize: "0.8rem" }}>{selectedRecord.reportId}</span>
                  </div>
                </div>
              </div>

              {selectedRecord.violations.length > 0 && (
                <div style={{ marginBottom: "1.25rem" }}>
                  <h4 style={{ fontSize: "0.88rem", fontWeight: 650, marginBottom: "0.65rem" }}>Violations</h4>
                  {selectedRecord.violations.map((v, i) => (
                    <div key={i} style={{ background: "var(--d-error-bg)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 8, padding: "0.75rem 1rem", marginBottom: "0.5rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                        <span style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--d-text)" }}>{v.category}</span>
                        <span className={`dash-badge ${v.severity === "critical" || v.severity === "high" ? "dash-badge-error" : v.severity === "medium" ? "dash-badge-warning" : "dash-badge-accent"}`}>{v.severity}</span>
                      </div>
                      <p style={{ fontSize: "0.82rem", color: "var(--d-text-secondary)", margin: 0 }}>{v.description}</p>
                      <span style={{ fontSize: "0.75rem", color: "var(--d-text-muted)" }}>Confidence: {(v.confidence * 100).toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ marginBottom: "1.25rem" }}>
                <h4 style={{ fontSize: "0.88rem", fontWeight: 650, marginBottom: "0.65rem" }}>Request Payload (Redacted)</h4>
                <div style={{ background: "var(--d-bg)", border: "1px solid var(--d-border)", borderRadius: 8, padding: "0.85rem 1rem", fontSize: "0.82rem", color: "var(--d-text-secondary)", fontFamily: "'SF Mono', monospace" }}>
                  {selectedRecord.inputPayload}
                </div>
              </div>

              {selectedRecord.outputPayload && (
                <div>
                  <h4 style={{ fontSize: "0.88rem", fontWeight: 650, marginBottom: "0.65rem" }}>Response Payload</h4>
                  <div style={{ background: "var(--d-bg)", border: "1px solid var(--d-border)", borderRadius: 8, padding: "0.85rem 1rem", fontSize: "0.82rem", color: "var(--d-text-secondary)", fontFamily: "'SF Mono', monospace" }}>
                    {selectedRecord.outputPayload}
                  </div>
                </div>
              )}
            </div>
            <div className="dash-modal-footer">
              <button className="dash-btn dash-btn-ghost" onClick={() => setSelectedRecord(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
