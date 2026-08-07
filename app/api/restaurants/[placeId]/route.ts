import { backendRequest, errorResponse, jsonResponse } from "@/lib/server/backendClient";
import type { RestaurantDetailsDto } from "@/lib/types";

export async function GET(_: Request, { params }: { params: { placeId: string } }) {
  try {
    const details = await backendRequest<RestaurantDetailsDto>(
      `/restaurants/${encodeURIComponent(params.placeId)}`,
      { auth: true }
    );
    return jsonResponse(details);
  } catch (error) {
    return errorResponse(error);
  }
}
