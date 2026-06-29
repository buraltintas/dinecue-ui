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
});
