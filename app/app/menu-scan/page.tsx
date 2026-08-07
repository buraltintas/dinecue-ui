import { Suspense } from "react";
import { MenuScanForm } from "@/components/menu-scan/menu-scan-form";

export default function MenuScanPage() {
  // The form reads an optional ?placeId, so it needs a Suspense boundary for useSearchParams.
  return (
    <Suspense fallback={null}>
      <MenuScanForm />
    </Suspense>
  );
}
