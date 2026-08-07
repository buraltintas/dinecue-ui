import { NextRequest } from "next/server";
import { backendRequest, errorResponse, jsonResponse } from "@/lib/server/backendClient";
import { validationError } from "@/lib/server/validation";
import type { MenuImageUpload } from "@/lib/types";

// A menu photo from a modern phone camera. The backend enforces the real limit and the actual format
// check (by magic bytes); this is only a cheap early rejection so we do not proxy an obviously bad upload.
const maxBytes = 12 * 1024 * 1024;
const acceptedTypes = ["image/jpeg", "image/png", "image/webp"];

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData().catch(() => null);
    const file = form?.get("file");
    if (!(file instanceof File) || file.size === 0) return validationError();
    if (file.size > maxBytes) {
      return Response.json(
        { error: { code: "image_too_large", message: "This photo is too large. Try a smaller or more compressed image." } },
        { status: 400 }
      );
    }
    if (file.type && !acceptedTypes.includes(file.type)) {
      return Response.json(
        { error: { code: "unsupported_image_type", message: "Use a JPEG, PNG, or WebP photo of the menu." } },
        { status: 400 }
      );
    }

    const forwarded = new FormData();
    forwarded.append("file", file, file.name || "menu.jpg");
    const response = await backendRequest<MenuImageUpload>("/uploads/menu-images", {
      method: "POST",
      auth: true,
      formData: forwarded
    });
    return jsonResponse(response);
  } catch (error) {
    return errorResponse(error);
  }
}
