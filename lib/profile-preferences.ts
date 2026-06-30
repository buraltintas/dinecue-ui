import type { DiningProfileDto, ProfileDto, TasteProfileDto } from "@/lib/types";

export const DEFAULT_SPICE_TOLERANCE = 2;
export const DEFAULT_BUDGET_SENSITIVITY = 2;
export const DEFAULT_DISTANCE_METERS = 1800;

export function hasListValue(value?: string[] | null) {
  return Array.isArray(value) && value.some((item) => item.trim().length > 0);
}

export function cleanList(value?: string[] | null) {
  return (value || []).map((item) => item.trim()).filter(Boolean);
}

export function hasExplicitTasteValues(taste?: TasteProfileDto | null) {
  if (!taste) return false;
  return (
    hasListValue(taste.favoriteCuisines) ||
    hasListValue(taste.dietaryRestrictions) ||
    hasListValue(taste.drinkPreferences) ||
    hasListValue(taste.allergies) ||
    hasListValue(taste.favoriteDishes) ||
    hasListValue(taste.dislikedCuisines) ||
    hasListValue(taste.dislikedIngredients) ||
    taste.spiceTolerance !== DEFAULT_SPICE_TOLERANCE ||
    Boolean(taste.sweetSaltyPreference && taste.sweetSaltyPreference !== "balanced")
  );
}

export function hasExplicitDiningValues(dining?: DiningProfileDto | null) {
  if (!dining) return false;
  return (
    dining.usuallyWithKids ||
    dining.prefersQuietPlaces ||
    dining.prefersOutdoor ||
    dining.likesPremiumPlaces ||
    dining.needsParking ||
    dining.needsAccessibility ||
    dining.budgetSensitivity !== DEFAULT_BUDGET_SENSITIVITY ||
    !dining.likesLocalExperiences ||
    dining.defaultDistanceMeters !== DEFAULT_DISTANCE_METERS
  );
}

export function hasIncompletePreferences(taste?: TasteProfileDto | null, dining?: DiningProfileDto | null) {
  return !hasExplicitTasteValues(taste) || !hasExplicitDiningValues(dining);
}

export function formatDistance(meters: number, unit: ProfileDto["distanceUnit"] = "km") {
  if (unit === "mi") {
    const miles = meters / 1609.344;
    return `${trimNumber(miles)} mi`;
  }

  if (meters >= 1000) {
    return `${trimNumber(meters / 1000)} km`;
  }

  return `${meters} m`;
}

function trimNumber(value: number) {
  return Number.isInteger(value) ? value.toFixed(0) : value.toFixed(1);
}
