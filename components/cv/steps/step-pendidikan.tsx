import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import type { CVData } from "@/types";

interface StepProps {
  data: CVData;
  onChange: (data: CVData) => void;
}

const EMPTY_EDUCATION = { institusi: "", jurusan: "", tahun: "" };

export function StepPendidikan({ data, onChange }: StepProps) {
  const update = (index: number, field: keyof (typeof data.pendidikan)[number], value: string) => {
    const next = [...data.pendidikan];
    next[index] = { ...next[index], [field]: value };
    onChange({ ...data, pendidikan: next });
  };

  const add = () => {
    onChange({ ...data, pendidikan: [...data.pendidikan, { ...EMPTY_EDUCATION }] });
  };

  const remove = (index: number) => {
    onChange({ ...data, pendidikan: data.pendidikan.filter((_, i) => i !== index) });
  };

  return (
    <div className="flex flex-col gap-4">
      {data.pendidikan.map((edu, index) => (
        <Card key={index} padding="md" className="relative">
          <button
            type="button"
            onClick={() => remove(index)}
            className="absolute right-3 top-3 text-dark/40 hover:text-red-500"
            aria-label="Hapus pendidikan"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <div className="grid gap-4 pr-8 sm:grid-cols-2">
            <Input
              label="Institusi"
              value={edu.institusi}
              onChange={(e) => update(index, "institusi", e.target.value)}
            />
            <Input
              label="Jurusan"
              value={edu.jurusan}
              onChange={(e) => update(index, "jurusan", e.target.value)}
            />
          </div>
          <Input
            className="mt-4"
            label="Tahun"
            placeholder="cth. 2018 - 2022"
            value={edu.tahun}
            onChange={(e) => update(index, "tahun", e.target.value)}
          />
        </Card>
      ))}

      <Button type="button" variant="secondary" onClick={add} className="self-start">
        <Plus className="h-4 w-4" />
        Tambah Pendidikan
      </Button>
    </div>
  );
}
