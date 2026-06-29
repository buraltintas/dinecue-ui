import { backendRequest, errorResponse, jsonResponse } from "@/lib/server/backendClient";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  try {
    return jsonResponse(await backendRequest<{ shareText: string }>(`/recommendations/${params.id}/share-text`, { method: "POST", auth: true }));
  } catch (error) {
    return errorResponse(error);
  }
}
