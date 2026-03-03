"use client";

import { settingsBilling } from "../../mock/settings";

interface BillingTabProps {
  searchQuery: string;
  showToast: (msg: string) => void;
}

export default function BillingTab({ searchQuery, showToast }: BillingTabProps) {
  const usagePercent = ((settingsBilling.requestsThisMonth / settingsBilling.quota) * 100).toFixed(1);

  const hidden = (terms: string) =>
    searchQuery && !terms.toLowerCase().includes(searchQuery.toLowerCase()) ? " dash-hidden" : "";

  return (
    <div>
      <div className={"dash-card" + hidden("plan billing usage quota upgrade")} data-search-terms="plan billing usage quota upgrade">
        <div className="dash-card-header">
          <div>
            <div className="dash-card-title">Current Plan</div>
            <div className="dash-card-subtitle">Your subscription and usage overview</div>
          </div>
          <span className="dash-badge dash-badge-accent">{settingsBilling.plan}</span>
        </div>
        <div className="dash-usage-bar">
          <div className="dash-usage-bar-fill" style={{ width: `${usagePercent}%` }}></div>
        </div>
        <p style={{ fontSize: "0.85rem", color: "var(--d-text-secondary)", marginTop: "0.5rem", marginBottom: "1rem" }}>
          {settingsBilling.requestsThisMonth.toLocaleString()} / {settingsBilling.quota.toLocaleString()} requests ({usagePercent}%)
        </p>
        <button
          className="dash-btn dash-btn-primary"
          onClick={() => showToast("Contact sales for enterprise pricing")}
        >
          Upgrade plan
        </button>
      </div>

      <div className={"dash-card" + hidden("invoices payment history download")} data-search-terms="invoices payment history download">
        <div className="dash-card-header">
          <div>
            <div className="dash-card-title">Invoice History</div>
            <div className="dash-card-subtitle">View and download past invoices</div>
          </div>
        </div>
        <table className="dash-table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {settingsBilling.invoices.map((inv) => (
              <tr key={inv.id}>
                <td>{inv.month}</td>
                <td style={{ fontWeight: 600 }}>{inv.amount}</td>
                <td>
                  <span className={`dash-badge ${inv.status === "Paid" ? "dash-badge-success" : "dash-badge-warning"}`}>
                    {inv.status}
                  </span>
                </td>
                <td>
                  <button
                    className="dash-btn dash-btn-ghost dash-btn-sm"
                    onClick={() => showToast(`Downloading ${inv.month} invoice`)}
                  >
                    Download PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
