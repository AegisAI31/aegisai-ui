"use client";

import { FormEvent, useState } from "react";

type TrustResponse = {
  data: {
    final_score: {
      value: number;
      confidence: number;
      risk_level?: string;
    };
    pillar_results: Record<
      string,
      {
        metadata: { name: string; weight: number };
        score?: { value: number };
        flags: string[];
        status: string;
      }
    >;
  };
};

export default function EvaluatePage() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [model, setModel] = useState("gpt-4");
  const [provider, setProvider] = useState("openai");
  const [trustResult, setTrustResult] = useState<TrustResponse["data"] | null>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState("");

  async function evaluateTrust(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEvaluating(true);
    setError("");
    try {
      const result = await fetch("/api/trust/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, response, model, provider }),
      });
      const payload = await result.json();
      if (!result.ok) {
        throw new Error(payload.error || payload.detail || "Evaluation failed");
      }
      setTrustResult(payload.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Evaluation failed");
    } finally {
      setEvaluating(false);
    }
  }

  return (
    <div>
      <h1 className="dash-page-title">Trust Evaluation</h1>
      <p className="dash-page-desc">Test AI responses against all five trust pillars in real-time.</p>

      {error && <div className="dash-error">{error}</div>}

      <div className="dash-card">
        <form onSubmit={evaluateTrust}>
          <div className="dash-form-row">
            <div className="dash-form-group">
              <label className="dash-label">User Prompt</label>
              <textarea
                className="dash-input dash-textarea"
                required
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter the user's input prompt..."
                rows={5}
              />
            </div>
            <div className="dash-form-group">
              <label className="dash-label">AI Response</label>
              <textarea
                className="dash-input dash-textarea"
                required
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Enter the AI model's response..."
                rows={5}
              />
            </div>
          </div>
          <div className="dash-form-row">
            <div className="dash-form-group">
              <label className="dash-label">Model</label>
              <input
                className="dash-input"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g., gpt-4"
              />
            </div>
            <div className="dash-form-group">
              <label className="dash-label">Provider</label>
              <input
                className="dash-input"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                placeholder="e.g., openai"
              />
            </div>
          </div>
          <button className="dash-btn dash-btn-primary" type="submit" disabled={evaluating}>
            {evaluating ? "Evaluating..." : "Run Evaluation"}
          </button>
        </form>
      </div>

      {trustResult && (
        <>
          <h2 className="dash-section-title" style={{ marginTop: "1.5rem" }}>Results</h2>
          <div className="dash-results-grid">
            <div className="dash-result-item">
              <div className="dash-result-label">Final Score</div>
              <div className="dash-result-value accent">{trustResult.final_score.value.toFixed(2)}</div>
            </div>
            <div className="dash-result-item">
              <div className="dash-result-label">Confidence</div>
              <div className="dash-result-value accent">{(trustResult.final_score.confidence * 100).toFixed(0)}%</div>
            </div>
            <div className="dash-result-item">
              <div className="dash-result-label">Risk Level</div>
              <div className={`dash-result-value ${trustResult.final_score.risk_level || "unknown"}`}>
                {trustResult.final_score.risk_level?.toUpperCase() || "UNKNOWN"}
              </div>
            </div>
          </div>

          <h3 className="dash-section-title">Pillar Breakdown</h3>
          <div className="dash-pillar-grid">
            {Object.entries(trustResult.pillar_results).map(([pillarId, result]) => (
              <div className="dash-pillar-item" key={pillarId}>
                <h4>{result.metadata?.name ?? pillarId}</h4>
                <div className="dash-pillar-meta">
                  <span>Weight: <strong>{result.metadata?.weight ?? 0}%</strong></span>
                  <span>Status: <strong style={{ color: result.status === "passed" ? "var(--d-success)" : "var(--d-warning)" }}>{result.status.toUpperCase()}</strong></span>
                  <span>Score: <strong>{result.score?.value?.toFixed(2) ?? "N/A"}</strong></span>
                </div>
                {result.flags && result.flags.length > 0 && (
                  <div className="dash-pillar-flags">{result.flags.join(", ")}</div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
