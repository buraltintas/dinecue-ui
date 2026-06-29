import { cookies } from "next/headers";
import "server-only";

const accessCookie = "dinecue_access";
const refreshCookie = "dinecue_refresh";
const isProduction = process.env.NODE_ENV === "production";

const baseCookie = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: isProduction,
  path: "/"
};

export function setAuthCookies(accessToken: string, refreshToken: string) {
  const jar = cookies();
  jar.set(accessCookie, accessToken, { ...baseCookie, maxAge: 60 * 30 });
  jar.set(refreshCookie, refreshToken, { ...baseCookie, maxAge: 60 * 60 * 24 * 30 });
}

export function clearAuthCookies() {
  const jar = cookies();
  jar.set(accessCookie, "", { ...baseCookie, maxAge: 0 });
  jar.set(refreshCookie, "", { ...baseCookie, maxAge: 0 });
}

export function getAccessToken() {
  return cookies().get(accessCookie)?.value;
}

export function getRefreshToken() {
  return cookies().get(refreshCookie)?.value;
}
