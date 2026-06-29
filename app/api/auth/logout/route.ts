import { backendRequest, errorResponse, jsonResponse } from "@/lib/server/backendClient";
import { clearAuthCookies, getRefreshToken } from "@/lib/server/authCookies";

export async function POST() {
  try {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      await backendRequest("/auth/logout", {
        method: "POST",
        auth: true,
        retryOnUnauthorized: false,
        body: { refreshToken }
      }).catch(() => null);
    }
    clearAuthCookies();
    return jsonResponse({ ok: true });
  } catch (error) {
    clearAuthCookies();
    return errorResponse(error);
  }
}
