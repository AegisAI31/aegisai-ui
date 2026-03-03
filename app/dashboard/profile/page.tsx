"use client";

import { useState, useCallback } from "react";
import AccountTab from "../../../components/settings/account-tab";
import ApiKeysTab from "../../../components/settings/api-keys-tab";
import PoliciesTab from "../../../components/settings/policies-tab";
import NotificationsTab from "../../../components/settings/notifications-tab";
import SecurityTab from "../../../components/settings/security-tab";
import BillingTab from "../../../components/settings/billing-tab";
import DeveloperTab from "../../../components/settings/developer-tab";

type TabId = "account" | "api-keys" | "policies" | "notifications" | "security" | "billing" | "developer";

const tabs: { id: TabId; label: string }[] = [
  { id: "account", label: "Account" },
  { id: "api-keys", label: "API Keys" },
  { id: "policies", label: "Policies" },
  { id: "notifications", label: "Notifications" },
  { id: "security", label: "Security" },
  { id: "billing", label: "Billing" },
  { id: "developer", label: "Developer" },
];

interface Toast {
  id: number;
  message: string;
}

let toastId = 0;

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("account");
  const [searchQuery, setSearchQuery] = useState("");
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <div>
      <h1 className="dash-page-title">Settings</h1>
      <p className="dash-page-desc">Manage your AegisAI workspace, policies, and security.</p>

      <div className="dash-settings-search">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search settings..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="dash-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`dash-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ marginTop: "1.25rem" }}>
        {activeTab === "account" && <AccountTab searchQuery={searchQuery} showToast={showToast} />}
        {activeTab === "api-keys" && <ApiKeysTab searchQuery={searchQuery} showToast={showToast} />}
        {activeTab === "policies" && <PoliciesTab searchQuery={searchQuery} showToast={showToast} />}
        {activeTab === "notifications" && <NotificationsTab searchQuery={searchQuery} showToast={showToast} />}
        {activeTab === "security" && <SecurityTab searchQuery={searchQuery} showToast={showToast} />}
        {activeTab === "billing" && <BillingTab searchQuery={searchQuery} showToast={showToast} />}
        {activeTab === "developer" && <DeveloperTab searchQuery={searchQuery} showToast={showToast} />}
      </div>

      {toasts.length > 0 && (
        <div className="dash-toast-container">
          {toasts.map((toast) => (
            <div key={toast.id} className="dash-toast success">
              {toast.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
