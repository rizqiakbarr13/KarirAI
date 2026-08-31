import { Check, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Resume } from "@/types";

interface TemplateCardProps {
  template: Resume["template"];
  label: string;
  active: boolean;
  locked?: boolean;
  onSelect: () => void;
}

const PREVIEW_STYLES: Record<Resume["template"], string> = {
  minimalis: "bg-white",
  modern: "bg-gradient-to-r from-indigo/80 to-indigo/20",
  profesional: "bg-neutral-100",
};

export function TemplateCard({ template, label, active, locked, onSelect }: TemplateCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={locked}
      className={cn(
        "flex flex-col gap-2 rounded-card border p-2 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-60",
        active ? "border-indigo ring-2 ring-indigo/30" : "border-dark/10 hover:border-dark/25"
      )}
    >
      <div
        className={cn(
          "flex h-20 items-center justify-center rounded-control border border-dark/10",
          PREVIEW_STYLES[template]
        )}
      >
        {locked && <Lock className="h-4 w-4 text-dark/40" />}
      </div>
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-medium capitalize text-dark">{label}</span>
        {active && <Check className="h-3.5 w-3.5 text-indigo" />}
      </div>
    </button>
  );
}
