"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Bookmark, BookmarkCheck, ExternalLink, MapPin, Navigation, Share2, Utensils, X } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { saveRecommendation, unsaveRecommendation } from "@/lib/api/recommendations";
import { getSavedPlaces } from "@/lib/api/profile";
import type { RecommendationCardDto, SavedPlaceDto } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/providers/i18n-provider";
import { ApiClientError } from "@/lib/api/http";
import { cn } from "@/lib/utils";

export function RecommendationCard({ card, index }: { card: RecommendationCardDto; index: number }) {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();
  const queryClient = useQueryClient();
  const [savedLocally, setSavedLocally] = useState(false);
  const [saveError, setSaveError] = useState("");
  const savedPlaces = useQuery({
    queryKey: ["saved-places"],
    queryFn: getSavedPlaces,
    staleTime: 0,
    refetchOnMount: "always"
  });
  const isSaved =
    savedLocally ||
    savedPlaces.data?.some((place) => place.recommendationResultId === card.id) ||
    false;
  const saveMutation = useMutation({
    mutationFn: () => saveRecommendation(card.id),
    onMutate: () => {
      setSaveError("");
    },
    onSuccess: (savedPlace) => {
      setSavedLocally(true);
      queryClient.setQueryData<SavedPlaceDto[] | undefined>(["saved-places"], (current) => {
        if (!current) return [savedPlace];
        if (current.some((place) => place.recommendationResultId === card.id)) return current;
        return [savedPlace, ...current];
      });
      queryClient.invalidateQueries({ queryKey: ["saved-places"] });
    },
    onError: (error) => {
      setSaveError(error instanceof ApiClientError && error.status === 401 ? t.errors.signInAgain : t.common.saveFailed);
    }
  });
  const unsaveMutation = useMutation({
    mutationFn: () => unsaveRecommendation(card.id),
    onMutate: () => {
      setSaveError("");
    },
    onSuccess: () => {
      setSavedLocally(false);
      queryClient.setQueryData<SavedPlaceDto[] | undefined>(["saved-places"], (current) =>
        current?.filter((place) => place.recommendationResultId !== card.id)
      );
      queryClient.invalidateQueries({ queryKey: ["saved-places"] });
    },
    onError: (error) => {
      setSaveError(error instanceof ApiClientError && error.status === 401 ? t.errors.signInAgain : t.common.unsaveFailed);
    }
  });
  const saveBusy = saveMutation.isPending || unsaveMutation.isPending;
  const confidencePercent = Math.round(card.confidence * 100);
  const strength = confidencePercent >= 82 ? "strong" : confidencePercent >= 68 ? "good" : "possible";
  const confidenceLabel =
    strength === "strong"
      ? t.recommendations.strongMatch
      : strength === "good"
        ? t.recommendations.goodMatch
        : t.recommendations.possibleMatch;
  const matchSignals = [
    card.vibe,
    card.whyThisPlace,
    card.goodToKnow,
    card.whatToOrder?.length ? `${t.recommendations.orderSignal}: ${card.whatToOrder.slice(0, 2).join(", ")}` : null,
    card.reservation?.url || card.routeUrl ? t.recommendations.reservationSignal : null
  ]
    .filter(Boolean)
    .slice(0, 4) as string[];

  async function share() {
    if (navigator.share) {
      await navigator.share({ title: card.placeName, text: card.shareText }).catch(() => null);
      return;
    }
    await navigator.clipboard?.writeText(card.shareText).catch(() => null);
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: reduceMotion ? 0 : index * 0.1, duration: reduceMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="glass overflow-hidden rounded-panel p-5 sm:p-8"
    >
      <header>
        <p className="eyebrow text-copper">
          {t.recommendations.pick} {card.rank}
        </p>
        <h2 className="mt-3 font-display text-display-2 text-ivory text-balance">{card.placeName}</h2>
        <p className="mt-4 max-w-measure text-lead text-ivory/90 text-pretty">
          {card.headline || card.title || card.summary}
        </p>
        <p className="mt-4 flex items-start gap-2 text-sm leading-6 text-muted">
          <MapPin className="mt-0.5 shrink-0 text-copper" size={16} aria-hidden />
          {card.address}
        </p>
      </header>

      {/* Confidence reads as a meter, not a badge: the bar carries the value and
          the word carries the interpretation. */}
      <section className="mt-7 border-t border-ivory/10 pt-5" aria-label={`${confidenceLabel} ${confidencePercent}%`}>
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-sm font-semibold text-ivory">{confidenceLabel}</p>
          <p className="font-mono text-2xl tabular-nums text-ivory">
            {confidencePercent}
            <span className="text-sm text-faint">%</span>
          </p>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-pill bg-ivory/10">
          <motion.span
            className={cn(
              "block h-full rounded-pill",
              strength === "strong" ? "bg-sage" : strength === "good" ? "bg-amber" : "bg-copper"
            )}
            initial={{ width: 0 }}
            animate={{ width: `${confidencePercent}%` }}
            transition={{ duration: reduceMotion ? 0 : 0.7, delay: reduceMotion ? 0 : index * 0.1 + 0.15, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <p className="mt-2 font-mono text-xs text-faint">{t.recommendations.confidence}</p>
      </section>

      <section className="mt-7 rounded-card border border-amber/15 bg-black/25 p-5 sm:p-6">
        <p className="eyebrow text-amber">{t.recommendations.whyMatches}</p>
        <h3 className="mt-3 font-display text-xl text-ivory">{t.recommendations.bestForRequest}</h3>
        <p className="mt-4 max-w-measure leading-7 text-ivory/85 text-pretty">{card.summary}</p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {matchSignals.map((signal) => (
            <li key={signal} className="flex gap-3 text-sm leading-6 text-muted">
              <span className="mt-2.5 h-px w-4 shrink-0 bg-copper/70" aria-hidden />
              <span className="text-pretty">{signal}</span>
            </li>
          ))}
        </ul>
      </section>

      {card.whatToOrder?.length ? (
        <section className="mt-7">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-ivory">
            <Utensils size={16} className="text-copper" aria-hidden />
            {t.recommendations.whatToOrder}
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {card.whatToOrder.map((item) => (
              <span key={item} className="rounded-pill border border-ivory/10 bg-ivory/[0.05] px-3 py-1.5 text-sm text-ivory">
                {item}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-8">
        <h3 className="eyebrow text-faint">{t.recommendations.supportingInsights}</h3>
        <dl className="mt-4 grid gap-6 md:grid-cols-3">
          <Insight title={t.recommendations.vibe} text={card.vibe || t.common.notSpecified} />
          <Insight title={t.recommendations.why} text={card.whyThisPlace || t.common.notSpecified} />
          <Insight title={t.recommendations.goodToKnow} text={card.goodToKnow || t.common.notSpecified} />
        </dl>
      </section>

      {card.cautions?.length ? (
        <p className="mt-7 rounded-card border border-wine/40 bg-wine/20 px-4 py-3 text-sm leading-6 text-muted">
          <span className="font-semibold text-ivory">{t.recommendations.caution}:</span> {card.cautions.join(", ")}
        </p>
      ) : null}

      <div className="mt-8 flex flex-col gap-3 border-t border-ivory/10 pt-6 sm:flex-row sm:flex-wrap sm:items-center">
        {card.reservation?.url ? (
          <a href={card.reservation.url} target="_blank" rel="noreferrer" className="w-full sm:w-auto">
            <Button type="button" size="lg" className="w-full sm:w-auto">
              {t.recommendations.openPlace}
              <ExternalLink size={16} aria-hidden />
            </Button>
          </a>
        ) : null}
        {card.routeUrl ? (
          <a href={card.routeUrl} target="_blank" rel="noreferrer" className="w-full sm:w-auto">
            <Button type="button" variant="secondary" size="lg" className="w-full sm:w-auto">
              {t.common.directions}
              <Navigation size={16} aria-hidden />
            </Button>
          </a>
        ) : null}
        <Button
          type="button"
          variant="secondary"
          size="lg"
          className="w-full sm:w-auto"
          disabled={saveBusy}
          onClick={() => (isSaved ? unsaveMutation.mutate() : saveMutation.mutate())}
        >
          {saveMutation.isPending ? (
            <>
              {t.common.saving} <Bookmark size={16} aria-hidden />
            </>
          ) : unsaveMutation.isPending ? (
            <>
              {t.common.removing} <X size={16} aria-hidden />
            </>
          ) : isSaved ? (
            <>
              {t.common.removeSaved} <BookmarkCheck size={16} aria-hidden />
            </>
          ) : (
            <>
              {t.common.save} <Bookmark size={16} aria-hidden />
            </>
          )}
        </Button>
        <Button type="button" variant="ghost" size="lg" className="w-full sm:w-auto" onClick={share}>
          {t.common.share}
          <Share2 size={16} aria-hidden />
        </Button>
      </div>

      {saveError ? (
        <p className="mt-4 rounded-card border border-wine/40 bg-wine/25 px-4 py-3 text-sm leading-6 text-ivory" role="alert">
          {saveError}
        </p>
      ) : null}
    </motion.article>
  );
}

function Insight({ title, text }: { title: string; text: string }) {
  return (
    <div className="border-t border-ivory/10 pt-4">
      <dt className="text-sm font-semibold text-ivory">{title}</dt>
      <dd className="mt-2 text-sm leading-7 text-muted text-pretty">{text}</dd>
    </div>
  );
}
