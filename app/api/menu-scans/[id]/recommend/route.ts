import { backendRequest, errorResponse, jsonResponse } from "@/lib/server/backendClient";
import type { MenuScanDetail } from "@/lib/types";

/** Re-ranks an already-read menu against the diner's current profile. Costs no monthly decision. */
export async function POST(_: Request, { params }: { params: { id: string } }) {
  try {
    const scan = await backendRequest<MenuScanDetail>(`/menu-scans/${params.id}/recommend`, {
      method: "POST",
      auth: true
    });
    return jsonResponse(scan);
  } catch (error) {
    return errorResponse(error);
  }
}
