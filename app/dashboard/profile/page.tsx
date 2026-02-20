"use client";

import { useEffect, useState } from "react";

type User = {
  id: string;
  email: string;
  role: string;
  is_active: boolean;
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) setUser(await res.json());
      } catch {}
    }
    loadUser();
  }, []);

  if (!user) return null;

  return (
    <div>
      <h1 className="dash-page-title">Settings</h1>
      <p className="dash-page-desc">Manage your account information and preferences.</p>

      <div className="dash-card">
        <div className="dash-card-header">
          <div>
            <div className="dash-card-title">Account Information</div>
          </div>
        </div>

        <div className="dash-profile-field">
          <span className="dash-profile-label">Email</span>
          <span className="dash-profile-value">{user.email}</span>
        </div>
        <div className="dash-profile-field">
          <span className="dash-profile-label">Role</span>
          <span className="dash-badge dash-badge-accent" style={{ textTransform: "capitalize" }}>{user.role}</span>
        </div>
        <div className="dash-profile-field">
          <span className="dash-profile-label">Status</span>
          <span className={`dash-badge ${user.is_active ? "dash-badge-success" : "dash-badge-error"}`}>
            {user.is_active ? "Active" : "Inactive"}
          </span>
        </div>
        <div className="dash-profile-field">
          <span className="dash-profile-label">User ID</span>
          <span className="dash-profile-value" style={{ fontFamily: "'SF Mono', monospace", fontSize: "0.82rem", color: "var(--d-text-muted)" }}>{user.id}</span>
        </div>
      </div>

      <div className="dash-card">
        <div className="dash-card-header">
          <div>
            <div className="dash-card-title">Security</div>
            <div className="dash-card-subtitle">Manage your password and security settings</div>
          </div>
        </div>
        <div className="dash-empty" style={{ padding: "2rem" }}>
          <p>Password management coming soon.</p>
        </div>
      </div>
    </div>
  );
}
