import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { LegalDocument } from "@/components/legal/legal-document";
import { getDictionary } from "@/lib/i18n";
import { publicPageMetadata } from "@/lib/seo";
import { getRequestLanguage } from "@/lib/server/request-language";

export function generateMetadata(): Metadata {
  const t = getDictionary(getRequestLanguage());
  return publicPageMetadata({
    title: t.about.seoTitle,
    description: t.about.seoDescription,
    path: "/about",
    imageAlt: "About DineCue"
  });
}

export default function AboutPage() {
  const t = getDictionary(getRequestLanguage());
  return (
    <LegalDocument
      eyebrow={t.about.eyebrow}
      title={t.about.title}
      intro={t.about.intro}
      lastUpdatedLabel={t.about.lastUpdatedLabel}
      lastUpdated={t.about.lastUpdated}
      sections={t.about.sections}
    >
      <section className="mt-12 rounded-[1.5rem] border border-amber/20 bg-amber/10 p-5">
        <h2 className="text-xl font-semibold text-ivory">{t.about.creatorLabel}</h2>
        <a
          href={t.about.creatorUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-amber transition hover:text-[#ffd18a]"
        >
          {t.about.creatorLink}
          <ExternalLink size={16} aria-hidden />
        </a>
      </section>
    </LegalDocument>
  );
}
