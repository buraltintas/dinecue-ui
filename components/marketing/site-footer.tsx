"use client";

import Link from "next/link";
import type { Route } from "next";
import { useI18n } from "@/components/providers/i18n-provider";

const productLinks = [
  { href: "/" as Route, key: "home" },
  { href: "/about" as Route, key: "about" },
  { href: "/login" as Route, key: "login" }
] as const;

const legalLinks = [
  { href: "/terms" as Route, key: "terms" },
  { href: "/privacy" as Route, key: "privacy" }
] as const;

export function SiteFooter() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-ivory/10 bg-[#0d0d0f] px-5 py-12 text-ivory sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1fr_auto_auto]">
        <div className="max-w-md">
          <p className="text-2xl font-black tracking-[-0.04em]">dinecue</p>
          <p className="mt-4 text-sm font-semibold text-amber">{t.footer.tagline}</p>
          <p className="mt-3 text-sm leading-6 text-muted">{t.footer.body}</p>
        </div>
        <nav aria-label={t.footer.product} className="space-y-3">
          <p className="text-sm font-semibold text-ivory">{t.footer.product}</p>
          {productLinks.map((link) => (
            <Link key={link.href} href={link.href} className="block text-sm text-muted transition hover:text-ivory">
              {t.footer[link.key]}
            </Link>
          ))}
        </nav>
        <nav aria-label={t.footer.legal} className="space-y-3">
          <p className="text-sm font-semibold text-ivory">{t.footer.legal}</p>
          {legalLinks.map((link) => (
            <Link key={link.href} href={link.href} className="block text-sm text-muted transition hover:text-ivory">
              {t.footer[link.key]}
            </Link>
          ))}
        </nav>
      </div>
      <p className="mx-auto mt-10 max-w-7xl text-xs text-muted">{t.footer.copyright}</p>
    </footer>
  );
}
