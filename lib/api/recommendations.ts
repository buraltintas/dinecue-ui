import { apiFetch } from "./http";
import type { HistoryItemDto, RecommendationAccepted, RecommendationSessionDetail, RecommendationSessionRequest, SavedPlaceDto } from "@/lib/types";

export function createRecommendationSession(input: RecommendationSessionRequest) {
  return apiFetch<RecommendationAccepted>("/api/recommendation-sessions", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function getRecommendationSession(sessionId: string) {
  return apiFetch<RecommendationSessionDetail>(`/api/recommendation-sessions/${sessionId}`);
}

export function getRecommendationHistory() {
  return apiFetch<HistoryItemDto[]>("/api/recommendation-sessions");
}

export function saveRecommendation(id: string) {
  return apiFetch<SavedPlaceDto>(`/api/recommendations/${id}/save`, { method: "POST" });
}

export function unsaveRecommendation(id: string) {
  return apiFetch<{ ok: true }>(`/api/recommendations/${id}/unsave`, { method: "POST" });
}

export function getShareText(id: string) {
  return apiFetch<{ shareText: string }>(`/api/recommendations/${id}/share-text`, { method: "POST" });
}
