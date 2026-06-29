"use client";

import { Globe2 } from "lucide-react";
import { useI18n } from "@/components/providers/i18n-provider";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage, t } = useI18n();

  return (
    <label className={cn("inline-flex items-center gap-2 rounded-full border border-ivory/12 bg-black/25 text-sm text-ivory", compact ? "px-2 py-1.5" : "px-3 py-2")}>
      <Globe2 size={16} className="text-amber" aria-hidden />
      <span className="sr-only">{t.common.language}</span>
      <select
        aria-label={t.common.language}
        value={language}
        onChange={(event) => setLanguage(event.target.value as "en" | "tr" | "de")}
        className="bg-transparent text-sm text-ivory outline-none"
      >
        <option className="bg-graphite" value="en">en</option>
        <option className="bg-graphite" value="tr">tr</option>
        <option className="bg-graphite" value="de">de</option>
      </select>
    </label>
  );
}
