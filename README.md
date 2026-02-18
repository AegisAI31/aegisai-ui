# AegisAI Frontend (`aegis-UI`)

Production-grade Next.js frontend server for:
- Landing page
- Login / Signup
- User dashboard
- API key management
- AI trust evaluation flow

## Architecture Fit

This UI is aligned to:
- `Documents/system design/system_design.jpg` flow
- `aegisai-auth` service APIs (`/auth/*`, `/api-keys`)
- `aegisai-core` trust orchestration API (`/trust/evaluate`)

## Stack

- Next.js (App Router) + TypeScript
- Server route handlers as backend proxy layer
- HttpOnly session cookie for auth token
- Responsive enterprise UI styling

## Quick Start

1. Install dependencies:
```bash
cd aegis-UI
npm install
```

2. Configure environment:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
AEGIS_AUTH_API_URL=http://localhost:8000
AEGIS_CORE_API_URL=http://localhost:8001
```

3. Run frontend:
```bash
npm run dev
```

Frontend will run at `http://localhost:3000`.

## Routes

- `/` landing page
- `/login` login page
- `/signup` signup page
- `/dashboard` authenticated dashboard

## Backend Dependencies

- Auth service expected at `AEGIS_AUTH_API_URL`
- Core trust service expected at `AEGIS_CORE_API_URL`

## Notes

- Dashboard calls frontend `/api/*` routes, which proxy to backend.
- Current JWT lifetime follows auth service default (60 minutes).
