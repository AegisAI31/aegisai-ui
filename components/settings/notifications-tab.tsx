"use client";

interface NotificationsTabProps {
  searchQuery: string;
  showToast: (msg: string) => void;
}

export default function NotificationsTab({ searchQuery }: NotificationsTabProps) {
  const hidden = (terms: string) =>
    searchQuery && !terms.toLowerCase().includes(searchQuery.toLowerCase()) ? " dash-hidden" : "";

  return (
    <div>
      <div className={"dash-card" + hidden("notifications alerts email slack webhook")} data-search-terms="notifications alerts email slack webhook">
        <div className="dash-card-header">
          <div>
            <div className="dash-card-title">Notifications</div>
            <div className="dash-card-subtitle">Alert preferences and delivery channels</div>
          </div>
          <span className="dash-badge dash-badge-warning">Coming Soon</span>
        </div>
        <p style={{ fontSize: "0.85rem", color: "var(--d-text-secondary)", lineHeight: 1.6 }}>
          Email alerts, Slack webhooks, and notification frequency settings will be available in a future release.
          Notification infrastructure is not yet connected to a backend service.
        </p>
      </div>
    </div>
  );
}
