export type FitSignalImpact = "positive" | "negative" | "neutral";

export type FitSignal = {
  key: string;
  value: string;
  impact: FitSignalImpact;
};

/**
 * Turns the raw signal map into something showable.
 *
 * Two rules matter here. Missing information is never negative: the model may mark an unconfirmable
 * preference as counting against a place, but rendering "we don't know" in the same red as a real problem
 * misreads absence as a finding. And the keys are our own metadata identifiers, so they must be labelled
 * before display — the product forbids backend language in user-facing copy, and that has to hold in the
 * UI too, not only in the prompt.
 */
export function readFitSignals(raw: Record<string, unknown> | null | undefined, limit = 8): FitSignal[] {
  return Object.entries(raw || {})
    .map(([key, value]) => {
      const { text, impact } = normalize(value);
      return { key, value: text, impact: isUnknown(text) ? "neutral" : impact } satisfies FitSignal;
    })
    .slice(0, limit);
}

function normalize(value: unknown): { text: string; impact: FitSignalImpact } {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const record = value as { value?: unknown; impact?: unknown };
    const impact: FitSignalImpact =
      record.impact === "positive" || record.impact === "negative" ? record.impact : "neutral";
    return { text: stringify(record.value), impact };
  }
  // The local mock returns bare scalars, so a shape without an impact reads as neutral.
  return { text: stringify(value), impact: "neutral" };
}

function stringify(value: unknown) {
  if (value === null || value === undefined) return "";
  if (typeof value === "boolean") return value ? "true" : "false";
  return String(value).trim();
}

function isUnknown(text: string) {
  const normalized = text.toLowerCase();
  return normalized === "" || normalized === "unknown" || normalized === "null" || normalized === "n/a";
}

/**
 * Reads a signal's value as a yes/no/unknown token so it can be localized, or null when the value is
 * free text (a cuisine name, a price level) that should be shown as-is.
 */
export function fitSignalValueToken(value: string): "yes" | "no" | "unknown" | null {
  const normalized = value.toLowerCase();
  if (isUnknown(normalized)) return "unknown";
  if (normalized === "true") return "yes";
  if (normalized === "false") return "no";
  return null;
}

/**
 * Fallback label for a signal we have no translation for: `servesVegetarianFood` becomes
 * "Serves vegetarian food". Still better than showing the identifier, and it only applies when the model
 * invents a key outside the set we actually send it.
 */
export function humanizeFitSignalKey(key: string) {
  const spaced = key
    .replace(/[_-]+/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .trim()
    .toLowerCase();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}
