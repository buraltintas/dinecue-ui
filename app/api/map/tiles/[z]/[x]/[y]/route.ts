import { NextRequest } from "next/server";

export const runtime = "nodejs";

const tileHost = "https://tile.openstreetmap.org";
const maxZoom = 19;

export async function GET(_request: NextRequest, { params }: { params: { z: string; x: string; y: string } }) {
  const z = Number(params.z);
  const x = Number(params.x);
  const y = Number(params.y);
  const limit = 2 ** z;

  if (!Number.isInteger(z) || !Number.isInteger(x) || !Number.isInteger(y) || z < 1 || z > maxZoom || x < 0 || y < 0 || x >= limit || y >= limit) {
    return new Response(null, { status: 404 });
  }

  const response = await fetch(`${tileHost}/${z}/${x}/${y}.png`, {
    headers: {
      "User-Agent": "DineCue UI (https://dinecue.com)",
      "Accept": "image/png,image/*"
    },
    next: { revalidate: 60 * 60 * 24 * 7 }
  });

  if (!response.ok || !response.body) return new Response(null, { status: response.status });

  return new Response(response.body, {
    status: 200,
    headers: {
      "Content-Type": response.headers.get("Content-Type") || "image/png",
      "Cache-Control": "public, max-age=86400, s-maxage=604800"
    }
  });
}
