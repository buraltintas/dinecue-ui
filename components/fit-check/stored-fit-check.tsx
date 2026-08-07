"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getFitCheck } from "@/lib/api/restaurants";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useI18n } from "@/components/providers/i18n-provider";
import { FitCheckReport } from "./fit-check-report";

/**
 * Reopens a fit check from history. The stored record holds the whole verdict, so this shows exactly what
 * the diner saw when they spent the credit — not a re-run, which would cost another one and could differ.
 */
export function StoredFitCheck({ fitCheckId }: { fitCheckId: string }) {
  const { t } = useI18n();
  const router = useRouter();
  const report = useQuery({
    queryKey: ["fit-check", fitCheckId],
    queryFn: () => getFitCheck(fitCheckId)
  });

  if (report.isLoading) {
    return <div className="glass h-96 animate-pulse rounded-panel" aria-label={t.common.loading} />;
  }

  if (report.isError || !report.data) {
    return (
      <EmptyState
        title={t.fitCheck.loadErrorTitle}
        description={t.fitCheck.loadErrorBody}
        action={
          <Link href="/app/fit-check">
            <Button>{t.fitCheck.checkAnother}</Button>
          </Link>
        }
      />
    );
  }

  return (
    <FitCheckReport
      report={report.data}
      placeName={report.data.placeName}
      address={report.data.address}
      placeId={report.data.providerPlaceId}
      askedAt={report.data.createdAt}
      askedText={report.data.rawText}
      onCheckAnother={() => router.push("/app/fit-check")}
    />
  );
}
