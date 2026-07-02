import { describe, expect, it } from "vitest";
import { normalizeCountryCode, sanitizeProfileForUpdate } from "./profile-values";

describe("profile payload values", () => {
  it("maps localized country labels to stable backend values", () => {
    expect(normalizeCountryCode("Türkiye")).toBe("TR");
    expect(normalizeCountryCode("Deutschland")).toBe("DE");
    expect(normalizeCountryCode("United Kingdom")).toBe("GB");
  });

  it("sends stable country values in profile updates", () => {
    const payload = sanitizeProfileForUpdate({
      displayName: "Ada",
      preferredLanguage: "tr",
      country: "Türkiye",
      currency: "try",
      distanceUnit: "km"
    });

    expect(payload).toMatchObject({
      preferredLanguage: "tr",
      country: "TR",
      currency: "TRY"
    });
  });

  it("does not send quota metadata in profile updates", () => {
    const payload = sanitizeProfileForUpdate({
      displayName: "Ada",
      preferredLanguage: "tr",
      country: "TR",
      currency: "TRY",
      distanceUnit: "km",
      quota: {
        plan: "free",
        monthlyLimit: 5,
        usedThisPeriod: 2,
        remainingThisPeriod: 3,
        periodKey: "2026-07",
        periodEndsAt: "2026-08-01T00:00:00Z",
        proAvailable: true,
        proStatus: "coming_soon"
      }
    });

    expect(payload).not.toHaveProperty("quota");
  });
});
