"use client";

import { createContext, ReactNode, useContext, useMemo, useState } from "react";

type SessionHintContextValue = {
  hasAuthSessionHint: boolean;
  setAuthSessionHint: (value: boolean) => void;
};

const SessionHintContext = createContext<SessionHintContextValue | null>(null);

export function SessionHintProvider({
  children,
  initialHasAuthSession
}: {
  children: ReactNode;
  initialHasAuthSession: boolean;
}) {
  const [hasAuthSessionHint, setAuthSessionHint] = useState(initialHasAuthSession);
  const value = useMemo(() => ({ hasAuthSessionHint, setAuthSessionHint }), [hasAuthSessionHint]);

  return <SessionHintContext.Provider value={value}>{children}</SessionHintContext.Provider>;
}

export function useSessionHint() {
  const value = useContext(SessionHintContext);
  if (!value) throw new Error("useSessionHint must be used inside SessionHintProvider");
  return value;
}
