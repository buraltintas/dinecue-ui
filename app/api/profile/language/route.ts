import { NextRequest } from "next/server";
import { z } from "zod";
import { backendRequest, errorResponse, jsonResponse } from "@/lib/server/backendClient";
import { languageSchema, readJson, validationError } from "@/lib/server/validation";
import type { ProfileDto } from "@/lib/types";

const schema = z.object({
  preferredLanguage: languageSchema
});

export async function PUT(request: NextRequest) {
  try {
    const body = await readJson(request, schema);
    const current = await backendRequest<ProfileDto>("/profile", { auth: true });
    const next = await backendRequest<ProfileDto>("/profile", {
      method: "PUT",
      auth: true,
      body: { ...current, preferredLanguage: body.preferredLanguage }
    });
    return jsonResponse(next);
  } catch (error) {
    if (error instanceof z.ZodError) return validationError();
    return errorResponse(error);
  }
}
