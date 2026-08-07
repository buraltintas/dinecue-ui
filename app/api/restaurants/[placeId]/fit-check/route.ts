import { NextRequest } from "next/server";
import { z } from "zod";
import { backendRequest, errorResponse, jsonResponse } from "@/lib/server/backendClient";
import { languageSchema, readJson, validationError } from "@/lib/server/validation";
import type { RestaurantFitCheckResponse } from "@/lib/types";

const schema = z.object({
  rawText: z.string().max(800).nullable().optional(),
  language: languageSchema.optional(),
  // context.visitAt (ISO-8601) is what makes the place's opening hours a usable signal.
  context: z.record(z.unknown()).nullable().optional()
});

export async function POST(request: NextRequest, { params }: { params: { placeId: string } }) {
  try {
    const body = await readJson(request, schema);
    const response = await backendRequest<RestaurantFitCheckResponse>(
      `/restaurants/${encodeURIComponent(params.placeId)}/fit-check`,
      { method: "POST", auth: true, body }
    );
    return jsonResponse(response);
  } catch (error) {
    if (error instanceof z.ZodError) return validationError();
    return errorResponse(error);
  }
}
