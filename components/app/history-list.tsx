"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getRecommendationHistory } from "@/lib/api/recommendations";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useI18n } from "@/components/providers/i18n-provider";

export function HistoryList() {
  const { t } = useI18n();
  const history = useQuery({
    queryKey: ["recommendation-history"],
    queryFn: getRecommendationHistory,
    staleTime: 0,
    refetchOnMount: "always"
  });

  if (history.isLoading || history.isFetching) {
    return <div className="glass h-48 animate-pulse rounded-panel" aria-label={t.history.loading} />;
  }

  if (history.isError || !history.data?.length) {
    return (
      <EmptyState
        title={t.history.emptyTitle}
        description={t.history.emptyBody}
        action={<Link href="/app/find"><Button>{t.common.findAPlace}</Button></Link>}
      />
    );
  }

  return (
    <div className="space-y-4">
      {history.data.map((item) => (
        <Link key={item.sessionId} href={`/app/recommendations/${item.sessionId}`} className="block rounded-card border border-ivory/10 bg-ivory/[0.035] p-5 transition hover:border-ivory/20 hover:bg-ivory/[0.06]">
          <div className="flex flex-col justify-between gap-3 sm:flex-row">
            <div>
              <h2 className="text-base font-semibold leading-7 text-ivory text-pretty">{item.rawText}</h2>
              <p className="mt-2 text-sm text-faint">{item.locationText || item.locationMode}</p>
            </div>
            <time className="shrink-0 font-mono text-xs tabular-nums text-copper" dateTime={item.createdAt}>
              {formatDate(item.createdAt)}
            </time>
          </div>
        </Link>
      ))}
    </div>
  );
}
