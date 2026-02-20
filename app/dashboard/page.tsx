"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type ApiKey = {
  id: string;
  name?: string | null;
  is_active: boolean;
  created_at: string;
};

export default function DashboardPage() {
  const [keyCount, setKeyCount] = useState(0);
  const [activeKeys, setActiveKeys] = useState(0);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/api-keys");
        if (res.ok) {
          const keys: ApiKey[] = await res.json();
          setKeyCount(keys.length);
          setActiveKeys(keys.filter((k) => k.is_active).length);
        }
      } catch {}
    }
    loadStats();
  }, []);

  return (
    <div>
      <h1 className="dash-page-title">Overview</h1>
      <p className="dash-page-desc">Welcome back. Here is a snapshot of your account.</p>

      <div className="dash-stats">
        <div className="dash-stat-card">
          <span className="dash-stat-label">Total API Keys</span>
          <span className="dash-stat-value accent">{keyCount}</span>
        </div>
        <div className="dash-stat-card">
          <span className="dash-stat-label">Active Keys</span>
          <span className="dash-stat-value success">{activeKeys}</span>
        </div>
        <div className="dash-stat-card">
          <span className="dash-stat-label">Revoked Keys</span>
          <span className="dash-stat-value">{keyCount - activeKeys}</span>
        </div>
        <div className="dash-stat-card">
          <span className="dash-stat-label">Trust Evaluations</span>
          <span className="dash-stat-value accent">0</span>
        </div>
      </div>

      <div className="dash-grid-2">
        <div className="dash-card">
          <div className="dash-card-header">
            <div>
              <div className="dash-card-title">Quick Actions</div>
              <div className="dash-card-subtitle">Common tasks you can do right now</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <Link href="/dashboard/evaluate" className="dash-btn dash-btn-primary" style={{ textDecoration: "none" }}>
              Run Trust Evaluation
            </Link>
            <Link href="/dashboard/api-keys" className="dash-btn dash-btn-ghost" style={{ textDecoration: "none" }}>
              Manage API Keys
            </Link>
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-card-header">
            <div>
              <div className="dash-card-title">Getting Started</div>
              <div className="dash-card-subtitle">Set up your AI governance workflow</div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem", fontSize: "0.875rem", color: "var(--d-text-secondary)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ width: 22, height: 22, borderRadius: 6, background: activeKeys > 0 ? "var(--d-success-bg)" : "var(--d-bg)", border: "1px solid var(--d-border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", color: activeKeys > 0 ? "var(--d-success)" : "var(--d-text-muted)" }}>
                {activeKeys > 0 ? "\u2713" : "1"}
              </span>
              Generate an API key
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ width: 22, height: 22, borderRadius: 6, background: "var(--d-bg)", border: "1px solid var(--d-border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", color: "var(--d-text-muted)" }}>2</span>
              Integrate the SDK into your app
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ width: 22, height: 22, borderRadius: 6, background: "var(--d-bg)", border: "1px solid var(--d-border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", color: "var(--d-text-muted)" }}>3</span>
              Run your first trust evaluation
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
