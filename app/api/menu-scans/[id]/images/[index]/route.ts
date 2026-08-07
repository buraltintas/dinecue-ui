import { backendStream, errorResponse } from "@/lib/server/backendClient";

/**
 * Proxies a stored menu photo. The bucket is private and the backend checks ownership, so this is the
 * only path to the bytes and no storage URL ever reaches the browser.
 */
export async function GET(_: Request, { params }: { params: { id: string; index: string } }) {
  try {
    const index = Number.parseInt(params.index, 10);
    if (!Number.isInteger(index) || index < 0) {
      return Response.json({ error: { code: "not_found", message: "This menu photo was not found." } }, { status: 404 });
    }
    return await backendStream(`/menu-scans/${params.id}/images/${index}`, { auth: true });
  } catch (error) {
    return errorResponse(error);
  }
}
