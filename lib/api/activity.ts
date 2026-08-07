import { apiFetch } from "./http";
import type { ActivityItemDto, ActivityKind } from "@/lib/types";

/** Omit `kind` for the merged feed, or pass one to look at a single flow. */
export function getActivity(kind?: ActivityKind) {
  return apiFetch<ActivityItemDto[]>(kind ? `/api/activity?kind=${kind}` : "/api/activity");
}
