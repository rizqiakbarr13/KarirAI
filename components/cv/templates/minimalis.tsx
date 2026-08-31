import type { CVData } from "@/types";

export function MinimalisTemplate({ data }: { data: CVData }) {
  return (
    <div className="mx-auto aspect-[1/1.414] w-full max-w-[720px] overflow-y-auto bg-white p-10 text-[13px] text-neutral-800 shadow-card">
      <header className="border-b border-neutral-300 pb-4">
        <h1 className="text-2xl font-bold text-neutral-900">
          {data.nama || "Nama Lengkap"}
        </h1>
        <p className="mt-1 text-neutral-500">
          {[data.email, data.telepon, data.linkedin].filter(Boolean).join(" · ")}
        </p>
      </header>

      {data.ringkasan && (
        <section className="mt-5">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Ringkasan
          </h2>
          <p className="mt-2 leading-relaxed">{data.ringkasan}</p>
        </section>
      )}

      {data.pengalaman.length > 0 && (
        <section className="mt-5">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Pengalaman Kerja
          </h2>
          <div className="mt-2 flex flex-col gap-3">
            {data.pengalaman.map((exp, i) => (
              <div key={i}>
                <div className="flex items-baseline justify-between">
                  <p className="font-semibold text-neutral-900">{exp.jabatan}</p>
                  <p className="text-xs text-neutral-500">{exp.periode}</p>
                </div>
                <p className="text-neutral-600">{exp.perusahaan}</p>
                <p className="mt-1 whitespace-pre-line leading-relaxed text-neutral-700">
                  {exp.deskripsi}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.pendidikan.length > 0 && (
        <section className="mt-5">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Pendidikan
          </h2>
          <div className="mt-2 flex flex-col gap-2">
            {data.pendidikan.map((edu, i) => (
              <div key={i} className="flex items-baseline justify-between">
                <div>
                  <p className="font-semibold text-neutral-900">{edu.institusi}</p>
                  <p className="text-neutral-600">{edu.jurusan}</p>
                </div>
                <p className="text-xs text-neutral-500">{edu.tahun}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.keahlian.length > 0 && (
        <section className="mt-5">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Keahlian
          </h2>
          <p className="mt-2 text-neutral-700">{data.keahlian.join(" · ")}</p>
        </section>
      )}

      {data.sertifikasi && data.sertifikasi.length > 0 && (
        <section className="mt-5">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Sertifikasi
          </h2>
          <p className="mt-2 text-neutral-700">{data.sertifikasi.join(" · ")}</p>
        </section>
      )}

      {data.bahasa && data.bahasa.length > 0 && (
        <section className="mt-5">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Bahasa
          </h2>
          <p className="mt-2 text-neutral-700">
            {data.bahasa.map((b) => `${b.nama} (${b.level})`).join(" · ")}
          </p>
        </section>
      )}
    </div>
  );
}
