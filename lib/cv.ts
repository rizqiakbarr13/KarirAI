import type { CVData } from "@/types";

export function emptyCVData(): CVData {
  return {
    nama: "",
    email: "",
    telepon: "",
    linkedin: "",
    ringkasan: "",
    pengalaman: [],
    pendidikan: [],
    keahlian: [],
    sertifikasi: [],
    bahasa: [],
  };
}

export function normalizeCVData(data: Partial<CVData> | null | undefined): CVData {
  const empty = emptyCVData();
  return {
    ...empty,
    ...data,
    pengalaman: data?.pengalaman ?? empty.pengalaman,
    pendidikan: data?.pendidikan ?? empty.pendidikan,
    keahlian: data?.keahlian ?? empty.keahlian,
    sertifikasi: data?.sertifikasi ?? empty.sertifikasi,
    bahasa: data?.bahasa ?? empty.bahasa,
  };
}
