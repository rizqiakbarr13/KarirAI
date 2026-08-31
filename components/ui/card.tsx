import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type CardPadding = "none" | "sm" | "md" | "lg";

const paddingStyles: Record<CardPadding, string> = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: CardPadding;
}

export function Card({ className, padding = "md", ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-dark/10 bg-white shadow-card",
        paddingStyles[padding],
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mb-4 flex flex-col gap-1", className)}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-lg font-semibold text-dark", className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-dark/60", className)} {...props} />;
}
