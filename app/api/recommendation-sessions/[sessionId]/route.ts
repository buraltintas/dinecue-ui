import { backendRequest, errorResponse, jsonResponse } from "@/lib/server/backendClient";
import type { RecommendationSessionDetail } from "@/lib/types";

export async function GET(_: Request, { params }: { params: { sessionId: string } }) {
  try {
    const session = await backendRequest<RecommendationSessionDetail>(`/recommendation-sessions/${params.sessionId}`, {
      auth: true
    });
    return jsonResponse(session);
  } catch (error) {
    return errorResponse(error);
  }
}
