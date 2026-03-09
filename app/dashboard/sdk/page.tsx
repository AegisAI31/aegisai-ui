"use client";

import { useState } from "react";

const PYTHON_VERSION = "0.2.0";
const PYTHON_INSTALL = "pip install aegisai-sdk";
const GITHUB_URL = "https://github.com/aegisai/aegisai-sdk-python";

const codeExamples = [
  {
    title: "Basic Trust Evaluation",
    description: "Evaluate an AI-generated response for safety and governance using client.analyze().",
    code: `from aegisai_sdk import AegisAIClient

client = AegisAIClient(
    api_key="your-api-key",
    base_url="https://api.aegisai.com",
)

result = client.analyze(
    prompt="What are the health benefits of exercise?",
    response="Regular exercise improves cardiovascular health...",
    model="gpt-4",
    provider="openai",
)

print(result.overall_score)   # e.g. 88.9
print(result.risk_level)      # e.g. "safe"
print(result.confidence)      # e.g. 1.0`,
  },
  {
    title: "Error Handling",
    description: "Handle authentication, validation, and connection errors cleanly.",
    code: `from aegisai_sdk import (
    AegisAIClient,
    AuthenticationError,
    ValidationError,
    ApiConnectionError,
    TimeoutError,
    AegisAIError,
)

client = AegisAIClient(api_key="your-api-key")

try:
    result = client.analyze(
        prompt="...",
        response="...",
        model="gpt-4",
    )
except AuthenticationError:
    print("Invalid API key")
except ValidationError as e:
    print(f"Validation failed: {e.errors}")
except TimeoutError:
    print("Request timed out")
except AegisAIError as e:
    print(f"Error: {e.message}")`,
  },
  {
    title: "Per-Pillar Results",
    description: "Inspect individual safety pillar scores from the evaluation response.",
    code: `result = client.analyze(
    prompt="...",
    response="...",
    model="gpt-4",
)

for pillar_id, pillar in result.pillar_results.items():
    score = f"{pillar.score.value:.1f}" if pillar.score else "N/A"
    print(f"[{pillar.name}] status={pillar.status} score={score}")

# Output:
# [Safety & Toxicity Analysis] status=success score=97.3
# [Hallucination & Factual Integrity] status=success score=73.6
# [Bias & Fairness Analysis] status=success score=91.4
# [Prompt Security & Injection Detection] status=success score=96.0
# [Compliance & Policy Enforcement] status=success score=89.9`,
  },
];

const faqs = [
  {
    q: "What Python versions are supported?",
    a: "Python 3.9, 3.10, 3.11, and 3.12. Python 3.14 is not yet supported due to missing prebuilt wheels for dependencies.",
  },
  {
    q: "What is the only runtime dependency?",
    a: "httpx >= 0.27. The SDK has no other runtime dependencies.",
  },
  {
    q: "Is there a Node.js SDK?",
    a: "The Node.js SDK is in development. It is not yet available. This page will be updated when it ships.",
  },
  {
    q: "How do I authenticate?",
    a: "Pass api_key= for production server-to-server use, or token= for JWT-based flows. Both are sent as Authorization: Bearer headers.",
  },
  {
    q: "Where can I get an API key?",
    a: "Generate one from the API Keys page in this dashboard.",
  },
];

export default function SDKPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  function copy(text: string, id: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }

  return (
    <div>
      <div className="dash-hero-section">
        <div className="dash-hero-content">
          <h1 className="dash-hero-title">AegisAI Python SDK</h1>
          <p className="dash-hero-desc">
            Integrate AI safety guardrails into your applications with a single method call.
            Production-ready, strongly typed, zero framework coupling.
          </p>
          <div className="dash-hero-actions">
            <button className="dash-btn dash-btn-primary" onClick={() => copy(PYTHON_INSTALL, "hero-install")}>
              {copiedId === "hero-install" ? "✓ Copied!" : "Copy Install Command"}
            </button>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="dash-btn dash-btn-ghost">
              View on GitHub
            </a>
          </div>
        </div>
      </div>

      <div className="dash-section-title">Installation</div>
      <div className="dash-install-cards">
        <div className="dash-install-card">
          <div className="dash-install-card-title">Python — v{PYTHON_VERSION}</div>
          <div className="dash-code-inline">
            <span>{PYTHON_INSTALL}</span>
            <button className={`dash-code-copy ${copiedId === "install-python" ? "copied" : ""}`} onClick={() => copy(PYTHON_INSTALL, "install-python")}>
              {copiedId === "install-python" ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
        <div className="dash-install-card" style={{ opacity: 0.6 }}>
          <div className="dash-install-card-title">
            Node.js
            <span className="dash-badge dash-badge-warning" style={{ marginLeft: "0.5rem", fontSize: "0.7rem" }}>Coming Soon</span>
          </div>
          <div className="dash-code-inline">
            <span style={{ color: "var(--d-text-muted)" }}>npm install @aegisai/sdk</span>
          </div>
        </div>
      </div>

      <div className="dash-section-title">Quickstart</div>
      {codeExamples.map((ex, idx) => (
        <div key={idx} className="dash-card" style={{ marginBottom: "1.25rem" }}>
          <div className="dash-card-header">
            <div>
              <div className="dash-card-title">{ex.title}</div>
              <div className="dash-card-subtitle">{ex.description}</div>
            </div>
          </div>
          <div className="dash-code-block">
            <div className="dash-code-header">
              <span className="dash-code-lang">Python</span>
              <button className={`dash-code-copy ${copiedId === `ex-${idx}` ? "copied" : ""}`} onClick={() => copy(ex.code, `ex-${idx}`)}>
                {copiedId === `ex-${idx}` ? "✓ Copied!" : "Copy"}
              </button>
            </div>
            <div className="dash-code-body"><pre><code>{ex.code}</code></pre></div>
          </div>
        </div>
      ))}

      <div className="dash-section-title">Authentication</div>
      <div className="dash-card">
        <div className="dash-card-title" style={{ marginBottom: "1rem" }}>Setting Your API Key</div>
        <p style={{ fontSize: "0.88rem", color: "var(--d-text-secondary)", marginBottom: "1rem", lineHeight: 1.6 }}>
          Never hard-code credentials. Use environment variables.
        </p>
        <div className="dash-code-block">
          <div className="dash-code-header">
            <span className="dash-code-lang">Shell</span>
            <button className={`dash-code-copy ${copiedId === "env" ? "copied" : ""}`} onClick={() => copy("export AEGISAI_API_KEY=your-api-key-here", "env")}>
              {copiedId === "env" ? "✓ Copied!" : "Copy"}
            </button>
          </div>
          <div className="dash-code-body"><pre><code>export AEGISAI_API_KEY=your-api-key-here</code></pre></div>
        </div>
        <div className="dash-code-block" style={{ marginTop: "1rem" }}>
          <div className="dash-code-header"><span className="dash-code-lang">Python</span></div>
          <div className="dash-code-body"><pre><code>{`import os
from aegisai_sdk import AegisAIClient

client = AegisAIClient(api_key=os.environ["AEGISAI_API_KEY"])`}</code></pre></div>
        </div>
      </div>

      <div className="dash-section-title">SDK Version</div>
      <div className="dash-card">
        <div className="dash-detail-row"><span className="dash-detail-key">Package</span><span className="dash-detail-value">aegisai-sdk</span></div>
        <div className="dash-detail-row"><span className="dash-detail-key">Version</span><span className="dash-detail-value">{PYTHON_VERSION}</span></div>
        <div className="dash-detail-row"><span className="dash-detail-key">Python</span><span className="dash-detail-value">3.9 – 3.12</span></div>
        <div className="dash-detail-row"><span className="dash-detail-key">Dependencies</span><span className="dash-detail-value">httpx &gt;= 0.27</span></div>
        <div className="dash-detail-row"><span className="dash-detail-key">Source</span><span className="dash-detail-value"><a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" style={{ color: "var(--d-accent)" }}>GitHub</a></span></div>
        <div className="dash-detail-row">
          <span className="dash-detail-key">Node SDK</span>
          <span className="dash-badge dash-badge-warning">Coming Soon</span>
        </div>
      </div>

      <div className="dash-section-title">FAQ</div>
      {faqs.map((faq, idx) => (
        <div key={idx} className={`dash-faq-item ${openFaq === idx ? "open" : ""}`}>
          <button className="dash-faq-question" onClick={() => setOpenFaq(openFaq === idx ? null : idx)}>
            <span>{faq.q}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: openFaq === idx ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          <div className="dash-faq-answer">{faq.a}</div>
        </div>
      ))}
    </div>
  );
}
