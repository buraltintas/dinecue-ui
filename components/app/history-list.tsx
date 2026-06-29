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
    return <div className="glass h-48 animate-pulse rounded-[2rem]" aria-label={t.history.loading} />;
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
        <Link key={item.sessionId} href={`/app/recommendations/${item.sessionId}`} className="glass block rounded-[1.5rem] p-5 transition hover:-translate-y-0.5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row">
            <div>
              <h2 className="text-xl font-semibold text-ivory">{item.rawText}</h2>
              <p className="mt-2 text-sm text-muted">{item.locationText || item.locationMode}</p>
            </div>
            <time className="text-sm text-amber">{formatDate(item.createdAt)}</time>
          </div>
        </Link>
      ))}
    </div>
  );
}
