"use client";

interface SecurityTabProps {
  searchQuery: string;
  showToast: (msg: string) => void;
}

export default function SecurityTab({ searchQuery }: SecurityTabProps) {
  const hidden = (terms: string) =>
    searchQuery && !terms.toLowerCase().includes(searchQuery.toLowerCase()) ? " dash-hidden" : "";

  return (
    <div>
      <div className={"dash-card" + hidden("security mfa sessions ip allowlist retention")} data-search-terms="security mfa sessions ip allowlist retention">
        <div className="dash-card-header">
          <div>
            <div className="dash-card-title">Security</div>
            <div className="dash-card-subtitle">MFA, session management, IP allowlist, and data retention</div>
          </div>
          <span className="dash-badge dash-badge-warning">Coming Soon</span>
        </div>
        <p style={{ fontSize: "0.85rem", color: "var(--d-text-secondary)", lineHeight: 1.6 }}>
          Security controls including MFA, session management, IP allowlisting, and data retention policies
          will be available in a future release.
        </p>
      </div>
    </div>
  );
}
