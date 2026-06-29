import { ImageResponse } from "next/og";
import en from "@/messages/en.json";

export const runtime = "edge";
export const alt = "DineCue dining assistant preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
          color: "#F4EFE4",
          background:
            "radial-gradient(circle at 70% 35%, rgba(240,179,92,.32), transparent 26%), linear-gradient(135deg, #0D0D0F, #171D22 55%, #151412)"
        }}
      >
        <div style={{ fontSize: 34, color: "#F0B35C", letterSpacing: 6 }}>DINECUE</div>
        <div style={{ marginTop: 28, fontSize: 110, lineHeight: 0.95, fontWeight: 700 }}>{en.landing.heroTitle}</div>
        <div style={{ marginTop: 30, maxWidth: 820, fontSize: 34, lineHeight: 1.3, color: "#BDB3A3" }}>
          {en.landing.seoDescription}
        </div>
      </div>
    ),
    size
  );
}
