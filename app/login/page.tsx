import type { Metadata } from "next";
import Link from "next/link";
import { LoginIntro } from "@/components/auth/login-intro";
import { LoginForm } from "@/components/auth/login-form";
import { absoluteUrl } from "@/lib/utils";
import en from "@/messages/en.json";

export const metadata: Metadata = {
  title: en.auth.seoTitle,
  description: en.auth.seoDescription,
  alternates: { canonical: absoluteUrl("/login") },
  robots: { index: false, follow: false }
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-radial-table px-5 py-8 sm:px-8">
      <Link href="/" className="font-display text-2xl text-ivory">
        DineCue
      </Link>
      <section className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-6xl items-center gap-10 py-12 lg:grid-cols-[1fr_.8fr]">
        <LoginIntro />
        <LoginForm />
      </section>
    </main>
  );
}
