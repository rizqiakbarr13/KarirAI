import { FileText, Mail, MessagesSquare } from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

const FEATURES = [
  {
    icon: FileText,
    title: "CV Builder",
    description:
      "Buat CV profesional dengan template siap pakai, lalu dapatkan skor ATS dari AI beserta saran perbaikannya.",
  },
  {
    icon: Mail,
    title: "Surat Lamaran AI",
    description:
      "Generate surat lamaran yang relevan dengan posisi dan perusahaan tujuan dalam hitungan detik.",
  },
  {
    icon: MessagesSquare,
    title: "Simulasi Interview",
    description:
      "Latihan interview dengan AI HRD virtual dan dapatkan feedback skor, kelebihan, serta area yang perlu ditingkatkan.",
  },
];

export function Features() {
  return (
    <section id="fitur" className="mx-auto max-w-6xl px-6 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-dark">
          Semua yang kamu butuhkan untuk melamar kerja
        </h2>
        <p className="mt-3 text-dark/60">
          Tiga tool utama untuk membantu perjalanan karier kamu, didukung AI.
        </p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => (
          <Card key={feature.title} padding="lg">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-control bg-indigo/10">
              <feature.icon className="h-5 w-5 text-indigo" />
            </div>
            <CardTitle>{feature.title}</CardTitle>
            <CardDescription className="mt-2">
              {feature.description}
            </CardDescription>
          </Card>
        ))}
      </div>
    </section>
  );
}
