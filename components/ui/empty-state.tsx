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
    <section className={cn("glass rounded-panel p-8 text-center sm:p-10", className)}>
      <div className="plate-ring mx-auto mb-6 h-20 w-20 opacity-80" aria-hidden />
      <h2 className="font-display text-display-3 text-ivory text-balance">{title}</h2>
      <p className="mx-auto mt-3 max-w-measure text-sm leading-7 text-muted text-pretty">{description}</p>
      {action ? <div className="mt-7">{action}</div> : null}
    </section>
  );
}
