"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CourseRule, Section, SectionTitle } from "@/components/ui/section";
import { useI18n } from "@/components/providers/i18n-provider";
import { useViewer } from "@/components/providers/use-viewer";
import { LeaderLoader } from "@/components/ui/leader-loader";
import { FaqSection } from "@/components/marketing/faq-section";
import { SiteFooter } from "@/components/marketing/site-footer";
import { cn } from "@/lib/utils";

export function LandingSections() {
  const { t } = useI18n();
  const { isSignedIn, isResolving, primaryHref } = useViewer();
  const primaryLabel = isSignedIn ? t.landing.findPlaceCta : t.landing.sections.cta;

  return (
    <>
      <HowItWorks />
      <Principles />
      <Capabilities />
      <Comparison />
      <Scenarios />
      <Plans primaryHref={primaryHref} />
      <FaqSection />

      {/* The quietest moment on the page. One sentence, nothing beside it. */}
      <Section id="trust" ground="void" space="lg">
        <div className="container-reading">
          <SectionTitle id="trust" className="max-w-2xl">
            {t.landing.sections.trustTitle}
          </SectionTitle>
          <p className="mt-8 max-w-measure text-lead text-muted text-pretty">{t.landing.sections.trustBody}</p>
          {isResolving ? (
            <Button size="lg" type="button" disabled aria-busy className="mt-12 min-w-40 text-graphite">
              <LeaderLoader label={t.common.preparing} />
            </Button>
          ) : (
            <Link href={primaryHref} className="mt-12 inline-block">
              <Button size="lg" className="min-w-40">
                {primaryLabel}
              </Button>
            </Link>
          )}
        </div>
      </Section>

      <SiteFooter />
    </>
  );
}

/**
 * The only genuinely ordered content on the page, so the only place that earns
 * numerals. They are hung in the margin the way course numbers are on a menu,
 * and the steps stack vertically rather than sitting in a three-card row.
 */
function HowItWorks() {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();

  return (
    <Section id="how" ground="night" space="lg">
      <div className="container-page">
        <CourseRule label={t.landing.sections.processEyebrow} />
        <SectionTitle id="how" className="mt-8 max-w-3xl">
          {t.landing.sections.howTitle}
        </SectionTitle>

        <ol className="mt-16 max-w-4xl">
          {t.landing.process.map((step, index) => (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : index * 0.08 }}
              className="grid gap-x-8 gap-y-3 border-t border-ivory/10 py-9 sm:grid-cols-[3rem_1fr] lg:grid-cols-[4rem_18rem_1fr]"
            >
              <span className="font-display text-3xl leading-none text-copper/70">{index + 1}</span>
              <h3 className="font-display text-2xl text-ivory sm:text-[1.65rem]">{step.title}</h3>
              <p className="max-w-measure leading-8 text-muted text-pretty sm:col-start-2 lg:col-start-3">{step.text}</p>
            </motion.li>
          ))}
        </ol>

        <div className="flex flex-col gap-4 border-t border-ivory/10 pt-8 sm:flex-row sm:items-baseline sm:gap-8">
          <p className="shrink-0 font-mono text-[0.6875rem] lowercase tracking-[0.16em] text-faint">
            {t.landing.factorsLabel}
          </p>
          <p className="text-lg leading-relaxed text-ivory/70">{t.landing.thinkingFactors.join(" · ")}</p>
        </div>
      </div>
    </Section>
  );
}

/** The dense moment: three tight columns, small type, no ornament at all. */
function Principles() {
  const { t } = useI18n();

  return (
    <Section id="principles" ground="void" space="sm">
      <div className="container-page grid gap-10 lg:grid-cols-[20rem_1fr] lg:gap-20">
        <SectionTitle id="principles" className="text-display-3">
          {t.landing.sections.featuresTitle}
        </SectionTitle>
        <div className="grid gap-x-10 gap-y-8 sm:grid-cols-3">
          {t.landing.features.map((feature) => (
            <div key={feature.title}>
              <h3 className="text-sm font-semibold tracking-[0.06em] text-ivory">{feature.title}</h3>
              <p className="mt-3 text-sm leading-7 text-faint text-pretty">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/**
 * Each capability shows a fragment of the thing it describes instead of a
 * decorative icon. Hairline above, nothing around it — no card.
 */
function Capabilities() {
  const { t } = useI18n();
  const artifacts = [<FindArtifact key="find" />, <ScanArtifact key="scan" />, <FitArtifact key="fit" />];

  return (
    <Section id="capabilities" ground="ember" space="md">
      <div className="container-page">
        <CourseRule label={t.landing.sections.capabilitiesEyebrow} />
        <SectionTitle id="capabilities" className="mt-8 max-w-2xl">
          {t.landing.sections.capabilitiesTitle}
        </SectionTitle>

        <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-10">
          {/* All three capabilities ship now: finding a place, scanning a menu, checking a place's fit. */}
          {t.landing.capabilities.map((capability, index) => (
            <article key={capability.title} className="border-t border-ivory/12 pt-7">
              <div className="h-16" aria-hidden>
                {artifacts[index]}
              </div>
              <h3 className="mt-8 font-display text-xl text-ivory">{capability.title}</h3>
              <p className="mt-3 text-sm leading-7 text-muted text-pretty">{capability.text}</p>
            </article>
          ))}
        </div>
      </div>
    </Section>
  );
}

function FindArtifact() {
  const labels = ["Dinner", "Quiet", "Nearby"];
  return (
    <div className="flex h-full flex-wrap content-end gap-1.5">
      {labels.map((label, index) => (
        <span
          key={label}
          className={cn(
            "rounded-pill border px-2.5 py-1 text-xs",
            index < 2 ? "border-copper/50 text-ivory" : "border-ivory/12 text-faint"
          )}
        >
          {label}
        </span>
      ))}
    </div>
  );
}

function ScanArtifact() {
  const widths = ["86%", "58%", "72%"];
  return (
    <div className="relative flex h-full flex-col justify-end gap-2.5">
      {widths.map((width, index) => (
        <span key={index} className="h-1.5 rounded-pill bg-ivory/20" style={{ width }} />
      ))}
      <span className="absolute inset-x-0 bottom-4 h-px bg-copper" />
    </div>
  );
}

function FitArtifact() {
  return (
    <div className="flex h-full flex-col justify-end gap-3">
      <p className="leader">
        <span className="font-mono text-xs lowercase tracking-[0.16em] text-faint">fit</span>
        <span className="leader-fill" aria-hidden />
        <span className="shrink-0 font-mono text-2xl tabular-nums text-ivory">88</span>
      </p>
    </div>
  );
}

/**
 * A real comparison, so it is set as one: what exists today runs down the left
 * in a quiet voice, what dinecue does answers it on the right.
 */
function Comparison() {
  const { t } = useI18n();
  const alternatives = t.landing.difference.slice(0, 2);
  const dinecue = t.landing.difference[2];

  return (
    <Section id="difference" ground="night" space="md">
      <div className="container-page">
        <CourseRule label={t.landing.sections.differenceEyebrow} />
        <SectionTitle id="difference" className="mt-8 max-w-3xl">
          {t.landing.sections.differenceTitle}
        </SectionTitle>

        <div className="mt-16 grid gap-x-16 gap-y-10 lg:grid-cols-2">
          <div>
            <p className="font-mono text-[0.6875rem] lowercase tracking-[0.16em] text-faint">
              {t.landing.sections.comparisonThemLabel}
            </p>
            <div className="mt-7 space-y-7">
              {alternatives.map((item) => (
                <article key={item.title} className="border-t border-ivory/[0.08] pt-5">
                  <h3 className="text-base font-semibold text-muted">{item.title}</h3>
                  <p className="mt-2.5 text-sm leading-7 text-faint text-pretty">{item.text}</p>
                </article>
              ))}
            </div>
          </div>

          {dinecue ? (
            <div className="lg:border-l lg:border-copper/30 lg:pl-16">
              <p className="font-mono text-[0.6875rem] lowercase tracking-[0.16em] text-copper">
                {t.landing.sections.comparisonUsLabel}
              </p>
              <h3 className="mt-7 font-display text-display-3 text-ivory text-balance">{dinecue.title}</h3>
              <p className="mt-5 max-w-measure text-lead leading-8 text-ivory/80 text-pretty">{dinecue.text}</p>
            </div>
          ) : null}
        </div>
      </div>
    </Section>
  );
}

/** The device at its most literal: a list of occasions, set like a bill of fare. */
function Scenarios() {
  const { t } = useI18n();

  return (
    <Section id="scenarios" ground="void" space="md">
      <div className="container-page">
        <SectionTitle id="scenarios" className="max-w-2xl">
          {t.landing.sections.scenariosTitle}
        </SectionTitle>

        <dl className="mt-14 max-w-4xl">
          {t.landing.scenarios.map((scenario) => (
            <div key={scenario.title} className="border-t border-ivory/[0.08] py-6 sm:flex sm:items-baseline sm:gap-6">
              <dt className="shrink-0 font-display text-xl text-ivory sm:w-56">{scenario.title}</dt>
              <span className="hidden flex-1 self-center border-b border-dotted border-copper/30 sm:block" aria-hidden />
              <dd className="mt-2 max-w-sm text-sm leading-7 text-muted text-pretty sm:mt-0 sm:text-right">
                {scenario.text}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}

function Plans({ primaryHref }: { primaryHref: "/app/find" | "/login" }) {
  const { t } = useI18n();

  return (
    <Section id="plans" ground="ember" space="md">
      <div className="container-page">
        <CourseRule label={t.landing.sections.plansEyebrow} />
        <SectionTitle id="plans" className="mt-8 max-w-2xl">
          {t.landing.sections.plansTitle}
        </SectionTitle>

        <div className="mt-16 grid gap-14 lg:grid-cols-2 lg:gap-20">
          <PlanColumn
            name={t.landing.plans.free.name}
            allowance={t.landing.plans.free.allowance}
            allowanceLabel={t.landing.plans.allowanceLabel}
            description={t.landing.plans.free.description}
            features={t.landing.plans.free.features.slice(1)}
            cta={t.landing.plans.free.cta}
            href={primaryHref}
          />
          <PlanColumn
            name={t.landing.plans.pro.name}
            allowance={t.landing.plans.pro.allowance}
            allowanceLabel={t.landing.plans.allowanceLabel}
            badge={t.landing.plans.pro.badge}
            description={t.landing.plans.pro.description}
            features={t.landing.plans.pro.features.slice(1)}
            cta={t.landing.plans.pro.cta}
          />
        </div>
      </div>
    </Section>
  );
}

function PlanColumn({
  name,
  allowance,
  allowanceLabel,
  badge,
  description,
  features,
  cta,
  href
}: {
  name: string;
  allowance: string;
  allowanceLabel: string;
  badge?: string;
  description: string;
  features: string[];
  cta: string;
  href?: "/app/find" | "/login";
}) {
  return (
    <article className={cn("border-t pt-8", href ? "border-copper/40" : "border-ivory/12 opacity-80")}>
      <p className="leader">
        <span className="flex items-baseline gap-3">
          <span className="font-display text-display-3 text-ivory">{name}</span>
          {badge ? (
            <span className="font-mono text-[0.625rem] lowercase tracking-[0.16em] text-faint">{badge}</span>
          ) : null}
        </span>
        <span className="leader-fill" aria-hidden />
        <span className="shrink-0 font-mono text-4xl tabular-nums text-ivory">{allowance}</span>
      </p>
      <p className="mt-2 text-right font-mono text-[0.6875rem] lowercase tracking-[0.16em] text-faint">
        {allowanceLabel}
      </p>

      <p className="mt-7 max-w-measure leading-8 text-muted text-pretty">{description}</p>

      <ul className="mt-8 space-y-3.5">
        {features.map((feature) => (
          <li key={feature} className="flex gap-4 text-sm leading-7 text-ivory/80">
            <span className="mt-3 h-px w-4 shrink-0 bg-copper/60" aria-hidden />
            <span className="text-pretty">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-10">
        {href ? (
          <Link href={href} className="inline-block">
            <Button>{cta}</Button>
          </Link>
        ) : (
          <p className="font-mono text-xs lowercase tracking-[0.16em] text-faint">{cta}</p>
        )}
      </div>
    </article>
  );
}
