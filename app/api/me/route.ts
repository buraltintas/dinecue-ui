import { backendRequest, errorResponse, jsonResponse } from "@/lib/server/backendClient";
import type { UserDto } from "@/lib/types";

export async function GET() {
  try {
    const user = await backendRequest<UserDto>("/me", { auth: true });
    return jsonResponse(user);
  } catch (error) {
    return errorResponse(error);
  }
}
