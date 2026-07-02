import { NextRequest } from "next/server";
import { z } from "zod";
import { backendRequest, errorResponse, jsonResponse } from "@/lib/server/backendClient";
import { languageSchema, readJson, validationError } from "@/lib/server/validation";
import type { ProfileDto, SupportedLanguage } from "@/lib/types";
import { sanitizeProfileForUpdate } from "@/lib/profile-values";

const schema = z.object({
  preferredLanguage: languageSchema
});

export async function PUT(request: NextRequest) {
  try {
    const body = await readJson(request, schema);
    const preferredLanguage: SupportedLanguage = body.preferredLanguage || "en";
    const current = await backendRequest<ProfileDto>("/profile", { auth: true });
    const next = await backendRequest<ProfileDto>("/profile", {
      method: "PUT",
      auth: true,
      body: sanitizeProfileForUpdate({ ...current, preferredLanguage })
    });
    return jsonResponse(next);
  } catch (error) {
    if (error instanceof z.ZodError) return validationError();
    return errorResponse(error);
  }
}
