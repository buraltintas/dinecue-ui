import { BrandLink } from "@/components/brand/brand-link";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { SiteFooter } from "@/components/marketing/site-footer";

type LegalSection = {
  title: string;
  body: string;
};

export function LegalDocument({
  eyebrow,
  title,
  intro,
  lastUpdatedLabel,
  lastUpdated,
  sections,
  children
}: {
  eyebrow: string;
  title: string;
  intro: string;
  lastUpdatedLabel: string;
  lastUpdated: string;
  sections: LegalSection[];
  children?: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-radial-table text-ivory">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-7 sm:px-8">
        <BrandLink />
        <LanguageSwitcher compact refreshOnChange />
      </header>
      <article className="mx-auto max-w-4xl px-5 pb-20 pt-12 sm:px-8 sm:pt-16">
        <p className="text-sm tracking-[0.28em] text-amber">{eyebrow}</p>
        <h1 className="mt-4 font-display text-5xl leading-tight text-ivory sm:text-6xl">{title}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">{intro}</p>
        <p className="mt-6 text-sm text-muted">
          {lastUpdatedLabel}: <time dateTime="2026-07-02">{lastUpdated}</time>
        </p>
        <div className="mt-12 space-y-10">
          {sections.map((section) => (
            <section key={section.title} className="border-t border-ivory/10 pt-7">
              <h2 className="text-2xl font-semibold text-ivory">{section.title}</h2>
              <p className="mt-4 leading-7 text-muted">{section.body}</p>
            </section>
          ))}
        </div>
        {children}
      </article>
      <SiteFooter />
    </main>
  );
}
