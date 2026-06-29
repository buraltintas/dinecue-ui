import { backendRequest, errorResponse, jsonResponse } from "@/lib/server/backendClient";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  try {
    await backendRequest(`/recommendations/${params.id}/unsave`, { method: "POST", auth: true });
    return jsonResponse({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
