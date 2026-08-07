import { NextRequest } from "next/server";
import { backendRequest, errorResponse, jsonResponse } from "@/lib/server/backendClient";
import type { ActivityItemDto } from "@/lib/types";

const kinds = ["recommendation", "menu_scan", "fit_check"];

export async function GET(request: NextRequest) {
  try {
    const kind = request.nextUrl.searchParams.get("kind");
    // Rejected here rather than forwarded, so an unknown group never reaches the backend.
    if (kind && !kinds.includes(kind)) {
      return Response.json({ error: { code: "validation_error", message: "Unknown history group." } }, { status: 400 });
    }
    const query = kind ? `?kind=${encodeURIComponent(kind)}` : "";
    return jsonResponse(await backendRequest<ActivityItemDto[]>(`/activity${query}`, { auth: true }));
  } catch (error) {
    return errorResponse(error);
  }
}
