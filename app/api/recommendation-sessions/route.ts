import { NextRequest } from "next/server";
import { z } from "zod";
import { backendRequest, errorResponse, jsonResponse } from "@/lib/server/backendClient";
import { languageSchema, readJson, validationError } from "@/lib/server/validation";
import type { HistoryItemDto, RecommendationAccepted } from "@/lib/types";

const schema = z.object({
  rawText: z.string().min(4).max(600),
  location: z
    .object({
      mode: z.string(),
      text: z.string().max(200).nullable().optional(),
      lat: z.number().nullable().optional(),
      lng: z.number().nullable().optional(),
      placeId: z.string().max(200).nullable().optional()
    })
    .nullable()
    .optional(),
  selectedCues: z.array(z.string().max(40)).max(12).nullable().optional(),
  language: languageSchema.optional(),
  context: z.record(z.unknown()).nullable().optional()
});

export async function GET() {
  try {
    return jsonResponse(await backendRequest<HistoryItemDto[]>("/recommendation-sessions", { auth: true }));
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await readJson(request, schema);
    const response = await backendRequest<RecommendationAccepted>("/recommendation-sessions", {
      method: "POST",
      auth: true,
      body
    });
    return jsonResponse(response, { status: 202 });
  } catch (error) {
    if (error instanceof z.ZodError) return validationError();
    return errorResponse(error);
  }
}
