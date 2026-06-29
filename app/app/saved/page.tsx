"use client";

import { SavedList } from "@/components/app/saved-list";
import { useI18n } from "@/components/providers/i18n-provider";

export default function SavedPage() {
  const { t } = useI18n();

  return (
    <div>
      <p className="text-sm uppercase tracking-[0.26em] text-amber">{t.saved.eyebrow}</p>
      <h1 className="mt-3 font-display text-4xl text-ivory sm:text-5xl">{t.saved.title}</h1>
      <div className="mt-8">
        <SavedList />
      </div>
    </div>
  );
}
