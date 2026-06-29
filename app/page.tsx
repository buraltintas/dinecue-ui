import type { Metadata } from "next";
import { LandingHero } from "@/components/marketing/landing-hero";
import { LandingSections } from "@/components/marketing/landing-sections";
import { absoluteUrl } from "@/lib/utils";
import en from "@/messages/en.json";

export const metadata: Metadata = {
  title: en.landing.seoTitle,
  description: en.landing.seoDescription,
  alternates: { canonical: absoluteUrl("/") }
};

export default function LandingPage() {
  return (
    <main>
      <LandingHero />
      <LandingSections />
    </main>
  );
}
