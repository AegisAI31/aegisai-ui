"use client";

interface PoliciesTabProps {
  searchQuery: string;
  showToast: (msg: string) => void;
}

export default function PoliciesTab({ searchQuery }: PoliciesTabProps) {
  const hidden = (terms: string) =>
    searchQuery && !terms.toLowerCase().includes(searchQuery.toLowerCase()) ? " dash-hidden" : "";

  return (
    <div>
      <div className={"dash-card" + hidden("policies enforcement rules compliance")} data-search-terms="policies enforcement rules compliance">
        <div className="dash-card-header">
          <div>
            <div className="dash-card-title">Policy Management</div>
            <div className="dash-card-subtitle">Trust & safety policy configuration</div>
          </div>
          <span className="dash-badge dash-badge-warning">Preview</span>
        </div>
        <p style={{ fontSize: "0.85rem", color: "var(--d-text-secondary)", lineHeight: 1.6, marginBottom: "1rem" }}>
          Policy management is in preview. The five-pillar trust engine currently runs with built-in evaluation logic.
          User-configurable policies with custom enforcement rules are planned for a future release.
        </p>
        <div style={{ background: "var(--d-bg)", border: "1px solid var(--d-border)", borderRadius: "var(--d-radius)", padding: "1rem" }}>
          <p style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.5rem" }}>Current Trust Pillars (Built-in)</p>
          {[
            "Safety & Toxicity Analysis",
            "Hallucination & Factual Integrity",
            "Bias & Fairness Analysis",
            "Prompt Security & Injection Detection",
            "Compliance & Policy Enforcement",
          ].map((p) => (
            <div key={p} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.35rem 0", fontSize: "0.85rem", color: "var(--d-text-secondary)" }}>
              <span className="dash-badge dash-badge-success" style={{ fontSize: "0.7rem" }}>Active</span>
              {p}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
