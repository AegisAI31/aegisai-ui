"use client";

import { useState } from "react";
import { settingsNotifications } from "../../mock/settings";

interface NotificationsTabProps {
  searchQuery: string;
  showToast: (msg: string) => void;
}

export default function NotificationsTab({ searchQuery, showToast }: NotificationsTabProps) {
  const [emailHighRisk, setEmailHighRisk] = useState(settingsNotifications.emailHighRisk);
  const [weeklyReport, setWeeklyReport] = useState(settingsNotifications.weeklyReport);
  const [errorSpike, setErrorSpike] = useState(settingsNotifications.errorSpike);
  const [email, setEmail] = useState(settingsNotifications.channels.email);
  const [slackWebhook, setSlackWebhook] = useState(settingsNotifications.channels.slackWebhook);
  const [frequency, setFrequency] = useState<"immediate" | "hourly" | "daily">(settingsNotifications.frequency);

  const hidden = (terms: string) =>
    searchQuery && !terms.toLowerCase().includes(searchQuery.toLowerCase()) ? " dash-hidden" : "";

  return (
    <div>
      <div className={"dash-card" + hidden("notifications alerts email high risk weekly compliance error spike")} data-search-terms="notifications alerts email high risk weekly compliance error spike">
        <div className="dash-card-header">
          <div>
            <div className="dash-card-title">Alert Preferences</div>
            <div className="dash-card-subtitle">Choose which alerts you want to receive</div>
          </div>
        </div>
        <div className="dash-form-group">
          <label className="dash-toggle">
            <input
              type="checkbox"
              checked={emailHighRisk}
              onChange={(e) => setEmailHighRisk(e.target.checked)}
            />
            <span className="dash-toggle-track" />
            <span>Email alerts for high-risk blocks</span>
          </label>
        </div>
        <div className="dash-form-group">
          <label className="dash-toggle">
            <input
              type="checkbox"
              checked={weeklyReport}
              onChange={(e) => setWeeklyReport(e.target.checked)}
            />
            <span className="dash-toggle-track" />
            <span>Weekly compliance report</span>
          </label>
        </div>
        <div className="dash-form-group">
          <label className="dash-toggle">
            <input
              type="checkbox"
              checked={errorSpike}
              onChange={(e) => setErrorSpike(e.target.checked)}
            />
            <span className="dash-toggle-track" />
            <span>Alert when error rate spikes</span>
          </label>
        </div>
      </div>

      <div className={"dash-card" + hidden("channels email slack webhook")} data-search-terms="channels email slack webhook">
        <div className="dash-card-header">
          <div>
            <div className="dash-card-title">Channels</div>
            <div className="dash-card-subtitle">Configure notification delivery channels</div>
          </div>
        </div>
        <div className="dash-form-group">
          <label className="dash-label">Email</label>
          <input
            className="dash-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="dash-form-group">
          <label className="dash-label">Slack Webhook URL</label>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
            <input
              className="dash-input"
              type="url"
              value={slackWebhook}
              onChange={(e) => setSlackWebhook(e.target.value)}
              placeholder="https://hooks.slack.com/..."
              style={{ flex: 1 }}
            />
            <button
              className="dash-btn dash-btn-sm dash-btn-ghost"
              onClick={() => showToast("Webhook test sent")}
              style={{ marginTop: "0" }}
            >
              Test webhook
            </button>
          </div>
        </div>
      </div>

      <div className={"dash-card" + hidden("frequency immediate hourly daily digest")} data-search-terms="frequency immediate hourly daily digest">
        <div className="dash-card-header">
          <div>
            <div className="dash-card-title">Frequency</div>
            <div className="dash-card-subtitle">How often you receive notification digests</div>
          </div>
        </div>
        <div className="dash-form-group">
          <select
            className="dash-input"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as "immediate" | "hourly" | "daily")}
          >
            <option value="immediate">Immediate</option>
            <option value="hourly">Hourly digest</option>
            <option value="daily">Daily digest</option>
          </select>
        </div>
      </div>

      <button
        className="dash-btn dash-btn-primary"
        onClick={() => showToast("Notification settings saved")}
      >
        Save notification settings
      </button>
    </div>
  );
}
