"use client";

import { HistoryList } from "@/components/app/history-list";
import { useI18n } from "@/components/providers/i18n-provider";

export default function HistoryPage() {
  const { t } = useI18n();

  return (
    <div>
      <p className="text-sm tracking-[0.26em] text-amber">{t.history.eyebrow}</p>
      <h1 className="mt-3 font-display text-4xl text-ivory sm:text-5xl">{t.history.title}</h1>
      <div className="mt-8">
        <HistoryList />
      </div>
    </div>
  );
}
