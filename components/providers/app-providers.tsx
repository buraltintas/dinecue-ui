"use client";

import { ReactNode } from "react";
import { QueryProvider } from "./query-provider";
import { I18nProvider } from "./i18n-provider";
import { SessionHintProvider } from "./session-hint-provider";
import type { SupportedLanguage } from "@/lib/types";

export function AppProviders({
  children,
  initialLanguage,
  hasLanguageCookie,
  initialHasAuthSession
}: {
  children: ReactNode;
  initialLanguage: SupportedLanguage;
  hasLanguageCookie: boolean;
  initialHasAuthSession: boolean;
}) {
  return (
    <QueryProvider>
      <SessionHintProvider initialHasAuthSession={initialHasAuthSession}>
        <I18nProvider initialLanguage={initialLanguage} hasLanguageCookie={hasLanguageCookie}>
          {children}
        </I18nProvider>
      </SessionHintProvider>
    </QueryProvider>
  );
}
