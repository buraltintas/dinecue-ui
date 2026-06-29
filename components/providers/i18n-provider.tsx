"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getDictionary, languageCookieKey, languageStorageKey, resolveLanguagePriority, type Dictionary } from "@/lib/i18n";
import type { SupportedLanguage } from "@/lib/types";

type I18nContextValue = {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  applyAuthenticatedLanguage: (language?: SupportedLanguage | null) => void;
  lastChangeSource: "initial" | "local" | "account" | "manual";
  t: Dictionary;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function persistLanguage(language: SupportedLanguage) {
  window.localStorage.setItem(languageStorageKey, language);
  document.cookie = `${languageCookieKey}=${language}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

export function I18nProvider({
  children,
  initialLanguage,
  hasLanguageCookie
}: {
  children: ReactNode;
  initialLanguage: SupportedLanguage;
  hasLanguageCookie: boolean;
}) {
  const [language, setLanguageState] = useState<SupportedLanguage>(initialLanguage);
  const [ready, setReady] = useState(hasLanguageCookie);
  const [lastChangeSource, setLastChangeSource] = useState<I18nContextValue["lastChangeSource"]>(
    hasLanguageCookie ? "local" : "initial"
  );

  useEffect(() => {
    if (hasLanguageCookie) {
      window.localStorage.setItem(languageStorageKey, initialLanguage);
      setReady(true);
      return;
    }
    const stored = window.localStorage.getItem(languageStorageKey);
    setLanguageState(resolveLanguagePriority({ localLanguage: stored, browserLanguage: navigator.language }));
    setLastChangeSource(stored ? "local" : "initial");
    setReady(true);
  }, [hasLanguageCookie, initialLanguage]);

  const setLanguage = useCallback((next: SupportedLanguage) => {
    setLanguageState(next);
    setLastChangeSource("manual");
    persistLanguage(next);
  }, []);

  const applyAuthenticatedLanguage = useCallback((next?: SupportedLanguage | null) => {
    if (!next) return;
    setLanguageState(next);
    setLastChangeSource("account");
    persistLanguage(next);
  }, []);

  const value = useMemo(
    () => ({ language, setLanguage, applyAuthenticatedLanguage, lastChangeSource, t: getDictionary(language) }),
    [applyAuthenticatedLanguage, language, lastChangeSource, setLanguage]
  );
  if (!ready) return null;

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside I18nProvider");
  return value;
}
