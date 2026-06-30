"use client";

import { motion } from "framer-motion";
import { Bookmark, BookmarkCheck, Check, ExternalLink, Info, MapPin, Navigation, Share2, Sparkles, Utensils, X, type LucideIcon } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { saveRecommendation, unsaveRecommendation } from "@/lib/api/recommendations";
import { getSavedPlaces } from "@/lib/api/profile";
import type { RecommendationCardDto, SavedPlaceDto } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/providers/i18n-provider";
import { ApiClientError } from "@/lib/api/http";

export function RecommendationCard({ card, index }: { card: RecommendationCardDto; index: number }) {
  const { t } = useI18n();
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
  const confidenceLabel =
    confidencePercent >= 82
      ? t.recommendations.strongMatch
      : confidencePercent >= 68
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
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.12, duration: 0.5 }}
      whileHover={{ y: -2 }}
      className="glass overflow-hidden rounded-[2rem] p-5 sm:p-8"
    >
      <header className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
        <div className="min-w-0">
          <p className="text-xs tracking-[0.28em] text-amber">{t.recommendations.pick} {card.rank}</p>
          <h2 className="mt-3 font-display text-4xl leading-tight text-ivory sm:text-5xl">{card.placeName}</h2>
          <p className="mt-4 max-w-3xl text-xl leading-8 text-ivory/90 sm:text-2xl">{card.headline || card.title || card.summary}</p>
          <p className="mt-4 flex items-start gap-2 text-sm leading-6 text-muted">
            <MapPin className="mt-0.5 shrink-0 text-amber/80" size={16} aria-hidden />
            {card.address}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.12 + 0.15, duration: 0.35 }}
          className="w-full rounded-[1.35rem] border border-sage/20 bg-sage/10 p-4 text-left sm:w-44"
          aria-label={`${confidenceLabel} ${confidencePercent}%`}
        >
          <p className="text-sm font-semibold text-sage">{confidenceLabel}</p>
          <p className="mt-2 font-display text-4xl leading-none text-ivory">{confidencePercent}%</p>
          <p className="mt-2 text-xs text-muted">{t.recommendations.confidence}</p>
        </motion.div>
      </header>

      <section className="mt-8 rounded-[1.65rem] border border-amber/15 bg-black/20 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-amber/15 text-amber">
            <Sparkles size={18} aria-hidden />
          </span>
          <div>
            <p className="text-xs tracking-[0.24em] text-amber">{t.recommendations.whyMatches}</p>
            <h3 className="mt-1 text-xl font-semibold text-ivory">{t.recommendations.bestForRequest}</h3>
          </div>
        </div>
        <p className="mt-5 max-w-3xl text-base leading-7 text-ivory/85">{card.summary}</p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {matchSignals.map((signal) => (
            <li key={signal} className="flex gap-3 text-sm leading-6 text-muted">
              <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-sage/15 text-sage">
                <Check size={13} aria-hidden />
              </span>
              <span>{signal}</span>
            </li>
          ))}
        </ul>
      </section>

      {card.whatToOrder?.length ? (
        <section className="mt-7">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-ivory">
            <Utensils size={17} className="text-amber" aria-hidden />
            {t.recommendations.whatToOrder}
          </h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {card.whatToOrder.map((item) => (
              <span key={item} className="rounded-full bg-ivory/7 px-3 py-1.5 text-sm text-ivory">
                {item}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-8">
        <h3 className="text-sm font-semibold text-ivory">{t.recommendations.supportingInsights}</h3>
        <div className="mt-4 grid gap-5 md:grid-cols-3">
          <Insight icon={Sparkles} title={t.recommendations.vibe} text={card.vibe || t.common.notSpecified} />
          <Insight icon={Check} title={t.recommendations.why} text={card.whyThisPlace || t.common.notSpecified} />
          <Insight icon={Info} title={t.recommendations.goodToKnow} text={card.goodToKnow || t.common.notSpecified} />
        </div>
      </section>

      {card.cautions?.length ? (
        <p className="mt-6 rounded-2xl bg-wine/15 px-4 py-3 text-sm leading-6 text-muted">
          <span className="font-semibold text-ivory">{t.recommendations.caution}:</span> {card.cautions.join(", ")}
        </p>
      ) : null}

      <div className="mt-8 flex flex-col gap-3 border-t border-ivory/10 pt-6 sm:flex-row sm:flex-wrap">
        {card.reservation?.url ? (
          <a href={card.reservation.url} target="_blank" rel="noreferrer" className="sm:w-auto">
            <motion.span whileTap={{ scale: 0.98 }} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-amber px-6 py-3 text-sm font-semibold text-graphite shadow-glow transition hover:-translate-y-0.5 hover:bg-[#ffd18a] sm:w-auto">
              {t.recommendations.openPlace} <ExternalLink size={16} aria-hidden />
            </motion.span>
          </a>
        ) : null}
        {card.routeUrl ? (
          <a href={card.routeUrl} target="_blank" rel="noreferrer">
            <Button type="button" variant="secondary">
              {t.common.directions} <Navigation size={16} aria-hidden />
            </Button>
          </a>
        ) : null}
        <Button
          type="button"
          variant="secondary"
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
        <Button type="button" variant="ghost" onClick={share}>
          {t.common.share} <Share2 size={16} aria-hidden />
        </Button>
      </div>
      {saveError ? <p className="mt-4 rounded-2xl border border-wine/40 bg-wine/20 px-4 py-3 text-sm text-ivory">{saveError}</p> : null}
    </motion.article>
  );
}

function Insight({
  icon: Icon,
  title,
  text
}: {
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-3">
      <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ivory/7 text-amber">
        <Icon size={16} aria-hidden />
      </span>
      <div>
        <h4 className="text-sm font-semibold text-ivory">{title}</h4>
        <p className="mt-1 text-sm leading-6 text-muted">{text}</p>
      </div>
    </div>
  );
}
