import { Input } from "@/components/ui/input";
import type { CVData } from "@/types";

interface StepProps {
  data: CVData;
  onChange: (data: CVData) => void;
}

export function StepDataDiri({ data, onChange }: StepProps) {
  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Nama Lengkap"
        placeholder="cth. Rizqi Akbar"
        value={data.nama}
        onChange={(e) => onChange({ ...data, nama: e.target.value })}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          type="email"
          label="Email"
          placeholder="nama@email.com"
          value={data.email}
          onChange={(e) => onChange({ ...data, email: e.target.value })}
        />
        <Input
          label="Nomor Telepon"
          placeholder="08xxxxxxxxxx"
          value={data.telepon}
          onChange={(e) => onChange({ ...data, telepon: e.target.value })}
        />
      </div>
      <Input
        label="LinkedIn (opsional)"
        placeholder="linkedin.com/in/username"
        value={data.linkedin ?? ""}
        onChange={(e) => onChange({ ...data, linkedin: e.target.value })}
      />
    </div>
  );
}
