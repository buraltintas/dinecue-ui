"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getRecommendationSession } from "@/lib/api/recommendations";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { GenerationScreen } from "./generation-screen";
import { RecommendationCard } from "./recommendation-card";
import { useI18n } from "@/components/providers/i18n-provider";

export function SessionView({ sessionId }: { sessionId: string }) {
  const { t } = useI18n();
  const session = useQuery({
    queryKey: ["recommendation-session", sessionId],
    queryFn: () => getRecommendationSession(sessionId),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "completed" || status === "failed" ? false : 2500;
    }
  });

  if (session.isLoading) return <GenerationScreen />;

  if (session.isError) {
    return (
      <EmptyState
        title={t.recommendations.loadErrorTitle}
        description={t.recommendations.loadErrorBody}
        action={<Link href="/app/find"><Button>{t.common.startAgain}</Button></Link>}
      />
    );
  }

  const data = session.data;
  if (!data || data.status !== "completed") {
    if (data?.status === "failed") {
      return (
        <EmptyState
          title={t.recommendations.failedTitle}
          description={t.recommendations.failedBody}
          action={<Link href="/app/find"><Button>{t.common.tryAnotherCue}</Button></Link>}
        />
      );
    }
    return <GenerationScreen currentStep={data?.currentStep} />;
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.26em] text-amber">{t.recommendations.eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl text-ivory sm:text-5xl">{t.recommendations.title}</h1>
        <p className="mt-3 text-muted">{data.rawText}</p>
      </div>
      <div className="space-y-5">
        {data.recommendations.slice(0, 3).map((card, index) => (
          <RecommendationCard key={card.id} card={card} index={index} />
        ))}
      </div>
    </div>
  );
}
