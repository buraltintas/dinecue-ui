"use client";

import { useQuery } from "@tanstack/react-query";
import { MapPin } from "lucide-react";
import { getSavedPlaces } from "@/lib/api/profile";
import { EmptyState } from "@/components/ui/empty-state";
import { useI18n } from "@/components/providers/i18n-provider";

export function SavedList() {
  const { t } = useI18n();
  const saved = useQuery({
    queryKey: ["saved-places"],
    queryFn: getSavedPlaces,
    staleTime: 0,
    refetchOnMount: "always"
  });

  if (saved.isLoading || saved.isFetching) return <div className="glass h-48 animate-pulse rounded-[2rem]" aria-label={t.saved.loading} />;

  if (saved.isError || !saved.data?.length) {
    return (
      <EmptyState
        title={t.saved.emptyTitle}
        description={t.saved.emptyBody}
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {saved.data.map((place) => (
        <article key={place.id} className="glass rounded-[1.5rem] p-5">
          <MapPin className="text-amber" size={22} aria-hidden />
          <h2 className="mt-4 text-xl font-semibold text-ivory">{place.name}</h2>
          <p className="mt-2 text-sm leading-6 text-muted">{place.address}</p>
          {place.note ? <p className="mt-4 rounded-2xl bg-ivory/7 p-3 text-sm text-ivory">{place.note}</p> : null}
        </article>
      ))}
    </div>
  );
}
