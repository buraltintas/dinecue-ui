import { cn } from "@/lib/utils";

/**
 * The slogan is a brand object, not content: always lowercase, never italic,
 * and its full stop is sage — the counterpart to the amber stop on the
 * wordmark. Rendered through one component so the hero and the footer can
 * never drift apart again.
 *
 * The dictionary keeps the stop so metadata, the OG image and screen readers
 * read the line whole; only the rendered mark is split off.
 */
export function Slogan({ text, className, warming = false }: { text: string; className?: string; warming?: boolean }) {
  // `warming` is for the hero only: the axis settle plus the drifting sheen.
  // The footer prints the same slogan without the atmosphere.
  const stop = text.endsWith(".") ? "." : "";
  const body = stop ? text.slice(0, -1) : text;

  return (
    <span className={cn("font-display not-italic", warming && "slogan-alive", className)}>
      {body}
      {stop ? <span className="text-sage">{stop}</span> : null}
    </span>
  );
}
