import { NextResponse } from "next/server";
import "server-only";
import { clearAuthCookies, getAccessToken, getRefreshToken, setAuthCookies } from "./authCookies";

type BackendRequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  /** Multipart payload, used for menu photo uploads. Mutually exclusive with `body`. */
  formData?: FormData;
  auth?: boolean;
  retryOnUnauthorized?: boolean;
};

type BackendLoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: unknown;
  isNewUser: boolean;
  onboardingCompleted: boolean;
};

const backendBaseUrl = process.env.DINECUE_API_BASE_URL || "http://localhost:5000";
const textPreviewLength = 500;

function backendUrl(path: string) {
  return new URL(path, backendBaseUrl).toString();
}

function safeBackendUrlParts(url: string) {
  const parsed = new URL(url);
  return {
    hostname: parsed.hostname,
    pathname: parsed.pathname
  };
}

function sanitizeStatus(status: number) {
  if ([400, 401, 403, 404, 409, 422, 429].includes(status)) return status;
  return status >= 500 ? 502 : status;
}

function sanitizeError(status: number, body: unknown) {
  const fallback = {
    code: status === 401 ? "unauthorized" : status === 429 ? "rate_limited" : "request_failed",
    message:
      status === 401
        ? "Please sign in again."
        : status === 429
          ? "Too many requests. Please wait a moment and try again."
          : "The request could not be completed."
  };

  if (body && typeof body === "object" && "error" in body) {
    const error = (body as { error?: { code?: unknown; message?: unknown } }).error;
    if (typeof error?.code === "string" && typeof error.message === "string") {
      return { error: { code: error.code, message: error.message } };
    }
  }
  return { error: fallback };
}

async function parseResponseBody(response: Response): Promise<{ json: unknown | null; textPreview: string | null }> {
  if (response.status === 204) return { json: null, textPreview: null };
  const text = await response.text();
  if (!text) return { json: null, textPreview: null };
  try {
    return { json: JSON.parse(text) as unknown, textPreview: null };
  } catch {
    return { json: null, textPreview: text.slice(0, textPreviewLength) };
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function redactSensitive(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redactSensitive);
  if (!isRecord(value)) return value;

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => {
      const normalized = key.toLowerCase();
      if (normalized.includes("token") || normalized.includes("cookie") || normalized.includes("authorization") || normalized.includes("password")) {
        return [key, "[redacted]"];
      }
      return [key, redactSensitive(item)];
    })
  );
}

export function summarizeRequestBodyForDiagnostics(body: unknown) {
  if (!isRecord(body)) return body === undefined ? { hasBody: false } : { hasBody: true, bodyType: typeof body };

  const location = isRecord(body.location) ? body.location : null;
  const context = isRecord(body.context) ? body.context : null;
  const rawText = typeof body.rawText === "string" ? body.rawText : null;
  const selectedCues = Array.isArray(body.selectedCues) ? body.selectedCues.filter((cue): cue is string => typeof cue === "string") : undefined;
  const lat = location && typeof location.lat === "number" ? location.lat : null;
  const lng = location && typeof location.lng === "number" ? location.lng : null;

  return {
    hasBody: true,
    bodyKeys: Object.keys(body),
    rawText: rawText
      ? {
          length: rawText.length,
          preview: rawText.slice(0, 80)
        }
      : undefined,
    language: typeof body.language === "string" ? body.language : undefined,
    selectedCues,
    location: location
      ? {
          mode: typeof location.mode === "string" ? location.mode : undefined,
          hasCoordinates: typeof lat === "number" && typeof lng === "number"
        }
      : undefined,
    context: context
      ? {
          keys: Object.keys(context),
          partySize: typeof context.partySize === "number" ? context.partySize : undefined,
          withKids: typeof context.withKids === "boolean" ? context.withKids : undefined,
          mealMoment: typeof context.mealMoment === "string" ? context.mealMoment : undefined
        }
      : undefined
  };
}

function logBackendFailure({
  path,
  method,
  url,
  status,
  responseBody,
  requestBody
}: {
  path: string;
  method: string;
  url: string;
  status: number;
  responseBody: { json: unknown | null; textPreview: string | null };
  requestBody: unknown;
}) {
  console.error("BFF backend request failed", {
    path,
    method,
    status,
    backend: safeBackendUrlParts(url),
    backendResponseBody: {
      json: redactSensitive(responseBody.json),
      textPreview: responseBody.textPreview
    },
    requestBody: summarizeRequestBodyForDiagnostics(requestBody)
  });
}

export async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  const response = await fetch(backendUrl("/auth/refresh"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
    cache: "no-store"
  });

  if (!response.ok) {
    clearAuthCookies();
    return false;
  }

  const body = (await response.json()) as BackendLoginResponse;
  setAuthCookies(body.accessToken, body.refreshToken);
  return true;
}

export async function backendRequest<T>(path: string, options: BackendRequestOptions = {}): Promise<T> {
  const method = options.method || "GET";
  const url = backendUrl(path);
  const response = await sendToBackend(path, url, method, options);

  if (response.status === 401 && options.auth && options.retryOnUnauthorized !== false) {
    const refreshed = await refreshAccessToken();
    if (refreshed) return backendRequest<T>(path, { ...options, retryOnUnauthorized: false });
  }

  const parsedBody = await parseResponseBody(response);
  if (!response.ok) {
    logBackendFailure({
      path,
      method,
      url,
      status: response.status,
      responseBody: parsedBody,
      requestBody: options.body
    });
    throw new Response(JSON.stringify(sanitizeError(response.status, parsedBody.json)), {
      status: sanitizeStatus(response.status),
      headers: { "Content-Type": "application/json" }
    });
  }

  return parsedBody.json as T;
}

/**
 * Streams a binary response (a stored menu photo) straight through to the browser. The backend keeps its
 * bucket private and checks ownership, so this proxy is the only way an image is ever readable, and no
 * storage URL is exposed to the client.
 */
export async function backendStream(path: string, options: BackendRequestOptions = {}): Promise<Response> {
  const method = options.method || "GET";
  const url = backendUrl(path);
  const response = await sendToBackend(path, url, method, options);

  if (response.status === 401 && options.auth && options.retryOnUnauthorized !== false) {
    const refreshed = await refreshAccessToken();
    if (refreshed) return backendStream(path, { ...options, retryOnUnauthorized: false });
  }

  if (!response.ok || !response.body) {
    const parsedBody = await parseResponseBody(response);
    logBackendFailure({ path, method, url, status: response.status, responseBody: parsedBody, requestBody: undefined });
    throw new Response(JSON.stringify(sanitizeError(response.status, parsedBody.json)), {
      status: sanitizeStatus(response.status),
      headers: { "Content-Type": "application/json" }
    });
  }

  return new Response(response.body, {
    status: 200,
    headers: {
      "Content-Type": response.headers.get("content-type") || "application/octet-stream",
      // The diner's own photo: cacheable in their browser, never in a shared cache.
      "Cache-Control": "private, max-age=3600",
      "Content-Disposition": "inline"
    }
  });
}

function sendToBackend(path: string, url: string, method: string, options: BackendRequestOptions) {
  const token = options.auth ? getAccessToken() : undefined;
  const headers: HeadersInit = {};

  // Multipart bodies must keep the boundary fetch generates, so Content-Type is left unset for them.
  if (options.formData === undefined) headers.Accept = "application/json";
  if (options.body !== undefined) headers["Content-Type"] = "application/json";
  if (options.auth && token) headers.Authorization = `Bearer ${token}`;

  return fetch(url, {
    method,
    headers,
    body: options.formData ?? (options.body === undefined ? undefined : JSON.stringify(options.body)),
    cache: "no-store"
  });
}

export function jsonResponse<T>(body: T, init?: ResponseInit) {
  return NextResponse.json(body, init);
}

export function errorResponse(error: unknown) {
  if (error instanceof Response) return error;
  return NextResponse.json(
    { error: { code: "backend_unavailable", message: "dinecue is temporarily unavailable. Please try again." } },
    { status: 502 }
  );
}
