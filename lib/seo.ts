import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/utils";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  imageAlt?: string;
  robots?: Metadata["robots"];
};

export function publicPageMetadata({ title, description, path, imageAlt = "dinecue preview", robots }: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const image = absoluteUrl("/opengraph-image");

  return {
    title,
    description,
    // No hreflang alternates: dinecue has no locale-prefixed public URLs yet, so
    // claiming en/tr/de alternates that all resolve to the same URL is noise.
    // See docs/SEO_GUIDELINES.md.
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      siteName: "dinecue",
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: imageAlt }]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image]
    },
    robots
  };
}
