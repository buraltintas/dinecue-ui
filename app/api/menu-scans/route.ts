import { NextRequest } from "next/server";
import { z } from "zod";
import { backendRequest, errorResponse, jsonResponse } from "@/lib/server/backendClient";
import { languageSchema, readJson, validationError } from "@/lib/server/validation";
import type { MenuScanAccepted, MenuScanListItemDto } from "@/lib/types";

// Menus span several pages, so a scan takes a few photos. The backend caps this too
// (Storage:MaxImagesPerScan); keeping the limits aligned means the diner gets a clear message here first.
const schema = z.object({
  imageObjectNames: z.array(z.string().min(1).max(512)).min(1).max(3),
  rawText: z.string().max(800).nullable().optional(),
  selectedCues: z.array(z.string().max(40)).max(12).nullable().optional(),
  restaurantPlaceId: z.string().max(200).nullable().optional(),
  language: languageSchema.optional(),
  context: z.record(z.unknown()).nullable().optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = await readJson(request, schema);
    const response = await backendRequest<MenuScanAccepted>("/menu-scans", {
      method: "POST",
      auth: true,
      body
    });
    // Mirrors the recommendation flow: accepted now, polled to completion.
    return jsonResponse(response, { status: 202 });
  } catch (error) {
    if (error instanceof z.ZodError) return validationError();
    return errorResponse(error);
  }
}

export async function GET() {
  try {
    return jsonResponse(await backendRequest<MenuScanListItemDto[]>("/menu-scans", { auth: true }));
  } catch (error) {
    return errorResponse(error);
  }
}
