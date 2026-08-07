"use client";

import { FormEvent, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Camera, ImagePlus, Loader2, X } from "lucide-react";
import { createMenuScan, uploadMenuImage } from "@/lib/api/menu-scans";
import { ApiClientError } from "@/lib/api/http";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/providers/i18n-provider";
import { MomentFields, emptyMoment, toContextPayload, type MomentFieldsValue } from "@/components/shared/moment-fields";
import type { MenuImageUpload } from "@/lib/types";

// Menus run across several pages, but each extra photo costs real vision tokens and dilutes accuracy.
// Kept in step with the BFF and the backend's Storage:MaxImagesPerScan.
const maxPhotos = 3;

type Photo = {
  id: string;
  previewUrl: string;
  upload?: MenuImageUpload;
  error?: string;
};

export function MenuScanForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language, t } = useI18n();
  // Set when the diner arrives from a recommendation card or a saved place, which lets the report
  // lean on what we already know about the restaurant. Never required.
  const restaurantPlaceId = searchParams.get("placeId");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [moment, setMoment] = useState<MomentFieldsValue>(emptyMoment);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const cameraInput = useRef<HTMLInputElement>(null);
  const libraryInput = useRef<HTMLInputElement>(null);

  const uploading = photos.some((photo) => !photo.upload && !photo.error);
  const ready = photos.filter((photo) => photo.upload).length > 0;

  async function addFiles(files: FileList | null) {
    if (!files?.length) return;
    setError("");
    const room = maxPhotos - photos.length;
    if (room <= 0) {
      setError(t.menuScan.maxPhotos);
      return;
    }

    const accepted = Array.from(files).slice(0, room);
    const pending: Photo[] = accepted.map((file) => ({
      id: `${file.name}-${file.size}-${crypto.randomUUID()}`,
      previewUrl: URL.createObjectURL(file)
    }));
    setPhotos((current) => [...current, ...pending]);

    // Uploads run one at a time so a slow connection shows steady progress instead of stalling on all of them.
    for (let index = 0; index < accepted.length; index += 1) {
      const photo = pending[index];
      try {
        const upload = await uploadMenuImage(accepted[index]);
        setPhotos((current) => current.map((item) => (item.id === photo.id ? { ...item, upload } : item)));
      } catch (caught) {
        setPhotos((current) =>
          current.map((item) => (item.id === photo.id ? { ...item, error: uploadErrorMessage(caught) } : item))
        );
      }
    }
  }

  function uploadErrorMessage(caught: unknown) {
    if (caught instanceof ApiClientError && caught.code === "image_too_large") return t.menuScan.photoTooLarge;
    if (caught instanceof ApiClientError && caught.code === "unsupported_image_type") return t.menuScan.photoUnsupported;
    if (caught instanceof ApiClientError && caught.status === 401) return t.errors.signInAgain;
    return t.menuScan.photoFailed;
  }

  function removePhoto(id: string) {
    setPhotos((current) => {
      const removed = current.find((photo) => photo.id === id);
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return current.filter((photo) => photo.id !== id);
    });
    setError("");
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const uploaded = photos.filter((photo) => photo.upload);
    if (uploaded.length === 0) {
      setError(t.menuScan.needPhoto);
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const response = await createMenuScan({
        imageObjectNames: uploaded.map((photo) => photo.upload!.objectName),
        rawText: moment.rawText.trim() || null,
        selectedCues: moment.selectedCues,
        restaurantPlaceId,
        language,
        context: toContextPayload(moment)
      });
      router.push(`/app/menu-scan/${response.menuScanId}`);
    } catch (caught) {
      if (caught instanceof ApiClientError && caught.status === 401) setError(t.errors.signInAgain);
      else if (caught instanceof ApiClientError && caught.code === "quota_exceeded") {
        setError(`${t.errors.quotaExceeded} ${t.errors.proComingSoon}`);
      } else setError(t.menuScan.startError);
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="glass rounded-panel p-5 sm:p-7">
      <p className="eyebrow text-copper">{t.menuScan.eyebrow}</p>
      <h1 className="mt-4 font-display text-display-2 text-ivory text-balance">{t.menuScan.title}</h1>
      <p className="mt-4 max-w-measure leading-7 text-muted text-pretty">{t.menuScan.body}</p>

      <section className="mt-8" aria-label={t.menuScan.photosLabel}>
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-sm text-muted">{t.menuScan.photosLabel}</span>
          <span className="font-mono text-xs text-faint">
            {photos.length}/{maxPhotos}
          </span>
        </div>

        {photos.length > 0 ? (
          <ul className="mt-3 grid grid-cols-3 gap-3">
            {photos.map((photo) => (
              <li key={photo.id} className="relative overflow-hidden rounded-card border border-ivory/10 bg-black/25">
                {/* Local object URL, so no next/image optimizer round trip and no remote host to allow. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.previewUrl} alt="" className="aspect-[3/4] w-full object-cover" />
                {!photo.upload && !photo.error ? (
                  <span className="absolute inset-0 grid place-items-center bg-void/60">
                    <Loader2 className="animate-spin text-amber" size={20} aria-hidden />
                    <span className="sr-only">{t.common.working}</span>
                  </span>
                ) : null}
                {photo.error ? (
                  <span className="absolute inset-x-0 bottom-0 bg-wine/85 px-2 py-1 text-[0.6875rem] leading-4 text-ivory">
                    {photo.error}
                  </span>
                ) : null}
                <button
                  type="button"
                  onClick={() => removePhoto(photo.id)}
                  aria-label={t.menuScan.removePhoto}
                  className="absolute right-1.5 top-1.5 grid h-8 w-8 place-items-center rounded-pill bg-void/80 text-ivory transition hover:bg-void"
                >
                  <X size={15} aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            disabled={photos.length >= maxPhotos}
            onClick={() => cameraInput.current?.click()}
          >
            <Camera size={17} aria-hidden />
            {t.menuScan.takePhoto}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="lg"
            disabled={photos.length >= maxPhotos}
            onClick={() => libraryInput.current?.click()}
          >
            <ImagePlus size={17} aria-hidden />
            {t.menuScan.choosePhoto}
          </Button>
        </div>
        <p className="mt-3 text-xs leading-6 text-faint">{t.menuScan.photosHint}</p>

        {/* `capture` opens the native camera directly. No getUserMedia, so no live preview to manage. */}
        <input
          ref={cameraInput}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          capture="environment"
          className="sr-only"
          onChange={(event) => {
            void addFiles(event.target.files);
            event.target.value = "";
          }}
        />
        <input
          ref={libraryInput}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="sr-only"
          onChange={(event) => {
            void addFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </section>

      <MomentFields
        value={moment}
        onChange={setMoment}
        noteLabel={t.menuScan.noteLabel}
        notePlaceholder={t.menuScan.notePlaceholder}
      />

      {error ? (
        <p className="mt-5 rounded-card border border-wine/40 bg-wine/20 px-4 py-3 text-sm" role="alert">
          {error}
        </p>
      ) : null}

      <Button className="mt-7 w-full sm:w-auto" size="lg" disabled={submitting || uploading || !ready}>
        {submitting ? t.common.preparing : uploading ? t.menuScan.uploading : t.menuScan.submit}
      </Button>
    </form>
  );
}
