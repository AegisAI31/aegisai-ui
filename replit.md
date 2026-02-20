# AegisAI UI

## Overview
AegisAI is a Next.js 16 frontend application for enterprise AI governance. It provides a landing page, authentication (login/signup), and a dashboard for managing API keys and AI governance features.

## Project Architecture
- **Framework**: Next.js 16.1.6 with App Router (Turbopack)
- **Language**: TypeScript
- **Runtime**: Node.js 22
- **Port**: 5000 (dev and production)
- **Database**: PostgreSQL (Replit built-in)

### Directory Structure
- `app/` - Next.js App Router pages and API routes
  - `app/api/auth/` - Auth API routes (signup, login, me, logout)
  - `app/api/api-keys/` - API key management routes
  - `app/api/trust/` - Trust evaluation routes
- `components/` - Reusable React components (auth forms, dashboard, footer, etc.)
- `lib/` - Shared utilities (config, HTTP client, database, auth)
- `public/` - Static assets (images)

### Authentication
- Self-contained auth using PostgreSQL, bcrypt, and JWT (jose library)
- Session stored as httpOnly cookie (`aegis_session`)
- JWT_SECRET environment variable for token signing

### Key Libraries
- `bcryptjs` - Password hashing
- `jose` - JWT signing/verification
- `pg` - PostgreSQL client

### Design System
- **Landing page**: Dark theme (RunPod-inspired), deep navy background (#0b0e14), purple accent (#7c5cfc), clean card-based layout
- **Dashboard**: Light theme (white/gray/indigo), left sidebar navigation, completely separate from landing page
- **Auth pages**: Centered card on dark background, minimal and clean
- **Fonts**: Sora (display), Space Grotesk (body)

## Recent Changes
- 2026-02-20: Redesigned landing page with RunPod-inspired clean dark theme (hero, trust bar, stats, pillars, features, CTA)
- 2026-02-20: Redesigned auth pages (login/signup) with centered card design
- 2026-02-20: Updated footer with cleaner grid layout
- 2026-02-20: Configured for Replit environment (port 5000, allowed dev origins, Node.js 22)
- 2026-02-20: Replaced external auth service with self-contained PostgreSQL-backed auth system
- 2026-02-20: Created local API routes for signup, login, logout, me, API keys, and trust evaluation
