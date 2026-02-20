"use client";

import { FormEvent, useEffect, useState } from "react";

type ApiKey = {
  id: string;
  name?: string | null;
  is_active: boolean;
  created_at: string;
  last_used_at?: string | null;
  key_prefix?: string;
};

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [keyName, setKeyName] = useState("");
  const [newApiKey, setNewApiKey] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    loadKeys();
  }, []);

  async function loadKeys() {
    try {
      const res = await fetch("/api/api-keys");
      if (res.ok) setApiKeys(await res.json());
    } catch {
      setError("Failed to load API keys");
    }
  }

  async function createKey(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    try {
      const result = await fetch("/api/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: keyName || null }),
      });
      const payload = await result.json();
      if (!result.ok) throw new Error(payload.error || "Failed to create API key");
      setNewApiKey(payload.api_key);
      setKeyName("");
      await loadKeys();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create key");
    }
  }

  async function saveEdit(keyId: string) {
    try {
      const result = await fetch(`/api/api-keys/${keyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName }),
      });
      if (!result.ok) throw new Error("Failed to update key");
      setEditingId(null);
      setEditName("");
      await loadKeys();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update key");
    }
  }

  async function deleteKey(keyId: string) {
    if (!confirm("Are you sure you want to revoke this API key? This cannot be undone.")) return;
    try {
      const result = await fetch(`/api/api-keys/${keyId}`, { method: "DELETE" });
      if (!result.ok) throw new Error("Failed to revoke key");
      await loadKeys();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to revoke key");
    }
  }

  return (
    <div>
      <h1 className="dash-page-title">API Keys</h1>
      <p className="dash-page-desc">Generate and manage API keys for programmatic access to AegisAI.</p>

      {error && <div className="dash-error">{error}</div>}

      <div className="dash-card">
        <div className="dash-card-header">
          <div>
            <div className="dash-card-title">Create New Key</div>
          </div>
        </div>
        <form onSubmit={createKey} className="dash-inline-form">
          <div className="dash-form-group">
            <label className="dash-label">Key Name (optional)</label>
            <input
              className="dash-input"
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              placeholder="e.g., Production SDK"
            />
          </div>
          <button className="dash-btn dash-btn-primary" type="submit">
            Generate Key
          </button>
        </form>
      </div>

      {newApiKey && (
        <div className="dash-notice">
          <strong>Key Created Successfully</strong>
          <p>Copy this key now. It will not be shown again.</p>
          <code>{newApiKey}</code>
          <button className="dash-btn dash-btn-ghost dash-btn-sm" onClick={() => setNewApiKey("")} style={{ marginTop: "0.5rem", alignSelf: "flex-start" }}>
            Dismiss
          </button>
        </div>
      )}

      <div className="dash-card">
        <div className="dash-card-header">
          <div>
            <div className="dash-card-title">Your API Keys</div>
            <div className="dash-card-subtitle">{apiKeys.length} key{apiKeys.length !== 1 ? "s" : ""} total</div>
          </div>
        </div>

        {apiKeys.length === 0 ? (
          <div className="dash-empty">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
            </svg>
            <p>No API keys yet. Create your first key above.</p>
          </div>
        ) : (
          <table className="dash-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Prefix</th>
                <th>Created</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.map((key) => (
                <tr key={key.id}>
                  <td>
                    {editingId === key.id ? (
                      <input
                        className="dash-input"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        style={{ maxWidth: 200, padding: "0.35rem 0.6rem", fontSize: "0.85rem" }}
                        autoFocus
                      />
                    ) : (
                      <span style={{ fontWeight: 500 }}>{key.name || "Unnamed"}</span>
                    )}
                  </td>
                  <td>
                    <code style={{ fontSize: "0.8rem", color: "var(--d-text-muted)" }}>
                      {key.key_prefix || "aegis_***"}
                    </code>
                  </td>
                  <td>{new Date(key.created_at).toLocaleDateString()}</td>
                  <td>
                    <span className={`dash-badge ${key.is_active ? "dash-badge-success" : "dash-badge-error"}`}>
                      {key.is_active ? "Active" : "Revoked"}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "0.4rem", justifyContent: "flex-end" }}>
                      {editingId === key.id ? (
                        <>
                          <button className="dash-btn dash-btn-primary dash-btn-sm" onClick={() => saveEdit(key.id)}>Save</button>
                          <button className="dash-btn dash-btn-ghost dash-btn-sm" onClick={() => { setEditingId(null); setEditName(""); }}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button className="dash-btn dash-btn-ghost dash-btn-sm" onClick={() => { setEditingId(key.id); setEditName(key.name || ""); }}>Rename</button>
                          {key.is_active && (
                            <button className="dash-btn dash-btn-danger dash-btn-sm" onClick={() => deleteKey(key.id)}>Revoke</button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
