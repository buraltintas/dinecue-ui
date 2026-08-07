import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { BrandLink } from "@/components/brand/brand-link";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/i18n";
import { getRequestLanguage } from "@/lib/server/request-language";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true }
};

export default function NotFound() {
  const t = getDictionary(getRequestLanguage());

  return (
    <main className="grid min-h-[100dvh] bg-radial-table">
      <div className="container-page self-start pt-8">
        <BrandLink />
      </div>
      <div className="container-reading -mt-16 self-center pb-16 text-center">
        <p className="eyebrow text-copper">{t.notFound.eyebrow}</p>
        <h1 className="mt-5 font-display text-display-1 text-ivory text-balance">{t.notFound.title}</h1>
        <p className="mx-auto mt-6 max-w-measure text-lead text-muted text-pretty">{t.notFound.body}</p>
        <Link href="/" className="mt-10 inline-block">
          <Button size="lg">
            {t.notFound.cta}
            <ArrowRight size={18} aria-hidden />
          </Button>
        </Link>
      </div>
    </main>
  );
}
