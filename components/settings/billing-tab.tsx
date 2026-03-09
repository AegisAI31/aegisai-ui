"use client";

interface BillingTabProps {
  searchQuery: string;
  showToast: (msg: string) => void;
}

export default function BillingTab({ searchQuery }: BillingTabProps) {
  const hidden = (terms: string) =>
    searchQuery && !terms.toLowerCase().includes(searchQuery.toLowerCase()) ? " dash-hidden" : "";

  return (
    <div>
      <div className={"dash-card" + hidden("billing plan usage quota invoices")} data-search-terms="billing plan usage quota invoices">
        <div className="dash-card-header">
          <div>
            <div className="dash-card-title">Billing & Usage</div>
            <div className="dash-card-subtitle">Plan, quota, and invoice management</div>
          </div>
          <span className="dash-badge dash-badge-warning">Coming Soon</span>
        </div>
        <p style={{ fontSize: "0.85rem", color: "var(--d-text-secondary)", lineHeight: 1.6 }}>
          Subscription management, usage quotas, and invoice history are not yet connected to a billing service.
          Contact your account manager for pricing and plan information.
        </p>
      </div>
    </div>
  );
}
