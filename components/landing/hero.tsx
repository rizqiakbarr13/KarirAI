import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 py-20 text-center sm:py-28">
      <span className="rounded-full bg-indigo/10 px-4 py-1 text-sm font-medium text-indigo">
        Dibuat khusus untuk pencari kerja Indonesia
      </span>
      <h1 className="text-4xl font-extrabold leading-tight text-dark sm:text-5xl">
        CV kamu layak dilirik, bukan cuma dilihat.
      </h1>
      <p className="max-w-2xl text-lg text-dark/70">
        Bangun CV yang lolos ATS, buat surat lamaran, dan latihan interview
        dengan bantuan AI — semua dalam satu platform.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href="/register">
          <Button variant="primary" size="lg" className="w-full sm:w-auto">
            Mulai Gratis
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <a href="#fitur">
          <Button variant="secondary" size="lg" className="w-full sm:w-auto">
            Lihat Fitur
          </Button>
        </a>
      </div>
    </section>
  );
}
