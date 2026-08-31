import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { PRICING } from "@/lib/constants";

const FREE_FEATURES = [
  "1x review CV dengan AI / bulan",
  "2x surat lamaran AI / bulan",
  "1x simulasi interview / bulan",
  "1 CV tersimpan",
  "Template Minimalis",
];

const PRO_FEATURES = [
  "Review CV AI tanpa batas",
  "Surat lamaran AI tanpa batas",
  "10x simulasi interview / bulan",
  "CV tersimpan tanpa batas",
  "Semua template (Minimalis, Modern, Profesional)",
];

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function Pricing() {
  return (
    <section id="harga" className="mx-auto max-w-6xl px-6 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-dark">
          Pilih paket yang sesuai kebutuhanmu
        </h2>
        <p className="mt-3 text-dark/60">
          Mulai gratis, upgrade kapan saja saat kamu butuh lebih.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-3xl gap-6 sm:grid-cols-2">
        <Card padding="lg">
          <CardTitle>Free</CardTitle>
          <p className="mt-2 text-3xl font-extrabold text-dark">Rp 0</p>
          <CardDescription className="mt-1">Selamanya gratis</CardDescription>
          <ul className="mt-6 flex flex-col gap-3">
            {FREE_FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm text-dark/70">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo" />
                {feature}
              </li>
            ))}
          </ul>
          <Link href="/register" className="mt-8 block">
            <Button variant="secondary" className="w-full">
              Mulai Gratis
            </Button>
          </Link>
        </Card>

        <Card padding="lg" className="border-indigo/40 ring-2 ring-indigo/20">
          <span className="inline-flex w-fit items-center rounded-full bg-warm/20 px-2.5 py-0.5 text-xs font-medium text-warm">
            Paling Populer
          </span>
          <CardTitle className="mt-2">Pro</CardTitle>
          <p className="mt-2 text-3xl font-extrabold text-dark">
            {formatRupiah(PRICING.pro_monthly)}
            <span className="text-base font-normal text-dark/50">/bulan</span>
          </p>
          <CardDescription className="mt-1">
            atau {formatRupiah(PRICING.pro_yearly)}/tahun
          </CardDescription>
          <ul className="mt-6 flex flex-col gap-3">
            {PRO_FEATURES.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm text-dark/70">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo" />
                {feature}
              </li>
            ))}
          </ul>
          <Link href="/register" className="mt-8 block">
            <Button variant="primary" className="w-full">
              Upgrade ke Pro
            </Button>
          </Link>
        </Card>
      </div>
    </section>
  );
}
