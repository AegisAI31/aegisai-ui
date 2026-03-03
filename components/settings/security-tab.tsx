"use client";

import { useState } from "react";
import { settingsSecurity } from "../../mock/settings";

interface SecurityTabProps {
  searchQuery: string;
  showToast: (msg: string) => void;
}

export default function SecurityTab({ searchQuery, showToast }: SecurityTabProps) {
  const [mfaEnabled, setMfaEnabled] = useState(settingsSecurity.mfaEnabled);
  const [activeSessions, setActiveSessions] = useState(settingsSecurity.activeSessions);
  const [ipAllowlist, setIpAllowlist] = useState<string[]>([...settingsSecurity.ipAllowlist]);
  const [newIp, setNewIp] = useState("");
  const [auditRetention, setAuditRetention] = useState(settingsSecurity.auditRetention);
  const [reportRetention, setReportRetention] = useState(settingsSecurity.reportRetention);
  const [noStoreMode, setNoStoreMode] = useState(settingsSecurity.noStoreMode);
  const [showSessionModal, setShowSessionModal] = useState(false);

  const hidden = (terms: string) =>
    searchQuery && !terms.toLowerCase().includes(searchQuery.toLowerCase()) ? " dash-hidden" : "";

  const handleAddIp = () => {
    if (newIp.trim()) {
      setIpAllowlist([...ipAllowlist, newIp.trim()]);
      setNewIp("");
      showToast("IP range added");
    }
  };

  const handleRemoveIp = (index: number) => {
    setIpAllowlist(ipAllowlist.filter((_, i) => i !== index));
    showToast("IP range removed");
  };

  return (
    <div>
      <div className={"dash-card" + hidden("mfa multi-factor authentication two-factor")} data-search-terms="mfa multi-factor authentication two-factor">
        <div className="dash-card-header">
          <div>
            <div className="dash-card-title">Multi-Factor Authentication</div>
            <div className="dash-card-subtitle">Add an extra layer of security to your account</div>
          </div>
        </div>
        <div className="dash-mfa-status" style={{ marginBottom: "1rem" }}>
          <span className={`dash-mfa-dot ${mfaEnabled ? "enabled" : "disabled"}`} />
          <span style={{ fontSize: "0.9rem", fontWeight: 500 }}>MFA is {mfaEnabled ? "Enabled" : "Disabled"}</span>
        </div>
        <button
          className={`dash-btn ${mfaEnabled ? "dash-btn-danger" : "dash-btn-primary"}`}
          onClick={() => {
            setMfaEnabled(!mfaEnabled);
            showToast(mfaEnabled ? "MFA disabled" : "MFA enabled");
          }}
        >
          {mfaEnabled ? "Disable MFA" : "Enable MFA"}
        </button>
      </div>

      <div className={"dash-card" + hidden("sessions sign out active")} data-search-terms="sessions sign out active">
        <div className="dash-card-header">
          <div>
            <div className="dash-card-title">Session Management</div>
            <div className="dash-card-subtitle">Manage your active sessions across devices</div>
          </div>
        </div>
        <p style={{ fontSize: "0.9rem", color: "var(--d-text-secondary)", marginBottom: "1rem" }}>
          You have <strong>{activeSessions}</strong> active session{activeSessions !== 1 ? "s" : ""}
        </p>
        <button
          className="dash-btn dash-btn-danger"
          onClick={() => setShowSessionModal(true)}
        >
          Sign out of all sessions
        </button>
      </div>

      <div className={"dash-card" + hidden("ip allowlist whitelist range")} data-search-terms="ip allowlist whitelist range">
        <div className="dash-card-header">
          <div>
            <div className="dash-card-title">IP Allowlist</div>
            <div className="dash-card-subtitle">Restrict API access to specific IP ranges</div>
          </div>
        </div>
        <div className="dash-ip-list">
          {ipAllowlist.map((ip, i) => (
            <div key={i} className="dash-ip-item">
              <span style={{ fontFamily: "'SF Mono', 'Fira Code', monospace", fontSize: "0.85rem" }}>{ip}</span>
              <button onClick={() => handleRemoveIp(i)} title="Remove">✕</button>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
          <input
            className="dash-input"
            type="text"
            placeholder="e.g. 172.16.0.0/12"
            value={newIp}
            onChange={(e) => setNewIp(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddIp()}
            style={{ flex: 1 }}
          />
          <button className="dash-btn dash-btn-primary" onClick={handleAddIp}>
            Add
          </button>
        </div>
      </div>

      <div className={"dash-card" + hidden("data retention audit report no-store")} data-search-terms="data retention audit report no-store">
        <div className="dash-card-header">
          <div>
            <div className="dash-card-title">Data Retention</div>
            <div className="dash-card-subtitle">Configure how long data is stored</div>
          </div>
        </div>
        <div className="dash-form-group">
          <label className="dash-label">Audit log retention</label>
          <select
            className="dash-input"
            value={auditRetention}
            onChange={(e) => setAuditRetention(Number(e.target.value))}
          >
            <option value={30}>30 days</option>
            <option value={90}>90 days</option>
            <option value={180}>180 days</option>
            <option value={365}>365 days</option>
          </select>
        </div>
        <div className="dash-form-group">
          <label className="dash-label">Report retention</label>
          <select
            className="dash-input"
            value={reportRetention}
            onChange={(e) => setReportRetention(Number(e.target.value))}
          >
            <option value={30}>30 days</option>
            <option value={90}>90 days</option>
            <option value={180}>180 days</option>
            <option value={365}>365 days</option>
          </select>
        </div>
        <div className="dash-form-group">
          <label className="dash-toggle">
            <input
              type="checkbox"
              checked={noStoreMode}
              onChange={(e) => setNoStoreMode(e.target.checked)}
            />
            <span className="dash-toggle-track"></span>
            <span>No-store mode</span>
          </label>
          <p className="dash-settings-helper">
            When enabled, only hashes and metrics are stored. Raw request/response data is discarded.
          </p>
        </div>
        <button
          className="dash-btn dash-btn-primary"
          onClick={() => showToast("Retention settings saved")}
        >
          Save retention settings
        </button>
      </div>

      {showSessionModal && (
        <div className="dash-modal-overlay" onClick={() => setShowSessionModal(false)}>
          <div className="dash-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dash-modal-header">
              <h3 className="dash-modal-title">Sign Out All Sessions</h3>
              <button className="dash-modal-close" onClick={() => setShowSessionModal(false)}>✕</button>
            </div>
            <div className="dash-modal-body">
              <p style={{ fontSize: "0.9rem", color: "var(--d-text-secondary)" }}>
                This will sign you out of all devices. You will need to sign in again.
              </p>
            </div>
            <div className="dash-modal-footer">
              <button className="dash-btn dash-btn-ghost" onClick={() => setShowSessionModal(false)}>
                Cancel
              </button>
              <button
                className="dash-btn dash-btn-danger"
                onClick={() => {
                  setActiveSessions(1);
                  setShowSessionModal(false);
                  showToast("Signed out of all other sessions");
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
