import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[100px] w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm ring-offset-white transition placeholder:text-stone-400 focus-ring disabled:cursor-not-allowed disabled:opacity-50",
        "focus:invalid:border-red-500 focus:invalid:ring-red-500/20 focus:valid:border-brand-500 focus:valid:ring-brand-500/20",
        className
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";
export { Textarea };
