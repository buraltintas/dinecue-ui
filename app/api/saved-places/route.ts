import { backendRequest, errorResponse, jsonResponse } from "@/lib/server/backendClient";
import type { SavedPlaceDto } from "@/lib/types";

export async function GET() {
  try {
    return jsonResponse(await backendRequest<SavedPlaceDto[]>("/saved-places", { auth: true }));
  } catch (error) {
    return errorResponse(error);
  }
}
