import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absoluteUrl("/"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: absoluteUrl("/login"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3
    }
  ];
}
