"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { useI18n } from "@/components/providers/i18n-provider";
import { getMe } from "@/lib/api/auth";
import { BrandLink } from "@/components/brand/brand-link";

export function LandingHero() {
  const { language, t } = useI18n();
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const me = useQuery({ queryKey: ["me"], queryFn: getMe, retry: false });
  const examples = t.landing.examples;
  const current = examples[index % examples.length];
  const reasons = useMemo(() => [current.vibe, current.reason, current.prompt].filter(Boolean).slice(0, 3), [current]);
  const isSignedIn = me.isSuccess && Boolean(me.data);
  const primaryHref = isSignedIn ? "/app/find" : "/login";
  const primaryLabel = isSignedIn ? t.landing.findPlaceCta : t.landing.start;

  useEffect(() => {
    setIndex(0);
  }, [language]);

  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % examples.length), 4200);
    return () => window.clearInterval(timer);
  }, [examples.length, language, reduceMotion]);

  function move(direction: 1 | -1) {
    setIndex((value) => (value + direction + examples.length) % examples.length);
  }

  return (
    <section className="relative overflow-hidden bg-[#0d0d0f] px-5 pb-24 pt-7 sm:px-8 lg:min-h-[92vh]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(212,138,69,.18),transparent_30%),radial-gradient(circle_at_78%_30%,rgba(145,160,107,.12),transparent_28%)]" aria-hidden />
      <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(244,239,228,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(244,239,228,.8)_1px,transparent_1px)] [background-size:44px_44px]" aria-hidden />
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8">
        <BrandLink />
        <nav aria-label={t.landing.publicNav} className="hidden items-center gap-7 text-sm text-muted sm:flex">
          <a href="#how">{t.landing.how}</a>
          <a href="#trust">{t.landing.trust}</a>
          <Link href={primaryHref} className="text-ivory">
            {isSignedIn ? t.landing.continue : t.landing.signIn}
          </Link>
          <LanguageSwitcher compact />
        </nav>
        <div className="sm:hidden">
          <LanguageSwitcher compact />
        </div>
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-14 pt-20 lg:grid-cols-[1fr_.92fr] lg:items-center lg:pt-24">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <p className="mb-6 inline-flex items-center gap-2 text-sm text-amber">
            <span className="h-px w-9 bg-amber/60" aria-hidden />
            {t.landing.eyebrow}
          </p>
          <h1 className="max-w-3xl font-display text-6xl leading-[0.92] text-ivory text-balance sm:text-7xl lg:text-8xl">
            {t.landing.heroTitle}
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-muted sm:text-xl">
            {t.landing.heroBody}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href={primaryHref}>
              <Button>
                {primaryLabel} <ArrowRight size={18} aria-hidden />
              </Button>
            </Link>
            <a href="#how">
              <Button variant="secondary" type="button">
                {t.landing.seeHow}
              </Button>
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative mx-auto w-full max-w-xl"
          aria-label={t.landing.previewLabel}
        >
          <div className="absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-copper/10 blur-3xl" aria-hidden />
          <div className="relative rounded-[2.25rem] border border-ivory/10 bg-[#171411]/85 p-4 shadow-glass backdrop-blur-xl sm:p-6">
            <div className="absolute right-8 top-8 h-32 w-32 rounded-full border border-amber/15 opacity-50" aria-hidden />
            <div className="relative border-b border-ivory/10 pb-5">
              <p className="text-xs tracking-[0.24em] text-amber">{t.common.mockPreview}</p>
              <p className="mt-5 text-sm text-muted">{t.landing.previewMood}</p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={`${language}-${current.prompt}`}
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                  className="mt-2 min-h-[5.5rem] text-2xl leading-snug text-ivory sm:text-3xl"
                >
                  {current.prompt}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="relative pt-6">
              <AnimatePresence mode="popLayout">
                <motion.article
                  key={`${language}-${current.place}`}
                  initial={reduceMotion ? false : { opacity: 0, y: 28, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -18, scale: 0.98 }}
                  transition={{ duration: 0.45 }}
                  className="relative z-10"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs tracking-[0.24em] text-amber">{t.landing.previewRank}</p>
                      <h2 className="mt-2 text-3xl font-semibold text-ivory">{current.place}</h2>
                      <p className="mt-3 flex items-center gap-2 text-sm text-muted">
                        <MapPin size={15} className="text-amber/75" aria-hidden />
                        {t.landing.previewLocation}
                      </p>
                    </div>
                    <motion.span
                      initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="shrink-0 rounded-full bg-sage/15 px-3 py-2 text-xs text-sage"
                    >
                      {current.match} {t.landing.previewMatch}
                    </motion.span>
                  </div>
                  <div className="mt-6">
                    <p className="text-xs tracking-[0.22em] text-muted">{t.landing.previewWhy}</p>
                    <ul className="mt-4 space-y-3">
                      {reasons.map((reason) => (
                        <li key={`${language}-${reason}`} className="flex gap-3 text-sm leading-6 text-ivory/85">
                          <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-amber/12 text-amber">
                            <Check size={13} aria-hidden />
                          </span>
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.article>
              </AnimatePresence>

              <div className="mt-5 flex items-center justify-between gap-4">
                <div className="flex gap-1.5" aria-hidden>
                  {examples.slice(0, 8).map((example, dotIndex) => (
                    <span key={`${language}-${example.place}`} className={`h-1.5 rounded-full transition-all ${dotIndex === index % 8 ? "w-6 bg-amber" : "w-1.5 bg-ivory/20"}`} />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => move(-1)}
                    aria-label={t.common.previous}
                    className="grid h-10 w-10 place-items-center rounded-full border border-ivory/10 bg-ivory/7 text-ivory transition hover:bg-ivory/12"
                  >
                    <ArrowLeft size={17} aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(1)}
                    aria-label={t.common.next}
                    className="grid h-10 w-10 place-items-center rounded-full border border-ivory/10 bg-ivory/7 text-ivory transition hover:bg-ivory/12"
                  >
                    <ArrowRight size={17} aria-hidden />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
