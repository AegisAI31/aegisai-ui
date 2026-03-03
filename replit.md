# AegisAI UI

## Overview
AegisAI is a Next.js 16 frontend application for enterprise AI governance. It provides a landing page, authentication (login/signup), and a comprehensive "Control Plane" dashboard for managing API keys, trust evaluation, prompt generation, SDK documentation, and audit trails.

## Project Architecture
- **Framework**: Next.js 16.1.6 with App Router (Turbopack)
- **Language**: TypeScript
- **Runtime**: Node.js 22
- **Port**: 5000 (dev and production)
- **Database**: PostgreSQL (Replit built-in)

### Directory Structure
- `app/` - Next.js App Router pages and API routes
  - `app/api/auth/` - Auth API routes (signup, login, me, logout, Google/GitHub OAuth)
  - `app/api/api-keys/` - API key management routes
  - `app/api/trust/` - Trust evaluation routes
  - `app/dashboard/` - Dashboard pages (overview, evaluate, api-keys, prompt-generator, sdk, audit-trails, profile)
- `components/` - Reusable React components (auth forms, dashboard, footer, etc.)
- `lib/` - Shared utilities (config, HTTP client, database, auth, oauth)
- `mock/` - Mock data layer with typed TypeScript objects
  - `mock/types.ts` - All TypeScript interfaces
  - `mock/stats.ts` - KPI data, time series, enforcement outcomes, violation categories
  - `mock/audit-trails.ts` - 30+ mock request records with full detail
  - `mock/prompts.ts` - Prompt template generation + saved library
  - `mock/sdk.ts` - SDK versions, changelog, code examples, FAQs
  - `mock/policies.ts` - Policy list with versions and statuses
  - `mock/settings.ts` - Settings page mock data (account, API keys, notifications, security, billing, developer)
- `components/settings/` - Settings tab components (account-tab, api-keys-tab, policies-tab, notifications-tab, security-tab, billing-tab, developer-tab)
- `public/` - Static assets (images, logo SVGs)

### Dashboard Pages
1. **Dashboard (Overview)** - KPI tiles, Recharts line/bar/donut charts, recent activity table, system health sidebar, request details modal
2. **Trust Evaluation** - Real-time AI trust scoring against 5 pillars
3. **API Keys** - Generate, manage, revoke API keys
4. **Prompt Generator** - Generate policy-bound prompt templates with inputs panel, tabs (Strict/Balanced/Adaptive), prompt library
5. **SDK** - Full documentation page with installation, quickstart, auth, best practices, FAQ, download modal
6. **Audit Trails** - Searchable/filterable audit table with pagination, details drawer, CSV export
7. **Settings** - Comprehensive 7-tab settings page (Account, API Keys, Policies, Notifications, Security, Billing, Developer) with search, modals, toasts

### Authentication
- Self-contained auth using PostgreSQL, bcrypt, and JWT (jose library)
- Google OAuth SSO ("Continue with Google") with CSRF state protection
- GitHub OAuth SSO ready (needs GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET)
- Session stored as httpOnly cookie (`aegis_session`)
- JWT_SECRET environment variable for token signing
- OAuth users stored with provider, oauth_id, display_name, avatar_url
- DB schema supports both password-based and OAuth-only accounts

### Key Libraries
- `bcryptjs` - Password hashing
- `jose` - JWT signing/verification
- `pg` - PostgreSQL client
- `recharts` - Dashboard charts (line, bar, donut)

### Design System
- **Landing page**: Dark theme (RunPod-inspired), deep navy background (#0b0e14), purple accent (#7c5cfc), clean card-based layout
- **Dashboard**: Light theme (white/gray/indigo), left sidebar navigation with collapsible sidebar, completely separate from landing page
- **Auth pages**: Centered card on dark background, minimal and clean
- **Fonts**: Sora (display), Space Grotesk (body)
- **Dashboard CSS**: All dashboard styles use `--d-` prefixed CSS variables and `.dash-` prefixed class names to prevent global style bleeding

### Mock Data Layer
All dashboard pages use client-side mock data from the `mock/` folder. Data is structured with TypeScript interfaces so it can be replaced with real API calls later. Each mock file exports typed constants and helper functions.

## Recent Changes
- 2026-03-03: Built enterprise-grade Settings page with 7 tabs, search filtering, modals, toasts, and comprehensive mock data
- 2026-03-03: Built comprehensive dashboard with 4 new pages (Dashboard overview with charts, Prompt Generator, SDK docs, Audit Trails)
- 2026-03-03: Created mock data layer with typed TypeScript objects for all dashboard data
- 2026-03-03: Added Recharts for dashboard visualizations (line, stacked bar, donut charts)
- 2026-03-03: Updated sidebar navigation with new pages and section dividers
- 2026-03-03: Extended dashboard CSS with 30+ new component styles (modals, drawers, toasts, code blocks, tabs, toggles, etc.)
- 2026-02-26: Added Google OAuth SSO with CSRF protection (button temporarily hidden pending Google Cloud Console config)
- 2026-02-20: Redesigned landing page with RunPod-inspired clean dark theme
- 2026-02-20: Self-contained PostgreSQL-backed auth system
