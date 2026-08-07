import { ApiClientError, apiFetch } from "./http";
import type { MenuImageUpload, MenuScanAccepted, MenuScanDetail, MenuScanRequest } from "@/lib/types";

/**
 * Uploads one menu photo. Deliberately separate from creating the scan: uploads cost no monthly decision,
 * so a diner can retake a blurry photo without paying for it.
 */
export async function uploadMenuImage(file: File): Promise<MenuImageUpload> {
  const form = new FormData();
  form.append("file", file);

  // apiFetch sets a JSON content type, which would break the multipart boundary.
  const response = await fetch("/api/uploads/menu-images", { method: "POST", body: form });
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const error = body?.error;
    throw new ApiClientError(error?.message || "Upload failed.", error?.code || "request_failed", response.status);
  }
  return body as MenuImageUpload;
}

export function createMenuScan(input: MenuScanRequest) {
  return apiFetch<MenuScanAccepted>("/api/menu-scans", {
    method: "POST",
    body: JSON.stringify(input)
  });
}

export function getMenuScan(menuScanId: string) {
  return apiFetch<MenuScanDetail>(`/api/menu-scans/${menuScanId}`);
}

/** Re-ranks an already-read menu against the diner's current profile. Costs no monthly decision. */
export function recommendFromMenuScan(menuScanId: string) {
  return apiFetch<MenuScanDetail>(`/api/menu-scans/${menuScanId}/recommend`, { method: "POST" });
}

export function menuScanImageUrl(menuScanId: string, index: number) {
  return `/api/menu-scans/${menuScanId}/images/${index}`;
}
