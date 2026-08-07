import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/legal-document";
import { JsonLd, legalGraph } from "@/components/seo/json-ld";
import { getDictionary } from "@/lib/i18n";
import { publicPageMetadata } from "@/lib/seo";
import { getRequestLanguage } from "@/lib/server/request-language";

export function generateMetadata(): Metadata {
  const t = getDictionary(getRequestLanguage());
  return publicPageMetadata({
    title: t.legal.terms.seoTitle,
    description: t.legal.terms.seoDescription,
    path: "/terms",
    imageAlt: "dinecue Terms of Service"
  });
}

export default function TermsPage() {
  const t = getDictionary(getRequestLanguage());
  return (
    <LegalDocument
      jsonLd={<JsonLd graph={legalGraph(t, "/terms", t.legal.terms.title, t.legal.terms.seoDescription)} />}
      eyebrow={t.legal.terms.eyebrow}
      title={t.legal.terms.title}
      intro={t.legal.terms.intro}
      lastUpdatedLabel={t.legal.lastUpdatedLabel}
      lastUpdated={t.legal.lastUpdated}
      sections={t.legal.terms.sections}
    />
  );
}
