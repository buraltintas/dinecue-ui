import { backendRequest, errorResponse, jsonResponse } from "@/lib/server/backendClient";
import type { SavedPlaceDto } from "@/lib/types";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  try {
    return jsonResponse(await backendRequest<SavedPlaceDto>(`/recommendations/${params.id}/save`, { method: "POST", auth: true }));
  } catch (error) {
    return errorResponse(error);
  }
}
