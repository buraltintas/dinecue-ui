import { describe, expect, it } from "vitest";
import { resolveLanguagePriority, resolvePostLoginLanguage } from "./i18n";

describe("language resolution", () => {
  it("keeps Turkish selected before login for first account creation", () => {
    expect(
      resolvePostLoginLanguage({
        isNewUser: true,
        selectedLanguage: "tr",
        authenticatedLanguage: "en"
      })
    ).toBe("tr");
  });

  it("uses account language before local and browser language on session restore", () => {
    expect(
      resolveLanguagePriority({
        authenticatedLanguage: "de",
        localLanguage: "tr",
        browserLanguage: "en-US"
      })
    ).toBe("de");
  });

  it("falls back through local, browser, then English", () => {
    expect(resolveLanguagePriority({ localLanguage: "tr", browserLanguage: "de-DE" })).toBe("tr");
    expect(resolveLanguagePriority({ localLanguage: "fr", browserLanguage: "de-DE" })).toBe("de");
    expect(resolveLanguagePriority({ localLanguage: "fr", browserLanguage: "it-IT" })).toBe("en");
  });

  it("uses selected language for existing users only when account language is unavailable", () => {
    expect(
      resolvePostLoginLanguage({
        isNewUser: false,
        selectedLanguage: "tr",
        authenticatedLanguage: null
      })
    ).toBe("tr");
  });
});
