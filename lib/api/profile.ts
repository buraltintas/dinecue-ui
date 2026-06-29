import { apiFetch } from "./http";
import type { DiningProfileDto, ProfileDto, SavedPlaceDto, SupportedLanguage, TasteProfileDto } from "@/lib/types";
import { sanitizeProfileForUpdate } from "@/lib/profile-values";

export const getProfile = () => apiFetch<ProfileDto>("/api/profile");
export const updateProfile = (profile: ProfileDto) =>
  apiFetch<ProfileDto>("/api/profile", { method: "PUT", body: JSON.stringify(sanitizeProfileForUpdate(profile)) });

export const updatePreferredLanguage = (preferredLanguage: SupportedLanguage) =>
  apiFetch<ProfileDto>("/api/profile/language", { method: "PUT", body: JSON.stringify({ preferredLanguage }) });

export const getTasteProfile = () => apiFetch<TasteProfileDto>("/api/taste-profile");
export const updateTasteProfile = (profile: TasteProfileDto) =>
  apiFetch<TasteProfileDto>("/api/taste-profile", { method: "PUT", body: JSON.stringify(profile) });

export const getDiningProfile = () => apiFetch<DiningProfileDto>("/api/dining-profile");
export const updateDiningProfile = (profile: DiningProfileDto) =>
  apiFetch<DiningProfileDto>("/api/dining-profile", { method: "PUT", body: JSON.stringify(profile) });

export const getSavedPlaces = () => apiFetch<SavedPlaceDto[]>("/api/saved-places");
