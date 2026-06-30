"use client";

import { ProfilePanel } from "@/components/app/profile-panel";
import { useI18n } from "@/components/providers/i18n-provider";

export default function ProfilePage() {
  const { t } = useI18n();

  return (
    <div>
      <p className="text-sm tracking-[0.26em] text-amber">{t.profile.eyebrow}</p>
      <h1 className="mt-3 font-display text-4xl text-ivory sm:text-5xl">{t.profile.title}</h1>
      <div className="mt-8">
        <ProfilePanel />
      </div>
    </div>
  );
}
