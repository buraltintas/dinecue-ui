"use client";

import { Check, ChevronDown, Globe2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/components/providers/i18n-provider";
import { cn } from "@/lib/utils";
import type { SupportedLanguage } from "@/lib/types";

const options: { value: SupportedLanguage; label: string }[] = [
  { value: "en", label: "en" },
  { value: "tr", label: "tr" },
  { value: "de", label: "de" }
];

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage, t } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function closeOnOutside(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  function choose(next: SupportedLanguage) {
    setLanguage(next);
    setOpen(false);
  }

  return (
    <div ref={rootRef} className="relative inline-block">
      <button
        type="button"
        aria-label={t.common.language}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-ivory/12 bg-black/25 text-sm text-ivory transition hover:border-ivory/25 hover:bg-ivory/8 focus:outline-none focus-visible:bg-ivory/10",
          compact ? "px-3 py-2" : "px-4 py-2.5"
        )}
      >
        <Globe2 size={16} className="text-amber" aria-hidden />
        <span className="min-w-5 text-left">{language}</span>
        <ChevronDown size={15} className={cn("text-ivory transition", open && "rotate-180")} aria-hidden />
      </button>

      {open ? (
        <div
          role="listbox"
          aria-label={t.common.language}
          className="absolute right-0 z-50 mt-2 min-w-full overflow-hidden rounded-2xl border border-ivory/12 bg-[#151412]/95 p-1 shadow-glass backdrop-blur-xl"
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={option.value === language}
              onClick={() => choose(option.value)}
              className={cn(
                "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm transition focus:outline-none focus-visible:bg-ivory/10",
                option.value === language ? "text-ivory" : "text-muted hover:bg-ivory/7 hover:text-ivory"
              )}
            >
              <span>{option.label}</span>
              {option.value === language ? <Check size={15} className="text-amber" aria-hidden /> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
