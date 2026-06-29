import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = "primary", ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-55",
        variant === "primary" && "bg-amber text-graphite shadow-glow hover:-translate-y-0.5 hover:bg-[#ffd18a]",
        variant === "secondary" && "border border-ivory/15 bg-ivory/8 text-ivory hover:bg-ivory/13",
        variant === "ghost" && "text-muted hover:bg-ivory/8 hover:text-ivory",
        className
      )}
      {...props}
    />
  );
});
Button.displayName = "Button";
