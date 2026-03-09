"use client";

import { useState, useEffect } from "react";
import { generatePromptTemplates } from "../../../mock/prompts";
import type { PromptTemplate } from "../../../mock/types";

type SavedPrompt = {
  id: string;
  name: string;
  variant: string;
  prompt_text: string;
  config_json: Record<string, unknown> | null;
  industry: string | null;
  region: string | null;
  strictness: number;
  keywords: string | null;
  created_at: string;
};

export default function PromptGeneratorPage() {
  const [keywords, setKeywords] = useState("");
  const [industry, setIndustry] = useState("SaaS Support");
  const [strictness, setStrictness] = useState(3);
  const [region, setRegion] = useState("US");
  const [addDisclaimers, setAddDisclaimers] = useState(false);
  const [allowRewrite, setAllowRewrite] = useState(true);
  const [escalateToHuman, setEscalateToHuman] = useState(false);

  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [activeTab, setActiveTab] = useState<"Strict" | "Balanced" | "Adaptive">("Strict");
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([]);
  const [loadingPrompts, setLoadingPrompts] = useState(true);
  const [toasts, setToasts] = useState<{ id: number; message: string; type: string }[]>([]);

  function showToast(message: string, type = "success") {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2500);
  }

  async function loadPrompts() {
    try {
      const res = await fetch("/api/prompts");
      if (res.ok) setSavedPrompts(await res.json());
    } catch { /* silent */ }
    finally { setLoadingPrompts(false); }
  }

  useEffect(() => { loadPrompts(); }, []);

  function handleGenerate() {
    if (!keywords.trim()) return;
    const result = generatePromptTemplates(keywords, industry, strictness, region, addDisclaimers, allowRewrite, escalateToHuman);
    setTemplates(result);
    setActiveTab("Strict");
    showToast("Prompt templates generated");
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text).then(() => showToast("Copied to clipboard", "info"));
  }

  async function handleSavePrompt() {
    const activeTemplate = templates.find((t) => t.mode === activeTab);
    if (!activeTemplate || !keywords.trim()) return;
    try {
      const res = await fetch("/api/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${industry} - ${activeTab} (${keywords.split(",")[0].trim()})`,
          variant: activeTab,
          prompt_text: activeTemplate.systemPrompt,
          config_json: activeTemplate.jsonConfig,
          industry,
          region,
          strictness,
          keywords,
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      await loadPrompts();
      showToast("Prompt saved to library");
    } catch {
      showToast("Failed to save prompt", "error");
    }
  }

  async function handleDeletePrompt(id: string) {
    try {
      const res = await fetch(`/api/prompts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setSavedPrompts((prev) => prev.filter((p) => p.id !== id));
      showToast("Prompt deleted", "info");
    } catch {
      showToast("Failed to delete prompt", "error");
    }
  }

  function loadIntoInputs(p: SavedPrompt) {
    if (p.keywords) setKeywords(p.keywords);
    if (p.industry) setIndustry(p.industry);
    if (p.strictness) setStrictness(p.strictness);
    if (p.region) setRegion(p.region);
    showToast("Prompt loaded into inputs", "info");
  }

  const activeTemplate = templates.find((t) => t.mode === activeTab);

  return (
    <>
      <div className="dash-page-header">
        <div className="dash-page-header-left">
          <h1 className="dash-page-title">Prompt Generator</h1>
          <p className="dash-page-desc">Generate safety-tuned system prompts based on your industry, policies, and compliance requirements.</p>
        </div>
      </div>

      <div className="dash-two-panel">
        <div className="dash-two-panel-left">
          <div className="dash-card">
            <div className="dash-card-header"><h3 className="dash-card-title">Inputs</h3></div>

            <div className="dash-form-group">
              <label className="dash-label">Keywords *</label>
              <textarea className="dash-input dash-textarea" placeholder="e.g. financial advice, transactions, regulatory compliance" value={keywords} onChange={(e) => setKeywords(e.target.value)} />
            </div>

            <div className="dash-form-row">
              <div className="dash-form-group">
                <label className="dash-label">Industry</label>
                <select className="dash-input" value={industry} onChange={(e) => setIndustry(e.target.value)}>
                  {["SaaS Support", "Marketplace", "FinTech", "Healthcare-lite", "Education"].map((i) => <option key={i}>{i}</option>)}
                </select>
              </div>
              <div className="dash-form-group">
                <label className="dash-label">Region</label>
                <select className="dash-input" value={region} onChange={(e) => setRegion(e.target.value)}>
                  {["US", "EU", "CA", "Global"].map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            <div className="dash-form-group">
              <label className="dash-label">Strictness Level</label>
              <div className="dash-slider">
                <input type="range" min={1} max={5} value={strictness} onChange={(e) => setStrictness(Number(e.target.value))} />
                <div className="dash-slider-labels"><span>1 - Lenient</span><span>3 - Moderate</span><span>5 - Maximum</span></div>
                <div className="dash-slider-value">Level {strictness}</div>
              </div>
            </div>

            <div className="dash-form-group">
              <label className="dash-label" style={{ marginBottom: "0.65rem" }}>Options</label>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                {[
                  { label: "Add disclaimers", val: addDisclaimers, set: setAddDisclaimers },
                  { label: "Allow rewrite on violation", val: allowRewrite, set: setAllowRewrite },
                  { label: "Escalate to human", val: escalateToHuman, set: setEscalateToHuman },
                ].map(({ label, val, set }) => (
                  <label key={label} className="dash-toggle">
                    <input type="checkbox" checked={val} onChange={(e) => set(e.target.checked)} />
                    <span className="dash-toggle-track" />
                    <span className="dash-toggle-label">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button className="dash-btn dash-btn-primary" style={{ width: "100%", marginTop: "0.5rem" }} onClick={handleGenerate} disabled={!keywords.trim()}>
              Generate Prompts
            </button>
          </div>
        </div>

        <div className="dash-two-panel-right">
          <div className="dash-card">
            <div className="dash-card-header"><h3 className="dash-card-title">Generated Prompt Templates</h3></div>
            {templates.length === 0 ? (
              <div className="dash-empty"><p>Fill in your inputs and click Generate to create prompt templates.</p></div>
            ) : (
              <>
                <div className="dash-tabs">
                  {(["Strict", "Balanced", "Adaptive"] as const).map((tab) => (
                    <button key={tab} className={`dash-tab${activeTab === tab ? " active" : ""}`} onClick={() => setActiveTab(tab)}>{tab}</button>
                  ))}
                </div>
                {activeTemplate && (
                  <div>
                    <div style={{ marginBottom: "1rem" }}>
                      <label className="dash-label" style={{ marginBottom: "0.5rem" }}>System Prompt</label>
                      <div className="dash-code-block">
                        <div className="dash-code-header">
                          <span className="dash-code-lang">system prompt</span>
                          <button className="dash-code-copy" onClick={() => handleCopy(activeTemplate.systemPrompt)}>Copy</button>
                        </div>
                        <div className="dash-code-body"><pre><code>{activeTemplate.systemPrompt}</code></pre></div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "0.75rem" }}>
                      <button className="dash-btn dash-btn-primary" onClick={handleSavePrompt}>Save to Library</button>
                      <button className="dash-btn dash-btn-ghost" onClick={() => handleCopy(activeTemplate.systemPrompt)}>Copy All</button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="dash-card" style={{ marginTop: "1.5rem" }}>
        <div className="dash-card-header">
          <h3 className="dash-card-title">Prompt Library</h3>
          <span className="dash-badge dash-badge-accent">{savedPrompts.length} saved</span>
        </div>
        {loadingPrompts ? (
          <div className="dash-empty"><p>Loading...</p></div>
        ) : savedPrompts.length === 0 ? (
          <div className="dash-empty"><p>No saved prompts yet. Generate and save prompts to build your library.</p></div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="dash-table">
              <thead>
                <tr><th>Name</th><th>Created</th><th>Variant</th><th>Industry</th><th>Region</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {savedPrompts.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 600 }}>{p.name}</td>
                    <td>{new Date(p.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                    <td><span className={`dash-badge ${p.variant === "Strict" ? "dash-badge-error" : p.variant === "Balanced" ? "dash-badge-accent" : "dash-badge-success"}`}>{p.variant}</span></td>
                    <td>{p.industry || "—"}</td>
                    <td>{p.region || "—"}</td>
                    <td>
                      <div style={{ display: "flex", gap: "0.35rem" }}>
                        <button className="dash-btn dash-btn-ghost dash-btn-sm" onClick={() => handleCopy(p.prompt_text)} title="Copy">Copy</button>
                        <button className="dash-btn dash-btn-ghost dash-btn-sm" onClick={() => loadIntoInputs(p)} title="Load">Load</button>
                        <button className="dash-btn dash-btn-danger dash-btn-sm" onClick={() => handleDeletePrompt(p.id)} title="Delete">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="dash-toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`dash-toast ${t.type}`}>{t.message}</div>
        ))}
      </div>
    </>
  );
}
