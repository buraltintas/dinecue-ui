"use client";

import { Check, ChevronDown, Globe2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/components/providers/i18n-provider";
import { cn } from "@/lib/utils";
import type { SupportedLanguage } from "@/lib/types";

const options: { value: SupportedLanguage; label: string }[] = [
  { value: "en", label: "en" },
  { value: "tr", label: "tr" },
  { value: "de", label: "de" }
];

export function LanguageSwitcher({
  compact = false,
  refreshOnChange = false,
  align = "down"
}: {
  compact?: boolean;
  refreshOnChange?: boolean;
  /** "up" for a trigger near the bottom of the viewport, where a downward menu would run off the page. */
  align?: "down" | "up";
}) {
  const router = useRouter();
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
    if (refreshOnChange) router.refresh();
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
          "inline-flex items-center gap-2 rounded-pill border border-ivory/12 bg-black/25 text-sm text-ivory transition hover:border-ivory/25 hover:bg-ivory/[0.08] focus:outline-none focus-visible:bg-ivory/10",
          compact ? "min-h-11 px-3" : "min-h-11 px-4"
        )}
      >
        <Globe2 size={16} className="text-copper" aria-hidden />
        <span className="min-w-5 text-left font-mono text-xs uppercase">{language}</span>
        <ChevronDown size={15} className={cn("text-ivory transition", open && "rotate-180")} aria-hidden />
      </button>

      {open ? (
        <div
          role="listbox"
          aria-label={t.common.language}
          className={cn(
            "absolute right-0 z-50 min-w-full overflow-hidden rounded-card border border-ivory/12 bg-charcoal/95 p-1 shadow-glass backdrop-blur-xl",
            align === "up" ? "bottom-full mb-2" : "mt-2"
          )}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={option.value === language}
              onClick={() => choose(option.value)}
              className={cn(
                "flex min-h-10 w-full items-center justify-between gap-3 rounded-card px-3 text-left text-sm uppercase transition focus:outline-none focus-visible:bg-ivory/10",
                option.value === language ? "text-ivory" : "text-muted hover:bg-ivory/[0.06] hover:text-ivory"
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
