# Objective
Build a comprehensive, enterprise-grade Settings page for the AegisAI dashboard at /dashboard/profile. The page should have 7 tabs (Account, API Keys, Policies, Notifications, Security, Billing, Developer), a search bar to filter settings cards, toast notifications for actions, modals for destructive/creation actions, and fully populated mock data. Reuse all existing CSS patterns (dash-card, dash-tabs, dash-modal, dash-toggle, dash-badge, dash-toast, etc.). The existing route is /dashboard/profile and the nav item already points there.

# Tasks

### T001: Create Settings Mock Data
- **Blocked By**: []
- **Details**:
  - Create `mock/settings.ts` with comprehensive mock data
  - Add new interfaces to `mock/types.ts`: SettingsApiKey, PolicyVersion, NotificationSettings, SecuritySettings, BillingInfo, Invoice, WebhookEndpoint, DeveloperSettings
  - Mock data includes:
    - `settingsAccount`: { name: "Alex Morgan", email: "alex@acme-corp.com", role: "Admin", workspace: "Acme Corp", workspaces: ["Acme Corp", "Acme Labs", "Personal"] }
    - `settingsPreferences`: { timezone: "America/New_York", theme: "Dark", dashboardRange: "7d" }
    - `settingsApiKeys`: Array of 5 API keys with label, masked key (ak_****xxxx), created date, lastUsed date, status (Active/Disabled), environment (Production/Staging/Development), scopes array
    - `settingsPolicies`: Reuse existing policies from mock/policies.ts but add strictness (1-5), region, and policyVersions array (3-5 historical versions per policy with timestamp + change notes)
    - `settingsNotifications`: { emailHighRisk: true, weeklyReport: true, errorSpike: false, channels: { email: "alex@acme-corp.com", slackWebhook: "" }, frequency: "immediate" }
    - `settingsSecurity`: { mfaEnabled: false, activeSessions: 3, ipAllowlist: ["10.0.0.0/8", "192.168.1.0/24"], auditRetention: 90, reportRetention: 180, noStoreMode: false }
    - `settingsBilling`: { plan: "Growth", requestsThisMonth: 124500, quota: 250000, invoices: Array of 4 invoices with month, amount, status (Paid/Pending), downloadUrl }
    - `settingsDeveloper`: { webhooks: Array of 2 webhook endpoints with url, events, secretToken (masked), active status; envVars: Array of recommended env var names and values }
  - Files: `mock/types.ts`, `mock/settings.ts`
  - Acceptance: All types compile, exports are typed, data is realistic

### T002: Build Settings Page Shell with Search and Tabs + Add Settings CSS
- **Blocked By**: [T001]
- **Details**:
  - Replace `app/dashboard/profile/page.tsx` with comprehensive Settings page
  - Page header: "Settings" title + "Manage your AegisAI workspace, policies, and security" subtitle
  - Search bar: "Search settings..." input that filters cards across all tabs by matching card title/description text. Use a simple approach: each settings card has a data-search-terms attribute. The search filters by hiding cards whose text doesn't match.
  - Tabs row using dash-tabs CSS: Account | API Keys | Policies | Notifications | Security | Billing | Developer
  - Toast notification system (reuse dash-toast pattern): manages a list of toast messages with auto-dismiss after 3 seconds
  - Import and render tab components from `components/settings/` directory
  - Each tab component receives: searchQuery string, showToast function
  - Also add minimal settings-specific CSS to `app/dashboard/dashboard.css`:
    - `.dash-settings-search`: Search input with search icon styling, full width, margin bottom
    - `.dash-settings-grid`: CSS grid for settings cards, 1 column on mobile, responsive
    - `.dash-usage-bar`: Progress bar for billing usage (track + fill + label)
    - `.dash-ip-list`: List items with text + remove button
    - `.dash-scope-checks`: Inline checkbox group
    - `.dash-key-reveal`: Warning-style box for revealing API keys once
    - `.dash-version-timeline`: Timeline with dots and lines for policy version history
    - `.dash-settings-helper`: Muted helper/tip text
    - `.dash-mfa-status`: Inline status dot (green for enabled, gray for disabled)
    - `.dash-hidden`: display: none for search filtering
  - Files: `app/dashboard/profile/page.tsx`, `app/dashboard/dashboard.css`
  - Acceptance: Page renders with tabs, search filters content, tab switching works, CSS compiles

### T003: Build Account and Notifications Tab Components
- **Blocked By**: [T001]
- **Details**:
  - Create `components/settings/account-tab.tsx`:
    - Profile card with className "dash-card" and data-search-terms="profile name email role workspace":
      - Name: editable dash-input
      - Email: read-only dash-input (disabled)
      - Role: read-only dash-badge dash-badge-accent
      - Workspace: dash-select dropdown with 3 options
      - "Update profile" dash-btn dash-btn-primary with toast("Profile updated")
    - Preferences card with data-search-terms="preferences timezone theme dashboard range":
      - Timezone: dash-select with options America/New_York, America/Chicago, America/Los_Angeles, Europe/London, Asia/Tokyo
      - Theme: two buttons or dash-select (Dark / Auto)
      - Dashboard range: dash-select (7 days / 14 days / 30 days)
      - "Save preferences" dash-btn dash-btn-primary with toast("Preferences saved")
    - Props: { searchQuery: string, showToast: (msg: string) => void }
    - Component is "use client"
    - Import mock data from `../../mock/settings`
  - Create `components/settings/notifications-tab.tsx`:
    - Alert Preferences card with data-search-terms="notifications alerts email high risk weekly compliance error spike":
      - Three dash-toggle switches: "Email alerts for high-risk blocks", "Weekly compliance report", "Alert when error rate spikes"
    - Channels card with data-search-terms="channels email slack webhook":
      - Email input (dash-input, pre-filled)
      - Slack webhook URL input (dash-input, placeholder "https://hooks.slack.com/...") + "Test webhook" dash-btn dash-btn-sm with toast
    - Frequency card with data-search-terms="frequency immediate hourly daily digest":
      - dash-select: Immediate, Hourly digest, Daily digest
    - "Save notification settings" dash-btn dash-btn-primary with toast("Notification settings saved")
    - Props: { searchQuery: string, showToast: (msg: string) => void }
  - Files: `components/settings/account-tab.tsx`, `components/settings/notifications-tab.tsx`
  - Acceptance: Both tabs render with all form elements, actions trigger toasts, search filtering works

### T004: Build API Keys Tab Component
- **Blocked By**: [T001]
- **Details**:
  - Create `components/settings/api-keys-tab.tsx`:
    - "use client" component
    - Import settingsApiKeys from `../../mock/settings` and SettingsApiKey from `../../mock/types`
    - State: keys array (initialized from mock), showCreateModal, showRotateModal (with key id), showDeleteModal (with key id), newKeyRevealed (string | null)
    - Top section: "Create API Key" dash-btn dash-btn-primary button
    - Table with className "dash-table":
      - Header: Label, Key, Created, Last Used, Status, Actions
      - Rows: label text, masked key in monospace, formatted date, formatted date, status badge (Active=dash-badge-success, Disabled=dash-badge-warning), action buttons
      - Actions column: Copy button (copies masked key, toast "Key copied"), Rotate button (opens rotate modal), Enable/Disable toggle button, Delete button (dash-btn-danger dash-btn-sm, opens confirm modal)
    - Create API Key modal (dash-modal):
      - If newKeyRevealed is null: show form with Label input, Environment select (Development/Staging/Production), Scopes checkboxes (Analyze, Generate, Agent-Check, Reports), Rate limit select (Standard 1000/min, High 5000/min, Unlimited)
      - On create: generate a fake key like "ak_live_" + random 32 chars, set newKeyRevealed, add to keys array
      - If newKeyRevealed is set: show the key in a dash-key-reveal box with warning text "This key will only be shown once. Copy it now." + Copy button + Close button
    - Rotate Key modal (dash-modal): "Rotating this key will invalidate the old key immediately. A new key will be generated." + Rotate button that generates new key and shows it once
    - Delete confirm modal (dash-modal): "Are you sure you want to delete this API key? This action cannot be undone." + Cancel + Delete buttons
    - Helper card below table with data-search-terms="api key storage rotation best practices":
      - "How to store keys": "Set your API key as an environment variable: export AEGIS_API_KEY=ak_live_xxx"
      - "Key rotation": "Rotate keys every 90 days. Use the Rotate action to generate a new key without downtime."
    - Props: { searchQuery: string, showToast: (msg: string) => void }
  - Files: `components/settings/api-keys-tab.tsx`
  - Acceptance: Table renders, create/rotate/delete modals work, key is shown once with copy, toast notifications fire

### T005: Build Policies Tab Component
- **Blocked By**: [T001]
- **Details**:
  - Create `components/settings/policies-tab.tsx`:
    - "use client" component
    - Import policies from `../../mock/policies` and settingsPolicyExtras from `../../mock/settings`
    - State: selectedPolicy (for edit modal), showEditModal, showVersionsModal, policiesList (local copy for mutations)
    - Policy table with dash-table:
      - Columns: Name, Version, Strictness (show as filled dots or number/5), Region, Updated, Status badge, Actions
      - Status badges: active=dash-badge-success, draft=dash-badge-warning, archived=dash-badge-error
      - Actions: "Set Active" button (only for non-active), "Duplicate" button (toast "Policy duplicated"), "Edit" button (opens modal), "Versions" button (opens versions modal)
    - Edit Policy modal (dash-modal dash-modal-lg):
      - Name: dash-input
      - Strictness: dash-slider (range 1-5)
      - Region: dash-select (US, EU, CA, Global)
      - Enforcement toggles using dash-toggle: "Rewrite on violation", "Add disclaimers", "Escalate to human"
      - Threshold inputs: risk_block_threshold (dash-input type number, 0-100), hallucination_escalate_threshold (dash-input type number, 0-100)
      - Save + Cancel buttons in dash-modal-footer
    - Versions modal (dash-modal):
      - Title: "[Policy Name] — Version History"
      - List of 3-5 versions from settingsPolicyExtras with: version number (bold), date, change notes (list items)
      - Use dash-version-timeline CSS class
    - Props: { searchQuery: string, showToast: (msg: string) => void }
  - Files: `components/settings/policies-tab.tsx`
  - Acceptance: Policy table renders, edit modal has slider/toggles/thresholds, versions modal shows history

### T006: Build Security and Billing Tab Components
- **Blocked By**: [T001]
- **Details**:
  - Create `components/settings/security-tab.tsx`:
    - "use client" component, import settingsSecurity from `../../mock/settings`
    - MFA card (data-search-terms="mfa multi-factor authentication two-factor"):
      - Status: dash-mfa-status dot + "MFA is [Enabled/Disabled]"
      - Button: "Enable MFA" or "Disable MFA" (toggles state, toast)
    - Session Management card (data-search-terms="sessions sign out active"):
      - Text: "You have X active sessions"
      - "Sign out of all sessions" dash-btn dash-btn-danger opens confirm modal: "This will sign you out of all devices. You will need to sign in again." + Confirm + Cancel
    - IP Allowlist card (data-search-terms="ip allowlist whitelist range"):
      - List of IP ranges using dash-ip-list: each item shows IP + remove button (X)
      - Input + "Add" button to add new IP range (basic validation: non-empty)
    - Data Retention card (data-search-terms="data retention audit report no-store"):
      - Audit log retention: dash-select (30/90/180/365 days)
      - Report retention: dash-select (30/90/180/365 days)
      - "No-store mode" dash-toggle with helper text: "When enabled, only hashes and metrics are stored. Raw request/response data is discarded."
      - "Save retention settings" button with toast
    - Props: { searchQuery: string, showToast: (msg: string) => void }
  - Create `components/settings/billing-tab.tsx`:
    - "use client" component, import settingsBilling from `../../mock/settings`
    - Plan card (data-search-terms="plan billing usage quota upgrade"):
      - Plan name in dash-badge dash-badge-accent: "Growth"
      - Usage: dash-usage-bar showing 124,500 / 250,000 requests (49.8%)
      - "Upgrade plan" dash-btn dash-btn-primary (toast "Contact sales for enterprise pricing")
    - Invoice History table (data-search-terms="invoices payment history download"):
      - dash-table: Month, Amount, Status badge (Paid=success, Pending=warning), Download PDF button
    - Props: { searchQuery: string, showToast: (msg: string) => void }
  - Files: `components/settings/security-tab.tsx`, `components/settings/billing-tab.tsx`
  - Acceptance: All cards render, MFA toggle works, IP add/remove works, session confirm modal works, invoice table renders

### T007: Build Developer Tab Component
- **Blocked By**: [T001]
- **Details**:
  - Create `components/settings/developer-tab.tsx`:
    - "use client" component, import settingsDeveloper from `../../mock/settings`
    - SDK Quick Links card (data-search-terms="sdk install quickstart agent guard documentation"):
      - Three dash-btn buttons that link to /dashboard/sdk: "Installation Guide", "Quickstart", "Agent Guard"
      - Use Next.js Link component
    - Webhooks card (data-search-terms="webhooks events endpoint secret token"):
      - Table/list of webhook endpoints: URL, Events (each as dash-badge), Secret token (masked "whsec_****xxxx" with Copy button), Active status toggle
      - "Add webhook" dash-btn dash-btn-primary opens modal:
        - URL input (dash-input, placeholder "https://your-api.com/webhooks")
        - Event checkboxes (dash-scope-checks): request.blocked, request.escalated, policy.updated
        - "Create webhook" button (adds to list, toast "Webhook created")
    - Environment Variables card (data-search-terms="environment variables env api key base url policy"):
      - List of recommended env vars: AEGIS_API_KEY (Your API authentication key), AEGIS_BASE_URL (API base URL), AEGIS_POLICY_ID (Default policy ID), AEGIS_LOG_LEVEL (Logging verbosity)
      - Each shows name in monospace + description + Copy button that copies "export NAME=value"
    - Props: { searchQuery: string, showToast: (msg: string) => void }
  - Files: `components/settings/developer-tab.tsx`
  - Acceptance: SDK links work, webhook table renders with modal, env vars list with copy buttons
