import type { ProfileDto, SupportedLanguage } from "@/lib/types";

export const countryOptions = ["", "TR", "DE", "GB", "US"] as const;

const countryAliases: Record<string, string> = {
  türkiye: "TR",
  turkey: "TR",
  turkiye: "TR",
  deutschland: "DE",
  germany: "DE",
  almanya: "DE",
  "united kingdom": "GB",
  uk: "GB",
  "great britain": "GB",
  ingiltere: "GB",
  "united states": "US",
  usa: "US",
  "amerika birleşik devletleri": "US"
};

export function normalizeCountryCode(value?: string | null): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const upper = trimmed.toUpperCase();
  if (/^[A-Z]{2}$/.test(upper)) return upper;
  return countryAliases[trimmed.toLocaleLowerCase("en-US")] || null;
}

export function getCountryLabel(code: string, language: SupportedLanguage) {
  if (!code) return "";
  try {
    return new Intl.DisplayNames([language], { type: "region" }).of(code) || code;
  } catch {
    return code;
  }
}

export function sanitizeProfileForUpdate(profile: ProfileDto): ProfileDto {
  return {
    ...profile,
    country: normalizeCountryCode(profile.country) || null,
    currency: profile.currency.toUpperCase()
  };
}
