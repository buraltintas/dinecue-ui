import { NextRequest } from "next/server";
import { z } from "zod";
import { backendRequest, errorResponse, jsonResponse } from "@/lib/server/backendClient";
import { languageSchema, readJson, validationError } from "@/lib/server/validation";

const schema = z.object({
  email: z.string().email(),
  preferredLanguage: languageSchema.optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = await readJson(request, schema);
    const response = await backendRequest<{ message: string; devOtp?: string | null }>("/auth/email/start", {
      method: "POST",
      body
    });

    if (process.env.NODE_ENV === "development" && response.devOtp) {
      return jsonResponse({ message: response.message, devOtp: response.devOtp });
    }

    return jsonResponse({ message: response.message });
  } catch (error) {
    if (error instanceof z.ZodError) return validationError();
    return errorResponse(error);
  }
}
