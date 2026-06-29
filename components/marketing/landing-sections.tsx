"use client";

import Link from "next/link";
import { ArrowRight, LockKeyhole, MapPin, MessageCircle, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/providers/i18n-provider";

const icons = [MessageCircle, MapPin, Utensils, LockKeyhole];

export function LandingSections() {
  const { t } = useI18n();

  return (
    <>
      <section id="how" className="bg-charcoal px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm uppercase tracking-[0.28em] text-amber">{t.landing.sections.howEyebrow}</p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl text-ivory sm:text-5xl">{t.landing.sections.howTitle}</h2>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {t.landing.steps.map((step, index) => (
              <article key={step.title} className="glass rounded-[1.5rem] p-6">
                <span className="text-sm text-amber">0{index + 1}</span>
                <h3 className="mt-5 text-xl font-semibold text-ivory">{step.title}</h3>
                <p className="mt-3 leading-7 text-muted">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-graphite px-5 py-24 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.8fr_1fr] lg:items-start">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-sage">{t.landing.sections.featuresEyebrow}</p>
            <h2 className="mt-4 font-display text-4xl text-ivory sm:text-5xl">{t.landing.sections.featuresTitle}</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {t.landing.features.map((feature, index) => {
              const Icon = icons[index] || MessageCircle;
              return (
                <article key={feature.title} className="rounded-[1.5rem] border border-ivory/10 bg-ivory/[0.04] p-6">
                  <Icon className="text-amber" size={24} aria-hidden />
                  <h3 className="mt-5 text-lg font-semibold text-ivory">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{feature.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <section id="trust" className="bg-midnight px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm uppercase tracking-[0.28em] text-amber">{t.landing.sections.trustEyebrow}</p>
          <h2 className="mt-4 font-display text-4xl text-ivory sm:text-5xl">{t.landing.sections.trustTitle}</h2>
          <p className="mt-6 text-lg leading-8 text-muted">{t.landing.sections.trustBody}</p>
          <Link href="/login" className="mt-9 inline-block">
            <Button>
              {t.landing.sections.cta} <ArrowRight size={18} aria-hidden />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
