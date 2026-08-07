"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { AlertTriangle, Baby, Flame, HelpCircle, Leaf, RefreshCw, Utensils } from "lucide-react";
import { getMenuScan, menuScanImageUrl, recommendFromMenuScan } from "@/lib/api/menu-scans";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { GenerationScreen } from "@/components/recommendations/generation-screen";
import { useI18n } from "@/components/providers/i18n-provider";
import { formatDate } from "@/lib/utils";
import type { MenuItemDto, MenuRecommendationDto, MenuScanDetail } from "@/lib/types";

export function MenuScanView({ menuScanId }: { menuScanId: string }) {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const scan = useQuery({
    queryKey: ["menu-scan", menuScanId],
    queryFn: () => getMenuScan(menuScanId),
    // Same stop conditions as a recommendation session; any other status keeps polling.
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "completed" || status === "failed" ? false : 2500;
    }
  });
  const rerank = useMutation({
    mutationFn: () => recommendFromMenuScan(menuScanId),
    onSuccess: (updated) => queryClient.setQueryData<MenuScanDetail>(["menu-scan", menuScanId], updated)
  });


  if (scan.isLoading) return <GenerationScreen />;

  if (scan.isError) {
    return (
      <EmptyState
        title={t.menuScan.loadErrorTitle}
        description={t.menuScan.loadErrorBody}
        action={
          <Link href="/app/menu-scan">
            <Button>{t.menuScan.scanAnother}</Button>
          </Link>
        }
      />
    );
  }

  const data = scan.data;
  if (!data || data.status !== "completed") {
    if (data?.status === "failed") {
      return (
        <EmptyState
          // An unreadable photo is the one failure a diner can actually fix, so it gets its own guidance.
          title={data.errorCode === "menu_not_readable" ? t.menuScan.unreadableTitle : t.menuScan.failedTitle}
          description={data.errorCode === "menu_not_readable" ? t.menuScan.unreadableBody : t.menuScan.failedBody}
          action={
            <Link href="/app/menu-scan">
              <Button>{t.menuScan.scanAnother}</Button>
            </Link>
          }
        />
      );
    }
    return <GenerationScreen currentStep={data?.currentStep} />;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
      <header className="mb-10">
        <p className="eyebrow text-copper">{t.menuScan.resultEyebrow}</p>
        <h1 className="mt-4 max-w-3xl font-display text-display-2 text-ivory text-balance">{t.menuScan.resultTitle}</h1>
        {data.createdAt ? (
          <p className="mt-3 font-mono text-xs text-faint">
            <time dateTime={data.createdAt}>{formatDate(data.createdAt)}</time>
          </p>
        ) : null}
        {data.summary ? (
          <p className="mt-4 max-w-measure text-lead text-ivory/90 text-pretty">{data.summary}</p>
        ) : null}

        {/* Their own photos and words, so a scan reopened from history is the whole record. */}
        {data.imageCount > 0 ? (
          <div className="mt-7">
            <p className="eyebrow text-faint">{t.menuScan.yourPhotos}</p>
            <ul className="mt-3 flex flex-wrap gap-3">
              {Array.from({ length: data.imageCount }, (_, index) => (
                <li key={index}>
                  <a
                    href={menuScanImageUrl(menuScanId, index)}
                    target="_blank"
                    rel="noreferrer"
                    className="block overflow-hidden rounded-card border border-ivory/10 transition hover:border-amber/40"
                  >
                    {/* Served through our own ownership-checked proxy, so the bucket stays private. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={menuScanImageUrl(menuScanId, index)}
                      alt={`${t.menuScan.yourPhotos} ${index + 1}`}
                      className="h-28 w-24 object-cover"
                      loading="lazy"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {data.rawText ? (
          <p className="mt-6 max-w-measure rounded-card border border-ivory/10 bg-black/25 px-4 py-3 text-sm leading-6">
            <span className="eyebrow block text-faint">{t.menuScan.whatYouAsked}</span>
            <span className="mt-2 block text-ivory/85 text-pretty">{data.rawText}</span>
          </p>
        ) : null}
      </header>

      {/* Warnings come first: the allergen disclaimer is always present and is the most consequential text here. */}
      {data.warnings.length > 0 ? (
        <section className="rounded-card border border-wine/40 bg-wine/20 p-5" aria-label={t.menuScan.warnings}>
          <h2 className="flex items-center gap-2 text-sm font-semibold text-ivory">
            <AlertTriangle size={16} className="text-amber" aria-hidden />
            {t.menuScan.warnings}
          </h2>
          <ul className="mt-3 space-y-2">
            {data.warnings.map((warning) => (
              <li key={warning} className="flex gap-3 text-sm leading-6 text-ivory/85">
                <span className="mt-2.5 h-px w-4 shrink-0 bg-amber/70" aria-hidden />
                <span className="text-pretty">{warning}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {data.recommendedItems.length > 0 ? (
        <section className="mt-8">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="flex items-center gap-2 font-display text-xl text-ivory">
              <Utensils size={18} className="text-copper" aria-hidden />
              {t.menuScan.suggestions}
            </h2>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={rerank.isPending}
              onClick={() => rerank.mutate()}
              // Free because the menu was already read; only the ranking is redone.
              title={t.menuScan.rerankHint}
            >
              <RefreshCw size={14} className={rerank.isPending ? "animate-spin" : undefined} aria-hidden />
              {rerank.isPending ? t.common.working : t.menuScan.rerank}
            </Button>
          </div>
          <div className="mt-4 space-y-4">
            {data.recommendedItems.map((item, index) => (
              <SuggestionCard key={item.itemName} item={item} index={index} menuItem={findItem(data, item.itemName)} />
            ))}
          </div>
        </section>
      ) : (
        <section className="mt-8">
          <EmptyState title={t.menuScan.noSuggestionsTitle} description={t.menuScan.noSuggestionsBody} />
        </section>
      )}

      {data.questionsToAskStaff.length > 0 ? (
        <section className="mt-8 rounded-card border border-ivory/10 bg-ivory/[0.035] p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-ivory">
            <HelpCircle size={16} className="text-copper" aria-hidden />
            {t.menuScan.questions}
          </h2>
          <ul className="mt-3 space-y-2">
            {data.questionsToAskStaff.map((question) => (
              <li key={question} className="flex gap-3 text-sm leading-6 text-muted">
                <span className="mt-2.5 h-px w-4 shrink-0 bg-copper/70" aria-hidden />
                <span className="text-pretty">{question}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {data.sections.length > 0 ? (
        <section className="mt-8">
          <h2 className="eyebrow text-faint">{t.menuScan.fullMenu}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {data.sections.map((section) => (
              <div key={section.name} className="rounded-card border border-ivory/10 bg-ivory/[0.035] p-5">
                <h3 className="font-display text-lg text-ivory">{section.name}</h3>
                <ul className="mt-3 space-y-3">
                  {section.itemNames.map((name) => {
                    const item = findItem(data, name);
                    return (
                      <li key={name} className="text-sm leading-6">
                        <span className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                          <span className="text-ivory/90">{name}</span>
                          {item?.priceText ? <span className="font-mono text-xs text-faint">{item.priceText}</span> : null}
                          {item ? <ItemBadges item={item} /> : null}
                        </span>
                        {item?.description ? <span className="mt-1 block text-muted text-pretty">{item.description}</span> : null}
                        {item?.possibleAllergens.length ? (
                          <span className="mt-1 block text-xs leading-5 text-copper">
                            {t.menuScan.possibleAllergens}: {item.possibleAllergens.join(", ")}
                          </span>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <div className="mt-10 flex flex-col gap-3 border-t border-ivory/10 pt-6 sm:flex-row">
        <Link href="/app/menu-scan" className="w-full sm:w-auto">
          <Button variant="secondary" size="lg" className="w-full sm:w-auto">
            {t.menuScan.scanAnother}
          </Button>
        </Link>
        <Link href="/app/find" className="w-full sm:w-auto">
          <Button variant="ghost" size="lg" className="w-full sm:w-auto">
            {t.common.findAPlace}
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

function SuggestionCard({
  item,
  index,
  menuItem
}: {
  item: MenuRecommendationDto;
  index: number;
  menuItem?: MenuItemDto;
}) {
  const { t } = useI18n();
  // Same 0..1 fraction convention as recommendation confidence.
  const percent = Math.round(Math.min(Math.max(item.suitabilityScore, 0), 1) * 100);

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      className="rounded-card border border-amber/15 bg-black/25 p-5"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <h3 className="font-display text-lg text-ivory">{item.itemName}</h3>
        <div className="flex items-baseline gap-3">
          {menuItem?.priceText ? <span className="font-mono text-xs text-faint">{menuItem.priceText}</span> : null}
          <span className="font-mono text-lg tabular-nums text-ivory">
            {percent}
            <span className="text-xs text-faint">%</span>
          </span>
        </div>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-pill bg-ivory/10">
        <span
          className={percent >= 82 ? "block h-full rounded-pill bg-sage" : percent >= 68 ? "block h-full rounded-pill bg-amber" : "block h-full rounded-pill bg-copper"}
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-4 leading-7 text-ivory/85 text-pretty">{item.reason}</p>
      {menuItem ? (
        <div className="mt-3">
          <ItemBadges item={menuItem} />
        </div>
      ) : null}
      {item.warnings.length > 0 ? (
        <p className="mt-4 rounded-card border border-wine/40 bg-wine/20 px-4 py-3 text-sm leading-6 text-ivory/85">
          <span className="font-semibold text-ivory">{t.menuScan.checkThis}:</span> {item.warnings.join(" ")}
        </p>
      ) : null}
    </motion.article>
  );
}

function ItemBadges({ item }: { item: MenuItemDto }) {
  const { t } = useI18n();
  const badges = [
    item.isVegetarian ? { icon: Leaf, label: t.menuScan.vegetarian } : null,
    item.isKidFriendly ? { icon: Baby, label: t.menuScan.kidFriendly } : null,
    item.isSpicy ? { icon: Flame, label: t.menuScan.spicy } : null
  ].filter(Boolean) as { icon: typeof Leaf; label: string }[];

  if (badges.length === 0) return null;

  return (
    <span className="inline-flex flex-wrap gap-1.5">
      {badges.map(({ icon: Icon, label }) => (
        <span
          key={label}
          className="inline-flex items-center gap-1 rounded-pill border border-ivory/10 bg-ivory/[0.05] px-2 py-0.5 text-[0.6875rem] text-muted"
        >
          <Icon size={11} aria-hidden />
          {label}
        </span>
      ))}
    </span>
  );
}

function findItem(scan: MenuScanDetail, name: string) {
  return scan.items.find((item) => item.name.toLowerCase() === name.toLowerCase());
}
