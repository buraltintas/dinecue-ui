"use client";

import { motion } from "framer-motion";
import { Bookmark, BookmarkCheck, ExternalLink, Navigation, Share2, X } from "lucide-react";
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
      className="glass rounded-[1.75rem] p-5 sm:p-6"
    >
      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-amber">{t.recommendations.pick} {card.rank}</p>
          <h2 className="mt-2 font-display text-3xl text-ivory">{card.placeName}</h2>
          <p className="mt-2 text-lg text-ivory/85">{card.headline || card.title}</p>
          <p className="mt-2 text-sm text-muted">{card.address}</p>
        </div>
        <div className="h-fit rounded-full bg-sage/15 px-4 py-2 text-sm text-sage">{Math.round(card.confidence * 100)}% {t.recommendations.confidence}</div>
      </div>
      <p className="mt-5 leading-7 text-muted">{card.summary}</p>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <Info title={t.recommendations.vibe} text={card.vibe} fallback={t.common.notSpecified} />
        <Info title={t.recommendations.why} text={card.whyThisPlace} fallback={t.common.notSpecified} />
        <Info title={t.recommendations.goodToKnow} text={card.goodToKnow} fallback={t.common.notSpecified} />
      </div>
      {card.whatToOrder?.length ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {card.whatToOrder.map((item) => (
            <span key={item} className="rounded-full bg-ivory/7 px-3 py-1.5 text-sm text-ivory">
              {item}
            </span>
          ))}
        </div>
      ) : null}
      {card.cautions?.length ? <p className="mt-4 text-sm text-muted">{t.recommendations.caution}: {card.cautions.join(", ")}</p> : null}
      <div className="mt-6 flex flex-wrap gap-3">
        {card.reservation?.url ? (
          <a href={card.reservation.url} target="_blank" rel="noreferrer">
            <Button type="button">
              {t.common.open} <ExternalLink size={16} aria-hidden />
            </Button>
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

function Info({ title, text, fallback }: { title: string; text?: string; fallback: string }) {
  return (
    <div className="rounded-2xl border border-ivory/10 bg-black/15 p-4">
      <h3 className="text-sm font-semibold text-ivory">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted">{text || fallback}</p>
    </div>
  );
}
