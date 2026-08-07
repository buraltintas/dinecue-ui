"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Bookmark, Clock, ScanLine, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/providers/i18n-provider";

const cardMeta = [
  { href: "/app/find", icon: Search, soon: false },
  { href: "/app/history", icon: Clock, soon: false },
  { href: "/app/saved", icon: Bookmark, soon: false },
  { href: "/app/menu-scan", icon: ScanLine, soon: true }
] as const;

export default function AppHomePage() {
  const { t } = useI18n();

  return (
    <div>
      <section className="overflow-hidden rounded-panel bg-radial-table p-7 sm:p-10">
        <p className="eyebrow text-amber">{t.home.eyebrow}</p>
        <h1 className="mt-5 max-w-2xl font-display text-display-2 text-ivory text-balance">{t.home.title}</h1>
        <p className="mt-5 max-w-measure text-lead text-muted text-pretty">{t.home.body}</p>
        <Link href="/app/find" className="mt-8 inline-block">
          <Button size="lg">
            {t.home.cta}
            <ArrowRight size={18} aria-hidden />
          </Button>
        </Link>
      </section>

      <section className="mt-4 grid gap-4 sm:grid-cols-2">
        {cardMeta.map((card, index) => {
          const Icon = card.icon;
          const copy = t.home.cards[index];
          return (
            <Link
              key={card.href}
              href={card.href}
              className="group rounded-panel border border-ivory/10 bg-ivory/[0.035] p-6 transition hover:border-ivory/20 hover:bg-ivory/[0.06]"
            >
              <div className="flex items-start justify-between gap-4">
                <Icon className="text-copper" size={22} aria-hidden />
                <ArrowUpRight
                  className="text-faint transition group-hover:-translate-y-0.5 group-hover:text-amber"
                  size={18}
                  aria-hidden
                />
              </div>
              <div className="mt-6 flex items-start justify-between gap-3">
                <h2 className="font-display text-xl text-ivory">{copy.title}</h2>
                {card.soon ? (
                  <span className="shrink-0 rounded-pill border border-ivory/15 bg-ivory/[0.05] px-2.5 py-1 font-mono text-[0.6875rem] text-faint">
                    {t.common.comingSoon}
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-sm leading-7 text-muted text-pretty">{copy.text}</p>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
