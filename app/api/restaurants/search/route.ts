import { NextRequest } from "next/server";
import { z } from "zod";
import { backendRequest, errorResponse, jsonResponse } from "@/lib/server/backendClient";
import { languageSchema, readJson, validationError } from "@/lib/server/validation";
import type { RestaurantSearchResultDto } from "@/lib/types";

const schema = z.object({
  query: z.string().min(2).max(200),
  location: z
    .object({
      mode: z.enum(["text", "current", "map_pin"]),
      text: z.string().max(200).nullable().optional(),
      lat: z.number().nullable().optional(),
      lng: z.number().nullable().optional()
    })
    .nullable()
    .optional(),
  language: languageSchema.optional(),
  // Sending the "nearby" cue asks the backend to rank by distance instead of by rating.
  cues: z.array(z.enum(["nearby"])).max(1).optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = await readJson(request, schema);
    const results = await backendRequest<RestaurantSearchResultDto[]>("/restaurants/search", {
      method: "POST",
      auth: true,
      body
    });
    return jsonResponse(results);
  } catch (error) {
    if (error instanceof z.ZodError) return validationError();
    return errorResponse(error);
  }
}
