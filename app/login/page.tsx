import type { Metadata } from "next";
import { LoginIntro } from "@/components/auth/login-intro";
import { LoginForm } from "@/components/auth/login-form";
import { LoginGate } from "@/components/auth/login-gate";
import { BrandLink } from "@/components/brand/brand-link";
import { getDictionary } from "@/lib/i18n";
import { publicPageMetadata } from "@/lib/seo";
import { getRequestLanguage } from "@/lib/server/request-language";

export function generateMetadata(): Metadata {
  const t = getDictionary(getRequestLanguage());
  return publicPageMetadata({
    title: t.auth.seoTitle,
    description: t.auth.seoDescription,
    path: "/login",
    imageAlt: "dinecue sign in",
    robots: { index: false, follow: false }
  });
}

export default function LoginPage() {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  return (
    <main className="min-h-[100dvh] bg-radial-table pb-section-sm pt-8">
      <div className="container-page">
        <BrandLink />
      </div>
      <section className="container-page mt-12 grid items-center gap-12 lg:mt-20 lg:grid-cols-[1fr_auto] lg:gap-20">
        <LoginIntro />
        <LoginGate>
          <LoginForm googleClientId={googleClientId} />
        </LoginGate>
      </section>
    </main>
  );
}
