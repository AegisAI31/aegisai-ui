# AegisAI UI

## Overview
AegisAI is a Next.js 16 frontend application for enterprise AI governance. It provides a landing page, authentication (login/signup), and a dashboard for managing API keys and AI governance features.

## Project Architecture
- **Framework**: Next.js 16.1.6 with App Router (Turbopack)
- **Language**: TypeScript
- **Runtime**: Node.js 22
- **Port**: 5000 (dev and production)

### Directory Structure
- `app/` - Next.js App Router pages (layout, home, login, signup, dashboard)
- `components/` - Reusable React components (auth forms, dashboard, footer, etc.)
- `lib/` - Shared utilities (config, HTTP client)
- `public/` - Static assets (images)

### Backend APIs (External)
The app connects to external backend services configured via environment variables:
- `AEGIS_AUTH_API_URL` - Authentication API (default: http://localhost:8000)
- `AEGIS_CORE_API_URL` - Core API (default: http://localhost:8001)

## Recent Changes
- 2026-02-20: Configured for Replit environment (port 5000, allowed dev origins, Node.js 22)
