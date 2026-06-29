import en from "@/messages/en.json";
import tr from "@/messages/tr.json";
import de from "@/messages/de.json";
import type { SupportedLanguage } from "./types";

export const dictionaries = { en, tr, de };
export const supportedLanguages: SupportedLanguage[] = ["en", "tr", "de"];
export const languageStorageKey = "dinecue.language";
export const languageCookieKey = "dinecue_language";

export function normalizeLanguage(value?: string | null): SupportedLanguage | null {
  const short = value?.slice(0, 2).toLowerCase();
  return short === "tr" || short === "de" || short === "en" ? short : null;
}

export function resolveLanguagePriority(input: {
  authenticatedLanguage?: string | null;
  localLanguage?: string | null;
  browserLanguage?: string | null;
}): SupportedLanguage {
  return (
    normalizeLanguage(input.authenticatedLanguage) ||
    normalizeLanguage(input.localLanguage) ||
    normalizeLanguage(input.browserLanguage) ||
    "en"
  );
}

export function resolvePostLoginLanguage(input: {
  isNewUser: boolean;
  selectedLanguage: SupportedLanguage;
  authenticatedLanguage?: string | null;
}): SupportedLanguage {
  if (input.isNewUser) return input.selectedLanguage;
  return normalizeLanguage(input.authenticatedLanguage) || input.selectedLanguage;
}

export function getDictionary(language: SupportedLanguage) {
  return dictionaries[language] || dictionaries.en;
}

export type Dictionary = typeof en;
