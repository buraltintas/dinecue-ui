"use client";

import { Section, SectionTitle } from "@/components/ui/section";
import { useI18n } from "@/components/providers/i18n-provider";

/**
 * Native <details> so every answer is present in the server HTML and reachable
 * by keyboard without any JavaScript. The same copy feeds the FAQPage schema in
 * components/seo/json-ld.tsx.
 */
export function FaqSection() {
  const { t } = useI18n();

  return (
    <Section id="faq" ground="night" space="md">
      <div className="container-page grid gap-12 lg:grid-cols-[20rem_1fr] lg:gap-20">
        <SectionTitle id="faq" className="text-display-3">
          {t.landing.sections.faqTitle}
        </SectionTitle>

        <div className="max-w-3xl">
          {t.landing.faqItems.map((item) => (
            <details key={item.q} className="group border-t border-ivory/10 last:border-b">
              <summary className="flex cursor-pointer list-none items-baseline gap-5 py-6 text-ivory marker:hidden">
                <h3 className="flex-1 text-base font-semibold leading-7 text-pretty sm:text-lg">{item.q}</h3>
                <span
                  aria-hidden
                  className="shrink-0 font-mono text-lg leading-none text-copper transition-transform duration-300 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="max-w-measure pb-7 text-sm leading-7 text-muted text-pretty">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}
