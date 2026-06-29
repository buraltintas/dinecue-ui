import { apiFetch } from "./http";
import type { SupportedLanguage, UserDto } from "@/lib/types";

export function startEmailLogin(input: { email: string; preferredLanguage: SupportedLanguage }) {
  return apiFetch<{ message: string; devOtp?: string | null }>("/api/auth/email/start", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function verifyEmailLogin(input: { email: string; code: string; preferredLanguage: SupportedLanguage }) {
  return apiFetch<{ user: UserDto; isNewUser: boolean; onboardingCompleted: boolean }>("/api/auth/email/verify", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function logout() {
  return apiFetch<{ ok: true }>("/api/auth/logout", { method: "POST" });
}

export function getMe() {
  return apiFetch<UserDto>("/api/me");
}
