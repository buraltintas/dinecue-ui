import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/legal-document";
import { getDictionary } from "@/lib/i18n";
import { publicPageMetadata } from "@/lib/seo";
import { getRequestLanguage } from "@/lib/server/request-language";

export function generateMetadata(): Metadata {
  const t = getDictionary(getRequestLanguage());
  return publicPageMetadata({
    title: t.legal.privacy.seoTitle,
    description: t.legal.privacy.seoDescription,
    path: "/privacy",
    imageAlt: "DineCue Privacy Policy"
  });
}

export default function PrivacyPage() {
  const t = getDictionary(getRequestLanguage());
  return (
    <LegalDocument
      eyebrow={t.legal.privacy.eyebrow}
      title={t.legal.privacy.title}
      intro={t.legal.privacy.intro}
      lastUpdatedLabel={t.legal.lastUpdatedLabel}
      lastUpdated={t.legal.lastUpdated}
      sections={t.legal.privacy.sections}
    />
  );
}
