import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "free" | "pro" | "enterprise" | "neutral";

const variantStyles: Record<BadgeVariant, string> = {
  free: "bg-dark/10 text-dark",
  pro: "bg-indigo/10 text-indigo",
  enterprise: "bg-warm/20 text-warm",
  neutral: "bg-sand text-dark/70",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ className, variant = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
