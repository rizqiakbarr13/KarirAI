import { KeyboardEvent, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CVData } from "@/types";

interface StepProps {
  data: CVData;
  onChange: (data: CVData) => void;
}

function TagInput({
  label,
  placeholder,
  values,
  onChangeValues,
}: {
  label: string;
  placeholder: string;
  values: string[];
  onChangeValues: (values: string[]) => void;
}) {
  const [input, setInput] = useState("");

  const addTag = () => {
    const value = input.trim();
    if (value && !values.includes(value)) {
      onChangeValues([...values, value]);
    }
    setInput("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Input
        label={label}
        placeholder={placeholder}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        helperText="Tekan Enter atau koma untuk menambahkan."
      />
      {values.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {values.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-indigo/10 px-3 py-1 text-xs font-medium text-indigo"
            >
              {tag}
              <button
                type="button"
                onClick={() => onChangeValues(values.filter((v) => v !== tag))}
                aria-label={`Hapus ${tag}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function StepKeahlian({ data, onChange }: StepProps) {
  const bahasa = data.bahasa ?? [];

  const updateBahasa = (index: number, field: "nama" | "level", value: string) => {
    const next = [...bahasa];
    next[index] = { ...next[index], [field]: value };
    onChange({ ...data, bahasa: next });
  };

  const addBahasa = () => {
    onChange({ ...data, bahasa: [...bahasa, { nama: "", level: "" }] });
  };

  const removeBahasa = (index: number) => {
    onChange({ ...data, bahasa: bahasa.filter((_, i) => i !== index) });
  };

  return (
    <div className="flex flex-col gap-6">
      <TagInput
        label="Keahlian"
        placeholder="cth. Project Management"
        values={data.keahlian}
        onChangeValues={(values) => onChange({ ...data, keahlian: values })}
      />

      <TagInput
        label="Sertifikasi (opsional)"
        placeholder="cth. Google Data Analytics"
        values={data.sertifikasi ?? []}
        onChangeValues={(values) => onChange({ ...data, sertifikasi: values })}
      />

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-dark">Bahasa (opsional)</p>
        {bahasa.map((b, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              placeholder="Bahasa (cth. Inggris)"
              value={b.nama}
              onChange={(e) => updateBahasa(index, "nama", e.target.value)}
              className="flex-1"
            />
            <Input
              placeholder="Level (cth. Aktif)"
              value={b.level}
              onChange={(e) => updateBahasa(index, "level", e.target.value)}
              className="flex-1"
            />
            <button
              type="button"
              onClick={() => removeBahasa(index)}
              className="text-dark/40 hover:text-red-500"
              aria-label="Hapus bahasa"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <Button type="button" variant="secondary" size="sm" onClick={addBahasa} className="self-start">
          <Plus className="h-4 w-4" />
          Tambah Bahasa
        </Button>
      </div>
    </div>
  );
}
