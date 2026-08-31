import Link from "next/link";
import { FileText, Mail, MessagesSquare, ArrowRight } from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

const TOOLS = [
  {
    href: "/dashboard/cv-builder",
    icon: FileText,
    title: "CV Builder",
    description: "Buat atau edit CV dan dapatkan review dari AI.",
  },
  {
    href: "/dashboard/cover-letter",
    icon: Mail,
    title: "Surat Lamaran AI",
    description: "Generate surat lamaran untuk posisi tujuanmu.",
  },
  {
    href: "/dashboard/interview",
    icon: MessagesSquare,
    title: "Simulasi Interview",
    description: "Latihan interview dengan AI HRD virtual.",
  },
];

export function ToolCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {TOOLS.map((tool) => (
        <Link key={tool.href} href={tool.href}>
          <Card padding="lg" className="h-full transition-shadow hover:shadow-modal">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-control bg-indigo/10">
              <tool.icon className="h-5 w-5 text-indigo" />
            </div>
            <CardTitle className="text-base">{tool.title}</CardTitle>
            <CardDescription className="mt-1">{tool.description}</CardDescription>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-indigo">
              Buka <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Card>
        </Link>
      ))}
    </div>
  );
}
