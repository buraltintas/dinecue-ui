import { ReactNode } from "react";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";

type LegalSection = {
  title: string;
  body: string;
};

export function LegalDocument({
  jsonLd,
  eyebrow,
  title,
  intro,
  lastUpdatedLabel,
  lastUpdated,
  sections,
  children
}: {
  jsonLd?: ReactNode;
  eyebrow: string;
  title: string;
  intro: string;
  lastUpdatedLabel: string;
  lastUpdated: string;
  sections: LegalSection[];
  children?: ReactNode;
}) {
  return (
    <>
      {jsonLd}
      <SiteHeader />
      <main className="bg-night text-ivory">
        <article className="container-reading pb-section-md pt-section-sm">
          <p className="font-mono text-[0.6875rem] lowercase tracking-[0.16em] text-faint">{eyebrow}</p>
          <h1 className="mt-5 font-display text-display-2 text-ivory text-balance">{title}</h1>
          <p className="mt-6 text-lead text-muted text-pretty">{intro}</p>
          <p className="mt-6 font-mono text-xs text-faint">
            {lastUpdatedLabel}: <time dateTime="2026-07-02">{lastUpdated}</time>
          </p>

          <div className="mt-14 space-y-10">
            {sections.map((section) => (
              <section key={section.title} className="border-t border-ivory/10 pt-7">
                <h2 className="font-display text-2xl text-ivory">{section.title}</h2>
                <p className="mt-4 leading-7 text-muted text-pretty">{section.body}</p>
              </section>
            ))}
          </div>

          {children}
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
