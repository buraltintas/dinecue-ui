"use client";

import { HistoryList } from "@/components/app/history-list";
import { useI18n } from "@/components/providers/i18n-provider";

export default function HistoryPage() {
  const { t } = useI18n();

  return (
    <div>
      <p className="eyebrow text-copper">{t.history.eyebrow}</p>
      <h1 className="mt-4 font-display text-display-2 text-ivory text-balance">{t.history.title}</h1>
      <div className="mt-10">
        <HistoryList />
      </div>
    </div>
  );
}
