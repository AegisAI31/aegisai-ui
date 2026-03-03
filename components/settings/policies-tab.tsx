"use client";

import { useState } from "react";
import { policies } from "../../mock/policies";
import { settingsPolicyExtras } from "../../mock/settings";
import type { Policy } from "../../mock/types";

interface PoliciesTabProps {
  searchQuery: string;
  showToast: (msg: string) => void;
}

interface LocalPolicy extends Policy {
  strictness: number;
  region: string;
}

function mergeWithExtras(p: Policy): LocalPolicy {
  const extra = settingsPolicyExtras.find((e) => e.policyId === p.id);
  return {
    ...p,
    strictness: extra?.strictness ?? 3,
    region: extra?.region ?? "Global",
  };
}

export default function PoliciesTab({ searchQuery, showToast }: PoliciesTabProps) {
  const [policiesList, setPoliciesList] = useState<LocalPolicy[]>(
    policies.map(mergeWithExtras)
  );
  const [showEditModal, setShowEditModal] = useState(false);
  const [showVersionsModal, setShowVersionsModal] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<LocalPolicy | null>(null);

  const [editName, setEditName] = useState("");
  const [editStrictness, setEditStrictness] = useState(3);
  const [editRegion, setEditRegion] = useState("Global");
  const [editRewrite, setEditRewrite] = useState(false);
  const [editDisclaimers, setEditDisclaimers] = useState(false);
  const [editEscalate, setEditEscalate] = useState(true);
  const [editRiskThreshold, setEditRiskThreshold] = useState(75);
  const [editHallucinationThreshold, setEditHallucinationThreshold] = useState(60);

  const q = searchQuery.toLowerCase();

  function isCardVisible(terms: string) {
    if (!q) return true;
    return terms.toLowerCase().includes(q);
  }

  function openEdit(p: LocalPolicy) {
    setSelectedPolicy(p);
    setEditName(p.name);
    setEditStrictness(p.strictness);
    setEditRegion(p.region);
    setEditRewrite(false);
    setEditDisclaimers(false);
    setEditEscalate(true);
    setEditRiskThreshold(75);
    setEditHallucinationThreshold(60);
    setShowEditModal(true);
  }

  function saveEdit() {
    if (!selectedPolicy) return;
    setPoliciesList((prev) =>
      prev.map((p) =>
        p.id === selectedPolicy.id
          ? { ...p, name: editName, strictness: editStrictness, region: editRegion }
          : p
      )
    );
    setShowEditModal(false);
    showToast("Policy updated");
  }

  function openVersions(p: LocalPolicy) {
    setSelectedPolicy(p);
    setShowVersionsModal(true);
  }

  function setActive(id: string) {
    setPoliciesList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "active" as const } : p))
    );
    showToast("Policy set to active");
  }

  function duplicatePolicy(p: LocalPolicy) {
    const dup: LocalPolicy = {
      ...p,
      id: `pol_dup_${Date.now()}`,
      name: `${p.name} (Copy)`,
      status: "draft",
    };
    setPoliciesList((prev) => [...prev, dup]);
    showToast("Policy duplicated");
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  const statusBadge = (status: string) => {
    const cls =
      status === "active"
        ? "dash-badge dash-badge-success"
        : status === "draft"
        ? "dash-badge dash-badge-warning"
        : "dash-badge dash-badge-error";
    return <span className={cls}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>;
  };

  const selectedExtras = selectedPolicy
    ? settingsPolicyExtras.find((e) => e.policyId === selectedPolicy.id)
    : null;

  return (
    <>
      <div
        className={`dash-card ${!isCardVisible("policies policy name version strictness region status") ? "dash-hidden" : ""}`}
        data-search-terms="policies policy name version strictness region status"
      >
        <div className="dash-card-header">
          <div>
            <div className="dash-card-title">Policy Configuration</div>
            <div className="dash-card-subtitle">Manage and configure trust & safety policies</div>
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="dash-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Version</th>
                <th>Strictness</th>
                <th>Region</th>
                <th>Updated</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {policiesList.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td style={{ fontFamily: "'SF Mono', monospace", fontSize: "0.82rem" }}>
                    {p.version}
                  </td>
                  <td>
                    <span style={{ display: "inline-flex", gap: "2px" }}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <span
                          key={n}
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background:
                              n <= p.strictness
                                ? "var(--d-accent)"
                                : "var(--d-border)",
                            display: "inline-block",
                          }}
                        />
                      ))}
                    </span>
                    <span style={{ marginLeft: 6, fontSize: "0.75rem", color: "var(--d-text-muted)" }}>
                      {p.strictness}/5
                    </span>
                  </td>
                  <td>{p.region}</td>
                  <td>{formatDate(p.updatedAt)}</td>
                  <td>{statusBadge(p.status)}</td>
                  <td>
                    <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                      {p.status !== "active" && (
                        <button
                          className="dash-btn dash-btn-ghost dash-btn-sm"
                          onClick={() => setActive(p.id)}
                        >
                          Set Active
                        </button>
                      )}
                      <button
                        className="dash-btn dash-btn-ghost dash-btn-sm"
                        onClick={() => duplicatePolicy(p)}
                      >
                        Duplicate
                      </button>
                      <button
                        className="dash-btn dash-btn-ghost dash-btn-sm"
                        onClick={() => openEdit(p)}
                      >
                        Edit
                      </button>
                      {settingsPolicyExtras.find((e) => e.policyId === p.id) && (
                        <button
                          className="dash-btn dash-btn-ghost dash-btn-sm"
                          onClick={() => openVersions(p)}
                        >
                          Versions
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showEditModal && selectedPolicy && (
        <div className="dash-modal-overlay" onClick={() => setShowEditModal(false)}>
          <div
            className="dash-modal dash-modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dash-modal-header">
              <div className="dash-modal-title">Edit Policy — {selectedPolicy.name}</div>
              <button className="dash-modal-close" onClick={() => setShowEditModal(false)}>
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="dash-modal-body">
              <div className="dash-form-group">
                <label className="dash-label">Name</label>
                <input
                  className="dash-input"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>

              <div className="dash-form-group">
                <label className="dash-label">Strictness</label>
                <div className="dash-slider">
                  <div className="dash-slider-value">{editStrictness} / 5</div>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    step={1}
                    value={editStrictness}
                    onChange={(e) => setEditStrictness(Number(e.target.value))}
                  />
                  <div className="dash-slider-labels">
                    <span>Lenient</span>
                    <span>Strict</span>
                  </div>
                </div>
              </div>

              <div className="dash-form-group">
                <label className="dash-label">Region</label>
                <select
                  className="dash-input"
                  value={editRegion}
                  onChange={(e) => setEditRegion(e.target.value)}
                >
                  <option value="US">US</option>
                  <option value="EU">EU</option>
                  <option value="CA">CA</option>
                  <option value="Global">Global</option>
                </select>
              </div>

              <div className="dash-form-group">
                <label className="dash-label" style={{ marginBottom: "0.75rem" }}>Enforcement</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <label className="dash-toggle">
                    <input
                      type="checkbox"
                      checked={editRewrite}
                      onChange={(e) => setEditRewrite(e.target.checked)}
                    />
                    <span className="dash-toggle-track" />
                    <span className="dash-toggle-label">Rewrite on violation</span>
                  </label>
                  <label className="dash-toggle">
                    <input
                      type="checkbox"
                      checked={editDisclaimers}
                      onChange={(e) => setEditDisclaimers(e.target.checked)}
                    />
                    <span className="dash-toggle-track" />
                    <span className="dash-toggle-label">Add disclaimers</span>
                  </label>
                  <label className="dash-toggle">
                    <input
                      type="checkbox"
                      checked={editEscalate}
                      onChange={(e) => setEditEscalate(e.target.checked)}
                    />
                    <span className="dash-toggle-track" />
                    <span className="dash-toggle-label">Escalate to human</span>
                  </label>
                </div>
              </div>

              <div className="dash-form-row" style={{ marginTop: "1rem" }}>
                <div className="dash-form-group">
                  <label className="dash-label">Risk block threshold (0–100)</label>
                  <input
                    className="dash-input"
                    type="number"
                    min={0}
                    max={100}
                    value={editRiskThreshold}
                    onChange={(e) => setEditRiskThreshold(Number(e.target.value))}
                  />
                </div>
                <div className="dash-form-group">
                  <label className="dash-label">Hallucination escalate threshold (0–100)</label>
                  <input
                    className="dash-input"
                    type="number"
                    min={0}
                    max={100}
                    value={editHallucinationThreshold}
                    onChange={(e) => setEditHallucinationThreshold(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
            <div className="dash-modal-footer">
              <button className="dash-btn dash-btn-ghost" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button className="dash-btn dash-btn-primary" onClick={saveEdit}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showVersionsModal && selectedPolicy && selectedExtras && (
        <div className="dash-modal-overlay" onClick={() => setShowVersionsModal(false)}>
          <div
            className="dash-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dash-modal-header">
              <div className="dash-modal-title">{selectedPolicy.name} — Version History</div>
              <button className="dash-modal-close" onClick={() => setShowVersionsModal(false)}>
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="dash-modal-body">
              <div className="dash-version-timeline">
                {selectedExtras.versions.map((v, i) => (
                  <div className="dash-version-item" key={i}>
                    <h4>v{v.version}</h4>
                    <div className="dash-version-date">{v.date}</div>
                    <ul>
                      {v.notes.map((n, ni) => (
                        <li key={ni}>{n}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <div className="dash-modal-footer">
              <button className="dash-btn dash-btn-ghost" onClick={() => setShowVersionsModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}