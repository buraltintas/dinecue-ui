import type { ProfileDto, SupportedLanguage } from "@/lib/types";

export const countryOptions = ["", "TR", "DE", "GB", "US"] as const;

/**
 * Currency is a fixed choice, not free text: the backend accepts only a 3-letter code, so a typed
 * "TL" or "usd " would fail validation for a reason the diner cannot see.
 */
export const currencyOptions = ["TRY", "EUR", "USD", "GBP", "CHF"] as const;

/** Preset radii, so a diner picks a distance instead of typing a raw meter value. */
export const distanceOptionsMeters = [500, 1000, 1500, 2000, 3000, 5000, 10000, 20000] as const;

export const sweetSaltyOptions = ["balanced", "sweet", "salty"] as const;

/** Both scales are 0-5 in the backend; the UI must not offer a value it would reject. */
export const scaleMax = 5;

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

export function sanitizeProfileForUpdate(profile: ProfileDto): Omit<ProfileDto, "quota"> {
  const { quota: _quota, ...payload } = profile;
  return {
    ...payload,
    country: normalizeCountryCode(profile.country) || null,
    currency: profile.currency.toUpperCase()
  };
}
