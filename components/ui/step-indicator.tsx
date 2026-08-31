import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (index: number) => void;
}

export function StepIndicator({ steps, currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <ol className="flex w-full items-center">
      {steps.map((step, index) => {
        const status =
          index < currentStep ? "complete" : index === currentStep ? "active" : "pending";

        return (
          <li key={step} className={cn("flex items-center", index < steps.length - 1 && "flex-1")}>
            <button
              type="button"
              onClick={() => onStepClick?.(index)}
              disabled={!onStepClick}
              className="flex flex-col items-center gap-1.5"
            >
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                  status === "complete" && "bg-indigo text-white",
                  status === "active" && "border-2 border-indigo text-indigo",
                  status === "pending" && "border-2 border-dark/15 text-dark/40"
                )}
              >
                {status === "complete" ? <Check className="h-4 w-4" /> : index + 1}
              </span>
              <span
                className={cn(
                  "hidden text-xs font-medium sm:block",
                  status === "pending" ? "text-dark/40" : "text-dark"
                )}
              >
                {step}
              </span>
            </button>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "mx-2 h-0.5 flex-1",
                  status === "complete" ? "bg-indigo" : "bg-dark/10"
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
