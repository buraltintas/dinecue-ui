"use client";

import { useI18n } from "@/components/providers/i18n-provider";

export function LoginIntro() {
  const { t } = useI18n();

  return (
    <div>
      <p className="text-sm uppercase tracking-[0.28em] text-amber">{t.auth.eyebrow}</p>
      <h2 className="mt-5 max-w-xl font-display text-5xl leading-tight text-ivory">{t.auth.introTitle}</h2>
      <p className="mt-6 max-w-lg text-lg leading-8 text-muted">{t.auth.introBody}</p>
    </div>
  );
}
