"use client";

import { useState } from "react";
import Link from "next/link";
import { settingsDeveloper } from "../../mock/settings";
import type { WebhookEndpoint } from "../../mock/types";

interface DeveloperTabProps {
  searchQuery: string;
  showToast: (msg: string) => void;
}

export default function DeveloperTab({ searchQuery, showToast }: DeveloperTabProps) {
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>(settingsDeveloper.webhooks);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newEvents, setNewEvents] = useState<string[]>([]);

  const allEvents = ["request.blocked", "request.escalated", "policy.updated"];

  const toggleEvent = (evt: string) => {
    setNewEvents((prev) =>
      prev.includes(evt) ? prev.filter((e) => e !== evt) : [...prev, evt]
    );
  };

  const handleCreateWebhook = () => {
    if (!newUrl.trim()) return;
    const wh: WebhookEndpoint = {
      id: "wh_" + Math.random().toString(36).slice(2, 8),
      url: newUrl.trim(),
      events: newEvents,
      secretToken: "whsec_****" + Math.random().toString(36).slice(2, 6),
      active: true,
    };
    setWebhooks((prev) => [...prev, wh]);
    setShowAddModal(false);
    setNewUrl("");
    setNewEvents([]);
    showToast("Webhook created");
  };

  const toggleWebhookActive = (id: string) => {
    setWebhooks((prev) =>
      prev.map((w) => (w.id === id ? { ...w, active: !w.active } : w))
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    showToast("Copied to clipboard");
  };

  const isVisible = (terms: string) => {
    if (!searchQuery) return true;
    return terms.toLowerCase().includes(searchQuery.toLowerCase());
  };

  return (
    <div>
      <div
        className={`dash-card ${isVisible("sdk install quickstart agent guard documentation") ? "" : "dash-hidden"}`}
        data-search-terms="sdk install quickstart agent guard documentation"
      >
        <div className="dash-card-header">
          <div>
            <div className="dash-card-title">SDK Quick Links</div>
            <div className="dash-card-subtitle">Jump to SDK documentation and guides</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link href="/dashboard/sdk" className="dash-btn dash-btn-ghost">
            Installation Guide
          </Link>
          <Link href="/dashboard/sdk" className="dash-btn dash-btn-ghost">
            Quickstart
          </Link>
          <Link href="/dashboard/sdk" className="dash-btn dash-btn-ghost">
            Agent Guard
          </Link>
        </div>
      </div>

      <div
        className={`dash-card ${isVisible("webhooks events endpoint secret token") ? "" : "dash-hidden"}`}
        data-search-terms="webhooks events endpoint secret token"
      >
        <div className="dash-card-header">
          <div>
            <div className="dash-card-title">Webhooks</div>
            <div className="dash-card-subtitle">Receive real-time notifications for events</div>
          </div>
          <button
            className="dash-btn dash-btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            Add webhook
          </button>
        </div>
        <table className="dash-table">
          <thead>
            <tr>
              <th>URL</th>
              <th>Events</th>
              <th>Secret</th>
              <th>Active</th>
            </tr>
          </thead>
          <tbody>
            {webhooks.map((wh) => (
              <tr key={wh.id}>
                <td style={{ fontFamily: "'SF Mono', 'Fira Code', monospace", fontSize: "0.82rem" }}>
                  {wh.url}
                </td>
                <td>
                  <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                    {wh.events.map((evt) => (
                      <span key={evt} className="dash-badge dash-badge-accent">
                        {evt}
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <span style={{ fontFamily: "'SF Mono', 'Fira Code', monospace", fontSize: "0.82rem", marginRight: "0.5rem" }}>
                    {wh.secretToken}
                  </span>
                  <button
                    className="dash-btn dash-btn-ghost dash-btn-sm"
                    onClick={() => copyToClipboard(wh.secretToken)}
                  >
                    Copy
                  </button>
                </td>
                <td>
                  <label className="dash-toggle">
                    <input
                      type="checkbox"
                      checked={wh.active}
                      onChange={() => toggleWebhookActive(wh.id)}
                    />
                    <span className="dash-toggle-track" />
                    <span>{wh.active ? "On" : "Off"}</span>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        className={`dash-card ${isVisible("environment variables env api key base url policy") ? "" : "dash-hidden"}`}
        data-search-terms="environment variables env api key base url policy"
      >
        <div className="dash-card-header">
          <div>
            <div className="dash-card-title">Environment Variables</div>
            <div className="dash-card-subtitle">Recommended environment variables for your integration</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {settingsDeveloper.envVars.map((ev) => (
            <div
              key={ev.name}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.85rem 1rem",
                background: "var(--d-bg)",
                borderRadius: "var(--d-radius)",
                border: "1px solid var(--d-border)",
              }}
            >
              <div>
                <div style={{ fontFamily: "'SF Mono', 'Fira Code', monospace", fontSize: "0.85rem", fontWeight: 600, color: "var(--d-text)" }}>
                  {ev.name}
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--d-text-secondary)", marginTop: "0.2rem" }}>
                  {ev.description}
                </div>
              </div>
              <button
                className="dash-btn dash-btn-ghost dash-btn-sm"
                onClick={() => copyToClipboard(`export ${ev.name}=${ev.example}`)}
              >
                Copy
              </button>
            </div>
          ))}
        </div>
      </div>

      {showAddModal && (
        <div className="dash-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="dash-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dash-modal-header">
              <h3 className="dash-modal-title">Add Webhook</h3>
              <button className="dash-modal-close" onClick={() => setShowAddModal(false)}>
                ✕
              </button>
            </div>
            <div className="dash-modal-body">
              <div className="dash-form-group">
                <label className="dash-label">URL</label>
                <input
                  className="dash-input"
                  placeholder="https://your-api.com/webhooks"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                />
              </div>
              <div className="dash-form-group">
                <label className="dash-label">Events</label>
                <div className="dash-scope-checks">
                  {allEvents.map((evt) => (
                    <label key={evt} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", marginRight: "1rem", fontSize: "0.875rem", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={newEvents.includes(evt)}
                        onChange={() => toggleEvent(evt)}
                      />
                      {evt}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="dash-modal-footer">
              <button className="dash-btn dash-btn-ghost" onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button className="dash-btn dash-btn-primary" onClick={handleCreateWebhook}>
                Create webhook
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
