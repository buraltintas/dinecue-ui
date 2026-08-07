import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Ground = "night" | "void" | "ember" | "charcoal";

const grounds: Record<Ground, string> = {
  night: "bg-night",
  void: "bg-void",
  ember: "bg-ember",
  charcoal: "bg-charcoal"
};

const rhythm = {
  sm: "py-section-sm",
  md: "py-section-md",
  lg: "py-section-lg"
} as const;

/**
 * A landing section with a real accessible name. `id` doubles as the anchor
 * target and as the base for the heading id that labels the region, so every
 * section is announced by its own <h2> rather than by position.
 */
export function Section({
  id,
  ground = "night",
  space = "md",
  className,
  children
}: {
  id: string;
  ground?: Ground;
  space?: keyof typeof rhythm;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn(grounds[ground], rhythm[space], className)}>
      {children}
    </section>
  );
}

/**
 * A course rule: the label sits at the head of a hairline that runs the width
 * of the column. This replaces the eyebrow-stacked-above-a-heading pattern —
 * repeating that on every section was the single most templated thing here.
 */
export function CourseRule({ label, className }: { label: string; className?: string }) {
  return (
    <p className={cn("course-rule font-mono text-[0.6875rem] lowercase tracking-[0.16em] text-faint", className)}>
      {label}
    </p>
  );
}

export function SectionTitle({
  id,
  children,
  className
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2 id={`${id}-title`} className={cn("font-display text-display-2 text-ivory text-balance", className)}>
      {children}
    </h2>
  );
}
