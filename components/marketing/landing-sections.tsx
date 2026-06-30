"use client";

import Link from "next/link";
import { ArrowRight, Check, Compass, MapPin, MessageCircle, ScanLine, Search, ShieldCheck, Utensils } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/providers/i18n-provider";
import { getMe } from "@/lib/api/auth";

const icons = [Compass, MapPin, Check];
const capabilityIcons = [Search, ScanLine, Utensils];
const differenceIcons = [MapPin, MessageCircle, Utensils];

export function LandingSections() {
  const { t } = useI18n();
  const me = useQuery({ queryKey: ["me"], queryFn: getMe, retry: false });
  const isSignedIn = me.isSuccess && Boolean(me.data);
  const primaryHref = isSignedIn ? "/app/find" : "/login";
  const primaryLabel = isSignedIn ? t.landing.findPlaceCta : t.landing.sections.cta;

  return (
    <>
      <section id="how" className="bg-charcoal px-5 py-24 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.85fr_1fr] lg:items-center">
          <div>
            <p className="text-sm tracking-[0.28em] text-amber">{t.landing.sections.howEyebrow}</p>
            <h2 className="mt-4 max-w-3xl font-display text-4xl text-ivory sm:text-5xl">{t.landing.sections.howTitle}</h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-muted">{t.landing.sections.howBody}</p>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3">
            {t.landing.thinkingFactors.map((factor, index) => (
              <div key={factor} className="border-t border-ivory/10 pt-4">
                <span className="text-xs tracking-[0.22em] text-amber">0{index + 1}</span>
                <p className="mt-3 text-lg font-semibold text-ivory">{factor}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-graphite px-5 py-24 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.75fr_1fr] lg:items-start">
          <div>
            <p className="text-sm tracking-[0.28em] text-sage">{t.landing.sections.featuresEyebrow}</p>
            <h2 className="mt-4 font-display text-4xl text-ivory sm:text-5xl">{t.landing.sections.featuresTitle}</h2>
            <p className="mt-5 text-lg leading-8 text-muted">{t.landing.sections.featuresBody}</p>
          </div>
          <div className="space-y-8">
            {t.landing.features.map((feature, index) => {
              const Icon = icons[index] || Check;
              return (
                <article key={feature.title} className="flex gap-5 border-t border-ivory/10 pt-6">
                  <span className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ivory/7 text-amber">
                    <Icon size={19} aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold text-ivory">{feature.title}</h3>
                    <p className="mt-2 max-w-2xl leading-7 text-muted">{feature.text}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-midnight px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm tracking-[0.28em] text-sage">{t.landing.sections.capabilitiesEyebrow}</p>
            <h2 className="mt-4 font-display text-4xl text-ivory sm:text-5xl">{t.landing.sections.capabilitiesTitle}</h2>
            <p className="mt-5 text-lg leading-8 text-muted">{t.landing.sections.capabilitiesBody}</p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {t.landing.capabilities.map((capability, index) => {
              const Icon = capabilityIcons[index] || Check;
              return (
                <motion.article
                  key={capability.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.45, delay: index * 0.06 }}
                  className="rounded-[1.5rem] border border-ivory/10 bg-ivory/[0.045] p-6"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-amber/12 text-amber">
                    <Icon size={20} aria-hidden />
                  </span>
                  <h3 className="mt-5 text-xl font-semibold text-ivory">{capability.title}</h3>
                  <p className="mt-3 leading-7 text-muted">{capability.text}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-graphite px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[.7fr_1fr] lg:items-end">
            <div>
              <p className="text-sm tracking-[0.28em] text-amber">{t.landing.sections.differenceEyebrow}</p>
              <h2 className="mt-4 font-display text-4xl text-ivory sm:text-5xl">{t.landing.sections.differenceTitle}</h2>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-muted lg:justify-self-end">{t.landing.sections.differenceBody}</p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {t.landing.difference.map((item, index) => {
              const Icon = differenceIcons[index] || Check;
              return (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.45, delay: index * 0.07 }}
                  className="border-t border-ivory/10 pt-6"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-ivory/7 text-amber">
                    <Icon size={20} aria-hidden />
                  </span>
                  <h3 className="mt-5 text-2xl font-bold text-ivory">{item.title}</h3>
                  <p className="mt-4 leading-7 text-muted">{item.text}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-charcoal px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm tracking-[0.28em] text-amber">{t.landing.sections.plansEyebrow}</p>
            <h2 className="mt-4 font-display text-4xl text-ivory sm:text-5xl">{t.landing.sections.plansTitle}</h2>
            <p className="mt-5 text-lg leading-8 text-muted">{t.landing.sections.plansBody}</p>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            <PlanCard
              name={t.landing.plans.free.name}
              description={t.landing.plans.free.description}
              features={t.landing.plans.free.features}
              cta={t.landing.plans.free.cta}
              href={primaryHref}
              highlighted
            />
            <PlanCard
              name={t.landing.plans.pro.name}
              badge={t.landing.plans.pro.badge}
              description={t.landing.plans.pro.description}
              features={t.landing.plans.pro.features}
              cta={t.landing.plans.pro.cta}
            />
          </div>
        </div>
      </section>

      <section className="bg-charcoal px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm tracking-[0.28em] text-amber">{t.landing.sections.scenariosEyebrow}</p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl text-ivory sm:text-5xl">{t.landing.sections.scenariosTitle}</h2>
          <div className="mt-12 grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
            {t.landing.scenarios.map((scenario) => (
              <article key={scenario.title} className="border-l border-amber/25 pl-5">
                <h3 className="text-xl font-semibold text-ivory">{scenario.title}</h3>
                <p className="mt-3 leading-7 text-muted">{scenario.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="trust" className="bg-midnight px-5 py-24 sm:px-8">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[auto_1fr] lg:items-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-sage/12 text-sage">
            <ShieldCheck size={27} aria-hidden />
          </span>
          <div>
            <p className="text-sm tracking-[0.28em] text-amber">{t.landing.sections.trustEyebrow}</p>
            <h2 className="mt-4 font-display text-4xl text-ivory sm:text-5xl">{t.landing.sections.trustTitle}</h2>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">{t.landing.sections.trustBody}</p>
            <Link href={primaryHref} className="mt-9 inline-block">
              <Button>
                {primaryLabel} <ArrowRight size={18} aria-hidden />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function PlanCard({
  name,
  badge,
  description,
  features,
  cta,
  href,
  highlighted = false
}: {
  name: string;
  badge?: string;
  description: string;
  features: string[];
  cta: string;
  href?: "/app/find" | "/login";
  highlighted?: boolean;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.45 }}
      className={`rounded-[1.75rem] border p-6 sm:p-7 ${highlighted ? "border-amber/30 bg-amber/[0.075]" : "border-ivory/10 bg-ivory/[0.045]"}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-4xl text-ivory">{name}</h3>
          <p className="mt-4 max-w-xl leading-7 text-muted">{description}</p>
        </div>
        {badge ? <span className="shrink-0 rounded-full border border-sage/20 bg-sage/10 px-3 py-1.5 text-xs font-semibold text-sage">{badge}</span> : null}
      </div>
      <ul className="mt-7 space-y-3">
        {features.map((feature) => (
          <li key={feature} className="flex gap-3 text-sm leading-6 text-ivory/85">
            <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-amber/12 text-amber">
              <Check size={13} aria-hidden />
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      {href ? (
        <Link href={href} className="mt-8 inline-block">
          <Button>
            {cta} <ArrowRight size={18} aria-hidden />
          </Button>
        </Link>
      ) : (
        <Button className="mt-8" variant="secondary" type="button" disabled>
          {cta}
        </Button>
      )}
    </motion.article>
  );
}
