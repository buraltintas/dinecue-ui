import { NextResponse } from "next/server";
import "server-only";
import { clearAuthCookies, getAccessToken, getRefreshToken, setAuthCookies } from "./authCookies";

type BackendRequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
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

function backendUrl(path: string) {
  return new URL(path, backendBaseUrl).toString();
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

async function parseJson(response: Response) {
  if (response.status === 204) return null;
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
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
  const token = options.auth ? getAccessToken() : undefined;
  const headers: HeadersInit = {
    Accept: "application/json"
  };

  if (options.body !== undefined) headers["Content-Type"] = "application/json";
  if (options.auth && token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(backendUrl(path), {
    method: options.method || "GET",
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    cache: "no-store"
  });

  if (response.status === 401 && options.auth && options.retryOnUnauthorized !== false) {
    const refreshed = await refreshAccessToken();
    if (refreshed) return backendRequest<T>(path, { ...options, retryOnUnauthorized: false });
  }

  const body = await parseJson(response);
  if (!response.ok) {
    throw new Response(JSON.stringify(sanitizeError(response.status, body)), {
      status: sanitizeStatus(response.status),
      headers: { "Content-Type": "application/json" }
    });
  }

  return body as T;
}

export function jsonResponse<T>(body: T, init?: ResponseInit) {
  return NextResponse.json(body, init);
}

export function errorResponse(error: unknown) {
  if (error instanceof Response) return error;
  return NextResponse.json(
    { error: { code: "backend_unavailable", message: "DineCue is temporarily unavailable. Please try again." } },
    { status: 502 }
  );
}
