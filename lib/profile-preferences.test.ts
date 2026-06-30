import { describe, expect, it } from "vitest";
import { DEFAULT_DISTANCE_METERS, DEFAULT_SPICE_TOLERANCE, formatDistance, hasExplicitDiningValues, hasExplicitTasteValues } from "./profile-preferences";
import type { DiningProfileDto, TasteProfileDto } from "./types";

const defaultTaste: TasteProfileDto = {
  favoriteCuisines: [],
  dislikedCuisines: [],
  favoriteDishes: [],
  dislikedIngredients: [],
  spiceTolerance: DEFAULT_SPICE_TOLERANCE,
  sweetSaltyPreference: "balanced",
  drinkPreferences: [],
  dietaryRestrictions: [],
  allergies: []
};

const defaultDining: DiningProfileDto = {
  usuallyWithKids: false,
  prefersQuietPlaces: false,
  prefersOutdoor: false,
  budgetSensitivity: 2,
  likesLocalExperiences: true,
  likesPremiumPlaces: false,
  needsParking: false,
  needsAccessibility: false,
  defaultDistanceMeters: DEFAULT_DISTANCE_METERS
};

describe("profile preference presentation", () => {
  it("does not treat backend-created taste defaults as explicit preferences", () => {
    expect(hasExplicitTasteValues(defaultTaste)).toBe(false);
  });

  it("does not treat backend-created dining defaults as explicit preferences", () => {
    expect(hasExplicitDiningValues(defaultDining)).toBe(false);
  });

  it("detects user-like taste and dining values when they differ from defaults", () => {
    expect(hasExplicitTasteValues({ ...defaultTaste, favoriteCuisines: ["Turkish"] })).toBe(true);
    expect(hasExplicitDiningValues({ ...defaultDining, prefersQuietPlaces: true })).toBe(true);
  });

  it("formats default distance without fake precision", () => {
    expect(formatDistance(DEFAULT_DISTANCE_METERS, "km")).toBe("1.8 km");
    expect(formatDistance(DEFAULT_DISTANCE_METERS, "mi")).toBe("1.1 mi");
  });
});
