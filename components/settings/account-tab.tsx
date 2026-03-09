"use client";

import { useEffect, useState } from "react";

interface AccountTabProps {
  searchQuery: string;
  showToast: (msg: string) => void;
}

type User = { id: string; email: string; role: string; is_active: boolean };

export default function AccountTab({ searchQuery, showToast }: AccountTabProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((u) => setUser(u))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const hidden = (terms: string) =>
    searchQuery && !terms.toLowerCase().includes(searchQuery.toLowerCase()) ? " dash-hidden" : "";

  if (loading) return <div className="dash-empty"><p>Loading profile...</p></div>;
  if (!user) return <div className="dash-error">Failed to load profile.</div>;

  return (
    <div>
      <div className={"dash-card" + hidden("profile email role account")} data-search-terms="profile email role account">
        <div className="dash-card-header">
          <div>
            <div className="dash-card-title">Profile</div>
            <div className="dash-card-subtitle">Your account details from AegisAI Auth</div>
          </div>
        </div>
        <div className="dash-detail-row">
          <span className="dash-detail-key">Email</span>
          <span className="dash-detail-value">{user.email}</span>
        </div>
        <div className="dash-detail-row">
          <span className="dash-detail-key">Role</span>
          <span className="dash-badge dash-badge-accent">{user.role}</span>
        </div>
        <div className="dash-detail-row">
          <span className="dash-detail-key">Status</span>
          <span className={`dash-badge ${user.is_active ? "dash-badge-success" : "dash-badge-error"}`}>
            {user.is_active ? "Active" : "Inactive"}
          </span>
        </div>
        <div className="dash-detail-row">
          <span className="dash-detail-key">User ID</span>
          <span className="dash-detail-value" style={{ fontFamily: "monospace", fontSize: "0.8rem" }}>{user.id}</span>
        </div>
        <p style={{ fontSize: "0.82rem", color: "var(--d-text-muted)", marginTop: "1rem" }}>
          Profile editing is managed through your organisation administrator.
        </p>
      </div>

      <div className={"dash-card" + hidden("preferences coming soon")} data-search-terms="preferences coming soon">
        <div className="dash-card-header">
          <div>
            <div className="dash-card-title">Preferences</div>
          </div>
          <span className="dash-badge dash-badge-warning">Coming Soon</span>
        </div>
        <p style={{ fontSize: "0.85rem", color: "var(--d-text-secondary)", lineHeight: 1.6 }}>
          Timezone, theme, and dashboard range preferences will be configurable in a future release.
        </p>
      </div>
    </div>
  );
}
