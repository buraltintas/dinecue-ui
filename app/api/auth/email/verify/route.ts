import { NextRequest } from "next/server";
import { z } from "zod";
import { backendRequest, errorResponse, jsonResponse } from "@/lib/server/backendClient";
import { setAuthCookies } from "@/lib/server/authCookies";
import { languageSchema, readJson, validationError } from "@/lib/server/validation";

const schema = z.object({
  email: z.string().email(),
  code: z.string().min(4).max(12),
  preferredLanguage: languageSchema.optional()
});

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: unknown;
  isNewUser: boolean;
  onboardingCompleted: boolean;
};

export async function POST(request: NextRequest) {
  try {
    const body = await readJson(request, schema);
    const response = await backendRequest<LoginResponse>("/auth/email/verify", {
      method: "POST",
      body
    });

    setAuthCookies(response.accessToken, response.refreshToken);
    return jsonResponse({
      user: response.user,
      isNewUser: response.isNewUser,
      onboardingCompleted: response.onboardingCompleted
    });
  } catch (error) {
    if (error instanceof z.ZodError) return validationError();
    return errorResponse(error);
  }
}
