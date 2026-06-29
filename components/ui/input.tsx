import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "min-h-12 w-full rounded-2xl border border-ivory/12 bg-black/20 px-4 text-ivory placeholder:text-muted/60 transition focus:border-amber/70 focus:bg-black/30",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "min-h-36 w-full resize-none rounded-[1.35rem] border border-ivory/12 bg-black/20 px-4 py-4 text-ivory placeholder:text-muted/60 transition focus:border-amber/70 focus:bg-black/30",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
