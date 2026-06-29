import { z } from "zod";
import type { NextRequest } from "next/server";

export const languageSchema = z.enum(["en", "tr", "de"]).default("en");

export async function readJson<T>(request: NextRequest, schema: z.ZodType<T>) {
  const body = await request.json().catch(() => null);
  return schema.parse(body);
}

export function validationError() {
  return Response.json(
    { error: { code: "validation_error", message: "Please check the form and try again." } },
    { status: 400 }
  );
}
