import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The wordmark ends in a full stop, echoing the declarative voice of the
 * product ("eat by mood."). The stop is the only amber in the header.
 */
export function BrandLink({
  className,
  href = "/",
  size = "md"
}: {
  className?: string;
  href?: "/" | "/app/find";
  size?: "sm" | "md";
}) {
  return (
    <Link
      href={href}
      aria-label="dinecue"
      className={cn(
        "inline-flex items-baseline font-display font-semibold leading-none tracking-[-0.03em] text-ivory transition hover:text-amber-hi",
        size === "sm" ? "text-xl" : "text-[1.6rem]",
        className
      )}
    >
      dinecue<span className="text-amber">.</span>
    </Link>
  );
}
