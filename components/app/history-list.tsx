"use client";

import Link from "next/link";
import type { Route } from "next";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Clock, Image as ImageIcon, ScanLine, Search, Utensils } from "lucide-react";
import { getActivity } from "@/lib/api/activity";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useI18n } from "@/components/providers/i18n-provider";
import { cn } from "@/lib/utils";
import type { ActivityItemDto, ActivityKind } from "@/lib/types";

type Group = ActivityKind | "all";

const groups: Group[] = ["all", "recommendation", "menu_scan", "fit_check"];

/**
 * Every action that spends a monthly decision, in one place. Two of the three flows used to leave no trace
 * a diner could return to, so a credit could be spent on an answer that vanished on navigation.
 */
export function HistoryList() {
  const { t } = useI18n();
  const [group, setGroup] = useState<Group>("all");
  const activity = useQuery({
    queryKey: ["activity", group],
    queryFn: () => getActivity(group === "all" ? undefined : group),
    staleTime: 0,
    refetchOnMount: "always"
  });

  const groupLabel: Record<Group, string> = {
    all: t.history.groupAll,
    recommendation: t.history.groupRecommendations,
    menu_scan: t.history.groupMenuScans,
    fit_check: t.history.groupFitChecks
  };

  const emptyAction =
    group === "menu_scan"
      ? { href: "/app/menu-scan" as const, label: t.nav.menuScan }
      : group === "fit_check"
        ? { href: "/app/fit-check" as const, label: t.nav.fitCheck }
        : { href: "/app/find" as const, label: t.common.findAPlace };

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label={t.history.groupLabel}>
        {groups.map((option) => (
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={group === option}
            onClick={() => setGroup(option)}
            className={cn(
              "min-h-10 rounded-pill border px-4 text-sm transition",
              group === option
                ? "border-amber/50 bg-amber/[0.16] text-ivory"
                : "border-ivory/12 bg-ivory/[0.05] text-muted hover:border-ivory/25 hover:text-ivory"
            )}
          >
            {groupLabel[option]}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activity.isLoading || activity.isFetching ? (
          <div className="glass h-48 animate-pulse rounded-panel" aria-label={t.history.loading} />
        ) : activity.isError ? (
          <EmptyState title={t.history.errorTitle} description={t.history.errorBody} />
        ) : !activity.data?.length ? (
          <EmptyState
            title={group === "all" ? t.history.emptyTitle : t.history.emptyGroupTitle}
            description={group === "all" ? t.history.emptyBody : t.history.emptyGroupBody}
            action={
              // The way out has to match the group being looked at: an empty fit-check tab should offer a
              // fit check, not send the diner off to search for a place.
              <Link href={emptyAction.href}>
                <Button>{emptyAction.label}</Button>
              </Link>
            }
          />
        ) : (
          <ul className="space-y-4">
            {activity.data.map((item) => (
              <li key={`${item.kind}-${item.id}`}>
                <ActivityRow item={item} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function ActivityRow({ item }: { item: ActivityItemDto }) {
  const { t } = useI18n();
  const meta = kindMeta(item.kind);
  const Icon = meta.icon;
  const failed = item.status === "failed";
  const pending = item.status !== "completed" && !failed;

  return (
    <Link
      href={meta.href(item.id) as Route}
      className="block rounded-card border border-ivory/10 bg-ivory/[0.035] p-5 transition hover:border-ivory/20 hover:bg-ivory/[0.06]"
    >
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-pill border border-ivory/12 bg-black/25 px-2.5 py-1 font-mono text-[0.6875rem] text-muted">
              <Icon size={12} aria-hidden />
              {t.history.kinds[item.kind]}
            </span>
            {typeof item.score === "number" ? (
              <span className="font-mono text-xs tabular-nums text-ivory">{item.score}/100</span>
            ) : null}
            {item.imageCount > 0 ? (
              <span className="inline-flex items-center gap-1 font-mono text-[0.6875rem] text-faint">
                <ImageIcon size={11} aria-hidden />
                {item.imageCount}
              </span>
            ) : null}
            {/* A failed entry stays in the record: the diner did something, and the credit came back. */}
            {failed ? (
              <span className="inline-flex items-center gap-1 rounded-pill border border-wine/45 bg-wine/20 px-2.5 py-1 text-[0.6875rem] text-ivory">
                <AlertTriangle size={11} aria-hidden />
                {t.history.failed}
              </span>
            ) : null}
            {pending ? (
              <span className="inline-flex items-center gap-1 rounded-pill border border-amber/30 bg-amber/10 px-2.5 py-1 text-[0.6875rem] text-ivory">
                <Clock size={11} aria-hidden />
                {t.history.inProgress}
              </span>
            ) : null}
          </p>

          <h2 className="mt-3 text-base font-semibold leading-7 text-ivory text-pretty">
            {item.title || t.history.untitled}
          </h2>
          {item.subtitle ? <p className="mt-1.5 truncate text-sm text-faint">{item.subtitle}</p> : null}
          {item.highlights.length > 0 ? (
            <p className="mt-2.5 text-sm leading-6 text-muted text-pretty">{item.highlights.join(" · ")}</p>
          ) : null}
        </div>

        <time className="shrink-0 font-mono text-xs tabular-nums text-copper" dateTime={item.createdAt}>
          {formatDate(item.createdAt)}
        </time>
      </div>
    </Link>
  );
}

/**
 * Each kind has its own detail route. The href is widened to `Route` at the call site because typedRoutes
 * cannot narrow a union of dynamic templates returned from a helper.
 */
function kindMeta(kind: ActivityKind) {
  if (kind === "menu_scan") return { icon: ScanLine, href: (id: string) => `/app/menu-scan/${id}` };
  if (kind === "fit_check") return { icon: Utensils, href: (id: string) => `/app/fit-check/${id}` };
  return { icon: Search, href: (id: string) => `/app/recommendations/${id}` };
}
