import { NextRequest } from "next/server";
import { z } from "zod";
import { backendRequest, errorResponse, jsonResponse } from "@/lib/server/backendClient";
import { readJson, validationError } from "@/lib/server/validation";
import type { DiningProfileDto } from "@/lib/types";

const schema = z.object({
  usuallyWithKids: z.boolean(),
  prefersQuietPlaces: z.boolean(),
  prefersOutdoor: z.boolean(),
  budgetSensitivity: z.number().int().min(0).max(10),
  likesLocalExperiences: z.boolean(),
  likesPremiumPlaces: z.boolean(),
  needsParking: z.boolean(),
  needsAccessibility: z.boolean(),
  defaultDistanceMeters: z.number().int().min(100).max(100000)
});

export async function GET() {
  try {
    return jsonResponse(await backendRequest<DiningProfileDto>("/dining-profile", { auth: true }));
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await readJson(request, schema);
    return jsonResponse(await backendRequest<DiningProfileDto>("/dining-profile", { method: "PUT", auth: true, body }));
  } catch (error) {
    if (error instanceof z.ZodError) return validationError();
    return errorResponse(error);
  }
}
