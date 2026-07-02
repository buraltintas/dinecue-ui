import type { Metadata } from "next";
import { LandingHero } from "@/components/marketing/landing-hero";
import { LandingSections } from "@/components/marketing/landing-sections";
import { getDictionary } from "@/lib/i18n";
import { publicPageMetadata } from "@/lib/seo";
import { getRequestLanguage } from "@/lib/server/request-language";

export function generateMetadata(): Metadata {
  const t = getDictionary(getRequestLanguage());
  return publicPageMetadata({
    title: t.landing.seoTitle,
    description: t.landing.seoDescription,
    path: "/",
    imageAlt: "DineCue dining assistant preview"
  });
}

export default function LandingPage() {
  return (
    <main>
      <LandingHero />
      <LandingSections />
    </main>
  );
}
