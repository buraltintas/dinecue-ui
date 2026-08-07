import { backendRequest, errorResponse, jsonResponse } from "@/lib/server/backendClient";
import type { MenuScanDetail } from "@/lib/types";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const scan = await backendRequest<MenuScanDetail>(`/menu-scans/${params.id}`, { auth: true });
    return jsonResponse(scan);
  } catch (error) {
    return errorResponse(error);
  }
}
