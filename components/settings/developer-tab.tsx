"use client";

import Link from "next/link";

interface DeveloperTabProps {
  searchQuery: string;
  showToast: (msg: string) => void;
}

const ENV_VARS = [
  { name: "AEGISAI_API_KEY", description: "Your API authentication key", example: "aegis_live_xxxxxxxxxxxx" },
  { name: "AEGIS_CORE_API_URL", description: "Trust evaluation API base URL", example: "http://localhost:8001" },
  { name: "AEGIS_CONNECTORS_API_URL", description: "Reports & connectors API base URL", example: "http://localhost:8002" },
  { name: "AEGIS_AUTH_API_URL", description: "Auth service base URL", example: "http://localhost:8000" },
];

export default function DeveloperTab({ searchQuery, showToast }: DeveloperTabProps) {
  const isVisible = (terms: string) =>
    !searchQuery || terms.toLowerCase().includes(searchQuery.toLowerCase());

  function copy(text: string) {
    navigator.clipboard.writeText(text).catch(() => {});
    showToast("Copied to clipboard");
  }

  return (
    <div>
      <div className={`dash-card ${isVisible("sdk install quickstart documentation") ? "" : "dash-hidden"}`}>
        <div className="dash-card-header">
          <div>
            <div className="dash-card-title">SDK Quick Links</div>
            <div className="dash-card-subtitle">Jump to SDK documentation and guides</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link href="/dashboard/sdk" className="dash-btn dash-btn-ghost">Installation Guide</Link>
          <Link href="/dashboard/sdk" className="dash-btn dash-btn-ghost">Quickstart</Link>
          <a href="https://github.com/aegisai/aegisai-sdk-python" target="_blank" rel="noopener noreferrer" className="dash-btn dash-btn-ghost">GitHub</a>
        </div>
      </div>

      <div className={`dash-card ${isVisible("environment variables env api key base url") ? "" : "dash-hidden"}`} style={{ marginTop: "1rem" }}>
        <div className="dash-card-header">
          <div>
            <div className="dash-card-title">Environment Variables</div>
            <div className="dash-card-subtitle">Required environment variables for your integration</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {ENV_VARS.map((ev) => (
            <div key={ev.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.85rem 1rem", background: "var(--d-bg)", borderRadius: "var(--d-radius)", border: "1px solid var(--d-border)" }}>
              <div>
                <div style={{ fontFamily: "'SF Mono', 'Fira Code', monospace", fontSize: "0.85rem", fontWeight: 600, color: "var(--d-text)" }}>{ev.name}</div>
                <div style={{ fontSize: "0.82rem", color: "var(--d-text-secondary)", marginTop: "0.2rem" }}>{ev.description}</div>
              </div>
              <button className="dash-btn dash-btn-ghost dash-btn-sm" onClick={() => copy(`export ${ev.name}=${ev.example}`)}>Copy</button>
            </div>
          ))}
        </div>
      </div>

      <div className={`dash-card ${isVisible("webhooks events") ? "" : "dash-hidden"}`} style={{ marginTop: "1rem" }}>
        <div className="dash-card-header">
          <div>
            <div className="dash-card-title">Webhooks</div>
            <div className="dash-card-subtitle">Real-time event notifications</div>
          </div>
          <span className="dash-badge dash-badge-warning">Coming Soon</span>
        </div>
        <p style={{ fontSize: "0.85rem", color: "var(--d-text-secondary)", lineHeight: 1.6 }}>
          Webhook delivery for events like <code>request.blocked</code> and <code>request.escalated</code> is planned for a future release.
        </p>
      </div>
    </div>
  );
}
