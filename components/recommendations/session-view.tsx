"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { getRecommendationSession } from "@/lib/api/recommendations";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { GenerationScreen } from "./generation-screen";
import { RecommendationCard } from "./recommendation-card";
import { useI18n } from "@/components/providers/i18n-provider";

export function SessionView({ sessionId }: { sessionId: string }) {
  const { t } = useI18n();
  const [requestOpen, setRequestOpen] = useState(false);
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
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
      <div className="mb-10">
        <p className="eyebrow text-copper">{t.recommendations.eyebrow}</p>
        <h1 className="mt-4 max-w-3xl font-display text-display-2 text-ivory text-balance">
          {data.recommendations.length === 1 ? t.recommendations.oneResultTitle : t.recommendations.title}
        </h1>
        {data.recommendations.length === 1 ? (
          <p className="mt-4 max-w-measure leading-7 text-muted text-pretty">{t.recommendations.oneResultHint}</p>
        ) : null}

        <section className="mt-7 max-w-3xl rounded-card border border-ivory/10 bg-ivory/[0.035] p-4">
          <button
            type="button"
            onClick={() => setRequestOpen((value) => !value)}
            className="flex w-full items-center justify-between gap-4 py-1 text-left"
            aria-expanded={requestOpen}
          >
            <span>
              <span className="eyebrow block text-faint">{t.recommendations.requestSummary}</span>
              <span className="mt-2 line-clamp-1 block text-sm text-ivory/85">{data.rawText}</span>
            </span>
            <span className="inline-flex min-h-9 shrink-0 items-center gap-2 rounded-pill bg-black/25 px-3 text-xs text-muted">
              {requestOpen ? t.recommendations.hideRequest : t.recommendations.showRequest}
              <ChevronDown className={requestOpen ? "rotate-180 transition" : "transition"} size={15} aria-hidden />
            </span>
          </button>
          <AnimatePresence initial={false}>
            {requestOpen ? (
              <motion.p
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden pt-4 text-sm leading-6 text-muted"
              >
                {data.rawText}
              </motion.p>
            ) : null}
          </AnimatePresence>
        </section>
      </div>
      <div className="space-y-8">
        {data.recommendations.slice(0, 3).map((card, index) => (
          <RecommendationCard key={card.id} card={card} index={index} />
        ))}
      </div>
    </motion.div>
  );
}
