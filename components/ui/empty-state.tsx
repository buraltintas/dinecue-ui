import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  action,
  className
}: {
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("glass rounded-[1.75rem] p-8 text-center", className)}>
      <div className="mx-auto mb-5 h-20 w-20 rounded-full plate-ring opacity-80" aria-hidden />
      <h2 className="font-display text-2xl text-ivory">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </section>
  );
}
