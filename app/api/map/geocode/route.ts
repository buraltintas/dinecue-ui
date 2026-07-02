import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const geocodeUrl = "https://nominatim.openstreetmap.org/search";
const supportedLanguages = new Set(["en", "tr", "de"]);

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim();
  const requestedLanguage = request.nextUrl.searchParams.get("language")?.trim().toLowerCase();
  const language = requestedLanguage && supportedLanguages.has(requestedLanguage) ? requestedLanguage : "en";

  if (!query || query.length < 2) {
    return NextResponse.json({ error: "missing_query" }, { status: 400 });
  }

  const response = await fetch(`${geocodeUrl}?format=jsonv2&limit=1&q=${encodeURIComponent(query)}`, {
    headers: {
      "Accept": "application/json",
      "Accept-Language": language,
      "User-Agent": "DineCue UI (https://dinecue.com)"
    },
    next: { revalidate: 60 * 60 * 24 }
  });

  if (!response.ok) {
    return NextResponse.json({ error: "unavailable" }, { status: 502 });
  }

  const results = (await response.json()) as Array<{ lat?: string; lon?: string; display_name?: string }>;
  const first = results[0];
  const lat = first?.lat ? Number(first.lat) : null;
  const lng = first?.lon ? Number(first.lon) : null;

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({
    lat,
    lng,
    label: first.display_name || query
  });
}
