import { NextRequest } from "next/server";
import { z } from "zod";
import { backendRequest, errorResponse, jsonResponse } from "@/lib/server/backendClient";
import { readJson, validationError } from "@/lib/server/validation";
import type { TasteProfileDto } from "@/lib/types";

const list = z.array(z.string().max(80)).max(30);
const schema = z.object({
  favoriteCuisines: list,
  dislikedCuisines: list,
  favoriteDishes: list,
  dislikedIngredients: list,
  spiceTolerance: z.number().int().min(0).max(10),
  sweetSaltyPreference: z.string().max(40),
  drinkPreferences: list,
  dietaryRestrictions: list,
  allergies: list
});

export async function GET() {
  try {
    return jsonResponse(await backendRequest<TasteProfileDto>("/taste-profile", { auth: true }));
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await readJson(request, schema);
    return jsonResponse(await backendRequest<TasteProfileDto>("/taste-profile", { method: "PUT", auth: true, body }));
  } catch (error) {
    if (error instanceof z.ZodError) return validationError();
    return errorResponse(error);
  }
}
