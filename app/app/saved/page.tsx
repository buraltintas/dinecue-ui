"use client";

import { SavedList } from "@/components/app/saved-list";
import { useI18n } from "@/components/providers/i18n-provider";

export default function SavedPage() {
  const { t } = useI18n();

  return (
    <div>
      <p className="eyebrow text-copper">{t.saved.eyebrow}</p>
      <h1 className="mt-4 font-display text-display-2 text-ivory text-balance">{t.saved.title}</h1>
      <div className="mt-10">
        <SavedList />
      </div>
    </div>
  );
}
