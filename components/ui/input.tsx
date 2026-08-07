import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

// 16px minimum keeps iOS Safari from zooming the viewport on focus.
const field =
  "w-full rounded-card border border-ivory/12 bg-black/25 text-base text-ivory placeholder:text-faint transition focus:border-amber/70 focus:bg-black/35";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn(field, "min-h-12 px-4", className)} {...props} />
));
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn(field, "min-h-36 resize-none px-4 py-4 leading-7", className)} {...props} />
  )
);
Textarea.displayName = "Textarea";
