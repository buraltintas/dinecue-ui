"use client";

import { EmptyState } from "@/components/ui/empty-state";
import { useI18n } from "@/components/providers/i18n-provider";

export default function FitCheckPage() {
  const { t } = useI18n();

  return (
    <EmptyState
      title={t.placeholders.fitTitle}
      description={t.placeholders.fitBody}
    />
  );
}
