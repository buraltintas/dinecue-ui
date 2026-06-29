"use client";

import { ReactNode } from "react";
import { QueryProvider } from "./query-provider";
import { I18nProvider } from "./i18n-provider";
import type { SupportedLanguage } from "@/lib/types";

export function AppProviders({
  children,
  initialLanguage,
  hasLanguageCookie
}: {
  children: ReactNode;
  initialLanguage: SupportedLanguage;
  hasLanguageCookie: boolean;
}) {
  return (
    <QueryProvider>
      <I18nProvider initialLanguage={initialLanguage} hasLanguageCookie={hasLanguageCookie}>
        {children}
      </I18nProvider>
    </QueryProvider>
  );
}
