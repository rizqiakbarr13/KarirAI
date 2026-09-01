import type { Resume } from "@/types";

export interface CVTemplateMeta {
  id: Resume["template"];
  label: string;
  category: "ats" | "non-ats";
  description: string;
}

export const CV_TEMPLATES: CVTemplateMeta[] = [
  {
    id: "minimalis",
    label: "Minimalis",
    category: "ats",
    description:
      "Satu kolom, tanpa elemen grafis. Paling mudah dibaca sistem pelacak lamaran (ATS).",
  },
  {
    id: "profesional",
    label: "Profesional",
    category: "ats",
    description:
      "Format formal klasik dengan struktur jelas. Aman untuk sistem ATS.",
  },
  {
    id: "modern",
    label: "Modern",
    category: "non-ats",
    description:
      "Desain dua kolom dengan aksen warna. Tampil menarik untuk dikirim langsung ke recruiter, tapi sebagian sistem ATS bisa kesulitan membaca layout dua kolom.",
  },
];

export const CV_TEMPLATE_CATEGORIES: {
  value: "ats" | "non-ats";
  label: string;
  helperText: string;
}[] = [
  {
    value: "ats",
    label: "Template ATS-Friendly",
    helperText:
      "Cocok untuk upload ke portal lowongan kerja / job board yang memakai sistem pelacak lamaran otomatis (ATS).",
  },
  {
    value: "non-ats",
    label: "Template Non-ATS (Desain)",
    helperText:
      "Cocok untuk dikirim langsung ke recruiter via email atau dicetak — tampilan lebih menarik secara visual.",
  },
];

export function getTemplateMeta(id: Resume["template"]) {
  return CV_TEMPLATES.find((t) => t.id === id) ?? CV_TEMPLATES[0];
}
