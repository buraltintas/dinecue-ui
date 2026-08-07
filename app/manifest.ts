import type { MetadataRoute } from "next";
import en from "@/messages/en.json";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "dinecue",
    short_name: "dinecue",
    description: en.landing.seoDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#100E0C",
    theme_color: "#100E0C",
    icons: [
      { src: "/favicon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" }
    ]
  };
}
