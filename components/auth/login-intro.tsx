"use client";

import { useI18n } from "@/components/providers/i18n-provider";

export function LoginIntro() {
  const { t } = useI18n();

  return (
    <div className="max-w-xl">
      <p className="eyebrow text-copper">{t.auth.eyebrow}</p>
      <h1 className="mt-5 font-display text-display-2 text-ivory text-balance">{t.auth.introTitle}</h1>
      <p className="mt-6 text-lead text-muted text-pretty">{t.auth.introBody}</p>
    </div>
  );
}
