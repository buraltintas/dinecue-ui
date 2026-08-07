import { describe, expect, it } from "vitest";
import { cleanList } from "@/lib/profile-preferences";
import { parseCommaList, sameCommaList } from "@/lib/comma-list";

describe("comma-separated preference entry", () => {
  it("keeps a trailing comma typeable", () => {
    // The original bug: every keystroke sent the parsed list up, the parent echoed it back, and the
    // normalizing sync joined ["bira", ""] into "bira" — removing the comma the instant it was typed.
    const typed = "bira,";
    const parsed = parseCommaList(typed);

    expect(parsed).toEqual(["bira", ""]);
    // The echo of our own edit must be recognised as such, so the text is left alone.
    expect(sameCommaList(parsed, parsed)).toBe(true);
    expect(cleanList(parsed).join(", ")).toBe("bira");
  });

  it("recognises an external change so a save or refetch still refreshes the field", () => {
    expect(sameCommaList(["bira"], ["bira", "şarap"])).toBe(false);
    expect(sameCommaList(["bira", ""], ["bira"])).toBe(true);
    expect(sameCommaList([], [])).toBe(true);
  });

  it("trims entries without dropping what is still being typed", () => {
    expect(parseCommaList("kişniş, zeytin")).toEqual(["kişniş", "zeytin"]);
    expect(parseCommaList("kişniş , ")).toEqual(["kişniş", ""]);
    expect(parseCommaList("")).toEqual([""]);
  });

  it("drops blanks only when the value is persisted", () => {
    expect(cleanList(parseCommaList("bira, , şarap"))).toEqual(["bira", "şarap"]);
  });
});
