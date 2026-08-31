import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import type { CVData } from "@/types";

interface StepProps {
  data: CVData;
  onChange: (data: CVData) => void;
}

const EMPTY_EXPERIENCE = { jabatan: "", perusahaan: "", periode: "", deskripsi: "" };

export function StepPengalaman({ data, onChange }: StepProps) {
  const update = (index: number, field: keyof (typeof data.pengalaman)[number], value: string) => {
    const next = [...data.pengalaman];
    next[index] = { ...next[index], [field]: value };
    onChange({ ...data, pengalaman: next });
  };

  const add = () => {
    onChange({ ...data, pengalaman: [...data.pengalaman, { ...EMPTY_EXPERIENCE }] });
  };

  const remove = (index: number) => {
    onChange({ ...data, pengalaman: data.pengalaman.filter((_, i) => i !== index) });
  };

  return (
    <div className="flex flex-col gap-4">
      {data.pengalaman.map((exp, index) => (
        <Card key={index} padding="md" className="relative">
          <button
            type="button"
            onClick={() => remove(index)}
            className="absolute right-3 top-3 text-dark/40 hover:text-red-500"
            aria-label="Hapus pengalaman"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <div className="grid gap-4 pr-8 sm:grid-cols-2">
            <Input
              label="Jabatan"
              value={exp.jabatan}
              onChange={(e) => update(index, "jabatan", e.target.value)}
            />
            <Input
              label="Perusahaan"
              value={exp.perusahaan}
              onChange={(e) => update(index, "perusahaan", e.target.value)}
            />
          </div>
          <Input
            className="mt-4"
            label="Periode"
            placeholder="cth. Jan 2022 - Sekarang"
            value={exp.periode}
            onChange={(e) => update(index, "periode", e.target.value)}
          />
          <Textarea
            className="mt-4"
            label="Deskripsi Tugas & Pencapaian"
            rows={4}
            value={exp.deskripsi}
            onChange={(e) => update(index, "deskripsi", e.target.value)}
          />
        </Card>
      ))}

      <Button type="button" variant="secondary" onClick={add} className="self-start">
        <Plus className="h-4 w-4" />
        Tambah Pengalaman
      </Button>
    </div>
  );
}
