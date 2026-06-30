import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function BrandLink({
  className,
  href = "/",
  iconSize = 34,
  iconTone = "gold"
}: {
  className?: string;
  href?: "/" | "/app/find";
  iconSize?: number;
  iconTone?: "gold" | "white";
}) {
  const iconSrc = iconTone === "white" ? "/brand/dinecue-mark-white.svg" : "/brand/dinecue-app-icon-transparent.png";

  return (
    <Link href={href} className={cn("inline-flex items-center gap-3 text-ivory", className)} aria-label="DineCue home">
      <Image
        src={iconSrc}
        width={iconSize}
        height={iconSize}
        alt=""
        aria-hidden
        priority
      />
      <span className="text-2xl font-black leading-none tracking-[-0.04em]" style={{ fontFamily: "var(--font-sans)" }}>
        dinecue
      </span>
    </Link>
  );
}
