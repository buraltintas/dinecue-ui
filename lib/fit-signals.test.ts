import { describe, expect, it } from "vitest";
import { fitSignalValueToken, humanizeFitSignalKey, readFitSignals } from "@/lib/fit-signals";

describe("fit check signals", () => {
  it("never presents missing information as a negative finding", () => {
    // The model marked an unconfirmable preference as counting against the place. Rendering that in the
    // same red as a real problem tells the diner we found something when we only failed to check.
    const signals = readFitSignals({
      prefersQuietPlaces: { value: "unknown", impact: "negative" },
      outdoorSeating: { value: "", impact: "negative" },
      goodForChildren: { value: "true", impact: "positive" }
    });

    expect(signals.find((s) => s.key === "prefersQuietPlaces")?.impact).toBe("neutral");
    expect(signals.find((s) => s.key === "outdoorSeating")?.impact).toBe("neutral");
    // A genuine finding keeps its impact.
    expect(signals.find((s) => s.key === "goodForChildren")?.impact).toBe("positive");
  });

  it("keeps a real negative signal negative", () => {
    const signals = readFitSignals({ servesVegetarianFood: { value: "false", impact: "negative" } });

    expect(signals[0].impact).toBe("negative");
    expect(signals[0].value).toBe("false");
  });

  it("reads the bare scalars the local mock returns", () => {
    const signals = readFitSignals({ rating: 4.5, goodForChildren: true, quiet: null });

    expect(signals.find((s) => s.key === "rating")?.value).toBe("4.5");
    expect(signals.find((s) => s.key === "goodForChildren")?.value).toBe("true");
    // A null value is unknown, not a finding.
    expect(signals.find((s) => s.key === "quiet")?.impact).toBe("neutral");
  });

  it("classifies values so they can be localized", () => {
    expect(fitSignalValueToken("true")).toBe("yes");
    expect(fitSignalValueToken("false")).toBe("no");
    expect(fitSignalValueToken("unknown")).toBe("unknown");
    expect(fitSignalValueToken("")).toBe("unknown");
    // Free text is shown as-is rather than forced into a yes/no.
    expect(fitSignalValueToken("family_restaurant")).toBeNull();
  });

  it("never leaves a raw identifier on screen", () => {
    // The product forbids backend language in user-facing copy; that has to hold in the UI too.
    expect(humanizeFitSignalKey("servesVegetarianFood")).toBe("Serves vegetarian food");
    expect(humanizeFitSignalKey("goodForChildren")).toBe("Good for children");
    expect(humanizeFitSignalKey("parking_options")).toBe("Parking options");
  });

  it("caps how many signals are shown", () => {
    const many = Object.fromEntries(Array.from({ length: 20 }, (_, i) => [`key${i}`, true]));

    expect(readFitSignals(many)).toHaveLength(8);
  });

  it("handles an absent signal map", () => {
    expect(readFitSignals(null)).toEqual([]);
    expect(readFitSignals(undefined)).toEqual([]);
  });
});
