import { Suspense } from "react";
import { FitCheckForm } from "@/components/fit-check/fit-check-form";

export default function FitCheckPage() {
  // The form reads an optional ?placeId, so it needs a Suspense boundary for useSearchParams.
  return (
    <Suspense fallback={null}>
      <FitCheckForm />
    </Suspense>
  );
}
