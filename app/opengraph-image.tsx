import { ImageResponse } from "next/og";
import en from "@/messages/en.json";

export const runtime = "edge";
export const alt = "dinecue dining assistant preview";
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
          justifyContent: "space-between",
          padding: 76,
          color: "#F4EFE4",
          background:
            "radial-gradient(circle at 12% 8%, rgba(212,138,69,.26), transparent 42%), linear-gradient(150deg, #0D0D0F 0%, #1A1613 58%, #0D0D0F 100%)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ fontSize: 30, letterSpacing: -1, fontWeight: 700 }}>dinecue</div>
          <div style={{ fontSize: 30, color: "#F0B35C", fontWeight: 700 }}>.</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 116, lineHeight: 1, fontWeight: 700, letterSpacing: -4 }}>
            <div>{en.landing.heroTitle.replace(/\.$/, "")}</div>
            <div style={{ color: "#91A06B" }}>.</div>
          </div>
          <div style={{ marginTop: 32, maxWidth: 860, fontSize: 30, lineHeight: 1.4, color: "#BDB3A3" }}>
            {en.landing.seoDescription}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 22, color: "#8A8175" }}>
          <div style={{ width: 56, height: 2, background: "#D48A45" }} />
          <div>{en.landing.eyebrow}</div>
        </div>
      </div>
    ),
    size
  );
}
