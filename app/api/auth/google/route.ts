import { NextRequest } from "next/server";
import { z } from "zod";
import { backendRequest, errorResponse, jsonResponse } from "@/lib/server/backendClient";
import { setAuthCookies } from "@/lib/server/authCookies";
import { languageSchema, readJson, validationError } from "@/lib/server/validation";

const schema = z.object({
  credential: z.string().min(20),
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
    const response = await backendRequest<LoginResponse>("/auth/google", {
      method: "POST",
      body: {
        token: body.credential,
        preferredLanguage: body.preferredLanguage
      }
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
