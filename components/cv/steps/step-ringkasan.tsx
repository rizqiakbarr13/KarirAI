import { Textarea } from "@/components/ui/input";
import type { CVData } from "@/types";

interface StepProps {
  data: CVData;
  onChange: (data: CVData) => void;
}

export function StepRingkasan({ data, onChange }: StepProps) {
  return (
    <Textarea
      label="Ringkasan Profil"
      placeholder="Ceritakan singkat tentang pengalaman dan kekuatan profesionalmu (2-4 kalimat)."
      helperText="Ringkasan yang baik menyoroti pengalaman, keahlian utama, dan tujuan kariermu."
      rows={6}
      value={data.ringkasan}
      onChange={(e) => onChange({ ...data, ringkasan: e.target.value })}
    />
  );
}
