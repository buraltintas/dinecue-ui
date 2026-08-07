import { backendRequest, errorResponse, jsonResponse } from "@/lib/server/backendClient";
import type { RestaurantFitCheckResponse } from "@/lib/types";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const report = await backendRequest<RestaurantFitCheckResponse>(`/restaurants/fit-checks/${params.id}`, { auth: true });
    return jsonResponse(report);
  } catch (error) {
    return errorResponse(error);
  }
}
