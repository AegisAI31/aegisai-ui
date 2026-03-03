"use client";

import { useState } from "react";
import { generatePromptTemplates, savedPrompts as initialSavedPrompts } from "../../../mock/prompts";
import type { PromptTemplate, SavedPrompt } from "../../../mock/types";

export default function PromptGeneratorPage() {
  const [keywords, setKeywords] = useState("");
  const [industry, setIndustry] = useState("SaaS Support");
  const [strictness, setStrictness] = useState(3);
  const [region, setRegion] = useState("US");
  const [addDisclaimers, setAddDisclaimers] = useState(false);
  const [allowRewrite, setAllowRewrite] = useState(true);
  const [escalateToHuman, setEscalateToHuman] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [activeTab, setActiveTab] = useState<"Strict" | "Balanced" | "Adaptive">("Strict");
  const [savedPromptsList, setSavedPromptsList] = useState<SavedPrompt[]>(initialSavedPrompts);

  const [toasts, setToasts] = useState<{ id: number; message: string; type: string }[]>([]);
  let toastCounter = 0;

  function showToast(message: string, type: string = "success") {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  }

  function handleGenerate() {
    if (!keywords.trim()) return;
    const result = generatePromptTemplates(
      keywords,
      industry,
      strictness,
      region,
      addDisclaimers,
      allowRewrite,
      escalateToHuman
    );
    setTemplates(result);
    setActiveTab("Strict");
    showToast("Prompt templates generated", "success");
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      showToast("Copied to clipboard", "info");
    });
  }

  function handleSavePrompt() {
    if (!keywords.trim()) return;
    const newPrompt: SavedPrompt = {
      id: `sp_${String(savedPromptsList.length + 1).padStart(3, "0")}`,
      name: `${industry} - ${activeTab} (${keywords.split(",")[0].trim()})`,
      createdAt: new Date().toISOString(),
      policyMode: activeTab,
      keywords,
      industry,
      strictness,
      region,
    };
    setSavedPromptsList((prev) => [newPrompt, ...prev]);
    showToast("Prompt saved to library", "success");
  }

  function handleDeletePrompt(id: string) {
    setSavedPromptsList((prev) => prev.filter((p) => p.id !== id));
    showToast("Prompt deleted", "info");
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file.name);
      showToast(`Policy document "${file.name}" attached`, "success");
    }
  }

  const activeTemplate = templates.find((t) => t.mode === activeTab);

  return (
    <>
      <div className="dash-page-header">
        <div className="dash-page-header-left">
          <h1 className="dash-page-title">Prompt Generator</h1>
          <p className="dash-page-desc">
            Generate safety-tuned system prompts based on your industry, policies, and compliance requirements.
          </p>
        </div>
      </div>

      <div className="dash-two-panel">
        <div className="dash-two-panel-left">
          <div className="dash-card">
            <div className="dash-card-header">
              <h3 className="dash-card-title">Inputs</h3>
            </div>

            <div className="dash-form-group">
              <label className="dash-label">Keywords *</label>
              <textarea
                className="dash-input dash-textarea"
                placeholder="e.g. financial advice, transactions, regulatory compliance"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
            </div>

            <div className="dash-form-row">
              <div className="dash-form-group">
                <label className="dash-label">Industry</label>
                <select
                  className="dash-input"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                >
                  <option>SaaS Support</option>
                  <option>Marketplace</option>
                  <option>FinTech</option>
                  <option>Healthcare-lite</option>
                  <option>Education</option>
                </select>
              </div>
              <div className="dash-form-group">
                <label className="dash-label">Region</label>
                <select
                  className="dash-input"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                >
                  <option value="US">US</option>
                  <option value="EU">EU</option>
                  <option value="CA">CA</option>
                  <option value="Global">Global</option>
                </select>
              </div>
            </div>

            <div className="dash-form-group">
              <label className="dash-label">Strictness Level</label>
              <div className="dash-slider">
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={strictness}
                  onChange={(e) => setStrictness(Number(e.target.value))}
                />
                <div className="dash-slider-labels">
                  <span>1 - Lenient</span>
                  <span>3 - Moderate</span>
                  <span>5 - Maximum</span>
                </div>
                <div className="dash-slider-value">Level {strictness}</div>
              </div>
            </div>

            <div className="dash-form-group">
              <label className="dash-label" style={{ marginBottom: "0.65rem" }}>Options</label>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                <label className="dash-toggle">
                  <input
                    type="checkbox"
                    checked={addDisclaimers}
                    onChange={(e) => setAddDisclaimers(e.target.checked)}
                  />
                  <span className="dash-toggle-track" />
                  <span className="dash-toggle-label">Add disclaimers</span>
                </label>
                <label className="dash-toggle">
                  <input
                    type="checkbox"
                    checked={allowRewrite}
                    onChange={(e) => setAllowRewrite(e.target.checked)}
                  />
                  <span className="dash-toggle-track" />
                  <span className="dash-toggle-label">Allow rewrite on violation</span>
                </label>
                <label className="dash-toggle">
                  <input
                    type="checkbox"
                    checked={escalateToHuman}
                    onChange={(e) => setEscalateToHuman(e.target.checked)}
                  />
                  <span className="dash-toggle-track" />
                  <span className="dash-toggle-label">Escalate to human</span>
                </label>
              </div>
            </div>

            <div className="dash-form-group">
              <label className="dash-label">Policy Document</label>
              <label className={`dash-upload-btn${uploadedFile ? " has-file" : ""}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                {uploadedFile || "Upload policy document"}
                <input type="file" onChange={handleFileUpload} />
              </label>
            </div>

            <button
              className="dash-btn dash-btn-primary"
              style={{ width: "100%", marginTop: "0.5rem" }}
              onClick={handleGenerate}
              disabled={!keywords.trim()}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              Generate Prompts
            </button>
          </div>
        </div>

        <div className="dash-two-panel-right">
          <div className="dash-card">
            <div className="dash-card-header">
              <h3 className="dash-card-title">Generated Prompt Templates</h3>
            </div>

            {templates.length === 0 ? (
              <div className="dash-empty">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                <p>Fill in your inputs and click Generate to create prompt templates.</p>
              </div>
            ) : (
              <>
                <div className="dash-tabs">
                  {(["Strict", "Balanced", "Adaptive"] as const).map((tab) => (
                    <button
                      key={tab}
                      className={`dash-tab${activeTab === tab ? " active" : ""}`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {activeTemplate && (
                  <div>
                    <div style={{ marginBottom: "1rem" }}>
                      <label className="dash-label" style={{ marginBottom: "0.5rem" }}>System Prompt</label>
                      <div className="dash-code-block">
                        <div className="dash-code-header">
                          <span className="dash-code-lang">system prompt</span>
                          <button
                            className="dash-code-copy"
                            onClick={() => handleCopy(activeTemplate.systemPrompt)}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                            Copy
                          </button>
                        </div>
                        <div className="dash-code-body">
                          <pre><code>{activeTemplate.systemPrompt}</code></pre>
                        </div>
                      </div>
                    </div>

                    <div style={{ marginBottom: "1rem" }}>
                      <label className="dash-label" style={{ marginBottom: "0.5rem" }}>JSON Config</label>
                      <div className="dash-code-block">
                        <div className="dash-code-header">
                          <span className="dash-code-lang">json</span>
                          <button
                            className="dash-code-copy"
                            onClick={() => handleCopy(JSON.stringify(activeTemplate.jsonConfig, null, 2))}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                            Copy
                          </button>
                        </div>
                        <div className="dash-code-body">
                          <pre><code>{JSON.stringify(activeTemplate.jsonConfig, null, 2)}</code></pre>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "0.75rem" }}>
                      <button
                        className="dash-btn dash-btn-primary"
                        onClick={handleSavePrompt}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                          <polyline points="17 21 17 13 7 13 7 21" />
                          <polyline points="7 3 7 8 15 8" />
                        </svg>
                        Use this prompt
                      </button>
                      <button
                        className="dash-btn dash-btn-ghost"
                        onClick={() => handleCopy(activeTemplate.systemPrompt + "\n\n" + JSON.stringify(activeTemplate.jsonConfig, null, 2))}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                        Copy All
                      </button>
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
          <span className="dash-badge dash-badge-accent">{savedPromptsList.length} saved</span>
        </div>

        {savedPromptsList.length === 0 ? (
          <div className="dash-empty">
            <p>No saved prompts yet. Generate and save prompts to build your library.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Created</th>
                  <th>Policy Mode</th>
                  <th>Industry</th>
                  <th>Region</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {savedPromptsList.map((prompt) => (
                  <tr key={prompt.id}>
                    <td style={{ fontWeight: 600 }}>{prompt.name}</td>
                    <td>{new Date(prompt.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                    <td>
                      <span className={`dash-badge ${prompt.policyMode === "Strict" ? "dash-badge-error" : prompt.policyMode === "Balanced" ? "dash-badge-accent" : "dash-badge-success"}`}>
                        {prompt.policyMode}
                      </span>
                    </td>
                    <td>{prompt.industry}</td>
                    <td>{prompt.region}</td>
                    <td>
                      <div style={{ display: "flex", gap: "0.35rem" }}>
                        <button
                          className="dash-btn dash-btn-ghost dash-btn-sm"
                          onClick={() => handleCopy(`${prompt.name}: ${prompt.keywords}`)}
                          title="Copy"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                        </button>
                        <button
                          className="dash-btn dash-btn-ghost dash-btn-sm"
                          onClick={() => {
                            setKeywords(prompt.keywords);
                            setIndustry(prompt.industry);
                            setStrictness(prompt.strictness);
                            setRegion(prompt.region);
                            showToast("Prompt loaded into inputs", "info");
                          }}
                          title="Edit"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          className="dash-btn dash-btn-danger dash-btn-sm"
                          onClick={() => handleDeletePrompt(prompt.id)}
                          title="Delete"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
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
        {toasts.map((toast) => (
          <div key={toast.id} className={`dash-toast ${toast.type}`}>
            {toast.type === "success" && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
            {toast.type === "info" && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            )}
            {toast.message}
          </div>
        ))}
      </div>
    </>
  );
}