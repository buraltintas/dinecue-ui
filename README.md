# DineCue UI

Production-quality Next.js frontend for DineCue, a smart dining assistant that helps people decide where to eat by mood, location, preferences, and context.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- TanStack Query
- Zod
- BFF route handlers under `/api`

## Setup

Create `.env.local` from `.env.example`:

```env
DINECUE_API_BASE_URL=http://localhost:5000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Run locally:

```bash
npm install
npm run dev
```

The sibling backend project `../dinecue` must be running on the configured backend URL.

## BFF Architecture

The browser only calls same-origin Next.js routes such as `/api/auth/email/start`, `/api/me`, and `/api/recommendation-sessions`. Next.js route handlers call the DineCue backend API server-side.

The browser must not call the ASP.NET backend, Google Places, OpenAI, or provider APIs directly.

## Auth Flow

Email OTP login uses:

- Browser -> `POST /api/auth/email/start`
- BFF -> `POST /auth/email/start`
- Browser -> `POST /api/auth/email/verify`
- BFF -> `POST /auth/email/verify`

The BFF stores backend `accessToken` and `refreshToken` in httpOnly cookies and never returns token values to browser JavaScript.

## Recommendation Flow

- Browser posts to `/api/recommendation-sessions`.
- BFF posts to backend `/recommendation-sessions`.
- Backend returns `202 Accepted`.
- UI navigates to `/app/recommendations/[sessionId]`.
- UI polls `/api/recommendation-sessions/[sessionId]`.
- BFF reads backend `/recommendation-sessions/{sessionId}`.

The backend GET session detail endpoint is the source of truth.

## Polling and SignalR

Backend SignalR exists at `/hubs/recommendations`, but direct browser-to-backend SignalR is intentionally not used in this BFF-first version. Polling through the BFF is the reliable default until a safe realtime proxy exists.

## SEO

The public landing page uses App Router metadata, canonical URLs, Open Graph, Twitter metadata, sitemap, robots, semantic HTML, and safe JSON-LD. Authenticated app pages are `noindex`.

The landing page supports client-side language switching for `en`, `tr`, and `de` without locale-prefixed routes. The hero carousel uses fictional presentation-only examples, not real restaurant claims.

## Security

- No real secrets are committed.
- No provider keys are stored in frontend code.
- No `NEXT_PUBLIC_API_BASE_URL`.
- Tokens stay in httpOnly cookies.
- BFF errors are sanitized.
- Private app pages are not SEO landing pages.

## Documentation

See `docs/` for product, design, SEO, API integration, security, and i18n decisions.
