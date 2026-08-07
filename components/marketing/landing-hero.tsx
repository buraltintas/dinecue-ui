"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MapPin } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { CourseRule } from "@/components/ui/section";
import { Slogan } from "@/components/brand/slogan";
import { LeaderLoader } from "@/components/ui/leader-loader";
import { useI18n } from "@/components/providers/i18n-provider";
import { useViewer } from "@/components/providers/use-viewer";

/**
 * The hero is a menu spread: the thesis on the left leaf, a live entry on the
 * right leaf, divided by a rule. No card, no glass, no shadow — the structure
 * is carried by type and hairlines, the way a printed menu carries it.
 */
export function LandingHero() {
  const { language, t } = useI18n();
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const { isSignedIn, isResolving, primaryHref } = useViewer();
  const examples = t.landing.examples;
  const current = examples[index % examples.length];
  const reasons = useMemo(() => [current.vibe, current.reason].filter(Boolean), [current]);
  const primaryLabel = isSignedIn ? t.landing.findPlaceCta : t.landing.start;

  useEffect(() => {
    setIndex(0);
  }, [language]);

  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % examples.length), 5600);
    return () => window.clearInterval(timer);
  }, [examples.length, language, reduceMotion]);

  return (
    <section className="bg-night pb-section-sm pt-12 sm:pt-20">
      <div className="container-page grid gap-14 lg:grid-cols-[1.08fr_1fr] lg:gap-0">
        <div className="lg:pr-16">
          <h1 className="max-w-[10ch] text-display-1 text-ivory text-balance">
            <Slogan text={t.landing.heroTitle} warming />
          </h1>

          <p className="mt-8 max-w-md text-lead text-muted text-pretty">{t.landing.heroBody}</p>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            {isResolving ? (
              <Button size="lg" type="button" disabled aria-busy className="min-w-40 text-graphite">
                <LeaderLoader label={t.common.preparing} />
              </Button>
            ) : (
              <Link href={primaryHref}>
                <Button size="lg" className="min-w-40">
                  {primaryLabel}
                </Button>
              </Link>
            )}
            <a
              href="#how"
              className="text-sm text-muted underline decoration-copper/40 underline-offset-[6px] transition hover:text-ivory hover:decoration-copper"
            >
              {t.landing.seeHow}
            </a>
          </div>

          <p className="mt-12 max-w-md text-sm leading-7 text-faint text-pretty">{t.landing.heroSubtitle}</p>
        </div>

        {/* The right leaf. The vertical rule is the fold of the menu. */}
        <div className="lg:border-l lg:border-ivory/10 lg:pl-16">
          <CourseRule label={t.common.mockPreview} />

          <div className="mt-8 min-h-[7.5rem] sm:min-h-[9rem]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={`${language}-${current.prompt}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.4 }}
                className="font-display text-[1.6rem] italic leading-[1.35] text-ivory text-pretty sm:text-[2rem]"
              >
                “{current.prompt}”
              </motion.p>
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${language}-${current.place}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.4 }}
              className="mt-10 border-t border-ivory/10 pt-7"
            >
              <div className="flex items-baseline justify-between gap-4 font-mono text-[0.6875rem] lowercase tracking-[0.16em] text-faint">
                <span>{t.landing.previewRank}</span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={12} className="text-copper" aria-hidden />
                  {t.landing.previewLocation}
                </span>
              </div>

              <p className="leader mt-4">
                <span className="font-display text-2xl text-ivory sm:text-[1.75rem]">{current.place}</span>
                <span className="leader-fill" aria-hidden />
                <span className="shrink-0 font-mono text-lg tabular-nums text-amber">{current.match}</span>
              </p>

              <p className="mt-8 font-mono text-[0.6875rem] lowercase tracking-[0.16em] text-faint">
                {t.landing.previewWhy}
              </p>
              <ul className="mt-4 min-h-[5.5rem] space-y-3">
                {reasons.map((reason) => (
                  <li key={`${language}-${reason}`} className="flex gap-4 text-sm leading-7 text-ivory/85">
                    <span className="mt-3.5 h-px w-5 shrink-0 bg-copper/60" aria-hidden />
                    <span className="text-pretty">{reason}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>

          {/* The segments are the control as well as the indicator: a hairline
              per example, with a 44px hit area around each. */}
          <div className="mt-8 flex items-center gap-3">
            {examples.slice(0, 8).map((example, dotIndex) => (
              <button
                key={`${language}-${example.place}`}
                type="button"
                onClick={() => setIndex(dotIndex)}
                aria-label={`${t.common.mockPreview} ${dotIndex + 1}`}
                aria-current={dotIndex === index % 8 ? "true" : undefined}
                className="group flex-1 py-5"
              >
                <span
                  className={`block h-px transition-colors duration-700 ${
                    dotIndex === index % 8 ? "bg-copper" : "bg-ivory/20 group-hover:bg-ivory/40"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
