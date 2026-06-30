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
        <p className="text-sm tracking-[0.26em] text-amber">{t.recommendations.eyebrow}</p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl leading-tight text-ivory sm:text-5xl">
          {data.recommendations.length === 1 ? t.recommendations.oneResultTitle : t.recommendations.title}
        </h1>
        {data.recommendations.length === 1 ? (
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted">{t.recommendations.oneResultHint}</p>
        ) : null}

        <section className="mt-7 max-w-3xl rounded-[1.35rem] border border-ivory/10 bg-ivory/[0.045] p-4">
          <button
            type="button"
            onClick={() => setRequestOpen((value) => !value)}
            className="flex w-full items-center justify-between gap-4 text-left"
            aria-expanded={requestOpen}
          >
            <span>
              <span className="block text-xs tracking-[0.22em] text-amber">{t.recommendations.requestSummary}</span>
              <span className="mt-1 line-clamp-1 block text-sm text-ivory/85">{data.rawText}</span>
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-black/20 px-3 py-2 text-xs text-muted">
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
