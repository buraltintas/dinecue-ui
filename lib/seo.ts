import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/utils";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  imageAlt?: string;
  robots?: Metadata["robots"];
};

export function publicPageMetadata({ title, description, path, imageAlt = "DineCue preview", robots }: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const image = absoluteUrl("/opengraph-image");

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        en: url,
        tr: url,
        de: url,
        "x-default": url
      }
    },
    openGraph: {
      type: "website",
      url,
      siteName: "DineCue",
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
