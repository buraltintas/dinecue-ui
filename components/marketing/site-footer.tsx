"use client";

import Link from "next/link";
import type { Route } from "next";
import { BrandLink } from "@/components/brand/brand-link";
import { Slogan } from "@/components/brand/slogan";
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
    <footer className="border-t border-ivory/10 bg-void py-section-sm text-ivory">
      <div className="container-page grid gap-12 md:grid-cols-[1.4fr_auto_auto] md:gap-16">
        <div className="max-w-md">
          <BrandLink />
          <p className="mt-5 text-xl text-ivory">
            <Slogan text={t.footer.tagline} />
          </p>
          <p className="mt-4 text-sm leading-7 text-muted text-pretty">{t.footer.body}</p>
        </div>

        <nav aria-label={t.footer.product} className="space-y-1">
          <p className="mb-3 font-mono text-[0.6875rem] lowercase tracking-[0.16em] text-faint">{t.footer.product}</p>
          {productLinks.map((link) => (
            <Link key={link.href} href={link.href} className="block py-1.5 text-sm text-muted transition hover:text-ivory">
              {t.footer[link.key]}
            </Link>
          ))}
        </nav>

        <nav aria-label={t.footer.legal} className="space-y-1">
          <p className="mb-3 font-mono text-[0.6875rem] lowercase tracking-[0.16em] text-faint">{t.footer.legal}</p>
          {legalLinks.map((link) => (
            <Link key={link.href} href={link.href} className="block py-1.5 text-sm text-muted transition hover:text-ivory">
              {t.footer[link.key]}
            </Link>
          ))}
        </nav>
      </div>

      <div className="container-page mt-12 border-t border-ivory/10 pt-6">
        <p className="font-mono text-xs text-faint">{t.footer.copyright}</p>
      </div>
    </footer>
  );
}
