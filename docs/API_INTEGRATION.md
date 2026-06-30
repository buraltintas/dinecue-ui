# DineCue API Integration

## BFF-First Architecture

Required flow:

Browser/client -> Next.js route handlers under `/api/...` -> DineCue backend API

Browser components must never call the ASP.NET backend, Google Places, OpenAI, or any provider API directly.

This is internal architecture. Do not describe it with technical terms in user-facing UI copy.

## Server-Only Backend URL

Use:

```env
DINECUE_API_BASE_URL=http://localhost:5000
```

Do not expose this through `NEXT_PUBLIC_API_BASE_URL`.

## Auth Flow

- Browser calls `POST /api/auth/email/start`.
- BFF calls backend `POST /auth/email/start`.
- Browser calls `POST /api/auth/email/verify`.
- BFF calls backend `POST /auth/email/verify`.
- Backend returns `accessToken`, `refreshToken`, user, and onboarding flags.
- BFF stores tokens in secure httpOnly cookies.
- BFF returns only sanitized user/onboarding data to the browser.

Refresh is integrated with backend `POST /auth/refresh`. Logout calls backend `POST /auth/logout` when a refresh token exists, then clears cookies.

## Protected Requests

For protected calls, the BFF reads the httpOnly access token server-side and forwards it as `Authorization: Bearer ...`. If a protected request returns 401, the BFF attempts refresh once and retries.

Profile updates should use backend-compatible stable values. The UI can display localized country names, but `/api/profile` must forward country codes such as `TR`, `DE`, `GB`, or `US`, not display labels.

## Recommendation Session Flow

- Browser calls `POST /api/recommendation-sessions`.
- BFF calls backend `POST /recommendation-sessions`.
- Backend returns `202 Accepted` with `sessionId`, `status`, and `statusUrl`.
- Browser navigates to `/app/recommendations/[sessionId]`.
- UI polls `GET /api/recommendation-sessions/[sessionId]`.
- BFF calls backend `GET /recommendation-sessions/{sessionId}`.
- Backend GET detail remains the source of truth.

If backend returns a stable `quota_exceeded` error while starting a recommendation session, the UI should show a natural monthly decision-limit message. Do not expose technical quota/request wording to users.

The current frontend does not invent remaining monthly decision counts. If a backend usage-status endpoint is added later, expose it through a same-origin BFF route and localize the remaining/reset copy.

## Polling Behavior

Polling is used while session status is queued or running. Polling stops when status is completed or failed.

## SignalR Decision

Backend SignalR exists at `/hubs/recommendations`, but this UI intentionally does not connect the browser directly to it. Direct browser-to-backend SignalR would violate the BFF/security requirement unless a safe Next.js realtime proxy is implemented. The GET endpoint remains the source of truth.

## Known Backend Endpoints Used By BFF

- `POST /auth/email/start`
- `POST /auth/email/verify`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /me`
- `GET/PUT /profile`
- `GET/PUT /taste-profile`
- `GET/PUT /dining-profile`
- `GET/POST /recommendation-sessions`
- `GET /recommendation-sessions/{id}`
- `GET /saved-places`
- `POST /recommendations/{id}/save`
- `POST /recommendations/{id}/share-text`

## Security Notes

The BFF sanitizes errors and must not leak tokens, provider details, backend internals, or secrets.
