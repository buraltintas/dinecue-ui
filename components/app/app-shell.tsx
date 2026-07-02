"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Bookmark, History, Home, LogOut, Mail, ScanLine, Search, Settings, Utensils } from "lucide-react";
import { getMe, logout } from "@/lib/api/auth";
import { updatePreferredLanguage } from "@/lib/api/profile";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/providers/i18n-provider";
import type { UserDto } from "@/lib/types";
import { BrandLink } from "@/components/brand/brand-link";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";

const items = [
  { href: "/app", key: "home", icon: Home },
  { href: "/app/find", key: "find", icon: Search },
  { href: "/app/history", key: "history", icon: History },
  { href: "/app/saved", key: "saved", icon: Bookmark },
  { href: "/app/menu-scan", key: "menuScan", icon: ScanLine },
  { href: "/app/fit-check", key: "fitCheck", icon: Utensils },
  { href: "/app/profile", key: "profile", icon: Settings }
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { language, t, applyAuthenticatedLanguage, lastChangeSource } = useI18n();
  const me = useQuery({ queryKey: ["me"], queryFn: getMe, retry: false });
  const languageMutation = useMutation({
    mutationFn: updatePreferredLanguage,
    onSuccess: (profile) => {
      queryClient.setQueryData<UserDto | undefined>(["me"], (current) =>
        current ? { ...current, preferredLanguage: profile.preferredLanguage } : current
      );
      queryClient.setQueryData(["profile"], profile);
    }
  });
  const persistLanguage = languageMutation.mutate;
  const isPersistingLanguage = languageMutation.isPending;

  useEffect(() => {
    if (me.data?.preferredLanguage && lastChangeSource !== "manual") {
      applyAuthenticatedLanguage(me.data.preferredLanguage);
    }
  }, [applyAuthenticatedLanguage, lastChangeSource, me.data?.preferredLanguage]);

  useEffect(() => {
    if (!me.data || lastChangeSource !== "manual" || language === me.data.preferredLanguage || isPersistingLanguage) {
      return;
    }
    persistLanguage(language);
  }, [isPersistingLanguage, language, lastChangeSource, me.data, persistLanguage]);

  useEffect(() => {
    if (me.isError) router.push("/login");
  }, [me.isError, router]);

  async function signOut() {
    await logout().catch(() => null);
    queryClient.clear();
    router.replace("/");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-graphite text-ivory">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-ivory/10 bg-black/25 px-5 py-6 backdrop-blur-xl lg:block">
        <BrandLink href="/app/find" iconSize={38} />
        <nav className="mt-10 space-y-1" aria-label={t.common.appNavigation}>
          {items.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition",
                  active ? "bg-amber/15 text-ivory" : "text-muted hover:bg-ivory/7 hover:text-ivory"
                )}
              >
                <Icon size={18} aria-hidden /> {t.nav[item.key]}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-6 left-5 right-5 space-y-3">
          {me.data?.email ? (
            <div className="rounded-2xl border border-ivory/10 bg-ivory/5 px-4 py-3">
              <p className="text-xs text-muted">{t.common.signedInAs}</p>
              <p className="mt-1 truncate text-sm font-semibold text-ivory">{me.data.email}</p>
            </div>
          ) : null}
          <LanguageSwitcher compact />
          <button onClick={signOut} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-muted hover:bg-ivory/7 hover:text-ivory">
            <LogOut size={18} aria-hidden /> {t.common.signOut}
          </button>
        </div>
      </aside>

      <main className="pb-24 lg:pl-72">
        <div className="sticky top-0 z-20 border-b border-ivory/10 bg-graphite/82 px-5 py-4 backdrop-blur-xl lg:hidden">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center justify-between gap-4">
              <BrandLink href="/app/find" iconSize={32} />
              <div className="flex min-w-0 items-center gap-3">
                {me.data?.email ? (
                  <div className="hidden min-w-0 items-center gap-2 rounded-full border border-ivory/10 bg-ivory/5 px-3 py-2 text-xs text-muted sm:flex">
                    <Mail size={14} className="shrink-0 text-amber" aria-hidden />
                    <span className="max-w-[13rem] truncate text-ivory">{me.data.email}</span>
                  </div>
                ) : null}
                <LanguageSwitcher compact />
              </div>
            </div>
            {me.data?.email ? (
              <p className="mt-3 flex min-w-0 items-center gap-2 text-xs text-muted sm:hidden">
                <Mail size={13} className="shrink-0 text-amber" aria-hidden />
                <span className="shrink-0">{t.common.signedInAs}</span>
                <span className="truncate text-ivory">{me.data.email}</span>
              </p>
            ) : null}
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8 lg:py-10">{children}</div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-ivory/10 bg-black/70 px-2 py-2 backdrop-blur-xl lg:hidden" aria-label={t.common.mobileNavigation}>
        <div className="mx-auto grid max-w-lg grid-cols-5 gap-1">
          {items.slice(0, 5).map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className={cn("grid place-items-center rounded-2xl py-2 text-xs", active ? "text-amber" : "text-muted")}>
                <Icon size={20} aria-hidden />
                <span className="mt-1 max-w-16 truncate">{t.nav[item.key]}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
