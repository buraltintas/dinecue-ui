"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, ExternalLink, HelpCircle, MapPin, Minus, Phone, ScanLine, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/providers/i18n-provider";
import { cn } from "@/lib/utils";
import type { RestaurantFitCheckResponse } from "@/lib/types";

export function FitCheckReport({
  report,
  placeName,
  address,
  placeId,
  onCheckAnother
}: {
  report: RestaurantFitCheckResponse;
  placeName: string;
  address: string;
  placeId: string;
  onCheckAnother: () => void;
}) {
  const { t } = useI18n();
  const score = Math.round(Math.min(Math.max(report.fitScore, 0), 100));
  // Same bands as recommendation confidence, so a score reads consistently across the product.
  const strength = score >= 82 ? "strong" : score >= 68 ? "good" : "possible";
  // confidence is a 0..1 fraction, exactly like a recommendation card's.
  const confidencePercent = Math.round(Math.min(Math.max(report.confidence, 0), 1) * 100);
  const signals = readSignals(report.relevantSignals);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="glass rounded-panel p-5 sm:p-8">
      <header>
        <p className="eyebrow text-copper">{t.fitCheck.resultEyebrow}</p>
        <h1 className="mt-3 font-display text-display-2 text-ivory text-balance">{placeName}</h1>
        <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-muted">
          <MapPin className="mt-0.5 shrink-0 text-copper" size={16} aria-hidden />
          {address}
        </p>
      </header>

      <section className="mt-7 border-t border-ivory/10 pt-5" aria-label={`${report.verdict} ${score}`}>
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-sm font-semibold text-ivory">{report.verdict}</p>
          <p className="font-mono text-2xl tabular-nums text-ivory">
            {score}
            <span className="text-sm text-faint">/100</span>
          </p>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-pill bg-ivory/10">
          <motion.span
            className={cn(
              "block h-full rounded-pill",
              strength === "strong" ? "bg-sage" : strength === "good" ? "bg-amber" : "bg-copper"
            )}
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <p className="mt-2 font-mono text-xs text-faint">
          {t.fitCheck.confidence}: {confidencePercent}%
        </p>
      </section>

      <p className="mt-6 max-w-measure text-lead text-ivory/90 text-pretty">{report.summary}</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {report.pros.length > 0 ? (
          <section className="rounded-card border border-sage/25 bg-sage/[0.07] p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-ivory">
              <CheckCircle2 size={16} className="text-sage" aria-hidden />
              {t.fitCheck.pros}
            </h2>
            <ul className="mt-3 space-y-2">
              {report.pros.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-ivory/85">
                  <span className="mt-2.5 h-px w-4 shrink-0 bg-sage/70" aria-hidden />
                  <span className="text-pretty">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {report.cons.length > 0 ? (
          <section className="rounded-card border border-wine/35 bg-wine/[0.14] p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-ivory">
              <TriangleAlert size={16} className="text-amber" aria-hidden />
              {t.fitCheck.cons}
            </h2>
            <ul className="mt-3 space-y-2">
              {report.cons.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-ivory/85">
                  <span className="mt-2.5 h-px w-4 shrink-0 bg-amber/70" aria-hidden />
                  <span className="text-pretty">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>

      {report.questionsToAsk.length > 0 ? (
        <section className="mt-6 rounded-card border border-ivory/10 bg-ivory/[0.035] p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-ivory">
            <HelpCircle size={16} className="text-copper" aria-hidden />
            {t.fitCheck.questions}
          </h2>
          <ul className="mt-3 space-y-2">
            {report.questionsToAsk.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-6 text-muted">
                <span className="mt-2.5 h-px w-4 shrink-0 bg-copper/70" aria-hidden />
                <span className="text-pretty">{item}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* Shows which signals actually moved the score, so the verdict is inspectable rather than a black box. */}
      {signals.length > 0 ? (
        <section className="mt-6">
          <h2 className="eyebrow text-faint">{t.fitCheck.signals}</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {signals.map((signal) => (
              <li
                key={signal.name}
                className={cn(
                  "inline-flex items-center gap-2 rounded-pill border px-3 py-1.5 text-xs",
                  signal.impact === "positive"
                    ? "border-sage/35 bg-sage/[0.1] text-ivory"
                    : signal.impact === "negative"
                      ? "border-wine/45 bg-wine/[0.18] text-ivory"
                      : "border-ivory/12 bg-ivory/[0.05] text-muted"
                )}
              >
                {signal.impact === "positive" ? (
                  <CheckCircle2 size={12} aria-hidden />
                ) : signal.impact === "negative" ? (
                  <TriangleAlert size={12} aria-hidden />
                ) : (
                  <Minus size={12} aria-hidden />
                )}
                <span className="font-mono">{signal.name}</span>
                {signal.value ? <span className="text-faint">{signal.value}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-6 rounded-card border border-ivory/10 bg-black/25 p-5">
        <h2 className="text-sm font-semibold text-ivory">{t.fitCheck.reservationAdvice}</h2>
        <p className="mt-2 leading-7 text-muted text-pretty">{report.reservationAdvice}</p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {report.reservation?.url ? (
            <a href={report.reservation.url} target="_blank" rel="noreferrer" className="w-full sm:w-auto">
              <Button type="button" size="md" className="w-full sm:w-auto">
                {t.recommendations.openPlace}
                <ExternalLink size={15} aria-hidden />
              </Button>
            </a>
          ) : null}
          {report.reservation?.phoneNumber ? (
            <a href={`tel:${report.reservation.phoneNumber.replace(/\s/g, "")}`} className="w-full sm:w-auto">
              <Button type="button" variant="secondary" size="md" className="w-full sm:w-auto">
                {report.reservation.phoneNumber}
                <Phone size={15} aria-hidden />
              </Button>
            </a>
          ) : null}
        </div>
      </section>

      <div className="mt-8 flex flex-col gap-3 border-t border-ivory/10 pt-6 sm:flex-row sm:flex-wrap">
        <Button type="button" variant="secondary" size="lg" className="w-full sm:w-auto" onClick={onCheckAnother}>
          {t.fitCheck.checkAnother}
        </Button>
        {/* Natural next step: they are deciding on this place, and the menu is the other half of that decision. */}
        <Link href={{ pathname: "/app/menu-scan", query: { placeId } }} className="w-full sm:w-auto">
          <Button type="button" variant="ghost" size="lg" className="w-full sm:w-auto">
            {t.fitCheck.scanItsMenu}
            <ScanLine size={16} aria-hidden />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

type Signal = { name: string; value?: string; impact: "positive" | "negative" | "neutral" };

/**
 * The live analyzer returns `{ value, impact }` per signal; the local mock returns bare scalars.
 * Read both shapes rather than assuming one.
 */
function readSignals(raw: Record<string, unknown>): Signal[] {
  return Object.entries(raw || {})
    .map(([name, value]) => {
      if (value && typeof value === "object" && !Array.isArray(value)) {
        const record = value as { value?: unknown; impact?: unknown };
        const impact: Signal["impact"] =
          record.impact === "positive" || record.impact === "negative" ? record.impact : "neutral";
        return { name, value: record.value == null ? undefined : String(record.value), impact };
      }
      return { name, value: value == null ? undefined : String(value), impact: "neutral" as const };
    })
    .slice(0, 8);
}
