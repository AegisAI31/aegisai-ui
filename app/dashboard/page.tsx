"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

type TimeRange = "7d" | "14d" | "30d";

type Summary = {
  total_evaluations: number;
  completed: number;
  failed: number;
  in_progress: number;
  total_audit_events: number;
  approval_rate: number;
  avg_latency_ms: number | null;
};

type TimePoint = { date: string; requests: number; approved: number; blocked: number };
type OutcomeRow = { type: string; completed: number; failed: number; generating: number };

export default function DashboardPage() {
  const [range, setRange] = useState<TimeRange>("7d");
  const [summary, setSummary] = useState<Summary | null>(null);
  const [timeseries, setTimeseries] = useState<TimePoint[]>([]);
  const [outcomes, setOutcomes] = useState<OutcomeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load(r: TimeRange) {
    setLoading(true);
    setError("");
    try {
      const [s, ts, oc] = await Promise.all([
        fetch(`/api/analytics?path=summary&range=${r}`).then((x) => x.json()),
        fetch(`/api/analytics?path=timeseries&range=${r}`).then((x) => x.json()),
        fetch(`/api/analytics?path=outcomes&range=${r}`).then((x) => x.json()),
      ]);
      if (s.error) throw new Error(s.error);
      setSummary(s);
      setTimeseries(Array.isArray(ts) ? ts : []);
      setOutcomes(Array.isArray(oc) ? oc : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(range); }, [range]);

  const latencyOk = summary?.avg_latency_ms == null || summary.avg_latency_ms <= 200;

  const kpis = summary
    ? [
        { label: "Total Evaluations", value: summary.total_evaluations.toLocaleString() },
        { label: "Completed", value: summary.completed.toLocaleString() },
        { label: "Failed", value: summary.failed.toLocaleString() },
        { label: "In Progress", value: summary.in_progress.toLocaleString() },
        { label: "Approval Rate", value: `${summary.approval_rate}%` },
        { label: "Audit Events", value: summary.total_audit_events.toLocaleString() },
        {
          label: "Avg Latency",
          value: summary.avg_latency_ms != null ? `${summary.avg_latency_ms} ms` : "—",
          color: summary.avg_latency_ms != null ? (latencyOk ? "#10b981" : "#ef4444") : undefined,
        },
      ]
    : [];

  return (
    <div>
      <div className="dash-page-header">
        <div className="dash-page-header-left">
          <h1 className="dash-page-title">AegisAI Control Plane</h1>
          <p className="dash-page-desc" style={{ marginBottom: 0 }}>Real-time AI governance monitoring</p>
        </div>
        <div className="dash-env-selector">
          <label>RANGE</label>
          <select value={range} onChange={(e) => setRange(e.target.value as TimeRange)}>
            <option value="7d">7 days</option>
            <option value="14d">14 days</option>
            <option value="30d">30 days</option>
          </select>
        </div>
      </div>

      {error && <div className="dash-error">{error}</div>}

      {loading ? (
        <div className="dash-kpi-grid">
          {[...Array(7)].map((_, i) => (
            <div className="dash-kpi-tile" key={i} style={{ opacity: 0.4 }}>
              <span className="dash-kpi-label">Loading...</span>
              <span className="dash-kpi-value">—</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="dash-kpi-grid">
          {kpis.map((k) => (
            <div className="dash-kpi-tile" key={k.label}>
              <span className="dash-kpi-label">{k.label}</span>
              <span className="dash-kpi-value" style={k.color ? { color: k.color } : undefined}>{k.value}</span>
            </div>
          ))}
        </div>
      )}

      <div className="dash-two-panel-wide-left">
        <div>
          <div className="dash-chart-container">
            <div className="dash-chart-header">
              <span className="dash-chart-title">Evaluations Over Time</span>
              <div className="dash-time-toggle">
                {(["7d", "14d", "30d"] as TimeRange[]).map((r) => (
                  <button key={r} className={range === r ? "active" : ""} onClick={() => setRange(r)}>{r}</button>
                ))}
              </div>
            </div>
            <div className="dash-chart-body">
              {timeseries.length === 0 ? (
                <div className="dash-empty" style={{ height: 260 }}>
                  <p>No evaluation data yet. Run your first trust evaluation to see trends.</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={timeseries}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                    <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="requests" stroke="#6366f1" strokeWidth={2} dot={false} name="Total" />
                    <Line type="monotone" dataKey="approved" stroke="#10b981" strokeWidth={1.5} dot={false} name="Completed" />
                    <Line type="monotone" dataKey="blocked" stroke="#ef4444" strokeWidth={1.5} dot={false} name="Failed" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="dash-chart-container" style={{ marginTop: "1.25rem" }}>
            <div className="dash-chart-header">
              <span className="dash-chart-title">Outcomes by Report Type</span>
            </div>
            <div className="dash-chart-body">
              {outcomes.length === 0 ? (
                <div className="dash-empty" style={{ height: 220 }}>
                  <p>No outcome data for this period.</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={outcomes}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="type" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                    <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completed" stackId="a" fill="#10b981" name="Completed" />
                    <Bar dataKey="failed" stackId="a" fill="#ef4444" name="Failed" />
                    <Bar dataKey="generating" stackId="a" fill="#f59e0b" name="In Progress" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="dash-sidebar-health">
            <h4>Quick Actions</h4>
            <div className="dash-quick-actions">
              <Link href="/dashboard/evaluate" className="dash-quick-action-btn">Run Evaluation</Link>
              <Link href="/dashboard/prompt-generator" className="dash-quick-action-btn">Generate Prompt</Link>
              <Link href="/dashboard/reports" className="dash-quick-action-btn">View Reports</Link>
              <Link href="/dashboard/audit-trails" className="dash-quick-action-btn">Audit Trails</Link>
              <Link href="/dashboard/sdk" className="dash-quick-action-btn">SDK Docs</Link>
            </div>
          </div>

          {summary && (
            <div className="dash-sidebar-health" style={{ marginTop: "1rem" }}>
              <h4>Period Summary ({range})</h4>
              <div className="dash-health-row">
                <span className="dash-health-label">Total</span>
                <span className="dash-health-value">{summary.total_evaluations}</span>
              </div>
              <div className="dash-health-row">
                <span className="dash-health-label">Completed</span>
                <span className="dash-health-value good">{summary.completed}</span>
              </div>
              <div className="dash-health-row">
                <span className="dash-health-label">Failed</span>
                <span className="dash-health-value" style={{ color: summary.failed > 0 ? "var(--d-error)" : undefined }}>{summary.failed}</span>
              </div>
              <div className="dash-health-row">
                <span className="dash-health-label">Approval Rate</span>
                <span className="dash-health-value good">{summary.approval_rate}%</span>
              </div>
              <div className="dash-health-row">
                <span className="dash-health-label">Avg Latency</span>
                <span className="dash-health-value" style={{ color: latencyOk ? "#10b981" : "var(--d-error)" }}>
                  {summary.avg_latency_ms != null ? `${summary.avg_latency_ms} ms` : "—"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
