export interface KPI {
  label: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: string;
}

export interface TimeSeriesPoint {
  date: string;
  requests: number;
  approved: number;
  blocked: number;
  escalated: number;
  rewritten: number;
}

export interface EnforcementOutcome {
  date: string;
  allow: number;
  block: number;
  rewrite: number;
  escalate: number;
}

export interface ViolationCategory {
  name: string;
  value: number;
  color: string;
}

export interface AuditRecord {
  requestId: string;
  timestamp: string;
  apiKey: string;
  endpoint: string;
  policy: string;
  policyId: string;
  status: "Approved" | "Blocked" | "Escalated";
  riskScore: number;
  reportId: string;
  model: string;
  provider: string;
  latencyMs: number;
  inputTokens: number;
  outputTokens: number;
  violations: Violation[];
  enforcementAction: string;
  inputPayload: string;
  outputPayload: string;
  metadata: Record<string, string>;
}

export interface Violation {
  category: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  confidence: number;
}

export interface PromptTemplate {
  mode: "Strict" | "Balanced" | "Adaptive";
  systemPrompt: string;
  jsonConfig: Record<string, unknown>;
}

export interface SavedPrompt {
  id: string;
  name: string;
  createdAt: string;
  policyMode: "Strict" | "Balanced" | "Adaptive";
  keywords: string;
  industry: string;
  strictness: number;
  region: string;
}

export interface SDKVersion {
  language: "Python" | "Node";
  version: string;
  releasedAt: string;
  changelog: ChangelogEntry[];
  installCommand: string;
  packageName: string;
}

export interface ChangelogEntry {
  version: string;
  date: string;
  changes: string[];
}

export interface CodeExample {
  title: string;
  description: string;
  python: string;
  node: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Policy {
  id: string;
  name: string;
  version: string;
  description: string;
  status: "active" | "draft" | "archived";
  createdAt: string;
  updatedAt: string;
  rules: number;
  category: string;
}

export interface SystemHealth {
  uptime: string;
  p95Latency: string;
  errorRate: string;
  trustEngineVersion: string;
  policyVersion: string;
}
