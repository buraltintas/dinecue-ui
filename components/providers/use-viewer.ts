"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/lib/api/auth";
import { useSessionHint } from "@/components/providers/session-hint-provider";

/**
 * Shared "is anyone signed in" read for public surfaces. The header, hero and
 * closing call to action all need it; keeping one hook keeps them on one query
 * and one cache entry.
 */
export function useViewer() {
  const { hasAuthSessionHint, setAuthSessionHint } = useSessionHint();
  const me = useQuery({ queryKey: ["me"], queryFn: getMe, retry: false, enabled: hasAuthSessionHint });

  useEffect(() => {
    if (me.isError) setAuthSessionHint(false);
  }, [me.isError, setAuthSessionHint]);

  const isSignedIn = me.isSuccess && Boolean(me.data);
  // Without an auth cookie the query never runs and we know the answer at once.
  // The only uncertain window is while that cookie is being verified.
  const isResolving = hasAuthSessionHint && !me.isSuccess && !me.isError;

  return {
    isSignedIn,
    isResolving,
    email: me.data?.email,
    primaryHref: (isSignedIn ? "/app/find" : "/login") as "/app/find" | "/login"
  };
}
