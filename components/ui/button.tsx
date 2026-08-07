import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: "min-h-9 gap-1.5 px-3.5 text-[0.8125rem]",
  md: "min-h-11 gap-2 px-5 text-sm",
  lg: "min-h-12 gap-2.5 px-6 text-[0.9375rem]"
} as const;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-pill font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0",
          sizes[size],
          variant === "primary" && "bg-amber text-graphite shadow-glow hover:-translate-y-0.5 hover:bg-amber-hi",
          variant === "secondary" && "border border-ivory/15 bg-ivory/[0.07] text-ivory hover:border-ivory/25 hover:bg-ivory/[0.12]",
          variant === "ghost" && "text-muted hover:bg-ivory/[0.07] hover:text-ivory",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
