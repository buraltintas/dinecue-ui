import { cn } from "@/lib/utils";

/**
 * The waiting state, in the page's own language: a leader line being set.
 * A dotted run with a solid segment travelling along it, the way a menu line is
 * typeset before the figure lands. Used wherever we are still resolving
 * something and must not guess at the answer — a spinner would belong to a
 * different product.
 *
 * The animation and the reduced-motion fallback (which swaps the line for the
 * label itself) live in app/globals.css beside the other menu devices.
 */
export function LeaderLoader({ label, className }: { label: string; className?: string }) {
  return (
    <span role="status" aria-live="polite" className={cn("leader-setting", className)}>
      <span className="leader-setting-track" aria-hidden>
        <span className="leader-setting-mark" />
      </span>
      <span className="leader-setting-label">{label}</span>
    </span>
  );
}
