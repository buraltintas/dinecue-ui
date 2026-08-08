"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Bookmark, History, Home, LogOut, ScanLine, Search, Settings, Utensils } from "lucide-react";
import { getMe } from "@/lib/api/auth";
import { updatePreferredLanguage } from "@/lib/api/profile";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/providers/i18n-provider";
import type { UserDto } from "@/lib/types";
import { BrandLink } from "@/components/brand/brand-link";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { useSessionHint } from "@/components/providers/session-hint-provider";
import { useSignOut } from "@/components/providers/use-sign-out";

// `soon` marks features the backend does not serve yet, so the navigation
// never implies they are usable.
const items = [
  { href: "/app", key: "home", icon: Home, soon: false },
  { href: "/app/find", key: "find", icon: Search, soon: false },
  { href: "/app/history", key: "history", icon: History, soon: false },
  { href: "/app/saved", key: "saved", icon: Bookmark, soon: false },
  { href: "/app/menu-scan", key: "menuScan", icon: ScanLine, soon: false },
  { href: "/app/fit-check", key: "fitCheck", icon: Utensils, soon: false },
  { href: "/app/profile", key: "profile", icon: Settings, soon: false }
] as const;

// The five that belong in a thumb-reach bar: home, the three things a diner actually does, and history.
// Saved and profile stay in the sidebar and on the app home, which both list everything.
const mobileItems = ["/app", "/app/find", "/app/menu-scan", "/app/fit-check", "/app/history"] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { language, t, applyAuthenticatedLanguage, lastChangeSource } = useI18n();
  const { hasAuthSessionHint, setAuthSessionHint } = useSessionHint();
  const { signOut } = useSignOut();
  const me = useQuery({ queryKey: ["me"], queryFn: getMe, retry: false, enabled: hasAuthSessionHint });
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

  useEffect(() => {
    if (me.isError) setAuthSessionHint(false);
  }, [me.isError, setAuthSessionHint]);


  return (
    <div className="min-h-[100dvh] bg-night text-ivory">
      {/* Tablets get a collapsed icon rail; only lg and up have room for labels. */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-20 flex-col border-r border-ivory/10 bg-void/60 px-3 py-6 backdrop-blur-xl md:flex lg:w-72 lg:px-5">
        <div className="flex justify-center lg:justify-start">
          <BrandLink href="/app/find" size="sm" className="lg:text-[1.6rem]" />
        </div>

        <nav className="mt-10 space-y-1" aria-label={t.common.appNavigation}>
          {items.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            const label = t.nav[item.key];
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                title={item.soon ? `${label} — ${t.common.comingSoon}` : label}
                className={cn(
                  "relative flex min-h-11 items-center gap-3 rounded-card px-3 py-2.5 text-sm transition lg:px-4",
                  active ? "bg-ivory/[0.06] text-ivory" : "text-muted hover:bg-ivory/[0.04] hover:text-ivory"
                )}
              >
                {active ? (
                  <span className="absolute inset-y-2 left-0 w-0.5 rounded-pill bg-amber lg:-left-1" aria-hidden />
                ) : null}
                <Icon size={19} className={cn("mx-auto shrink-0 lg:mx-0", active && "text-amber")} aria-hidden />
                <span className="hidden lg:inline">{label}</span>
                {item.soon ? (
                  <span className="ml-auto hidden rounded-pill border border-ivory/12 px-2 py-0.5 font-mono text-[0.625rem] text-faint lg:inline">
                    {t.common.comingSoon}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-3">
          {me.data?.email ? (
            <div className="hidden rounded-card border border-ivory/10 bg-ivory/[0.04] px-4 py-3 lg:block">
              <p className="eyebrow text-faint">{t.common.signedInAs}</p>
              <p className="mt-2 truncate text-sm font-semibold text-ivory">{me.data.email}</p>
            </div>
          ) : null}
          <div className="hidden lg:block">
            <LanguageSwitcher compact align="up" />
          </div>
          <button
            onClick={signOut}
            title={t.common.signOut}
            className="flex min-h-11 w-full items-center gap-3 rounded-card px-3 py-2.5 text-sm text-muted transition hover:bg-ivory/[0.04] hover:text-ivory lg:px-4"
          >
            <LogOut size={19} className="mx-auto shrink-0 lg:mx-0" aria-hidden />
            <span className="hidden lg:inline">{t.common.signOut}</span>
          </button>
        </div>
      </aside>

      <main className="pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-0 md:pl-20 lg:pl-72">
        <div className="sticky top-0 z-20 border-b border-ivory/10 bg-night/95 pt-safe-top backdrop-blur-xl md:hidden">
          <div className="container-page flex h-16 items-center justify-between gap-4">
            <BrandLink href="/app/find" size="sm" />
            <div className="flex min-w-0 items-center gap-3">
              {me.data?.email ? (
                <span className="hidden max-w-[12rem] truncate font-mono text-xs text-faint sm:inline">{me.data.email}</span>
              ) : null}
              <LanguageSwitcher compact />
              <Link
                href="/app/profile"
                aria-label={t.nav.profile}
                aria-current={pathname === "/app/profile" ? "page" : undefined}
                className={cn(
                  "grid min-h-11 min-w-11 place-items-center rounded-pill border border-ivory/12 bg-black/25 transition hover:border-ivory/25 hover:bg-ivory/[0.08]",
                  pathname === "/app/profile" ? "text-amber" : "text-muted"
                )}
              >
                <Settings size={18} aria-hidden />
              </Link>
            </div>
          </div>
        </div>

        <div className="container-page py-8 lg:py-12">{children}</div>
      </main>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-ivory/10 bg-void/95 pb-safe backdrop-blur-xl md:hidden"
        aria-label={t.common.mobileNavigation}
      >
        <div className="mx-auto grid max-w-lg grid-cols-5 gap-1 px-2 py-1.5">
          {mobileItems.map((href) => items.find((item) => item.href === href)!).map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "grid min-h-[3.25rem] place-items-center rounded-card px-1 py-1.5 text-[0.6875rem] transition",
                  active ? "text-amber" : "text-muted"
                )}
              >
                <Icon size={21} aria-hidden />
                <span className="mt-1 w-full truncate text-center">{t.nav[item.key]}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
