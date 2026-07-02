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
    imageAlt: "DineCue sign in",
    robots: { index: false, follow: false }
  });
}

export default function LoginPage() {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  return (
    <main className="min-h-screen bg-radial-table px-5 py-8 sm:px-8">
      <BrandLink />
      <section className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-6xl items-center gap-10 py-12 lg:grid-cols-[1fr_.8fr]">
        <LoginIntro />
        <LoginGate>
          <LoginForm googleClientId={googleClientId} />
        </LoginGate>
      </section>
    </main>
  );
}
