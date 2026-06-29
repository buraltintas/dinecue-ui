"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Bookmark, History, Home, LogOut, ScanLine, Search, Settings, Sparkles, Utensils } from "lucide-react";
import { getMe, logout } from "@/lib/api/auth";
import { updatePreferredLanguage } from "@/lib/api/profile";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/providers/i18n-provider";
import type { UserDto } from "@/lib/types";

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
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-graphite text-ivory">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-ivory/10 bg-black/25 px-5 py-6 backdrop-blur-xl lg:block">
        <Link href="/app/find" className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-amber/15 text-amber">
            <Sparkles size={20} aria-hidden />
          </span>
          <span className="font-display text-2xl">DineCue</span>
        </Link>
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
        <button onClick={signOut} className="absolute bottom-6 left-5 right-5 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-muted hover:bg-ivory/7 hover:text-ivory">
          <LogOut size={18} aria-hidden /> {t.common.signOut}
        </button>
      </aside>

      <main className="pb-24 lg:pl-72">
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
