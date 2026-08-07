"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BrandLink } from "@/components/brand/brand-link";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { useI18n } from "@/components/providers/i18n-provider";
import { useViewer } from "@/components/providers/use-viewer";
import { LeaderLoader } from "@/components/ui/leader-loader";
import { cn } from "@/lib/utils";

/**
 * One header for every public surface. The landing page and the legal pages
 * used to carry two separate hand-rolled versions of this.
 */
export function SiteHeader({ anchors = false }: { anchors?: boolean }) {
  const { t } = useI18n();
  const { isSignedIn, isResolving, primaryHref } = useViewer();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-colors duration-300",
        scrolled ? "border-b border-ivory/10 bg-night/90 backdrop-blur-xl" : "border-b border-transparent"
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4 sm:h-20">
        <BrandLink />

        <div className="flex items-center gap-2 sm:gap-5">
          {anchors ? (
            <nav aria-label={t.landing.publicNav} className="hidden items-center gap-6 text-sm text-muted md:flex">
              <a href="#how" className="transition hover:text-ivory">
                {t.landing.how}
              </a>
            </nav>
          ) : null}

          <LanguageSwitcher compact refreshOnChange={!anchors} />

          {/* Until the session is resolved we do not claim either state — the
              leader line stands in for the label at the same width. */}
          {isResolving ? (
            <span className="inline-flex min-h-11 items-center text-copper">
              <LeaderLoader label={t.common.preparing} />
            </span>
          ) : (
            <Link
              href={primaryHref}
              className="inline-flex min-h-11 items-center text-sm text-ivory underline decoration-copper/40 underline-offset-[6px] transition hover:decoration-copper"
            >
              {isSignedIn ? t.landing.continue : t.landing.signIn}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
