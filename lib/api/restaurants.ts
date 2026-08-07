import { apiFetch } from "./http";
import type {
  RestaurantDetailsDto,
  RestaurantFitCheckRequest,
  RestaurantFitCheckResponse,
  RestaurantSearchRequest,
  RestaurantSearchResultDto
} from "@/lib/types";

export function searchRestaurants(input: RestaurantSearchRequest & { cues?: "nearby"[] }) {
  return apiFetch<RestaurantSearchResultDto[]>("/api/restaurants/search", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function getRestaurant(placeId: string) {
  return apiFetch<RestaurantDetailsDto>(`/api/restaurants/${encodeURIComponent(placeId)}`);
}

/** Reopens a fit check the diner already paid a credit for. */
export function getFitCheck(id: string) {
  return apiFetch<RestaurantFitCheckResponse>(`/api/restaurants/fit-checks/${id}`);
}

export function checkRestaurantFit(placeId: string, input: RestaurantFitCheckRequest) {
  return apiFetch<RestaurantFitCheckResponse>(`/api/restaurants/${encodeURIComponent(placeId)}/fit-check`, {
    method: "POST",
    body: JSON.stringify(input)
  });
}
