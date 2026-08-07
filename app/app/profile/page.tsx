"use client";

import { ProfilePanel } from "@/components/app/profile-panel";
import { useI18n } from "@/components/providers/i18n-provider";

export default function ProfilePage() {
  const { t } = useI18n();

  return (
    <div>
      <p className="eyebrow text-copper">{t.profile.eyebrow}</p>
      <h1 className="mt-4 font-display text-display-2 text-ivory text-balance">{t.profile.title}</h1>
      <div className="mt-10">
        <ProfilePanel />
      </div>
    </div>
  );
}
