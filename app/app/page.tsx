"use client";

import Link from "next/link";
import { ArrowRight, Bookmark, Clock, ScanLine, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/providers/i18n-provider";

const cardMeta = [
  { href: "/app/find", icon: Search },
  { href: "/app/history", icon: Clock },
  { href: "/app/saved", icon: Bookmark },
  { href: "/app/menu-scan", icon: ScanLine }
] as const;

export default function AppHomePage() {
  const { t } = useI18n();

  return (
    <div>
      <section className="rounded-[2rem] bg-radial-table p-8 sm:p-10">
        <p className="text-sm uppercase tracking-[0.26em] text-amber">{t.home.eyebrow}</p>
        <h1 className="mt-4 max-w-3xl font-display text-5xl leading-tight text-ivory">{t.home.title}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">{t.home.body}</p>
        <Link href="/app/find" className="mt-8 inline-block">
          <Button>
            {t.home.cta} <ArrowRight size={18} aria-hidden />
          </Button>
        </Link>
      </section>
      <section className="mt-8 grid gap-4 md:grid-cols-2">
        {cardMeta.map((card, index) => {
          const Icon = card.icon;
          const copy = t.home.cards[index];
          return (
            <Link key={card.href} href={card.href} className="glass rounded-[1.5rem] p-6 transition hover:-translate-y-1">
              <Icon className="text-amber" size={24} aria-hidden />
              <h2 className="mt-5 text-xl font-semibold text-ivory">{copy.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{copy.text}</p>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
