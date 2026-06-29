"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { useI18n } from "@/components/providers/i18n-provider";

export function LandingHero() {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const examples = t.landing.examples;
  const current = examples[index % examples.length];
  const nextExamples = useMemo(() => [1, 2].map((offset) => examples[(index + offset) % examples.length]), [examples, index]);

  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % examples.length), 4200);
    return () => window.clearInterval(timer);
  }, [examples.length, reduceMotion]);

  function move(direction: 1 | -1) {
    setIndex((value) => (value + direction + examples.length) % examples.length);
  }

  return (
    <section className="relative overflow-hidden bg-radial-table px-5 pb-24 pt-7 sm:px-8 lg:min-h-[92vh]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8">
        <Link href="/" className="font-display text-2xl text-ivory" aria-label={t.common.brandHome}>
          DineCue
        </Link>
        <nav aria-label={t.landing.publicNav} className="hidden items-center gap-7 text-sm text-muted sm:flex">
          <a href="#how">{t.landing.how}</a>
          <a href="#trust">{t.landing.trust}</a>
          <Link href="/login" className="text-ivory">
            {t.landing.signIn}
          </Link>
          <LanguageSwitcher compact />
        </nav>
        <div className="sm:hidden">
          <LanguageSwitcher compact />
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-12 pt-20 lg:grid-cols-[1fr_.9fr] lg:items-center lg:pt-24">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber/25 bg-amber/10 px-4 py-2 text-sm text-amber">
            <Sparkles size={16} aria-hidden /> {t.landing.eyebrow}
          </p>
          <h1 className="max-w-3xl font-display text-6xl leading-[0.95] text-ivory text-balance sm:text-7xl lg:text-8xl">
            {t.landing.heroTitle}
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-muted sm:text-xl">
            {t.landing.heroBody}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/login">
              <Button>
                {t.landing.start} <ArrowRight size={18} aria-hidden />
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
          <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber/20 blur-3xl sm:h-[28rem] sm:w-[28rem]" aria-hidden />
          <div className="relative glass rounded-[2rem] p-4 sm:p-5">
            <div className="absolute right-8 top-8 h-36 w-36 rounded-full plate-ring opacity-50" aria-hidden />
            <div className="relative rounded-[1.5rem] border border-ivory/10 bg-black/30 p-4 sm:p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-amber">{t.common.mockPreview}</p>
              <p className="mt-4 text-sm text-muted">{t.landing.previewPromptLabel}</p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={current.prompt}
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                  className="mt-2 min-h-[5.5rem] text-xl leading-snug text-ivory sm:text-2xl"
                >
                  {current.prompt}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="relative mt-4 overflow-hidden rounded-[1.65rem] border border-ivory/10 bg-black/20 p-4 sm:p-5">
              <AnimatePresence mode="popLayout">
                <motion.article
                  key={current.place}
                  initial={reduceMotion ? false : { opacity: 0, y: 28, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -18, scale: 0.98 }}
                  transition={{ duration: 0.45 }}
                  className="relative z-10 rounded-[1.35rem] border border-amber/20 bg-gradient-to-br from-ivory/[0.12] to-ivory/[0.04] p-5 shadow-glow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-[0.24em] text-amber">{t.landing.previewRank} 01</p>
                      <h2 className="mt-2 truncate text-2xl font-semibold text-ivory">{current.place}</h2>
                      <p className="mt-2 text-sm leading-6 text-muted">{current.vibe}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-sage/20 px-3 py-1.5 text-xs text-sage">
                      {current.match} {t.landing.previewMatch}
                    </span>
                  </div>
                  <p className="mt-4 min-h-[3rem] text-sm leading-6 text-ivory/85">{current.reason}</p>
                </motion.article>
              </AnimatePresence>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {nextExamples.map((card, offset) => (
                  <motion.div
                    key={`${card.place}-${offset}`}
                    initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 0.72, y: 0 }}
                    className="rounded-2xl border border-ivory/10 bg-ivory/[0.045] p-4"
                  >
                    <p className="text-xs uppercase tracking-[0.2em] text-muted">{t.landing.previewRank} 0{offset + 2}</p>
                    <p className="mt-2 truncate font-semibold text-ivory">{card.place}</p>
                    <p className="mt-1 truncate text-sm text-muted">{card.vibe}</p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between gap-4">
                <div className="flex gap-1.5" aria-hidden>
                  {examples.slice(0, 8).map((example, dotIndex) => (
                    <span key={example.place} className={`h-1.5 rounded-full transition-all ${dotIndex === index % 8 ? "w-6 bg-amber" : "w-1.5 bg-ivory/20"}`} />
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
