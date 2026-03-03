"use client";

import { useState } from "react";
import { settingsAccount, settingsPreferences } from "../../mock/settings";

interface AccountTabProps {
  searchQuery: string;
  showToast: (msg: string) => void;
}

export default function AccountTab({ searchQuery, showToast }: AccountTabProps) {
  const [name, setName] = useState(settingsAccount.name);
  const [workspace, setWorkspace] = useState(settingsAccount.workspace);
  const [timezone, setTimezone] = useState(settingsPreferences.timezone);
  const [theme, setTheme] = useState<"Dark" | "Auto">(settingsPreferences.theme);
  const [dashboardRange, setDashboardRange] = useState<"7d" | "14d" | "30d">(settingsPreferences.dashboardRange);

  const hidden = (terms: string) =>
    searchQuery && !terms.toLowerCase().includes(searchQuery.toLowerCase()) ? " dash-hidden" : "";

  return (
    <div>
      <div className={"dash-card" + hidden("profile name email role workspace")} data-search-terms="profile name email role workspace">
        <div className="dash-card-header">
          <div>
            <div className="dash-card-title">Profile</div>
            <div className="dash-card-subtitle">Manage your account details</div>
          </div>
        </div>
        <div className="dash-form-group">
          <label className="dash-label">Name</label>
          <input
            className="dash-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="dash-form-group">
          <label className="dash-label">Email</label>
          <input
            className="dash-input"
            type="email"
            value={settingsAccount.email}
            disabled
          />
        </div>
        <div className="dash-form-group">
          <label className="dash-label">Role</label>
          <div>
            <span className="dash-badge dash-badge-accent">{settingsAccount.role}</span>
          </div>
        </div>
        <div className="dash-form-group">
          <label className="dash-label">Workspace</label>
          <select
            className="dash-input"
            value={workspace}
            onChange={(e) => setWorkspace(e.target.value)}
          >
            {settingsAccount.workspaces.map((ws) => (
              <option key={ws} value={ws}>{ws}</option>
            ))}
          </select>
        </div>
        <button
          className="dash-btn dash-btn-primary"
          onClick={() => showToast("Profile updated")}
        >
          Update profile
        </button>
      </div>

      <div className={"dash-card" + hidden("preferences timezone theme dashboard range")} data-search-terms="preferences timezone theme dashboard range">
        <div className="dash-card-header">
          <div>
            <div className="dash-card-title">Preferences</div>
            <div className="dash-card-subtitle">Customize your dashboard experience</div>
          </div>
        </div>
        <div className="dash-form-group">
          <label className="dash-label">Timezone</label>
          <select
            className="dash-input"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
          >
            <option value="America/New_York">America/New_York</option>
            <option value="America/Chicago">America/Chicago</option>
            <option value="America/Los_Angeles">America/Los_Angeles</option>
            <option value="Europe/London">Europe/London</option>
            <option value="Asia/Tokyo">Asia/Tokyo</option>
          </select>
        </div>
        <div className="dash-form-group">
          <label className="dash-label">Theme</label>
          <select
            className="dash-input"
            value={theme}
            onChange={(e) => setTheme(e.target.value as "Dark" | "Auto")}
          >
            <option value="Dark">Dark</option>
            <option value="Auto">Auto</option>
          </select>
        </div>
        <div className="dash-form-group">
          <label className="dash-label">Dashboard range</label>
          <select
            className="dash-input"
            value={dashboardRange}
            onChange={(e) => setDashboardRange(e.target.value as "7d" | "14d" | "30d")}
          >
            <option value="7d">7 days</option>
            <option value="14d">14 days</option>
            <option value="30d">30 days</option>
          </select>
        </div>
        <button
          className="dash-btn dash-btn-primary"
          onClick={() => showToast("Preferences saved")}
        >
          Save preferences
        </button>
      </div>
    </div>
  );
}
