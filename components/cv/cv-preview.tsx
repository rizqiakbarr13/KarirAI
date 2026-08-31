import type { CVData, Resume } from "@/types";
import { MinimalisTemplate } from "@/components/cv/templates/minimalis";
import { ModernTemplate } from "@/components/cv/templates/modern";
import { ProfesionalTemplate } from "@/components/cv/templates/profesional";

interface CVPreviewProps {
  data: CVData;
  template: Resume["template"];
}

export function CVPreview({ data, template }: CVPreviewProps) {
  switch (template) {
    case "modern":
      return <ModernTemplate data={data} />;
    case "profesional":
      return <ProfesionalTemplate data={data} />;
    case "minimalis":
    default:
      return <MinimalisTemplate data={data} />;
  }
}
