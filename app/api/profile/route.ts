import { NextRequest } from "next/server";
import { z } from "zod";
import { backendRequest, errorResponse, jsonResponse } from "@/lib/server/backendClient";
import { languageSchema, readJson, validationError } from "@/lib/server/validation";
import type { ProfileDto } from "@/lib/types";
import { sanitizeProfileForUpdate } from "@/lib/profile-values";

const schema = z.object({
  displayName: z.string().max(100).nullable().optional(),
  preferredLanguage: z.enum(["en", "tr", "de"]),
  country: z.string().max(80).nullable().optional(),
  currency: z.string().min(3).max(3),
  distanceUnit: z.string().min(2).max(16)
});

export async function GET() {
  try {
    return jsonResponse(await backendRequest<ProfileDto>("/profile", { auth: true }));
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = sanitizeProfileForUpdate(await readJson(request, schema));
    return jsonResponse(await backendRequest<ProfileDto>("/profile", { method: "PUT", auth: true, body }));
  } catch (error) {
    if (error instanceof z.ZodError) return validationError();
    return errorResponse(error);
  }
}
