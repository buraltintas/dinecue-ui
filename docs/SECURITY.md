# DineCue UI Security

## Token Handling

Browser JavaScript must never receive, store, render, or log backend access or refresh tokens.

The BFF stores tokens in httpOnly cookies:

- `httpOnly`
- `SameSite=Lax`
- `Secure` in production
- `path=/`

Local development can use non-secure cookies because localhost often runs over HTTP.

## Development OTP Testing

Before a real email provider exists, the backend may return `devOtp` from the email OTP start endpoint in local development. The BFF may surface this code only when `NODE_ENV === "development"` so local login can be tested. Production must never expose OTP codes to browser JavaScript, logs, docs examples, screenshots, or UI.

## BFF Responsibilities

- Own the backend base URL server-side.
- Read token cookies server-side.
- Forward protected requests with `Authorization` headers.
- Attempt refresh when appropriate.
- Return sanitized JSON to the browser.
- Clear auth cookies on logout.
- Avoid logging tokens or provider details.

Security architecture terms can appear in docs and README, but visible product UI should use user-friendly privacy language instead of exposing implementation details.

## Forbidden Frontend Secrets

Do not expose:

- Google Places API key.
- OpenAI API key.
- JWT signing key.
- Database connection string.
- Backend base URL through public env if avoidable.
- Backend provider secrets.
- Access tokens.
- Refresh tokens.

Allowed public env:

- `NEXT_PUBLIC_SITE_URL`
- Harmless UI-only public config.

## Logging Rules

No token values, provider credentials, raw backend internal errors, or secrets in logs, README, screenshots, sample code, or UI.

## Provider Key Rules

The frontend never calls Google Places or OpenAI directly. Provider credentials belong in the backend only.

## Private App Indexing Rules

Authenticated app pages are `noindex`. Do not expose private user data to crawlers or structured data.
