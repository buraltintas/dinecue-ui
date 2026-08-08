"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { logout } from "@/lib/api/auth";
import { useSessionHint } from "@/components/providers/session-hint-provider";

/**
 * Signing out has to clear three things together: the httpOnly cookies (server side), the client's
 * session hint, and every cached query. Missing any one of them leaves the next visitor to this browser
 * looking at the previous diner's data, so the sequence lives in one place rather than at each call site.
 */
export function useSignOut() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setAuthSessionHint } = useSessionHint();
  const [signingOut, setSigningOut] = useState(false);

  async function signOut() {
    setSigningOut(true);
    // A failed request still signs the diner out locally: leaving them apparently logged in would be worse.
    await logout().catch(() => null);
    setAuthSessionHint(false);
    queryClient.clear();
    router.replace("/");
    router.refresh();
  }

  return { signOut, signingOut };
}
