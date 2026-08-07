import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/utils";

// Public marketing and legal URLs only. /login and /app/** stay out of the sitemap
// and are disallowed in robots.ts.
const pages = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.35 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.35 }
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return pages.map((page) => ({
    url: absoluteUrl(page.path),
    lastModified,
    changeFrequency: page.changeFrequency,
    priority: page.priority
  }));
}
