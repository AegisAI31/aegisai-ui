"use client";

import { useState } from "react";
import { sdkVersions, codeExamples, faqs } from "../../../mock/sdk";
import type { SDKVersion } from "../../../mock/types";

export default function SDKPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [codeLang, setCodeLang] = useState<"python" | "node">("python");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadLang, setDownloadLang] = useState<"Python" | "Node">("Python");
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([]);

  let toastCounter = 0;

  function showToast(message: string) {
    const id = Date.now() + toastCounter++;
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  }

  function copyToClipboard(text: string, id: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      showToast("Copied to clipboard");
      setTimeout(() => setCopiedId(null), 2000);
    });
  }

  const pythonSdk = sdkVersions.find((s) => s.language === "Python")!;
  const nodeSdk = sdkVersions.find((s) => s.language === "Node")!;
  const selectedSdk: SDKVersion = downloadLang === "Python" ? pythonSdk : nodeSdk;

  return (
    <div>
      <div className="dash-hero-section">
        <div className="dash-hero-content">
          <h1 className="dash-hero-title">AegisAI SDK</h1>
          <p className="dash-hero-desc">
            Integrate trust and safety guardrails into your AI applications with just a few lines of code. Available for Python and Node.js.
          </p>
          <div className="dash-hero-actions">
            <button
              className="dash-btn dash-btn-primary"
              onClick={() => { setDownloadLang("Python"); setShowDownloadModal(true); }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download Python SDK
            </button>
            <button
              className="dash-btn dash-btn-primary"
              onClick={() => { setDownloadLang("Node"); setShowDownloadModal(true); }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download Node SDK
            </button>
            <a href="https://docs.aegisai.dev" target="_blank" rel="noopener noreferrer" className="dash-btn dash-btn-ghost">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              View Docs
            </a>
          </div>
        </div>
      </div>

      <div className="dash-section-title">Installation</div>
      <div className="dash-install-cards">
        <div className="dash-install-card">
          <div className="dash-install-card-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            Python
          </div>
          <div className="dash-code-inline">
            <span>{pythonSdk.installCommand}</span>
            <button
              className={`dash-code-copy ${copiedId === "install-python" ? "copied" : ""}`}
              onClick={() => copyToClipboard(pythonSdk.installCommand, "install-python")}
            >
              {copiedId === "install-python" ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
        <div className="dash-install-card">
          <div className="dash-install-card-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            Node.js
          </div>
          <div className="dash-code-inline">
            <span>{nodeSdk.installCommand}</span>
            <button
              className={`dash-code-copy ${copiedId === "install-node" ? "copied" : ""}`}
              onClick={() => copyToClipboard(nodeSdk.installCommand, "install-node")}
            >
              {copiedId === "install-node" ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      </div>

      <div className="dash-section-title">Quickstart</div>
      <div className="dash-tabs">
        <button className={`dash-tab ${codeLang === "python" ? "active" : ""}`} onClick={() => setCodeLang("python")}>Python</button>
        <button className={`dash-tab ${codeLang === "node" ? "active" : ""}`} onClick={() => setCodeLang("node")}>Node.js</button>
      </div>
      {codeExamples.map((example, idx) => (
        <div key={idx} className="dash-card" style={{ marginBottom: "1.25rem" }}>
          <div className="dash-card-header">
            <div>
              <div className="dash-card-title">{example.title}</div>
              <div className="dash-card-subtitle">{example.description}</div>
            </div>
          </div>
          <div className="dash-code-block">
            <div className="dash-code-header">
              <span className="dash-code-lang">{codeLang === "python" ? "Python" : "JavaScript"}</span>
              <button
                className={`dash-code-copy ${copiedId === `example-${idx}` ? "copied" : ""}`}
                onClick={() => copyToClipboard(codeLang === "python" ? example.python : example.node, `example-${idx}`)}
              >
                {copiedId === `example-${idx}` ? "✓ Copied!" : "Copy"}
              </button>
            </div>
            <div className="dash-code-body">
              <pre><code>{codeLang === "python" ? example.python : example.node}</code></pre>
            </div>
          </div>
        </div>
      ))}

      <div className="dash-section-title">Authentication</div>
      <div className="dash-card">
        <div className="dash-card-title" style={{ marginBottom: "1rem" }}>Setting Your API Key</div>
        <p style={{ fontSize: "0.88rem", color: "var(--d-text-secondary)", marginBottom: "1rem", lineHeight: 1.6 }}>
          Set your AegisAI API key as an environment variable to authenticate SDK requests. Never hard-code your API key in source code.
        </p>
        <div className="dash-code-block">
          <div className="dash-code-header">
            <span className="dash-code-lang">Environment Variable</span>
            <button
              className={`dash-code-copy ${copiedId === "auth-env" ? "copied" : ""}`}
              onClick={() => copyToClipboard("export AEGISAI_API_KEY=your-api-key-here", "auth-env")}
            >
              {copiedId === "auth-env" ? "✓ Copied!" : "Copy"}
            </button>
          </div>
          <div className="dash-code-body">
            <pre><code>export AEGISAI_API_KEY=your-api-key-here</code></pre>
          </div>
        </div>
        <div className="dash-card-title" style={{ marginBottom: "1rem", marginTop: "1.5rem" }}>Rotating API Keys</div>
        <div style={{ fontSize: "0.85rem", color: "var(--d-text-secondary)", lineHeight: 1.7 }}>
          <ol style={{ paddingLeft: "1.25rem", margin: 0 }}>
            <li style={{ marginBottom: "0.5rem" }}>Generate a new API key in the dashboard (Settings → API Keys).</li>
            <li style={{ marginBottom: "0.5rem" }}>Update your environment variables with the new key.</li>
            <li style={{ marginBottom: "0.5rem" }}>Verify the new key works by making a test evaluate call.</li>
            <li>Revoke the old key in the dashboard. Both keys are valid simultaneously during the rotation window.</li>
          </ol>
        </div>
      </div>

      <div className="dash-section-title">Best Practices</div>
      <div className="dash-card">
        <div className="dash-best-practice">
          <div className="dash-best-practice-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div className="dash-best-practice-text">
            <h4>Always Set policy_id</h4>
            <p>Specify a policy_id with every evaluate and analyze call. This ensures consistent enforcement rules and enables audit trail tracking per policy.</p>
          </div>
        </div>
        <div className="dash-best-practice">
          <div className="dash-best-practice-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <div className="dash-best-practice-text">
            <h4>Log report_id</h4>
            <p>Store the report_id from every evaluation response. This unique identifier links to the full audit trail and is essential for debugging and compliance reviews.</p>
          </div>
        </div>
        <div className="dash-best-practice">
          <div className="dash-best-practice-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/></svg>
          </div>
          <div className="dash-best-practice-text">
            <h4>Use Strictness Thresholds</h4>
            <p>Configure strictness levels (1-5) based on your use case. Use higher strictness for sensitive domains like healthcare and finance, lower for creative applications.</p>
          </div>
        </div>
        <div className="dash-best-practice">
          <div className="dash-best-practice-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div className="dash-best-practice-text">
            <h4>Handle Escalation Flows</h4>
            <p>Implement escalation handlers for requests that need human review. Use the callback or webhook integration to route escalated requests to your moderation team.</p>
          </div>
        </div>
      </div>

      <div className="dash-section-title">FAQ</div>
      {faqs.map((faq, idx) => (
        <div key={idx} className={`dash-faq-item ${openFaqIndex === idx ? "open" : ""}`}>
          <button className="dash-faq-question" onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}>
            <span>{faq.question}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: openFaqIndex === idx ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          <div className="dash-faq-answer">{faq.answer}</div>
        </div>
      ))}

      {showDownloadModal && (
        <div className="dash-modal-overlay" onClick={() => setShowDownloadModal(false)}>
          <div className="dash-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dash-modal-header">
              <span className="dash-modal-title">Download SDK</span>
              <button className="dash-modal-close" onClick={() => setShowDownloadModal(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="dash-modal-body">
              <div style={{ marginBottom: "1.25rem" }}>
                <label className="dash-label">Language</label>
                <div className="dash-tabs" style={{ marginBottom: "0" }}>
                  <button className={`dash-tab ${downloadLang === "Python" ? "active" : ""}`} onClick={() => setDownloadLang("Python")}>Python</button>
                  <button className={`dash-tab ${downloadLang === "Node" ? "active" : ""}`} onClick={() => setDownloadLang("Node")}>Node.js</button>
                </div>
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <div className="dash-detail-row">
                  <span className="dash-detail-key">Package</span>
                  <span className="dash-detail-value">{selectedSdk.packageName}</span>
                </div>
                <div className="dash-detail-row">
                  <span className="dash-detail-key">Version</span>
                  <span className="dash-detail-value">{selectedSdk.version}</span>
                </div>
                <div className="dash-detail-row">
                  <span className="dash-detail-key">Released</span>
                  <span className="dash-detail-value">{selectedSdk.releasedAt}</span>
                </div>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <div className="dash-card-title" style={{ marginBottom: "0.75rem" }}>Install Command</div>
                <div className="dash-code-inline" style={{ width: "100%" }}>
                  <span style={{ flex: 1 }}>{selectedSdk.installCommand}</span>
                  <button
                    className={`dash-code-copy ${copiedId === "modal-install" ? "copied" : ""}`}
                    onClick={() => copyToClipboard(selectedSdk.installCommand, "modal-install")}
                  >
                    {copiedId === "modal-install" ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              <div>
                <div className="dash-card-title" style={{ marginBottom: "0.75rem" }}>Recent Changes</div>
                {selectedSdk.changelog.slice(0, 2).map((entry, idx) => (
                  <div key={idx} style={{ marginBottom: "1rem" }}>
                    <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--d-text)", marginBottom: "0.35rem" }}>
                      v{entry.version} — {entry.date}
                    </div>
                    <ul style={{ paddingLeft: "1.15rem", margin: 0 }}>
                      {entry.changes.map((change, cIdx) => (
                        <li key={cIdx} style={{ fontSize: "0.8rem", color: "var(--d-text-secondary)", lineHeight: 1.6, marginBottom: "0.15rem" }}>
                          {change}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <div className="dash-modal-footer">
              <button className="dash-btn dash-btn-ghost" onClick={() => setShowDownloadModal(false)}>Close</button>
              <button
                className="dash-btn dash-btn-primary"
                onClick={() => {
                  copyToClipboard(selectedSdk.installCommand, "modal-install");
                  showToast(`Install command copied for ${downloadLang} SDK`);
                }}
              >
                Copy Install Command
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="dash-toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className="dash-toast success">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}
